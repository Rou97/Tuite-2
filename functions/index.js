const functions = require('firebase-functions');
require('dotenv').config();

const express = require('express');
const app = express();

const FBAuth = require('./util/fbAuth');

const { db } = require('./util/admin');

const {
	getAllScreams,
	postOneScream,
	getScream,
	commentOnScream,
	deleteScream,
	likeScream,
	unlikeScream
} = require('./handlers/screams');
const {
	signup,
	login,
	uploadImage,
	addUserDetails,
	getAuthenticatedUser,
	getUserDetails,
	markNotificationsRead
} = require('./handlers/users');

// Scream routes
app.get('/screams', getAllScreams);
app.post('/scream', FBAuth, postOneScream);
app.get('/scream/:screamId', getScream);
app.post('/scream/:screamId/comment', FBAuth, commentOnScream);
app.delete('/scream/:screamId', FBAuth, deleteScream);
app.get('/scream/:screamId/like', FBAuth, likeScream);
app.get('/scream/:screamId/unlike', FBAuth, unlikeScream);

// users routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);
app.get('/user/:handle', getUserDetails);
app.post('/notifications', FBAuth, markNotificationsRead);

exports.api = functions.region('europe-west1').https.onRequest(app);

exports.createNotificationOnLike = functions
	.region('europe-west1')
	.firestore.document('likes/{id}')
	.onCreate((snapshot) => {
		return db.doc(`/screams/${snapshot.data().screamId}`)
		.get()
		.then((doc) => {
			if (doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
				return db.doc(`/notifications/${snapshot.id}`).set({
				createdAt: new Date().toISOString(),
				recipient: doc.data().userHandle,
				sender: snapshot.data().userHandle,
				type: 'like',
				read: false,
				screamId: doc.id
				});
			}
		})
		.catch((err) => {
			console.error(err);
			return;
		});
	});

exports.deleteNotificationOnUnLike = functions
	.region('europe-west1')
	.firestore.document('likes/{id}')
	.onDelete((snapshot) => {
		return db.doc(`/notifications/${snapshot.id}`)
			.delete()
			.catch((err) => {
				console.error(err);
				return;
			});
	});

exports.createNotificationOnComment = functions
	.region('europe-west1')
	.firestore.document('comments/{id}')
	.onCreate((snapshot) => {
		return db.doc(`/screams/${snapshot.data().screamId}`)
			.get()
			.then((doc) => {
				if (doc.exists) {
					return db.doc(`/notifications/${snapshot.id}`).set({
					createdAt: new Date().toISOString(),
					recipient: doc.data().userHandle,
					sender: snapshot.data().userHandle,
					type: 'comment',
					read: false,
					screamId: doc.id
					});
				}
			})
			.catch((err) => {
				console.error(err);
				return;
			});
	});