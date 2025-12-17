'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";
import { User, Lock, LogIn, ArrowRight, Loader2 } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      Swal.fire({
        icon: 'warning',
        title: 'ข้อมูลไม่ครบ',
        text: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน',
        customClass: { popup: 'rounded-xl border border-gray-100 shadow-xl' }
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:5100/api/auth/login", { username, password });
      localStorage.setItem("User", JSON.stringify(res.data));

      Swal.fire({
        icon: 'success',
        title: 'เข้าสู่ระบบสำเร็จ',
        timer: 1500,
        showConfirmButton: false,
        customClass: { popup: 'rounded-xl border border-gray-100 shadow-xl' }
      });

      setTimeout(() => {
        router.push("/Dashboard");
      }, 1500);
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'เข้าสู่ระบบล้มเหลว',
        text: err.response?.data?.message || 'เกิดข้อผิดพลาด',
        customClass: { popup: 'rounded-xl border border-gray-100 shadow-xl' }
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm animate-fade-in-up">
        <div className="glass rounded-2xl p-8 md:p-10 relative overflow-hidden bg-white/80 border border-slate-200 shadow-xl">
          {/* Decorative background ellipses */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-slate-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

          <div className="text-center mb-8 relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4 shadow-sm border border-blue-100">
              <LogIn className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">ยินดีต้อนรับ</h1>
            <p className="text-slate-500 text-sm">กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div className="space-y-4">
              <div className="relative group">
                <User className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  id="username"
                  type="text"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  placeholder="ชื่อผู้ใช้"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  id="password"
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  placeholder="รหัสผ่าน"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 px-4 rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'เข้าสู่ระบบ'}
              {!isLoading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          <div className="mt-8 text-center relative z-10">
            <p className="text-slate-500 text-sm">
              ยังไม่มีบัญชีใช่ไหม?{" "}
              <button
                onClick={() => router.push("/Register")}
                className="text-blue-600 hover:text-blue-700 font-bold cursor-pointer hover:underline transition-all"
              >
                สมัครสมาชิก
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
