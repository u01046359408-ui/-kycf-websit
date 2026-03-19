"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  X,
  PlusCircle,
  MinusCircle,
  Loader2,
} from "lucide-react";
import type {
  RecordType,
  MemberRecord,
  RecordsResponse,
  QualificationData,
  TranscriptData,
  CareerData,
  CompletionData,
  EmploymentData,
  EducationData,
  AwardData,
  SubjectScore,
} from "@/types";

// 기록 유형 한국어 라벨
const RECORD_TYPE_LABELS: Record<RecordType, string> = {
  qualification: "자격",
  transcript: "성적",
  career: "경력",
  completion: "수료",
  employment: "재직",
  education: "교육이수",
  award: "수상",
};

// 기록 유형별 배지 색상
const RECORD_TYPE_COLORS: Record<RecordType, string> = {
  qualification: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  transcript: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  career: "bg-green-500/10 text-green-400 border-green-500/20",
  completion: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  employment: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  education: "bg-teal-500/10 text-teal-400 border-teal-500/20",
  award: "bg-[#c9a84c]/10 text-[#c9a84c] border-[#c9a84c]/20",
};

// 회원 선택용 타입
interface MemberOption {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: string;
}

// 기록 유형별 초기 데이터 생성
function createInitialDetailData(type: RecordType) {
  switch (type) {
    case "qualification":
      return {
        certification_name: "",
        certification_number: "",
        acquired_date: "",
        score: null,
        grade: "",
        issuing_organization: "",
      } as QualificationData;
    case "transcript":
      return {
        course_name: "",
        subjects: [{ subject_name: "", score: 0, grade: "" }],
        total_score: 0,
        average_score: 0,
        rank: "",
      } as TranscriptData;
    case "career":
      return {
        organization: "",
        position: "",
        department: "",
        start_date: "",
        end_date: "",
        duties: "",
      } as CareerData;
    case "completion":
      return {
        course_name: "",
        education_period: "",
        completion_date: "",
        score: null,
        instructor: "",
      } as CompletionData;
    case "employment":
      return {
        organization: "",
        position: "",
        department: "",
        hire_date: "",
        duties: "",
      } as EmploymentData;
    case "education":
      return {
        program_name: "",
        total_hours: 0,
        completion_date: "",
        score: null,
        instructor: "",
      } as EducationData;
    case "award":
      return {
        award_name: "",
        award_date: "",
        awarding_organization: "",
        competition_name: "",
        rank: "",
      } as AwardData;
  }
}

// 폼 상태 타입
interface RecordFormState {
  user_id: string;
  record_type: RecordType;
  title: string;
  detail_data:
    | QualificationData
    | TranscriptData
    | CareerData
    | CompletionData
    | EmploymentData
    | EducationData
    | AwardData;
  memo: string;
}

