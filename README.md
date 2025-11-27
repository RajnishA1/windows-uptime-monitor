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
    device           = "Manish Rj Pc"
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

## ✔️ Step 2 — Enable PowerShell Script Execution

Open **PowerShell as Administrator** and run:

```
Set-ExecutionPolicy RemoteSigned
```

Press **Y**.

---

# 📌 3. Auto-Run Script on Shutdown (Recommended Method)

Windows does NOT have a built-in “Shutdown” trigger in Task Scheduler.
So the best method is **Group Policy Shutdown Script**.

## ✔️ Step 3 — Open Group Policy Editor

Press:

```
Win + R
```

Type:

```
gpedit.msc
```

Press Enter.

---

## ✔️ Step 4 — Add Shutdown Script

Navigate to:

```
Computer Configuration
    → Windows Settings
        → Scripts (Startup/Shutdown)
```

1. Double-click **Shutdown**
2. Click **Add**
3. Click **Browse**
4. Select:

```
C:\SystemMonitor\log-uptime.ps1
```

5. Click **OK**

🔥 Done!
Your script will now run **every time Windows shuts down**.

---

# 📌 4. Optional: Run Script via Task Scheduler

If you want Task Scheduler instead of gpedit:

## ✔️ Step 1 — Open Task Scheduler

```
taskschd.msc
```

## ✔️ Step 2 — Create Task

* Click **Create Task**
* Name: **Windows Uptime Logger**

### General Tab:

✔ Run whether user is logged on or not
✔ Run with highest privileges

### Triggers Tab:

⚠ Windows does NOT support shutdown trigger
But you can trigger:

* On workstation lock
* At logoff
* At startup (for data recovery)

### Actions Tab:

Action: **Start a Program**
Program:

```
powershell.exe
```

Arguments:

```
-ExecutionPolicy Bypass -File "C:\SystemMonitor\log-uptime.ps1"
```

---

# 📌 5. API Response Format

Your backend returns logs like:

```
{
  device: "DESKTOP-ABC123",
  bootTime: "27 Nov 2025, 10:20 AM",
  shutdownTime: "27 Nov 2025, 02:45 PM",
  totalOnTime: "4 hours 25 minutes"
}
```

---

# 📌 6. Backend Auto-Cleanup

Your backend automatically deletes logs older than **10 days**.

---

# 📌 7. Usage Summary

| Feature                     | Supported |
| --------------------------- | --------- |
| Track Boot Time             | ✅         |
| Track Shutdown Time         | ✅         |
| Track Total PC Running Time | ✅         |
| Auto-Log on Shutdown        | ✅         |
| Multi-PC Logs               | ✅         |
| Auto Cleanup                | ✅         |

---

# 📌 8. GitHub Repository

You can place this documentation into:

```
README.md
```

Repository:

```
https://github.com/RajnishA1/windows-uptime-monitor
```

---

