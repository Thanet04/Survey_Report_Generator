'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";
import { User, Mail, Lock, Phone, UserPlus, ArrowRight, Loader2 } from "lucide-react";

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password || !confirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'ข้อมูลไม่ครบ',
        text: 'กรุณากรอกข้อมูลให้ครบถ้วน',
        customClass: {
          popup: 'rounded-xl border border-gray-100 shadow-xl'
        }
      });
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'รหัสผ่านไม่ตรงกัน',
        text: 'กรุณากรอกรหัสผ่านและยืนยันรหัสผ่านให้ตรงกัน',
        customClass: {
          popup: 'rounded-xl border border-gray-100 shadow-xl'
        }
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:5100/api/auth/register", { username, fullname, email, phone, password, Role: "User" });

      Swal.fire({
        icon: 'success',
        title: 'ลงทะเบียนสำเร็จ!',
        text: `รหัสผู้ใช้: ${res.data.UserId}`,
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: 'rounded-xl border border-gray-100 shadow-xl'
        }
      });

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'ลงทะเบียนล้มเหลว',
        text: err.response?.data?.message || 'เกิดข้อผิดพลาด',
        customClass: {
          popup: 'rounded-xl border border-gray-100 shadow-xl'
        }
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md animate-fade-in-up px-4">
      <div className="glass rounded-2xl p-8 md:p-10 relative overflow-hidden">
        {/* Decorative background ellipses */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4 shadow-inner">
            <UserPlus className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 tracking-tight">สร้างบัญชีใหม่</h1>
          <p className="text-gray-500 text-sm">กรอกข้อมูลเพื่อเริ่มต้นใช้งานระบบ Survey</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative group">
              <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
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
              <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                id="fullname"
                type="text"
                required
                className="w-full pl-10 pr-4 py-3 glass-input rounded-xl text-gray-700 placeholder-gray-400 outline-none"
                placeholder="ชื่อ-นามสกุล"
                value={fullname}
                onChange={e => setFullname(e.target.value)}
              />
            </div>
          </div>

          <div className="relative group">
            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              id="email"
              type="email"
              required
              className="w-full pl-10 pr-4 py-3 glass-input rounded-xl text-gray-700 placeholder-gray-400 outline-none"
              placeholder="อีเมลของคุณ"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="relative group">
            <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              id="phone"
              type="tel"
              required
              maxLength={10}
              inputMode="numeric"
              className="w-full pl-10 pr-4 py-3 glass-input rounded-xl text-gray-700 placeholder-gray-400 outline-none"
              placeholder="เบอร์โทรศัพท์ (10 หลัก)"
              value={phone}
              onChange={e => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                setPhone(value);
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative group">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
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

            <div className="relative group">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                id="confirmPassword"
                type="password"
                required
                className="w-full pl-10 pr-4 py-3 glass-input rounded-xl text-gray-700 placeholder-gray-400 outline-none"
                placeholder="ยืนยันรหัสผ่าน"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200 transition-all duration-300 shadow-lg shadow-blue-500/30 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'ลงทะเบียน'}
            {!isLoading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <div className="mt-8 text-center relative z-10">
          <p className="text-gray-500 text-sm">
            มีบัญชีผู้ใช้งานอยู่แล้ว?{" "}
            <button
              onClick={() => router.push("/login")}
              className="text-blue-600 hover:text-blue-700 font-bold cursor-pointer hover:underline transition-all"
            >
              เข้าสู่ระบบ
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
