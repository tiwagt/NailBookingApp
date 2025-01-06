const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");

admin.initializeApp();
const corsHandler = cors({ origin: true });

exports.apiFunction = functions.https.onRequest((req, res) => {
  corsHandler(req, res, () => {
    // Your function logic here
    res.status(200).send({ message: "CORS is configured!" });
  });
});
