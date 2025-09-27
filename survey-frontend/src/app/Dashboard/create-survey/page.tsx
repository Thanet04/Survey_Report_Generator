'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";
import Link from "next/link";

export default function CreateSurvey() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<string[]>([""]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddQuestion = () => setQuestions([...questions, ""]);
  
  const handleRemoveQuestion = (index: number) => {
    if (questions.length > 1) {
      const newQuestions = questions.filter((_, i) => i !== index);
      setQuestions(newQuestions);
    }
  };
  
  const handleChangeQuestion = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
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

    const filteredQuestions = questions.filter(q => q.trim());
    if (filteredQuestions.length === 0) {
      Swal.fire("ข้อผิดพลาด", "กรุณากรอกคำถามอย่างน้อย 1 ข้อ", "error");
      return;
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
      for (const q of filteredQuestions) {
        await axios.post("http://localhost:5100/api/question", {
          SurveyId: surveyId,
          Text: q,
          Type: "text"
        });
      }

      Swal.fire("สำเร็จ", "สร้างแบบสอบถามเรียบร้อยแล้ว!", "success");
      router.push("/Dashboard");
    } catch (err) {
      Swal.fire("ข้อผิดพลาด", "ไม่สามารถสร้างแบบสอบถามได้", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Link 
                href="/Dashboard"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition duration-200 flex items-center space-x-2"
              >
                <span>ย้อนกลับ</span>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">
                📝 สร้างแบบสอบถามใหม่
              </h1>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-3">
                📋 ชื่อแบบสอบถาม *
              </label>
              <input
                id="title"
                type="text"
                required
                className="w-full px-4 py-3 rounded-lg text-black border border-gray-300 bg-gray-50"
                placeholder="กรอกชื่อแบบสอบถาม"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                ❓ คำถาม *
              </label>
              
              <div className="space-y-3">
                {questions.map((question, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex-1">
                      <input
                        className="w-full px-4 py-3 rounded-lg text-black border border-gray-300 bg-gray-50"
                        placeholder={`คำถามข้อที่ ${index + 1}`}
                        value={question}
                        onChange={e => handleChangeQuestion(index, e.target.value)}
                      />
                    </div>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(index)}
                        className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-2 rounded-lg transition duration-200"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddQuestion}
                className="mt-4 bg-blue-100 hover:bg-blue-200 text-blue-600 px-4 py-2 rounded-lg transition duration-200 font-medium cursor-pointer"
              >
                + เพิ่มคำถาม
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Link 
                href="/Dashboard"
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition duration-200 font-medium"
              >
                ยกเลิก
              </Link>
              
              <button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-600 cursor-pointer"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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
