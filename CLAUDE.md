# 대한인재 (daehan-talent) - 증명서 발급 서비스

## 프로젝트 개요
사용자가 온라인으로 증명서를 결제 후 PDF로 즉시 발급받는 서비스

### 핵심 흐름
```
회원가입/로그인 → 증명서 선택 → 토스페이먼츠 결제 → PDF 증명서 다운로드
```

## 기술 스택

| 분류 | 기술 | 버전 |
|------|------|------|
| 프레임워크 | Next.js (App Router) | 16.1.6 |
| 언어 | TypeScript | ^5 |
| UI | React | 19.2.3 |
| 스타일링 | Tailwind CSS | v4 |
| 백엔드/인증 | Supabase (Auth, DB, Storage) | SSR ^0.9.0 |
| 결제 | 토스페이먼츠 | Widget SDK + REST API |
| PDF | pdfkit | 서버사이드 |
| 아이콘 | lucide-react | ^0.577.0 |

## 시작하기

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # 프로덕션 빌드
npm run lint    # ESLint
```

### 환경변수 (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
TOSS_SECRET_KEY=test_sk_xxx          # 서버 전용 (절대 클라이언트 노출 금지)
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_xxx
```

## 코딩 컨벤션
- 컴포넌트 파일: PascalCase (예: HeroSection.tsx)
- 유틸/훅 파일: camelCase (예: useAuth.ts)
- 서버 컴포넌트 우선, 필요시만 "use client"
- 한국어 주석, 영어 코드
- import 경로: @/* 별칭 사용

## 디렉토리 구조

```
src/
├── app/
│   ├── (public)/           # 공개 페이지 (메인, 소개, 증명서, 결제, 마이페이지)
│   ├── (auth)/             # 인증 페이지 (로그인, 회원가입, 비밀번호 찾기)
│   ├── admin/              # 관리자 전용 (대시보드, 회원/결제/증명서 관리)
│   ├── api/                # API Routes
│   │   ├── payment/        # 결제 API (request, confirm, [orderId])
│   │   ├── certificate/    # 증명서 API (issue, download/[id], verify/[serialNumber])
│   │   └── admin/          # 관리자 API (stats, users, payments, certificates)
│   └── auth/callback/      # OAuth 콜백
├── components/
│   ├── ui/                 # 기본 UI (Button, Input, Modal 등)
│   ├── layout/             # Header, Footer, PageBanner, TopBar
│   ├── landing/            # HeroSection, QuickMenu, ContentSection, PartnersSection
│   └── features/           # 기능별 컴포넌트
├── lib/
│   ├── supabase/           # client.ts, server.ts, middleware.ts
│   ├── auth/               # actions.ts (서버 액션 7개)
│   ├── toss/               # client.ts (REST API 유틸)
│   ├── pdf/                # generator.ts, storage.ts, fonts.ts
│   └── admin/              # auth.ts (verifyAdmin 헬퍼)
├── hooks/                  # useAuth.ts
├── types/                  # index.ts (Profile, Payment, Certificate 등)
├── constants/              # certificates.ts (6종 증명서 정보)
└── middleware.ts            # 라우트 보호 (로그인/관리자 체크)
```

## Git 커밋 컨벤션
- feat: 새 기능 / fix: 버그 수정 / style: UI/스타일 / refactor: 리팩토링 / docs: 문서 / chore: 설정/빌드

## 보안 규칙
- 토스 시크릿 키는 서버에서만 사용 (절대 클라이언트 노출 금지)
- Supabase RLS 필수 적용
- 관리자 API는 role 검증 필수
- .env 파일 커밋 금지

---

## 구현 현황 (2026-03-18 기준)

### ✅ 완료

#### UI 페이지 (42+ 페이지)
- 공개 페이지: 소개(9), 종목정보(5), 행사(4), 교육(4), 알림마당(5), 검색, 사이트맵 등
- 인증 페이지: 로그인, 회원가입, 비밀번호 찾기
- 증명서: 목록, 상세(6종), 결제, 성공/실패
- 레이아웃: Header(반응형 드롭다운), Footer, PageBanner, TopBar
- 랜딩: HeroSection, QuickMenu, ContentSection, PartnersSection

#### 인증 시스템
- `src/lib/auth/actions.ts` — 서버 액션 7개 (signUp, signIn, OAuth, signOut, resetPassword, updatePassword, getCurrentUser)
- `src/hooks/useAuth.ts` — 클라이언트 인증 훅 (user, loading, signOut)
- `src/app/auth/callback/route.ts` — OAuth 콜백 (code → session 교환)
- 미들웨어 라우트 보호 — /mypage, /payment(로그인 필요), /admin(관리자만)
- 로그인/회원가입/비밀번호찾기 페이지에 실제 로직 연결 완료

#### 결제 시스템 (토스페이먼츠)
- `src/lib/toss/client.ts` — 토스 REST API 유틸 (confirmPayment, cancelPayment, getPayment, generateOrderId, generateSerialNumber)
- `POST /api/payment/request` — 결제 주문 생성, DB에 pending payment 레코드
- `POST /api/payment/confirm` — 서버에서 시크릿키로 결제 승인 + certificates 레코드 생성
- `GET /api/payment/[orderId]` — 결제 상태 조회
- 결제 페이지: 토스 위젯 SDK 통합 (기존 수동 카드입력 폼 → 토스 위젯 대체)
- 성공 페이지: paymentKey/orderId/amount로 승인 처리 + 동적 결과 표시
- 실패 페이지: 에러 코드별 안내 메시지

#### PDF 증명서 생성 (회원 성적 데이터 포함)
- `src/lib/pdf/generator.ts` — pdfkit 기반 A4 PDF 생성, 증명서 종류별 성적/자격 데이터 렌더링
- `src/lib/pdf/storage.ts` — Supabase Storage 연동 (업로드, 다운로드, 서명 URL)
- `src/lib/pdf/fonts.ts` — NotoSansKR 폰트 경로 설정
- `POST /api/certificate/issue` — 증명서 발급 (member_records 조회 → PDF 생성 → Storage 업로드 → DB)
- `GET /api/certificate/download/[id]` — PDF 다운로드 (본인/관리자만)
- `GET /api/certificate/verify/[serialNumber]` — 진위 확인 공개 API (이름 마스킹)

#### 회원 성적/자격 기록 시스템
- `member_records` 테이블 — 이름+생년월일+증명서종류 UNIQUE, data(JSONB)에 성적 저장
- `/admin/records` — 관리자가 회원별 성적/자격 데이터 입력 (종류별 동적 폼)
- `/api/admin/records` — 기록 CRUD API
- `/api/member-record` — 본인 기록 조회 API
- 결제 승인(confirm) 및 발급(issue) 시 자동으로 member_records 조회 → PDF에 반영
- 기록 없는 회원은 기존처럼 기본 설명문 표시

**증명서별 PDF 표시 데이터:**

| 종류 | 표시 항목 |
|------|-----------|
| 자격증명서 | 자격증명, 자격번호, 취득일자, 점수, 등급, 발급기관 |
| 성적증명서 | 과정명, 과목별 성적 테이블(과목/점수/등급), 총점, 평균, 석차 |
| 경력증명서 | 소속기관, 직위, 부서, 근무기간, 담당업무 |
| 수료증명서 | 과정명, 교육기간, 수료일자, 점수, 담당강사 |
| 재직증명서 | 소속기관, 직위, 부서, 입사일, 담당업무 |
| 교육이수증명서 | 프로그램명, 이수시간, 이수일자, 점수, 담당강사 |

#### 관리자 페이지
- `src/app/admin/layout.tsx` — 사이드바 네비게이션 (대시보드/회원/결제/증명서/템플릿/회원기록/콘텐츠), useAuth 권한체크
- `src/app/admin/page.tsx` — 대시보드 (통계 카드 4개 + 최근 7일 통계 + 최근 결제 5건)
- `src/app/admin/users/page.tsx` — 회원 목록 (검색, 페이지네이션, 역할 변경)
- `src/app/admin/payments/page.tsx` — 결제 목록 (상태 필터, 환불 처리)
- `src/app/admin/certificates/page.tsx` — 증명서 목록 (검색, 페이지네이션)
- `src/app/admin/templates/page.tsx` — 증명서 템플릿 관리 (가격 변경, 활성/비활성 토글)
- `src/app/admin/records/page.tsx` — 회원 성적/자격 기록 관리 (종류별 동적 폼, CRUD)
- `src/app/admin/content/*` — 콘텐츠 관리 (공지사항, 갤러리, 행사일정, 구인구직 CRUD)
- `src/lib/admin/auth.ts` — verifyAdmin() 헬퍼
- API: stats, users, users/[id], payments, payments/[id]/refund, certificates, templates, records, records/[id]

#### 마이페이지
- `src/app/(public)/mypage/layout.tsx` — 사이드 탭 (내 정보/결제 내역/발급 내역/비밀번호 변경)
- `src/app/(public)/mypage/page.tsx` — 프로필 조회/수정 (생년월일 포함)
- `src/app/(public)/mypage/payments/page.tsx` — 결제 내역 (상태 뱃지)
- `src/app/(public)/mypage/certificates/page.tsx` — 발급 내역 + PDF 재다운로드
- `src/app/(public)/mypage/password/page.tsx` — 비밀번호 변경 (강도 표시 포함)

#### 콘텐츠 동적 연결
- 공지사항, 갤러리, 행사일정, 구인구직 — mock 데이터 → Supabase DB 연동 완료
- `/api/content/*` — CRUD API (announcements, gallery, events, jobs)
- 관리자 콘텐츠 관리 페이지 (`/admin/content/*`)

#### 기초 인프라
- `src/types/index.ts` — Profile, Payment, Certificate, MemberRecord, Announcement, GalleryItem, EventItem, JobItem 등
- `src/constants/certificates.ts` — 6종 증명서 정보 (이름, 가격, 설명)
- `supabase/schema.sql` — 9 테이블 + RLS + 트리거 + 초기 데이터

### DB 스키마 요약

| 테이블 | 역할 | 주요 컬럼 |
|--------|------|-----------|
| profiles | 사용자 프로필 | id(FK auth.users), email, name, phone, role, provider |
| certificate_templates | 증명서 종류 | type, name, price, is_active |
| payments | 결제 내역 | user_id, order_id, payment_key, amount, status, metadata(JSONB) |
| certificates | 발급된 증명서 | user_id, payment_id, serial_number, pdf_url, record_data(JSONB) |
| member_records | 회원 성적/자격 기록 | name, birth_date, certificate_type, data(JSONB), UNIQUE(name,birth_date,type) |
| announcements | 공지사항 | category, title, content, views, is_published |
| gallery | 갤러리 | title, description, image_url, is_published |
| events | 행사일정 | title, date, location, status, is_published |
| jobs | 구인/구직 | type, title, content, deadline, status, is_published |

### ❌ 서비스 연결 전 남은 작업

1. **Supabase 프로젝트 생성** → `.env.local`에 실제 URL/ANON_KEY 입력
2. **`supabase/schema.sql` 실행** → Supabase SQL Editor에서 테이블/RLS/트리거 생성
3. **토스페이먼츠 키 발급** → `TOSS_SECRET_KEY`, `NEXT_PUBLIC_TOSS_CLIENT_KEY` 설정
4. **한국어 폰트** → `public/fonts/NotoSansKR-Regular.ttf`, `NotoSansKR-Bold.ttf` 배치
5. **Supabase Storage** → `certificates` 버킷 생성
6. **소셜 로그인 설정** → Supabase Dashboard에서 카카오/구글/네이버 OAuth Provider 등록

### 주요 기술 결정 사항
- PDF 생성: `pdfkit` 사용 (서버사이드 안정성, 한국어 폰트 지원)
- 결제: 토스페이먼츠 v2 Widget SDK + REST API (수동 카드입력 X)
- 인증: Supabase Auth + "use server" 서버 액션
- 관리자 권한: profiles 테이블 role 컬럼 ('user' | 'admin')
- 클라이언트 Supabase: 빌드 시 placeholder URL 사용 (프리렌더링 대응)
- payments 테이블에 metadata(JSONB) 컬럼 추가 — 신청자 정보 저장용
- 회원 성적 데이터: member_records 테이블에 이름+생년월일로 매칭 (미가입 회원도 사전 입력 가능)
- 증명서 발급 시 record_data에 성적 스냅샷 저장 — 나중에 원본 수정돼도 발급 당시 데이터 유지
