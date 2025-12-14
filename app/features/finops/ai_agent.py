"""
Pydantic AI agent for FinOps cost analysis and recommendations.
"""
from datetime import datetime, date, timedelta
from typing import Dict, Any, List
from pydantic_ai import Agent, RunContext

from . import service
from .models import DatePreset


# Define deps type for agent context
class FinOpsContext:
    """Context for FinOps AI agent."""
    def __init__(self):
        self.current_date = datetime.now().date()


# Initialize the FinOps AI agent
finops_agent = Agent(
    'openai:gpt-4o-mini',
    deps_type=FinOpsContext,
    system_prompt="""
You are a FinOps AI assistant specialized in cloud cost management and optimization.
You help users understand their multi-cloud spending across AWS, Azure, and GCP.
You can query cost data, identify trends, compare providers, and provide actionable cost optimization recommendations.

IMPORTANT DATE HANDLING:
- Current date is December 14, 2025
- When users ask about "last month" or no specific date, use November 2025 (2025-11-01 to 2025-11-30)
- When users ask about "this month", use December 2025 (2025-12-01 to 2025-12-14)
- Available data ranges from September 2025 to December 2025
- If no date range is specified, default to the last complete month (November 2025)

Always provide specific, data-driven insights with exact figures and dates.
Use the available tools to access real cost data from the database.
Format monetary amounts with 2 decimal places and use $ symbol.
When discussing trends or changes, provide percentage values.
Be concise but informative in your responses.
"""
)


@finops_agent.tool
def query_costs_by_range(
    ctx: RunContext[FinOpsContext],
    start_date: str,
    end_date: str,
    cloud_provider: str = None,
    service_name: str = None
) -> Dict[str, Any]:
    """
    Query cost data within a date range.

    Args:
        ctx: Agent context
        start_date: Start date in YYYY-MM-DD format
        end_date: End date in YYYY-MM-DD format
        cloud_provider: Optional cloud provider filter (AWS, Azure, GCP)
        service_name: Optional service name filter

    Returns:
        Cost data with metadata
    """
    try:
        start = datetime.strptime(start_date, "%Y-%m-%d").date()
        end = datetime.strptime(end_date, "%Y-%m-%d").date()

        response = service.get_costs(
            cloud_provider=cloud_provider,
            service_name=service_name,
            start_date=start,
            end_date=end
        )

        return {
            "total_cost": response.metadata.get("total_cost", 0),
            "record_count": response.query_info.get("record_count", 0),
            "provider_summary": response.metadata.get("provider_summary", {}),
            "service_summary": response.metadata.get("service_summary", {}),
            "date_range": f"{start_date} to {end_date}"
        }
    except Exception as e:
        return {"error": str(e)}


@finops_agent.tool
def get_cost_summary(
    ctx: RunContext[FinOpsContext],
    start_date: str,
    end_date: str
) -> Dict[str, Any]:
    """
    Get high-level cost summary with totals by provider and service.

    Args:
        ctx: Agent context
        start_date: Start date in YYYY-MM-DD format
        end_date: End date in YYYY-MM-DD format

    Returns:
        Aggregated summary with totals, trends, and top items
    """
    try:
        start = datetime.strptime(start_date, "%Y-%m-%d").date()
        end = datetime.strptime(end_date, "%Y-%m-%d").date()

        summary = service.get_cost_summary(start_date=start, end_date=end)

        return {
            "total_cost": summary.total_cost,
            "by_provider": summary.by_provider,
            "by_service": summary.by_service,
            "trend": summary.trend,
            "percentage_change": summary.percentage_change,
            "top_services": [
                {"name": item.name, "cost": item.cost, "percentage": item.percentage}
                for item in summary.top_services
            ],
            "top_providers": [
                {"name": item.name, "cost": item.cost, "percentage": item.percentage}
                for item in summary.top_providers
            ]
        }
    except Exception as e:
        return {"error": str(e)}


@finops_agent.tool
def compare_providers(
    ctx: RunContext[FinOpsContext],
    start_date: str,
    end_date: str
) -> Dict[str, Any]:
    """
    Compare spending across AWS, Azure, and GCP.

    Args:
        ctx: Agent context
        start_date: Start date in YYYY-MM-DD format
        end_date: End date in YYYY-MM-DD format

    Returns:
        Cost comparison across cloud providers
    """
    try:
        start = datetime.strptime(start_date, "%Y-%m-%d").date()
        end = datetime.strptime(end_date, "%Y-%m-%d").date()

        summary = service.get_cost_summary(start_date=start, end_date=end)

        total = summary.total_cost
        comparison = {}

        for provider, cost in summary.by_provider.items():
            percentage = (cost / total * 100) if total > 0 else 0
            comparison[provider] = {
                "cost": cost,
                "percentage": round(percentage, 2)
            }

        return {
            "total_cost": total,
            "providers": comparison,
            "date_range": f"{start_date} to {end_date}"
        }
    except Exception as e:
        return {"error": str(e)}


