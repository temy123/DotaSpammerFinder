# Project Structure

DotaSpammerFinder 프로젝트는 정적 웹사이트 구조를 따르며, 데이터 처리 스크립트를 별도의 디렉토리에서 관리합니다.

## Directory Layout

- **`/`**: 프로젝트의 루트 디렉토리로, 주요 HTML 파일과 설정 파일이 위치합니다.
  - [`index.html`](index.html): 메인 페이지입니다.
  - [`search.html`](search.html): 플레이어 검색 페이지입니다.
  - [`service.html`](service.html): 서비스 소개 페이지입니다.
  - [`about.html`](about.html): 프로젝트 소개 페이지입니다.
  - [`_config.yml`](_config.yml): Jekyll 설정 파일입니다.

- **`.kiro/steering/`**: Kiro AI 어시스턴트의 작동을 안내하는 조향 파일들을 저장합니다.
  - [`product.md`](.kiro/steering/product.md): 제품의 비전과 기능 명세입니다.
  - [`tech.md`](.kiro/steering/tech.md): 사용된 기술 스택 정보입니다.
  - [`structure.md`](.kiro/steering/structure.md): 프로젝트 구조와 규칙을 정의합니다.

- **`css/`**: 컴파일된 CSS 파일들이 위치합니다.
  - [`default.css`](css/default.css): 공통 스타일 시트입니다.
  - `bootstrap_*.min.css`: 부트스트랩 테마 파일입니다.

- **`js/`**: JavaScript 파일들이 위치합니다.
  - [`core.js`](js/core.js): 공통 스크립트 파일입니다.
  - `search.js`, `service.js`: 각 페이지에 특화된 스크립트 파일입니다.

- **`less/`**: LESS 소스 파일들이 위치합니다. CSS 파일과 1:1로 대응됩니다.
  - [`default.less`](less/default.less): 공통 스타일을 정의하는 LESS 파일입니다.

- **`img/`**: 이미지 파일들이 위치합니다. 로고, 아이콘, 영웅 이미지 등이 포함됩니다.
  - `img/heroes/`: 영웅별 이미지 파일이 저장됩니다.

- **`db/`**: SQLite 데이터베이스 파일(`*.db`)이 저장됩니다.

- **`DbMaker/`**: 데이터베이스를 생성하고 업데이트하는 Python 스크립트와 관련 파일들이 위치합니다.
  - [`app.py`](DbMaker/app.py): 데이터 처리 로직을 포함하는 메인 스크립트입니다.
  - [`requirements.txt`](DbMaker/requirements.txt): Python 의존성 목록입니다.

## File Naming Conventions

- **HTML**: 소문자를 사용하고, 여러 단어는 하이픈(`-`)으로 연결합니다. (예: `service-details.html`)
- **CSS/LESS**: HTML 파일명과 동일하게 소문자와 하이픈을 사용합니다. (예: `service-details.less`)
- **JavaScript**: 기능에 따라 명확하게 이름을 지정하고, 소문자를 사용합니다. (예: `player-profile.js`)
- **이미지**: 콘텐츠를 설명하는 소문자 이름을 사용하고, 단어는 언더스코어(`_`)로 구분합니다. (예: `rank_icon_1.png`)