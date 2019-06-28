const functions = require('firebase-functions');
const admin = require('firebase-admin');
require('dotenv').config();

const serviceAccount = require("../serviceAccountKey.json");

const express = require('express');
const app = express();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tuite-2-4be7b.firebaseio.com"
});

var config = {
    apiKey: process.env.API_KEY,
    authDomain: "tuite-2-4be7b.firebaseapp.com",
    databaseURL: "https://tuite-2-4be7b.firebaseio.com",
    projectId: "tuite-2-4be7b",
    storageBucket: "tuite-2-4be7b.appspot.com",
    messagingSenderId: "291047333892",
    appId: "1:291047333892:web:93d776f1a1f68511"
  };


const firebase = require('firebase');
firebase.initializeApp(config);

const db = admin.firestore();

app.post('/signup', (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle   
    };

    let token, userId;
    db.doc(`/users/${newUser.handle}`).get()
        .then(doc => {
            if(doc.exist) {
                return res.status(400).json( {handle: 'This handle is alredy taken'});
            }
            else {
                return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
            }
        })
        .then(data => {
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then(idToken => {
            token = idToken;
            const userCredentials = {
                handle: newUser.handle,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                userId
            }
            return db.doc(`/users/${newUser.handle}`).set(userCredentials);
        })
        .then(() => {
            return res.status(201).json({token});
        })
        .catch(err => {
            console.error(err);
            if(err.code === 'auth/email-already-in-use') {
                return res.status(400).json({ email: 'Email is already use'});
            } else {
                return res.status(500).json({error: err.code});
            }
        });
});

exports.api = functions.region('europe-west1').https.onRequest(app);

