import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="mb-8">
        <Image src="/logo.png" alt="Logo" width={150} height={50} />
      </div>
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-sm border border-black/10">
        {children}
      </div>
    </div>
  );
}
