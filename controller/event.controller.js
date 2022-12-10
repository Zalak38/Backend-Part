const { Event } = require("../models/calender");
const { google } = require("googleapis");
const CREDENTIALS = require("../credentials.json");
const path = require("path");
const Sound = require("sound-play");

const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
const GOOGLE_PRIVATE_KEY = CREDENTIALS.private_key;
const GOOGLE_CLIENT_EMAIL = CREDENTIALS.client_email;
const GOOGLE_CLIENT_ID = CREDENTIALS.client_id;

const GOOGLE_PROJECT_NUMBER = "982648699417";
const GOOGLE_CALENDAR_ID =
  "b6330b98f8407ed6591fa719d2187ecb56757a34ea6b81c68068f12c56c107af@group.calendar.google.com";

const volume = 1;

const createFile = path.join(__dirname, "../audio/Create.mp3");
const updateFile = path.join(__dirname, "../audio/Update.mp3");
const deleteFile = path.join(__dirname, "../audio/Deleted.mp3");

// console.log(createFile);

const jwtClient = new google.auth.JWT(
  GOOGLE_CLIENT_EMAIL,
  null,
  GOOGLE_PRIVATE_KEY,
  SCOPES
);

const calendar = google.calendar({
  version: "v3",
  project: GOOGLE_PROJECT_NUMBER,
  auth: jwtClient
});

const auth = new google.auth.GoogleAuth({
  keyFile: "./credentials.json",
  scopes: "https://www.googleapis.com/auth/calendar"
});

