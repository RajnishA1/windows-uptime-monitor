import SystemLog from "../model/SystemLog.model.js";

// POST /system/log
export const createSystemLog = async (req, res) => {
  try {
    const { device, lastBootTime, lastShutdownTime } = req.body;

    if (!device || !lastBootTime || !lastShutdownTime) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const log = new SystemLog({
      device,
      lastBootTime: new Date(lastBootTime),
      lastShutdownTime: new Date(lastShutdownTime),
    });

    await log.save();

    res.status(201).json({ success: true, message: "System log saved", data: log });
  } catch (error) {
    console.error("Error saving system log:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /system/log?device=DESKTOP-DS38AG8

import moment from "moment-timezone";

export const getSystemLogs = async (req, res) => {
  try {
    const { device } = req.query;

    // DELETE OLD LOGS (older than 10 days)
    const cutoff = moment().subtract(10, "days").toDate();
    await SystemLog.deleteMany({ createdAt: { $lt: cutoff } });

    const query = device ? { device } : {};

    const logs = await SystemLog.find(query).sort({ createdAt: -1 });

    // Grouped response object
    const grouped = {};

    logs.forEach(log => {
      const dev = log.device;

      if (!grouped[dev]) grouped[dev] = [];

      // Convert timestamps
      const boot = log.lastBootTime
        ? moment(log.lastBootTime).tz("Asia/Kolkata")
        : null;

      const shutdown = log.lastShutdownTime
        ? moment(log.lastShutdownTime).tz("Asia/Kolkata")
        : null;

      // Duration
      let durationText = null;

      if (boot && shutdown) {
        const diffMs = shutdown.diff(boot);
        const duration = moment.duration(diffMs);

        const hours = duration.hours();
        const minutes = duration.minutes();

        durationText =
          `${hours} hour${hours !== 1 ? "s" : ""} ${minutes} minute${minutes !== 1 ? "s" : ""}`;
      }

      grouped[dev].push({
        device: log.device,
        bootTime: boot ? boot.format("DD MMM YYYY, hh:mm A") : null,
        shutdownTime: shutdown ? shutdown.format("DD MMM YYYY, hh:mm A") : null,
        totalOnTime: durationText,
      });
    });

    res.status(200).json({ success: true, data: grouped });

  } catch (error) {
    console.error("Error fetching system logs:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
