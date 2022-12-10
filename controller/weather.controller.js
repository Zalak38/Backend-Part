const request = require("request");
const moment = require("moment");
const nodeGeocoder = require("node-geocoder");

const options = {
  provider: "openstreetmap"
};

const geoCoder = nodeGeocoder(options);

const GetWeather = async (req, res) => {
  const lat = req.body.lat;
  const long = req.body.long;

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m,cloudcover,relativehumidity_2m&daily=precipitation_sum,windspeed_10m_max,et0_fao_evapotranspiration&timezone=GMT`;

  let location = await geoCoder.reverse({ lat: lat, lon: long });
  // console.log("location", location);

  request(url, (err, response, body) => {
    if (err) {
      res.send({ weather: null, error: "Error, please try again" });
    } else {
      let weather = JSON.parse(body);
      if (
        weather &&
        weather.hourly &&
        weather.hourly.temperature_2m &&
        weather.daily.windspeed_10m_max &&
        weather.hourly.cloudcover &&
        location
      ) {
        const morning_temp = Math.round(
          (weather.hourly.temperature_2m[0] +
            weather.hourly.temperature_2m[1]) /
            2
        );

        const afternoon_temp = Math.round(
          (weather.hourly.temperature_2m[6] +
            weather.hourly.temperature_2m[7]) /
            2
        );

        const evening_temp = Math.round(
          (weather.hourly.temperature_2m[12] +
            weather.hourly.temperature_2m[13]) /
            2
        );

        const night_temp = Math.round(
          (weather.hourly.temperature_2m[18] +
            weather.hourly.temperature_2m[19]) /
            2
        );

        const windSpeed = weather.daily.windspeed_10m_max[0];
        const timeZone = weather.timezone;

        const currentMoment = moment.utc().format("YYYY-MM-DDTHH:00");
        const current_Time = moment().format("hh:mm A");

        let index;
        weather.hourly.time.map((e) => {
          if (e == currentMoment) {
            index = weather.hourly.time.indexOf(e);
            return index;
          }
        });

        const current_temp = Math.round(weather.hourly.temperature_2m[index]);
        const current_humidity = weather.hourly.relativehumidity_2m[index];
        const cloud_Cover = weather.hourly.cloudcover[index];

        const weatherObj = {
          morning_temp,
          afternoon_temp,
          evening_temp,
          night_temp,
          windSpeed,
          cloud_Cover,
          timeZone,
          current_temp,
          current_humidity,
          current_Time,
          location
        };
        res.send(weatherObj);
      }
    }
  });
};

module.exports = { GetWeather };
