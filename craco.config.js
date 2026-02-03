module.exports = {
    webpack: {
      configure: (webpackConfig) => {
        // Đảm bảo public path đúng cho Liferay
        webpackConfig.output.publicPath = '/o/liferay-react-fragment/';
        
        return webpackConfig;
      },
    },
  };