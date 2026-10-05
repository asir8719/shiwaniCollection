import { useEffect } from "react"

export const SITE_URL = "https://shiwani-collection.vercel.app"
const DEFAULT_IMAGE = `${SITE_URL}/favicon.png`

interface SEOProps {
  title: string
  description: string
  canonicalPath: string
  image?: string | null
  noindex?: boolean
  structuredData?: Record<string, unknown>
}

function setMeta(attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)
  if (!element) {
    element = document.createElement("meta")
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.content = content
}

export default function SEO({
  title,
  description,
  canonicalPath,
  image,
  noindex = false,
  structuredData,
}: SEOProps) {
  useEffect(() => {
    const canonicalUrl = new URL(canonicalPath, SITE_URL).toString()
    const imageUrl = image ? new URL(image, SITE_URL).toString() : DEFAULT_IMAGE

    document.title = title
    setMeta("name", "description", description)
    setMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow")
    setMeta("property", "og:type", "website")
    setMeta("property", "og:site_name", "Shiwani Collection")
    setMeta("property", "og:title", title)
    setMeta("property", "og:description", description)
    setMeta("property", "og:url", canonicalUrl)
    setMeta("property", "og:image", imageUrl)
    setMeta("property", "og:image:alt", "Shiwani Collection")
    setMeta("name", "twitter:card", "summary_large_image")
    setMeta("name", "twitter:title", title)
    setMeta("name", "twitter:description", description)
    setMeta("name", "twitter:image", imageUrl)

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement("link")
      canonical.rel = "canonical"
      document.head.appendChild(canonical)
    }
    canonical.href = canonicalUrl

    let structuredDataElement = document.getElementById("page-structured-data")
    if (structuredData) {
      if (!structuredDataElement) {
        const script = document.createElement("script")
        script.type = "application/ld+json"
        script.id = "page-structured-data"
        document.head.appendChild(script)
        structuredDataElement = script
      }
      structuredDataElement.textContent = JSON.stringify(structuredData)
    } else {
      structuredDataElement?.remove()
    }
  }, [canonicalPath, description, image, noindex, structuredData, title])

  return null
}
