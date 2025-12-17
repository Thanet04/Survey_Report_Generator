'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";
import Link from "next/link";

export default function CreateSurvey() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  // Updated state: each question has text, type (text/choice), and options (for choice type)
  const [questions, setQuestions] = useState<{ text: string; type: 'text' | 'choice'; options: string[] }[]>([
    { text: "", type: "text", options: [""] }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddQuestion = () => {
    setQuestions([...questions, { text: "", type: "text", options: [""] }]);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length > 1) {
      const newQuestions = questions.filter((_, i) => i !== index);
      setQuestions(newQuestions);
    }
  };

  const handleChangeQuestion = (index: number, field: 'text' | 'type', value: string) => {
    const newQuestions = [...questions];
    if (field === 'text') newQuestions[index].text = value;
    if (field === 'type') {
      newQuestions[index].type = value as 'text' | 'choice';
      // Reset options if switching to choice
      if (value === 'choice' && newQuestions[index].options.length === 0) {
        newQuestions[index].options = [""];
      }
    }
    setQuestions(newQuestions);
  };

  // Option handlers
  const handleAddOption = (qIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.push("");
    setQuestions(newQuestions);
  };

  const handleRemoveOption = (qIndex: number, oIndex: number) => {
    const newQuestions = [...questions];
    if (newQuestions[qIndex].options.length > 1) {
      newQuestions[qIndex].options = newQuestions[qIndex].options.filter((_, i) => i !== oIndex);
      setQuestions(newQuestions);
    }
  };

  const handleChangeOption = (qIndex: number, oIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      Swal.fire("ข้อผิดพลาด", "กรุณากรอกชื่อแบบสอบถาม", "error");
      return;
    }
    const userStr = localStorage.getItem("User");
    if (!userStr) {
      Swal.fire("ข้อผิดพลาด", "คุณต้องเข้าสู่ระบบก่อน", "error");
      router.push("/login");
      return;
    }
    const user = JSON.parse(userStr);

    // Filter valid questions
    const validQuestions = questions.filter(q => q.text.trim());
    if (validQuestions.length === 0) {
      Swal.fire("ข้อผิดพลาด", "กรุณากรอกคำถามอย่างน้อย 1 ข้อ", "error");
      return;
    }

    // Validate Choice questions have options
    for (const q of validQuestions) {
      if (q.type === 'choice') {
        const validOptions = q.options.filter(o => o.trim());
        if (validOptions.length < 1) {
          Swal.fire("ข้อผิดพลาด", `กรุณาเพิ่มตัวเลือกสำหรับคำถาม "${q.text}"`, "error");
          return;
        }
      }
    }

    setIsLoading(true);
    try {
      // สร้างแบบสอบถาม
      const surveyRes = await axios.post("http://localhost:5100/api/survey", {
        Title: title,
        CreatedBy: user.userId
      });
      const surveyId = surveyRes.data.surveyId;

      // สร้างคำถาม
      for (const q of validQuestions) {
        await axios.post("http://localhost:5100/api/question", {
          SurveyId: surveyId,
          Text: q.text,
          Type: q.type,
          Options: q.type === 'choice' ? JSON.stringify(q.options.filter(o => o.trim())) : "[]"
        });
      }

      Swal.fire({
        title: "สำเร็จ",
        text: "สร้างแบบสอบถามเรียบร้อยแล้ว!",
        icon: "success",
        confirmButtonColor: '#3b82f6'
      });
      router.push("/Dashboard");
    } catch (err) {
      Swal.fire("ข้อผิดพลาด", "ไม่สามารถสร้างแบบสอบถามได้", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <span className="text-2xl">📝</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">สร้างแบบสอบถามใหม่</h1>
              <p className="text-slate-500 text-sm">กำหนดรายละเอียดและคำถาม</p>
            </div>
          </div>
          <Link
            href="/Dashboard"
            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg transition duration-200 text-sm font-medium"
          >
            ย้อนกลับ
          </Link>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Survey Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-bold text-slate-700 mb-2">
                ชื่อแบบสอบถาม <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder-slate-400"
                placeholder="Ex. แบบสอบถามความพึงพอใจการใช้บริการ"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>

            <div className="border-t border-slate-100 pt-6">
              <label className="block text-lg font-bold text-slate-800 mb-4">
                รายการคำถาม ({questions.length})
              </label>

              <div className="space-y-6">
                {questions.map((question, index) => (
                  <div key={index} className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:border-blue-300 transition-colors relative group">
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(index)}
                          className="text-slate-400 hover:text-red-500 transition-colors"
                          title="ลบคำถาม"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    <div className="flex items-start gap-4 mb-4">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm shrink-0">
                        {index + 1}
                      </span>
                      <div className="flex-1 space-y-4">
                        {/* Question Text */}
                        <input
                          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
                          placeholder={`พิมพ์คำถามข้อที่ ${index + 1}`}
                          value={question.text}
                          onChange={e => handleChangeQuestion(index, 'text', e.target.value)}
                        />

                        {/* Question Type Toggle */}
                        <div className="flex items-center gap-4">
                          <label className="text-sm text-slate-600 font-medium">รูปแบบคำถาม:</label>
                          <div className="flex bg-white rounded-lg p-1 border border-slate-200">
                            <button
                              type="button"
                              onClick={() => handleChangeQuestion(index, 'type', 'text')}
                              className={`px-3 py-1.5 text-sm rounded-md font-medium transition-all ${question.type === 'text' ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                              ข้อความ (Text)
                            </button>
                            <button
                              type="button"
                              onClick={() => handleChangeQuestion(index, 'type', 'choice')}
                              className={`px-3 py-1.5 text-sm rounded-md font-medium transition-all ${question.type === 'choice' ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                              ตัวเลือก (Choice)
                            </button>
                          </div>
                        </div>

                        {/* Options Section (If Choice) */}
                        {question.type === 'choice' && (
                          <div className="pl-4 border-l-2 border-blue-100 space-y-2 mt-2">
                            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">ตัวเลือกคำตอบ</p>
                            {question.options.map((opt, oIndex) => (
                              <div key={oIndex} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full border border-slate-300"></div>
                                <input
                                  className="flex-1 px-3 py-1.5 rounded border border-slate-200 text-sm focus:border-blue-400 outline-none"
                                  placeholder={`ตัวเลือกที่ ${oIndex + 1}`}
                                  value={opt}
                                  onChange={(e) => handleChangeOption(index, oIndex, e.target.value)}
                                />
                                {question.options.length > 1 && (
                                  <button type="button" onClick={() => handleRemoveOption(index, oIndex)} className="text-slate-400 hover:text-red-500">×</button>
                                )}
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => handleAddOption(index)}
                              className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-1 flex items-center gap-1"
                            >
                              + เพิ่มตัวเลือก
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddQuestion}
                className="mt-6 w-full py-3 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all font-semibold flex items-center justify-center gap-2"
              >
                <span>+ เพิ่มคำถามข้อถัดไป</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-slate-100">
              <Link
                href="/Dashboard"
                className="px-6 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors font-medium"
              >
                ยกเลิก
              </Link>

              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>กำลังสร้าง...</span>
                  </div>
                ) : (
                  "สร้างแบบสอบถาม"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
