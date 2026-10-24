import { policyLinks } from "@/src/data/navigation";
import {
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
} from "@/src/components/ui/Icons";

const socialLinks = [
  { label: "Facebook", href: "#", Icon: FacebookIcon },
  { label: "Instagram", href: "#", Icon: InstagramIcon },
  { label: "YouTube", href: "#", Icon: YoutubeIcon },
];

export default function Footer() {
  return (
    <footer className="mt-4 bg-blush">
      <div className="mx-auto w-full max-w-[1240px] px-4 py-12 lg:px-6 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-14">
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink">
              About Us
            </h2>
            <p className="mt-4 max-w-sm text-[12.5px] leading-6 text-ink/55">
              RICHKID is a premium leather shoes and fashion accessories brand in
              Bangladesh. We deliver quality footwear, thoughtful design and everyday
              comfort for ladies and gents.
            </p>

            <a
              href="#"
              className="mt-5 inline-block text-[10.5px] font-bold uppercase tracking-[0.16em] text-brand underline decoration-brand/30 underline-offset-4 transition-colors hover:decoration-brand"
            >
              Outlet Shop
            </a>

            <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/45">
              Contact Us / Call Now
            </p>
            <a
              href="tel:+8801700000000"
              className="mt-1 block text-sm font-semibold text-ink transition-colors hover:text-brand"
            >
              +880 1700 000 000
            </a>
          </div>

          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink">
              Policy
            </h2>
            <ul className="mt-4 space-y-2.5">
              {policyLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[12.5px] text-ink/55 transition-colors hover:text-brand"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink">
              Damage / Wrong Item
            </h2>
            <p className="mt-4 max-w-sm text-[12.5px] leading-6 text-ink/55">
              Received a damaged or wrong item? Please contact our support team
              within 24 hours of delivery with your order ID and an unboxing video
              so we can resolve it quickly.
            </p>

            <a
              href="#"
              className="mt-4 inline-flex items-center justify-center rounded-[4px] bg-brand px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white shadow-[0_10px_20px_-14px_rgba(200,16,46,0.9)] transition-colors hover:bg-brand-dark"
            >
              Contact Support Team
            </a>

            <div className="mt-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/45">
                Follow Us
              </p>
              <div className="mt-2.5 flex items-center gap-2">
                {socialLinks.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="grid h-8 w-8 place-items-center rounded-full border border-brand/20 bg-white text-brand transition-colors hover:bg-brand hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#2b0a10] py-3.5">
        <p className="text-center text-[10px] tracking-[0.08em] text-white/65 sm:text-[11px]">
          Copyright 2026 Richkid Bangladesh
        </p>
      </div>
    </footer>
  );
}
