/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler: {
        styledComponents: true
    },
    webpack: config => {
        config.resolve.fallback = {
            fs: false,
        };

        return config;
    },
};

export default nextConfig;
