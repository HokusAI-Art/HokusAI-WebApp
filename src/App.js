import React from "react";
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import Landing from "./component/Landing";
import Home from "./component/Home";

// init firebase
import firebase from 'firebase/compat/app';
import VR from "./component/VR";

const firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_API_KEY);

export const app = firebase.initializeApp(firebaseConfig);

// constants to keep track of url routes
export const k_home_route = "/home";
export const k_immersive_view_route = "/vr";
export const k_landing_route = "/";

const App = () => {
  return (
      <Router>
        {/* A <Router> looks through its children <Route>s and
                renders the first one that matches the current URL. */}
        <Routes>
            <Route path={k_home_route} element={<Home/>}/>
            <Route path={k_immersive_view_route} element={<VR/>}/>
            <Route path={k_landing_route} element={<Landing/>}/>
            <Route path="*" element={<Navigate to={k_landing_route}/>}/>
        </Routes>
      </Router>
  );
}

export default App;
