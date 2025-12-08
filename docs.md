# 🔒 CypherRay SDK Documentation

## Overview

CypherRay SDK is a powerful tool for firmware binary security analysis that integrates seamlessly into CI/CD pipelines. It automatically detects cryptographic algorithms, identifies vulnerabilities, and provides comprehensive security reports for embedded systems and IoT devices.

---

## 🎯 Core Capabilities

### 1. Automatic Binary Detection & Scanning
```javascript
// Scans entire project directories for firmware binaries
const scanner = new Scanner();
const files = await scanner.scan('./build');
// Finds: .bin, .elf, .hex, .out files automatically
```

### 2. Cryptographic Algorithm Detection
- Detects encryption algorithms (AES, RSA, ECC, etc.)
- Identifies weak/deprecated crypto (MD5, DES)
- Analyzes key management patterns

### 3. Vulnerability Assessment
- Finds security vulnerabilities in binary code
- Rates severity (Critical, High, Medium, Low)
- Provides remediation recommendations

### 4. Hash-Based Deduplication
```javascript
// If same binary analyzed before = instant results (no credits charged)
await analyzer.checkHash(fileHash);
// Cached results returned immediately
```

### 5. Batch Processing
```javascript
// Analyze multiple binaries concurrently
const results = await analyzer.analyzeBatch(files);
// Processes 5-10 files simultaneously
```

### 6. Multiple Report Formats
- Console output (colored terminal)
- JSON (for CI/CD pipelines)
- Markdown (for documentation)
- HTML (for human review)

### 7. CI/CD Integration
- Automatic pipeline failure on critical issues
- GitHub Actions, GitLab CI, Jenkins support
- PR comments with scan results

---

## 🚀 How to Add CypherRay to Your Codebase

### Scenario: IoT Firmware Company with Binary Build Process

#### Step 1: Install SDK
```bash
# In your project root
npm install @cypherray/sdk --save-dev
```

#### Step 2: Create Configuration
Create `cypherray.config.json`:
```json
{
  "apiUrl": "https://cypher-ray-backend.onrender.com/api/sdk",
  "scanPatterns": [
    "build/**/*.bin",      // Your compiled firmware
    "dist/**/*.elf",       // ELF executables
    "output/**/*.hex"      // Intel HEX files
  ],
  "ignorePatterns": [
    "**/test/**",
    "**/node_modules/**"
  ],
  "failOnCritical": true,  // Stop build if critical issues
  "failOnHigh": false,     // Allow high severity (can fix later)
  "reportFormat": "json",
  "outputFile": "security-report.json"
}
```

#### Step 3: Add Environment Variables
Create `.env`:
```bash
CYPHERRAY_API_KEY=your_api_key_here
CYPHERRAY_API_URL=https://cypher-ray-backend.onrender.com/api/sdk
```

#### Step 4: Add npm Scripts
Update `package.json`:
```json
{
  "scripts": {
    "build": "make clean && make all",
    "scan": "cypherray scan --directory ./build --format json",
    "scan:verbose": "cypherray scan -d ./build -v --format console",
    "build:secure": "npm run build && npm run scan"
  }
}
```

---

## 📋 Real-World Integration Examples

### Example 1: GitHub Actions CI/CD
`.github/workflows/firmware-security.yml`:
```yaml
name: Build & Security Scan

on: [push, pull_request]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Firmware
        run: make all
      
      - name: CypherRay Security Scan
        env:
          CYPHERRAY_API_KEY: ${{ secrets.CYPHERRAY_API_KEY }}
        run: |
          npm install @cypherray/sdk
          npx cypherray scan --directory ./build --stop-on-critical
      
      - name: Upload Report
        uses: actions/upload-artifact@v3
        with:
          name: security-report
          path: cypherray-report.json
```

### Example 2: Programmatic Usage in Custom Build Script
`scripts/secure-build.js`:
```javascript
import { Scanner, Analyzer, Reporter } from '@cypherray/sdk';

async function secureBuild() {
  // 1. Build your firmware
  console.log('Building firmware...');
  await exec('make clean && make all');
  
  // 2. Scan for binaries
  const scanner = new Scanner();
  const files = await scanner.scan('./build');
  console.log(`Found ${files.length} binaries`);
  
  // 3. Analyze
  const analyzer = new Analyzer();
  const results = await analyzer.analyzeBatch(files);
  
  // 4. Check results
  const hasCritical = results.some(r => 
    r.results?.vulnerability_assessment?.severity === 'CRITICAL'
  );
  
  if (hasCritical) {
    console.error('❌ CRITICAL vulnerabilities found!');
    process.exit(1); // Fail build
  }
  
  // 5. Generate report
  const reporter = new Reporter({ format: 'markdown' });
  await reporter.generateReport(results);
  
  console.log('✅ Security scan passed!');
}

secureBuild();
```

