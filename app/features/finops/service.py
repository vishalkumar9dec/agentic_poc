"""
Service layer for FinOps cost management.
"""
from datetime import datetime, date, timedelta
from typing import List, Dict, Optional, Any
from collections import defaultdict
from sqlalchemy import func

from database.db_operations import DbOperations
from features.constants import DATABASE_URL
from .schema import CloudCostModel
from .models import (
    CloudCost, CloudCostQuery, CostAggregation, CostSummary,
    CostDataResponse, TopItem, DatePreset, Granularity
)
from .data_generator import generate_cost_data, get_all_providers, get_services_by_provider


# Initialize database operations
finops_db = DbOperations(CloudCostModel, DATABASE_URL)


def get_date_range_from_preset(preset: DatePreset) -> tuple[date, date]:
    """
    Convert date preset to actual start and end dates.

    Args:
        preset: Date preset enum value

    Returns:
        Tuple of (start_date, end_date)
    """
    today = datetime.now().date()

    if preset == DatePreset.THIS_WEEK:
        # Monday of current week
        start = today - timedelta(days=today.weekday())
        end = today
    elif preset == DatePreset.LAST_WEEK:
        # Previous Monday to Sunday
        start = today - timedelta(days=today.weekday() + 7)
        end = start + timedelta(days=6)
    elif preset == DatePreset.THIS_MONTH:
        # First day of current month
        start = today.replace(day=1)
        end = today
    elif preset == DatePreset.LAST_MONTH:
        # First day of last month to last day of last month
        first_of_this_month = today.replace(day=1)
        end = first_of_this_month - timedelta(days=1)
        start = end.replace(day=1)
    elif preset == DatePreset.LAST_30_DAYS:
        start = today - timedelta(days=30)
        end = today
    elif preset == DatePreset.LAST_90_DAYS:
        start = today - timedelta(days=90)
        end = today
    else:
        # Default to last 30 days
        start = today - timedelta(days=30)
        end = today

    return start, end


def get_costs(
    cloud_provider: Optional[str] = None,
    service_name: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    preset: Optional[DatePreset] = None,
    granularity: Granularity = Granularity.DAILY
) -> CostDataResponse:
    """
    Get cost data with filters and metadata.

    Args:
        cloud_provider: Filter by cloud provider
        service_name: Filter by service name
        start_date: Start date for range
        end_date: End date for range
        preset: Date preset (overrides start_date/end_date)
        granularity: Data granularity (daily, weekly, monthly)

    Returns:
        CostDataResponse with data and metadata
    """
    # Determine date range
    if preset:
        start_date, end_date = get_date_range_from_preset(preset)

    # Build query filters
    session = finops_db.session
    query = session.query(CloudCostModel)

    if cloud_provider:
        query = query.filter(CloudCostModel.cloud_provider == cloud_provider)
    if service_name:
        query = query.filter(CloudCostModel.service_name == service_name)
    if start_date:
        query = query.filter(CloudCostModel.date >= start_date)
    if end_date:
        query = query.filter(CloudCostModel.date <= end_date)

    # Execute query
    results = query.order_by(CloudCostModel.date.asc()).all()

    # Convert to Pydantic models
    cost_records = [CloudCost.model_validate(r) for r in results]

    # Apply granularity aggregation if needed
    if granularity != Granularity.DAILY:
        cost_records = _aggregate_by_granularity(cost_records, granularity)

    # Generate metadata
    metadata = _generate_metadata(cost_records, start_date, end_date)

    # Generate query info
    query_info = {
        "cloud_provider": cloud_provider,
        "service_name": service_name,
        "start_date": start_date.isoformat() if start_date else None,
        "end_date": end_date.isoformat() if end_date else None,
        "preset": preset.value if preset else None,
        "granularity": granularity.value,
        "record_count": len(cost_records)
    }

    return CostDataResponse(
        data=cost_records,
        metadata=metadata,
        query_info=query_info
    )


