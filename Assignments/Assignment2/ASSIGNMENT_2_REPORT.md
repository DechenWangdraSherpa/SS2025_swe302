# Assignment 2: SAST & DAST Security Testing Report

## Executive Summary

This report documents the comprehensive security assessment of the RealWorld Conduit application using both Static Application Security Testing (SAST) and Dynamic Application Security Testing (DAST) methodologies. The assessment identified critical security vulnerabilities and implemented appropriate remediation measures, significantly improving the application's security posture.

## Assessment Overview

### Tools Used
- **SAST**: Snyk (dependency scanning), SonarQube (code quality analysis)
- **DAST**: OWASP ZAP (vulnerability scanning)
- **Scope**: Full-stack application (Go backend + React frontend)

### Testing Methodology
1. **Static Analysis**: Code and dependency vulnerability scanning
2. **Dynamic Analysis**: Runtime vulnerability assessment
3. **Remediation**: Vulnerability fixes and security enhancements
4. **Verification**: Post-fix validation scanning

## Part A: Static Application Security Testing (SAST)

### Snyk Analysis Results

**Backend Security Scan**:

![alt text](<Part A(SAST Report)/Images/3.backendSASTwithSynk.png>)
*Initial backend vulnerability scan showing 2 high-severity issues*

**Frontend Security Scan**:

![alt text](<Part A(SAST Report)/Images/4.frontendSASTwithSynk.png>)

*Frontend dependency scan revealing 6 vulnerabilities*

**Critical Vulnerabilities Identified**:
1. **SQLite3 Buffer Overflow** (High severity)
2. **JWT Authentication Bypass** (High severity) 
3. **Form-data Predictable Values** (Critical severity)
4. **Multiple ReDoS in Marked** (5 Medium severity)

**Remediation Actions**:

![alt text](<Part A(SAST Report)/Images/vulnerabilitiesafter(npm install cross-env --save-dev).png>)

*Installing secure dependency versions*
- Upgraded `go-sqlite3` from v1.14.15 to v1.14.18
- Migrated from `dgrijalva/jwt-go` to `golang-jwt/jwt/v4`
- Updated `superagent` from v3.8.3 to v10.2.2
- Upgraded `marked` from v0.3.19 to v4.0.10

**Verification**:
![alt text](<Part A(SAST Report)/Images/5.1 BACKEND(testSYNK passing).png>)

![alt text](<Part A(SAST Report)/Images/5.2 FRONTEND(testSYNK passing).png>)
*Final verification showing 0 vulnerabilities after fixes*

### SonarQube Code Quality Analysis

**Project Dashboard**:

![alt text](<Part B(SonarQube Report)/image/1.Myproject.png>)
*Overview of both backend and frontend projects in SonarQube*

**Backend Analysis**:

![alt text](<Part B(SonarQube Report)/image/2.Backend-Issue.png>)
*Go backend analysis showing code quality issues and security hotspots*

**Frontend Analysis**:

![alt text](<Part B(SonarQube Report)/image/3.Frontend-Issue.png>)
*React frontend analysis identifying JavaScript/React-specific issues*

**Key Findings**:
- **Backend**: 1.7k LOC with security hotspots in JWT implementation
- **Frontend**: 2.2k LOC with React best practice violations
- **Security Hotspots**: Hardcoded secrets, input validation gaps
- **Code Quality**: Multiple code smells and maintainability issues

## Part B: Dynamic Application Security Testing (DAST)

### OWASP ZAP Security Assessment

**ZAP Alerts**:

![alt text](<Part B(z DAST Report)/image/1 alert.png>)
*OWASP ZAP identifying security vulnerabilities during active scanning*

**Passive Scan Results**:
- **4 Medium risk** vulnerabilities
- **2 Low risk** issues  
- **6 Informational** findings

**Active Scan Results**:
- **2 High risk** vulnerabilities (SQL Injection, XSS)
- **5 Medium risk** issues (IDOR, Rate Limiting, Information Disclosure)
- **8 Low risk** findings

### Critical Vulnerabilities Discovered

#### 1. SQL Injection
- **Location**: Article search functionality
- **Risk**: High
- **Impact**: Database compromise
- **Fix**: Implemented parameterized queries

#### 2. Cross-Site Scripting (XSS)
- **Location**: Article comment system
- **Risk**: High  
- **Impact**: Session theft, content manipulation
- **Fix**: Added input sanitization

#### 3. Security Misconfiguration
- **Missing security headers** (CSP, X-Frame-Options, etc.)
- **Information disclosure** in error messages
- **JWT token storage** issues

## Security Improvements Implemented

### Backend Security Enhancements
```go
// Security headers middleware
router.Use(func(c *gin.Context) {
    c.Header("X-Frame-Options", "DENY")
    c.Header("X-Content-Type-Options", "nosniff")
    c.Header("X-XSS-Protection", "1; mode=block")
    c.Header("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
    c.Header("Content-Security-Policy", "default-src 'self'")
    c.Next()
})
```

## Frontend Security Improvements
* Updated vulnerable dependencies
* Enhanced input validation
* Improved token security
* Added security headers

## Risk Assessment Summary

### Vulnerability Reduction
| Risk Level | Before | After | Improvement |
|------------|--------|-------|-------------|
| High | 4 | 0 | 100% |
| Medium | 11 | 1 | 91% |
| Low | 14 | 3 | 79% |
| **Total** | **29** | **4** | **86%** |

### OWASP Top 10 Coverage
* A03: Injection - SQLi and XSS fixed
* A02: Cryptographic Failures - JWT security improved
* A01: Broken Access Control - IDOR vulnerabilities resolved
* A05: Security Misconfiguration - Headers implemented
* A07: Identification Failures - Authentication strengthened

## Remaining Risks & Recommendations

### Outstanding Issues
1. **Rate Limiting** (Medium risk) - Not fully implemented
2. **Advanced CSP** (Low risk) - Basic policy only
3. **Markdown XSS** (Low risk) - Minor rendering issue

### Production Recommendations
1. **Immediate**: Implement comprehensive rate limiting
2. **Short-term**: Refine Content Security Policy
3. **Long-term**: Regular security testing and monitoring

## Conclusion

The security assessment successfully identified and remediated critical vulnerabilities in the RealWorld Conduit application. Through systematic SAST and DAST testing, we achieved an 86% reduction in security vulnerabilities and significantly improved the application's security posture.


**Final Security Rating: 8/10**

The application now demonstrates strong security fundamentals with proper input validation, secure authentication, and comprehensive security headers. While some minor improvements remain, the application is significantly more secure and ready for production deployment.