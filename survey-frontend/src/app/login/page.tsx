'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      Swal.fire({ icon: 'warning', title: 'ข้อมูลไม่ครบ', text: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' });
      return;
    }
    try {
      const res = await axios.post("http://localhost:5100/api/auth/login", { username, password });
      localStorage.setItem("User", JSON.stringify(res.data));

      Swal.fire({ 
        icon: 'success', 
        title: 'เข้าสู่ระบบสำเร็จ'
      });
      router.push("/Dashboard");
    } catch(err:any) {
      Swal.fire({ 
        icon: 'error', 
        title: 'เข้าสู่ระบบล้มเหลว', 
        text: err.response?.data?.message || 'เกิดข้อผิดพลาด' 
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ยินดีต้อนรับ Survey </h1>
            <p className="text-gray-600">เข้าสู่ระบบบัญชีของคุณ</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                ชื่อผู้ใช้
              </label>
              <input
                id="username"
                type="text"
                required
                className="w-full px-4 py-3 rounded-lg text-black border border-gray-300 bg-gray-50"
                placeholder="กรอกชื่อผู้ใช้ของคุณ"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                รหัสผ่าน
              </label>
              <input
                id="password"
                type="password"
                required
                className="w-full px-4 py-3 rounded-lg text-black border border-gray-300 bg-gray-50"
                placeholder="กรอกรหัสผ่านของคุณ"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 cursor-pointer"
            >
              เข้าสู่ระบบ
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ยังไม่มีบัญชีใช่ไหม?{" "}
              <button
                onClick={() => router.push("/Register")}
                className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer transition duration-200"
              >
                สมัครที่นี่
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
