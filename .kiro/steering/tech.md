# Technology Stack

DotaSpammerFinder는 웹 기반 애플리케이션으로, 다음과 같은 기술 스택을 사용하여 구축되었습니다.

## Frontend

- **HTML5**: 웹 페이지의 구조를 정의합니다.
- **CSS3**: 웹 페이지의 스타일과 디자인을 담당합니다.
  - **LESS**: CSS 전처리기(preprocessor)로, 동적 스타일 시트 작성을 위해 사용됩니다. ([`less/`](less/))
  - **Bootstrap**: 반응형 웹 디자인과 UI 컴포넌트를 위해 사용되는 CSS 프레임워크입니다. ([`css/bootstrap.min.css`](css/bootstrap.min.css))
- **JavaScript**: 웹 페이지의 동적인 기능과 사용자 상호작용을 구현합니다.
  - **jQuery**: DOM 조작, 이벤트 처리, AJAX 등을 간소화하기 위해 사용되는 JavaScript 라이브러리입니다. ([`js/core.js`](js/core.js))

## Data Processing & Backend

- **Python**: OpenDota API로부터 데이터를 수집하고, SQLite 데이터베이스를 생성 및 업데이트하는 데 사용됩니다. ([`DbMaker/`](DbMaker/))
- **SQLite**: 플레이어 데이터를 저장하는 경량 데이터베이스입니다. ([`db/`](db/))

## Development Tools

- **Jekyll**: 정적 사이트 생성기로, GitHub Pages 배포를 위해 사용될 수 있습니다. ([`_config.yml`](_config.yml))