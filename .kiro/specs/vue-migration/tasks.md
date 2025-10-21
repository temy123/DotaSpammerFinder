# 구현 계획

이 문서는 DotaSpammerFinder의 Vue 마이그레이션을 위한 구체적인 코딩 작업 목록을 정의합니다. 각 작업은 독립적으로 실행 가능하며, 테스트를 통해 점진적으로 기능을 완성하는 것을 목표로 합니다.

- [ ] 1. Vue 프로젝트 초기 설정
  - Vite를 사용하여 `frontend` 디렉토리에 새로운 Vue 3 프로젝트를 생성합니다.
  - `vue-router`와 `pinia`를 프로젝트에 추가하고 기본 설정을 완료합니다.
  - _요구사항: 3.1_

- [ ] 2. 정적 에셋 및 스타일 마이그레이션
  - [ ] 2.1 기존 `img` 폴더의 모든 이미지 파일을 새로운 프로젝트의 `public/img`로 복사합니다.
    - _요구사항: 4.1_
  - [ ] 2.2 기존 `css` 및 `less` 파일들을 `src/assets/styles`로 옮기고, `main.js`에서 전역 스타일로 임포트하여 적용되는지 확인합니다.
    - _요구사항: 2.3_
  - [ ] 2.3 `official_heroes.json` 파일을 `src/assets/data` 폴더로 이동시키고, 필요 시 컴포넌트에서 불러와 사용할 수 있는지 테스트합니다.
    - _요구사항: 4.2_

- [ ] 3. 기본 레이아웃 및 라우팅 구현
  - [ ] 3.1 `AppHeader.vue`와 `AppFooter.vue` 컴포넌트를 생성하고, 기존 HTML의 헤더와 푸터 마크업을 각각 이전합니다.
    - _요구사항: 3.2_
  - [ ] 3.2 `router/index.js`에 `Home`, `About`, `Service` 페이지에 대한 라우트를 정의합니다.
    - _요구사항: 3.3_
  - [ ] 3.3 `App.vue`에 `AppHeader`, `AppFooter`, `<router-view>`를 배치하여 기본 페이지 레이아웃을 완성하고, 각 경로로 이동 시 올바른 페이지가 렌더링되는지 확인합니다.
    - _요구사항: 1.4_

- [ ] 4. 정적 페이지 콘텐츠 이전
  - [ ] 4.1 `AboutView.vue`와 `ServiceView.vue`를 생성하고, 기존 `about.html`과 `service.html`의 콘텐츠를 각각 마이그레이션합니다.
    - _요구사항: 1.4_

- [ ] 5. 검색 기능 상태 관리 구현 (Pinia)
  - [ ] 5.1 `stores/search.js`에 Pinia 스토어를 생성하고, `isLoading`, `playerData`, `error` 상태를 정의합니다.
    - _요구사항: 3.4_
  - [ ] 5.2 플레이어 ID를 인자로 받아 OpenDota API(또는 기존 데이터 소스)를 호출하고, `playerData` 상태를 업데이트하는 액션(`fetchPlayerData`)을 구현합니다. API 호출 로직은 기존 `search.js`를 참고합니다.
    - _요구사항: 1.1_
  - [ ] 5.3 Vitest를 사용하여 `fetchPlayerData` 액션이 API 호출을 올바르게 수행하고 상태를 변경하는지 단위 테스트를 작성합니다.
    - _요구사항: (테스팅 전략)_

- [ ] 6. 검색 UI 컴포넌트 구현
  - [ ] 6.1 `SearchBar.vue` 컴포넌트를 생성합니다. `input`과 `button`을 포함하고, 버튼 클릭 시 입력된 플레이어 ID로 Pinia 스토어의 `fetchPlayerData` 액션을 호출하도록 구현합니다.
    - _요구사항: 1.1, 3.2_
  - [ ] 6.2 `ResultsTable.vue` 컴포넌트를 생성합니다. Pinia 스토어의 상태(`isLoading`, `playerData`, `error`)를 구독하여 조건부 렌더링을 구현합니다.
    - 로딩 중일 때: 로딩 스피너 표시
    - 에러 발생 시: 에러 메시지 표시
    - 데이터 수신 시: `playerData`를 기반으로 검색 결과 테이블 렌더링
    - _요구사항: 1.1, 1.2, 1.3_

- [ ] 7. 메인 페이지 조립 및 기능 통합
  - [ ] 7.1 `HomeView.vue`에 `SearchBar.vue`와 `ResultsTable.vue` 컴포넌트를 배치합니다.
    - _요구사항: 3.2_
  - [ ] 7.2 전체 검색 플로우(검색 -> 로딩 -> 결과/에러 표시)가 의도대로 동작하는지 최종 확인하고, 기존 애플리케이션과 기능 및 레이아웃이 동일한지 비교 검토합니다.
    - _요구사항: 1.1, 1.2, 1.3, 2.1, 2.2_