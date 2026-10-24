import Link from "next/link";

export default function RegisterPage() {
  return (
    <form className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-ink">Register</h2>
      <input type="text" placeholder="Full Name" className="w-full rounded border border-black/10 px-4 py-3 outline-none focus:border-brand" />
      <input type="email" placeholder="Email" className="w-full rounded border border-black/10 px-4 py-3 outline-none focus:border-brand" />
      <input type="tel" placeholder="Phone Number" className="w-full rounded border border-black/10 px-4 py-3 outline-none focus:border-brand" />
      <input type="password" placeholder="Password" className="w-full rounded border border-black/10 px-4 py-3 outline-none focus:border-brand" />
      <input type="password" placeholder="Confirm Password" className="w-full rounded border border-black/10 px-4 py-3 outline-none focus:border-brand" />
      <button type="submit" className="w-full rounded bg-brand py-3 font-bold text-white transition hover:opacity-90">REGISTER</button>
      <p className="text-center text-sm text-muted">
        Already have an account? <Link href="/login" className="text-brand font-semibold">Login</Link>
      </p>
    </form>
  );
}
