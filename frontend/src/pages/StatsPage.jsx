import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StatsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // TODO: 백엔드 API 엔드포인트 확인 후 수정 필요
        const response = await axios.get('/api/stats'); 
        setStats(response.data);
      } catch (err) {
        setError('데이터를 불러오는 데 실패했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <div className="notice">
        <div>
          <span>
            <strong>[24-07-15] 7.36 추가</strong>
          </span>
        </div>
        <div className="notice_content">
          <span>
            늦은 업데이트 죄송합니다 ㅠ 7.36와 최신 데이터로 업데이트했습니다
          </span>
        </div>
      </div>

      <div className="top_container">
        <nav>
          <div>
            <div className="dropdown_">
              <select id="rank">
                <option value="80">불멸자 [Immortal]</option>
                <option value="70">신 [Divine]</option>
                <option value="60">거장 [Ancient]</option>
                <option value="50">전설 [Legend]</option>
                <option value="40">집정관 [Arcorn]</option>
                <option value="30">성전사 [Crusader]</option>
                <option value="20">수호자 [Guardian]</option>
                <option value="10">선구자 [Herald]</option>
              </select>
            </div>
            {/* Other filter buttons would go here */}
          </div>
          <div>
            <div className="role_container">
              <div className="role_list">
                <button><span>전체</span></button>
                <button><img src="img/icon_carry.jpg" width="24" alt="carry" height="24" /><span>세이프 레인</span></button>
                <button><img src="img/icon_nuker.jpg" width="24" alt="nuker" height="24" /><span>미드</span></button>
                <button><img src="img/icon_durable.jpg" width="24" alt="durable" height="24" /><span>오프 레인</span></button>
              </div>
            </div>
          </div>
        </nav>
      </div>

      <div className="main_container">
        <aside>
          <div className="search">
            <input
              id="filterHeroInput"
              type="text"
              placeholder="영웅 검색 (항마사, 등등)"
            />
          </div>
          <nav className="navHero">
            <ul id="navHeroContainer">{/* Hero list will be rendered here */}</ul>
          </nav>
        </aside>

        <main>
          <table>
            <colgroup>
              <col width="70" />
              <col width="*" />
              <col width="64" />
              <col width="94" />
              <col width="110" />
              <col width="94" />
              <col width="135" />
            </colgroup>
            <thead>
              <tr>
                <th align="left">순번</th>
                <th align="left">영웅</th>
                <th>티어</th>
                <th>승률</th>
                <th>픽률</th>
                <th>밴률</th>
                <th>상대하기 어려운 영웅</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan="7">로딩 중...</td></tr>}
              {error && <tr><td colSpan="7">{error}</td></tr>}
              {!loading && !error && Array.isArray(stats) && stats.map((hero, index) => (
                <tr key={hero.id}>
                  <td>{index + 1}</td>
                  <td>{hero.name}</td>
                  <td>{hero.tier}</td>
                  <td>{hero.winrate}%</td>
                  <td>{hero.pickrate}%</td>
                  <td>{hero.banrate}%</td>
                  <td>{/* Counter heroes */}</td>
                </tr>
              ))}
              {!loading && !error && !Array.isArray(stats) && (
                <tr><td colSpan="7">데이터 형식이 올바르지 않습니다.</td></tr>
              )}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
};

export default StatsPage;