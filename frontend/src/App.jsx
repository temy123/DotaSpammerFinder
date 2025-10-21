import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import MainPage from './pages/MainPage';
import AboutPage from './pages/AboutPage';
import StatsPage from './pages/StatsPage';
import SearchPage from './pages/SearchPage';

function App() {
  return (
    <>
      <Header />
      <div className="container">
        <Routes>
          {/* 페이지 컴포넌트는 추후에 추가될 예정입니다. */}
          <Route path="/" element={<MainPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
