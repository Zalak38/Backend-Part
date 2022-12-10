const mongoose = require("mongoose");

const CalendarSchema = new mongoose.Schema(
  {
    event_type: {
      type: String,
      enum: ["DailyRoutine", "TempararyEvent", "Deadline"]
    },
    summary: String,
    location: String,
    description: String,
    start: {
      dateTime: Date,
      timeZone: String
    },
    end: {
      dateTime: Date,
      timeZone: String
    },
    recurrence: [String],
    attendees: [String],
    reminders: {
      useDefault: Boolean,
      overrides: {
        type: mongoose.Schema.Types.Mixed
      }
    },
    eventId: String,
    iCalUid: String,
    event_status: {
      type: String,
      enum: ["Pending", "Delay", "Done"]
    },
    notified: {
      type: String,
      enum: ["1 hour", "1 day", "2 day", "3 day", "none"]
    }
  },
  { timestamps: true }
);

module.exports.Event = mongoose.model("event", CalendarSchema);
