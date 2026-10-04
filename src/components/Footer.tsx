import { Link } from "react-router-dom"
import { ArrowUpRight, MessageCircle, Phone } from "lucide-react"
import { getWhatsAppUrl, storePhone } from "@/lib/storefront"

const Footer = () => {
  return (
    <footer className="mt-10 bg-[#17211d] text-white">
      <div className="mx-auto grid max-w-[1200px] gap-8 px-5 py-9 sm:grid-cols-2 sm:px-8 lg:grid-cols-[1.4fr_0.8fr_1fr] lg:gap-12 lg:px-10 lg:py-11">
        <div>
          <Link to="/" className="inline-block text-lg font-semibold tracking-wide text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            Siwani Collection
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-6 text-white/70">
            Explore the collection and contact us directly with product enquiries.
          </p>
        </div>

        <nav aria-label="Footer navigation">
          <h2 className="text-sm font-semibold">Explore</h2>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li><Link className="transition-colors hover:text-white" to="/">Home</Link></li>
            <li><Link className="transition-colors hover:text-white" to="/product">Products</Link></li>
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold">Get in touch</h2>
          <div className="mt-3 flex flex-col items-start gap-3 text-sm text-white/75">
            <a
              href={getWhatsAppUrl("Hi, I have a question about the Siwani Collection.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 transition-colors hover:text-white"
            >
              <MessageCircle className="size-4 text-[#62d38a]" /> WhatsApp us
              <ArrowUpRight className="size-3.5" />
            </a>
            {storePhone ? (
              <a href={`tel:+${storePhone}`} className="inline-flex items-center gap-2 transition-colors hover:text-white">
                <Phone className="size-4" /> +{storePhone}
              </a>
            ) : (
              <span className="inline-flex items-center gap-2 text-white/45">
                <Phone className="size-4" /> Phone contact unavailable
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-[1200px] px-5 py-4 text-xs text-white/55 sm:px-8 lg:px-10">
          © {new Date().getFullYear()} Siwani Collection
        </p>
      </div>
    </footer>
  )
}

export default Footer