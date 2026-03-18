-- 선수 레이팅 테이블
CREATE TABLE IF NOT EXISTS player_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  member_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  region TEXT NOT NULL DEFAULT '',
  rating INTEGER NOT NULL DEFAULT 1000,
  grade TEXT DEFAULT '',
  birth_date DATE,
  gender TEXT DEFAULT '' CHECK (gender IN ('', '남', '여')),
  organization TEXT DEFAULT '',
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  last_competition TEXT DEFAULT '',
  last_competition_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_player_ratings_member_code ON player_ratings(member_code);
CREATE INDEX IF NOT EXISTS idx_player_ratings_name ON player_ratings(name);
CREATE INDEX IF NOT EXISTS idx_player_ratings_rating ON player_ratings(rating DESC);
CREATE INDEX IF NOT EXISTS idx_player_ratings_region ON player_ratings(region);
CREATE INDEX IF NOT EXISTS idx_player_ratings_user_id ON player_ratings(user_id);

CREATE OR REPLACE TRIGGER player_ratings_updated_at
  BEFORE UPDATE ON player_ratings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE player_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "player_ratings_select_all" ON player_ratings FOR SELECT USING (true);
CREATE POLICY "player_ratings_admin_all" ON player_ratings FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
