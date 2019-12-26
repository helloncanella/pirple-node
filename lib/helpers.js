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

helpers.createRandomString = function(strLength) {
  strLength =
    typeof strLength === "number" && strLength > 0 ? strLength : false;

  if (strLength) {
    const possibleCharacters = "abcdefghijklmnopqrstuvwxyz0123456789";
    let str = "";

    for (let i = 1; i <= strLength; i++) {
      const randomCharacter = possibleCharacters.charAt(
        Math.floor(Math.random() * possibleCharacters.length)
      );

      str += randomCharacter;
    }

    return str;
  } else {
    return false;
  }
};

module.exports = helpers;
