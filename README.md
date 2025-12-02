# A~Z 스타트 가이드 (pnpm 기반)

빈 머신에서 이 레포를 실행하고, 동일 환경을 재현하며, 배포 준비까지 마치는 순서를 초보자 기준으로 정리했습니다.

## 1. 환경 준비
1) Node 20+ 확인  
   ```sh
   node -v
   ```
2) pnpm 9 활성화  
   ```sh
   corepack enable
   corepack prepare pnpm@9.0.0 --activate
   pnpm -v
   ```
3) Git 설치 확인  
   ```sh
   git --version
   ```

## 2. 레포 클론 및 의존성 설치
```sh
git clone <repo-url>
cd csh-repo
pnpm install
```

## 3. 워크스페이스 구조 빠르게 보기
- `apps/ui-docs`: Storybook 문서 앱
- `packages/ui`: UI 컴포넌트 라이브러리 (주요 개발 영역)
- `packages/tsconfig`, `packages/eslint-config`, `packages/prettier-config`: 공용 설정 패키지
- `turbo.json`: Turborepo 파이프라인
- `pnpm-workspace.yaml`: 워크스페이스 패키지 범위

## 4. 처음부터 동일하게 만들기 (`pnpm dlx create-turbo@latest`)
1) Turborepo 스캐폴드  
   ```sh
   pnpm dlx create-turbo@latest csh-repo
   ```  
   - 선택: TypeScript, pnpm, 기본 모노레포 템플릿  
   - 루트 `package.json` 수정: `name: "choscion-repo"`, `packageManager: pnpm@9.0.0`, `engines.node: ">=20"`
2) 기본 앱 정리·스코프 변경  
   - starter의 `apps/web`, `apps/docs` 제거  
   - `pnpm-workspace.yaml`을 `apps/*`, `packages/*`로 유지  
   - 패키지 스코프를 `@choscion/*`로 통일 (`packages/ui`, `packages/eslint-config`, `packages/tsconfig`, `packages/prettier-config`)
3) UI 라이브러리 세팅 (`packages/ui`)  
   - React 19: `pnpm add react@^19.2.0 react-dom@^19.2.0 --filter @choscion/ui`  
   - 스타일 도구: `pnpm add -D sass classnames --filter @choscion/ui`  
   - CSS 품질: `pnpm add -D stylelint stylelint-config-standard stylelint-config-standard-scss stylelint-order stylelint-config-prettier --filter @choscion/ui`  
   - 베이스 스타일(`src/styles/*`), 예제 컴포넌트(`Text`, `Colors`)와 스토리 추가  
     - `src/styles/_variables.scss`: 색상/폰트 변수  
     - `src/styles/design-system.scss`: 글로벌 스타일 import  
     - `src/Text/index.tsx`: 기본 텍스트 컴포넌트 구현, `classNames`로 변형(variant, size) 처리  
     - `src/Text/Text.module.scss`: `variant`, `size` 클래스 정의  
     - `src/Text/Text.stories.tsx`: args/controls 설정, 스토리 예시  
     - `src/Colors/index.ts`: 팔레트 상수  
   - 스크립트: `lint`, `lint:css`, `check-types`, `generate:component`
4) Storybook 앱 생성 (`apps/ui-docs`)  
   ```sh
   mkdir -p apps/ui-docs && cd apps/ui-docs
   pnpm init -y
   pnpm add -D storybook@8.6.14 @storybook/react@^8.4.0 @storybook/react-vite@^8.4.0 @storybook/addon-essentials@^8.4.0 @storybook/addon-interactions@^8.4.0 @storybook/test@^8.4.0 vite@^5.4.11 typescript@5.9.2 --filter ui-docs
   pnpm add react@^19.2.0 react-dom@^19.2.0 @choscion/ui@workspace:* --filter ui-docs
   ```  
   - `.storybook/main.ts`: 스토리 경로 `../../../packages/**/*.stories.@(ts|tsx)`, 빌더 `@storybook/react-vite`  
   - `.storybook/preview.ts`: actions/controls, `layout: "centered"`(예: actions `^on[A-Z].*`, color/date 매처)  
   - `package.json` (apps/ui-docs):  
     ```json
     {
       "scripts": {
         "start:docs": "storybook dev -p 6006",
         "build:storybook": "storybook build",
         "build:docs": "storybook build -o ./dist --disable-telemetry"
       }
     }
     ```
   - `apps/ui-docs/turbo.json`: 루트 터보 확장, `build:docs` 출력 `dist/**`
