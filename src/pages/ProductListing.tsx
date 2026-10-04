import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { MessageCircle, Phone } from "lucide-react"
import { formatPrice, getWhatsAppUrl, storePhone } from "@/lib/storefront"
import { supabase } from "@/lib/supabaseClient"

interface Product {
  id: number
  name: string
  price: number
  image: string | null
}

interface Category {
  id: number
  name: string
  slug: string
}

const ProductListing = () => {
  const [searchParams] = useSearchParams()
  const categorySlug = searchParams.get("category")
  const [products, setProducts] = useState<Product[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadFailed, setLoadFailed] = useState(false)

  useEffect(() => {
    let isMounted = true

    const fetchProducts = async () => {
      let categoryId: number | null = null

      if (categorySlug) {
        const { data: foundCategory, error: categoryError } = await supabase
          .from("categories")
          .select("id, name, slug")
          .eq("slug", categorySlug)
          .maybeSingle()

        if (!isMounted) return
        if (categoryError) {
          setLoadFailed(true)
          setLoading(false)
          return
        }
        if (!foundCategory) {
          setCategory(null)
          setProducts([])
          setLoading(false)
          return
        }

        categoryId = foundCategory.id
        setCategory(foundCategory)
      } else {
        setCategory(null)
      }

      let query = supabase
        .from("products")
        .select("id, name, price, image")
        .eq("status", "Active")
        .order("id", { ascending: false })

      if (categoryId !== null) query = query.eq("category_id", categoryId)

      const { data, error } = await query
      if (!isMounted) return

      if (error) {
        console.error("Failed to load products:", error.message)
        setLoadFailed(true)
      } else {
        setProducts(data ?? [])
      }
      setLoading(false)
    }

    setLoading(true)
    setLoadFailed(false)
    void fetchProducts()
    return () => {
      isMounted = false
    }
  }, [categorySlug])

  const title = category?.name ?? "All products"

  return (
    <section className="mx-auto max-w-300 py-5 sm:py-8" aria-labelledby="product-listing-title">
      <div className="mb-6 border-b border-gray-200 pb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9f2089]">Siwani Collection</p>
        <h1 id="product-listing-title" className="mt-2 text-2xl font-semibold text-gray-950 sm:text-3xl">{title}</h1>
        <p className="mt-2 text-sm text-gray-600">Browse the collection and contact us directly to enquire.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4" role="status" aria-label="Loading products">
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-4/5 rounded-md bg-gray-100" />
              <div className="mt-3 h-4 w-3/4 rounded bg-gray-100" />
              <div className="mt-2 h-4 w-1/3 rounded bg-gray-100" />
            </div>
          ))}
        </div>
      ) : loadFailed ? (
        <p className="py-12 text-center text-sm text-gray-500">Products are temporarily unavailable. Please try again shortly.</p>
      ) : products.length === 0 ? (
        <p className="py-12 text-center text-sm text-gray-500">
          {category ? "There are no products in this category yet." : "New pieces are on their way. Check back soon."}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {products.map((product) => (
            <article key={product.id} className="group min-w-0 overflow-hidden rounded-md border border-gray-200 bg-white">
              <Link to={`/product/${product.id}`} aria-label={`View ${product.name}`} className="block">
                <div className="aspect-4/5 overflow-hidden bg-[#f5f3f0]">
                  {product.image ? (
                    <img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  ) : (
                    <div className="flex h-full items-center justify-center px-4 text-center text-sm text-gray-400">Image coming soon</div>
                  )}
                </div>
              </Link>
              <div className="p-3 sm:p-4">
                <h2 className="line-clamp-2 min-h-10 text-sm font-medium leading-5 text-gray-900 sm:text-base">
                  <Link to={`/product/${product.id}`} className="hover:underline hover:underline-offset-2">{product.name}</Link>
                </h2>
                <p className="mt-1 text-base font-semibold text-gray-900">{formatPrice(product.price)}</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <a
                    href={getWhatsAppUrl(`Hi, I'm interested in ${product.name}.`)}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Enquire about ${product.name} on WhatsApp`}
                    className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded border border-[#16874c] px-2 text-xs font-medium text-[#147442] transition-colors hover:bg-[#eaf6ee] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16874c]"
                  >
                    <MessageCircle className="size-4 shrink-0" /> WhatsApp
                  </a>
                  {storePhone ? (
                    <a
                      href={`tel:+${storePhone}`}
                      aria-label={`Call about ${product.name}`}
                      className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded bg-gray-900 px-2 text-xs font-medium text-white transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-700"
                    >
                      <Phone className="size-4 shrink-0" /> Call
                    </a>
                  ) : (
                    <span className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded bg-gray-100 px-2 text-xs font-medium text-gray-400">
                      <Phone className="size-4 shrink-0" /> Call unavailable
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default ProductListing