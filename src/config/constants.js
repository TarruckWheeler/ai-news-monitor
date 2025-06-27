// Risk Keywords Configuration
export const RISK_KEYWORDS = {
  critical: [
    'tariff', 'Trump', 'election', 'Supreme Court', 'Arizona', 'voting', 'deepfake',
    'misinformation', 'disinformation', 'EU retaliation', 'trade war', 'constitutional crisis',
    'emergency', 'breaking', 'urgent', 'alert', 'warning'
  ],
  high: [
    'AI bias', 'GPT', 'Claude', 'Gemini', 'Meta', 'regulation', 'FTC', 'EU AI Act',
    'political', 'campaign', 'primary', 'Congress', 'Senate', 'governor', 'Macron',
    'investigation', 'lawsuit', 'violation'
  ],
  medium: [
    'policy', 'technology', 'social media', 'platform', 'content moderation',
    'safety', 'ethics', 'research', 'academic', 'study', 'report',
    'update', 'announcement', 'development'
  ]
};

// Refresh intervals (in seconds)
export const REFRESH_INTERVALS = {
  FAST: 30,
  NORMAL: 60,
  SLOW: 300
};

// Notification settings
export const NOTIFICATION_SETTINGS = {
  CRITICAL_ONLY: 'critical',
  HIGH_AND_CRITICAL: 'high',
  ALL: 'all',
  NONE: 'none'
};
