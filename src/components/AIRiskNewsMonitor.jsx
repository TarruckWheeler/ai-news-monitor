import React, { useState, useEffect, useRef } from 'react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { 
  AlertTriangle,
  Bell,
  BellOff,
  RefreshCw,
  Eye,
  EyeOff,
  Filter,
  Clock,
  TrendingUp,
  Zap,
  Shield,
  Globe,
  Calendar,
  Settings,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';

// Embedded risk data for intelligent news categorization
const RISK_KEYWORDS = {
  critical: [
    'tariff', 'Trump', 'election', 'Supreme Court', 'Arizona', 'voting', 'deepfake',
    'misinformation', 'disinformation', 'EU retaliation', 'trade war', 'constitutional crisis'
  ],
  high: [
    'AI bias', 'GPT', 'Claude', 'Gemini', 'Meta', 'regulation', 'FTC', 'EU AI Act',
    'political', 'campaign', 'primary', 'Congress', 'Senate', 'governor', 'Macron'
  ],
  medium: [
    'policy', 'technology', 'social media', 'platform', 'content moderation',
    'safety', 'ethics', 'research', 'academic', 'study', 'report'
  ]
};

// Simulated news sources
const NEWS_SOURCES = [
  { id: 'reuters', name: 'Reuters', trustScore: 95, bias: 'center' },
  { id: 'ap', name: 'AP News', trustScore: 94, bias: 'center' },
  { id: 'wapo', name: 'Washington Post', trustScore: 88, bias: 'center-left' },
  { id: 'politico', name: 'Politico', trustScore: 85, bias: 'center' },
  { id: 'axios', name: 'Axios', trustScore: 84, bias: 'center' },
  { id: 'techcrunch', name: 'TechCrunch', trustScore: 82, bias: 'center' },
  { id: 'wired', name: 'Wired', trustScore: 81, bias: 'center-left' },
  { id: 'ft', name: 'Financial Times', trustScore: 90, bias: 'center-right' }
];

