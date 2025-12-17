'use client'

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";
import Link from "next/link";
import { ArrowLeft, BarChart3, Loader2, Users, FileText, CheckCircle2 } from "lucide-react";

interface Question {
  id: number;
  text: string;
  type: string;
  options?: string;
  optionsList?: string[];
}

interface Answer {
  id: number;
  questionId: number;
  userId: number;
  answerText: string;
}

interface ProcessedStats {
  question: Question;
  totalAnswers: number;
  textAnswers: string[];
  choiceCounts: { [option: string]: number };
}

export default function SurveyReport() {
  const params = useParams();
  const surveyId = params.surveyId;
  const [title, setTitle] = useState("");
  const [stats, setStats] = useState<ProcessedStats[]>([]);
  const [totalRespondents, setTotalRespondents] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (surveyId) {
      fetchReportData();
    }
  }, [surveyId]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      // 1. Fetch Survey & Questions
      const surveyRes = await axios.get(`http://localhost:5100/api/survey/${surveyId}`);
      const surveyData = surveyRes.data;
      setTitle(surveyData.title || surveyData.survey?.title || "Survey Report");

      const questionsData: Question[] = surveyData.question || surveyData.survey?.question || [];

      // 2. Fetch Answers
      const answerRes = await axios.get(`http://localhost:5100/api/answer/${surveyId}`);
      const answersData: Answer[] = answerRes.data;

      // 3. Process Data
      const uniqueUsers = new Set(answersData.map(a => a.userId));
      setTotalRespondents(uniqueUsers.size);

      const computedStats = questionsData.map(q => {
        const qAnswers = answersData.filter(a => a.questionId === q.id);

        // Parse Options
        let options: string[] = [];
        if (q.type === 'choice') {
          if (q.optionsList && Array.isArray(q.optionsList)) {
            options = q.optionsList;
          } else if (q.options) {
            try {
              options = JSON.parse(q.options);
            } catch {
              options = q.options.split(',').map(s => s.trim());
            }
          }
        }

        // Count Choices
        const choiceCounts: { [key: string]: number } = {};
        options.forEach(opt => choiceCounts[opt] = 0);

        const textAnswers: string[] = [];

        qAnswers.forEach(a => {
          if (q.type === 'choice') {
            // Handle multiple selections if comma separated? 
            // Assuming single or comma-separated string match
            const selected = a.answerText.split(',').map(s => s.trim());
            selected.forEach(s => {
              // Normalize validation? logic: exact match
              if (choiceCounts[s] !== undefined) {
                choiceCounts[s]++;
              } else {
                // Potentially "Other" or mismatch, just track it?
                // For now, only count defined options
              }
            });
          } else {
            if (a.answerText) textAnswers.push(a.answerText);
          }
        });

        return {
          question: { ...q, optionsList: options }, // Ensure optionsList is populated
          totalAnswers: qAnswers.length,
          textAnswers,
          choiceCounts
        };
      });

      setStats(computedStats);

    } catch (err) {
      console.error(err);
      Swal.fire("ข้อผิดพลาด", "ไม่สามารถโหลดข้อมูลรายงานได้", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">กำลังประมวลผลข้อมูล...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-8 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Link href="/Dashboard">
              <button className="bg-white hover:bg-slate-100 text-slate-700 p-2.5 rounded-xl shadow-sm border border-slate-200 transition-all hover:-translate-x-1">
                <ArrowLeft size={20} />
              </button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <BarChart3 className="text-blue-600" />
                สรุปผลรายงาน
              </h1>
              <p className="text-slate-500 text-sm">{title}</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-4 rounded-2xl shadow-lg shadow-emerald-500/20 flex items-center gap-4">
            <div className="bg-white/20 p-2 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-emerald-100 text-xs font-medium uppercase tracking-wider">ผู้ตอบทั้งหมด</p>
              <p className="text-3xl font-bold">{totalRespondents} <span className="text-lg font-normal opacity-80">คน</span></p>
            </div>
          </div>
        </div>

        {/* Questions Stats */}
        <div className="space-y-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-300 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>

              <div className="flex items-start gap-4 mb-6">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold text-sm shrink-0 border border-slate-200">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 leading-relaxed">
                    {stat.question.text}
                  </h3>
                  <span className="inline-block mt-2 px-3 py-1 bg-slate-100 text-slate-500 text-xs rounded-full font-medium border border-slate-200">
                    {stat.question.type === 'choice' ? 'แบบตัวเลือก' : 'แบบข้อความ'}
                  </span>
                </div>
              </div>

              {/* Visualization based on type */}
              {stat.question.type === 'choice' ? (
                <div className="space-y-4 pl-0 md:pl-12">
                  {stat.question.optionsList?.map((option, optIdx) => {
                    const count = stat.choiceCounts[option] || 0;
                    const percentage = stat.totalAnswers > 0
                      ? Math.round((count / stat.totalAnswers) * 100)
                      : 0;

                    return (
                      <div key={optIdx} className="relative group/bar">
                        <div className="flex justify-between items-end mb-1">
                          <span className="font-medium text-slate-700">{option}</span>
                          <div className="text-right">
                            <span className="font-bold text-blue-600">{count} คน</span>
                            <span className="text-slate-400 text-sm ml-2">({percentage}%)</span>
                          </div>
                        </div>
                        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="pl-0 md:pl-12">
                  <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                    <div className="px-4 py-3 bg-slate-100 border-b border-slate-200 flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <FileText size={14} /> รายการคำตอบ
                      </span>
                      <span className="text-xs text-slate-400">{stat.textAnswers.length} รายการ</span>
                    </div>
                    <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
                      {stat.textAnswers.length > 0 ? (
                        stat.textAnswers.map((ans, i) => (
                          <div key={i} className="p-4 text-slate-600 text-sm hover:bg-white transition-colors">
                            {ans}
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-slate-400 text-sm italic">
                          ยังไม่มีคำตอบ
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {stats.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
              <div className="inline-block p-4 bg-slate-50 rounded-full mb-4">
                <BarChart3 className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-lg font-medium text-slate-600">ยังไม่มีข้อมูลรายงาน</h3>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
