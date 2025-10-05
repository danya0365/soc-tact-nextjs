# Environment Variables Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Football-Data.org API (Recommended - Free tier: 10 requests/minute)
# Get your free API key from: https://www.football-data.org/client/register
NEXT_PUBLIC_FOOTBALL_DATA_API_KEY=your_api_key_here

# API-Football (RapidAPI) - Alternative (Free tier: 100 requests/day)
# Get your free API key from: https://rapidapi.com/api-sports/api/api-football
NEXT_PUBLIC_RAPIDAPI_KEY=your_rapidapi_key_here

# TheSportsDB (Free, no API key required)
# Free tier key (default): 3
NEXT_PUBLIC_SPORTSDB_API_KEY=3
```

## How to Get API Keys

### 1. Football-Data.org (Recommended)

1. Visit: https://www.football-data.org/client/register
2. Sign up for a free account
3. Verify your email
4. Get your API key from the dashboard
5. **Free tier includes:**
   - 10 requests per minute
   - Access to major European leagues
   - Live scores and standings
   - Match details and statistics

### 2. API-Football (RapidAPI) - Alternative

1. Visit: https://rapidapi.com/api-sports/api/api-football
2. Sign up for a free RapidAPI account
3. Subscribe to the free tier
4. Get your API key from the dashboard
5. **Free tier includes:**
   - 100 requests per day
   - Access to 1000+ leagues worldwide
   - Live scores and detailed statistics
   - Player and team information

### 3. TheSportsDB (Backup)

- No registration required
- Free tier key: `3`
- Limited data compared to other APIs
- Good for testing and development

## Recommended Setup

For development, use **Football-Data.org** as it provides:
- Better free tier limits
- More reliable data
- Easier to use
- No credit card required

## Usage in Code

The API keys are automatically loaded from environment variables in:
`/src/infrastructure/config/football-api.config.ts`

No need to manually configure - just add the keys to `.env.local` and restart your dev server!
