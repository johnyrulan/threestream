const fs = require('fs')

module.exports = {
  outputDir: 'dist',
  devServer: {
    port: 7005,
    https: {
      key: fs.readFileSync('.certs/key.pem'),
      cert: fs.readFileSync('.certs/cert.pem')
    },
    hot: true
  },
  pwa: {
    name: "JUNKIE",
    themeColor: "#e64415",
    msTileColor: "#fafafa",
    assetsVersion: '1',    
    iconPaths: {
      faviconSVG: 'img/icons/junkie-favicon.svg',
      favicon32: 'img/icons/favicon-32x32.png',
      favicon16: 'img/icons/favicon-16x16.png',
      appleTouchIcon: 'img/icons/apple-icon-152x152.png',
      maskIcon: 'img/icons/junkie-favicon.svg',
      msTileImage: 'img/icons/ms-icon-144x144.png'
    },
  }
}