const AIRiskNewsMonitor = () => {
  // Core state
  const [newsItems, setNewsItems] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [dyslexiaMode, setDyslexiaMode] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(60); // seconds
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [selectedFilters, setSelectedFilters] = useState({
    critical: true,
    high: true,
    medium: true,
    low: false
  });
  const [selectedSources, setSelectedSources] = useState(
    NEWS_SOURCES.reduce((acc, source) => ({ ...acc, [source.id]: true }), {})
  );
  
  // Stats state
  const [stats, setStats] = useState({
    totalToday: 0,
    criticalAlerts: 0,
    trending: [],
    lastCritical: null
  });
  
  // Refs
  const audioRef = useRef(new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF'));
  const intervalRef = useRef(null);

  // Generate realistic news based on embedded risk data
  const generateNewsItem = (id) => {
    const sources = Object.entries(selectedSources).filter(([_, enabled]) => enabled).map(([sourceId]) => sourceId);
    const sourceId = sources[Math.floor(Math.random() * sources.length)];
    const source = NEWS_SOURCES.find(s => s.id === sourceId);
    
    const templates = [
      {
        severity: 'critical',
        topics: [
          'Breaking: Trump tariff deadline approaches with major economic implications',
          'URGENT: Arizona special election sees voter suppression concerns',
          'Supreme Court decision on presidential powers imminent',
          'EU threatens immediate retaliation on US tariffs',
          'New deepfake of political figure reaches 10M views before removal'
        ]
      },
      {
        severity: 'high',
        topics: [
          'GPT-4 found generating biased political content in new study',
          'Meta faces FTC investigation over AI content policies',
          'EU AI Act enforcement deadline creates compliance scramble',
          'Campaign uses AI to generate misleading voter information',
          'Academic research reveals systematic bias in major LLMs'
        ]
      },
      {
        severity: 'medium',
        topics: [
          'Tech companies update AI safety policies ahead of elections',
          'New research on AI bias detection methods published',
          'Social media platforms enhance content moderation systems',
          'Industry group releases AI ethics guidelines',
          'University study examines political bias in chatbots'
        ]
      }
    ];
    
    const severityChoice = Math.random();
    let severity, template;
    
    if (severityChoice < 0.15) {
      severity = 'critical';
      template = templates[0];
    } else if (severityChoice < 0.45) {
      severity = 'high';
      template = templates[1];
    } else {
      severity = 'medium';
      template = templates[2];
    }
    
    const topic = template.topics[Math.floor(Math.random() * template.topics.length)];
    
    return {
      id,
      title: topic,
      source: source.name,
      sourceId: source.id,
      severity,
      timestamp: new Date(Date.now() - Math.random() * 3600000), // Within last hour
      summary: `Initial reports indicate ${topic.toLowerCase()}. This development could have significant implications for AI safety and bias monitoring. Full analysis pending.`,
      tags: extractTags(topic),
      url: '#',
      trustScore: source.trustScore,
      bias: source.bias,
      relatedRisks: severity === 'critical' ? ['Tariff Deadline', 'Election Security'] : 
                    severity === 'high' ? ['AI Bias', 'Regulation'] : ['Research', 'Policy']
    };
  };

  // Extract relevant tags from title
  const extractTags = (title) => {
    const tags = [];
    const lowerTitle = title.toLowerCase();
    
    Object.entries(RISK_KEYWORDS).forEach(([severity, keywords]) => {
      keywords.forEach(keyword => {
        if (lowerTitle.includes(keyword.toLowerCase())) {
          tags.push(keyword);
        }
      });
    });
    
    return [...new Set(tags)].slice(0, 3);
  };

  // Calculate time ago
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  // Load initial news
  useEffect(() => {
    const initialNews = Array.from({ length: 20 }, (_, i) => generateNewsItem(i));
    setNewsItems(initialNews.sort((a, b) => b.timestamp - a.timestamp));
  }, []);

  // Filter news based on selections
  useEffect(() => {
    const filtered = newsItems.filter(item => {
      const severityMatch = selectedFilters[item.severity];
      const sourceMatch = selectedSources[item.sourceId];
      return severityMatch && sourceMatch;
    });
    setFilteredNews(filtered);
    
    // Update stats
    const today = new Date().toDateString();
    const todayItems = newsItems.filter(item => item.timestamp.toDateString() === today);
    const criticalItems = newsItems.filter(item => item.severity === 'critical');
    
    setStats({
      totalToday: todayItems.length,
      criticalAlerts: criticalItems.length,
      trending: [...new Set(newsItems.flatMap(item => item.tags))].slice(0, 5),
      lastCritical: criticalItems[0]?.timestamp || null
    });
  }, [newsItems, selectedFilters, selectedSources]);

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(() => {
        addNewNewsItem();
      }, refreshInterval * 1000);
    }
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoRefresh, refreshInterval]);

  // Add new news item
  const addNewNewsItem = () => {
    const newItem = generateNewsItem(Date.now());
    setNewsItems(prev => [newItem, ...prev].slice(0, 100)); // Keep last 100
    setLastUpdate(new Date());
    
    // Alert for critical news
    if (newItem.severity === 'critical') {
      if (notifications) {
        showNotification(newItem);
      }
      if (soundEnabled && audioRef.current) {
        audioRef.current.play().catch(e => console.log('Audio play failed:', e));
      }
    }
  };

  // Show browser notification
  const showNotification = (item) => {
    try {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🔴 CRITICAL ALERT', {
          body: item.title,
          icon: '/favicon.ico',
          tag: item.id.toString()
        });
      }
    } catch (error) {
      console.log('Notification error:', error);
    }
  };

  // Request notification permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      setNotifications(permission === 'granted');
    }
  };

  // Toggle item expansion
  const toggleExpanded = (id) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Get severity color classes
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-yellow-500 text-black';
      case 'medium': return 'bg-green-500 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  // Get severity icon
  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return '🔴';
      case 'high': return '🟡';
      case 'medium': return '🟢';
      default: return '⚪';
    }
  };

  // Apply theme classes
  const getThemeClasses = () => {
    return dyslexiaMode 
      ? 'bg-black text-yellow-300 font-opendyslexic' 
      : 'bg-gray-50 text-gray-900';
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${getThemeClasses()}`}>
      <div className="container mx-auto p-4 max-w-7xl">
        {/* Header */}
        <header className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Shield className="h-8 w-8" />
                AI Risk News Monitor
              </h1>
              <p className="text-sm opacity-70 mt-1">Real-time tracking for Meta Red Team</p>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />
                Last update: {timeAgo(lastUpdate)}
              </Badge>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setDyslexiaMode(!dyslexiaMode)}
                title="Toggle Dyslexia Mode"
              >
                {dyslexiaMode ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSoundEnabled(!soundEnabled)}
                title="Toggle Sound Alerts"
              >
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </header>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-70">Today's News</p>
                  <p className="text-2xl font-bold">{stats.totalToday}</p>
                </div>
                <Globe className="h-8 w-8 opacity-20" />
              </div>
            </CardContent>
          </Card>
          
          <Card className={stats.criticalAlerts > 0 ? 'border-red-500' : ''}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-70">Critical Alerts</p>
                  <p className="text-2xl font-bold">{stats.criticalAlerts}</p>
                </div>
                <AlertTriangle className="h-8 w-8 opacity-20" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-70">Sources Active</p>
                  <p className="text-2xl font-bold">
                    {Object.values(selectedSources).filter(Boolean).length}
                  </p>
                </div>
                <Zap className="h-8 w-8 opacity-20" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-70">Trending</p>
                  <p className="text-sm font-bold truncate">
                    {stats.trending[0] || 'Loading...'}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* News Feed - Main Column */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Live Feed</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant={autoRefresh ? "default" : "outline"}
                      onClick={() => setAutoRefresh(!autoRefresh)}
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
                      {autoRefresh ? 'Auto' : 'Manual'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={addNewNewsItem}
                    >
                      Refresh Now
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-3">
                    {filteredNews.length === 0 ? (
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          No news items match your filters. Try adjusting the severity or source filters.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      filteredNews.map(item => (
                        <Card 
                          key={item.id} 
                          className={`transition-all duration-200 hover:shadow-md ${
                            item.severity === 'critical' ? 'border-red-500' : ''
                          }`}
                        >
                          <CardContent className="pt-4">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge className={getSeverityColor(item.severity)}>
                                    {getSeverityIcon(item.severity)} {item.severity.toUpperCase()}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {item.source}
                                  </Badge>
                                  <span className="text-xs opacity-60">{timeAgo(item.timestamp)}</span>
                                </div>
                                
                                <h3 className="font-bold text-lg mb-2 leading-tight">
                                  {item.title}
                                </h3>
                                
                                {expandedItems.has(item.id) && (
                                  <>
                                    <p className="text-sm mb-3 opacity-80">
                                      {item.summary}
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-2 mb-3">
                                      <div className="flex items-center gap-1 text-xs">
                                        <Shield className="h-3 w-3" />
                                        Trust: {item.trustScore}%
                                      </div>
                                      <div className="flex items-center gap-1 text-xs">
                                        <Info className="h-3 w-3" />
                                        Bias: {item.bias}
                                      </div>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-1 mb-3">
                                      {item.tags.map(tag => (
                                        <Badge key={tag} variant="secondary" className="text-xs">
                                          {tag}
                                        </Badge>
                                      ))}
                                    </div>
                                    
                                    <div className="text-xs opacity-60 mb-2">
                                      Related risks: {item.relatedRisks.join(', ')}
                                    </div>
                                  </>
                                )}
                                
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => toggleExpanded(item.id)}
                                  >
                                    {expandedItems.has(item.id) ? (
                                      <>
                                        <ChevronUp className="h-4 w-4 mr-1" />
                                        Less
                                      </>
                                    ) : (
                                      <>
                                        <ChevronDown className="h-4 w-4 mr-1" />
                                        More
                                      </>
                                    )}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => window.open(item.url, '_blank')}
                                  >
                                    <ExternalLink className="h-4 w-4 mr-1" />
                                    Source
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Filters Sidebar */}
          <div className="space-y-6">
            {/* Severity Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Severity Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(selectedFilters).map(([severity, enabled]) => (
                  <label key={severity} className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      {getSeverityIcon(severity)}
                      <span className="capitalize">{severity}</span>
                    </span>
                    <Switch
                      checked={enabled}
                      onCheckedChange={(checked) => 
                        setSelectedFilters(prev => ({ ...prev, [severity]: checked }))
                      }
                    />
                  </label>
                ))}
              </CardContent>
            </Card>

            {/* Source Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">News Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {NEWS_SOURCES.map(source => (
                      <label key={source.id} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{source.name}</div>
                          <div className="text-xs opacity-60">
                            Trust: {source.trustScore}% • {source.bias}
                          </div>
                        </div>
                        <Switch
                          checked={selectedSources[source.id]}
                          onCheckedChange={(checked) => 
                            setSelectedSources(prev => ({ ...prev, [source.id]: checked }))
                          }
                        />
                      </label>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="refresh-interval">
                    Refresh Interval (seconds)
                  </Label>
                  <Input
                    id="refresh-interval"
                    type="number"
                    min="10"
                    max="300"
                    value={refreshInterval}
                    onChange={(e) => setRefreshInterval(parseInt(e.target.value) || 60)}
                    className="mt-1"
                  />
                </div>
                
                <label className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {notifications ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                    Notifications
                  </span>
                  <Switch
                    checked={notifications}
                    onCheckedChange={(checked) => {
                      setNotifications(checked);
                      if (checked) requestNotificationPermission();
                    }}
                  />
                </label>
                
                <Alert>
                  <AlertDescription className="text-xs">
                    <strong>Pro tip:</strong> Critical alerts trigger sound + notifications
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Trending Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stats.trending.map((topic, idx) => (
                    <div key={topic} className="flex items-center gap-2">
                      <span className="text-lg font-bold opacity-50">#{idx + 1}</span>
                      <Badge variant="outline">{topic}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 pt-4 border-t text-center text-sm opacity-70">
          <p>AI Risk News Monitor © 2025 | Protecting Meta's AI Safety</p>
          <p className="mt-1">
            Real-time monitoring powered by embedded risk assessments
          </p>
        </footer>
      </div>
    </div>
  );
};

export default AIRiskNewsMonitor;
