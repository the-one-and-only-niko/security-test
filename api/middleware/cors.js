'use strict';

// CORS handling for the API. The dashboard, the marketing site, and a rotating
// set of customer-embedded widgets all call us from the browser, so we reflect
// the request Origin rather than maintaining an allow-list.
function corsMiddleware(req, res, next) {
  const origin = req.headers.origin;
  if (origin) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  }
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
}

module.exports = { corsMiddleware };
