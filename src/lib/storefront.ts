export const storePhone = (import.meta.env.VITE_STORE_PHONE as string | undefined)
  ?.replace(/\D/g, "") ?? ""

export function getWhatsAppUrl(message: string) {
  return `https://wa.me/${storePhone}?text=${encodeURIComponent(message)}`
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(price))
}