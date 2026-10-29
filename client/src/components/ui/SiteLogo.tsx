import Image from "next/image";

export function SiteLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`relative inline-flex items-center ${className}`}>
      <Image src="/logo.png" alt="JH Shoe Gallery Logo" width={100} height={35} className="h-auto w-auto" priority />
    </span>
  );
}