def get_aggregated_costs(
    group_by: str,
    cloud_provider: Optional[str] = None,
    service_name: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    preset: Optional[DatePreset] = None,
    granularity: Granularity = Granularity.DAILY
) -> CostDataResponse:
    """
    Get aggregated cost data grouped by provider, service, or date.

    Args:
        group_by: Grouping field (provider, service, date)
        cloud_provider: Filter by cloud provider
        service_name: Filter by service name
        start_date: Start date for range
        end_date: End date for range
        preset: Date preset
        granularity: Data granularity

    Returns:
        CostDataResponse with aggregated data
    """
    # Determine date range
    if preset:
        start_date, end_date = get_date_range_from_preset(preset)

    # Build query
    session = finops_db.session
    query = session.query(CloudCostModel)

    if cloud_provider:
        query = query.filter(CloudCostModel.cloud_provider == cloud_provider)
    if service_name:
        query = query.filter(CloudCostModel.service_name == service_name)
    if start_date:
        query = query.filter(CloudCostModel.date >= start_date)
    if end_date:
        query = query.filter(CloudCostModel.date <= end_date)

    results = query.all()

    # Aggregate data
    aggregations = []
    if group_by == "provider":
        aggregations = _aggregate_by_provider(results)
    elif group_by == "service":
        aggregations = _aggregate_by_service(results)
    elif group_by == "date":
        aggregations = _aggregate_by_date(results, granularity)

    # Generate metadata
    total_cost = sum(agg.total_cost for agg in aggregations)
    metadata = {
        "total_cost": round(total_cost, 2),
        "group_by": group_by,
        "record_count": len(aggregations)
    }

    query_info = {
        "cloud_provider": cloud_provider,
        "service_name": service_name,
        "start_date": start_date.isoformat() if start_date else None,
        "end_date": end_date.isoformat() if end_date else None,
        "preset": preset.value if preset else None,
        "granularity": granularity.value,
        "group_by": group_by
    }

    return CostDataResponse(
        data=aggregations,
        metadata=metadata,
        query_info=query_info
    )


def get_cost_summary(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    preset: Optional[DatePreset] = None
) -> CostSummary:
    """
    Get comprehensive cost summary and statistics.

    Args:
        start_date: Start date for range
        end_date: End date for range
        preset: Date preset

    Returns:
        CostSummary with totals and breakdowns
    """
    # Determine date range
    if preset:
        start_date, end_date = get_date_range_from_preset(preset)

    # Get all costs in range
    session = finops_db.session
    query = session.query(CloudCostModel)

    if start_date:
        query = query.filter(CloudCostModel.date >= start_date)
    if end_date:
        query = query.filter(CloudCostModel.date <= end_date)

    results = query.all()

    # Calculate totals
    total_cost = sum(r.cost for r in results)

    # Group by provider
    by_provider = defaultdict(float)
    for r in results:
        by_provider[r.cloud_provider] += r.cost

    # Group by service
    by_service = defaultdict(float)
    for r in results:
        by_service[r.service_name] += r.cost

    # Calculate trend (compare to previous period)
    trend, percentage_change = _calculate_trend(start_date, end_date)

    # Get top services and providers
    top_services = [
        TopItem(name=name, cost=round(cost, 2), percentage=round((cost / total_cost * 100), 2))
        for name, cost in sorted(by_service.items(), key=lambda x: x[1], reverse=True)[:5]
    ]

    top_providers = [
        TopItem(name=name, cost=round(cost, 2), percentage=round((cost / total_cost * 100), 2))
        for name, cost in sorted(by_provider.items(), key=lambda x: x[1], reverse=True)
    ]

    return CostSummary(
        total_cost=round(total_cost, 2),
        by_provider={k: round(v, 2) for k, v in by_provider.items()},
        by_service={k: round(v, 2) for k, v in by_service.items()},
        trend=trend,
        percentage_change=round(percentage_change, 2),
        top_services=top_services,
        top_providers=top_providers
    )


def seed_cost_data(months: int = 6) -> int:
    """
    Generate and seed mock cost data.

    Args:
        months: Number of months of data to generate

    Returns:
        Number of records created
    """
    # Generate mock data
    records = generate_cost_data(months)

    # Insert into database
    session = finops_db.session
    for record in records:
        cost_model = CloudCostModel(**record)
        session.add(cost_model)

    session.commit()
    return len(records)


def _generate_metadata(
    cost_records: List[CloudCost],
    start_date: Optional[date],
    end_date: Optional[date]
) -> Dict[str, Any]:
    """Generate metadata for cost data response."""
    if not cost_records:
        return {
            "total_cost": 0,
            "date_range": {
                "start": start_date.isoformat() if start_date else None,
                "end": end_date.isoformat() if end_date else None
            },
            "provider_summary": {},
            "service_summary": {}
        }

    total_cost = sum(record.cost for record in cost_records)

    # Provider summary
    provider_summary = defaultdict(float)
    for record in cost_records:
        provider_summary[record.cloud_provider] += record.cost

    # Service summary
    service_summary = defaultdict(float)
    for record in cost_records:
        service_summary[record.service_name] += record.cost

    return {
        "total_cost": round(total_cost, 2),
        "date_range": {
            "start": start_date.isoformat() if start_date else None,
            "end": end_date.isoformat() if end_date else None
        },
        "provider_summary": {k: round(v, 2) for k, v in provider_summary.items()},
        "service_summary": {k: round(v, 2) for k, v in service_summary.items()}
    }


