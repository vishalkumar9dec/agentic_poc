"""
Pydantic models for FinOps cost management.
"""
from datetime import date, datetime
from typing import Optional, List, Dict, Any, Union
from enum import Enum
from pydantic import BaseModel, Field


class CloudProvider(str, Enum):
    """Cloud provider enum."""
    AWS = "AWS"
    AZURE = "Azure"
    GCP = "GCP"


class AWSService(str, Enum):
    """AWS services enum."""
    EC2 = "EC2"
    S3 = "S3"
    LAMBDA = "Lambda"


class AzureService(str, Enum):
    """Azure services enum."""
    VIRTUAL_MACHINES = "Virtual Machines"
    BLOB_STORAGE = "Blob Storage"
    AZURE_FUNCTIONS = "Azure Functions"


class GCPService(str, Enum):
    """GCP services enum."""
    COMPUTE_ENGINE = "Compute Engine"
    CLOUD_STORAGE = "Cloud Storage"
    CLOUD_FUNCTIONS = "Cloud Functions"


class DatePreset(str, Enum):
    """Date range presets."""
    THIS_WEEK = "this_week"
    LAST_WEEK = "last_week"
    THIS_MONTH = "this_month"
    LAST_MONTH = "last_month"
    LAST_30_DAYS = "last_30_days"
    LAST_90_DAYS = "last_90_days"


class Granularity(str, Enum):
    """Data granularity levels."""
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"


class CloudCost(BaseModel):
    """Model for cloud cost data."""
    id: Optional[int] = None
    cloud_provider: str
    service_name: str
    cost: float
    date: date
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class CloudCostQuery(BaseModel):
    """Model for cost query parameters."""
    cloud_provider: Optional[str] = None
    service_name: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    preset: Optional[DatePreset] = None
    granularity: Granularity = Granularity.DAILY


class CostAggregation(BaseModel):
    """Model for aggregated cost data."""
    period: str
    cloud_provider: str
    service_name: str
    total_cost: float
    average_cost: float
    record_count: int


class TopItem(BaseModel):
    """Model for top provider/service items."""
    name: str
    cost: float
    percentage: float


class CostSummary(BaseModel):
    """Model for cost summary response."""
    total_cost: float
    by_provider: Dict[str, float]
    by_service: Dict[str, float]
    trend: str
    percentage_change: float
    top_services: List[TopItem]
    top_providers: List[TopItem]


class CostDataResponse(BaseModel):
    """Model wrapping cost data with metadata for UI consumption."""
    data: Union[List[CloudCost], List[CostAggregation]]
    metadata: Dict[str, Any]
    query_info: Dict[str, Any]


class AIQueryRequest(BaseModel):
    """Model for AI query request."""
    query: str
    context: Optional[Dict[str, Any]] = None


class AIQueryResponse(BaseModel):
    """Model for AI query response."""
    response: str
    data: Optional[Any] = None
    recommendations: List[str] = Field(default_factory=list)


class SeedDataRequest(BaseModel):
    """Model for seed data request."""
    months: int = Field(default=6, ge=1, le=24)


class SeedDataResponse(BaseModel):
    """Model for seed data response."""
    message: str
    records_created: int
