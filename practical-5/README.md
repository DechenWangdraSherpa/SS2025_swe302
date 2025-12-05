# Practical_05 Report: Integration Testing with TestContainers for Database Testing

## Repository
### **Source Code**: The complete source code for this practical is available in the GitHub repository:  
#### **Repository Link**:https://github.com/DechenWangdraSherpa/swe302-practical5

## Overview

This project presents a comprehensive and methodical approach to backend testing and data handling through the integration of TestContainers and an isolated PostgreSQL environment. The implementation enables verification of application behavior against real database instances rather than mocked dependencies. The system encompasses complete CRUD operations along with advanced querying capabilities, including pattern matching, record counting, and temporal filtering. Additionally, the testing framework incorporates transactional behavior validation and isolation level verification to guarantee data consistency. The setup further demonstrates multi-container orchestration, specifically PostgreSQL and Redis integration, with Redis employed to evaluate caching mechanisms within a production-like multi-service ecosystem.

## Prerequisites

- Go 1.21 or higher
- Docker Desktop running
- 500MB disk space for Docker images

## Project Structure

```
practical_05/
├── models/
│   └── user.go                          
├── repository/
│   ├── user_repository.go               
│   ├── user_repository_test.go          
│   ├── cached_user_repository.go        
│   └── cached_user_repository_test.go   
├── migrations/
│   └── init.sql                         
├── go.mod 
└── go.sum                              
                            
```
## TestContainers Integration

TestContainers provides a framework for executing real PostgreSQL and Redis instances within Docker containers during integration testing. Each test suite manages container lifecycle, initializes database schemas, and maintains consistent state across test iterations. Container cleanup is automated following test execution, ensuring compatibility with continuous integration and delivery workflows and enabling reproducible testing environments.

**Key Advantages:**
- Real database systems in lieu of mock implementations
- Automated provisioning and deprovisioning
- Complete test state isolation
- Production-equivalent testing environment

## Testing Approach

The testing framework employs the following methodologies:

- **TestMain**: Orchestrates container initialization and database connection establishment prior to test execution, with subsequent resource deallocation following completion.
- **CRUD Operations**: Comprehensive validation of all fundamental operations including creation, retrieval, modification, and deletion.
- **Advanced Queries**: Implementation of pattern-based matching, user enumeration, and temporal filtering mechanisms.
- **Transactional Validation**: Assessment of atomicity guarantees, rollback mechanisms, and concurrent data access scenarios.
- **Multi-Container Integration**: Parallel testing of PostgreSQL and Redis services to evaluate cache performance and consistency.

**Isolation Strategies:**
- Systematic cleanup following each test execution (`defer repo.Delete(id)`)
- Transactional rollback mechanisms for specific test scenarios
- Optional deployment of isolated container instances per test for complete state separation

## Key Exercises & Coverage

### 1. Basic CRUD Operations
The test suite validates fundamental data persistence operations through the following test cases: `TestGetByID`, `TestGetByEmail`, `TestCreate`, `TestUpdate`, `TestDelete`, and `TestList`.

### 2. Advanced Query Operations
The implementation incorporates sophisticated query mechanisms including `FindByNamePattern` for textual search, `CountUsers` for aggregation, and `GetRecentUsers` for temporal-based filtering.

### 3. Transactional Behavior Validation
The framework assesses multi-operation consistency through `BatchCreate` for bulk insertion, `TransferUserData` for atomic multi-step operations, `TestTransactionRollback` for failure recovery, and `TestConcurrentWrites` for concurrent access patterns.

### 4. Multi-Container Testing
The system evaluates distributed caching functionality, including cache hit/miss scenarios, cache invalidation mechanisms, and time-to-live (TTL) behaviors.

## Test Execution

The testing framework supports multiple execution modes and configuration options:

**Comprehensive Test Suite:**
```bash
go test ./... -v
```

**Coverage Analysis:**
```bash
go test -cover ./repository
go test -coverprofile=coverage.out ./repository
go tool cover -html=coverage.out
```

**Race Condition Detection:**
```bash
go test -race ./repository
```

**Targeted Test Execution:**
```bash
go test ./repository -run TestGetByID -v
```

**Abbreviated Test Execution:**
```bash
go test ./repository -short
```

## Challenges & Mitigation Strategies

| Technical Challenge                       | Implementation Strategy                                |
|---------------------------------------------|--------------------------------------------------------|
| Container initialization latency            | Alpine-based image selection with extended timeout configuration |
| Cross-test data state contamination         | Post-test cleanup procedures and transactional rollback mechanisms |
| Container port binding conflicts            | Dynamic port allocation via TestContainers framework   |
| CI/CD environment compatibility             | Docker availability verification and portable configuration management |
| Extended image acquisition durations        | Pre-fetched container images and optimized layer caching |
| Unintended state persistence across tests   | Systematic table truncation or isolated container deployment




## Conclusion

This implementation demonstrates the efficacy of integration testing methodologies when TestContainers are employed to establish production-equivalent testing environments. The framework ensures test independence, thereby preventing cross-test interference and facilitating reliable, repeatable validation cycles. The concurrent operation of PostgreSQL and Redis services provides authentic representation of distributed caching scenarios, enabling comprehensive assessment of data consistency across multiple service tiers. The system operates effectively in both local development and CI/CD deployment contexts, establishing practical utility within contemporary software development workflows. The structured initialization and teardown processes implemented via TestMain, coupled with comprehensive data hygiene protocols and transaction-based isolation mechanisms, establish a robust and dependable testing infrastructure suitable for professional-grade software development.
