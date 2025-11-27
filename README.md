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
