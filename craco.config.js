const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    configure: (webpackConfig) => {
      if (process.env.NODE_ENV === 'production') {
        // Đảm bảo public path đúng cho Liferay khi build
        webpackConfig.output.publicPath = '/o/liferay-react-fragment/';
      }

      return webpackConfig;
    },
  },
};
