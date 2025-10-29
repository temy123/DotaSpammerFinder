import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import HeroStatsPage from './pages/HeroStatsPage';
import PlayerSearchPage from './pages/PlayerSearchPage';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/heroes" element={<HeroStatsPage />} />
          <Route path="/players" element={<PlayerSearchPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;