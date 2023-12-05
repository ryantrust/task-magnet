const https = require("https");

async function getUserIdFromReq(req) {
  var options = {
    host: process.env.REACT_APP_AUTH0_DOMAIN,
    port: 443,
    path: "/userinfo",
    // authentication headers
    headers: {
      Authorization: req.headers.authorization,
    },
  };
  return new Promise((resolve, reject) => {
    request = https.get(options, function (resp) {
      // console.log(`statusCode: ${resp.statusCode}`)
      let responseData = "";
      resp.on("data", (d) => {
        responseData += d.toString();
      });
      resp.on("end", () => {
        const parsed = JSON.parse(responseData);
        console.log(JSON.parse(responseData));
        resolve(parsed.sub);
      });
    });

    request.on("error", (error) => {
      reject(error);
    });
  });
}

module.exports = { getUserIdFromReq };
