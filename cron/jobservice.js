const { Event } = require("../models/calender");
const path = require("path");
const Sound = require("sound-play");
const GTTS = require("gtts");

const volume = 1;

const NotificationFile = path.join(__dirname, "../audio/Voice2.mp3");

const diff_minutes = (dt2, dt1) => {
  var diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
};

const PendingToDelayStatus = async () => {
  // console.log("Running a task every midnight (1:00 am)");
  const todayDate = new Date().toISOString();
  // console.log(todayDate);

  await Event.findOneAndUpdate(
    {
      event_status: "Pending",
      "end.dateTime": {
        $lte: todayDate
      }
    },
    { $set: { event_status: "Delay" } },
    { returnNewDocument: true },
    (err, data) => {
      if (err) {
        throw err;
      } else {
        if (data) {
          const speech = `status changed to delay for ${data.summary}`;
          const gtts = new GTTS(speech, "en");
          gtts.save("../Voice.mp3", (err, result) => {
            if (err) {
              throw new Error(err);
            }
            console.log("Text to speech converted!");
          });
          const speechFile = path.join(__dirname, "../Voice.mp3");
          Sound.play(speechFile, volume);
        }
      }
    }
  );
};

const DelayToPendingStatus = async () => {
  // console.log("Running a task every midnight (1:00 am)");

  const todayDate = new Date().toISOString();
  // console.log(todayDate);

  await Event.findOneAndUpdate(
    {
      event_status: "Delay",
      "end.dateTime": {
        $gte: todayDate
      }
    },
    { $set: { event_status: "Pending" } },
    { returnNewDocument: true },
    (err, data) => {
      if (err) {
        throw err;
      } else {
        if (data) {
          const speech = `status changed to Pending for ${data.summary}`;
          const gtts = new GTTS(speech, "en");
          gtts.save("../Voice1.mp3", (err, result) => {
            if (err) {
              throw new Error(err);
            }
            console.log("Text to speech converted!");
          });
          const speechFile1 = path.join(__dirname, "../Voice1.mp3");
          Sound.play(speechFile1, volume);
        }
      }
    }
  );
};

// const oneHourNotification = async () => {
//   // console.log("Running a task every midnight (1:00 am)");
//   const todayDate = new Date().toISOString();

//   // console.log(todayDate);

//   await Event.find(
//     {
//       notified: "1 hour",
//       "start.dateTime": {
//         $gt: todayDate
//       }
//     },
//     (err, data) => {
//       if (err) {
//         throw err;
//       } else {
//         // let arr = [];
//         if (data) {
//           // console.log(data);
//           data.map((e) => {
//             // console.log(e);
//             const date1 = new Date(e.start.dateTime);
//             const date2 = new Date(todayDate);
//             // console.log(e);
//             const min_diff = diff_minutes(date2, date1);
//             if (min_diff % 60 == 0) {
//               const message = `event ${e.summary} is ${
//                 min_diff / 60
//               } hour away`;
//               // arr.push(message)
//               const gtts = new GTTS(message, "en");
//               gtts.save("../audio/Voice2.mp3", (err, result) => {
//                 if (err) {
//                   throw new Error(err);
//                 }
//                 console.log("Text to speech converted!");
//               });
//               Sound.play(NotificationFile, volume);
//               console.log(message);
//             }
//           });
//         }
//       }
//     }
//   );
// };

const oneHourNotification = async () => {
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
              // socket.emit("notification", message);
              const gtts = new GTTS(message, "en");
              gtts.save("audio/Voice2.mp3", (err, result) => {
                if (err) {
                  throw new Error(err);
                }
                console.log("Text to speech converted!");
              });
              Sound.play(NotificationFile, volume);
              // console.log(message);
            }
          });
        }
      }
    }
  );
};

const oneDayNotification = async () => {
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
              // socket.emit("notification", message);
              const gtts = new GTTS(message, "en");
              gtts.save("audio/Voice2.mp3", (err, result) => {
                if (err) {
                  throw new Error(err);
                }
                console.log("Text to speech converted!");
              });
              Sound.play(NotificationFile, volume);
              // console.log(message);
            }
          });
        }
      }
    }
  );
};

const twoDayNotification = async () => {
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
              // socket.emit("notification", message);
              const gtts = new GTTS(message, "en");
              gtts.save("audio/Voice2.mp3", (err, result) => {
                if (err) {
                  throw new Error(err);
                }
                console.log("Text to speech converted!");
              });
              Sound.play(NotificationFile, volume);
              // console.log(message);
            }
          });
        }
      }
    }
  );
};

const threeDayNotification = async () => {
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
              // socket.emit("notification", message);
              const gtts = new GTTS(message, "en");
              gtts.save("audio/Voice2.mp3", (err, result) => {
                if (err) {
                  throw new Error(err);
                }
                console.log("Text to speech converted!");
              });
              Sound.play(NotificationFile, volume);
              // console.log(message);
            }
          });
        }
      }
    }
  );
};
module.exports = {
  PendingToDelayStatus,
  DelayToPendingStatus,
  oneHourNotification,
  oneDayNotification,
  twoDayNotification,
  threeDayNotification
};
