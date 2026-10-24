import Image from "next/image";

export default function AdminHeader() {
  return (
    <header className="h-16 bg-white border-b border-black/10 flex items-center justify-between px-8">
      <div className="font-bold text-ink">Admin Portal</div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold">Admin User</span>
        <div className="h-8 w-8 rounded-full bg-brand flex items-center justify-center text-white font-bold">A</div>
      </div>
    </header>
  );
}
