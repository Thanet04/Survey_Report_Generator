'use client'

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Bar } from 'react-chartjs-2';
import Swal from "sweetalert2";
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

  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      const surveyRes = await axios.get(`http://localhost:5100/api/survey/${surveyId}`);
      const qs = surveyRes.data.question.map((q: any) => ({
        QuestionId: q.id,
        QuestionText: q.text
      }));
      setQuestions(qs);
  
      const answerRes = await axios.get(`http://localhost:5100/api/answer/${surveyId}`);
      setAnswers(answerRes.data);
    } catch {
      Swal.fire("Error", "ไม่สามารถดึงรายงานได้", "error");
    }
  };

  // แปลง answers เป็นจำนวน
  const data = {
    labels: questions.map(q => q.QuestionText),
    datasets: [{
      label: 'จำนวนคำตอบ',
      data: questions.map(q => answers.filter(a => a.questionId  === q.QuestionId).length),
      backgroundColor: 'rgba(59, 130, 246, 0.7)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 1,
      borderRadius: 6,
      barPercentage: 0.6
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#1e293b', // สีตัวอักษร
          font: {
            size: 14,
            weight: 'bold' as const
          }
        }
      },
      title: {
        display: true,
        text: 'รายงานแบบสอบถาม',
        color: '#1e293b',
        font: {
          size: 20,
          weight: 'bold' as const
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#3b82f6',
        titleColor: '#fff',
        bodyColor: '#fff'
      }
    },
    scales: {
      x: {
        ticks: { color: '#1e293b', font: { size: 14 } },
        grid: { color: 'rgba(0,0,0,0.05)' }
      },
      y: {
        beginAtZero: true,
        ticks: { color: '#1e293b', font: { size: 14 } },
        grid: { color: 'rgba(0,0,0,0.05)' }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">รายงานแบบสอบถาม</h1>
        {questions.length === 0 ? (
          <p className="text-gray-600 text-center py-12">ไม่มีข้อมูลคำถามสำหรับแบบสอบถามนี้</p>
        ) : (
          <Bar data={data} options={options} />
        )}
      </div>
    </div>
  );
}
