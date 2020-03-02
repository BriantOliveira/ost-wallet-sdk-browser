const zlib = require('zlib');
require('../utils/helpers');
const config = require("../config.json");
const errorLogger = require("../utils/error_logger");
const cspParts = [];


/**
 * Key Manager Response Handler
 * Adds Content Security Policy Headers to the response and triggers callback. 
 * The Caller must ensure this request is serving km-[mappy] resource.
 * 
 * @param  {Function} callback      As provided by the lambda function
 * @param  {[type]}   response      response object as present in event of lambda function.
 * @param  {[type]}   requestOrigin Origin of the request.
 * @param  {[type]}   requestPath   Path of the resource requested.
 * @return {null}                   Null.
 */
module.exports = (callback, response, requestOrigin, requestPath ) => {

  // Prepare response headers.
  response.headers = response.headers || {};

  // Add CSP (Content Security Policy) Header Parts.
  addCSPPart("default-src 'none';");
  addCSPPart("base-uri 'none';");
  addCSPPart("block-all-mixed-content;");

  // Determine the path to JS file.
  let jsFilePath = requestPath.replace("/index.html", "/ost-sdk-key-manager-script.js");
  let jsOrigin = String( config.JS_ORIGIN );
  // Remove right side back-slash
  jsOrigin   = jsOrigin.trimRight("/");

  // Remove left side back-slash
  jsFilePath = jsFilePath.trimLeft("/");

  // Join origin and path.
  jsFilePath = jsOrigin + "/" + jsFilePath;

  // Set the script-src header.
  addCSPPart(`script-src ${jsFilePath}`);

  // Set Content Security Policy Headers.
  response.headers['content-security-policy'] = [{
    key: "Content-Security-Policy",
    value: cspParts.join("; ")
  }];

  // Set strict-transport-security header.
  response.headers['strict-transport-security'] = [{
    key: 'Strict-Transport-Security', 
    value: 'max-age=63072000; includeSubdomains; preload'
  }];

  // Add nosniff header.
  response.headers['x-content-type-options'] = [{
    key: 'X-Content-Type-Options', 
    value: 'nosniff'
  }];

  // Add xss protection header.
  response.headers['x-xss-protection'] = [{
    key: 'X-XSS-Protection', 
    value: '1; mode=block'
  }];

  callback(null, response);
};


const addCSPPart = ( part ) => {
  let cleanedPart = String( part ).trimRight(";");
  cleanedPart = cleanedPart.toLowerCase();
  cspParts.push( cleanedPart );
};