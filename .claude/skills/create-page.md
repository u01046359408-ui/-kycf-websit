---
name: create-page
description: 새 페이지 생성 - 라우트, 레이아웃, 메타데이터, loading/error 자동 구성
user_invocable: true
---

# 새 페이지 생성

사용자가 요청한 경로에 Next.js App Router 페이지를 생성합니다.

## 생성 파일
1. `src/app/[경로]/page.tsx` - 페이지 컴포넌트
2. `src/app/[경로]/loading.tsx` - 로딩 UI (필요 시)
3. `src/app/[경로]/error.tsx` - 에러 UI (필요 시)
4. `src/app/[경로]/layout.tsx` - 레이아웃 (필요 시)

## 규칙
- CLAUDE.md의 디렉토리 규칙 준수
- 메타데이터(title, description) 포함
- 서버 컴포넌트 우선
- Tailwind CSS 스타일링
