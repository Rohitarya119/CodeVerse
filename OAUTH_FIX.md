# OAuth Authentication Fix

## Problem
Google OAuth authentication was not working because URLs were hardcoded to `localhost`, which doesn't work when:
- Accessing from a different machine
- Running in Docker containers
- Using different ports

## Solution
Made OAuth redirect URLs configurable via environment variables.

## Changes Made

1. **AuthRedirectController.java** - Now uses `BACKEND_BASE_URL` environment variable
2. **OAuth2SuccessHandler.java** - Now uses `FRONTEND_BASE_URL` environment variable
3. **docker-compose.yml** - Added environment variables with defaults

## Configuration

### For Docker (Default)
The docker-compose.yml now sets:
- `BACKEND_BASE_URL=http://localhost:8081` (default)
- `FRONTEND_BASE_URL=http://localhost` (default)

### For Different Environments

If your friend is accessing from a different machine or using different ports, they can:

1. **Create a `.env` file** in the project root:
```env
BACKEND_BASE_URL=http://YOUR_IP_OR_DOMAIN:8081
FRONTEND_BASE_URL=http://YOUR_IP_OR_DOMAIN
GOOGLE_REDIRECT_URI=http://YOUR_IP_OR_DOMAIN:8081/login/oauth2/code/google
GITHUB_REDIRECT_URI=http://YOUR_IP_OR_DOMAIN:8081/login/oauth2/code/github
```

2. **Or set environment variables** before running docker-compose:
```bash
export BACKEND_BASE_URL="http://localhost:8081"
export FRONTEND_BASE_URL="http://localhost"
docker-compose up --build
```

## Important: Google OAuth Console Configuration

**CRITICAL**: The redirect URI in Google OAuth Console must match exactly!

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** > **Credentials**
3. Find your OAuth 2.0 Client ID
4. Add these **Authorized redirect URIs**:
   - `http://localhost:8081/login/oauth2/code/google`
   - `http://YOUR_IP:8081/login/oauth2/code/google` (if accessing from network)
   - `http://YOUR_DOMAIN:8081/login/oauth2/code/google` (if using a domain)

## Testing

1. Rebuild the backend container:
```bash
docker-compose build backend
docker-compose up -d backend
```

2. Test Google OAuth:
   - Go to http://localhost (or your configured frontend URL)
   - Click "Sign in with Google"
   - Should redirect properly

## Troubleshooting

### OAuth still not working?

1. **Check Google OAuth Console**:
   - Make sure redirect URI is exactly: `http://localhost:8081/login/oauth2/code/google`
   - Check that Client ID and Secret are correct

2. **Check environment variables**:
```bash
docker-compose exec backend env | grep -E "BACKEND_BASE_URL|FRONTEND_BASE_URL|GOOGLE"
```

3. **Check backend logs**:
```bash
docker-compose logs backend | grep -i oauth
```

4. **Verify redirect URIs match**:
   - The redirect URI in Google Console must match `GOOGLE_REDIRECT_URI` environment variable
   - Both should be: `http://localhost:8081/login/oauth2/code/google` (for localhost)

### Common Issues

**Issue**: "redirect_uri_mismatch" error
- **Solution**: Add the exact redirect URI to Google OAuth Console

**Issue**: Redirects to wrong URL
- **Solution**: Check `FRONTEND_BASE_URL` environment variable matches your frontend URL

**Issue**: OAuth works but redirects to wrong page
- **Solution**: Verify `FRONTEND_BASE_URL` is set to `http://localhost` (not `http://localhost:5173`)

## Next Steps

1. Rebuild and restart containers:
```bash
docker-compose down
docker-compose up --build -d
```

2. Test OAuth authentication

3. If still having issues, check the logs and verify Google OAuth Console settings