export default function AdminRecordsPage() {
  // 목록 상태
  const [data, setData] = useState<RecordsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [typeFilter, setTypeFilter] = useState<RecordType | "">("");
  const [page, setPage] = useState(1);

  // 모달 상태
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MemberRecord | null>(
    null
  );
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // 회원 검색 상태
  const [memberSearch, setMemberSearch] = useState("");
  const [memberOptions, setMemberOptions] = useState<MemberOption[]>([]);
  const [memberLoading, setMemberLoading] = useState(false);
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberOption | null>(
    null
  );
  const memberDropdownRef = useRef<HTMLDivElement>(null);

  // 폼 상태
  const [form, setForm] = useState<RecordFormState>({
    user_id: "",
    record_type: "qualification",
    title: "",
    detail_data: createInitialDetailData("qualification"),
    memo: "",
  });

  // 기록 목록 조회
  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
      });
      if (search) params.set("search", search);
      if (typeFilter) params.set("record_type", typeFilter);

      const res = await fetch(`/api/admin/member-records?${params}`);
      if (!res.ok) throw new Error("기록 목록을 불러올 수 없습니다.");
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error("기록 목록 조회 실패:", err);
    } finally {
      setLoading(false);
    }
  }, [page, search, typeFilter]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // 검색 디바운스
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // 회원 검색 디바운스
  useEffect(() => {
    if (!memberSearch.trim()) {
      setMemberOptions([]);
      return;
    }
    const timer = setTimeout(async () => {
      setMemberLoading(true);
      try {
        const res = await fetch(
          `/api/admin/members?search=${encodeURIComponent(memberSearch)}&limit=20`
        );
        if (res.ok) {
          const data = await res.json();
          setMemberOptions(data.members);
        }
      } catch (err) {
        console.error("회원 검색 실패:", err);
      } finally {
        setMemberLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [memberSearch]);

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        memberDropdownRef.current &&
        !memberDropdownRef.current.contains(e.target as Node)
      ) {
        setShowMemberDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 날짜 포맷
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // 새 기록 등록 모달 열기
  const openCreateModal = () => {
    setEditingRecord(null);
    setSelectedMember(null);
    setMemberSearch("");
    setForm({
      user_id: "",
      record_type: "qualification",
      title: "",
      detail_data: createInitialDetailData("qualification"),
      memo: "",
    });
    setModalOpen(true);
  };

  // 수정 모달 열기
  const openEditModal = (record: MemberRecord) => {
    setEditingRecord(record);
    setSelectedMember(
      record.profiles
        ? {
            id: record.user_id,
            email: record.profiles.email,
            name: record.profiles.name,
            phone: null,
            role: "",
          }
        : null
    );
    setMemberSearch(
      record.profiles
        ? `${record.profiles.name ?? ""} (${record.profiles.email})`
        : ""
    );
    setForm({
      user_id: record.user_id,
      record_type: record.record_type,
      title: record.title,
      detail_data: record.data || createInitialDetailData(record.record_type),
      memo: record.memo ?? "",
    });
    setModalOpen(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setModalOpen(false);
    setEditingRecord(null);
    setSelectedMember(null);
    setMemberSearch("");
  };

  // 회원 선택
  const selectMember = (member: MemberOption) => {
    setSelectedMember(member);
    setForm((prev) => ({ ...prev, user_id: member.id }));
    setMemberSearch(`${member.name ?? "이름 없음"} (${member.email})`);
    setShowMemberDropdown(false);
  };

  // 기록 유형 변경 시 세부 데이터 초기화
  const handleTypeChange = (newType: RecordType) => {
    setForm((prev) => ({
      ...prev,
      record_type: newType,
      detail_data: createInitialDetailData(newType),
    }));
  };

  // 세부 데이터 필드 업데이트 헬퍼
  const updateDetailField = (
    field: string,
    value: string | number | null
  ) => {
    setForm((prev) => ({
      ...prev,
      detail_data: { ...prev.detail_data, [field]: value },
    }));
  };

  // 성적증명서 과목 추가
  const addSubject = () => {
    setForm((prev) => {
      const transcriptData = prev.detail_data as TranscriptData;
      return {
        ...prev,
        detail_data: {
          ...transcriptData,
          subjects: [
            ...transcriptData.subjects,
            { subject_name: "", score: 0, grade: "" },
          ],
        },
      };
    });
  };

  // 성적증명서 과목 삭제
  const removeSubject = (index: number) => {
    setForm((prev) => {
      const transcriptData = prev.detail_data as TranscriptData;
      const newSubjects = transcriptData.subjects.filter(
        (_, i) => i !== index
      );
      const totalScore = newSubjects.reduce((sum, s) => sum + s.score, 0);
      const averageScore =
        newSubjects.length > 0
          ? Math.round((totalScore / newSubjects.length) * 100) / 100
          : 0;
      return {
        ...prev,
        detail_data: {
          ...transcriptData,
          subjects: newSubjects,
          total_score: totalScore,
          average_score: averageScore,
        },
      };
    });
  };

  // 성적증명서 과목 필드 업데이트
  const updateSubjectField = (
    index: number,
    field: keyof SubjectScore,
    value: string | number
  ) => {
    setForm((prev) => {
      const transcriptData = prev.detail_data as TranscriptData;
      const newSubjects = transcriptData.subjects.map((s, i) =>
        i === index ? { ...s, [field]: value } : s
      );
      const totalScore = newSubjects.reduce((sum, s) => sum + s.score, 0);
      const averageScore =
        newSubjects.length > 0
          ? Math.round((totalScore / newSubjects.length) * 100) / 100
          : 0;
      return {
        ...prev,
        detail_data: {
          ...transcriptData,
          subjects: newSubjects,
          total_score: totalScore,
          average_score: averageScore,
        },
      };
    });
  };

  // 저장 처리
  const handleSave = async () => {
    // 필수 필드 검증
    if (!form.user_id) {
      alert("회원을 선택해주세요.");
      return;
    }
    if (!form.title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    setSaving(true);
    try {
      const body = {
        user_id: form.user_id,
        record_type: form.record_type,
        title: form.title.trim(),
        data: form.detail_data,
        memo: form.memo.trim(),
      };

      const isEdit = !!editingRecord;
      const url = isEdit
        ? `/api/admin/member-records/${editingRecord.id}`
        : "/api/admin/member-records";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error ?? "저장에 실패했습니다.");
      }

      closeModal();
      await fetchRecords();
    } catch (err) {
      console.error("기록 저장 실패:", err);
      alert(err instanceof Error ? err.message : "저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  // 삭제 처리
  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "이 기록을 삭제하시겠습니까? 삭제된 데이터는 복구할 수 없습니다."
      )
    ) {
      return;
    }

    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/member-records/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("삭제에 실패했습니다.");
      await fetchRecords();
    } catch (err) {
      console.error("기록 삭제 실패:", err);
      alert("삭제에 실패했습니다.");
    } finally {
      setDeleting(null);
    }
  };

  // 공통 입력 필드 스타일
  const inputClass =
    "w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/20 transition-all";
  const labelClass = "block text-sm font-medium text-gray-300 mb-1.5";

  // 기록 유형별 세부 폼 렌더링
  const renderDetailForm = () => {
    switch (form.record_type) {
      case "qualification": {
        const d = form.detail_data as QualificationData;
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>자격명</label>
              <input
                type="text"
                value={d.certification_name}
                onChange={(e) =>
                  updateDetailField("certification_name", e.target.value)
                }
                placeholder="예: 한식조리기능사"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>자격번호</label>
              <input
                type="text"
                value={d.certification_number}
                onChange={(e) =>
                  updateDetailField("certification_number", e.target.value)
                }
                placeholder="예: 2026-0001234"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>취득일자</label>
              <input
                type="date"
                value={d.acquired_date}
                onChange={(e) =>
                  updateDetailField("acquired_date", e.target.value)
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>점수</label>
              <input
                type="number"
                value={d.score ?? ""}
                onChange={(e) =>
                  updateDetailField(
                    "score",
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                placeholder="점수 입력"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>등급</label>
              <input
                type="text"
                value={d.grade}
                onChange={(e) => updateDetailField("grade", e.target.value)}
                placeholder="예: 1급, 2급"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>발급기관</label>
              <input
                type="text"
                value={d.issuing_organization}
                onChange={(e) =>
                  updateDetailField("issuing_organization", e.target.value)
                }
                placeholder="예: 한국산업인력공단"
                className={inputClass}
              />
            </div>
          </div>
        );
      }

      case "transcript": {
        const d = form.detail_data as TranscriptData;
        return (
          <div className="space-y-4">
            <div>
              <label className={labelClass}>과정명</label>
              <input
                type="text"
                value={d.course_name}
                onChange={(e) =>
                  updateDetailField("course_name", e.target.value)
                }
                placeholder="예: 2026년 1학기 정규과정"
                className={inputClass}
              />
            </div>

            {/* 과목별 성적 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-300">
                  과목별 성적
                </label>
                <button
                  type="button"
                  onClick={addSubject}
                  className="flex items-center gap-1 text-xs text-[#c9a84c] hover:text-[#d4b85c] transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  과목 추가
                </button>
              </div>
              <div className="space-y-2">
                {d.subjects.map((subject, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={subject.subject_name}
                      onChange={(e) =>
                        updateSubjectField(
                          index,
                          "subject_name",
                          e.target.value
                        )
                      }
                      placeholder="과목명"
                      className={`${inputClass} flex-1`}
                    />
                    <input
                      type="number"
                      value={subject.score}
                      onChange={(e) =>
                        updateSubjectField(
                          index,
                          "score",
                          Number(e.target.value)
                        )
                      }
                      placeholder="점수"
                      className={`${inputClass} w-24`}
                    />
                    <input
                      type="text"
                      value={subject.grade}
                      onChange={(e) =>
                        updateSubjectField(index, "grade", e.target.value)
                      }
                      placeholder="등급"
                      className={`${inputClass} w-20`}
                    />
                    {d.subjects.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSubject(index)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
                      >
                        <MinusCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 자동 계산 필드 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>총점 (자동계산)</label>
                <input
                  type="number"
                  value={d.total_score}
                  readOnly
                  className={`${inputClass} opacity-60 cursor-not-allowed`}
                />
              </div>
              <div>
                <label className={labelClass}>평균 (자동계산)</label>
                <input
                  type="number"
                  value={d.average_score}
                  readOnly
                  className={`${inputClass} opacity-60 cursor-not-allowed`}
                />
              </div>
              <div>
                <label className={labelClass}>석차</label>
                <input
                  type="text"
                  value={d.rank}
                  onChange={(e) => updateDetailField("rank", e.target.value)}
                  placeholder="예: 3/30"
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        );
      }

      case "career": {
        const d = form.detail_data as CareerData;
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>근무기관</label>
              <input
                type="text"
                value={d.organization}
                onChange={(e) =>
                  updateDetailField("organization", e.target.value)
                }
                placeholder="예: (주)대한기업"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>직위</label>
              <input
                type="text"
                value={d.position}
                onChange={(e) =>
                  updateDetailField("position", e.target.value)
                }
                placeholder="예: 과장"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>소속부서</label>
              <input
                type="text"
                value={d.department}
                onChange={(e) =>
                  updateDetailField("department", e.target.value)
                }
                placeholder="예: 기획팀"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>담당업무</label>
              <input
                type="text"
                value={d.duties}
                onChange={(e) => updateDetailField("duties", e.target.value)}
                placeholder="예: 경영기획 및 전략수립"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>근무시작일</label>
              <input
                type="date"
                value={d.start_date}
                onChange={(e) =>
                  updateDetailField("start_date", e.target.value)
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>근무종료일</label>
              <input
                type="date"
                value={d.end_date}
                onChange={(e) =>
                  updateDetailField("end_date", e.target.value)
                }
                className={inputClass}
              />
            </div>
          </div>
        );
      }

      case "completion": {
        const d = form.detail_data as CompletionData;
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>교육과정명</label>
              <input
                type="text"
                value={d.course_name}
                onChange={(e) =>
                  updateDetailField("course_name", e.target.value)
                }
                placeholder="예: AI 기초 과정"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>교육기간</label>
              <input
                type="text"
                value={d.education_period}
                onChange={(e) =>
                  updateDetailField("education_period", e.target.value)
                }
                placeholder="예: 2026.01.01 ~ 2026.03.31"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>수료일자</label>
              <input
                type="date"
                value={d.completion_date}
                onChange={(e) =>
                  updateDetailField("completion_date", e.target.value)
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>점수</label>
              <input
                type="number"
                value={d.score ?? ""}
                onChange={(e) =>
                  updateDetailField(
                    "score",
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                placeholder="점수 입력"
                className={inputClass}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>담당강사</label>
              <input
                type="text"
                value={d.instructor}
                onChange={(e) =>
                  updateDetailField("instructor", e.target.value)
                }
                placeholder="예: 홍길동"
                className={inputClass}
              />
            </div>
          </div>
        );
      }

      case "employment": {
        const d = form.detail_data as EmploymentData;
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>소속기관</label>
              <input
                type="text"
                value={d.organization}
                onChange={(e) =>
                  updateDetailField("organization", e.target.value)
                }
                placeholder="예: (주)대한기업"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>직위</label>
              <input
                type="text"
                value={d.position}
                onChange={(e) =>
                  updateDetailField("position", e.target.value)
                }
                placeholder="예: 대리"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>소속부서</label>
              <input
                type="text"
                value={d.department}
                onChange={(e) =>
                  updateDetailField("department", e.target.value)
                }
                placeholder="예: 인사팀"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>입사일자</label>
              <input
                type="date"
                value={d.hire_date}
                onChange={(e) =>
                  updateDetailField("hire_date", e.target.value)
                }
                className={inputClass}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>담당업무</label>
              <input
                type="text"
                value={d.duties}
                onChange={(e) => updateDetailField("duties", e.target.value)}
                placeholder="예: 채용 및 인사관리"
                className={inputClass}
              />
            </div>
          </div>
        );
      }

      case "education": {
        const d = form.detail_data as EducationData;
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>프로그램명</label>
              <input
                type="text"
                value={d.program_name}
                onChange={(e) =>
                  updateDetailField("program_name", e.target.value)
                }
                placeholder="예: 직무능력 향상 교육"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>이수시간</label>
              <input
                type="number"
                value={d.total_hours || ""}
                onChange={(e) =>
                  updateDetailField(
                    "total_hours",
                    e.target.value ? Number(e.target.value) : 0
                  )
                }
                placeholder="시간 입력"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>이수일자</label>
              <input
                type="date"
                value={d.completion_date}
                onChange={(e) =>
                  updateDetailField("completion_date", e.target.value)
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>점수</label>
              <input
                type="number"
                value={d.score ?? ""}
                onChange={(e) =>
                  updateDetailField(
                    "score",
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                placeholder="점수 입력"
                className={inputClass}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>담당강사</label>
              <input
                type="text"
                value={d.instructor}
                onChange={(e) =>
                  updateDetailField("instructor", e.target.value)
                }
                placeholder="예: 김철수"
                className={inputClass}
              />
            </div>
          </div>
        );
      }

      case "award": {
        const d = form.detail_data as AwardData;
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>수상명</label>
              <input
                type="text"
                value={d.award_name}
                onChange={(e) =>
                  updateDetailField("award_name", e.target.value)
                }
                placeholder="예: 최우수상"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>수상일자</label>
              <input
                type="date"
                value={d.award_date}
                onChange={(e) =>
                  updateDetailField("award_date", e.target.value)
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>수여기관</label>
              <input
                type="text"
                value={d.awarding_organization}
                onChange={(e) =>
                  updateDetailField("awarding_organization", e.target.value)
                }
                placeholder="예: 한국유소년체스연맹개발연맹"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>대회명</label>
              <input
                type="text"
                value={d.competition_name}
                onChange={(e) =>
                  updateDetailField("competition_name", e.target.value)
                }
                placeholder="예: 제10회 전국 인재 경진대회"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>순위</label>
              <input
                type="text"
                value={d.rank}
                onChange={(e) => updateDetailField("rank", e.target.value)}
                placeholder="예: 1위, 금상"
                className={inputClass}
              />
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* 페이지 제목 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">회원 기록 관리</h1>
          <p className="text-sm text-gray-400 mt-1">
            회원별 자격/수상/성적/경력 데이터를 관리합니다. 증명서 발급 시
            자동으로 연동됩니다.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#c9a84c] hover:bg-[#d4b85c] text-[#0a1628] font-semibold text-sm rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          새 기록 등록
        </button>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="회원명 또는 이메일로 검색..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/20 transition-all"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value as RecordType | "");
            setPage(1);
          }}
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/20 transition-all appearance-none cursor-pointer"
        >
          <option value="" className="bg-[#0d1425]">
            전체
          </option>
          {Object.entries(RECORD_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value} className="bg-[#0d1425]">
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* 테이블 */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : data && data.records.length > 0 ? (
          <>
            {/* 데스크톱 테이블 */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      회원명
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      이메일
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      기록유형
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      제목
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      등록일
                    </th>
                    <th className="text-center px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      관리
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data.records.map((record) => (
                    <tr
                      key={record.id}
                      className="hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="text-sm text-white font-medium">
                          {record.profiles?.name ?? "이름 없음"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {record.profiles?.email ?? "-"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${RECORD_TYPE_COLORS[record.record_type] ?? "bg-gray-500/10 text-gray-400 border-gray-500/20"}`}
                        >
                          {RECORD_TYPE_LABELS[record.record_type] ??
                            record.record_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300 max-w-[250px] truncate">
                        {record.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {formatDate(record.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditModal(record)}
                            className="p-2 text-gray-400 hover:text-[#c9a84c] hover:bg-[#c9a84c]/10 rounded-lg transition-all"
                            title="수정"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(record.id)}
                            disabled={deleting === record.id}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50"
                            title="삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 모바일 카드 */}
            <div className="md:hidden divide-y divide-white/5">
              {data.records.map((record) => (
                <div key={record.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white font-medium">
                        {record.profiles?.name ?? "이름 없음"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {record.profiles?.email ?? "-"}
                      </p>
                    </div>
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${RECORD_TYPE_COLORS[record.record_type] ?? "bg-gray-500/10 text-gray-400 border-gray-500/20"}`}
                    >
                      {RECORD_TYPE_LABELS[record.record_type] ??
                        record.record_type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 truncate">
                    {record.title}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      등록일: {formatDate(record.created_at)}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(record)}
                        className="p-1.5 text-gray-400 hover:text-[#c9a84c] hover:bg-[#c9a84c]/10 rounded-lg transition-all"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(record.id)}
                        disabled={deleting === record.id}
                        className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 페이지네이션 */}
            {data.totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
                <span className="text-sm text-gray-400">
                  총 {data.total}건 중 {(data.page - 1) * data.limit + 1}-
                  {Math.min(data.page * data.limit, data.total)}건
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-300">
                    {data.page} / {data.totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setPage((p) => Math.min(data.totalPages, p + 1))
                    }
                    disabled={page === data.totalPages}
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="p-12 text-center text-gray-500">
            {search || typeFilter
              ? "검색 결과가 없습니다."
              : "등록된 기록이 없습니다."}
          </div>
        )}
      </div>

      {/* 등록/수정 모달 */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* 배경 오버레이 */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* 모달 콘텐츠 */}
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0d1425] border border-white/10 rounded-xl shadow-2xl">
            {/* 모달 헤더 */}
            <div className="sticky top-0 bg-[#0d1425] border-b border-white/10 px-6 py-4 flex items-center justify-between rounded-t-xl z-10">
              <h2 className="text-lg font-bold text-white">
                {editingRecord ? "기록 수정" : "새 기록 등록"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 모달 본문 */}
            <div className="p-6 space-y-6">
              {/* 회원 선택 */}
              <div>
                <h3 className="text-sm font-semibold text-[#c9a84c] mb-3">
                  회원 선택
                </h3>
                <div ref={memberDropdownRef} className="relative">
                  <label className={labelClass}>
                    회원 <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      value={memberSearch}
                      onChange={(e) => {
                        setMemberSearch(e.target.value);
                        setShowMemberDropdown(true);
                        if (!e.target.value.trim()) {
                          setSelectedMember(null);
                          setForm((prev) => ({ ...prev, user_id: "" }));
                        }
                      }}
                      onFocus={() => {
                        if (memberSearch.trim()) setShowMemberDropdown(true);
                      }}
                      placeholder="이름 또는 이메일로 회원 검색..."
                      className={`${inputClass} pl-10`}
                    />
                    {memberLoading && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 animate-spin" />
                    )}
                  </div>

                  {/* 회원 드롭다운 */}
                  {showMemberDropdown && memberOptions.length > 0 && (
                    <div className="absolute z-20 w-full mt-1 bg-[#131b30] border border-white/10 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                      {memberOptions.map((member) => (
                        <button
                          key={member.id}
                          type="button"
                          onClick={() => selectMember(member)}
                          className={`w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 ${
                            selectedMember?.id === member.id
                              ? "bg-[#c9a84c]/10 text-[#c9a84c]"
                              : "text-white"
                          }`}
                        >
                          <span className="font-medium">
                            {member.name ?? "이름 없음"}
                          </span>
                          <span className="text-gray-500 ml-2 text-xs">
                            {member.email}
                          </span>
                          {member.phone && (
                            <span className="text-gray-600 ml-2 text-xs">
                              {member.phone}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {showMemberDropdown &&
                    memberSearch.trim() &&
                    !memberLoading &&
                    memberOptions.length === 0 && (
                      <div className="absolute z-20 w-full mt-1 bg-[#131b30] border border-white/10 rounded-lg shadow-xl px-4 py-3 text-sm text-gray-500">
                        검색 결과가 없습니다.
                      </div>
                    )}

                  {/* 선택된 회원 표시 */}
                  {selectedMember && (
                    <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-[#c9a84c]/5 border border-[#c9a84c]/20 rounded-lg">
                      <div className="w-6 h-6 bg-[#c9a84c]/20 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-[#c9a84c]">
                          {(selectedMember.name ?? "?").charAt(0)}
                        </span>
                      </div>
                      <span className="text-sm text-white">
                        {selectedMember.name ?? "이름 없음"}
                      </span>
                      <span className="text-xs text-gray-400">
                        {selectedMember.email}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedMember(null);
                          setMemberSearch("");
                          setForm((prev) => ({ ...prev, user_id: "" }));
                        }}
                        className="ml-auto p-1 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* 기록 유형 및 제목 */}
              <div>
                <h3 className="text-sm font-semibold text-[#c9a84c] mb-3">
                  기본 정보
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>
                      기록 유형 <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={form.record_type}
                      onChange={(e) =>
                        handleTypeChange(e.target.value as RecordType)
                      }
                      className={`${inputClass} appearance-none cursor-pointer`}
                    >
                      {Object.entries(RECORD_TYPE_LABELS).map(
                        ([value, label]) => (
                          <option
                            key={value}
                            value={value}
                            className="bg-[#0d1425]"
                          >
                            {label}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>
                      제목 <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, title: e.target.value }))
                      }
                      placeholder="기록 제목 입력"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* 기록 유형별 세부 입력 */}
              <div>
                <h3 className="text-sm font-semibold text-[#c9a84c] mb-3">
                  {RECORD_TYPE_LABELS[form.record_type]} 상세 정보
                </h3>
                {renderDetailForm()}
              </div>

              {/* 메모 */}
              <div>
                <label className={labelClass}>메모</label>
                <textarea
                  value={form.memo}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, memo: e.target.value }))
                  }
                  placeholder="관리자 메모 (선택사항)"
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>

            {/* 모달 푸터 */}
            <div className="sticky bottom-0 bg-[#0d1425] border-t border-white/10 px-6 py-4 flex items-center justify-end gap-3 rounded-b-xl">
              <button
                onClick={closeModal}
                className="px-4 py-2.5 text-sm text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 text-sm font-semibold text-[#0a1628] bg-[#c9a84c] hover:bg-[#d4b85c] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all"
              >
                {saving ? "저장 중..." : editingRecord ? "수정" : "등록"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
