import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyD2TMKYH0R1E2WGswPEFR2t4_rWUElnCyI",
    authDomain: "tcc-images-eefb9.firebaseapp.com",
    projectId: "tcc-images-eefb9",
    storageBucket: "tcc-images-eefb9.appspot.com",
    messagingSenderId: "821736705714",
    appId: "1:821736705714:web:7ddf27223e0ad70ff403ab"
};

const firebaseApp = initializeApp(firebaseConfig);

export const storage = getStorage(firebaseApp);

