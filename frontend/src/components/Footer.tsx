import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dota-secondary border-t border-gray-700 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Project Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">DotaSpammerFinder</h3>
            <p className="text-gray-400 text-sm">
              국내 Dota 2 커뮤니티를 위한 영웅 분석 및 플레이어 검색 플랫폼입니다.
              OpenDota API를 활용하여 실시간 게임 데이터를 제공합니다.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">링크</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://github.com/temy123/DotaSpammerFinder" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-dota-accent transition-colors"
                >
                  GitHub 저장소
                </a>
              </li>
              <li>
                <a 
                  href="https://www.opendota.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-dota-accent transition-colors"
                >
                  OpenDota
                </a>
              </li>
              <li>
                <a 
                  href="https://www.dota2.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-dota-accent transition-colors"
                >
                  Dota 2 공식 사이트
                </a>
              </li>
            </ul>
          </div>

          {/* Version Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">버전 정보</h3>
            <div className="text-sm text-gray-400 space-y-1">
              <p>Version: {import.meta.env.VITE_APP_VERSION || '2.0.0'}</p>
              <p>Last Updated: 2024-07-15</p>
              <p>Patch: 7.36</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            Copyright © 2024 temy123. Licensed under the Apache License 2.0.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            본 프로젝트는 비상업적 목적으로 제작되었으며, Valve Corporation과는 관련이 없습니다.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;