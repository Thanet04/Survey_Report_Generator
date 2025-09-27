'use client'

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";
import Link from "next/link";

interface Question {
  id: number;
  surveyId: number;
  text: string;
  type: string | null;
}

interface User {
  userId: number;
  role: string;
}

export default function TakeSurvey() {
  const params = useParams();
  const router = useRouter();

  const surveyIdParam = params.surveyId;
  if (!surveyIdParam) {
    return <div className="p-6 text-red-500">ข้อผิดพลาด: ไม่มี Survey ID</div>;
  }
  const surveyId = Array.isArray(surveyIdParam) ? surveyIdParam[0] : surveyIdParam;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key:number]: string }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5100/api/survey/${surveyId}`);
      setQuestions(res.data.question || []);
    } catch (err) {
      Swal.fire("ข้อผิดพลาด", "ไม่สามารถดึงคำถามได้", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userStr = localStorage.getItem("User");
    if (!userStr) {
      Swal.fire("ข้อผิดพลาด", "คุณต้องเข้าสู่ระบบก่อน", "error");
      router.push("/login");
      return;
    }
    const user: User = JSON.parse(userStr);

    const allAnswered = questions.every(q => answers[q.id]?.trim());
    if (!allAnswered) {
      Swal.fire("คำเตือน", "กรุณาตอบคำถามทุกข้อก่อนส่ง", "warning");
      return;
    }

    try {
      for (const q of questions) {
        await axios.post("http://localhost:5100/api/answer", {
          SurveyId: parseInt(surveyId, 10),
          QuestionId: q.id,
          UserId: user.userId,
          AnswerText: answers[q.id] || ""
        });
      }
      Swal.fire("สำเร็จ", "ส่งคำตอบเรียบร้อยแล้ว!", "success");
      router.push("/Dashboard");
    } catch (err) {
      Swal.fire("ข้อผิดพลาด", "ส่งคำตอบไม่สำเร็จ", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* ส่วนหัว */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/Dashboard"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition duration-200 flex items-center space-x-2"
              >
                <span>ย้อนกลับ</span>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">📝 แบบสอบถาม</h1>
            </div>
          </div>
        </div>

        {/* แบบฟอร์มแบบสอบถาม */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">กำลังโหลดคำถาม...</span>
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-600 text-lg">ไม่มีคำถามสำหรับแบบสอบถามนี้</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {questions.map((question, index) => (
                <div key={question.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="mb-4">
                    <label className="block text-lg font-semibold text-gray-900 mb-3">
                      คำถามที่ {index + 1} จาก {questions.length}
                    </label>
                    <p className="text-gray-700 leading-relaxed">{question.text}</p>
                  </div>
                  <input
                    required
                    className="w-full px-4 py-3 rounded-lg text-black border border-gray-300 bg-white"
                    placeholder="กรอกคำตอบของคุณที่นี่..."
                    value={answers[question.id] || ""}
                    onChange={e => setAnswers({ ...answers, [question.id]: e.target.value })}
                  />
                </div>
              ))}

              {/* ปุ่มส่ง */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Link 
                  href="/Dashboard"
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition duration-200 font-medium"
                >
                  ยกเลิก
                </Link>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition duration-200 shadow-lg hover:shadow-xl"
                >
                ส่งคำตอบ
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
