// Netlify Function: verify
// POST JSON { "code": "..." } -> returns { ok: boolean, expiresAt?: number, message?: string }

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

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const code = (body.code || "").trim();
    if (!code) {
      return { statusCode: 400, headers, body: JSON.stringify({ ok: false, message: "missing code" }) };
    }

    // LICENSE_CODES is an environment variable you set in Netlify (comma separated codes)
    const raw = process.env.LICENSE_CODES || "";
    const allowed = raw.split(",").map((s) => s.trim()).filter(Boolean);

    const ok = allowed.includes(code);
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


