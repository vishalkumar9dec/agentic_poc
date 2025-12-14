"""
Mock data generator for FinOps cost data.
"""
import random
from datetime import datetime, timedelta, date
from typing import List, Dict

from .models import CloudProvider


# Service configurations with cost ranges (min, max per day in USD)
SERVICE_COSTS = {
    CloudProvider.AWS: {
        "EC2": (150, 500),
        "S3": (20, 80),
        "Lambda": (10, 50),
    },
    CloudProvider.AZURE: {
        "Virtual Machines": (140, 480),
        "Blob Storage": (18, 75),
        "Azure Functions": (8, 45),
    },
    CloudProvider.GCP: {
        "Compute Engine": (145, 490),
        "Cloud Storage": (19, 78),
        "Cloud Functions": (9, 48),
    }
}


def generate_cost_data(months: int = 6) -> List[Dict]:
    """
    Generate realistic mock cost data for multiple cloud providers.

    Args:
        months: Number of months of historical data to generate

    Returns:
        List of cost records with realistic patterns and variations

    Patterns implemented:
    - 15% cost increase over time (simulate growth)
    - 30% lower costs on weekends
    - Slight increase at month-end (25th-31st)
    - ±15% random daily variance
    - 2-3 random spike days per month (50% increase)
    """
    records = []

    # Calculate date range
    end_date = datetime.now().date()
    start_date = end_date - timedelta(days=months * 30)

    # Generate spike days (2-3 random days per month)
    total_days = (end_date - start_date).days
    num_spikes = int((months * 2.5))  # Average 2.5 spikes per month
    spike_days = set()
    for _ in range(num_spikes):
        random_day = start_date + timedelta(days=random.randint(0, total_days - 1))
        spike_days.add(random_day)

    # Generate data for each day
    current_date = start_date
    while current_date <= end_date:
        # Calculate progress through the time period (0.0 to 1.0)
        days_elapsed = (current_date - start_date).days
        progress = days_elapsed / total_days if total_days > 0 else 0

        # Growth factor: 15% increase over the period
        growth_factor = 1.0 + (progress * 0.15)

        # Weekend factor: 30% less on weekends
        is_weekend = current_date.weekday() >= 5  # Saturday=5, Sunday=6
        weekend_factor = 0.7 if is_weekend else 1.0

        # Month-end factor: slight increase on days 25-31
        month_end_factor = 1.1 if current_date.day >= 25 else 1.0

        # Spike factor: 50% increase on random spike days
        spike_factor = 1.5 if current_date in spike_days else 1.0

        # Generate costs for each cloud provider and service
        for provider, services in SERVICE_COSTS.items():
            for service_name, (min_cost, max_cost) in services.items():
                # Base cost: random value in range
                base_cost = random.uniform(min_cost, max_cost)

                # Apply all factors
                cost = base_cost * growth_factor * weekend_factor * month_end_factor * spike_factor

                # Add random variance: ±15%
                variance = random.uniform(0.85, 1.15)
                final_cost = cost * variance

                # Round to 2 decimal places
                final_cost = round(final_cost, 2)

                records.append({
                    "cloud_provider": provider.value,
                    "service_name": service_name,
                    "cost": final_cost,
                    "date": current_date,
                    "created_at": datetime.now()
                })

        # Move to next day
        current_date += timedelta(days=1)

    return records


def get_all_providers() -> List[str]:
    """Get list of all cloud providers."""
    return [provider.value for provider in CloudProvider]


def get_services_by_provider(provider: str = None) -> List[str]:
    """
    Get list of services, optionally filtered by provider.

    Args:
        provider: Cloud provider name (optional)

    Returns:
        List of service names
    """
    if provider:
        # Find matching provider
        for p in CloudProvider:
            if p.value == provider:
                return list(SERVICE_COSTS[p].keys())
        return []
    else:
        # Return all services from all providers
        all_services = []
        for services in SERVICE_COSTS.values():
            all_services.extend(services.keys())
        return all_services
