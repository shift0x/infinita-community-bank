module.exports = {
     webpack: {
       configure: (webpackConfig) => {
         webpackConfig.resolve.fallback = {
           ...webpackConfig.resolve.fallback,
           stream: require.resolve('stream-browserify'),
           http: require.resolve("stream-http"),
           https: require.resolve("https-browserify"),
           zlib: require.resolve("browserify-zlib")
         };
         return webpackConfig;
       },
     },
   };