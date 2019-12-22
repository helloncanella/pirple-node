const crypto = require("crypto");
const helpers = {};
const config = require("./config");

//create a SHA256 hash

helpers.hash = function(str) {
  if (typeof str === "string" && str.length > 0) {
    const hash = crypto
      .createHmac("sha256", config.hashingSecret)
      .update(str)
      .digest("hex");

    return hash;
  } else {
    return false;
  }
};

helpers.parseJSONToObject = function(str) {
  try {
    const obj = JSON.parse(str);
    return obj;
  } catch (e) {
    console.error(e);
    return {};
  }
};

module.exports = helpers;
