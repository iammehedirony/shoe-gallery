export default function AdminHeader({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="h-16 bg-white border-b border-black/10 flex items-center justify-between px-4 md:px-8">
      <button onClick={onMenuClick} className="lg:hidden p-2 text-ink">
        ☰
      </button>
      <div className="font-bold text-ink">Admin Portal</div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold hidden md:block">Admin User</span>
        <div className="h-8 w-8 rounded-full bg-brand flex items-center justify-center text-white font-bold">A</div>
      </div>
    </header>
  );
}
