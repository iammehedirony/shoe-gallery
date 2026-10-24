import Link from "next/link";

export default function LoginPage() {
  return (
    <form className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-ink">Login</h2>
      <input type="text" placeholder="Email or Phone Number" className="w-full rounded border border-black/10 px-4 py-3 outline-none focus:border-brand" />
      <input type="password" placeholder="Password" className="w-full rounded border border-black/10 px-4 py-3 outline-none focus:border-brand" />
      <Link href="#" className="text-sm text-brand underline">Forgot Password?</Link>
      <button type="submit" className="w-full rounded bg-brand py-3 font-bold text-white transition hover:opacity-90">LOG IN</button>
      <p className="text-center text-sm text-muted">
        Don't have an account? <Link href="/register" className="text-brand font-semibold">Register</Link>
      </p>
    </form>
  );
}
