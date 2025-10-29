import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import { HeroStat, TIER_RATINGS } from '../types';

const HeroStatsPage: React.FC = () => {
  const [heroRankings, setHeroRankings] = useState<HeroStat[]>([]);
  const [selectedTier, setSelectedTier] = useState(7); // Divine (Tier 8/Immortal has no data from OpenDota)
  const [selectedPatch, setSelectedPatch] = useState('');
  const [selectedRole, setSelectedRole] = useState(0); // All roles
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [patches, setPatches] = useState<string[]>([]);

  // Load initial data
  useEffect(() => {
    loadPatches();
    loadHeroRankings();
  }, [selectedTier, selectedPatch]);

  const loadPatches = async () => {
    try {
      const patchList = await apiService.getPatches();
      setPatches(patchList);
      if (patchList.length > 0 && !selectedPatch) {
        setSelectedPatch(patchList[0]);
      }
    } catch (err) {
      console.error('Failed to load patches:', err);
    }
  };

  const loadHeroRankings = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const rankings = await apiService.getHeroRankings(selectedTier, {
        patch: selectedPatch || undefined,
        limit: 50,
      });
      setHeroRankings(rankings);
    } catch (err) {
      setError('영웅 데이터를 불러오는데 실패했습니다.');
      console.error('Failed to load hero rankings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredHeroes = heroRankings.filter(stat => {
    if (searchQuery) {
      const hero = stat.hero;
      if (!hero) return false;
      
      const query = searchQuery.toLowerCase();
      return (
        hero.localizedNameKor.toLowerCase().includes(query) ||
        hero.localizedNameEng.toLowerCase().includes(query) ||
        hero.name.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const getTierColor = (tierRating: number) => {
    const tier = TIER_RATINGS[tierRating as keyof typeof TIER_RATINGS];
    return tier?.color || 'tier-5';
  };

  const getTierName = (tierRating: number) => {
    const tier = TIER_RATINGS[tierRating as keyof typeof TIER_RATINGS];
    return tier?.name || '5티어';
  };

  return (
    <div className="min-h-screen bg-dota-primary">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">영웅 분석</h1>
          <p className="text-gray-300">티어별 영웅 통계 및 메타 분석</p>
        </div>

        {/* Notice */}
        <div className="card bg-dota-accent/10 border-dota-accent mb-8">
          <div className="flex items-center space-x-2">
            <span className="text-dota-accent font-semibold">
              [24-07-15] 7.36 추가
            </span>
          </div>
          <div className="mt-2 text-gray-300">
            늦은 업데이트 죄송합니다 ㅠ 7.36와 최신 데이터로 업데이트했습니다
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Tier Filter */}
          <div className="card">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              티어 선택
            </label>
            <select 
              className="input-field w-full"
              value={selectedTier}
              onChange={(e) => setSelectedTier(parseInt(e.target.value))}
            >
              <option value={7}>신 [Divine]</option>
              <option value={6}>거장 [Ancient]</option>
              <option value={5}>전설 [Legend]</option>
              <option value={4}>집정관 [Archon]</option>
              <option value={3}>성전사 [Crusader]</option>
              <option value={2}>수호자 [Guardian]</option>
              <option value={1}>선구자 [Herald]</option>
            </select>
          </div>

          {/* Patch Filter */}
          <div className="card">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              패치 버전
            </label>
            <select 
              className="input-field w-full"
              value={selectedPatch}
              onChange={(e) => setSelectedPatch(e.target.value)}
            >
              {patches.map(patch => (
                <option key={patch} value={patch}>{patch}</option>
              ))}
            </select>
          </div>

          {/* Role Filter */}
          <div className="card">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              역할
            </label>
            <select 
              className="input-field w-full"
              value={selectedRole}
              onChange={(e) => setSelectedRole(parseInt(e.target.value))}
            >
              <option value={0}>전체</option>
              <option value={1}>세이프 레인</option>
              <option value={2}>미드</option>
              <option value={3}>오프 레인</option>
              <option value={4}>서포터</option>
              <option value={5}>하드 서포터</option>
            </select>
          </div>

          {/* Search */}
          <div className="card">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              영웅 검색
            </label>
            <input
              type="text"
              className="input-field w-full"
              placeholder="영웅 검색 (항마사, 등등)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Hero List */}
        <div className="card">
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

          {!isLoading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dota-secondary">
                  <tr>
                    <th className="px-4 py-3 text-left text-white">순번</th>
                    <th className="px-4 py-3 text-left text-white">영웅</th>
                    <th className="px-4 py-3 text-center text-white">티어</th>
                    <th className="px-4 py-3 text-center text-white">승률</th>
                    <th className="px-4 py-3 text-center text-white">픽수</th>
                    <th className="px-4 py-3 text-center text-white">승수</th>
                    <th className="px-4 py-3 text-left text-white">패치</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHeroes.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                        {searchQuery ? '검색 결과가 없습니다' : '영웅 데이터가 없습니다'}
                      </td>
                    </tr>
                  ) : (
                    filteredHeroes.map((stat, index) => (
                      <tr key={stat.id} className="border-b border-gray-700 hover:bg-gray-800">
                        <td className="px-4 py-3 text-white">{index + 1}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-3">
                            <img
                              src={stat.hero?.imgUrl ? `https://api.opendota.com${stat.hero.imgUrl}` : '/img/img_null.png'}
                              alt={stat.hero?.localizedNameKor || 'Unknown Hero'}
                              className="w-12 h-12 rounded"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/img/img_null.png';
                              }}
                            />
                            <div>
                              <div className="text-white font-medium">
                                {stat.hero?.localizedNameKor || stat.hero?.localizedNameEng || 'Unknown Hero'}
                              </div>
                              <div className="text-gray-400 text-sm">
                                {stat.hero?.localizedNameEng}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={getTierColor(stat.tierRating)}>
                            {getTierName(stat.tierRating)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center text-white">
                          {stat.picks > 0 ? `${((stat.wins / stat.picks) * 100).toFixed(1)}%` : '--'}
                        </td>
                        <td className="px-4 py-3 text-center text-white">
                          {stat.picks.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-center text-white">
                          {stat.wins.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-white">
                          {stat.patchVersion}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroStatsPage;