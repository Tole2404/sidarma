/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    // enable accessing site via IP address
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "Access-Control-Allow-Origin",
                        value: "*",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
