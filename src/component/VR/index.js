import React, {useEffect, useRef, useState, Suspense} from "react";
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
            <Navbar bg="dark" expand="lg">
                <Container>
                    <Navbar.Brand href="/home">HokusAI</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="navbarScroll">
                        <NavbarItems/>
                        {/*right aligned item of navbar*/}
                        <button id='signout' className="cybr-btn" onClick={() => {
                            if (auth) {
                                signOut(auth);
                            }
                        }}>
                            Sign Out<span aria-hidden>_</span>
                            <span aria-hidden className="cybr-btn__glitch">Sign Out_</span>
                            <span aria-hidden className="cybr-btn__tag">Fox</span>
                        </button>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <ReactHowler
                src={music}
                playing={true}
            />

            { user &&
                <VRCanvas>
                    <Physics
                        gravity={[0, 0, 0]}
                        iterations={20}
                        defaultContactMaterial={{
                            friction: 0.09
                        }}>
                        <Scene artworks={artworks}/>
                    </Physics>
                </VRCanvas>
            }
        </div>
    );
}

const Scene = ({artworks}) => {
    const { player } = useXR()
    const leftController = useController('left');
    const rightController = useController('right');
    const [debugText, setDebugText] = useState("");
    const cameraRef = useRef();

    let lastUpdatedTime = 0;
    const globalYOffset = -1;

    let [initPlayer, setInitPlayer] = useState(false);

    const [floorRef] = usePlane(() => ({
        args: [10, 10],
        rotation: [-Math.PI / 2, 0, 0],
        position: [0, -0.1, 0],
        type: 'Static'
    }))

    useXRFrame((time, xrFrame) => {
        // do something on each frame of an active XR session
        console.log(time);

        if (!initPlayer) {
            player.position.x = -2;
            player.position.z = 9;
            player.position.y = globalYOffset;

            setInitPlayer(true);
            initPlayer = true;
        }

        if (lastUpdatedTime === 0) {
            lastUpdatedTime = time;
        }

        const dt = time - lastUpdatedTime;

        let leftGamepad = leftController.inputSource.gamepad;
        let rightGamepad = rightController.inputSource.gamepad;

        // right gamepad
        if (rightGamepad) {
            if (rightGamepad.buttons[0].pressed) {
                // index finger big button
                // setDebugText("index finger button pressed");
            }

            if (rightGamepad.buttons[1].pressed) {
                // middle finger button big button
                // setDebugText("middle finger button pressed");
            }

            const joystickXAxis = rightGamepad.axes[2];
            const joystickYAxis = rightGamepad.axes[3];
        }

        // left gamepad
        if (leftGamepad) {
            if (leftGamepad.buttons[0].pressed) {
                // index finger big button
                // setDebugText("index finger button pressed");
            }

            if (leftGamepad.buttons[1].pressed) {
                // middle finger button big button
                // setDebugText("middle finger button pressed");
            }

            const joystickXAxis = leftGamepad.axes[2];
            const joystickYAxis = leftGamepad.axes[3];

            const speedScale = 2;
            const speed = 0.0005 * speedScale;
            const velX = joystickXAxis * speed * dt;
            const velZ = joystickYAxis * speed * dt;

            player.position.x += velX;
            player.position.z += velZ;

            // setDebugText("Axis X: " + rightControllerJoystickXAxis);
            // setDebugText("dt: " + dt);
        }

        lastUpdatedTime = time;
    })

    const gltf = useLoader(GLTFLoader, 'scene.gltf');

    return (
        <>
            <Sky />
            {/*<Plane ref={floorRef} args={[50, 50]} receiveShadow>*/}
            {/*    <meshStandardMaterial attach="material" color="#8ea1bf" />*/}
            {/*</Plane>*/}
            <Suspense fallback={null}>
                <primitive object={gltf.scene} position={[0, -0.3 + globalYOffset, 7]} rotation={[0, Math.PI/2, 0]} scale={[0.7, 0.7, 0.7]}/>
            </Suspense>
            <DefaultXRControllers />
            {artworks.map((artwork, i) => {
                const limit = 7;
                const initX = -5;
                const initY = 1.4 + globalYOffset;
                const initZ = 3.66;
                const imageScale = 0.8;
                const imageWidth = 1.6 * imageScale;
                const imageHeight = 1 * imageScale;
                const imageDistance = 0.5 * imageScale;

                if (i < limit) {
                    return (
                        <Artwork key={artwork.id} artwork={artwork} width={imageWidth} height={imageHeight}
                                 position={[initX + i * (imageWidth + imageDistance), initY, initZ]}/>
                    );
                }
            })}
            <Text color={'black'} position={[0.0, 1.1, -0.5]}>{debugText}</Text>
            {/*<PerspectiveCamera position={[5, 5, 5]} />*/}
            {/*<OrbitControls ref={cameraRef}/>*/}
            <PointerLockControls ref={cameraRef} />
            <ambientLight intensity={0.5} />
            <spotLight position={[1, 8, 1]} angle={0.3} penumbra={1} intensity={1} castShadow />
        </>
    )
}

const Artwork = ({artwork, width, height, position}) => {
    const texture = useLoader(THREE.TextureLoader, artwork.imageUrl);

    return (
        <>
            <mesh position={position}>
                <planeBufferGeometry attach="geometry" args={[width, height]} />
                <meshBasicMaterial attach="material" map={texture} />
            </mesh>

            {
                artwork.loading ? (
                    <Text color={'black'} position={[position[0], position[1] - height / 2 - 0.1, position[2]]}>{'Processing...'}</Text>
                ) : (
                    <>
                        <Text color={'black'} position={[position[0], position[1] - height / 2 - 0.1, position[2]]}>{artwork.text}</Text>
                        <Text color={'black'} position={[position[0], position[1] - height / 2 - 0.3, position[2]]}>created by {artwork.user.displayName}</Text>
                    </>
                )
            }
        </>
    )
}

export default VR;