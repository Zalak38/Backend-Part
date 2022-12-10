const express = require("express");
const { google } = require("googleapis");

const Cron = require("node-cron");

const db = require("./database/connection");
require("dotenv").config();
const path = require("path");
const moment = require("moment");
const cors = require("cors");
const GTTS = require("gtts");
const fetch = require("node-fetch");
const Sound = require("sound-play");
const weatherRouter = require("./routes/weather");
const eventRouter = require("./routes/event");
const authRouter = require("./routes/auth");
const systemRouter = require("./routes/system");
const quotesRouter = require("./routes/quotes");
const {
  PendingToDelayStatus,
  DelayToPendingStatus,
  oneHourNotification,
  oneDayNotification,
  twoDayNotification,
  threeDayNotification
} = require("./cron/jobservice");

const { Event } = require("./models/calender");

const { Socket } = require("socket.io");
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200
};

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origins: "*"
  }
});

app.use(express.json());
app.use(cors(corsOptions));

app.use(weatherRouter);
app.use(eventRouter);
app.use(authRouter);
app.use(systemRouter);
app.use(quotesRouter);
// const CLIENT_ID =
//   "982648699417-uevrft7dc5m1j78fkh1kbiep2gndlleo.apps.googleusercontent.com";
// const CLIENT_SECRET = "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";

// const volume = 1;

// const NotificationFile = path.join(__dirname, "/audio/Voice2.mp3");

Cron.schedule("* * * * *", PendingToDelayStatus);

Cron.schedule("* * * * *", DelayToPendingStatus);

Cron.schedule("* * * * *", oneHourNotification);

Cron.schedule("* * * * *", oneDayNotification);
Cron.schedule("* * * * *", twoDayNotification);
Cron.schedule("* * * * *", threeDayNotification);

const diff_minutes = (dt2, dt1) => {
  var diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
};

// app.post("/Login", (req, res) => {
//   const { client_Email, client_private_key } = req.body;
//   store.set("userData", {
//     client_Email,
//     client_private_key
//   });
//   res.send("Success");
// });

server.listen(5000, () => console.log(`App listening on port 5000!`));

io.on("connection", (socket) => {
  // setTimeout(() => {
  //   socket.emit("test", "hello amancha");
  // }, 2000);

  console.log(socket.id);
  Cron.schedule("* * * * *", async () => {
    // console.log("Running a task every midnight (1:00 am)");
    const todayDate = new Date().toISOString();

    // console.log(todayDate);

    await Event.find(
      {
        notified: "1 hour",
        "start.dateTime": {
          $gt: todayDate
        }
      },
      (err, data) => {
        if (err) {
          throw err;
        } else {
          // let arr = [];
          if (data) {
            // console.log(data);
            data.map((e) => {
              // console.log(e);
              const date1 = new Date(e.start.dateTime);
              const date2 = new Date(todayDate);
              // console.log(e);
              const min_diff = diff_minutes(date2, date1);
              if (min_diff % 60 == 0) {
                const message = `event ${e.summary} is ${
                  min_diff / 60
                } hour away`;
                // arr.push(message);
                socket.emit("notification", message);
                // const gtts = new GTTS(message, "en");
                // gtts.save("audio/Voice2.mp3", (err, result) => {
                //   if (err) {
                //     throw new Error(err);
                //   }
                //   console.log("Text to speech converted!");
                // });
                // Sound.play(NotificationFile, volume);
                console.log(message);
              }
            });
          }
        }
      }
    );
  });

  Cron.schedule("* * * * *", async () => {
    // console.log("Running a task every midnight (1:00 am)");
    const todayDate = new Date().toISOString();

    // console.log(todayDate);
    await Event.find(
      {
        notified: "1 day",
        "start.dateTime": {
          $gt: todayDate
        }
      },
      (err, data) => {
        if (err) {
          throw err;
        } else {
          // let arr = [];
          if (data) {
            data.map((e) => {
              const date1 = new Date(e.start.dateTime);
              const date2 = new Date(todayDate);
              const min_diff = diff_minutes(date2, date1);
              // console.log(min_diff);
              if (min_diff % 1440 == 0) {
                const message = `event ${e.summary} is ${
                  min_diff / 1440
                } day away`;
                // arr.push(message);
                socket.emit("notification", message);
                // const gtts = new GTTS(message, "en");
                // gtts.save("audio/Voice2.mp3", (err, result) => {
                //   if (err) {
                //     throw new Error(err);
                //   }
                //   console.log("Text to speech converted!");
                // });
                // Sound.play(NotificationFile, volume);
                console.log(message);
              }
            });
          }
        }
      }
    );
  });

  Cron.schedule("* * * * *", async () => {
    // console.log("Running a task every midnight (1:00 am)");
    const todayDate = new Date().toISOString();

    // console.log(todayDate);
    await Event.find(
      {
        notified: "2 day",
        "start.dateTime": {
          $gt: todayDate
        }
      },
      (err, data) => {
        if (err) {
          throw err;
        } else {
          // let arr = [];
          if (data) {
            data.map((e) => {
              const date1 = new Date(e.start.dateTime);
              const date2 = new Date(todayDate);
              const min_diff = diff_minutes(date2, date1);
              // console.log(min_diff);
              if (min_diff % 2880 == 0) {
                const message = `event ${e.summary} is ${
                  min_diff / 1440
                } day away`;
                // arr.push(message);
                socket.emit("notification", message);
                // const gtts = new GTTS(message, "en");
                // gtts.save("audio/Voice2.mp3", (err, result) => {
                //   if (err) {
                //     throw new Error(err);
                //   }
                //   console.log("Text to speech converted!");
                // });
                // Sound.play(NotificationFile, volume);
                console.log(message);
              }
            });
          }
        }
      }
    );
  });

  Cron.schedule("* * * * *", async () => {
    // console.log("Running a task every midnight (1:00 am)");
    const todayDate = new Date().toISOString();

    // console.log(todayDate);

    await Event.find(
      {
        notified: "3 day",
        "start.dateTime": {
          $gt: todayDate
        }
      },
      (err, data) => {
        if (err) {
          throw err;
        } else {
          // let arr = [];
          if (data) {
            data.map((e) => {
              const date1 = new Date(e.start.dateTime);
              const date2 = new Date(todayDate);
              const min_diff = diff_minutes(date2, date1);
              // console.log(min_diff);
              if (min_diff % 4320 == 0) {
                const message = `event ${e.summary} is ${
                  min_diff / 1440
                } day away`;
                // arr.push(message);
                socket.emit("notification", message);
                // const gtts = new GTTS(message, "en");
                // gtts.save("audio/Voice2.mp3", (err, result) => {
                //   if (err) {
                //     throw new Error(err);
                //   }
                //   console.log("Text to speech converted!");
                // });
                // Sound.play(NotificationFile, volume);
                console.log(message);
              }
            });
          }
        }
      }
    );
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
