import firebase from "firebase/app"
import "firebase/auth"

const app = firebase.initializeApp({
    apiKey: "AIzaSyBdq_f4FBD0sdAe8jhr_Nnv_qTPqOPQwsc",
    authDomain: "ta-match.firebaseapp.com",
    projectId: "ta-match",
    storageBucket: "ta-match.appspot.com",
    messagingSenderId: "498788490733",
    appId: "1:498788490733:web:44ce5387da2ffa6b12dbe4",
    measurementId: "G-4ZDN701XXB"
})

export const auth = app.auth()
export default app