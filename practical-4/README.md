# Practical 4 Report: SAST with Snyk in GitHub Actions

## ## Repository
### **Source Code**: The complete source code for this practical is available in the GitHub repository:  
#### **Repository Link**: https://github.com/DechenWangdraSherpa/cicd-demo

## Executive Summary

This practical focused on implementing Static Application Security Testing (SAST) using Snyk integrated with GitHub Actions. The goal was to establish automated security scanning within the CI/CD pipeline to identify vulnerabilities early in the development lifecycle.

## Objectives

* Set up Snyk account and obtain API toke
* Configure GitHub Secrets for secure token storage
* Integrate Snyk scanning into existing GitHub Actions workflow
* Implement vulnerability detection and reporting
* Configure severity thresholds and fail conditions

## Implementation Details
### 1. Snyk Account Setup

* Created Snyk account via GitHub OAuth integration
* Generated API token for programmatic access
* Connected Snyk to repository for continuous monitoring

### 2. GitHub Actions Integration

Enhanced the existing workflow with comprehensive security scanning:

```
security:
  needs: test
  name: Security Analysis with Snyk
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - name: Run Snyk vulnerability scan
      uses: snyk/actions/maven@master
      env:
        SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
      with:
        args: --severity-threshold=high --fail-on=upgradable
```

### 3. Security Configuration

* Severity Threshold: Set to "high" to focus on critical vulnerabilities
* Fail Conditions: Configured to fail on upgradable vulnerabilities
* SARIF Integration: Results uploaded to GitHub Security tab
* Monitoring: Continuous dependency monitoring in Snyk dashboard

## Key Features Implemented
### Automated Security Scanning

* Triggers on every push and pull request to master branch
* Runs after successful test execution
* Provides immediate feedback on security issues

### Vulnerability Management

* Detection: Identifies vulnerabilities in dependencies
* Prioritization: Focuses on high-severity issues
* Remediation: Provides upgrade paths and patches
* Reporting: Integrated with GitHub Security tab

### Security Controls

* Fail-fast: Build fails on critical vulnerabilities
* Thresholds: Configurable severity levels
* Monitoring: Continuous security posture assessment

## Results and Outcomes
### Security Posture Improvement

* Early Detection: Vulnerabilities identified during development phase
* Automated Enforcement: Security gates prevent vulnerable code merges
* Visibility: Clear reporting through GitHub Security tab
* Remediation Guidance: Actionable fix recommendations provided

## Integration Benefits

* Seamless Workflow: Security scanning integrated into existing CI/CD
* Developer Experience: Minimal configuration required
* Comprehensive Coverage: Scans both dependencies and code
* Compliance Ready: Audit trail of security scans


## Lessons Learned

* Security Integration: SAST tools can be seamlessly integrated into CI/CD pipelines
* Early Detection: Identifying vulnerabilities during development reduces remediation costs
* Automated Enforcement: Automated security gates ensure consistent policy application
* Developer Empowerment: Providing clear remediation guidance enables quick fixes

## Conclusion

The implementation successfully established automated security scanning using Snyk within the GitHub Actions pipeline. This provides continuous security assessment, early vulnerability detection, and enforced security standards without disrupting development workflows. The solution demonstrates how modern development practices can incorporate robust security measures efficiently.