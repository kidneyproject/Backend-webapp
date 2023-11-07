const {initializeApp} = require('firebase/app')
const { getFirestore } = require('firebase/firestore')
const dotenv = require('dotenv');
dotenv.config();

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID
};
// const firebaseConfig = {
//     apiKey: "AIzaSyAjGt6B8Bjmmsq_K4aXXnKmpodfxXfBEk4",
//     authDomain: "kidney-bot-project.firebaseapp.com",
//     projectId: "kidney-bot-project",
//     storageBucket: "kidney-bot-project.appspot.com",
//     messagingSenderId: "38317378895",
//     appId: "1:38317378895:web:a6a10658dae5d21497893a"
//   };

// console.log(firebaseConfig)

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = db