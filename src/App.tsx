// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import ListView from './components/ListView/ListView';
import GalleryView from './components/GalleryView/GalleryView';
import DetailView from './components/DetailView/DetailView';
import './App.css';

function App() {
  return (
    <Router basename='/mp2'>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <div className="nav-logo">
              <div className="pokeball-icon"></div>
              <h2>Pokedex</h2>
            </div>
            <div className="nav-links">
              <NavLink 
                to="/" 
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                end
              >
                List View
              </NavLink>
              <NavLink 
                to="/gallery" 
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                Gallery View
              </NavLink>
            </div>
          </div>
        </nav>
        
        <Routes>
          <Route path="/" element={<ListView />} />
          <Route path="/gallery" element={<GalleryView />} />
          <Route path="/pokemon/:id" element={<DetailView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;