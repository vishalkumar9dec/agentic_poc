\,# FinOps Cost Management Implementation Prompt

## Objective
Implement a complete FinOps (Financial Operations) cost management system for multi-cloud environments using FastAPI backend with Agentic AI capabilities and support for Agentic UI.

## Project Context
- **Framework**: FastAPI with feature-based architecture
- **Database**: SQLite with SQLAlchemy ORM
- **AI Framework**: Pydantic AI with OpenAI
- **Existing Pattern**: Follow the architecture in `app/features/tickets/` as reference
- **Base Directory**: `app/features/finops/`

## Requirements

### 1. Cloud Providers & Services

**AWS (Amazon Web Services):**
- EC2 (Elastic Compute Cloud) - Virtual servers
- S3 (Simple Storage Service) - Object storage
- Lambda - Serverless functions

**Azure (Microsoft Azure):**
- Virtual Machines - Compute instances
- Blob Storage - Object storage
- Azure Functions - Serverless compute

**GCP (Google Cloud Platform):**
- Compute Engine - Virtual machines
- Cloud Storage - Object storage
- Cloud Functions - Serverless functions

### 2. Data Specifications

**Cost Data Granularity:**
- Daily: Individual day costs
- Weekly: Aggregated week costs (Mon-Sun)
- Monthly: Aggregated month costs

**Date Range Support:**
- Custom date range (start_date to end_date)
- Preset: "this_week" (current Mon-Sun)
- Preset: "last_week" (previous Mon-Sun)
- Preset: "this_month" (current month 1st to today)
- Preset: "last_month" (previous month full)
- Preset: "last_30_days"
- Preset: "last_90_days"

**Mock Data Requirements:**
- Generate 6 months of historical data (from 6 months ago to today)
- Daily granularity records for each service
- Costs should have realistic variations:
  - AWS EC2: $150-$500/day
  - AWS S3: $20-$80/day
  - AWS Lambda: $10-$50/day
  - Azure VMs: $140-$480/day
  - Azure Blob Storage: $18-$75/day
  - Azure Functions: $8-$45/day
  - GCP Compute Engine: $145-$490/day
  - GCP Cloud Storage: $19-$78/day
  - GCP Cloud Functions: $9-$48/day
- Add trends: gradual increase over time (simulate growth)
- Add weekly patterns: higher costs on weekdays, lower on weekends
- Add random variation: ±15% daily variance

### 3. Database Schema

**Table: cloud_costs**
```python
- id: Integer, Primary Key, Auto-increment
- cloud_provider: String (AWS, Azure, GCP)
- service_name: String
- cost: Float (USD)
- date: Date
- created_at: DateTime (auto-generated)
```

**Indexes:**
- Index on (cloud_provider, service_name, date) for fast queries
- Index on (date) for date range queries

### 4. Data Models (Pydantic)

**CloudCost (Request/Response model):**
```python
- id: Optional[int]
- cloud_provider: str (enum: AWS, Azure, GCP)
- service_name: str
- cost: float
- date: date
- created_at: Optional[datetime]
```

**CloudCostQuery (Request model):**
```python
- cloud_provider: Optional[str]
- service_name: Optional[str]
- start_date: Optional[date]
- end_date: Optional[date]
- preset: Optional[str] (this_week, last_week, this_month, last_month, last_30_days, last_90_days)
- granularity: Optional[str] (daily, weekly, monthly) - default: daily
```

**CostAggregation (Response model):**
```python
- period: str (date or period label)
- cloud_provider: str
- service_name: str
- total_cost: float
- average_cost: float
- record_count: int
```

**CostDataResponse (Response model):**
```python
- data: List[CloudCost] or List[CostAggregation]
- metadata: dict (contains: total_cost, date_range, provider_summary, service_summary)
- query_info: dict (contains: filters applied, granularity, record_count)
```

### 5. API Endpoints

**Base Path: `/api/finops`**

**IMPORTANT - UI Data Transformation Philosophy:**
The backend provides clean, structured data in a single response. The frontend/UI is responsible for transforming this data into different visualizations (bar charts, line charts, tables). This approach:
- Reduces redundant API calls
- Improves performance (one fetch, multiple visualizations)
- Simplifies backend (no chart-specific formatting)
- Gives frontend full control over presentation
- Enables offline chart type switching

