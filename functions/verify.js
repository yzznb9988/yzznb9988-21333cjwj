// Netlify Function: verify
// POST JSON { "code": "..." } -> returns { ok: boolean, expiresAt?: number, message?: string }
//
// Security note:
// - The old LICENSE_CODES environment variable is intentionally ignored.
//   Leaving old codes there will NOT keep them valid.
// - New valid codes must be placed in ACTIVE_LICENSE_CODES.
// - By default, new codes must start with SP2- so legacy short/simple codes fail.

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ ok: false, message: "method not allowed" }),
    };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const code = (body.code || "").trim();
    if (!code) {
      return { statusCode: 400, headers, body: JSON.stringify({ ok: false, message: "missing code" }) };
    }

    const disabled = String(process.env.LICENSE_DISABLED || "").toLowerCase() === "true";
    if (disabled) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ ok: false, message: "license service disabled" }),
      };
    }

    // Do NOT use LICENSE_CODES here. That variable was used by the leaked old build.
    // Keep old codes in Netlify if you want, but they are treated as revoked.
    const raw = process.env.ACTIVE_LICENSE_CODES || "";
    const requiredPrefix = process.env.REQUIRED_LICENSE_PREFIX || "SP2-";
    const allowed = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const hasRequiredPrefix = !requiredPrefix || code.startsWith(requiredPrefix);
    const ok = hasRequiredPrefix && allowed.includes(code);
    const expiresAt = ok ? Date.now() + 60 * 60 * 1000 : null; // example: 1 hour

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok, expiresAt, message: ok ? "ok" : "invalid" }),
    };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ ok: false, message: e.message }) };
  }
};



