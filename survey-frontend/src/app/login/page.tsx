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
        customClass: {
          popup: 'rounded-xl border border-gray-100 shadow-xl'
        }
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
        customClass: {
          popup: 'rounded-xl border border-gray-100 shadow-xl'
        }
      });

      setTimeout(() => {
        router.push("/Dashboard");
      }, 1500);
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'เข้าสู่ระบบล้มเหลว',
        text: err.response?.data?.message || 'เกิดข้อผิดพลาด',
        customClass: {
          popup: 'rounded-xl border border-gray-100 shadow-xl'
        }
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm animate-fade-in-up px-4">
      <div className="glass rounded-2xl p-8 md:p-10 relative overflow-hidden">
        {/* Decorative background ellipses */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 mb-4 shadow-inner">
            <LogIn className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 tracking-tight">ยินดีต้อนรับ</h1>
          <p className="text-gray-500 text-sm">กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <div className="space-y-4">
            <div className="relative group">
              <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                id="username"
                type="text"
                required
                className="w-full pl-10 pr-4 py-3 glass-input rounded-xl text-gray-700 placeholder-gray-400 outline-none"
                placeholder="ชื่อผู้ใช้"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                id="password"
                type="password"
                required
                className="w-full pl-10 pr-4 py-3 glass-input rounded-xl text-gray-700 placeholder-gray-400 outline-none"
                placeholder="รหัสผ่าน"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 px-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:ring-indigo-200 transition-all duration-300 shadow-lg shadow-indigo-500/30 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'เข้าสู่ระบบ'}
            {!isLoading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <div className="mt-8 text-center relative z-10">
          <p className="text-gray-500 text-sm">
            ยังไม่มีบัญชีใช่ไหม?{" "}
            <button
              onClick={() => router.push("/Register")}
              className="text-indigo-600 hover:text-indigo-700 font-bold cursor-pointer hover:underline transition-all"
            >
              สมัครสมาชิก
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
