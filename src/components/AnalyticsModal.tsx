'use client';

import { useState, useEffect } from 'react';
import { X, TrendingUp, Globe, Calendar, Eye } from 'lucide-react';

interface AnalyticsData {
  username: string;
  totalViews: number;
  countries: Array<{ country: string; code: string; count: number }>;
  recentViews: Array<{
    id: string;
    viewed_at: string;
    country: string;
    country_code: string;
    city: string;
    ip_address: string;
  }>;
  dailyStats: { [key: string]: number };
}

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
}

export default function AnalyticsModal({ isOpen, onClose, username }: AnalyticsModalProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && username) {
      fetchAnalytics();
    }
  }, [isOpen, username]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics/${username}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      } else {
        console.error('Failed to fetch analytics');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Format time for display
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  // Convert country code to flag emoji
  const getCountryFlag = (countryCode: string | null): string => {
    if (!countryCode || countryCode === 'UN' || countryCode === 'LOC') {
      return '🌍'; // Default globe emoji for unknown/local
    }

    // Convert 2-letter country code to flag emoji
    // Each letter becomes a regional indicator symbol (U+1F1E6 to U+1F1FF)
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map((char) => 0x1f1e6 + (char.charCodeAt(0) - 0x41));

    return String.fromCodePoint(...codePoints);
  };

  // Get last 7 days for chart
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  const last7Days = getLast7Days();
  const maxViews = analytics
    ? Math.max(...last7Days.map((day) => analytics.dailyStats[day] || 0), 1)
    : 1;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-accent/20 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">Analytics</h2>
            <p className="text-sm text-text-primary/60 mt-1">@{username}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent/10 rounded-lg transition-colors"
          >
            <X size={24} className="text-text-primary/60" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
            </div>
          ) : analytics ? (
            <div className="space-y-6">
              {/* Total Views Card */}
              <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-accent/20 rounded-xl flex items-center justify-center">
                    <Eye className="text-accent" size={32} />
                  </div>
                  <div>
                    <p className="text-text-primary/60 text-sm">Total Page Views</p>
                    <p className="text-4xl font-bold text-text-primary">{analytics.totalViews}</p>
                  </div>
                </div>
              </div>

              {/* Countries Section */}
              {analytics.countries.length > 0 && (
                <div className="bg-white border border-accent/20 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Globe className="text-accent" size={20} />
                    <h3 className="text-lg font-semibold text-text-primary">Views by Country</h3>
                  </div>
                  <div className="space-y-3">
                    {analytics.countries.slice(0, 10).map((country, index) => (
                      <div key={country.code} className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <span className="text-text-primary/40 text-sm font-medium w-6">
                            #{index + 1}
                          </span>
                          <span className="text-2xl" title={country.country}>
                            {getCountryFlag(country.code)}
                          </span>
                          <span className="font-medium text-text-primary">{country.country}</span>
                          <span className="text-text-primary/40 text-sm">({country.code})</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-32 bg-accent/10 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-accent h-full rounded-full transition-all"
                              style={{
                                width: `${(country.count / analytics.totalViews) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-text-primary font-semibold w-12 text-right">
                            {country.count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 7-Day Chart */}
              {Object.keys(analytics.dailyStats).length > 0 && (
                <div className="bg-white border border-accent/20 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="text-accent" size={20} />
                    <h3 className="text-lg font-semibold text-text-primary">Last 7 Days</h3>
                  </div>
                  <div className="flex items-end justify-between gap-2 h-48">
                    {last7Days.map((day) => {
                      const views = analytics.dailyStats[day] || 0;
                      const height = (views / maxViews) * 100;
                      const date = new Date(day);
                      return (
                        <div key={day} className="flex-1 flex flex-col items-center gap-2">
                          <div className="w-full flex items-end justify-center h-40">
                            <div
                              className="w-full bg-accent rounded-t-lg transition-all hover:bg-accent/80"
                              style={{ height: `${height}%`, minHeight: views > 0 ? '4px' : '0' }}
                              title={`${date.toLocaleDateString()}: ${views} views`}
                            />
                          </div>
                          <span className="text-xs text-text-primary/60">
                            {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                          <span className="text-xs font-semibold text-text-primary">{views}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Recent Views */}
              {analytics.recentViews.length > 0 && (
                <div className="bg-white border border-accent/20 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="text-accent" size={20} />
                    <h3 className="text-lg font-semibold text-text-primary">Recent Views</h3>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {analytics.recentViews.slice(0, 20).map((view) => (
                      <div
                        key={view.id}
                        className="flex items-center justify-between p-3 bg-bg-primary rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center text-xl">
                            {getCountryFlag(view.country_code)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-text-primary">
                              {view.country} {view.city !== 'Unknown' && view.city !== 'Local' ? `, ${view.city}` : ''}
                            </p>
                            <p className="text-xs text-text-primary/60">
                              {formatDate(view.viewed_at)} at {formatTime(view.viewed_at)}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-text-primary/40 font-mono">
                          {view.ip_address}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {analytics.totalViews === 0 && (
                <div className="text-center py-12">
                  <Eye className="text-text-primary/20 mx-auto mb-4" size={48} />
                  <p className="text-text-primary/60">No views yet</p>
                  <p className="text-sm text-text-primary/40 mt-2">
                    Analytics will appear here once your page receives visits
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-text-primary/60">Failed to load analytics</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

