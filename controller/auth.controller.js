const { google } = require("googleapis");

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "https://2b6a-2405-201-200c-8982-adeb-f6cc-b65b-70d6.ngrok.io/handleGoogleRedirect"
  // server redirect url handler
);

const createAuthLink = async (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      //calendar api scopes]
      "https://www.googleapis.com/auth/calendar"
    ],
    prompt: "consent"
  });
  res.send({ url });
};

const googleRedirect = async (req, res) => {
  // get code from url
  const code = req.query.code;
  console.log("server 36 | code", code);
  // get access token
  oauth2Client.getToken(code, (err, tokens) => {
    if (err) {
      console.log("server 39 | error", err);
      throw new Error("Issue with Login", err.message);
    }
    console.log(tokens);
    const accessToken = tokens.access_token;
    const refreshToken = tokens.refresh_token;

    console.log("accessToken", accessToken);
    console.log("refreshToken", refreshToken);

    res.redirect(
      `http://localhost:3000/dashboard?accessToken=${accessToken}&refreshToken=${refreshToken}`
    );
  });
};

const getValidToken = async (req, res) => {
  try {
    const request = await fetch("https://www.googleapis.com/oauth2/v4/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        refresh_token: req.body.refreshToken,
        grant_type: "refresh_token"
      })
    });

    const data = await request.json();
    console.log("server 74 | data", data.access_token);

    res.json({
      accessToken: data.access_token
    });
  } catch (error) {
    res.json({ error: error.message });
  }
};

module.exports = {
  createAuthLink,
  googleRedirect,
  getValidToken
};
