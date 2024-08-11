/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '**'
      }
    ]
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      console.log('Applying client-side fallbacks');
      config.resolve.fallback = {
        crypto: require.resolve('crypto-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
      };

      // Add polyfills to the entry point
      const originalEntry = config.entry;
      config.entry = async () => {
        const entries = await originalEntry();
        if (entries['main.js']) {
          entries['main.js'].unshift(
            require.resolve('crypto-browserify'),
            require.resolve('stream-http'),
            require.resolve('https-browserify')
          );
        }
        return entries;
      };
    }

    return config;
  },
}