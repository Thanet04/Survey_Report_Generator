'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { Trash2, ChevronLeft, ChevronRight, Edit, Plus, LayoutGrid, List } from "lucide-react";

interface Survey {
  id: number;
  title: string;
}

interface User {
  userId: number;
  role: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLoaded, setUserLoaded] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const userStr = localStorage.getItem("User");
    if (!userStr) {
      router.push("/login");
      return;
    }
    const u: User = JSON.parse(userStr);
    setUser(u);
    setUserLoaded(true);
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5100/api/survey");
      setSurveys(res.data || []);
      setCurrentPage(1); // Reset to first page on refresh
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error loading surveys',
        text: 'Cannot fetch survey data',
        confirmButtonColor: '#3b82f6'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    Swal.fire({
      title: 'ลบแบบสอบถาม?',
      text: `คุณต้องการลบ "${title}" ใช่หรือไม่? ไม่สามารถกู้คืนได้`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'ใช่',
      cancelButtonText: 'ยกเลิก',
      customClass: {
        popup: 'rounded-2xl',
        confirmButton: 'rounded-lg px-4 py-2',
        cancelButton: 'rounded-lg px-4 py-2'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5100/api/survey/${id}`);
          Swal.fire({
            title: 'Deleted!',
            text: 'ลบแบบสอบถามเรียบร้อยแล้ว',
            icon: 'success',
            confirmButtonColor: '#3b82f6',
            timer: 1500
          });
          fetchSurveys();
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Delete Failed',
            text: 'เกิดข้อผิดพลาดในการลบ',
            confirmButtonColor: '#3b82f6'
          });
        }
      }
    });
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSurveys = surveys.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(surveys.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (!userLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Navbar role={user?.role || null} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Dashboard</h2>
            <p className="text-slate-500 mt-1">จัดการและดูรายงานความพึงพอใจ</p>
          </div>

          {user?.role === "Admin" && (
            <Link href="/Dashboard/create-survey">
              <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-0.5 active:translate-y-0 group">
                <div className="bg-white/20 p-1 rounded-lg group-hover:bg-white/30 transition-colors">
                  <Plus size={20} />
                </div>
                <span>สร้างแบบสอบถาม</span>
              </button>
            </Link>
          )}
        </div>

        {/* Content Area */}
        <div className="glass-card rounded-2xl p-8 min-h-[500px] flex flex-col">
          <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
            <h3 className="text-xl font-bold text-slate-700 flex items-center gap-3">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <LayoutGrid className="text-emerald-600 w-5 h-5" />
              </div>
              <span>แบบสอบถามทั้งหมด</span>
              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-medium border border-slate-200">
                {surveys.length} รายการ
              </span>
            </h3>
          </div>

          {loading ? (
            <div className="flex-1 flex flex-col justify-center items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-blue-600"></div>
              <span className="mt-4 text-slate-500 font-medium">กำลังโหลดข้อมูล...</span>
            </div>
          ) : surveys.length === 0 ? (
            <div className="flex-1 flex flex-col justify-center items-center text-center py-12">
              <div className="bg-slate-100 p-6 rounded-full mb-4">
                <span className="text-4xl">📝</span>
              </div>
              <h4 className="text-xl font-semibold text-slate-700 mb-2">ยังไม่มีแบบสอบถาม</h4>
              <p className="text-slate-500">เริ่มต้นสร้างแบบสอบถามแรกของคุณได้เลย</p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                {currentSurveys.map(s => (
                  <div key={s.id} className="group bg-white border border-slate-200 rounded-2xl p-6 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-full">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold text-slate-800 line-clamp-2 leading-tight group-hover:text-blue-700 transition-colors">
                        {s.title}
                      </h3>
                      {/* Admin Actions */}
                      {user?.role === "Admin" && (
                        <div className="flex gap-2">
                          <Link href={`/Dashboard/edit-survey/${s.id}`}>
                            <button
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                              title="แก้ไขแบบสอบถาม"
                            >
                              <Edit size={18} />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(s.id, s.title)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="ลบแบบสอบถาม"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <Link
                        href={user?.role === "Admin" ? `/Dashboard/report/${s.id}` : `/Dashboard/survey/${s.id}`}
                      >
                        <button className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-200 flex justify-center items-center gap-2 ${user?.role === "Admin"
                          ? "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-105"
                          : "bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-blue-600"
                          }`}>
                          {user?.role === "Admin" ? (
                            <><span>ดูรายงานผล</span> <span className="text-lg">→</span></>
                          ) : (
                            "ทำแบบสอบถาม"
                          )}
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-auto flex justify-center items-center gap-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => paginate(idx + 1)}
                        className={`w-10 h-10 rounded-lg font-medium transition-all ${currentPage === idx + 1
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                          : 'text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200'
                          }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
