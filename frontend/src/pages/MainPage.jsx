import React from 'react';

const MainPage = () => {
  return (
    <div>
      <img className="logo" src="/img/img_logo_today.jpg" onError={(e) => { e.target.onerror = null; e.target.src='/img/img_null.png' }} alt="Today's Logo" />
      <div className="search_container">
        <div className="search">
          <label htmlFor="keyword">Search</label>
          <input type="text" id="keyword" placeholder="플레이어 아이디 (ex: 심해어 짱고 ...)" />
        </div>
        <div className="players_container">
          <div>
            <span>
              Players Profile
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;