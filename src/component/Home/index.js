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

const Home = () => {
    const [textInput, setTextInput] = useState("");
    const [auth, setAuth] = useState();
    const [user, setUser] = useState();
    const [quality, setQuality] = useState("draft");
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

                                <Form.Label>Quality</Form.Label>
                                <DropdownButton id="dropdown-basic-button" title={quality}>
                                    <Dropdown.Item onClick={() => {setQuality("draft")}}>draft</Dropdown.Item>
                                    <Dropdown.Item onClick={() => {setQuality("normal")}}>normal</Dropdown.Item>
                                    <Dropdown.Item onClick={() => {setQuality("better")}}>better</Dropdown.Item>
                                    <Dropdown.Item onClick={() => {setQuality("best")}}>best</Dropdown.Item>
                                </DropdownButton>
                            </Form.Group>

                            <Button variant="primary" type="submit" onClick={(e) => {
                                e.preventDefault();
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
                                    quality: 'draft',
                                    type: 'painting',
                                    aspect: 'widescreen',
                                    init_image: '',
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
