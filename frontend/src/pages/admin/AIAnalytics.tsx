import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import { ArrowPathIcon, SparklesIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, LightBulbIcon } from '@heroicons/react/24/outline';

interface AIInsights {
  hot_selling_items: Array<{
    name: string;
    predicted_orders: number;
    confidence: number;
  }>;
  underperforming_items: Array<{
    name: string;
    predicted_orders: number;
  }>;
}

const AIAnalytics: React.FC = () => {
  const [insights, setInsights] = useState<AIInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/ai/insights`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInsights(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch AI insights');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  // Skeleton
  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-72 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
              <div className="h-6 w-40 bg-gray-200 rounded mb-6" />
              <div className="space-y-4">
                {[1, 2, 3].map(j => (
                  <div key={j} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg" />
                    <div className="flex-1">
                      <div className="h-4 w-32 bg-gray-200 rounded mb-1" />
                      <div className="h-2 w-full bg-gray-200 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-3">🤖</div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">AI Analysis Unavailable</h3>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <button onClick={fetchInsights} className="px-5 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors">
            Retry Analysis
          </button>
        </div>
      </div>
    );
  }

  if (!insights) return null;

  const maxPredicted = Math.max(
    ...insights.hot_selling_items.map(i => i.predicted_orders),
    ...insights.underperforming_items.map(i => i.predicted_orders),
    1
  );

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <SparklesIcon className="h-6 w-6 text-[#FFD700]" />
            <h1 className="text-2xl font-bold text-[#1a2233]">AI Analytics</h1>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-gradient-to-r from-pink-500 to-rose-500 text-white">
              AI
            </span>
          </div>
          <p className="text-sm text-gray-500">AI-powered insights from your order data</p>
        </div>
        <button
          onClick={fetchInsights}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ArrowPathIcon className="h-4 w-4" />
          Refresh Analysis
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hot Selling Items */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
              <ArrowTrendingUpIcon className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="font-semibold text-[#1a2233]">Hot Selling Items</h2>
              <p className="text-xs text-gray-500">Predicted high-demand items</p>
            </div>
          </div>
          <div className="p-6">
            {insights.hot_selling_items.length > 0 ? (
              <div className="space-y-4">
                {insights.hot_selling_items.map((item, index) => (
                  <div key={index} className="group">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center text-xs font-bold text-emerald-600">
                          {index + 1}
                        </span>
                        <span className="font-medium text-[#1a2233] text-sm">{item.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-emerald-600">{item.predicted_orders} orders</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-700"
                          style={{ width: `${(item.predicted_orders / maxPredicted) * 100}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-medium text-gray-400 w-10 text-right">
                        {(item.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm">Not enough data for predictions yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Underperforming Items */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
              <ArrowTrendingDownIcon className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <h2 className="font-semibold text-[#1a2233]">Underperforming Items</h2>
              <p className="text-xs text-gray-500">Items that may need attention</p>
            </div>
          </div>
          <div className="p-6">
            {insights.underperforming_items.length > 0 ? (
              <div className="space-y-4">
                {insights.underperforming_items.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-red-50 flex items-center justify-center text-xs font-bold text-red-500">
                          {index + 1}
                        </span>
                        <span className="font-medium text-[#1a2233] text-sm">{item.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-red-500">{item.predicted_orders} orders</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-300 to-red-400 rounded-full transition-all duration-700"
                        style={{ width: `${Math.max((item.predicted_orders / maxPredicted) * 100, 5)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-3xl mb-2">🎉</div>
                <p className="text-gray-500 text-sm font-medium">All items performing well!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="mt-6 bg-gradient-to-r from-[#1a2233] to-[#2d3748] rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
            <LightBulbIcon className="h-5 w-5 text-[#FFD700]" />
          </div>
          <div>
            <h3 className="font-semibold text-white mb-2">AI Recommendations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white/5 rounded-xl px-4 py-3 border border-white/10">
                <p className="text-xs text-[#FFD700] font-medium mb-1">Boost Sales</p>
                <p className="text-sm text-gray-300">Consider promoting underperforming items with combo deals or daily specials</p>
              </div>
              <div className="bg-white/5 rounded-xl px-4 py-3 border border-white/10">
                <p className="text-xs text-[#FFD700] font-medium mb-1">Stock Management</p>
                <p className="text-sm text-gray-300">Ensure hot-selling items have adequate ingredient supply for peak hours</p>
              </div>
              <div className="bg-white/5 rounded-xl px-4 py-3 border border-white/10">
                <p className="text-xs text-[#FFD700] font-medium mb-1">Menu Optimization</p>
                <p className="text-sm text-gray-300">Place top-selling items prominently on the menu for maximum visibility</p>
              </div>
              <div className="bg-white/5 rounded-xl px-4 py-3 border border-white/10">
                <p className="text-xs text-[#FFD700] font-medium mb-1">Data Quality</p>
                <p className="text-sm text-gray-300">Predictions improve with more order data — keep the system running!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalytics;
