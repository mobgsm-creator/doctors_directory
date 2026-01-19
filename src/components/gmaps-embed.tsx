"use client"

interface GoogleMapsEmbedProps {
  url: string
  width?: string
  height?: string
  className?: string
}

export function GoogleMapsEmbed({ url, width = "100%", height = "450", className = "" }: Readonly<GoogleMapsEmbedProps>) {

  const getEmbedUrl = (mapsUrl: string): string => {
    try {
      // Extract place ID from the URL if it exists
      const placeIdMatch = mapsUrl.match(/!1s(0x[a-f0-9]+:0x[a-f0-9]+)/)

      if (placeIdMatch) {
        const placeId = placeIdMatch[1]
        return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2000!2d0!3d0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s${placeId}!2s!5e0!3m2!1sen!2s!4v1234567890!5m2!1sen!2s`
      }

      // Alternative: extract coordinates if available
      const coordMatch = mapsUrl.match(/3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/)
      if (coordMatch) {
        const [, lat, lng] = coordMatch
        return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d2000!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2s!4v1234567890!5m2!1sen!2s`
      }

      // Fallback: try to convert the URL directly
      return mapsUrl.replace("/place/", "/embed/v1/place?key=").replace(/\?.*$/, "")
    } catch (error) {
      console.error("Error parsing Google Maps URL:", error)
      return ""
    }
  }

  const embedUrl = getEmbedUrl(url)

  if (!embedUrl) {
    return (
      <div className="flex items-center justify-center bg-muted p-8 rounded-lg">
        <p className="text-muted-foreground">Invalid Google Maps URL</p>
      </div>
    )
  }

  return (
    <div className={className}>
      <iframe
        src={embedUrl}
        width={width}
        height={height}
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Google Maps"
        className="rounded-lg"
      />
    </div>
  )
}