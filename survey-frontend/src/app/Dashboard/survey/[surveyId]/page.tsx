'use client'

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";
import Link from "next/link";
import { ArrowLeft, Send, CheckCircle2, Loader2, HelpCircle } from "lucide-react";

interface Question {
  id: number;
  surveyId: number;
  text: string;
  type: string | null;
  options?: string[];
  optionsList?: string[];
}

interface User {
  userId: number;
  role: string;
}

export default function TakeSurvey() {
  const params = useParams();
  const router = useRouter();

  const surveyIdParam = params.surveyId;
  const surveyId = Array.isArray(surveyIdParam)
    ? surveyIdParam[0]
    : surveyIdParam;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [textAnswers, setTextAnswers] = useState<{ [key: number]: string }>({});
  const [choiceAnswers, setChoiceAnswers] = useState<{ [key: number]: string[] }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!surveyIdParam) return;
    fetchQuestions();
  }, [surveyIdParam]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5100/api/survey/${surveyId}`
      );
      setQuestions(res.data.question || []);
    } catch {
      Swal.fire({
        title: "ข้อผิดพลาด",
        text: "ไม่สามารถดึงคำถามได้",
        icon: "error",
        customClass: { popup: 'rounded-xl' }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userStr = localStorage.getItem("User");
    if (!userStr) {
      Swal.fire({ title: "ข้อผิดพลาด", text: "คุณต้องเข้าสู่ระบบก่อน", icon: "error" });
      router.push("/login");
      return;
    }
    const user: User = JSON.parse(userStr);

    const allAnswered = questions.every(q =>
      q.type === "text" ? textAnswers[q.id]?.trim() : (choiceAnswers[q.id]?.length || 0) > 0
    );
    if (!allAnswered) {
      Swal.fire({
        title: "คำเตือน",
        text: "กรุณาตอบคำถามทุกข้อก่อนส่ง",
        icon: "warning",
        confirmButtonColor: '#f59e0b',
        customClass: { popup: 'rounded-xl' }
      });
      return;
    }

    setSubmitting(true);

    try {
      for (const q of questions) {
        const answerText =
          q.type === "text"
            ? textAnswers[q.id]
            : (choiceAnswers[q.id] || []).join(", ");

        await axios.post("http://localhost:5100/api/answer", {
          SurveyId: parseInt(surveyId!, 10),
          QuestionId: q.id,
          UserId: user.userId,
          AnswerText: answerText
        });
      }

      Swal.fire({
        title: "สำเร็จ!",
        text: "ส่งคำตอบเรียบร้อยแล้ว",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        customClass: { popup: 'rounded-xl' }
      });
      setTimeout(() => router.push("/Dashboard"), 2000);
    } catch {
      Swal.fire({ title: "ข้อผิดพลาด", text: "ส่งคำตอบไม่สำเร็จ", icon: "error" });
      setSubmitting(false);
    }
  };

  if (!surveyIdParam) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 text-red-600 rounded-xl">
          <h2 className="text-xl font-bold">ข้อผิดพลาด</h2>
          <p>ไม่พบ Survey ID</p>
          <Link href="/Dashboard" className="underline mt-4 block">กลับไปหน้าแดชบอร์ด</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in-up">
          <div className="flex items-center gap-4">
            <Link href="/Dashboard">
              <button className="bg-white hover:bg-gray-100 text-gray-700 p-2.5 rounded-xl shadow-sm border border-gray-200 transition-all">
                <ArrowLeft size={20} />
              </button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">ทำแบบสอบถาม</h1>
              <p className="text-gray-500 text-sm">ตอบคำถามให้ครบทุกข้อ</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4 animate-pulse">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            <p className="text-gray-500">กำลังโหลดคำถาม...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            {questions.map((q, index) => (
              <div key={q.id} className="glass p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-indigo-500">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 leading-relaxed mt-0.5">
                    {q.text}
                  </h3>
                </div>

                <div className="pl-12">
                  {/* TEXT QUESTION */}
                  {q.type === "text" && (
                    <div className="relative">
                      <textarea
                        required
                        rows={3}
                        className="w-full p-4 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none text-gray-700 placeholder-gray-400"
                        placeholder="พิมพ์คำตอบของคุณที่นี่..."
                        value={textAnswers[q.id] || ""}
                        onChange={e => setTextAnswers({ ...textAnswers, [q.id]: e.target.value })}
                      />
                    </div>
                  )}

                  {/* CHOICE QUESTION */}
                  {q.type === "choice" && Array.isArray(q.optionsList) && (
                    <div className="space-y-3">
                      {q.optionsList.map((opt, i) => {
                        const checked = choiceAnswers[q.id]?.includes(opt) || false;
                        return (
                          <label
                            key={i}
                            className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all duration-200 group
                              ${checked
                                ? 'bg-indigo-50 border-indigo-200 shadow-sm'
                                : 'bg-white/50 border-gray-200 hover:bg-white hover:border-gray-300'
                              }`}
                          >
                            <div className="relative flex items-center justify-center">
                              <input
                                type="checkbox"
                                value={opt}
                                checked={checked}
                                onChange={e => {
                                  const current = choiceAnswers[q.id] || [];
                                  if (e.target.checked) {
                                    setChoiceAnswers({ ...choiceAnswers, [q.id]: [...current, opt] });
                                  } else {
                                    setChoiceAnswers({
                                      ...choiceAnswers,
                                      [q.id]: current.filter(x => x !== opt),
                                    });
                                  }
                                }}
                                className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-md checked:bg-indigo-500 checked:border-indigo-500 transition-colors"
                              />
                              <CheckCircle2 className="w-3.5 h-3.5 text-white absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
                            </div>
                            <span className={`ml-3 text-base ${checked ? 'text-indigo-900 font-medium' : 'text-gray-700'}`}>
                              {opt}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div className="flex items-center justify-end gap-4 pt-6">
              <Link
                href="/Dashboard"
                className="px-6 py-3 rounded-xl text-gray-600 font-semibold hover:bg-gray-100 transition-colors"
              >
                ยกเลิก
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/30 flex items-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send size={18} />}
                <span>ส่งคำตอบ</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
