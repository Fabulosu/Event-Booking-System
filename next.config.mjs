/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_PUBLIC_GOOGLE_MAPS_API: process.env.GOOGLE_MAPS_API,
    },
};

export default nextConfig;
