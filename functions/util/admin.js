const admin = require('firebase-admin');
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://tuite-2-4be7b.firebaseio.com"
});

const db = admin.firestore();

module.exports = { admin, db }; 