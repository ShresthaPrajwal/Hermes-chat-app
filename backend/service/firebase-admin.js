const admin = require('firebase-admin');

const serviceAccount = require('../config/bajra-develop-firebase-adminsdk-tix5v-2f021765f5.json'); // Replace with your actual path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://bajra-develop.appspot.com' 
});

const bucket = admin.storage().bucket();
module.exports = { bucket };