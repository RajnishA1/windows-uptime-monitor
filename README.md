Windows में Laptop/PC ON Time + Shutdown Time ट्रैक करके API पर भेजने वाला पूरी तरह ऑटोमेटेड सिस्टम।

इसका इस्तेमाल करके आप Track कर सकते हो:

आपका PC/Laptop कब ON हुआ

कब Shutdown हुआ

कितने घंटे चला (Total ON Time)

✅ How to Set Up Task Scheduler (Windows)

This section explains how to automatically run the PowerShell script during system shutdown so your shutdown time gets logged to the API.

📌 Step 1 — Save the PowerShell Script

Open Notepad.

Paste your script inside it.

Save the file as:

C:\SystemMonitor\log-uptime.ps1
(You can choose any folder, but keep it permanent.)

📌 Step 2 — Open Task Scheduler

Press Win + R

Type:

taskschd.msc


Press Enter


📌 Step 3 — Create New Task

Click "Create Task…" (NOT “Create Basic Task”)

Give a name like:

Windows Uptime Logger


📌 Step 4 — Configure “General” Tab

✔ Check the following:

Run whether user is logged on or not

Run with highest privileges

📌 Step 5 — Configure Trigger (Shutdown Trigger)

Windows has no direct “On Shutdown” trigger, so we use the Group Policy Shutdown Script Method OR the workaround below.

🔥 Recommended: Use Shutdown Script (Most Reliable)

Press Win + R, type:

gpedit.msc


Go to:

Computer Configuration  
    → Windows Settings  
        → Scripts (Startup/Shutdown)


Double-click Shutdown

Click Add → Browse

Select your .ps1 script:

C:\SystemMonitor\log-uptime.ps1


Click OK

✔ Windows will now automatically run your PowerShell script every time the PC shuts down.
