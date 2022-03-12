import Button from 'react-bootstrap/Button';
import {useEffect, useState} from "react";
import {getAuth, onAuthStateChanged, signOut} from "firebase/auth";
import {useNavigate} from "react-router";
import {k_landing_route} from "../../App";
import {Card, Container, Form, Nav, Navbar} from "react-bootstrap";
import {doc, setDoc, getFirestore, collection, onSnapshot, query, orderBy} from "firebase/firestore";
import {v4} from "uuid";
import {image_loading_url} from "../../resource/image/sample-images";
import NavbarItems from "../Navbar";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import "./style.css";

const Home = () => {
    // function to navigate between pages
    const navigate = useNavigate();

    // reference to firebase auth
    const [auth, setAuth] = useState();
    // reference to logged-in user
    const [user, setUser] = useState();

    // list of community artworks
    const [artworks, setArtworks] = useState([]);

    // allow user to type in prompt for art
    const [textInput, setTextInput] = useState("");

    // allow user to set quality of image
    const qualityOptions = ['draft', 'normal', 'better', 'best'];
    const [quality, setQuality] = useState(undefined);

    // allow user to set iterations for image
    const iterationOptions = {'very fast': 30, 'fast': 100, 'normal': 200, 'slow': 300};
    const [iterations, setIterations] = useState(undefined); // this sets default to first value in iterations options

    // allow user to set drawer
    const drawerOptions = ['vqgan', 'clipdraw', 'line_sketch', 'pixel'];
    const [drawer, setDrawer] = useState(undefined);

    /**
     * Use effect hook to run on page render
     */
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
        onSnapshot(q, (querySnapshot) => {
            const documents = [];
            querySnapshot.forEach((doc) => {
                documents.push(doc.data());
            });
            console.log("Data fetched: ", documents);
            setArtworks(documents);
        });
    }, [navigate]);

    /**
     * Method to check if all options are selected
     * @returns {boolean} true if all options are selected
     */
    const notAllOptionsSelected = () => {
        return !(quality && iterations && drawer);
    }

    /**
     * Function to create db object
     */
    const generateImage = () => {
        const userId = user?.uid || "no_uid";

        if (!textInput || textInput.trim().length === 0) {
            alert("Input cannot be blank.");
            return;
        }

        const db = getFirestore();
        const docRef = doc(db, 'art', `${userId}_${v4()}`);

        // const base64Data = image_loading_base64;
        // const base64Url = `data:image/png;base64, ${base64Data}`;
        const imageUrl = image_loading_url;

        const userObj = Object.assign({}, JSON.parse(JSON.stringify(user)));

        if (userObj.stsTokenManager) {
            delete userObj['stsTokenManager'];
        }

        if (userObj.apiKey) {
            delete userObj['apiKey'];
        }

        setDoc(docRef, {
            id: v4(),
            text: textInput,
            prompt: textInput,
            quality: quality,
            drawer: drawer,
            aspect: 'widescreen',
            iterations: iterations,
            initImage: '',
            imageUrl: imageUrl,
            uid: userId,
            user: userObj,
            loading: true,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {merge: true}).then(() => {
            console.log('created art');
            setTextInput('');
        });
    }

    /**
     * Render HTML
     */
    return (<div>
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="/home">HokusAI</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="navbarScroll">
                    <NavbarItems/>
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

        {user && <Container style={{}} >
            <Container style={{margin: '10px'}} className={"centered"}>
                <h2 style={{textAlign: "center"}}>Create Art</h2>
                <Form>
                    <Form.Group className="mb-3" controlId="formTextInput">
                        <Form.Label>Prompt</Form.Label>
                        <Form.Control type="text" placeholder="Enter thoughts"
                                      value={textInput}
                                      onChange={(event) => {
                                          setTextInput(event.target.value);
                                      }}/>

                        <div className="mb-1">
                            <label htmlFor="quality" className="form-label">Quality</label><br/>

                            {qualityOptions.map((qualityOption) => {
                                return (<>
                                    <input key={`input-${qualityOption}`} type="radio"
                                           className="btn-check" name="quality" value={qualityOption}
                                           id={`quality-${qualityOption}`} autoComplete="off"
                                           onClick={(event) => {
                                               console.log('set quality to ', event.target.value);
                                               setQuality(event.target.value);
                                           }}/>
                                    <label key={`label-${qualityOption}`}
                                           className="btn btn btn-secondary"
                                           htmlFor={`quality-${qualityOption}`}>{qualityOption}</label>
                                </>);
                            })}

                            <div id="emailHelp" className="form-text">Better quality takes longer time to
                                generate
                            </div>
                        </div>

                        <div className="mb-1">
                            <label htmlFor="iterations" className="form-label">Iterations</label><br/>

                            {Object.keys(iterationOptions).map((iterationOption) => {
                                return (<>
                                    <input key={`input-${iterationOption}`} type="radio"
                                           className="btn-check" name="iterations"
                                           value={iterationOption} id={`iterations-${iterationOption}`}
                                           autoComplete="off" onClick={(event) => {
                                        console.log('set iterations to ', iterationOptions[event.target.value]);
                                        setIterations(iterationOptions[event.target.value]);
                                    }}/>
                                    <label key={`label-${iterationOption}`}
                                           className="btn btn btn-secondary"
                                           htmlFor={`iterations-${iterationOption}`}>{iterationOption}</label>
                                </>);
                            })}

                            <div id="emailHelp" className="form-text">More iterations takes longer time to
                                generate
                            </div>
                        </div>

                        <div className="mb-1">
                            <label htmlFor="drawer" className="form-label">Style</label><br/>

                            {drawerOptions.map((drawerOption) => {
                                return (<>
                                    <input key={`input-${drawerOption}`} type="radio"
                                           className="btn-check" name="drawer" value={drawerOption}
                                           id={`drawer-${drawerOption}`} onClick={(event) => {
                                        console.log('set drawer to ', event.target.value);
                                        setDrawer(event.target.value);
                                    }}/>
                                    <label key={`label-${drawerOption}`}
                                           className="btn btn btn-secondary"
                                           htmlFor={`drawer-${drawerOption}`}>{drawerOption}</label>
                                </>);
                            })}

                            <div id="emailHelp" className="form-text">Method that will be used for image
                                generation
                            </div>
                        </div>

                    </Form.Group>

                    <Button disabled={notAllOptionsSelected() || textInput.trim().length === 0}
                            variant="primary" type="submit" className={"btn btn-primary btn-lg"}
                            onClick={(e) => {
                                e.preventDefault();
                                generateImage();
                            }}>
                        Generate
                    </Button>
                </Form>
            </Container>

            <Container>
                <h2 style={{textAlign: "center"}}>Community Master Pieces</h2>
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    flexWrap: "wrap"
                }}>
                    {artworks.map((artwork) => {
                        return (<Card key={artwork.id} style={{width: '18rem', margin: "10px"}}>
                            {artwork.loading ? (<>
                                <Skeleton count={1} height={145} borderRadius='1rem' highlightColor={'#ddd'} style={{
                                    height: "100%", width: "92%", marginLeft: "4%", marginTop: "0.5rem"
                                }}/>
                            </>) : (<>
                                <Card.Img variant="top" src={artwork.imageUrl}/>
                            </>)}
                            <Card.Body>
                                {artwork.loading ? (<>
                                    <Card.Title>{artwork.text}</Card.Title>
                                    <Card.Text>
                                        Loading...
                                    </Card.Text>
                                </>) : (<>
                                    <Card.Title>{artwork.text}</Card.Title>
                                    <Card.Text>
                                        Created by {artwork.user.displayName}
                                    </Card.Text>
                                </>)}
                            </Card.Body>
                        </Card>);
                    })}
                </div>
            </Container>
        </Container>}
    </div>);
}

export default Home;
