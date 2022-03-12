import Button from 'react-bootstrap/Button';
import {useEffect, useState} from "react";
import {getAuth, onAuthStateChanged, signOut} from "firebase/auth";
import {useNavigate} from "react-router";
import {k_home_route, k_immersive_view_route, k_landing_route} from "../../App";
import {Card, Container, DropdownButton, Form, FormControl, Nav, Navbar, NavDropdown, Dropdown} from "react-bootstrap";
import { doc, setDoc, getFirestore, collection, onSnapshot, query, where, orderBy} from "firebase/firestore";
import {v4} from "uuid";
import {image_loading_base64, image_loading_url, panda_base64} from "../../resource/image/sample-images";
import NavbarItems from "../Navbar";

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
    const qualityOptions = ['draft', 'normal'];
    const [quality, setQuality] = useState(qualityOptions[0]);

    // allow user to set iterations for image
    const iterationOptions = ['very fast', 'fast', 'normal', 'slow'];
    // const [quality, setQuality] = useState(qualityOptions[0]);

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
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const documents = [];
            querySnapshot.forEach((doc) => {
                documents.push(doc.data());
            });
            console.log("Data fetched: ", documents);
            setArtworks(documents);
        });
    }, [navigate]);

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
            drawer: 'vqgan',
            aspect: 'widescreen',
            iterations: 100,
            initImage: '',
            imageUrl: imageUrl,
            uid: userId,
            user: userObj,
            loading: true,
            createdAt: new Date(),
            updatedAt: new Date()
        }, { merge: true }).then(() => {
            console.log('created art');
            setTextInput('');
        });
    }

    /**
     * Render HTML
     */
    return (
        <div>
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

            { user &&
                <Container style={{}}>
                    <Container style={{margin: '10px'}}>
                        <h2 style={{textAlign: "center"}}>Create Art</h2>
                        <Form>
                            <Form.Group className="mb-3" controlId="formTextInput">
                                <Form.Label>Prompt</Form.Label>
                                <Form.Control type="text" placeholder="Enter thoughts"
                                              value={textInput}
                                              onChange={(event) => {
                                    setTextInput(event.target.value);
                                }}/>

                                {/*<Form.Label>Quality</Form.Label>*/}
                                {/*<DropdownButton id="dropdown-basic-button" title={quality}>*/}
                                {/*    <Dropdown.Item onClick={() => {setQuality("draft")}}>draft</Dropdown.Item>*/}
                                {/*    <Dropdown.Item onClick={() => {setQuality("normal")}}>normal</Dropdown.Item>*/}
                                {/*    <Dropdown.Item onClick={() => {setQuality("better")}}>better</Dropdown.Item>*/}
                                {/*    <Dropdown.Item onClick={() => {setQuality("best")}}>best</Dropdown.Item>*/}
                                {/*</DropdownButton>*/}

                                <div className="mb-1">
                                    <label htmlFor="quality" className="form-label">Quality</label><br/>

                                    {
                                        qualityOptions.map((qualityOption) => {
                                            return (
                                                <>
                                                    <input key={`input-${qualityOption}`} type="radio" className="btn-check" name="quality" value={qualityOption} id={qualityOption} autoComplete="off" onClick={(event) => {
                                                        console.log('set quality to ', event.target.value);
                                                        setQuality(event.target.value);
                                                    }}/>
                                                    <label key={`label-${qualityOption}`} className="btn btn btn-secondary" htmlFor={qualityOption}>{qualityOption}</label>
                                                </>
                                            );
                                        })
                                    }



                                    {/*<input type="radio" className="btn-check" name="quality" value="normal" id="quality2" autoComplete="off" />*/}
                                    {/*<label className="btn btn btn-secondary" htmlFor="quality2">normal</label>*/}

                                    <div id="emailHelp" className="form-text">Better quality takes longer time to generate</div>
                                </div>

                            </Form.Group>

                            <Button variant="primary" type="submit" className={"btn btn-primary btn-lg"} onClick={(e) => {
                                e.preventDefault();
                                generateImage();
                            }}>
                                Generate
                            </Button>
                        </Form>
                    </Container>

                    <Container>
                        <h2 style={{textAlign: "center"}}>Community Master Pieces</h2>
                        <div style={{display: "flex", justifyContent: "center", alignContent: "center", alignItems: "center", flexWrap: "wrap"}}>
                            {
                                artworks.map((artwork) => {
                                    return (
                                        <Card key={artwork.id} style={{ width: '18rem', margin: "10px" }}>
                                            <Card.Img variant="top" src={artwork.imageUrl} />
                                            <Card.Body>
                                                {
                                                    artwork.loading ? (
                                                        <>
                                                            <Card.Title>Processing...</Card.Title>
                                                            <Card.Text>
                                                                Created by {artwork.user.displayName}
                                                            </Card.Text>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Card.Title>{artwork.text}</Card.Title>
                                                            <Card.Text>
                                                                Created by {artwork.user.displayName}
                                                            </Card.Text>
                                                        </>
                                                    )
                                                }
                                            </Card.Body>
                                        </Card>
                                    );
                                })
                            }
                        </div>
                    </Container>
                </Container>
            }
        </div>
    );
}

export default Home;
