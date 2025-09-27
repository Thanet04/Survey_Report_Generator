'use client'
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface NavbarProps {
  role: string | null;
}

export default function Navbar({ role }: NavbarProps) {
  const router = useRouter();

  const handleLogout = () => {
    Swal.fire({
      title: 'ออกจากระบบ',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ตกลง',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("User");
        router.push("/login");
      }
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 mb-8 flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">📊 แดชบอร์ด</h1>
        {role ? (
          <p className="text-gray-600">
            ยินดีต้อนรับ {role} • จัดการแบบสอบถามและรายงานของคุณ
          </p>
        ) : (
          <p className="text-gray-600">กำลังโหลดข้อมูลผู้ใช้...</p>
        )}
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
      >
        ออกจากระบบ
      </button>
    </div>
  );
}
