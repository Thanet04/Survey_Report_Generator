'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";
import Link from "next/link";
import Navbar from "../components/Navbar";

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
    } catch (err) {
      Swal.fire("ข้อผิดพลาด", "ไม่สามารถดึงแบบสอบถามได้", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!userLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">กำลังโหลดผู้ใช้งาน...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar role={user?.role || null} />
      <div className="max-w-7xl mx-auto">
        {/* การกระทำด่วน */}
        {user?.role === "Admin" && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions</h2>
            <Link href="/Dashboard/create-survey">
              <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 cursor-pointer">
                สร้างแบบสอบถามใหม่
              </button>
            </Link>
          </div>
        )}

        {/* แบบสอบถาม */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">แบบสอบถามที่มีอยู่</h2>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">กำลังโหลดแบบสอบถาม...</span>
            </div>
          ) : surveys.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-600 text-lg">ยังไม่มีแบบสอบถาม</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {surveys.map(s => (
                <div key={s.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition duration-200">
                  <h3 className="text-lg text-center font-semibold text-gray-900 mb-2">{s.title}</h3>
                  <Link
                    href={user?.role === "Admin" ? `/Dashboard/report/${s.id}` : `/Dashboard/survey/${s.id}`}
                  >
                    <button className={`w-full py-2 px-4 rounded-lg font-medium cursor-pointer text-white transition duration-200 ${user?.role === "Admin" ? "bg-blue-500 hover:bg-blue-600" : "bg-indigo-500 hover:bg-indigo-600"}`}>
                      {user?.role === "Admin" ? "📈 ดูรายงาน" : "✍️ ทำแบบสอบถาม"}
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