#### 5.1 Core Data Endpoints
```
GET /costs
- Query parameters: cloud_provider, service_name, start_date, end_date, preset, granularity
- Returns: CostDataResponse with List[CloudCost]
- Description: Get cost data with filters and metadata
- Response includes metadata for hover effects (total cost, date range, summaries)
- UI uses this single response to render bar charts, line charts, or tables

GET /costs/aggregate
- Query parameters: same as above + group_by (provider, service, date)
- Returns: CostDataResponse with List[CostAggregation]
- Description: Get aggregated cost data with metadata
- Supports grouping by provider, service, or date
- UI transforms aggregated data into visualizations locally

GET /costs/summary
- Query parameters: start_date, end_date, preset
- Returns: {
    total_cost: float,
    by_provider: {AWS: float, Azure: float, GCP: float},
    by_service: {service_name: float, ...},
    trend: str (increasing/decreasing/stable),
    percentage_change: float,
    top_services: [{name, cost, percentage}],
    top_providers: [{name, cost, percentage}]
  }
- Description: Get comprehensive cost summary and statistics
- Perfect for dashboard overview widgets
```

#### 5.2 Utility Endpoints
```
GET /providers
- Returns: List of cloud providers

GET /services
- Query parameters: cloud_provider (optional)
- Returns: List of services (filtered by provider if specified)

POST /seed-data
- Body: {months: int} (default: 6)
- Returns: {message, records_created}
- Description: Generate and seed mock data
```

#### 5.3 Agentic AI Endpoint
```
POST /ai/query
- Body: {query: str, context: Optional[dict]}
- Returns: {response: str, data: Optional[any], recommendations: List[str]}
- Description: Natural language query interface for cost analysis
- Examples:
  - "What were my AWS costs last month?"
  - "Compare Azure and GCP costs for the last week"
  - "Which service is most expensive?"
  - "Show me cost trends for Lambda"
  - "Any cost optimization recommendations?"
```

### 5.4 UI Data Transformation Pattern

**How Frontend Uses the API Response:**

When the UI fetches data from `GET /costs` or `GET /costs/aggregate`, it receives a `CostDataResponse` with:
- `data`: Array of cost records
- `metadata`: Totals, summaries, date ranges
- `query_info`: Applied filters and settings

**Single Fetch, Multiple Visualizations:**

```javascript
// Example: User selects date range and clicks "Search"
const response = await fetch('/api/finops/costs?preset=last_month&granularity=daily');
const { data, metadata } = await response.json();

// UI now has the data and can render ANY visualization without more API calls:

// 1. Bar Chart - Group by provider
const barChartData = data.reduce((acc, item) => {
  acc[item.cloud_provider] = (acc[item.cloud_provider] || 0) + item.cost;
  return acc;
}, {});

// 2. Line Chart - Show trends over time
const lineChartData = data.map(item => ({
  x: item.date,
  y: item.cost,
  provider: item.cloud_provider
}));

// 3. Table - Display raw data with sorting/filtering
const tableData = data.map(item => ({
  Date: item.date,
  Provider: item.cloud_provider,
  Service: item.service_name,
  Cost: `$${item.cost.toFixed(2)}`
}));

// 4. Hover effects use metadata
onHover = (dataPoint) => {
  showTooltip({
    cost: dataPoint.cost,
    percentage: (dataPoint.cost / metadata.total_cost * 100).toFixed(1) + '%',
    provider: dataPoint.cloud_provider
  });
};

// User can switch between bar/line/table instantly with NO additional API calls
```

**Benefits:**
- **Performance**: One API call instead of three
- **Offline capability**: Switch visualizations without network requests
- **Consistency**: All views use the same data snapshot
- **Bandwidth**: Reduced data transfer
- **UX**: Instant chart type switching

### 6. Agentic AI Agent Specification

**Agent Name:** FinOpsAgent

**Model:** openai:gpt-4o-mini

