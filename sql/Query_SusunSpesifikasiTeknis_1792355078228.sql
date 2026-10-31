expected_signature = "sha256=" + HMAC_SHA256(raw_request_body, APP_SECRET)
if signature_header != expected_signature:
    return HTTP 401 Unauthorized