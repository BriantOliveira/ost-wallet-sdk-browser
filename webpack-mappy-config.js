String.prototype.trimRight = function(charlist) {
  if (charlist === undefined)
    charlist = "\s";

  return this.replace(new RegExp("[" + charlist + "]+$"), "");
};

const configBuilder = (OST_TOKEN_ID, DEMO_MAPPY_UI_API_ENDPOINT, OST_BROWSER_SDK_PLATFORM_API_ENDPOINT, OST_BROWSER_SDK_IFRAME_ORIGIN) => {
  const sdkVersion = process.env.OST_BROWSER_SDK_VERSION || "";

  let OstSdkIframeUrl = OST_BROWSER_SDK_IFRAME_ORIGIN;
  OstSdkIframeUrl = OstSdkIframeUrl.trimRight("/");

  if ( sdkVersion && sdkVersion.length ) {
      OstSdkIframeUrl = OstSdkIframeUrl + "/" + sdkVersion;
  }
  OstSdkIframeUrl = OstSdkIframeUrl.trimRight("/");
  OstSdkIframeUrl = OstSdkIframeUrl + "/index.html";

  // Global Vars
  let GC_VARS = {
    "OST_BROWSER_SDK_PLATFORM_API_ENDPOINT": OST_BROWSER_SDK_PLATFORM_API_ENDPOINT,
    "OST_TOKEN_ID": OST_TOKEN_ID,
    "DEMO_MAPPY_UI_API_ENDPOINT": DEMO_MAPPY_UI_API_ENDPOINT,
    "OST_BROWSER_SDK_IFRAME_URL": OstSdkIframeUrl
  };

  // Entity
  const entry = {};

  const eMap = {
    "users": "mappy-js-" + OST_TOKEN_ID + "/users",
    "login": "mappy-js-" + OST_TOKEN_ID + "/login",
    "json_api": "mappy-js-" + OST_TOKEN_ID + "/json_api",
    "sdk_getters": "mappy-js-" + OST_TOKEN_ID + "/sdk_getters",
  }

  entry[ eMap.users ]       = './src/Mappy/js/users-new.js';
  entry[ eMap.login ]       = './src/Mappy/js/login.js';
  entry[ eMap.json_api ]    = './src/Mappy/js/json-api-new.js';
  entry[ eMap.sdk_getters ] = './src/Mappy/js/sdk-getter-new.js';


  const htmlPrefix = "../mappy-" + OST_TOKEN_ID;
  const produtionHtmlPlugins = [
      /* http://devmappy.com/index.html  */
      {
          GC_VARS: JSON.stringify(GC_VARS),
          title: "Login - Demo Mappy Web UI",
          template: "./src/Mappy/html/login.html",
          inject: true,
          filename: htmlPrefix + "/index.html",
          chunks: [eMap.login, 'OstWalletSdk']
      },

      /* http://devmappy.com/login.html  */
      {
          GC_VARS: JSON.stringify(GC_VARS),
          title: "Login - Demo Mappy Web UI",
          template: "./src/Mappy/html/login.html",
          inject: true,
          filename: htmlPrefix + "/login.html",
          chunks: ['OstWalletSdk', eMap.login]
      },

      /* http://devmappy.com/users.html  */
      {
          GC_VARS: JSON.stringify(GC_VARS),
          title: "Users List - Demo Mappy Web UI",
          template: "./src/Mappy/html/users-new.html",
          inject: true,
          filename: htmlPrefix + "/users.html",
          chunks: [eMap.users, 'OstWalletSdk']
      },

      /* http://devmappy.com/sdk-getters.html  */
      {
          GC_VARS: JSON.stringify(GC_VARS),
          title: "Sdk Getter Methods - Demo Mappy Web UI",
          template: "./src/Mappy/html/sdk-getters-new.html",
          inject: true,
          filename: htmlPrefix + "/sdk-getters.html",
          chunks: [eMap.sdk_getters, 'OstWalletSdk']
      },

      /* http://devmappy.com/json-api.html  */
      {
          GC_VARS: JSON.stringify(GC_VARS),
          title: "JSON API Methods - Demo Mappy Web UI",
          template: "./src/Mappy/html/json-api-new.html",
          inject: true,
          filename: htmlPrefix + "/json-api.html",
          chunks: [eMap.json_api, 'OstWalletSdk']
      }
  ];

  let devHtmlPlugins = [];
  // Copy and modify prod config.
  let len = produtionHtmlPlugins.length;
  while(len--) {
    let conf = produtionHtmlPlugins[ len ];
    // Clone it.
    conf = Object.assign({}, conf);

    // Process it.
    if ( conf.filename && conf.filename.startsWith( htmlPrefix ) ) {
      let newFileName = conf.filename.replace(htmlPrefix, "mappy");
      conf.filename = newFileName;
    }

    // Add it.
    devHtmlPlugins.push( conf )
  }
  const webpackDefinations = null;

  return {
    "prod": {
      "entry": entry,
      "htmlPlugins": produtionHtmlPlugins,
      "webpackDefinations": webpackDefinations
    },

    "dev": {
      "entry": entry,
      "htmlPlugins": devHtmlPlugins,
      "webpackDefinations": webpackDefinations
    }
  };

}

module.exports = configBuilder;
