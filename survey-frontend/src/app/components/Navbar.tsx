'use client'
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { LogOut, LayoutDashboard, UserCircle } from "lucide-react";

interface NavbarProps {
  role: string | null;
}

export default function Navbar({ role }: NavbarProps) {
  const router = useRouter();

  const handleLogout = () => {
    Swal.fire({
      title: 'ออกจากระบบ?',
      text: "คุณต้องการออกจากระบบใช่หรือไม่",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'ออกจากระบบ',
      cancelButtonText: 'ยกเลิก',
      customClass: {
        popup: 'rounded-2xl border border-gray-100 shadow-xl',
        confirmButton: 'rounded-lg px-4 py-2',
        cancelButton: 'rounded-lg px-4 py-2'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("User");
        router.push("/login");
      }
    });
  };

  return (
    <nav className="glass sticky top-4 z-50 rounded-2xl mx-4 mb-8 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 transition-all duration-300">
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-blue-500/30">
          <LayoutDashboard size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Survey Dashboard
          </h1>
          {role && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-2 h-2 rounded-full ${role === 'Admin' ? 'bg-amber-400' : 'bg-emerald-400'} animate-pulse`}></span>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {role} Account
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
        {role && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50/50 border border-gray-100">
            <UserCircle size={18} className="text-gray-400" />
            <span className="text-sm text-gray-600 font-medium">Hello, {role}</span>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="group flex items-center justify-end gap-2 bg-white hover:bg-red-50 text-gray-700 hover:text-red-600 px-4 py-2 rounded-xl transition-all duration-200 border border-gray-200 hover:border-red-100 shadow-sm hover:shadow"
        >
          <span className="font-medium text-sm">Sign Out</span>
          <LogOut size={18} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </nav>
  );
}