const createEvent = async (req, res) => {
  // var event = {
  //   summary: "My first event!",
  //   location: "Hyderabad,India",
  //   description: "First event with nodeJS!",
  //   start: {
  //     dateTime: "2022-11-01T09:00:00-07:00",
  //     timeZone: "Asia/Kolkata"
  //   },
  //   end: {
  //     dateTime: "2022-11-02T17:00:00-07:00",
  //     timeZone: "Asia/Kolkata"
  //   },
  //   attendees: [],
  //   reminders: {
  //     useDefault: false,
  //     overrides: [
  //       { method: "email", minutes: 24 * 60 },
  //       { method: "popup", minutes: 10 }
  //     ]
  //   }
  // };

  const event = new Event({
    summary: req.body.summary,
    location: req.body.location,
    description: req.body.description,
    start: {
      dateTime: req.body.start.dateTime,
      timeZone: req.body.start.timeZone
    },
    end: {
      dateTime: req.body.end.dateTime,
      timeZone: req.body.end.timeZone
    },
    attendees: req.body.attendees,
    reminders: {
      useDefault: req.body.reminders.useDefault,
      overrides: req.body.reminders.overrides
    },
    recurrence: req.body.recurrence,
    event_type: req.body.event_type,
    // notified: req.body.notified,
    // event_status: req.body.event_status,
    eventId: null,
    recurringEventId: null,
    iCalUid: null
  });

  // const date = new Date();
  // let currentDate = date.toISOString();

  auth.getClient().then((a) => {
    calendar.events.insert(
      {
        auth: a,
        calendarId: GOOGLE_CALENDAR_ID,
        resource: event
      },
      function (err, newEvent) {
        if (err) {
          console.log(
            "There was an error contacting the Calendar service: " + err
          );
          return;
        }
        console.log("Event created: %s", newEvent.data);

        if (event.event_type === "Deadline") {
          event.event_status = "Pending";
          event.notified = req.body.notified;
        }
        event.eventId = newEvent.data.id;
        event.iCalUid = newEvent.data.iCalUID;

        event
          .save()
          .then((dbRes) => {
            res.jsonp("Event successfully created!");
            console.log("res", dbRes);
            Sound.play(createFile, volume);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    );
  });
};

const updateEvent = async (req, res) => {
  const Id = req.params.id;

  if (Id.length == 24) {
    const eventData = await Event.findById(Id);
    const updateEventId = eventData.eventId;

    const updateContent = {
      summary: req.body.summary,
      location: req.body.location,
      description: req.body.description,
      start: {
        dateTime: req.body.start.dateTime,
        timeZone: req.body.start.timeZone
      },
      end: {
        dateTime: req.body.end.dateTime,
        timeZone: req.body.end.timeZone
      },
      attendees: req.body.attendees,
      reminders: {
        useDefault: req.body.reminders.useDefault,
        overrides: req.body.reminders.overrides
      },
      recurrence: req.body.recurrence,
      event_type: req.body.event_type,
      event_status: req.body.event_status,
      notified: req.body.notified
    };

    await auth.getClient().then((a) => {
      calendar.events.update(
        {
          auth: a,
          calendarId: GOOGLE_CALENDAR_ID,
          eventId: updateEventId,
          resource: updateContent
        },
        function (err, newEvent) {
          if (err) {
            console.log(
              "There was an error contacting the Calendar service: " + err
            );
            return;
          }
          console.log("Event updated successfully: %s", newEvent.data);

          Event.findByIdAndUpdate(Id, updateContent, { new: true })
            .then((result) => {
              res.send({ updatedEvent: result });
              Sound.play(updateFile, volume);
            })
            .catch((error) => console.error(error));
        }
      );
    });
  } else {
    const updateContent = {
      summary: req.body.summary,
      location: req.body.location,
      description: req.body.description,
      start: {
        dateTime: req.body.start.dateTime,
        timeZone: req.body.start.timeZone
      },
      end: {
        dateTime: req.body.end.dateTime,
        timeZone: req.body.end.timeZone
      },
      attendees: req.body.attendees,
      reminders: {
        useDefault: req.body.reminders.useDefault,
        overrides: req.body.reminders.overrides
      },
      recurrence: req.body.recurrence,
      event_type: req.body.event_type,
      event_status: req.body.event_status,
      notified: req.body.notified
    };

    await auth.getClient().then((a) => {
      calendar.events.update(
        {
          auth: a,
          calendarId: GOOGLE_CALENDAR_ID,
          eventId: Id,
          resource: updateContent
        },
        function (err, newEvent) {
          if (err) {
            console.log(
              "There was an error contacting the Calendar service: " + err
            );
            return;
          }
          console.log("Event updated successfully: %s", newEvent.data);
          res.send({ updatedEvent: newEvent.data });
        }
      );
    });
  }
};

const deleteEvent = async (req, res) => {
  const Id = req.params.id;

  if (Id.length == 24) {
    const eventData = await Event.findById(Id);
    const deleteEventId = eventData.eventId;
    await auth.getClient().then((a) => {
      calendar.events.delete(
        {
          auth: a,
          calendarId: GOOGLE_CALENDAR_ID,
          eventId: deleteEventId
        },
        function (err) {
          if (err) {
            console.log(
              "There was an error contacting the Calendar service: " + err
            );
            return;
          }
          console.log("Event deleted.");
          Event.findByIdAndDelete(Id)
            .then(() => {
              res.send({ message: "event deleted successfully" });
              Sound.play(deleteFile, volume);
            })
            .catch((error) => console.error(error));
        }
      );
    });
  } else {
    await auth.getClient().then((a) => {
      calendar.events.delete(
        {
          auth: a,
          calendarId: GOOGLE_CALENDAR_ID,
          eventId: Id
        },
        function (err) {
          if (err) {
            console.log(
              "There was an error contacting the Calendar service: " + err
            );
            return;
          }
          console.log("Event deleted.");
          res.send({ message: "event deleted successfully" });
        }
      );
    });
  }
};

const getDailyEvent = async (req, res) => {
  const Id = req.params.id;
  const singleEvent = await Event.findById(Id);

  const singleEventId = singleEvent.iCalUid;
  calendar.events.list(
    {
      calendarId: GOOGLE_CALENDAR_ID,
      iCalUID: singleEventId,
      maxResults: 20,
      singleEvents: true,
      orderBy: "startTime"
    },
    (error, result) => {
      if (error) {
        res.send(JSON.stringify({ error: error }));
      } else {
        if (result.data.items.length) {
          res.send({ event: result.data.items });
        } else {
          res.send(JSON.stringify({ message: "No upcoming events found." }));
        }
      }
    }
  );
};

const getEventById = async (req, res) => {
  const Id = req.params.id;

  if (Id.length == 24) {
    await Event.findById(Id)
      .then((results, err) => {
        if (err) {
          res.send({ err: err });
        } else {
          // console.log(results);
          res.send({ event: results });
        }
      })
      .catch((error) => console.error(error));
  } else {
    calendar.events.get(
      {
        calendarId: GOOGLE_CALENDAR_ID,
        eventId: Id
      },
      (error, result) => {
        if (error) {
          res.send(JSON.stringify({ error: error }));
        } else {
          if (result.data) {
            res.send({ event: result.data });
          } else {
            res.send(JSON.stringify({ message: "No upcoming events found." }));
          }
        }
      }
    );
  }
};

const getGoogleEvent = async (req, res) => {
  calendar.events.list(
    {
      calendarId: GOOGLE_CALENDAR_ID,
      timeMin: new Date().toISOString(),
      maxResults: 1000,
      singleEvents: true,
      orderBy: "startTime"
    },
    (error, result) => {
      if (error) {
        res.send(JSON.stringify({ error: error }));
      } else {
        if (result.data.items.length) {
          res.send(JSON.stringify({ events: result.data.items }));
        } else {
          res.send(JSON.stringify({ message: "No upcoming events found." }));
        }
      }
    }
  );
};

// const getAllEvent = async (req, res) => {
//   await Event.find()
//     .then((results, err) => {
//       if (err) {
//         res.send({ err: err });
//       } else {
//         if (results.length) {
//           // console.log(results);
//           res.send({ events: results });
//         } else {
//           res.send({ message: "No upcoming events found." });
//         }
//       }
//     })
//     .catch((error) => console.error(error));
// };

// const test = async (req, res) => {
//   calendar.events.list(
//     {
//       calendarId: GOOGLE_CALENDAR_ID,
//       timeMin: new Date().toISOString(),
//       maxResults: 1000,
//       singleEvents: true,
//       orderBy: "startTime"
//     },
//     (error, result) => {
//       if (error) {
//         res.send(JSON.stringify({ error: error }));
//       } else {
//         if (result.data.items.length) {
//           Event.find({ event_type: "Deadline" })
//             .then((results, err) => {
//               if (err) {
//                 res.send({ err: err });
//               } else {
//                 const AllEvent = result.data.items.push(results);
//               }
//             })
//             .catch((error) => console.error(error));
//           res.send(AllEvent);
//         } else {
//           res.send(JSON.stringify({ message: "No upcoming events found." }));
//         }
//       }
//     }
//   );
// };

const getAllEvent = async (req, res) => {
  try {
    const googleEvent = await calendar.events.list({
      calendarId: GOOGLE_CALENDAR_ID,
      // timeMin: new Date().toISOString(),
      maxResults: 1000,
      singleEvents: true,
      orderBy: "startTime"
    });

    // console.log(googleEvent.data.items);
    const event = await Event.find({ event_type: "Deadline" });
    if (googleEvent.data.items.length) {
      const AllEvent = googleEvent.data.items.concat(event);

      const response = googleEvent.data.items.filter(
        (data) => !event.map((e) => e.eventId).includes(data.id)
      );
      const arr = response.concat(event);

      await res.send(arr);
    } else {
      await res.send(event);
    }
  } catch (error) {
    console.error(error);
  }
};

const getString = async (req, res) => {
  const string = req.body.string;
  console.log(string);
  res.send({ message: string });
};

module.exports = {
  createEvent,
  updateEvent,
  deleteEvent,
  getDailyEvent,
  getEventById,
  getGoogleEvent,
  getAllEvent,
  getString
};
