import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div className="header">
      <div>
        <Link to="/">
          <img src="/img/img_logo_text_white.png" alt="Logo" />
        </Link>
        <div className="counter">
          <a href="https://hits.sh/dota-gg.kro.kr/">
            <img
              alt="Hits"
              src="https://hits.sh/dota-gg.kro.kr.svg?style=flat-square&label=방문수&color=5383e8"
            />
          </a>
        </div>
      </div>
      <ul style={{ display: 'flex', listStyle: 'none', padding: 0, margin: 0, gap: '20px' }}>
        <li>
          <Link to="/">홈</Link>
        </li>
        <li>
          <Link to="/about">소개</Link>
        </li>
        <li>
          <Link to="/stats">영웅 분석</Link>
        </li>
        <li>
          <Link to="/search">통계</Link>
        </li>
      </ul>
    </div>
  );
};

export default Header;