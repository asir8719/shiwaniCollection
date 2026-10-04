import { useEffect, useState } from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel"
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface Category {
  id: number
  name: string
  slug: string
  image_url: string
}

const CategoryCarousel = () => {
  const [carouselItems, setCarouselItems] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchcategories() {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug, image_url")
        .eq("is_active", true)
        .order("name", { ascending: true })
    
      if (error) {
        console.error("Failed to load carousel categories:", error.message)
        toast.error("Could not load storefront categories.")
      } else {
        setCarouselItems(data || [])
      }
      setLoading(false)
    }

    void fetchcategories()
  }, [])

  return (
    <section className="wContainer py-6" aria-labelledby="category-carousel-title">
      <h2 id="category-carousel-title" className="mb-4 text-xl font-semibold">
        Shop by category
      </h2>

      {loading ? (
        <p className="py-6 text-center text-sm text-muted-foreground" role="status">
          Loading categories...
        </p>
      ) : carouselItems.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          No active categories found.
        </p>
      ) : (
        <Carousel opts={{ align: "start", containScroll: "trimSnaps" }}>
          <CarouselContent className="-ml-3">
            {carouselItems.map((category) => (
              <CarouselItem
                key={category.id}
                className="basis-1/3 pl-3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6"
              >
                <Link
                  to={`/product?category=${encodeURIComponent(category.slug)}`}
                  className="group flex h-full flex-col items-center gap-2 rounded-md px-1 py-2 text-center transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-gray-50 shadow-inner">
                    {category.image_url ? (
                      <img
                        src={category.image_url}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <span className="text-xs font-medium uppercase text-muted-foreground">
                        {category.name.substring(0, 2)}
                      </span>
                    )}
                  </span>
                  <span className="line-clamp-2 text-sm font-medium leading-tight text-gray-900">
                    {category.name}
                  </span>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-1 hidden bg-background shadow-sm sm:inline-flex" />
          <CarouselNext className="right-1 hidden bg-background shadow-sm sm:inline-flex" />
        </Carousel>
      )}
    </section>
  )
}

export default CategoryCarousel