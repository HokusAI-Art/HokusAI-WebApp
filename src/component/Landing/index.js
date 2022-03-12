import bg_image from "../../resource/image/background.png";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import {StyledFirebaseAuth} from "react-firebaseui";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router";
import {k_home_route} from "../../App";
import './style.css'

// Configure FirebaseUI.
const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/home',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
};

const Landing = () => {
    const navigate = useNavigate();

    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        const auth = getAuth();

        onAuthStateChanged(auth, (user) => {
            if (user) {
                // user signed in
                const uid = user.uid;
                console.log('uid', uid);
                console.log('user', user);
                navigate(k_home_route);
                setAuthChecked(true);
            } else {
                // user is signed out
                console.log('no auth');
                setAuthChecked(true);
            }
        });
    }, [navigate]);

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            objectFit: "cover"
        }}>
            { authChecked &&
                <>
                    <img src={bg_image} style={{position: "fixed", objectFit: "cover", minWidth: "100vw", minHeight: "100vh"}} />
                    <div style={{position: "fixed", width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.6)"}} />
                    <div style={{position: "fixed"}}>
                        <h1 style={{color: "white", fontSize: "8rem", fontFamily: "cursive"}}>Hokus-AI</h1>
                        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
                    </div>
                </>
            }
        </div>
    );
}

export default Landing;
