import type { CertificateType } from "@/types";

// 증명서 종류 정보 (UI + 비즈니스 로직 공용)
export const CERTIFICATE_INFO: Record<
  CertificateType,
  { name: string; description: string; price: number; details: string }
> = {
  qualification: {
    name: "자격증명서",
    description: "대한인재에서 취득한 자격증에 대한 공식 증명서를 발급받으실 수 있습니다.",
    price: 5000,
    details:
      "본 증명서는 대한인재개발원에서 시행하는 자격시험에 합격하여 취득한 자격을 공식적으로 증명하는 문서입니다. 자격증 번호, 취득일자, 자격 종류 등이 기재됩니다.",
  },
  career: {
    name: "경력증명서",
    description: "대한인재 관련 경력사항을 공식적으로 증명하는 문서입니다.",
    price: 3000,
    details:
      "대한인재개발원과 관련된 경력 사항을 공식적으로 증명하는 문서입니다. 근무기간, 직위, 담당업무 등이 기재됩니다.",
  },
  completion: {
    name: "수료증명서",
    description: "교육과정 수료 사실을 증명하는 공식 문서를 발급받으실 수 있습니다.",
    price: 3000,
    details:
      "대한인재개발원에서 운영하는 교육과정을 정상적으로 수료한 사실을 증명하는 문서입니다. 교육과정명, 교육기간, 수료일자 등이 기재됩니다.",
  },
  transcript: {
    name: "성적증명서",
    description: "교육과정의 성적 및 평가 결과를 확인할 수 있는 증명서입니다.",
    price: 3000,
    details:
      "교육과정에서 이수한 과목별 성적 및 평가 결과를 확인할 수 있는 증명서입니다. 과목명, 학점, 성적 등이 기재됩니다.",
  },
  employment: {
    name: "재직증명서",
    description: "대한인재 소속 재직 사실을 공식적으로 증명하는 문서입니다.",
    price: 2000,
    details:
      "대한인재개발원에 소속되어 재직 중인 사실을 공식적으로 증명하는 문서입니다. 입사일, 현 직위, 소속 부서 등이 기재됩니다.",
  },
  education: {
    name: "교육이수증명서",
    description: "특정 교육 프로그램 이수 사실을 증명하는 공식 문서입니다.",
    price: 3000,
    details:
      "대한인재개발원에서 운영하는 특정 교육 프로그램을 이수한 사실을 증명하는 문서입니다. 프로그램명, 이수시간, 이수일자 등이 기재됩니다.",
  },
};