### Example 3: Pre-Commit Hook
`.git/hooks/pre-commit`:
```bash
#!/bin/bash

# Build firmware
make all

# Scan binaries
npx cypherray scan --directory ./build --format console

# Exit code determines if commit proceeds
exit $?
```

---

## 🎯 Use Cases by Organization Type

### IoT Device Manufacturer
```javascript
// Scan router firmware before shipping
scanPatterns: [
  "firmware/v*.bin",
  "bootloader/*.elf"
]
```

### Automotive Firmware Team
```javascript
// Analyze ECU binaries
scanPatterns: [
  "build/ecu/**/*.hex",
  "build/can-controller/*.bin"
]
```

### Medical Device Company
```javascript
// FDA compliance - scan embedded firmware
scanPatterns: [
  "device-firmware/*.bin",
  "bootloader/*.elf"
],
failOnCritical: true,  // Must pass for compliance
failOnHigh: true
```

### Smart Home Devices
```javascript
// Scan Alexa/Google Home compatible firmware
scanPatterns: [
  "dist/smart-speaker/*.bin",
  "dist/camera-firmware/*.elf"
]
```

---

## 🔑 Key Features for Organizations

### 1. Zero Code Changes to Firmware
- Just add SDK to build pipeline
- No modifications to your C/C++ code
- Works with existing build tools (make, cmake, platformio)

### 2. CI/CD Native
```bash
# One command in pipeline
npx cypherray scan --directory ./build --stop-on-critical
# Exit code 1 = build fails if critical issues found
```

### 3. Cost Optimization
```javascript
// Hash-based deduplication = FREE re-scans
// Same binary = 0 credits charged
// Only NEW/CHANGED binaries consume credits
```

### 4. Developer-Friendly Reports
```javascript
// Terminal output with colors
✓ bootloader.bin - No vulnerabilities
⚠ firmware.bin - 2 HIGH severity issues
❌ app.elf - 1 CRITICAL vulnerability

// Or JSON for automation
{
  "file": "firmware.bin",
  "vulnerabilities": [...],
  "cryptoAlgorithms": [...]
}
```

### 5. Real-Time Progress Tracking
```javascript
// Socket.IO connection shows live progress
[SDK] Uploading bootloader.bin... 
[SDK] Analysis started (Job ID: 67abc123)
[SDK] Progress: 40% - Analyzing...
[SDK] ✓ Complete - 0 vulnerabilities
```

---

## 📦 Complete Integration Workflow

```bash
# 1. Organization adds to existing project
cd /path/to/firmware-project
npm install @cypherray/sdk --save-dev

# 2. Create config (one-time)
echo '{
  "scanPatterns": ["build/**/*.bin"],
  "failOnCritical": true
}' > cypherray.config.json

# 3. Get API key from CypherRay dashboard
export CYPHERRAY_API_KEY="sk_xyz123..."

# 4. Add to build pipeline
# package.json
"scripts": {
  "build": "make",
  "scan": "cypherray scan -d ./build",
  "release": "npm run build && npm run scan"
}

# 5. Run on every build
npm run release
```

---

## ⚡ Performance Optimization

### Buffer Mode (Optimized Backend)

Our latest backend optimization eliminates the Cloudinary download bottleneck:

#### Before (Cloudinary Mode):
```
User uploads file (10MB)
   ↓ 2-3 seconds: Upload to Cloudinary
Queue receives job
   ↓ 2-5 seconds: Download from Cloudinary ⏰ BOTTLENECK!
   ↓ 3-30 seconds: ML analysis
   ↓ 1 second: Save results
Total: ~8-39 seconds
```

#### After (Buffer Mode):
```
User uploads file (10MB)
   ↓ 0.1 seconds: Store in memory buffer
Queue receives job
   ↓ 0.1-0.3 seconds: Write buffer to temp file ⚡ FAST!
   ↓ 3-30 seconds: ML analysis
   ↓ 1 second: Save results
   ↓ Background: Upload to Cloudinary (doesn't block!)
Total: ~4-32 seconds
```

### Speed Improvement:
- **Small files (5MB)**: `8s → 4s` = **50% faster** ⚡
- **Medium files (20MB)**: `15s → 10s` = **33% faster** ⚡
- **Large files (80MB)**: `39s → 32s` = **18% faster** ⚡

### Concurrent Processing:
**5 users uploading 15MB files:**
- **Before**: 60 seconds total
- **After**: 35 seconds total
- **Result**: **42% faster throughput!** 🎉

---

## 🛠️ SDK API Reference

### Scanner Class

