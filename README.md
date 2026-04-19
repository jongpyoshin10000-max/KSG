# 체험단 일정관리 MVP

Node.js + Express + React 기반의 개인용 체험단 운영 시스템입니다. DB 없이 로컬 JSON 파일(`server/src/data/storage.json`)을 저장소로 사용하며, 향후 로그인/DB 확장을 고려해 Repository + Service 레이어로 분리했습니다.

## 1) 전체 아키텍처

- **Frontend (React + Vite)**
  - 탭 기반 UI: 체험단목록 / 체험단통계 / 캘린더 / 알림
  - 등록/수정 공통 모달 폼 + 확장 필드(extraFields) 지원
  - 통계 차트(Recharts), 월간 캘린더(react-big-calendar)
- **Backend (Express)**
  - REST API 제공
  - `ExperienceService`에서 요약/통계/알림 계산
  - `ExperienceRepository`에서 JSON 파일 저장소 접근
- **Storage (JSON file)**
  - 단일 스토리지 파일 구조 (`config`, `experiences`, `personalSchedules`, `notifications`)
  - write queue를 통한 간단한 파일 I/O 충돌 완화

## 2) 폴더 구조

```text
.
├── client
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src
│       ├── api
│       ├── components
│       ├── constants
│       ├── hooks
│       ├── pages
│       ├── styles
│       └── utils
├── server
│   ├── package.json
│   └── src
│       ├── app.js
│       ├── index.js
│       ├── constants
│       ├── middleware
│       ├── repositories
│       ├── routes
│       ├── services
│       ├── utils
│       └── data/storage.json
├── package.json
└── README.md
```

## 3) 데이터 모델

`storage.json`

- `meta`: 버전/수정시각
- `config`
  - `sites[]`, `types[]`, `statuses[]` (상수/설정 분리)
- `experiences[]`
  - 기본 필드 + `extraFields`(schema tolerant)
- `personalSchedules[]`
  - 캘린더 사용자 일정
- `notifications[]`
  - 읽음 상태 저장

## 4) 실행 방법

### 요구사항
- Node.js 18+

### 설치
```bash
npm install
```

### 개발 실행 (권장)
```bash
npm run dev
```
- frontend: http://localhost:5173
- backend API: http://localhost:4000/api

### 프로덕션 실행
```bash
npm run build
npm run start
```
- server: http://localhost:4000

## 5) 환경설정 예시

현재 MVP는 별도 `.env` 없이 동작합니다. 필요한 경우 아래처럼 확장 가능합니다.

```env
PORT=4000
```

## 6) 핵심 기능

- 체험단 CRUD
- 사이트/유형/상태/페이백 필터 + 검색 + 정렬
- 상세 패널(기본/일정/리뷰/금액/링크/메모/확장필드)
- 요약 카드(전체 건수, 유형/상태 일부, 제공/환급/페이백 합계)
- 통계 탭(년/월/일 버킷, 유형 파이차트, 완료율)
- 캘린더 탭
  - 전체 체험단(리뷰마감, 검정)
  - 방문형(방문예약, 파랑)
  - 개인일정(노랑 음영, CRUD)
- 알림 탭
  - 7일/3일/1일 전 알림
  - 읽음 처리 및 저장
  - 미확인 존재 시 탭 `N` 표시

## 7) 향후 확장 포인트

- **Auth 모듈 확장 지점**: `server/src/app.js` 주석 위치에 auth router/middleware 추가
- **DB 전환**: `BaseRepository` 인터페이스 구현체 교체
- **필드 확장**: `extraFields`로 화면/CRUD의 하위호환 유지
- **알림 확장**: 이벤트 종류(배송/제출) 추가 가능

