# Windows Uptime & Shutdown Tracker API Documentation

This document provides a detailed guide on using the Windows Laptop/PC Uptime and Shutdown Tracker, including its APIs and how to set up the automated system.

---

## 1. Overview

This system automatically tracks:

* **Laptop/PC ON Time**
* **Shutdown Time**
* **Total ON Duration**

It sends this data to a REST API so you can monitor your devices remotely.

---

## 2. PowerShell Script

Save the following PowerShell script on each Windows machine you want to track.

```powershell
# ---------------- CONFIG ----------------
$ApiUrl = "https://send-boot-shutdown-v1.onrender.com/system/log/createSystemLog"
$ApiKey = "YOUR_API_KEY"  # Optional
# ---------------------------------------

try {
    # Current boot time (when system turned on)
    $lastBoot = (Get-CimInstance Win32_OperatingSystem).LastBootUpTime
} catch {
    $lastBoot = $null
}

# Current shutdown time (script runs on shutdown)
$shutdownTime = Get-Date

# Payload to send
$payload = [PSCustomObject]@{
    device           = $env:COMPUTERNAME
    lastBootTime     = $lastBoot.ToString("yyyy-MM-dd HH:mm:ss")
    lastShutdownTime = $shutdownTime.ToString("yyyy-MM-dd HH:mm:ss")
}

# Convert to JSON
$json = $payload | ConvertTo-Json -Depth 2

# Send to API
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

## 3. Setting Up Task Scheduler (Windows)

Follow these steps to run the script automatically during shutdown.

### Step 1 — Save PowerShell Script

* Open Notepad.
* Paste the script above.
* Save as `C:\SystemMonitor\log-uptime.ps1` (you can choose any folder, keep it permanent).

### Step 2 — Open Task Scheduler

* Press `Win + R`, type `taskschd.msc`, press Enter.

### Step 3 — Create New Task

* Click **Create Task…** (NOT Create Basic Task)
* Name: `Windows Uptime Logger`

### Step 4 — General Tab

* Check **Run whether user is logged on or not**
* Check **Run with highest privileges**

### Step 5 — Configure Shutdown Trigger

**Option 1 (Recommended): Using Group Policy Shutdown Script**

* Press `Win + R`, type `gpedit.msc`
* Navigate to:

```
Computer Configuration -> Windows Settings -> Scripts (Startup/Shutdown)
```

* Double-click **Shutdown** → Click **Add** → Browse → Select `C:\SystemMonitor\log-uptime.ps1`
* Click OK

Now the script will run automatically whenever the PC shuts down.

---

## 4. API Endpoints

### 4.1 Create System Log (Script calls this)

* **Method:** POST
* **URL:** `https://send-boot-shutdown-v1.onrender.com/system/log/createSystemLog`
* **Headers:**

  * Content-Type: application/json
  * x-api-key: YOUR_API_KEY (if used)
* **Body Example:**

```json
{
  "device": "DESKTOP-DS38AG8",
  "lastBootTime": "2025-11-27 09:00:00",
  "lastShutdownTime": "2025-11-27 17:00:00"
}
```

* **Response Example:**

```json
{
  "success": true,
  "message": "System log saved successfully"
}
```

### 4.2 Get System Logs

* **Method:** GET
* **URL:** `https://send-boot-shutdown-v1.onrender.com/system/log/getSystemLog`
* **Query Parameters:**

  * `device` (optional) — filter logs by device name
* **Response Example:**

```json
{
  "success": true,
  "data": [
    {
      "device": "DESKTOP-DS38AG8",
      "bootTime": "27 Nov 2025, 09:00 AM",
      "shutdownTime": "27 Nov 2025, 05:00 PM",
      "totalOnTime": "8 hours 0 minutes"
    }
  ]
}
```

---

## 5. Notes

* Keep the PowerShell script in a permanent folder.
* Ensure your device has network access to send data to the API.
* The script calculates total ON time using the difference between last boot time and shutdown time.
* Logs older than 10 days may be automatically removed from the database to save storage.

---

## 6. Example Workflow

1. System starts → Boot time recorded internally.
2. System shuts down → PowerShell script triggers → Sends boot + shutdown time to API.
3. API saves data and calculates total ON duration.
4. Fetch logs via GET `/system/log/getSystemLog`.

---

This setup allows monitoring multiple Windows machines and tracking their uptime and shutdown durations automatically.
