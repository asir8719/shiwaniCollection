import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { MessageCircle, Phone } from "lucide-react"
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
    </>
  )
}

export default Home