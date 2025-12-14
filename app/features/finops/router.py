"""
FastAPI router for FinOps cost management endpoints.
"""
from fastapi import APIRouter, Query, HTTPException
from typing import Optional, List
from datetime import date

from .models import (
    CostDataResponse, CostSummary, AIQueryRequest, AIQueryResponse,
    SeedDataRequest, SeedDataResponse, DatePreset, Granularity
)
from . import service
from .ai_agent import run_finops_query_sync


router = APIRouter(prefix="/api/finops", tags=["finops"])


@router.get("/costs", response_model=CostDataResponse)
def get_costs(
    cloud_provider: Optional[str] = Query(None, description="Filter by cloud provider (AWS, Azure, GCP)"),
    service_name: Optional[str] = Query(None, description="Filter by service name"),
    start_date: Optional[date] = Query(None, description="Start date for range"),
    end_date: Optional[date] = Query(None, description="End date for range"),
    preset: Optional[DatePreset] = Query(None, description="Date preset (this_week, last_month, etc.)"),
    granularity: Granularity = Query(Granularity.DAILY, description="Data granularity (daily, weekly, monthly)")
):
    """
    Get cost data with filters and metadata.
    Response includes metadata for hover effects and summaries.
    UI uses this single response to render bar charts, line charts, or tables.
    """
    try:
        return service.get_costs(
            cloud_provider=cloud_provider,
            service_name=service_name,
            start_date=start_date,
            end_date=end_date,
            preset=preset,
            granularity=granularity
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/costs/aggregate", response_model=CostDataResponse)
def get_aggregated_costs(
    group_by: str = Query(..., description="Group by: provider, service, or date"),
    cloud_provider: Optional[str] = Query(None, description="Filter by cloud provider"),
    service_name: Optional[str] = Query(None, description="Filter by service name"),
    start_date: Optional[date] = Query(None, description="Start date for range"),
    end_date: Optional[date] = Query(None, description="End date for range"),
    preset: Optional[DatePreset] = Query(None, description="Date preset"),
    granularity: Granularity = Query(Granularity.DAILY, description="Data granularity")
):
    """
    Get aggregated cost data with metadata.
    Supports grouping by provider, service, or date.
    UI transforms aggregated data into visualizations locally.
    """
    try:
        if group_by not in ["provider", "service", "date"]:
            raise HTTPException(
                status_code=400,
                detail="group_by must be one of: provider, service, date"
            )

        return service.get_aggregated_costs(
            group_by=group_by,
            cloud_provider=cloud_provider,
            service_name=service_name,
            start_date=start_date,
            end_date=end_date,
            preset=preset,
            granularity=granularity
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/costs/summary", response_model=CostSummary)
def get_summary(
    start_date: Optional[date] = Query(None, description="Start date for range"),
    end_date: Optional[date] = Query(None, description="End date for range"),
    preset: Optional[DatePreset] = Query(None, description="Date preset")
):
    """
    Get comprehensive cost summary and statistics.
    Perfect for dashboard overview widgets.
    """
    try:
        return service.get_cost_summary(
            start_date=start_date,
            end_date=end_date,
            preset=preset
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/providers", response_model=List[str])
def get_providers():
    """Get list of all cloud providers."""
    try:
        return service.get_providers()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/services", response_model=List[str])
def get_services(
    cloud_provider: Optional[str] = Query(None, description="Filter by cloud provider")
):
    """Get list of services, optionally filtered by provider."""
    try:
        return service.get_services(cloud_provider=cloud_provider)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/seed-data", response_model=SeedDataResponse)
def seed_data(request: SeedDataRequest = SeedDataRequest()):
    """
    Generate and seed mock cost data.
    Creates realistic cost data with trends and patterns.
    """
    try:
        records_created = service.seed_cost_data(months=request.months)
        return SeedDataResponse(
            message=f"Successfully seeded {records_created} cost records for {request.months} months",
            records_created=records_created
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/ai/query", response_model=AIQueryResponse)
def ai_query(request: AIQueryRequest):
    """
    Natural language query interface for cost analysis.

    Examples:
    - "What were my AWS costs last month?"
    - "Compare Azure and GCP costs for the last week"
    - "Which service is most expensive?"
    - "Show me cost trends for Lambda"
    - "Any cost optimization recommendations?"
    """
    try:
        result = run_finops_query_sync(request.query)
        return AIQueryResponse(
            response=result.get("response", ""),
            data=result.get("data"),
            recommendations=result.get("recommendations", [])
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
