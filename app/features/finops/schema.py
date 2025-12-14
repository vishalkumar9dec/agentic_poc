"""
SQLAlchemy schema for FinOps cost management.
"""
from sqlalchemy import Column, Integer, String, Float, Date, DateTime, Index
from datetime import datetime

from database.db_operations import Base


class CloudCostModel(Base):
    """SQLAlchemy model for cloud costs table."""
    __tablename__ = "cloud_costs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    cloud_provider = Column(String, nullable=False)
    service_name = Column(String, nullable=False)
    cost = Column(Float, nullable=False)
    date = Column(Date, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Composite index for fast queries on provider, service, and date
    __table_args__ = (
        Index('idx_provider_service_date', 'cloud_provider', 'service_name', 'date'),
        Index('idx_date', 'date'),
    )
