-- 회원 기록 테이블 (수상내역, 자격, 성적, 경력 등)
CREATE TABLE IF NOT EXISTS member_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  record_type TEXT NOT NULL CHECK (record_type IN ('qualification', 'career', 'completion', 'transcript', 'employment', 'education', 'award')),
  title TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  memo TEXT DEFAULT '',
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_member_records_user_id ON member_records(user_id);
CREATE INDEX IF NOT EXISTS idx_member_records_type ON member_records(record_type);

CREATE OR REPLACE TRIGGER member_records_updated_at
  BEFORE UPDATE ON member_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE member_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "member_records_select_own" ON member_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "member_records_select_all" ON member_records
  FOR SELECT USING (true);

CREATE POLICY "member_records_admin_all" ON member_records
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
