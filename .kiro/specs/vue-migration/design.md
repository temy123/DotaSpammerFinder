# 디자인 문서

## 개요

이 문서는 DotaSpammerFinder 프로젝트의 프론트엔드를 기존의 정적 웹사이트에서 Vue 기반의 단일 페이지 애플리케이션(SPA)으로 전환하기 위한 기술 설계를 다룹니다. 이 설계는 요구사항 문서에 명시된 모든 기능과 UI/UX 일관성을 유지하면서, Vue의 현대적인 개발 방식을 적용하는 데 중점을 둡니다.

## 아키텍처

### 1. 프로젝트 설정 및 기술 스택

-   **프레임워크:** Vue 3
-   **빌드 도구:** Vite
-   **라우팅:** Vue Router
-   **상태 관리:** Pinia
-   **스타일링:**
    -   기존 Bootstrap (Minty 테마) 및 custom CSS/LESS 파일 유지
    -   컴포넌트 스코프 스타일을 위해 단일 파일 컴포넌트(SFC)의 `<style scoped>` 활용

### 2. 디렉토리 구조

새로운 `frontend` 디렉토리는 다음과 같은 구조를 가집니다.

```
frontend/
├── public/
│   ├── img/      # 기존 이미지 에셋
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   ├── styles/ # 기존 CSS/LESS 파일
│   │   └── ...
│   ├── components/ # 재사용 가능한 UI 컴포넌트
│   │   ├── AppHeader.vue
│   │   ├── AppFooter.vue
│   │   ├── SearchBar.vue
│   │   └── ResultsTable.vue
│   ├── router/
│   │   └── index.js  # 라우팅 설정
│   ├── stores/
│   │   └── search.js # Pinia 스토어 (검색 상태, 결과 데이터)
│   ├── views/      # 페이지 레벨 컴포넌트
│   │   ├── HomeView.vue
│   │   ├── AboutView.vue
│   │   └── ServiceView.vue
│   ├── App.vue       # 최상위 애플리케이션 컴포넌트
│   └── main.js       # 애플리케이션 진입점
├── index.html
├── package.json
└── vite.config.js
```

## 컴포넌트 및 인터페이스

### 1. `App.vue` (최상위 컴포넌트)

-   **역할:** 모든 뷰의 공통 레이아웃을 제공합니다. `AppHeader`와 `AppFooter`를 포함하고, `vue-router`의 `<router-view>`를 통해 현재 경로에 맞는 페이지 컴포넌트를 렌더링합니다.

### 2. `views` (페이지 컴포넌트)

-   **`HomeView.vue`:** 메인 페이지. `SearchBar`와 `ResultsTable` 컴포넌트를 포함하여 검색 기능의 전체적인 흐름을 관리합니다.
-   **`AboutView.vue`:** 'About' 페이지의 정적 콘텐츠를 표시합니다.
-   **`ServiceView.vue`:** 'Service' 페이지의 정적 콘텐츠를 표시합니다.

### 3. `components` (재사용 컴포넌트)

-   **`AppHeader.vue`:** 모든 페이지 상단에 표시될 네비게이션 바와 로고를 포함합니다.
-   **`AppFooter.vue`:** 모든 페이지 하단에 표시될 푸터 정보를 포함합니다.
-   **`SearchBar.vue`:** 사용자로부터 플레이어 ID를 입력받는 검색 폼입니다. 검색 이벤트가 발생하면 Pinia 액션을 호출합니다.
-   **`ResultsTable.vue`:** Pinia 스토어의 상태를 구독하여 검색 결과를 테이블 형태로 표시합니다. 로딩 상태, 데이터 없음, 에러 상태 등을 처리합니다.

## 데이터 모델

-   **플레이어 검색 상태 (Pinia Store):**
    -   `isLoading (boolean)`: API 요청 진행 중 여부.
    -   `playerData (object | null)`: 검색된 플레이어의 매치 및 영웅 통계 데이터.
    -   `error (string | null)`: API 요청 실패 시 에러 메시지.
-   **API 인터페이스:** 기존 `core.js` 및 `search.js`의 데이터 fetching 로직은 Pinia 스토어의 액션 내부에서 `fetch` 또는 `axios`를 사용하여 재구현됩니다. 백엔드 API의 응답 형식은 기존과 동일하다고 가정합니다.

## 에러 핸들링

-   **API 요청 실패:** Pinia 스토어의 `error` 상태를 업데이트하고, `ResultsTable` 컴포넌트에서 사용자에게 적절한 에러 메시지를 표시합니다.
-   **잘못된 경로 접근:** Vue Router의 `catch-all` 라우트를 사용하여 404 페이지 또는 홈으로 리디렉션합니다.

## 테스팅 전략

-   **단위 테스트 (Vitest):**
    -   Pinia 스토어의 액션(API 호출 모의)과 뮤테이션(상태 변경)을 테스트합니다.
    -   컴포넌트의 props 전달 및 이벤트 발생 로직을 테스트합니다.
-   **컴포넌트 테스트 (Vue Test Utils):**
    -   주요 컴포넌트(`SearchBar`, `ResultsTable`)가 주어진 상태에 따라 올바르게 렌더링되는지 확인합니다.
-   **E2E 테스트 (Cypress - 선택 사항):**
    -   사용자 검색부터 결과 표시까지의 핵심 시나리오를 자동화하여 테스트합니다.