```javascript
import { Scanner } from '@cypherray/sdk';

const scanner = new Scanner({
  patterns: ['build/**/*.bin', 'dist/**/*.elf'],
  ignorePatterns: ['**/test/**'],
  verbose: true
});

// Scan directory
const files = await scanner.scan('./build');

// Scan single file
const fileInfo = await scanner.scanFile('./build/firmware.bin');

// Get statistics
const stats = scanner.getStats(files);
// Returns: { totalSizeMB, extensionCounts, fileCount }
```

### Analyzer Class

```javascript
import { Analyzer } from '@cypherray/sdk';

const analyzer = new Analyzer({
  apiKey: 'your-api-key',
  apiUrl: 'https://cypher-ray-backend.onrender.com/api/sdk',
  maxConcurrent: 5
});

// Check if hash exists (cache)
const cached = await analyzer.checkHash(fileHash);

// Analyze single file
const result = await analyzer.analyzeSingle(fileInfo);

// Analyze multiple files
const results = await analyzer.analyzeBatch(files);

// Poll for results (automatic)
const job = await analyzer.pollForResults(jobId);
```

### Reporter Class

```javascript
import { Reporter } from '@cypherray/sdk';

const reporter = new Reporter({
  format: 'json',        // 'console' | 'json' | 'markdown' | 'html'
  outputPath: './report.json'
});

// Generate report
const summary = await reporter.generateReport(results, stats);

// Check if should stop build
const exitInfo = reporter.shouldStopBuild(results, stopOnCritical);
if (exitInfo.shouldStop) {
  process.exit(exitInfo.exitCode);
}
```

---

## 📊 Report Formats

### Console Output
```
🔍 CypherRay Security Scan Results

Files Analyzed: 3
Credits Charged: 2
Cached Results: 1

┌─────────────────┬────────┬──────────────┬─────────────┐
│ File            │ Status │ Vulnerabilities │ Algorithms  │
├─────────────────┼────────┼──────────────┼─────────────┤
│ bootloader.bin  │ ✓ PASS │ 0            │ AES-256     │
│ firmware.bin    │ ⚠ WARN │ 2 HIGH       │ RSA-2048    │
│ app.elf         │ ✗ FAIL │ 1 CRITICAL   │ MD5 (weak)  │
└─────────────────┴────────┴──────────────┴─────────────┘
```

### JSON Output
```json
{
  "summary": {
    "totalFiles": 3,
    "creditsCharged": 2,
    "cached": 1,
    "criticalIssues": 1,
    "highIssues": 2
  },
  "results": [
    {
      "filename": "firmware.bin",
      "status": "completed",
      "cached": false,
      "results": {
        "detected_algorithms": [
          {
            "algorithm_name": "AES-256",
            "confidence_score": 0.95,
            "algorithm_class": "Symmetric"
          }
        ],
        "vulnerability_assessment": {
          "has_vulnerabilities": true,
          "severity": "HIGH",
          "vulnerabilities": ["Buffer overflow in crypto_init()"],
          "recommendations": ["Update to latest crypto library"]
        }
      }
    }
  ]
}
```

---

## ✅ Summary: What Organizations Get

1. **Automated Security**: Scan every build automatically
2. **No Firmware Changes**: Works with existing binaries
3. **Fast Results**: 4-32 seconds per binary (with optimization!)
4. **Cost Effective**: Hash deduplication = only pay for new/changed files
5. **Multiple Formats**: JSON, Markdown, HTML, Console
6. **CI/CD Ready**: GitHub Actions, GitLab, Jenkins, etc.
7. **Compliance**: Security reports for audits/certifications
8. **Crypto Detection**: Find weak algorithms before deployment
9. **Real-Time Progress**: Live updates via WebSocket
10. **Batch Processing**: Analyze multiple files concurrently

---

## 🎯 Perfect For

- **IoT Devices**: Smart home, wearables, sensors
- **Automotive**: ECU firmware, ADAS systems
- **Medical Devices**: FDA compliance, patient safety
- **Industrial Control**: SCADA, PLCs, robotics
- **Consumer Electronics**: Cameras, routers, speakers
- **Embedded Systems**: Any firmware/binary analysis

---

## 🔐 Security & Privacy

- **API Key Authentication**: Secure access control
- **Private Cloud Storage**: Files stored securely on Cloudinary
- **Automatic Cleanup**: Files deleted after 24 hours
- **Hash-Based Deduplication**: No duplicate uploads
- **TLS Encryption**: All data transmitted securely

---

## 📞 Support

- **Documentation**: https://github.com/Bohar-s-Bit/cypherray-sdk
- **Issues**: https://github.com/Bohar-s-Bit/cypherray-sdk/issues
- **Email**: support@cypherray.com

---

*Last Updated: November 2025*