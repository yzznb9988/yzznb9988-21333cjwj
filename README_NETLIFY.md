Netlify Function: license verify

This folder contains a minimal Netlify Function that verifies license codes.

Files:
- `netlify.toml` - tells Netlify where functions live
- `functions/verify.js` - POST endpoint that accepts JSON { code: "..." } and returns JSON { ok, expiresAt, message }

How to deploy
1. Push this repository to GitHub (or a Git provider) and connect the repo to Netlify.  
2. In Netlify site settings, set an environment variable `LICENSE_CODES` with comma-separated valid codes, e.g. `78781,78789,78782`.  
3. Netlify will build and deploy functions automatically. The function URL will be:
   `https://<your-site>.netlify.app/.netlify/functions/verify`

Testing locally
- Install Netlify CLI: `npm install -g netlify-cli`
- Run: `netlify dev` in repository root, then POST to:
  `http://localhost:8888/.netlify/functions/verify`

Security notes
- The environment variable approach requires a redeploy to change values. For instant control consider using a small hosted DB or API.  
- Access-Control-Allow-Origin is set to `*` by default here so the extension can access it. You can restrict to specific origins in production.


