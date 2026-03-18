---
name: deploy-check
description: 배포 전 검증 - 빌드, 린트, 타입체크, 보안 검사
user_invocable: true
---

# 배포 전 검증

배포 전 전체 프로젝트를 검증합니다.

## 검증 단계
1. `npx tsc --noEmit` - TypeScript 타입 체크
2. `npm run lint` - ESLint 검사
3. `npm run build` - Next.js 빌드
4. 보안 검사: .env 노출, 시크릿 키 클라이언트 사용 여부
5. RLS 정책 확인

## 결과 보고
- 통과/실패 요약
- 실패 시 구체적 에러와 수정 방법 제안
