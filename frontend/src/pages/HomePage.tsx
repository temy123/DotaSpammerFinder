import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { SearchPlayer } from '../types';

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchPlayer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounced search
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const results = await apiService.searchPlayers(searchQuery);
        setSearchResults(results);
      } catch (err) {
        setError('검색 중 오류가 발생했습니다.');
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const formatLastMatchTime = (timestamp?: string) => {
    if (!timestamp) return '알 수 없음';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    return `${diffDays}일 전`;
  };

  return (
    <div className="min-h-screen bg-dota-primary">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <img 
            className="mx-auto mb-6 h-32" 
            src="/img/img_logo_today.jpg" 
            alt="DotaSpammerFinder Logo"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/img/img_null.png';
            }}
          />
          <h1 className="text-4xl font-bold text-white mb-4">
            짱고는 못말려
          </h1>
          <p className="text-xl text-gray-300">
            Dota 2 플레이어 및 영웅 분석 플랫폼
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto">
          <div className="card mb-8">
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">
              플레이어 검색
            </h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="keyword" className="block text-sm font-medium text-gray-300 mb-2">
                  플레이어 아이디를 입력하세요
                </label>
                <input
                  type="text"
                  id="keyword"
                  className="input-field w-full"
                  placeholder="플레이어 아이디 (ex: 심해어 짱고 ...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Search Results */}
          <div className="space-y-4">
            <div className="text-lg font-medium text-white mb-4">
              Players Profile
            </div>
            
            {isLoading && (
              <div className="flex justify-center py-8">
                <div className="loading-spinner w-8 h-8 border-4 border-dota-accent border-t-transparent rounded-full"></div>
              </div>
            )}

            {error && (
              <div className="text-red-400 text-center py-8">
                {error}
              </div>
            )}

            {!isLoading && !error && searchResults.length === 0 && searchQuery.length >= 2 && (
              <div className="text-gray-400 text-center py-8">
                검색 결과가 없습니다
              </div>
            )}

            {!isLoading && !error && searchQuery.length < 2 && (
              <div className="text-gray-400 text-center py-8">
                플레이어를 검색해보세요
              </div>
            )}

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-3">
                {searchResults.map((player) => (
                  <div key={player.id} className="card hover:border-dota-accent transition-colors">
                    <a 
                      href={player.profileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-4"
                    >
                      <img 
                        src={player.avatarFullUrl || player.avatarUrl || '/img/img_null.png'} 
                        alt={player.personaName}
                        className="w-16 h-16 rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/img/img_null.png';
                        }}
                      />
                      <div className="flex-1">
                        <div className="text-white font-medium text-lg">
                          {player.personaName || 'Unknown Player'}
                        </div>
                        <div className="text-gray-400 text-sm">
                          Last Match: {formatLastMatchTime(player.lastMatchTime)}
                        </div>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="text-dota-accent text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">플레이어 검색</h3>
            <p className="text-gray-300">실시간 플레이어 정보 조회</p>
          </div>
          
          <div className="card text-center">
            <div className="text-dota-accent text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-white mb-2">영웅 분석</h3>
            <p className="text-gray-300">티어별 영웅 통계 분석</p>
          </div>
          
          <div className="card text-center">
            <div className="text-dota-accent text-4xl mb-4">📈</div>
            <h3 className="text-xl font-semibold text-white mb-2">메타 추이</h3>
            <p className="text-gray-300">패치별 메타 변화 추적</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;