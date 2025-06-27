# AI Risk News Monitor - API Documentation

## Overview

Created by **Tarruck Wheeler** at Stanford University

This application currently uses simulated news data but can be extended to use real APIs.

## Future API Integration Points

### News Sources
- NewsAPI.org
- CurrentsAPI
- GNews API
- Bing News Search API

### Configuration

To add real news sources, update `src/config/api.js`:

```javascript
export const API_CONFIG = {
  NEWS_API_KEY: process.env.REACT_APP_NEWS_API_KEY,
  REFRESH_INTERVAL: 60000, // 1 minute
  MAX_ARTICLES: 100
};
cat > API.md << 'EOF'
# AI Risk News Monitor - API Documentation

## Overview

Created by **Tarruck Wheeler** at Stanford University

This application currently uses simulated news data but can be extended to use real APIs.

## Future API Integration Points

### News Sources
- NewsAPI.org
- CurrentsAPI
- GNews API
- Bing News Search API

### Configuration

To add real news sources, update `src/config/api.js`:

```javascript
export const API_CONFIG = {
  NEWS_API_KEY: process.env.REACT_APP_NEWS_API_KEY,
  REFRESH_INTERVAL: 60000, // 1 minute
  MAX_ARTICLES: 100
};
{
  id: string,
  title: string,
  source: string,
  severity: 'critical' | 'high' | 'medium',
  timestamp: Date,
  summary: string,
  tags: string[],
  url: string,
  trustScore: number,
  bias: string
}
#### **4️⃣ Fix Package.json Author**

```bash
cat > package-update.json << 'EOF'
{
  "name": "ai-risk-news-monitor",
  "version": "1.0.0",
  "description": "Real-time AI bias risk monitoring dashboard",
  "author": "Tarruck Wheeler <tarruck@stanford.edu>",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/TarruckWheeler/ai-news-monitor.git"
  }
}
