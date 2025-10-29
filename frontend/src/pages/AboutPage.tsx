import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dota-primary">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="card">
            <h1 className="text-3xl font-bold text-white mb-8">DotaSpammerFinder 소개</h1>
            
            <div className="space-y-6 text-gray-300">
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">설명</h2>
                <p className="leading-relaxed">
                  본 프로젝트는 op.gg의 디자인 카피 버전으로 해당 사이트를 수익의 명목으로 사용하는 것이 아닌
                  개인과 일부의 정보 공유를 위한 비상업용 프로젝트입니다.
                </p>
                <p className="leading-relaxed mt-4">
                  국내에 도타 관련 커뮤니티가 많지 않고 정보를 공유할 곳이 없어 OPENDOTA API를 통해 
                  정적 페이지를 구성하였고 이에 기반하는 여러 커뮤니티가 생기길 바라며 오픈소스로 공유하게 되었습니다.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">기술 스택</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">프론트엔드</h3>
                    <ul className="space-y-1">
                      <li>• React 18 + TypeScript</li>
                      <li>• Vite (빌드 도구)</li>
                      <li>• Tailwind CSS (스타일링)</li>
                      <li>• Zustand (상태 관리)</li>
                      <li>• React Router (라우팅)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">백엔드</h3>
                    <ul className="space-y-1">
                      <li>• Node.js + Express</li>
                      <li>• TypeScript</li>
                      <li>• Prisma ORM</li>
                      <li>• SQLite/PostgreSQL</li>
                      <li>• OpenDota API</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">주요 기능</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-dota-secondary p-4 rounded-lg">
                    <h3 className="text-white font-medium mb-2">🔍 플레이어 검색</h3>
                    <p className="text-sm">실시간 플레이어 정보 및 매치 기록 조회</p>
                  </div>
                  <div className="bg-dota-secondary p-4 rounded-lg">
                    <h3 className="text-white font-medium mb-2">📊 영웅 분석</h3>
                    <p className="text-sm">티어별 승률, 픽률, 밴률 통계</p>
                  </div>
                  <div className="bg-dota-secondary p-4 rounded-lg">
                    <h3 className="text-white font-medium mb-2">📈 메타 추이</h3>
                    <p className="text-sm">패치별 영웅 메타 변화 추적</p>
                  </div>
                  <div className="bg-dota-secondary p-4 rounded-lg">
                    <h3 className="text-white font-medium mb-2">🎯 역할별 분석</h3>
                    <p className="text-sm">포지션별 영웅 성능 분석</p>
                  </div>
                  <div className="bg-dota-secondary p-4 rounded-lg">
                    <h3 className="text-white font-medium mb-2">📱 반응형 디자인</h3>
                    <p className="text-sm">모바일 및 데스크톱 최적화</p>
                  </div>
                  <div className="bg-dota-secondary p-4 rounded-lg">
                    <h3 className="text-white font-medium mb-2">⚡ 실시간 업데이트</h3>
                    <p className="text-sm">최신 패치 데이터 자동 동기화</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">버전 히스토리</h2>
                <div className="space-y-3">
                  <div className="border-l-4 border-dota-accent pl-4">
                    <div className="font-medium text-white">v2.0.0 (현재)</div>
                    <div className="text-sm">React + Node.js 기반 모던 웹 애플리케이션으로 전면 재구성</div>
                  </div>
                  <div className="border-l-4 border-gray-600 pl-4">
                    <div className="font-medium text-white">v1.x (이전)</div>
                    <div className="text-sm">정적 HTML/CSS/JS 기반 GitHub Pages 버전</div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">라이센스</h2>
                <div className="bg-dota-secondary p-4 rounded-lg">
                  <p className="text-sm leading-relaxed">
                    본 프로젝트는 <strong>Apache License 2.0</strong>을 기반으로 합니다.
                  </p>
                  <p className="text-sm mt-2">
                    Copyright [2022-2025] [temy123]
                  </p>
                  <p className="text-sm mt-2">
                    자세한 내용은 프로젝트 저장소의 LICENSE 파일을 참조하세요.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">기여 및 문의</h2>
                <div className="flex flex-wrap gap-4">
                  <a 
                    href="https://github.com/temy123/DotaSpammerFinder" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex items-center space-x-2"
                  >
                    <span>GitHub 저장소</span>
                  </a>
                  <a 
                    href="https://github.com/temy123/DotaSpammerFinder/issues" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-secondary inline-flex items-center space-x-2"
                  >
                    <span>이슈 제보</span>
                  </a>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;