5) 루트 도구·스크립트 정리  
   - 루트 `package.json` scripts:  
     ```json
     {
       "start:docs": "turbo start:docs --filter ui-docs",
       "build:docs": "turbo build:docs",
       "build:watch": "turbo build:watch",
       "build": "turbo run build",
       "dev": "turbo run dev",
       "check-types": "turbo run check-types",
       "lint": "eslint '**/*.{js,jsx,ts,tsx}'",
       "lint:fix": "pnpm run lint --fix",
       "prettier": "prettier --check '**/*.{ts,tsx,js,jsx,json}'",
       "prettier:fix": "prettier --write '**/*.{ts,tsx,js,jsx,json}'",
       "publish": "changeset publish"
     }
     ```
   - 루트 `turbo.json`: 빌드/린트/check-types를 `dependsOn: ["^build"|"^lint"|"^check-types"]`로 설정해 의존 패키지부터 실행, `dev`는 캐시 끄고 지속 프로세스로 동작.  
   - 루트 `lint`, `prettier` 스크립트가 워크스페이스 전체 glob을 커버.
   - 루트에서 `pnpm start:docs`를 실행하면 Turbo가 `apps/ui-docs`의 `start:docs`를 실행하며, `apps/ui-docs/turbo.json`이 `^build` 의존성을 선언해 필요한 패키지가 먼저 빌드됩니다.
6) 최종 확인  
   ```sh
   pnpm install
   pnpm check-types
   pnpm lint
   pnpm start:docs   # http://localhost:6006
   ```

## 5. Changeset & 배포 토큰
- 설정: `pnpm dlx changeset init` → `.changeset/config.json` 생성(baseBranch=main, access=restricted), devDependency `@changesets/cli`, 루트 스크립트 `publish: "changeset publish"`.
- 변경 기록: 작업 후 `pnpm dlx changeset` → 영향 패키지와 버전 bump 선택 → `.changeset/*.md` 생성.
- 상태 확인: `pnpm changeset status`(또는 `pnpm dlx changeset status`)로 예정 버전/체인지로그 확인.
- 배포: `pnpm changeset publish` 실행(현재 access=restricted, 필요 시 public으로 변경).
- npm 토큰: `npm login` 후 받은 토큰을 `NPM_TOKEN` 환경변수로 설정, CI에서는 `echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > ~/.npmrc`.
- GitHub PAT: Git 태그/푸시 또는 GitHub Packages용으로 `GH_TOKEN`/`GITHUB_TOKEN` 설정(권한 `repo`, `write:packages` 등). CI에서 `git config user.name "CI"` / `git config user.email "ci@example.com"`도 함께 설정.

## 6. 바로 실행 (Storybook)
```sh
pnpm start:docs
```
- 기본 포트: `http://localhost:6006`
- 실행 시 필요한 패키지가 자동 빌드됩니다.

## 7. 일상 개발 루틴
1) Storybook 켜기: `pnpm start:docs`
2) 코드 작성: `packages/ui/src/…`
3) 스토리 추가/수정: `packages/ui/src/<Component>/<Component>.stories.tsx` (스토리북는 `.storybook/main.ts`의 glob `packages/**/*.stories.@(ts|tsx)` 사용)
4) 품질 체크: `pnpm lint`, `pnpm check-types`
5) 필요 시 전체 빌드: `pnpm build`

## 8. 자주 쓰는 명령어
- 전체 빌드: `pnpm build`
- 타입 검사: `pnpm check-types`
- ESLint 검사/수정: `pnpm lint`, `pnpm lint:fix`
- Prettier 검사/수정: `pnpm prettier`, `pnpm prettier:fix`
- Storybook 정적 빌드: `pnpm build:docs` (산출물 `apps/ui-docs/dist`)

## 9. 새 컴포넌트 추가
1) 스캐폴드 생성(옵션):  
   ```sh
   pnpm --filter @choscion/ui run generate:component
   ```
2) 구현: `packages/ui/src/<Component>/`에 로직·스타일 작성
   - 핵심 파일 예시  
     - `index.tsx`: 컴포넌트 본문과 props 타입 정의  
     - `<Component>.module.scss`: variant/size/state 등 클래스 정의  
     - `<Component>.stories.tsx`: 기본 스토리, controls/args 설정  
3) 스토리 작성: 동일 폴더 내 스토리 파일을 위 패턴에 맞춰 추가
4) 확인: `pnpm start:docs`로 UI 검증
5) 검증: `pnpm lint`, `pnpm check-types`

## 10. 트러블슈팅
- pnpm/Node 버전 오류: `corepack prepare pnpm@9.0.0 --activate`
- 의존성 깨짐: `rm -rf node_modules` 후 `pnpm install`
- 포트 충돌: `pnpm start:docs -- --port 6007`
- 터보 캐시 의심: `pnpm dlx turbo prune` 등 캐시 조치 전 팀과 상의

필요한 내용이 더 있으면 README에 추가 제안해주세요. 함께 유지보수하면 더 빨리 적응할 수 있습니다.
