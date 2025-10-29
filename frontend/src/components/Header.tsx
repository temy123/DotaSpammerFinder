import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-dota-secondary border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/img/img_logo_text_white.png" 
              alt="DotaSpammerFinder" 
              className="h-8"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/img/img_null.png';
              }}
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-dota-accent bg-gray-700' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              홈
            </Link>
            <Link
              to="/heroes"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/heroes') 
                  ? 'text-dota-accent bg-gray-700' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              영웅 분석
            </Link>
            <Link
              to="/players"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/players') 
                  ? 'text-dota-accent bg-gray-700' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              플레이어 검색
            </Link>
            <Link
              to="/about"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/about') 
                  ? 'text-dota-accent bg-gray-700' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              소개
            </Link>
          </nav>

          {/* Hit Counter */}
          <div className="hidden md:block">
            <a href="https://hits.sh/dota-gg.kro.kr/" target="_blank" rel="noopener noreferrer">
              <img 
                alt="Hits" 
                src="https://hits.sh/dota-gg.kro.kr.svg?style=flat-square&label=방문수&color=5383e8" 
                className="h-6"
              />
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-300 hover:text-white hover:bg-gray-700 p-2 rounded-md"
              aria-label="메뉴"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;