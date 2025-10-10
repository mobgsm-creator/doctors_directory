
const nextConfig = {
  /* config options here */
    images: {
      
      formats: ["image/avif", "image/webp"], // enable AVIF + WebP
      minimumCacheTTL: 60 * 60 * 24 * 365,

    domains: ['www.jccp.org.uk', 'lh3.googleusercontent.com','www.doctify.com','cdn.doctify.com','streetviewpixels-pa.googleapis.com'],
    
  }
};

export default nextConfig;
