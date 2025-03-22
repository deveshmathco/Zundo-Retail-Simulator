// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import DataForm from './components/DataForm';
import SavedScenarios from './components/SavedScenarios';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <main className="main-content">
                    <Routes>
                        <Route path="/build" element={<DataForm />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/saved" element={<SavedScenarios />} />
                        <Route path="/" element={<Navigate to="/build" replace />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;