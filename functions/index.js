const functions = require('firebase-functions');
require('dotenv').config();

const express = require('express');
const app = express();

const fbAuth = require('./util/fbAuth');

const { signup, login, uploadImage } = require('./handlers/users');

//Users routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', fbAuth, uploadImage);

exports.api = functions.region('europe-west1').https.onRequest(app);