def _aggregate_by_granularity(
    cost_records: List[CloudCost],
    granularity: Granularity
) -> List[CloudCost]:
    """Aggregate cost records by granularity (weekly or monthly)."""
    # For now, return as-is for daily
    # TODO: Implement weekly and monthly aggregation if needed
    return cost_records


def _aggregate_by_provider(results: List[CloudCostModel]) -> List[CostAggregation]:
    """Aggregate cost data by cloud provider."""
    provider_data = defaultdict(lambda: {"total": 0, "count": 0, "services": set()})

    for r in results:
        provider_data[r.cloud_provider]["total"] += r.cost
        provider_data[r.cloud_provider]["count"] += 1
        provider_data[r.cloud_provider]["services"].add(r.service_name)

    aggregations = []
    for provider, data in provider_data.items():
        aggregations.append(CostAggregation(
            period="all",
            cloud_provider=provider,
            service_name="all",
            total_cost=round(data["total"], 2),
            average_cost=round(data["total"] / data["count"], 2) if data["count"] > 0 else 0,
            record_count=data["count"]
        ))

    return aggregations


def _aggregate_by_service(results: List[CloudCostModel]) -> List[CostAggregation]:
    """Aggregate cost data by service."""
    service_data = defaultdict(lambda: {"total": 0, "count": 0, "provider": None})

    for r in results:
        key = f"{r.cloud_provider}:{r.service_name}"
        service_data[key]["total"] += r.cost
        service_data[key]["count"] += 1
        service_data[key]["provider"] = r.cloud_provider
        service_data[key]["service"] = r.service_name

    aggregations = []
    for key, data in service_data.items():
        aggregations.append(CostAggregation(
            period="all",
            cloud_provider=data["provider"],
            service_name=data["service"],
            total_cost=round(data["total"], 2),
            average_cost=round(data["total"] / data["count"], 2) if data["count"] > 0 else 0,
            record_count=data["count"]
        ))

    return aggregations


def _aggregate_by_date(
    results: List[CloudCostModel],
    granularity: Granularity
) -> List[CostAggregation]:
    """Aggregate cost data by date with specified granularity."""
    date_data = defaultdict(lambda: {"total": 0, "count": 0})

    for r in results:
        if granularity == Granularity.DAILY:
            period_key = r.date.isoformat()
        elif granularity == Granularity.WEEKLY:
            # Use ISO week number
            period_key = f"{r.date.year}-W{r.date.isocalendar()[1]:02d}"
        else:  # MONTHLY
            period_key = f"{r.date.year}-{r.date.month:02d}"

        date_data[period_key]["total"] += r.cost
        date_data[period_key]["count"] += 1

    aggregations = []
    for period, data in sorted(date_data.items()):
        aggregations.append(CostAggregation(
            period=period,
            cloud_provider="all",
            service_name="all",
            total_cost=round(data["total"], 2),
            average_cost=round(data["total"] / data["count"], 2) if data["count"] > 0 else 0,
            record_count=data["count"]
        ))

    return aggregations


def _calculate_trend(
    start_date: Optional[date],
    end_date: Optional[date]
) -> tuple[str, float]:
    """Calculate cost trend compared to previous period."""
    if not start_date or not end_date:
        return "unknown", 0.0

    # Calculate period length
    period_length = (end_date - start_date).days

    # Get costs for current period
    session = finops_db.session
    current_query = session.query(func.sum(CloudCostModel.cost)).filter(
        CloudCostModel.date >= start_date,
        CloudCostModel.date <= end_date
    )
    current_total = current_query.scalar() or 0

    # Get costs for previous period
    prev_end = start_date - timedelta(days=1)
    prev_start = prev_end - timedelta(days=period_length)
    prev_query = session.query(func.sum(CloudCostModel.cost)).filter(
        CloudCostModel.date >= prev_start,
        CloudCostModel.date <= prev_end
    )
    prev_total = prev_query.scalar() or 0

    # Calculate percentage change
    if prev_total > 0:
        percentage_change = ((current_total - prev_total) / prev_total) * 100
    else:
        percentage_change = 0.0

    # Determine trend
    if percentage_change > 5:
        trend = "increasing"
    elif percentage_change < -5:
        trend = "decreasing"
    else:
        trend = "stable"

    return trend, percentage_change


def get_providers() -> List[str]:
    """Get list of all cloud providers."""
    return get_all_providers()


def get_services(cloud_provider: Optional[str] = None) -> List[str]:
    """Get list of services, optionally filtered by provider."""
    return get_services_by_provider(cloud_provider)
