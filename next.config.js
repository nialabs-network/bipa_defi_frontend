const nextConfig = {
  reactStrictMode: false,
  images: {
    loader: "akamai",
    path: process.env.NEXT_PUBLIC_IMG_URL,
  },
};

module.exports = nextConfig;