@finops_agent.tool
def analyze_service_costs(
    ctx: RunContext[FinOpsContext],
    service_name: str,
    start_date: str,
    end_date: str
) -> Dict[str, Any]:
    """
    Deep dive into a specific service's costs.

    Args:
        ctx: Agent context
        service_name: Name of the service to analyze
        start_date: Start date in YYYY-MM-DD format
        end_date: End date in YYYY-MM-DD format

    Returns:
        Detailed analysis of service costs
    """
    try:
        start = datetime.strptime(start_date, "%Y-%m-%d").date()
        end = datetime.strptime(end_date, "%Y-%m-%d").date()

        response = service.get_costs(
            service_name=service_name,
            start_date=start,
            end_date=end
        )

        total_cost = response.metadata.get("total_cost", 0)
        record_count = response.query_info.get("record_count", 0)
        average_daily = total_cost / record_count if record_count > 0 else 0

        return {
            "service_name": service_name,
            "total_cost": total_cost,
            "average_daily_cost": round(average_daily, 2),
            "days_tracked": record_count,
            "date_range": f"{start_date} to {end_date}",
            "provider_breakdown": response.metadata.get("provider_summary", {})
        }
    except Exception as e:
        return {"error": str(e)}


@finops_agent.tool
def detect_cost_anomalies(
    ctx: RunContext[FinOpsContext],
    start_date: str,
    end_date: str,
    threshold_percent: float = 20.0
) -> Dict[str, Any]:
    """
    Identify cost anomalies and spikes.

    Args:
        ctx: Agent context
        start_date: Start date in YYYY-MM-DD format
        end_date: End date in YYYY-MM-DD format
        threshold_percent: Percentage threshold for anomaly detection (default: 20%)

    Returns:
        List of detected anomalies
    """
    try:
        start = datetime.strptime(start_date, "%Y-%m-%d").date()
        end = datetime.strptime(end_date, "%Y-%m-%d").date()

        response = service.get_costs(start_date=start, end_date=end)

        # Calculate daily totals
        daily_costs = {}
        for record in response.data:
            date_key = record.date.isoformat()
            if date_key not in daily_costs:
                daily_costs[date_key] = 0
            daily_costs[date_key] += record.cost

        # Calculate average
        if not daily_costs:
            return {"anomalies": [], "message": "No data available"}

        costs = list(daily_costs.values())
        avg_cost = sum(costs) / len(costs)

        # Detect anomalies
        anomalies = []
        for date_str, cost in daily_costs.items():
            deviation_percent = ((cost - avg_cost) / avg_cost * 100) if avg_cost > 0 else 0

            if abs(deviation_percent) > threshold_percent:
                anomalies.append({
                    "date": date_str,
                    "cost": round(cost, 2),
                    "average_cost": round(avg_cost, 2),
                    "deviation_percent": round(deviation_percent, 2)
                })

        return {
            "anomalies": sorted(anomalies, key=lambda x: abs(x["deviation_percent"]), reverse=True),
            "total_anomalies": len(anomalies),
            "average_daily_cost": round(avg_cost, 2),
            "threshold_percent": threshold_percent
        }
    except Exception as e:
        return {"error": str(e)}


@finops_agent.tool_plain
def get_optimization_recommendations() -> List[str]:
    """
    Provide actionable cost-saving suggestions.

    Returns:
        List of cost optimization recommendations
    """
    recommendations = [
        "AWS S3: Consider implementing lifecycle policies to automatically move infrequently accessed data to cheaper storage tiers (S3 Glacier or Intelligent-Tiering)",
        "Azure Virtual Machines: Review VM sizes and consider right-sizing or using Reserved Instances for predictable workloads to save up to 72%",
        "GCP Compute Engine: Enable sustained use discounts and committed use contracts for long-running instances",
        "Multi-Cloud: Implement auto-scaling policies to reduce costs during low-usage periods, especially on weekends",
        "Storage: Review and delete unused storage buckets, old snapshots, and orphaned volumes across all providers",
        "Serverless Functions: Optimize function execution time and memory allocation to reduce compute costs",
        "Monitoring: Set up cost alerts and budgets to detect unusual spending patterns early",
        "Reserved Capacity: For consistent workloads, consider reserved instances or savings plans which can reduce costs by 30-75%",
        "Data Transfer: Minimize cross-region and cross-provider data transfers which incur significant costs",
        "Development Environments: Implement schedules to automatically stop/start non-production resources during off-hours"
    ]

    # Return a subset of recommendations
    import random
    return random.sample(recommendations, min(5, len(recommendations)))


async def run_finops_query(query: str) -> Dict[str, Any]:
    """
    Run a natural language query against the FinOps agent.

    Args:
        query: Natural language query from user

    Returns:
        Agent response with data and recommendations
    """
    try:
        context = FinOpsContext()
        result = await finops_agent.run(query, deps=context)

        return {
            "response": str(result.output),
            "data": None,
            "recommendations": []
        }
    except Exception as e:
        return {
            "response": f"Error processing query: {str(e)}",
            "data": None,
            "recommendations": []
        }


def run_finops_query_sync(query: str) -> Dict[str, Any]:
    """
    Run a natural language query against the FinOps agent (synchronous).

    Args:
        query: Natural language query from user

    Returns:
        Agent response with data and recommendations
    """
    try:
        context = FinOpsContext()
        result = finops_agent.run_sync(query, deps=context)

        return {
            "response": str(result.output),
            "data": None,
            "recommendations": []
        }
    except Exception as e:
        return {
            "response": f"Error processing query: {str(e)}",
            "data": None,
            "recommendations": []
        }
