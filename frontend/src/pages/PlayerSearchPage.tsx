import React from 'react';

const PlayerSearchPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dota-primary">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="card bg-dota-secondary">
            <h1 className="text-2xl font-bold text-white mb-4">Players</h1>
          </div>
        </div>

        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dota-secondary">
                <tr>
                  <th className="px-4 py-3 text-left text-white">ID</th>
                  <th className="px-4 py-3 text-left text-white">Player</th>
                  <th className="px-4 py-3 text-center text-white">Rank</th>
                  <th className="px-4 py-3 text-center text-white">Matches</th>
                  <th className="px-4 py-3 text-center text-white">Win</th>
                  <th className="px-4 py-3 text-center text-white">Lose</th>
                  <th className="px-4 py-3 text-center text-white">WinRate</th>
                </tr>
              </thead>
              <tbody>
                {/* Placeholder for player data */}
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                    플레이어 데이터를 로드하고 있습니다...
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerSearchPage;