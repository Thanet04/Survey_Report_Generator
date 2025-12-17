'use client'

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Bar } from 'react-chartjs-2';
import Swal from "sweetalert2";
import Link from "next/link";
import { ArrowLeft, BarChart3, Loader2, Download } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function SurveyReport() {
  const params = useParams();
  const surveyId = params.surveyId;
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const surveyRes = await axios.get(`http://localhost:5100/api/survey/${surveyId}`);
      const qs = surveyRes.data.question.map((q: any) => ({
        QuestionId: q.id,
        QuestionText: q.text
      }));
      setQuestions(qs);

      const answerRes = await axios.get(`http://localhost:5100/api/answer/${surveyId}`);
      setAnswers(answerRes.data);
    } catch {
      Swal.fire({
        title: "ข้อผิดพลาด",
        text: "ไม่สามารถดึงรายงานได้",
        icon: "error",
        customClass: { popup: 'rounded-xl' }
      });
    } finally {
      setLoading(false);
    }
  };

  // Convert answers to counts
  const data = {
    labels: questions.map(q => q.QuestionText.length > 20 ? q.QuestionText.substring(0, 20) + '...' : q.QuestionText),
    datasets: [{
      label: 'จำนวนผู้ตอบ',
      data: questions.map(q => answers.filter(a => a.questionId === q.QuestionId).length),
      backgroundColor: 'rgba(99, 102, 241, 0.6)',
      borderColor: 'rgba(99, 102, 241, 1)',
      borderWidth: 2,
      borderRadius: 8,
      hoverBackgroundColor: 'rgba(99, 102, 241, 0.8)',
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: function (context: any) {
            const index = context[0].dataIndex;
            return questions[index].QuestionText;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: '#6b7280',
          font: { size: 12 }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0,0,0,0.05)',
          borderDash: [5, 5]
        },
        ticks: {
          stepSize: 1,
          color: '#6b7280',
          font: { size: 12 }
        },
        border: { display: false }
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">กำลังประมวลผลข้อมูล...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 pt-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in-up">
          <div className="flex items-center gap-4">
            <Link href="/Dashboard">
              <button className="bg-white hover:bg-gray-100 text-gray-700 p-2.5 rounded-xl shadow-sm border border-gray-200 transition-all">
                <ArrowLeft size={20} />
              </button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <BarChart3 className="text-indigo-600" />
                รายงานผลแบบสอบถาม
              </h1>
              <p className="text-gray-500 text-sm">วิเคราะห์ข้อมูลคำตอบทั้งหมด</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-sm font-medium">
              ผู้ตอบทั้งหมด: <span className="font-bold text-lg ml-1">{answers.length > 0 ? answers.length / questions.length : 0}</span> คน
            </div>
          </div>
        </div>

        {/* Chart Card */}
        <div className="glass p-8 rounded-2xl shadow-lg border border-white/40 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800">ภาพรวมการตอบคำถาม</h2>
            <p className="text-gray-500 text-sm">จำนวนผู้ตอบในแต่ละหัวข้อคำถาม</p>
          </div>

          <div className="h-[400px] w-full">
            {questions.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                <BarChart3 className="w-12 h-12 mb-2 opacity-20" />
                <p>ไม่มีข้อมูลคำถามสำหรับแบบสอบถามนี้</p>
              </div>
            ) : (
              <Bar data={data} options={options} />
            )}
          </div>
        </div>

        {/* Detailed Stats Grid (Optional Future Expansion) */}
        <div className="grid md:grid-cols-2 gap-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          {/* You can add more detailed cards here later, e.g. text answers list */}
        </div>

      </div>
    </div>
  );
}
