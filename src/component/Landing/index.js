import bg_image from "../../resource/image/background.png";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import {StyledFirebaseAuth} from "react-firebaseui";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router";
import {k_home_route} from "../../App";
import Rain from '../Rain/index'
import './style.css'

// Configure FirebaseUI.
const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup', // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/home', // We will display Google and Facebook as auth providers.
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
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

    return (<div className="landing">{authChecked && <section>
        <div className="hero-container">
            <Rain numDrops='25' />
            <div className="environment"/>
            <h2 className="hero glitch layers" data-text="葛飾北斎"><span>葛飾北斎</span></h2>
            <StyledFirebaseAuth className="firebase-login" uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
        </div>
    </section>}
    </div>);
}

export default Landing;
