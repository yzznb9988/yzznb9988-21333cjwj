Netlify Function: license verify

This folder contains a minimal Netlify Function that verifies license codes.

Files:
- `netlify.toml` - tells Netlify where functions live
- `functions/verify.js` - POST endpoint that accepts JSON { code: "..." } and returns JSON { ok, expiresAt, message }

How to deploy
1. Push this repository to GitHub (or a Git provider) and connect the repo to Netlify.  
2. In Netlify site settings, set an environment variable `ACTIVE_LICENSE_CODES` with comma-separated valid new codes, e.g. `SP2-78781,SP2-78789,SP2-78782`.
   - Old variable `LICENSE_CODES` is intentionally ignored. Keeping old leaked codes there will not make them valid.
   - By default, valid codes must start with `SP2-`. You can change this by setting `REQUIRED_LICENSE_PREFIX`, or set it to an empty value to disable the prefix rule.
   - To temporarily make all codes invalid, set `LICENSE_DISABLED=true`.
3. Netlify will build and deploy functions automatically. The function URL will be:
   `https://<your-site>.netlify.app/.netlify/functions/verify`

Testing locally
- Install Netlify CLI: `npm install -g netlify-cli`
- Run: `netlify dev` in repository root, then POST to:
  `http://localhost:8888/.netlify/functions/verify`

Security notes
- This function revokes the old `LICENSE_CODES` batch by ignoring that environment variable completely.
- If no `ACTIVE_LICENSE_CODES` are configured, every code is rejected.
- The environment variable approach requires a redeploy to change values. For instant control consider using a small hosted DB or API.
- Access-Control-Allow-Origin is set to `*` by default here so the extension can access it. You can restrict to specific origins in production.



