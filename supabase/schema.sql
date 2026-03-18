-- 대한인재 증명서 발급 서비스 - 데이터베이스 스키마
-- Supabase SQL Editor에서 실행

-- 1. 사용자 프로필 테이블
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  birth_date DATE,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  provider TEXT NOT NULL DEFAULT 'email' CHECK (provider IN ('email', 'kakao', 'google', 'naver')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. 증명서 템플릿 테이블
CREATE TABLE IF NOT EXISTS certificate_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL UNIQUE CHECK (type IN ('qualification', 'career', 'completion', 'transcript', 'employment', 'education')),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL CHECK (price >= 0),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. 결제 테이블
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  order_id TEXT NOT NULL UNIQUE,
  payment_key TEXT,
  amount INTEGER NOT NULL CHECK (amount >= 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  method TEXT,
  certificate_template_id UUID NOT NULL REFERENCES certificate_templates(id),
  toss_order_id TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  receipt_url TEXT,
  failure_code TEXT,
  failure_message TEXT,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. 발급된 증명서 테이블
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES certificate_templates(id),
  serial_number TEXT NOT NULL UNIQUE,
  applicant_name TEXT NOT NULL,
  applicant_birth_date DATE NOT NULL,
  applicant_phone TEXT NOT NULL,
  purpose TEXT NOT NULL,
  pdf_url TEXT,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user_id ON certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_serial_number ON certificates(serial_number);

-- 프로필 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 회원가입 시 프로필 자동 생성
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name, phone, provider)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'phone',
    COALESCE(NEW.raw_app_meta_data->>'provider', 'email')
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'handle_new_user error: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- RLS (Row Level Security) 정책
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificate_templates ENABLE ROW LEVEL SECURITY;

-- 프로필: 본인만 조회/수정, 관리자는 전체 조회
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_admin_select" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 결제: 본인만 조회, 관리자는 전체 조회
CREATE POLICY "payments_select_own" ON payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "payments_insert_own" ON payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "payments_admin_select" ON payments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "payments_admin_update" ON payments
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 증명서: 본인만 조회, 관리자는 전체 조회
CREATE POLICY "certificates_select_own" ON certificates
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "certificates_admin_select" ON certificates
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 증명서 템플릿: 누구나 조회 가능
CREATE POLICY "certificate_templates_select_all" ON certificate_templates
  FOR SELECT USING (true);

CREATE POLICY "certificate_templates_admin_all" ON certificate_templates
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 초기 증명서 템플릿 데이터 삽입
INSERT INTO certificate_templates (type, name, description, price) VALUES
  ('qualification', '자격증명서', '대한인재에서 취득한 자격증에 대한 공식 증명서를 발급받으실 수 있습니다.', 5000),
  ('career', '경력증명서', '대한인재 관련 경력사항을 공식적으로 증명하는 문서입니다.', 3000),
  ('completion', '수료증명서', '교육과정 수료 사실을 증명하는 공식 문서를 발급받으실 수 있습니다.', 3000),
  ('transcript', '성적증명서', '교육과정의 성적 및 평가 결과를 확인할 수 있는 증명서입니다.', 3000),
  ('employment', '재직증명서', '대한인재 소속 재직 사실을 공식적으로 증명하는 문서입니다.', 2000),
  ('education', '교육이수증명서', '특정 교육 프로그램 이수 사실을 증명하는 공식 문서입니다.', 3000)
ON CONFLICT (type) DO NOTHING;

-- 5. 공지사항 테이블
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL DEFAULT '연맹공지' CHECK (category IN ('연맹공지', '행사공지')),
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  views INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. 갤러리 테이블
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. 행사일정 테이블
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '행사',
  status TEXT NOT NULL DEFAULT '예정' CHECK (status IN ('접수중', '마감', '예정')),
  description TEXT NOT NULL DEFAULT '',
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. 구인/구직 테이블
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL DEFAULT '구인' CHECK (type IN ('구인', '구직')),
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  deadline DATE,
  status TEXT NOT NULL DEFAULT '진행중' CHECK (status IN ('진행중', '마감')),
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 콘텐츠 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON announcements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_category ON announcements(category);
CREATE INDEX IF NOT EXISTS idx_gallery_created_at ON gallery(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_type ON jobs(type);

-- 콘텐츠 테이블 updated_at 트리거
CREATE OR REPLACE TRIGGER announcements_updated_at
  BEFORE UPDATE ON announcements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER gallery_updated_at
  BEFORE UPDATE ON gallery
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS: 콘텐츠 테이블 (누구나 읽기, 관리자만 쓰기)
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- 공지사항 RLS
CREATE POLICY "announcements_select_all" ON announcements
  FOR SELECT USING (true);

CREATE POLICY "announcements_admin_all" ON announcements
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 갤러리 RLS
CREATE POLICY "gallery_select_all" ON gallery
  FOR SELECT USING (true);

CREATE POLICY "gallery_admin_all" ON gallery
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 행사일정 RLS
CREATE POLICY "events_select_all" ON events
  FOR SELECT USING (true);

CREATE POLICY "events_admin_all" ON events
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 구인/구직 RLS
CREATE POLICY "jobs_select_all" ON jobs
  FOR SELECT USING (true);

CREATE POLICY "jobs_admin_all" ON jobs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 9. 회원 성적/자격 기록 테이블
CREATE TABLE IF NOT EXISTS member_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  certificate_type TEXT NOT NULL CHECK (certificate_type IN ('qualification', 'career', 'completion', 'transcript', 'employment', 'education')),
  data JSONB NOT NULL DEFAULT '{}',
  memo TEXT DEFAULT '',
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(name, birth_date, certificate_type)
);

CREATE INDEX IF NOT EXISTS idx_member_records_name_birth ON member_records(name, birth_date);
CREATE INDEX IF NOT EXISTS idx_member_records_type ON member_records(certificate_type);

CREATE OR REPLACE TRIGGER member_records_updated_at
  BEFORE UPDATE ON member_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE member_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "member_records_admin_all" ON member_records
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 본인 기록은 읽기만 (이름+생년월일 매칭)
CREATE POLICY "member_records_select_own" ON member_records
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND profiles.name = member_records.name
        AND profiles.birth_date = member_records.birth_date
    )
  );

-- certificates 테이블에 성적/자격 데이터 저장 컬럼 추가
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS record_data JSONB DEFAULT '{}';

-- Storage 버킷 (Supabase Dashboard에서 생성 또는 아래 SQL 실행)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('certificates', 'certificates', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true);
