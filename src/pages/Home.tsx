import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, MessageCircle, Phone } from "lucide-react"
import AdvertisementCarousel from "@/components/AdvertisementCarousel"
import CategoryCarousel from "@/components/CategoryCarousel"
import SEO from "@/components/SEO"
import { formatPrice, getWhatsAppUrl, storePhone } from "@/lib/storefront"
import { supabase } from "@/lib/supabaseClient"

interface Product {
  id: number
  name: string
  price: number
  image: string | null
}

const Home = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [loadFailed, setLoadFailed] = useState(false)

  useEffect(() => {
    let isMounted = true

    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, image")
        .eq("status", "Active")
        .order("id", { ascending: false })
        .limit(8)

      if (!isMounted) return

      if (error) {
        console.error("Failed to load homepage products:", error.message)
        setLoadFailed(true)
      } else {
        setProducts(data ?? [])
      }
      setLoading(false)
    }

    void fetchProducts()
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <>
      <SEO
        title="Shiwani Collection | Thoughtful Styles, Timeless Fabrics"
        description="Discover thoughtfully selected styles and fabrics at Shiwani Collection. Browse the latest collection and enquire directly."
        canonicalPath="/"
      />
      <CategoryCarousel />
      <AdvertisementCarousel />
      <section className="bg-[#f8f5f2]">
        <div className="wContainer grid gap-8 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-12 lg:px-10 lg:py-20">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#9f2089]">
              Welcome to Shiwani Collection
            </p>
            <h1 className="max-w-2xl text-3xl font-semibold leading-tight text-gray-950 sm:text-4xl lg:text-5xl">
              Find a style that feels like you.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-gray-600 sm:text-lg">
              Explore thoughtfully selected styles and fabrics, discover pieces by category, and get in touch with us directly when something catches your eye.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/product"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded bg-gray-950 px-5 text-sm font-semibold text-white transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2"
              >
                Explore the collection <ArrowRight className="size-4" />
              </Link>
              <a
                href={getWhatsAppUrl("Hi, I'd like to know more about Shiwani Collection.")}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded border border-gray-300 bg-white px-5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16874c] focus-visible:ring-offset-2"
              >
                <MessageCircle className="size-4 text-[#16874c]" /> Ask us on WhatsApp
              </a>
            </div>
          </div>
          <div className="rounded-md border border-[#e8ded8] bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold text-[#9f2089]">A simple way to shop</p>
            <ol className="mt-5 space-y-5">
              <li className="flex gap-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f8f1f7] text-sm font-semibold text-[#9f2089]">1</span>
                <div>
                  <h2 className="font-semibold text-gray-900">Explore your way</h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">Browse all products or start with a category that interests you.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f8f1f7] text-sm font-semibold text-[#9f2089]">2</span>
                <div>
                  <h2 className="font-semibold text-gray-900">Find the details</h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">Open a product to see its price and current availability.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f8f1f7] text-sm font-semibold text-[#9f2089]">3</span>
                <div>
                  <h2 className="font-semibold text-gray-900">Enquire directly</h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">Message us on WhatsApp or call to ask about a product.</p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </section>

      <section className="wContainer py-8 sm:py-10" aria-labelledby="featured-products-title">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#9f2089]">
              Made to be yours
            </p>
            <h2 id="featured-products-title" className="text-2xl font-semibold text-gray-900 sm:text-3xl">
              Explore our collection
            </h2>
          </div>
          <span className="hidden text-sm text-gray-500 sm:block">Thoughtful fabrics. Timeless style.</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4" role="status" aria-label="Loading products">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-4/5 rounded-md bg-gray-100" />
                <div className="mt-3 h-4 w-3/4 rounded bg-gray-100" />
                <div className="mt-2 h-4 w-1/3 rounded bg-gray-100" />
              </div>
            ))}
          </div>
        ) : loadFailed ? (
          <p className="py-10 text-center text-sm text-gray-500">Products are temporarily unavailable. Please try again shortly.</p>
        ) : products.length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-500">New pieces are on their way. Check back soon.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
            {products.map((product) => {
              const whatsappUrl = getWhatsAppUrl(`Hi, I'm interested in ${product.name}.`)

              return (
                <article key={product.id} className="group min-w-0 overflow-hidden rounded-md border border-gray-200 bg-white">
                  <div className="relative aspect-4/5 overflow-hidden bg-[#f5f3f0]">
                    <Link to={`/product/${product.id}`} aria-label={`View ${product.name}`} className="block h-full w-full">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center px-4 text-center text-sm text-gray-400">
                          Image coming soon
                        </div>
                      )}
                    </Link>
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="line-clamp-2 min-h-10 text-sm font-medium leading-5 text-gray-900 sm:text-base">
                      <Link to={`/product/${product.id}`} className="hover:underline hover:underline-offset-2">
                        {product.name}
                      </Link>
                    </h3>
                    <p className="mt-1 text-base font-semibold text-gray-900">
                      {formatPrice(product.price)}
                    </p>
                    <div className="mt-3 grid lg:grid-cols-2 gap-2 ">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Enquire about ${product.name} on WhatsApp`}
                        className="inline-flex overflow-hidden min-h-10 items-center justify-center gap-1.5 rounded border border-[#16874c] px-2 text-xs font-medium text-[#147442] transition-colors hover:bg-[#eaf6ee] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16874c]"
                      >
                        <MessageCircle className="size-4 shrink-0" />
                        WhatsApp
                      </a>
                      {storePhone ? (
                        <a
                          href={`tel:+${storePhone}`}
                          aria-label={`Call about ${product.name}`}
                          className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded bg-gray-900 px-2 text-xs font-medium text-white transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-700"
                        >
                          <Phone className="size-4 shrink-0" />
                          Call
                        </a>
                      ) : (
                        <button
                          type="button"
                          disabled
                          title="Set VITE_STORE_PHONE to enable calls"
                          className="inline-flex min-h-10 cursor-not-allowed items-center justify-center gap-1.5 rounded bg-gray-100 px-2 text-xs font-medium text-gray-400"
                        >
                          <Phone className="size-4 shrink-0" />
                          Call
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        <div className="mt-7 text-center">
          <Link to="/product" className="text-sm font-semibold text-gray-900 underline decoration-gray-300 underline-offset-4 transition-colors hover:text-[#9f2089]">
            Browse all products
          </Link>
        </div>
      </section>
      <section className="wContainer px-5 pb-10 sm:px-8 lg:px-10" aria-labelledby="about-collection-title">
        <div className="rounded-md bg-[#17211d] px-6 py-8 text-white sm:px-9 sm:py-10">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#e6a6dc]">A little about us</p>
          <h2 id="about-collection-title" className="mt-2 text-2xl font-semibold sm:text-3xl">
            Style, discovered at your pace.
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/75 sm:text-base sm:leading-7">
            Shiwani Collection makes it easy to explore the pieces we have available. Take a look through the latest collection, find a style you love, and reach out to us personally for help with your enquiry.
          </p>
          <Link
            to="/product"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white"
          >
            Browse all products <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </>
  )
}

export default Home