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
