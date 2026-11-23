# EcoCycle – Performance Testing Analysis

## 1. Introduction

This report presents the performance testing results for the EcoCycle web application's backend health endpoint. Apache JMeter was used to measure response times and throughput under different levels of concurrent users.

## 2. Testing Environment

| Item | Details |
|---|---|
| Operating System | Windows 11 |
| Node.js | v26.13.1 |
| npm | 11.20.0 |
| Java | Temurin 21.0.12.1 |
| Apache JMeter | 5.6.3 |
| Backend | Express.js |
| Backend URL | http://127.0.0.1:5002 |
| Database | MongoDB Atlas |
| Test Endpoint | GET /api/health |

The tests were executed against the locally running backend. The application uses MongoDB Atlas as its database.

## 3. Test Scenarios

The following endpoint was selected:

`GET http://127.0.0.1:5002/api/health`

Three test scenarios were performed:

- Baseline test: 1 virtual user for 30 seconds.
- Concurrency test 1: 3 virtual users for 60 seconds.
- Concurrency test 2: 5 virtual users for 60 seconds.

A Constant Timer of 3000 milliseconds was used to introduce a delay between requests.

## 4. Performance Test Results

### 4.1 Baseline Test – 1 Virtual User

| Metric | Result |
|---|---:|
| Number of Users | 1 |
| Duration | 30 seconds |
| Total Requests | 9 |
| Average Response Time | 3 ms |
| Minimum Response Time | 1 ms |
| Maximum Response Time | 18 ms |
| Standard Deviation | 5.12 ms |
| Error Percentage | 0% |
| Throughput | 22.4 requests/minute |

**Observation:** The backend health endpoint responded quickly during the baseline test. No request failures were reported.

### 4.2 Concurrency Test – 3 Virtual Users

| Metric | Result |
|---|---:|
| Number of Users | 3 |
| Duration | 60 seconds |
| Total Requests | 57 |
| Average Response Time | 3 ms |
| Minimum Response Time | 1 ms |
| Maximum Response Time | 66 ms |
| Standard Deviation | 8.54 ms |
| Error Percentage | 0% |
| Throughput | 1.0 request/second |

**Observation:** The endpoint handled requests from three concurrent virtual users without reported failures. The maximum response time increased to 66 ms, although the average remained at 3 ms.

### 4.3 Concurrency Test – 5 Virtual Users

| Metric | Result |
|---|---:|
| Number of Users | 5 |
| Duration | 60 seconds |
| Total Requests | 93 |
| Successful Requests | 93 |
| Failed Requests | 0 |
| Average Response Time | 2.69 ms |
| Median Response Time | 2 ms |
| 95th Percentile (P95) | 5 ms |
| Minimum Response Time | 1 ms |
| Maximum Response Time | 25 ms |
| Error Percentage | 0% |
| Throughput | 1.7 requests/second |

**Observation:** All 93 requests completed successfully with HTTP 200 responses. The P95 response time was 5 ms, meaning 95% of the recorded requests completed within approximately 5 ms.

## 5. Comparison of Results

| Metric | 1 User | 3 Users | 5 Users |
|---|---:|---:|---:|
| Total Requests | 9 | 57 | 93 |
| Average Response Time | 3 ms | 3 ms | 2.69 ms |
| Minimum Response Time | 1 ms | 1 ms | 1 ms |
| Maximum Response Time | 18 ms | 66 ms | 25 ms |
| Error Percentage | 0% | 0% | 0% |
| Throughput | 0.373 req/s | 1.0 req/s | 1.7 req/s |
| P95 | Not recorded | Not recorded | 5 ms |

*Note: P95 values are included only for the 5-user test because the corresponding raw JTL results were available for that test.*

## 6. Analysis and Discussion

The results indicate that the backend health endpoint responded quickly under the tested conditions.

As the number of virtual users increased, the total number of completed requests and throughput also increased. The average response time remained low across all three tests.

The 5-user test recorded 93 successful requests with no failures. Its P95 response time was 5 ms, indicating consistently short response times for the tested requests.

However, these results represent only the `/api/health` endpoint. They do not establish the performance of the entire EcoCycle application, other API endpoints, or actual database query performance.

## 7. Limitations

- Testing was performed against the locally running backend.
- Only the backend health endpoint was tested.
- The tests do not represent a large-scale production load.
- Database query performance was not measured independently.
- P95 measurements are available only for the 5-user test.
- Browser performance and frontend loading time were not measured.
- A Git commit identifier and browser version were not recorded for this test run.
- HTTP 429 responses were not separately verified for the baseline and 3-user tests.

## 8. Conclusion

The performance tests showed that the EcoCycle backend health endpoint handled the tested workloads of one, three, and five virtual users with low average response times and no reported request failures.

The 5-user test achieved a P95 response time of 5 ms, with all