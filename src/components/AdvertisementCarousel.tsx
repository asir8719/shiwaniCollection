import { useEffect, useState } from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel"
import { supabase } from "@/lib/supabaseClient"
import Autoplay from "embla-carousel-autoplay"

interface Advertisement {
    id: number
    title: string
    banner_url: string
    target_url: string | null
    placement: string
    start_date: string
    end_date: string
    is_active: boolean
}

const AdvertisementCarousel = () => {
    const [carouselItems, setCarouselItems] = useState<Advertisement[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchActiveBanners() {
            const nowISO = new Date().toISOString()

            const { data, error } = await supabase
                .from("advertisements")
                .select("*")
                .eq("is_active", true)
                .eq("placement", "homepage_hero")
                .lte("start_date", nowISO)
                .gte("end_date", nowISO)
                .order("created_at", { ascending: false })

            if (error) {
                console.error("Failed to load marketing banners:", error.message)
            } else {
                setCarouselItems(data || [])
            }
            setLoading(false)
        }

        fetchActiveBanners()
    }, [])

    if (loading) {
        return <div className="w-full h-[300px] sm:h-[450px] bg-gray-100 animate-pulse rounded-xl" />
    }

    if (carouselItems.length === 0) return null
    
    return (
        <section className="wContainer py-4">
            <Carousel 
                className="w-full overflow-hidden rounded-xl border border-gray-100 shadow-sm"
                // 🏆 Automatically rotates banners every 5 seconds for a premium e-commerce look
                plugins={[
                Autoplay({
                    delay: 5000,
                    stopOnInteraction: false,
                }),
                ]}
            >
                <CarouselContent className="-ml-0">
                {carouselItems.map((ad) => (
                    <CarouselItem key={ad.id} className="pl-0">
                    {/* If a target link exists, wrap the banner image inside an anchor tag */}
                    {ad.target_url ? (
                        <a href={ad.target_url} className="block w-full group overflow-hidden">
                        <img 
                            src={ad.banner_url} 
                            alt={ad.title} 
                            className="w-full h-[200px] sm:h-[400px] lg:h-[480px] object-cover transition-transform duration-700 group-hover:scale-[1.02]" 
                        />
                        </a>
                    ) : (
                        <img 
                        src={ad.banner_url} 
                        alt={ad.title} 
                        className="w-full h-[200px] sm:h-[400px] lg:h-[480px] object-cover" 
                        />
                    )}
                    </CarouselItem>
                ))}
                </CarouselContent>
                
                {/* Render navigation triggers only if there's more than 1 banner configuration row */}
                {carouselItems.length > 1 && (
                <>
                    <CarouselPrevious className="left-4 bg-white/80 hover:bg-white text-gray-900 border-none shadow backdrop-blur-xs" />
                    <CarouselNext className="right-4 bg-white/80 hover:bg-white text-gray-900 border-none shadow backdrop-blur-xs" />
                </>
                )}
            </Carousel>
        </section>
    )
}

export default AdvertisementCarousel