import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { ArrowLeft, MessageCircle, Phone } from "lucide-react"
import SEO from "@/components/SEO"
import { formatPrice, getWhatsAppUrl, storePhone } from "@/lib/storefront"
import { supabase } from "@/lib/supabaseClient"

interface Product {
  id: number
  name: string
  price: number
  image: string | null
  quantity: number
}

const ProductDetail = () => {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let isMounted = true

    const fetchProduct = async () => {
      const productId = Number(id)
      if (!Number.isSafeInteger(productId) || productId < 1) {
        setError(true)
        setLoading(false)
        return
      }

      const { data, error: fetchError } = await supabase
        .from("products")
        .select("id, name, price, image, quantity")
        .eq("id", productId)
        .eq("status", "Active")
        .maybeSingle()

      if (!isMounted) return
      setProduct(data)
      setError(Boolean(fetchError))
      setLoading(false)
    }

    void fetchProduct()
    return () => {
      isMounted = false
    }
  }, [id])

  if (loading) {
    return (
      <>
        <SEO title="Product | Shiwani Collection" description="View product details from Shiwani Collection." canonicalPath={`/product/${id}`} />
        <section className="mx-auto grid max-w-5xl gap-8 py-8 md:grid-cols-2" role="status" aria-label="Loading product">
          <div className="aspect-4/5 animate-pulse rounded bg-gray-100" />
          <div className="space-y-4 py-4">
            <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
            <div className="h-8 w-3/4 animate-pulse rounded bg-gray-100" />
            <div className="h-6 w-1/3 animate-pulse rounded bg-gray-100" />
          </div>
        </section>
      </>
    )
  }

  if (error || !product) {
    return (
      <>
        <SEO
          title="Product Not Found | Shiwani Collection"
          description="This product is unavailable. Browse the collection to find other styles."
          canonicalPath={`/product/${id}`}
          noindex
        />
        <section className="mx-auto max-w-5xl py-16 text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-[#9f2089]">Product unavailable</p>
          <h1 className="mt-2 text-2xl font-semibold text-gray-900">We couldn’t find that item.</h1>
          <Link to="/product" className="mt-5 inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4">
            <ArrowLeft className="size-4" /> Browse products
          </Link>
        </section>
      </>
    )
  }

  const message = `Hi, I'm interested in ${product.name}.`
  const inStock = product.quantity > 0
  const productUrl = `https://shiwani-collection.vercel.app/product/${product.id}`
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.image ? [product.image] : undefined,
    brand: {
      "@type": "Brand",
      name: "Shiwani Collection",
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "INR",
      price: product.price,
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  }

  return (
    <>
    <SEO
      title={`${product.name} | Shiwani Collection`}
      description={`View ${product.name} from Shiwani Collection. Check availability and enquire directly.`}
      canonicalPath={`/product/${product.id}`}
      image={product.image}
      structuredData={structuredData}
    />
    <section className="mx-auto max-w-5xl py-5 sm:py-8">
      <Link to="/product" className="mb-5 inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-950">
        <ArrowLeft className="size-4" /> All products
      </Link>
      <div className="grid items-start gap-7 md:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.9fr)] md:gap-12">
        <div className="flex aspect-4/5 max-h-170 items-center justify-center overflow-hidden rounded-sm bg-[#f5f3f0]">
          {product.image ? (
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <p className="px-5 text-center text-sm text-gray-400">Image coming soon</p>
          )}
        </div>

        <div className="md:sticky md:top-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9f2089]">Siwani Collection</p>
          <h1 className="mt-3 text-2xl font-semibold leading-tight text-gray-950 sm:text-3xl">{product.name}</h1>
          <p className="mt-4 text-xl font-semibold text-gray-950">{formatPrice(product.price)}</p>
          <p className={`mt-3 text-sm ${inStock ? "text-emerald-700" : "text-gray-500"}`}>
            {inStock ? "Available" : "Currently unavailable"}
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
            <a
              href={getWhatsAppUrl(message)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-sm bg-[#16874c] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#116d3c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16874c] focus-visible:ring-offset-2"
            >
              <MessageCircle className="size-4" /> WhatsApp enquiry
            </a>
            {storePhone ? (
              <a
                href={`tel:+${storePhone}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-sm border border-gray-300 px-4 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
              >
                <Phone className="size-4" /> Call to enquire
              </a>
            ) : (
              <p className="flex min-h-12 items-center justify-center gap-2 rounded-sm border border-gray-200 px-4 text-center text-sm text-gray-500">
                <Phone className="size-4" /> Call option unavailable
              </p>
            )}
          </div>
          <p className="mt-6 border-t border-gray-200 pt-5 text-sm leading-6 text-gray-600">
            Contact us to ask about this product, availability, and ordering.
          </p>
        </div>
      </div>
    </section>
    </>
  )
}

export default ProductDetail