---
name: create-component
description: 재사용 컴포넌트 생성 - UI/레이아웃/기능별 컴포넌트
user_invocable: true
---

# 컴포넌트 생성

새로운 재사용 컴포넌트를 생성합니다.

## 컴포넌트 위치
- `src/components/ui/` - 기본 UI (Button, Input, Modal, Card)
- `src/components/layout/` - 레이아웃 (Header, Footer, Sidebar)
- `src/components/features/` - 기능별 (CertificateCard, PaymentForm)

## 규칙
- PascalCase 파일명
- TypeScript Props 인터페이스 정의
- 서버 컴포넌트 우선
- Tailwind CSS 유틸리티 클래스 사용
- 접근성 속성(ARIA) 포함
