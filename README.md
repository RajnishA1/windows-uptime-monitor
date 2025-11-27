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
📡 API Documentation — Windows Uptime Logger

The system exposes two main endpoints:

1. Send System Log (PowerShell Script Endpoint)

Endpoint:

POST https://send-boot-shutdown-v1.onrender.com/system/log/createSystemLog


Description:
Automatically receives your PC/Laptop boot time and shutdown time via the PowerShell script when triggered on system shutdown.

Request Payload (JSON):

{
  "device": "DESKTOP-DS38AG8",
  "lastBootTime": "2025-11-27 10:42:00",
  "lastShutdownTime": "2025-11-27 10:46:00"
}


Response Example:

{
  "success": true,
  "message": "Log saved successfully"
}

2. Get System Logs

Endpoint:

GET https://send-boot-shutdown-v1.onrender.com/system/log/getSystemLog


Description:
Fetches all system logs grouped by device. Shows boot time, shutdown time, and total ON time in a human-readable format.

Query Parameters:

device (optional) — Filter logs for a specific device.

Example Request:

GET https://send-boot-shutdown-v1.onrender.com/system/log/getSystemLog


Example Response:

{
  "success": true,
  "data": {
    "Manish Rj Pc": [
      {
        "device": "Manish Rj Pc",
        "bootTime": "27 Nov 2025, 05:09 PM",
        "shutdownTime": "27 Nov 2025, 05:11 PM",
        "totalOnTime": "0 hours 1 minute"
      },
      {
        "device": "Manish Rj Pc",
        "bootTime": "27 Nov 2025, 04:51 PM",
        "shutdownTime": "27 Nov 2025, 04:55 PM",
        "totalOnTime": "0 hours 3 minutes"
      }
    ],
    "Rajnish Rj Pc": [
      {
        "device": "Rajnish Rj Pc",
        "bootTime": "27 Nov 2025, 04:51 PM",
        "shutdownTime": "27 Nov 2025, 04:55 PM",
        "totalOnTime": "0 hours 3 minutes"
      }
    ],
    "DESKTOP-DS38AG8": [
      {
        "device": "DESKTOP-DS38AG8",
        "bootTime": "27 Nov 2025, 10:42 AM",
        "shutdownTime": "27 Nov 2025, 10:46 AM",
        "totalOnTime": "0 hours 3 minutes"
      },
      {
        "device": "DESKTOP-DS38AG8",
        "bootTime": "26 Nov 2025, 11:02 AM",
        "shutdownTime": "27 Nov 2025, 10:33 AM",
        "totalOnTime": "23 hours 30 minutes"
      }
    ]
  }
}


Notes:

All times are in local timezone (Asia/Kolkata).

totalOnTime is automatically calculated.

Logs are grouped by device, making it easy to track multiple PCs.

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

# 📌 2. Setup Instructions (Windows)

## ✔️ Step 1 — Create Folder & Save Script

1. Create folder:

```
C:\SystemMonitor
```

2. Save file:

```
log-uptime.ps1
```

inside this folder.

---

🖥️ Setup Task Scheduler (Windows) — Quick Steps

Save Script
Save your PowerShell script as:
C:\SystemMonitor\log-uptime.ps1

Open Task Scheduler
Press Win + R → type taskschd.msc → Enter

Create Task

Click Create Task…

Name: Windows Uptime Logger

General: ✅ Run whether user is logged on or not

General: ✅ Run with highest privileges

Add Shutdown Trigger

Press Win + R → gpedit.msc → Enter

Navigate: Computer Configuration → Windows Settings → Scripts (Startup/Shutdown)

Double-click Shutdown → Add → Browse → select your script

Verify

Check Event Viewer → Windows Logs → System

Confirm script runs on shutdown and API logs are received
