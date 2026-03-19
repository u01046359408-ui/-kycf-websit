CREATE TABLE IF NOT EXISTS page_contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  metadata JSONB DEFAULT '{}',
  updated_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE TRIGGER page_contents_updated_at
  BEFORE UPDATE ON page_contents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE page_contents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "page_contents_select_all" ON page_contents FOR SELECT USING (true);
CREATE POLICY "page_contents_admin_all" ON page_contents FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 초기 데이터 삽입
INSERT INTO page_contents (page_key, title, content) VALUES
  ('greeting', '인사말', '안녕하십니까. 한국유소년체스연맹을 찾아주신 여러분을 진심으로 환영합니다.'),
  ('history', '연혁', ''),
  ('vision', '비전 및 목표', ''),
  ('business', '주요사업', ''),
  ('organization', '조직도', ''),
  ('location', '오시는길', ''),
  ('regulations', '규정', ''),
  ('disclosure', '경영공시', '')
ON CONFLICT (page_key) DO NOTHING;
