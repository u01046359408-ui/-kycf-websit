---
name: db-migrate
description: Supabase DB 마이그레이션 - 테이블 생성, RLS 정책, 인덱스
user_invocable: true
---

# DB 마이그레이션

Supabase 데이터베이스 스키마 변경을 위한 SQL 마이그레이션을 생성합니다.

## 마이그레이션 파일 위치
`supabase/migrations/[timestamp]_[description].sql`

## 포함 내용
1. 테이블 생성/수정 (CREATE TABLE / ALTER TABLE)
2. RLS 정책 (CREATE POLICY)
3. 인덱스 (CREATE INDEX)
4. 트리거/함수 (필요 시)

## 핵심 테이블
- profiles: 사용자 프로필 + role
- certificates: 증명서 종류
- orders: 주문 내역
- payments: 결제 정보
- issued_certificates: 발급된 증명서

## 보안 규칙
- 모든 테이블에 RLS 활성화
- 사용자는 본인 데이터만 접근
- 관리자는 모든 데이터 접근 가능
