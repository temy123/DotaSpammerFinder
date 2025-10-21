import React, { useState } from 'react';
import axios from 'axios';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: 백엔드 API 엔드포인트 확인 후 수정 필요
      const response = await axios.get(`/api/search?q=${searchTerm}`);
      setResults(response.data);
    } catch (err) {
      setError('검색 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="search_container" style={{ padding: '20px 0' }}>
        <div className="search">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="플레이어 아이디 검색..."
          />
          <button onClick={handleSearch} disabled={loading}>
            {loading ? '검색 중...' : '검색'}
          </button>
        </div>
      </div>

      <section>
        <div className="top_banner">
          <div>
            <span>Players</span>
          </div>
        </div>
        <div className="players_container">
          <table>
            <thead style={{ backgroundColor: '#282830' }}>
              <tr>
                <th>ID</th>
                <th align="left">Player</th>
                <th>Rank</th>
                <th>Matches</th>
                <th>Win</th>
                <th>Lose</th>
                <th>WinRate</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan="7">검색 중...</td></tr>}
              {error && <tr><td colSpan="7">{error}</td></tr>}
              {!loading && !error && results.length === 0 && (
                <tr><td colSpan="7">검색 결과가 없습니다.</td></tr>
              )}
              {!loading && !error && results.map((player) => (
                <tr key={player.account_id}>
                  <td>{player.account_id}</td>
                  <td align="left">{player.personaname}</td>
                  <td>{player.rank_tier}</td>
                  <td>{player.games_played}</td>
                  <td>{player.win}</td>
                  <td>{player.lose}</td>
                  <td>{player.winrate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default SearchPage;