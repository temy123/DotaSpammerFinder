# DotaSpammerFinder v2.0

> Dota 2 플레이어 및 영웅 분석 플랫폼 - 모던 웹 애플리케이션 버전

## 🚀 빠른 시작

### 전체 프로젝트 실행
```bash
# 의존성 설치
npm run install:all

# 개발 서버 실행 (프론트엔드 + 백엔드)
npm run dev
```

### 개별 실행
```bash
# 백엔드만 실행
npm run dev:backend

# 프론트엔드만 실행  
npm run dev:frontend
```

## 📁 프로젝트 구조

```
DotaSpammerFinder/
├── frontend/          # React + TypeScript 프론트엔드
├── backend/           # Node.js + Express 백엔드
├── shared/            # 공통 타입 및 유틸리티
├── package.json       # 루트 워크스페이스 설정
└── docker-compose.yml # 개발 환경 컨테이너
```

## 🛠️ 기술 스택

### Backend
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: SQLite (개발) / PostgreSQL (프로덕션)
- **ORM**: Prisma
- **API**: RESTful API
- **Caching**: Redis (선택사항)

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Router**: React Router v6

## 📊 주요 기능

- 🔍 **플레이어 검색**: OpenDota API 기반 실시간 검색
- 📈 **영웅 통계**: 티어별 승률, 픽률, 밴률 분석
- 🎯 **메타 분석**: 패치별 영웅 메타 추이
- 📱 **반응형 디자인**: 모바일 최적화
- ⚡ **실시간 업데이트**: 자동 데이터 동기화

## 🔧 개발

### 환경 요구사항
- Node.js 18+
- npm 9+

### 설치 및 실행
```bash
# 저장소 클론
git clone https://github.com/temy123/DotaSpammerFinder.git
cd DotaSpammerFinder

# 의존성 설치
npm run install:all

# 환경변수 설정
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 데이터베이스 초기화
cd backend && npx prisma migrate dev

# 개발 서버 실행
npm run dev
```

## 🚀 배포

### Docker를 사용한 배포
```bash
# 전체 빌드
npm run build

# Docker 컨테이너 실행
docker-compose up -d
```

## 📄 라이센스

Apache License 2.0 - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🤝 기여

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 연락처

- GitHub: [@temy123](https://github.com/temy123)
- Project Link: [https://github.com/temy123/DotaSpammerFinder](https://github.com/temy123/DotaSpammerFinder)