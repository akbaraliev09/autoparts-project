import { getFirestore } from 'firebase/firestore'
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyBEoh7HOQObA2wYRUub1szQVBFIZvI6fdw',
  authDomain: 'autoparts-kg.firebaseapp.com',
  projectId: 'autoparts-kg',
  storageBucket: 'autoparts-kg.firebasestorage.app',
  messagingSenderId: '30029599059',
  appId: '1:30029599059:web:d1448c90be10e1906a11a6',
  measurementId : "G-H078H1EJ3C"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
export const db = getFirestore(app)

export const loginWithGoogle = () => signInWithPopup(auth, new GoogleAuthProvider())