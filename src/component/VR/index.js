import {useEffect, useRef, useState, Suspense} from "react";
import {useNavigate} from "react-router";
import {getAuth, onAuthStateChanged, signOut} from "firebase/auth";
import {k_home_route, k_immersive_view_route, k_landing_route} from "../../App";
import {collection, getFirestore, onSnapshot, orderBy, query} from "firebase/firestore";
import {Container, Nav, Navbar} from "react-bootstrap";
import ReactHowler from 'react-howler'
import {VRCanvas, useXRFrame, DefaultXRControllers, useXR, useController} from '@react-three/xr';
import {useFrame, useLoader} from '@react-three/fiber';
import {OrbitControls, PerspectiveCamera, Plane, PointerLockControls, Sky, Text} from '@react-three/drei';
import { usePlane, Physics } from '@react-three/cannon';
import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import NavbarItems from "../Navbar";

import music from "../../resource/sound/music.mp3";

const VR = () => {
    const [auth, setAuth] = useState();
    const [user, setUser] = useState();
    const [artworks, setArtworks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // check auth state
        const auth = getAuth();
        setAuth(auth);

        onAuthStateChanged(auth, (user) => {
            if (user) {
                // user signed in
                const uid = user.uid;
                console.log('uid', uid);
                console.log('user', user);
                setUser(user);
            } else {
                // user is signed out
                console.log('no auth');
                navigate(k_landing_route);
            }
        });

        // setup database listeners
        const db = getFirestore();

        const q = query(collection(db, "art"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const documents = [];
            querySnapshot.forEach((doc) => {
                documents.push(doc.data());
            });
            console.log("Data fetched: ", documents);
            setArtworks(documents);
        });
    }, [navigate]);

    return (
        <div style={{backgroundColor: "black", background: "black", height: "100vh"}}>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand href="/home">Hokus-AI</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="navbarScroll">
                        <NavbarItems />
                        {/*right aligned item of navbar*/}
                        <Nav.Link href="/landing" onClick={() => {
                            if (auth) {
                                signOut(auth);
                            }
                        }}>
                            Sign Out
                        </Nav.Link>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <ReactHowler
                src={music}
                playing={true}
            />

            { user &&
                <div>hello vr view</div>
            }
        </div>
    );
}

export default VR;