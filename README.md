# caainp-ar

**caainp-ar**는 Next.js를 기반으로 구축된 웹 내비게이션 애플리케이션입니다.

https://caainp.kamilereon.net/

## ✨ 주요 기능

- **실시간 카메라 오버레이**: `react-webcam`을 활용하여 실제 환경 위에 내비게이션 지시 사항과 정보를 시각적으로 표시합니다.
- **목적지 검색**: 사용자 친화적인 검색 인터페이스를 통해 원하는 장소를 빠르고 간편하게 찾을 수 있음
- **대화형 내비게이션**: 단계별 안내와 제공하여 길 찾기 경험을 향상
- **모바일 퍼스트**: 카메라가 장착된 모바일 기기에서의 사용성을 최우선으로 고려하여 설계됨

## 🛠️ 기술 스택

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Camera**: [react-webcam](https://www.npmjs.com/package/react-webcam)
- **Animations**: [Anime.js](https://animejs.com/)
- **Icons**: [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/)

## 🚀 시작하기

이 프로젝트를 로컬 환경에서 실행하려면 다음 단계를 따르세요.

### 전제 조건

- Node.js (최신 LTS 버전 권장)
- 카메라가 장착된 디바이스 (모바일 또는 웹캠이 있는 노트북)

### 설치

프로젝트 디렉토리로 이동하여 의존성을 설치합니다.

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 개발 서버 실행

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

> **카메라 권한 주의사항**: 모바일 기기에서 카메라에 접근하려면 **HTTPS** 환경이 필요합니다. 로컬 테스트 시에는 `ngrok`과 같은 터널링 도구를 사용하거나, 브라우저의 보안 설정을 조정해야 할 수 있습니다.

## 📂 프로젝트 구조

주요 디렉토리 및 파일 구조는 다음과 같습니다.

- **`app/page.tsx`**: 기본 카메라 + 오버레이 진입점
- **`app/demo/page.tsx`**: 데모 시나리오용 페이지
- **`app/api/`**: Next.js Route Handler
  - `navigation/start|step/route.ts`: 외부 백엔드 프록시
  - `destination/route.ts`: 예시 목적지 검색 API
- **`app/components/`**
  - `Camera*.tsx`: 카메라 래퍼 및 오버레이 포함 레이아웃
  - `overlay/`: 목적지 검색, 내비게이션 카드, 설정, 컨텍스트
- **`app/hooks/`**: `useCameraCapture`, `useDemo` 등
- **`app/lib/`**: API Wrapper, 유틸
---
