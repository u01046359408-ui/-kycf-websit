INSERT INTO page_contents (page_key, title, content) VALUES
  ('about-talent', '인재란', ''),
  ('evaluation', '평가방법', ''),
  ('competition', '대회관련', ''),
  ('regulations', '경기규정', ''),
  ('ethics', '윤리강령', ''),
  ('instructor', '지도사 과정안내', ''),
  ('referee', '심판 과정안내', ''),
  ('schedule', '행사일정', ''),
  ('results-domestic', '국내 결과', ''),
  ('results-international', '국외 결과', ''),
  ('records', '대회기록', ''),
  ('support', '후원 및 기부', ''),
  ('shop', 'E-Shop', '')
ON CONFLICT (page_key) DO NOTHING;
