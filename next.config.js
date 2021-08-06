module.exports = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        crypto: require.resolve('crypto-browserify'),
        fs: false,
        path: false,
        stream: false
      }
    }

    return config
  }
}
