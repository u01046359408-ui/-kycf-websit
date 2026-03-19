// 데이터베이스 타입 정의

// 사용자 프로필
export interface Profile {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  birth_date: string | null;
  role: "user" | "admin";
  provider: "email" | "kakao" | "google" | "naver";
  created_at: string;
  updated_at: string;
}

// 증명서 종류
export type CertificateType =
  | "qualification"
  | "career"
  | "completion"
  | "transcript"
  | "employment"
  | "education";

// 기록 유형 (증명서 종류 + 수상)
export type RecordType = CertificateType | "award";

// 증명서 템플릿
export interface CertificateTemplate {
  id: string;
  type: CertificateType;
  name: string;
  description: string;
  price: number;
  is_active: boolean;
  created_at: string;
}

// 결제 상태
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

// 결제
export interface Payment {
  id: string;
  user_id: string;
  order_id: string;
  payment_key: string | null;
  amount: number;
  status: PaymentStatus;
  method: string | null;
  certificate_template_id: string;
  toss_order_id: string;
  receipt_url: string | null;
  failure_code: string | null;
  failure_message: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
}

// 발급된 증명서
export interface Certificate {
  id: string;
  user_id: string;
  payment_id: string;
  template_id: string;
  serial_number: string;
  applicant_name: string;
  applicant_birth_date: string;
  applicant_phone: string;
  purpose: string;
  pdf_url: string | null;
  record_data: Record<string, unknown>;
  issued_at: string;
  created_at: string;
}

// 결제 요청 파라미터
export interface PaymentRequestParams {
  certificateId: string;
  applicantName: string;
  applicantBirthDate: string;
  applicantPhone: string;
  purpose: string;
}

// 토스페이먼츠 결제 승인 응답
export interface TossPaymentConfirmResponse {
  paymentKey: string;
  orderId: string;
  status: string;
  method: string;
  totalAmount: number;
  approvedAt: string;
  receipt: { url: string } | null;
  failure: { code: string; message: string } | null;
}

// 공지사항
export interface Announcement {
  id: string;
  category: "연맹공지" | "행사공지";
  title: string;
  content: string;
  views: number;
  is_published: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

// 갤러리
export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  is_published: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

// 행사일정
export type EventStatus = "접수중" | "마감" | "예정";

export interface EventItem {
  id: string;
  title: string;
  date: string;
  location: string;
  category: string;
  status: EventStatus;
  description: string;
  is_published: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

// 구인/구직
export interface JobItem {
  id: string;
  type: "구인" | "구직";
  title: string;
  content: string;
  deadline: string | null;
  status: "진행중" | "마감";
  is_published: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

// 자격증명서 데이터
export interface QualificationData {
  certification_name: string;
  certification_number: string;
  acquired_date: string;
  score: number | null;
  grade: string;
  issuing_organization: string;
}

// 성적증명서 - 과목별 성적
export interface SubjectScore {
  subject_name: string;
  score: number;
  grade: string;
}

// 성적증명서 데이터
export interface TranscriptData {
  course_name: string;
  subjects: SubjectScore[];
  total_score: number;
  average_score: number;
  rank: string;
}

// 경력증명서 데이터
export interface CareerData {
  organization: string;
  position: string;
  department: string;
  start_date: string;
  end_date: string;
  duties: string;
}

// 수료증명서 데이터
export interface CompletionData {
  course_name: string;
  education_period: string;
  completion_date: string;
  score: number | null;
  instructor: string;
}

// 재직증명서 데이터
export interface EmploymentData {
  organization: string;
  position: string;
  department: string;
  hire_date: string;
  duties: string;
}

// 교육이수증명서 데이터
export interface EducationData {
  program_name: string;
  total_hours: number;
  completion_date: string;
  score: number | null;
  instructor: string;
}

// 수상 데이터
export interface AwardData {
  award_name: string;
  award_date: string;
  awarding_organization: string;
  competition_name: string;
  rank: string;
}

// 증명서별 세부 데이터 유니온 타입
export type RecordDetailData =
  | QualificationData
  | TranscriptData
  | CareerData
  | CompletionData
  | EmploymentData
  | EducationData
  | AwardData;

// 회원 성적/자격 기록 (user_id 기반)
export interface MemberRecord {
  id: string;
  user_id: string;
  record_type: RecordType;
  title: string;
  data: RecordDetailData;
  memo: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  // joined
  profiles?: { name: string; email: string };
}

// 회원 기록 목록 응답
export interface RecordsResponse {
  records: MemberRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 선수 레이팅
export interface PlayerRating {
  id: string;
  user_id: string | null;
  member_code: string;
  name: string;
  region: string;
  rating: number;
  grade: string;
  birth_date: string | null;
  gender: string;
  organization: string;
  wins: number;
  losses: number;
  draws: number;
  last_competition: string;
  last_competition_date: string | null;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

// 페이지 콘텐츠
export interface PageContent {
  id: string;
  page_key: string;
  title: string;
  content: string;
  metadata: Record<string, unknown>;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

// 주간 통계
export interface WeeklyStats {
  newUsers: number;
  payments: number;
  revenue: number;
  certificates: number;
}

// 관리자 대시보드 통계
export interface DashboardStats {
  totalUsers: number;
  totalPayments: number;
  totalRevenue: number;
  totalCertificates: number;
  recentPayments: (Payment & { profile: Profile; template: CertificateTemplate })[];
  weeklyStats: WeeklyStats;
}
