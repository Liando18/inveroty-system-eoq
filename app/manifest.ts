export default function manifest() {
  return {
    name: "4Yos Veterinary Care",
    short_name: "4YosApp",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#11df86",
    icons: [
      {
        src: "/icon192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
