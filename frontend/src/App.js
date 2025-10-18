// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
// import Navbar from './components/Navbar';
import Home from './pages/Home'; // FrameTypeSelection page
import FrameTypeSelection from './pages/FrameTypeSelection';
import ServiceSelection from './pages/ServiceSelection';
import CollageLayoutSelector from './components/CollageLayoutSelector';
import GlbFrame from './components/GlbFrame';

function App() {
  const [selectedLayout, setSelectedLayout] = useState(null);

  return (
    <Router>
      {/* <Navbar /> */}
      <Routes>
        {/* Step 1: Frame Type Selection */}
        <Route path="/" element={<FrameTypeSelection onSelectLayout={setSelectedLayout} />} />

        {/* Step 2: Service Selection */}
        <Route path="/service" element={<ServiceSelection />} />

        {/* Step 3: Collage Layout Selection */}
        <Route path="/layout" element={<CollageLayoutSelector onSelectLayout={setSelectedLayout} />} />

          <Route path="/glb" element={<GlbFrame onSelectLayout={setSelectedLayout} />} />
      </Routes>
    </Router>
  );
}

export default App;