**System Prompt:**
```
You are a FinOps AI assistant specialized in cloud cost management and optimization.
You help users understand their multi-cloud spending across AWS, Azure, and GCP.
You can query cost data, identify trends, compare providers, and provide actionable cost optimization recommendations.
Always provide specific, data-driven insights with exact figures and dates.
```

**Agent Tools:**

1. **query_costs_by_range**
   - Parameters: start_date, end_date, cloud_provider (optional), service_name (optional)
   - Returns: Cost data for the specified range
   - Description: Query cost data within a date range

2. **get_cost_summary**
   - Parameters: start_date, end_date
   - Returns: Aggregated summary with totals by provider and service
   - Description: Get high-level cost summary

3. **compare_providers**
   - Parameters: start_date, end_date
   - Returns: Cost comparison across AWS, Azure, GCP
   - Description: Compare spending across cloud providers

4. **analyze_service_costs**
   - Parameters: service_name, start_date, end_date
   - Returns: Detailed analysis of a specific service's costs
   - Description: Deep dive into a single service

5. **detect_cost_anomalies**
   - Parameters: start_date, end_date, threshold_percent (default: 20)
   - Returns: List of dates/services with unusual cost spikes
   - Description: Identify cost anomalies and spikes

6. **get_optimization_recommendations**
   - Parameters: cloud_provider (optional)
   - Returns: List of cost optimization recommendations
   - Description: Provide actionable cost-saving suggestions

**Agent Context (deps_type):**
- database_service: Reference to FinOps service for data access
- current_date: datetime for relative date calculations

### 7. File Structure

```
app/features/finops/
├── __init__.py
├── models.py           # Pydantic models (CloudCost, CloudCostQuery, etc.)
├── schema.py           # SQLAlchemy model (CloudCostModel)
├── service.py          # Business logic and DbOperations instance
├── router.py           # FastAPI endpoints
├── ai_agent.py         # Pydantic AI agent definition and tools
└── data_generator.py   # Mock data generation logic
```

### 8. Implementation Steps

1. **Create feature module structure**
   - Create `app/features/finops/` directory
   - Create all files: __init__.py, models.py, schema.py, service.py, router.py, ai_agent.py, data_generator.py

2. **Define data models (models.py)**
   - CloudCost, CloudCostQuery, CostAggregation, CostDataResponse
   - Use Pydantic with proper validation
   - Add enum for cloud providers and services
   - CostDataResponse wraps data with metadata for UI consumption

3. **Create database schema (schema.py)**
   - CloudCostModel with SQLAlchemy
   - Follow naming convention: Model suffix
   - Add indexes for performance

4. **Implement data generator (data_generator.py)**
   - Function to generate 6 months of mock data
   - Implement realistic cost variations with trends
   - Follow the cost ranges specified above
   - Add weekly patterns and random variance

5. **Build service layer (service.py)**
   - Create finops_db instance using DbOperations
   - Implement query methods: get_costs, get_aggregated_costs, get_summary
   - Implement date preset logic (this_week, last_month, etc.)
   - Implement granularity aggregation (daily → weekly → monthly)
   - Generate metadata (totals, summaries) for each response
   - NO chart-specific formatting (UI handles transformations)

6. **Create AI agent (ai_agent.py)**
   - Initialize Pydantic AI Agent with OpenAI
   - Implement all 6 tools specified above
   - Each tool should use the service layer to access data
   - Add proper error handling and validation
   - Create helper function to run agent queries

7. **Build API router (router.py)**
   - Implement all endpoints specified in section 5
   - Use proper HTTP methods and status codes
   - Add request validation with Pydantic models
   - Add response models for type safety
   - Include the AI endpoint that calls the agent

8. **Integrate with main app (app/main.py)**
   - Import finops router
   - Include router with prefix "/api/finops"
   - Add tags for API documentation

9. **Seed initial data**
   - Create a seed endpoint or startup script
   - Generate 6 months of data on first run
   - Store in SQLite database (poc.db)

10. **Test endpoints**
    - Test all CRUD operations
    - Test date range queries and presets
    - Test aggregation logic (daily, weekly, monthly)
    - Test AI agent with sample queries
    - Verify response metadata is comprehensive for UI needs
    - Test that single API response can support multiple UI representations

