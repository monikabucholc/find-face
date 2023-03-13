import React from 'react'
import { HashRouter, Routes, Route } from "react-router-dom";
import Navigation from './components/Navigation';
import Login from './pages/login';
import Register from './pages/register';
import Home from './pages/home';
import ProtectedRoute from './ProtectedRoute';
import './styles/globals.css';
import faceWoman from './img/face-woman.png';
import faceMan from './img/face-man.png';

function App() {
  return (
    <div>
      <div className="background-solid">
        <div className="background-curve"/>
      </div>
      <div className="background-faces">
        <img className="background-face" src={faceWoman} alt="Recognize woman face"/>
        <img className="background-face" src={faceMan} alt="Recognize woman face"/>
      </div>
      <div className="app">
        <HashRouter>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={[<Navigation key="1" />, <Home key="2"/>]} />
            </Route>
              <Route path="/login" element={[<Navigation key="3"/>, <Login key="4"/>]}/>
              <Route path="/register" element={[<Navigation key="5"/>, <Register key="6"/>]}/>
          </Routes>
        </HashRouter>
      </div> 
    </div>
  );
}

export default App;
