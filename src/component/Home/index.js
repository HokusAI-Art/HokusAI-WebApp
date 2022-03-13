import Button from 'react-bootstrap/Button';
import {useEffect, useState} from "react";
import {getAuth, onAuthStateChanged, signOut} from "firebase/auth";
import {useNavigate} from "react-router";
import {k_landing_route} from "../../App";
import {Card, Container, Form, Image, Nav, Navbar} from "react-bootstrap";
import {doc, setDoc, getFirestore, collection, onSnapshot, query, orderBy} from "firebase/firestore";
import {v4} from "uuid";
import {image_loading_url} from "../../resource/image/sample-images";
import NavbarItems from "../Navbar";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { getStorage, uploadBytes, ref, getDownloadURL } from "firebase/storage";
import React from "react";

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
    const iterationOptions = {'very fast': 50, 'fast': 100, 'normal': 200, 'slow': 300};
    const [iterations, setIterations] = useState(undefined); // this sets default to first value in iterations options

    // allow user to set drawer
    const drawerOptions = ['vqgan', 'clipdraw', 'line_sketch', 'pixel'];
    const [drawer, setDrawer] = useState(undefined);

    // allow user to set an initial image
    const [initImageUrl, setInitImageUrl] = useState("");
    const initImageUploadBtnRef = React.useRef();

    // allow user to set a target image
    const [targetImageUrl, setTargetImageUrl] = useState("");
    const targetImageUploadBtnRef = React.useRef();

    // allow user to set an image prompt
    const [imagePromptUrl, setImagePromptUrl] = useState("");
    const imagePromptUploadBtnRef = React.useRef();

    // boolean set to true when file is uploading
    const [uploadingImage, setUploadingImage] = useState(false);

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
     * Clear the file inputs
     */
    const clearFileInputs = () => {
        if (targetImageUploadBtnRef?.current) {
            targetImageUploadBtnRef.current.value = "";
            setTargetImageUrl("");
        }

        if (initImageUploadBtnRef?.current) {
            initImageUploadBtnRef.current.value = "";
            setInitImageUrl("");
        }
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
            initImage: initImageUrl,
            targetImage: targetImageUrl,
            target_image: targetImageUrl,
            imageUrl: imageUrl,
            image_prompts: imagePromptUrl,
            imagePrompt: imagePromptUrl,
            uid: userId,
            user: userObj,
            loading: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        }, {merge: true}).then(() => {
            // console.log('created art');
            // setTextInput('');
            alert("Image is being generated!");
            // clearForm();
        });
    }

    /**
     * Method to upload target image
     * @param files files array from html file input
     */
    const handleFileUpload = (files, imageType) => {
        if (files) {
            setUploadingImage(true);

            if (files.length >= 1) {
                const file = files[0];

                console.log(file);

                const storage = getStorage();

                if (storage) {
                    const storageRef = ref(storage, v4().toString());

                    uploadBytes(storageRef, file).then((snapshot) => {
                        getDownloadURL(snapshot.ref).then((downloadURL) => {
                            console.log('Uploaded file available at', downloadURL);
                            if (imageType === "targetImage") {
                                setTargetImageUrl(downloadURL);
                            }
                            else if (imageType === "initImage") {
                                setInitImageUrl(downloadURL);
                            }
                            else if (imageType === "imagePrompt") {
                                setImagePromptUrl(downloadURL);
                            }
                            else {
                                console.error("Unknown image type");
                            }
                            setUploadingImage(false);
                        });
                    }).catch((err) => {
                        console.error(err);
                        alert("Error uploading to storage bucket");
                        setUploadingImage(false);
                    });
                }
                else {
                    alert("Error connecting to storage bucket");
                    setUploadingImage(false);
                }
            }
            else {
                alert("Must select at least one file.");
                setUploadingImage(false);
            }
        }
        else {
            alert("Error getting file from local machine.");
            setUploadingImage(false);
        }
    }

    /**
     * Render HTML
     */
    return (<div>
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

        {user && <Container className='home-body' style={{}}>
            <form className="form" action="" method="get">
                <div className="form__image"></div>
                <h1 style={{fontFamily: "cyberpunk", color: "#E5DD06"}}>Create Art</h1>
                <div className="input">
                    <input id="name" type="text" className="input__element" placeholder=" "
                           onChange={(event) => {
                               setTextInput(event.target.value);
                           }}/>
                    <label className="input__label" htmlFor="name">Prompt</label>
                </div>
                <div id="emailHelp" className="form-text">Fun fact: you can use | as a separator between prompts. For
                    example, you can specify to generate an underwater city in the style of unreal engine with
                    "underwater city | unreal engine". See <a
                        href="https://imgur.com/a/SnSIQRu">https://imgur.com/a/SnSIQRu</a> for
                    more details.
                </div>
                <Form.Group className="mb-3" controlId="formTextInput">
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

                    {/*<div className="mb-1">*/}
                    {/*    <label htmlFor="file-upload-1" className="form-label">Target Image</label><br/>*/}
                    {/*    { (targetImageUrl && targetImageUrl.trim().length > 0) &&*/}
                    {/*        <Image fluid={true} src={targetImageUrl}/>*/}
                    {/*    }*/}
                    {/*    <input ref={targetImageUploadBtnRef} disabled={uploadingImage} type="file" name="file-upload-1" onChange={(event) => {*/}
                    {/*        const files = event?.target?.files;*/}
                    {/*        handleFileUpload(files, "targetImage");*/}
                    {/*    }} />*/}
                    {/*    <div id="emailHelp" className="form-text">Image to look similar to after generation*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    <div className="mb-1">
                        <label htmlFor="file-upload-2" className="form-label">Initial Image</label><br/>
                        { (initImageUrl && initImageUrl.trim().length > 0) &&
                            <Image fluid={true} src={initImageUrl}/>
                        }
                        <input ref={initImageUploadBtnRef} disabled={uploadingImage} type="file" name="file-upload-2" onChange={(event) => {
                            const files = event?.target?.files;
                            handleFileUpload(files, "initImage");
                        }} />
                        <div id="emailHelp" className="form-text">Image to look similar to before generation
                        </div>
                    </div>

                    {/*<div className="mb-1">*/}
                    {/*    <label htmlFor="file-upload-3" className="form-label">Image Prompt</label><br/>*/}
                    {/*    { (imagePromptUrl && imagePromptUrl.trim().length > 0) &&*/}
                    {/*        <Image fluid={true} src={imagePromptUrl}/>*/}
                    {/*    }*/}
                    {/*    <input ref={imagePromptUploadBtnRef} disabled={uploadingImage} type="file" name="file-upload-3" onChange={(event) => {*/}
                    {/*        const files = event?.target?.files;*/}
                    {/*        handleFileUpload(files, "imagePrompt");*/}
                    {/*    }} />*/}
                    {/*    <div id="emailHelp" className="form-text">Image to use as a prompt*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                </Form.Group>
                <button type="button" className="button"
                        disabled={notAllOptionsSelected() || textInput.trim().length === 0 || uploadingImage} onClick={(e) => {
                    e.preventDefault();
                    generateImage();
                }}>
                    <div className="button__label">Continue</div>
                    <div className="button__icon"></div>
                </button>
            </form>

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
            <div className={"centered"}>
                <p1>Made with</p1>
                <p1 className={"madeWith"}> love</p1>
                <p1>🔥 pixray 🔥</p1>
            </div>

        </Container>}

    </div>);
}

export default Home;
