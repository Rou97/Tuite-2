const functions = require('firebase-functions');
const admin = require('firebase-admin');

const express = require('express'); 
const app = express();

admin.initializeApp();

const firebaseConfig = {
    apiKey: "AIzaSyBLr42Is_iPZn2zuI1A3PI7Yfrt5oEibzg",
    authDomain: "tuite-2.firebaseapp.com",
    databaseURL: "https://tuite-2.firebaseio.com",
    projectId: "tuite-2",
    storageBucket: "tuite-2.appspot.com",
    messagingSenderId: "300656012204",
    appId: "1:300656012204:web:3050953541236b5d"
};

const firebase = require('firebase');
firebase.initializeApp(config); 

exports.api = functions.region('europe.west1').https.onRequest(app);
