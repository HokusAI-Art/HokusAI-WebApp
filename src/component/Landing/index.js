import bg_image from "../../resource/image/background.webp";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router";
import {k_home_route} from "../../App";
import Rain from '../Rain/index';
import './style.css';

// Configure FirebaseUI.
const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup', // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/home', // We will display Google and Facebook as auth providers.
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
};

const Landing = () => {
    const navigate = useNavigate();
    const auth = firebase.auth();

    const [authChecked, setAuthChecked] = useState(false);

    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({prompt: 'select_account'});

    useEffect(() => {
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
            <Rain numDrops='25'/>
            <div className="environment" style={{backgroundImage: `url(${bg_image})`}} />
            <h2 className="hero glitch layers" data-text="葛飾北斎"><span>葛飾北斎</span></h2>
            <br/>
            <button className="cybr-btn" onClick={() => auth.signInWithPopup(provider)}>
                Sign In With Google<span aria-hidden>_</span>
                <span aria-hidden className="cybr-btn__glitch">Sign In With Google_</span>
                <span aria-hidden className="cybr-btn__tag">UWU</span>
            </button>
        </div>
    </section>}
    </div>);
}

export default Landing;
