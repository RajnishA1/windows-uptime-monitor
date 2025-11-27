# Windows Uptime Monitor – Full Documentation

Track **Laptop/PC ON Time**, **Shutdown Time**, and **Total Running Hours** automatically. This system logs your device activity to a remote API using a PowerShell script, Task Scheduler, or Shutdown Script.

---

## 🚀 Features

* Logs **when your computer was turned ON**
* Logs **when it was shut down**
* Logs **total ON time between boot → shutdown**
* Sends data automatically to your API endpoint
* Works for **multiple computers**
* Auto-clean older logs from the backend

---
# 📡 API Documentation — Windows Uptime Logger

The system exposes **two main endpoints**.

---

## 1. Send System Log (PowerShell Script Endpoint)

**Endpoint:**  
`POST https://send-boot-shutdown-v1.onrender.com/system/log/createSystemLog`

**Request Payload:**
```json
{
  "device": "DESKTOP-DS38AG8",
  "lastBootTime": "2025-11-27 10:42:00",
  "lastShutdownTime": "2025-11-27 10:46:00"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Log saved successfully"
}
```

---

## 2. Get System Logs

**Endpoint:**  
`GET https://send-boot-shutdown-v1.onrender.com/system/log/getSystemLog`

**Response Example:**
```json
{
  "success": true,
  "data": {
    "Manish Rj Pc": [
      {
        "device": "Manish Rj Pc",
        "bootTime": "27 Nov 2025, 05:09 PM",
        "shutdownTime": "27 Nov 2025, 05:11 PM",
        "totalOnTime": "0 hours 1 minute"
      }
    ]
  }
}
```


# Windows Uptime Monitor – Quick Testing Guide

## 🔥 Direct Testing (Without Task Scheduler)

If you want to TEST the system immediately:

### ✅ Step 1 — Open PowerShell (Run as Administrator)
Press:
```
Win + X → Windows PowerShell (Admin)
```

### ✅ Step 2 — Copy & Paste Your Script
Just paste your full PowerShell script into the PowerShell window and press **Enter**.

It will immediately:
- Detect last boot time
- Capture current shutdown trigger time (current time)
- Send log to API
- Show success message

### ⚠️ NOTE
This is ONLY for manual testing.  
For automation, use Task Scheduler + Shutdown Script method.

---

## 📌 Script File Path (Recommended)
Save your script permanently at:
```
C:\SystemMonitor\log-uptime.ps1
```

Then use Task Scheduler or Group Policy to run automatically on shutdown.

---

## 👍 You're Ready!
Now you can test logs anytime before full automation.






# 📌 1. PowerShell Script (Place on Each Windows PC)

Save this script as:

```
C:\SystemMonitor\log-uptime.ps1
```

### ✅ PowerShell Script

```
# ---------------- CONFIG ----------------
$ApiUrl = "https://send-boot-shutdown-v1.onrender.com/system/log/createSystemLog"
$ApiKey = "YOUR_API_KEY"
# ---------------------------------------

# ---------------- CURRENT BOOT TIME ----------------
try {
    $shutdownTime = Get-Date
    $lastBoot = (Get-CimInstance Win32_OperatingSystem).LastBootUpTime
} catch {
    $lastBoot = $null
}

# ---------------- CURRENT SHUTDOWN TIME ----------------
$shutdownTime = Get-Date

# ---------------- PAYLOAD ----------------
$payload = [PSCustomObject]@{
    device           = "Your Device Name"
    lastBootTime     = $lastBoot.ToString("yyyy-MM-dd HH:mm:ss")
    lastShutdownTime = $shutdownTime.ToString("yyyy-MM-dd HH:mm:ss")
}

$json = $payload | ConvertTo-Json -Depth 2

# ---------------- SEND TO API ----------------
try {
    $headers = @{ "Content-Type" = "application/json" }
    if ($ApiKey -and $ApiKey.Length -gt 0) { $headers["x-api-key"] = $ApiKey }

    $response = Invoke-RestMethod -Uri $ApiUrl -Method POST -Body $json -Headers $headers -TimeoutSec 15
    Write-Host "Data sent to API successfully:" ($response | ConvertTo-Json -Depth 2)
} catch {
    Write-Error "Failed to send data: $_"
}
```

---

# Windows Uptime Monitor - Documentation

## 🖥️ Task Scheduler Setup for Shutdown Script

This guide shows how to automatically run a PowerShell script on Windows shutdown to log your PC/Laptop ON and Shutdown times to the API.

---

### 1️⃣ Create Folder & Save Script

1. Create a folder:

```
C:\SystemMonitor
```

2. Save your PowerShell script inside this folder as:

```
log-uptime.ps1
```

---

### 2️⃣ Open Task Scheduler

1. Press **Win + R**
2. Type `taskschd.msc` and press **Enter**

---

### 3️⃣ Create a New Task

1. Click **Create Task…** (do not select "Create Basic Task")
2. Name the task: **Windows Uptime Logger**

---

### 4️⃣ Configure the General Tab

Check the following options:

* ✅ **Run whether user is logged on or not**
* ✅ **Run with highest privileges**

---

### 5️⃣ Add Shutdown Trigger

1. Press **Win + R**, type `gpedit.msc`, press **Enter**
2. Navigate to:

```
Computer Configuration → Windows Settings → Scripts (Startup/Shutdown)
```

3. Double-click **Shutdown** → click **Add…** → **Browse**
4. Select your script:

```
C:\SystemMonitor\log-uptime.ps1
```

5. Click **OK** to save

---

### 6️⃣ Verify Task

* Optionally, test your script manually by right-click → **Run**
* Check **Event Viewer → Windows Logs → System** for script execution logs

---

### 7️⃣ Outcome

* Every time your PC shuts down, the script will run automatically
* Logs **Boot Time**, **Shutdown Time**, and calculates **Total ON Time**
* Sends data to your API endpoint automatically

---

**End of Task Scheduler Guide**