### 9. Code Quality Requirements

- **Follow existing patterns**: Use the same architecture as `app/features/tickets/`
- **Type hints**: Use Python type hints everywhere
- **Error handling**: Add try-except blocks with meaningful error messages
- **Documentation**: Add docstrings to all functions and classes
- **Validation**: Validate all inputs with Pydantic
- **Constants**: Define cloud providers and services as constants/enums
- **DRY principle**: Avoid code duplication
- **Separation of concerns**: Keep router, service, and database layers separate

### 10. Mock Data Realism

**Trends to implement:**
- Overall 15% cost increase over 6 months (simulate business growth)
- Weekly pattern: 30% less cost on weekends vs weekdays
- Monthly pattern: Slight increase in month-end (25th-31st)
- Random daily variance: ±15%
- Occasional spikes: 2-3 random days per month with 50% cost increase

**Distribution:**
- 40% of total cost from compute (EC2, VMs, Compute Engine)
- 35% from storage (S3, Blob Storage, Cloud Storage)
- 25% from serverless (Lambda, Functions, Cloud Functions)

### 11. Expected AI Agent Behavior

**Example Interactions:**

User: "What were my AWS costs last month?"
Agent: "Your AWS costs for [last month] totaled $X,XXX. Here's the breakdown:
- EC2: $X,XXX (XX% of AWS total)
- S3: $XXX (XX%)
- Lambda: $XXX (XX%)
This represents a X% increase/decrease compared to the previous month."

User: "Which cloud provider is most expensive?"
Agent: "Based on the last 30 days:
1. AWS: $X,XXX (XX%)
2. Azure: $X,XXX (XX%)
3. GCP: $X,XXX (XX%)
AWS is your most expensive provider, primarily driven by EC2 costs."

User: "Any cost optimization recommendations?"
Agent: "Here are 3 recommendations:
1. AWS S3: Consider lifecycle policies to move old data to cheaper storage tiers
2. Azure VMs: XX% of costs occur on weekends when usage is low - consider auto-scaling
3. GCP Cloud Functions: Optimize function execution time to reduce compute costs"

### 12. Testing Checklist

- [ ] Mock data generates correctly with 6 months of data
- [ ] All cloud providers (AWS, Azure, GCP) have data
- [ ] All services (3 per provider) have data
- [ ] Date range queries work (custom range)
- [ ] Date presets work (this_week, last_month, etc.)
- [ ] Granularity aggregation works (daily, weekly, monthly)
- [ ] Response metadata includes all info needed for UI (totals, summaries, etc.)
- [ ] Single data response can be transformed into bar/line/table by UI
- [ ] AI agent responds to natural language queries
- [ ] AI agent tools can access database
- [ ] AI agent provides relevant recommendations
- [ ] API documentation is generated correctly
- [ ] All endpoints return proper error messages
- [ ] No redundant chart-specific endpoints exist

### 13. Environment Variables

Ensure `.env` file contains:
```
OPENAI_API_KEY=your_openai_api_key_here
```

### 14. Success Criteria

Implementation is complete when:
1. All API endpoints are functional and documented
2. Mock data is generated and stored in database
3. Date range and preset queries work correctly
4. Aggregation by daily/weekly/monthly works
5. Single data endpoint returns comprehensive metadata for UI transformations
6. UI can transform one API response into bar charts, line charts, AND tables without additional calls
7. AI agent responds to natural language queries accurately
8. AI agent provides data-driven recommendations
9. Code follows existing architecture patterns
10. All models have proper validation
11. No redundant chart-specific endpoints exist
12. API can be accessed at `http://localhost:8000/api/finops/`

---

## Implementation Command

Use this prompt file with:
```bash
# Activate virtual environment
source venv/bin/activate

# Ensure dependencies are installed
pip install fastapi sqlalchemy pydantic-ai openai python-dateutil

# Run the implementation
# (Provide this file to Claude Code)
```

After implementation, start the server with:
```bash
uvicorn app.main:app --reload
```

And access:
- API Docs: http://localhost:8000/docs
- FinOps Endpoints: http://localhost:8000/api/finops/
- AI Query: POST to http://localhost:8000/api/finops/ai/query
