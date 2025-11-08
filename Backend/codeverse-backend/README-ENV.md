# Backend environment variables

Set the following environment variables before running the backend. Example values are placeholders.

Required:
- APP_JWT_SECRET: hex-encoded 256-bit key (64 hex chars). Example: `A4B5...` (do not use this in prod)
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- GITHUB_CLIENT_ID
- GITHUB_CLIENT_SECRET

Optional (defaults shown):
- APP_JWT_EXPIRATION_MS=86400000
- GOOGLE_REDIRECT_URI=http://localhost:8081/login/oauth2/code/google
- GITHUB_REDIRECT_URI=http://localhost:8081/login/oauth2/code/github

Mac/Linux (zsh/bash):
```bash
export APP_JWT_SECRET="<64-hex-chars>"
export GOOGLE_CLIENT_ID="<id>"
export GOOGLE_CLIENT_SECRET="<secret>"
export GITHUB_CLIENT_ID="<id>"
export GITHUB_CLIENT_SECRET="<secret>"
# optional overrides
export APP_JWT_EXPIRATION_MS=86400000
export GOOGLE_REDIRECT_URI="http://localhost:8081/login/oauth2/code/google"
export GITHUB_REDIRECT_URI="http://localhost:8081/login/oauth2/code/github"
```

Windows (PowerShell):
```powershell
$env:APP_JWT_SECRET = "<64-hex-chars>"
$env:GOOGLE_CLIENT_ID = "<id>"
$env:GOOGLE_CLIENT_SECRET = "<secret>"
$env:GITHUB_CLIENT_ID = "<id>"
$env:GITHUB_CLIENT_SECRET = "<secret>"
# optional
$env:APP_JWT_EXPIRATION_MS = "86400000"
$env:GOOGLE_REDIRECT_URI = "http://localhost:8081/login/oauth2/code/google"
$env:GITHUB_REDIRECT_URI = "http://localhost:8081/login/oauth2/code/github"
```

Notes:
- The JWT secret must be a hex string; the code decodes it and uses HMAC-SHA.
- Redirect URIs must match those configured in the Google and GitHub developer consoles.
