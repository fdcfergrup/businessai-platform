import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import {
  ChartBarIcon,
  EyeIcon,
  HeartIcon,
  ShareIcon,
  ArrowTrendingUpIcon as TrendingUpIcon,
  ArrowTrendingDownIcon as TrendingDownIcon
} from '@heroicons/react/24/outline';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('views');

  const timeRanges = [
    { value: '7d', label: '7 ngày qua' },
    { value: '30d', label: '30 ngày qua' },
    { value: '90d', label: '3 tháng qua' },
    { value: '1y', label: '1 năm qua' }
  ];

  const { data: analyticsData, isLoading } = useQuery(
    ['analytics', timeRange],
    async () => {
      const response = await fetch(`/api/analytics/overview?range=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        return response.json();
      }
      throw new Error('Không thể tải dữ liệu phân tích');
    }
  );

  const { data: contentPerformance } = useQuery(
    ['contentPerformance', timeRange],
    async () => {
      const response = await fetch(`/api/analytics/content-performance?range=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        return response.json();
      }
      return [];
    }
  );

  const metrics = [
    {
      name: 'Tổng lượt xem',
      value: analyticsData?.totalViews || 0,
      change: analyticsData?.viewsChange || 0,
      icon: EyeIcon,
      color: 'text-blue-600'
    },
    {
      name: 'Lượt thích',
      value: analyticsData?.totalLikes || 0,
      change: analyticsData?.likesChange || 0,
      icon: HeartIcon,
      color: 'text-red-600'
    },
    {
      name: 'Lượt chia sẻ',
      value: analyticsData?.totalShares || 0,
      change: analyticsData?.sharesChange || 0,
      icon: ShareIcon,
      color: 'text-green-600'
    },
    {
      name: 'Tương tác',
      value: analyticsData?.totalEngagement || 0,
      change: analyticsData?.engagementChange || 0,
      icon: ChartBarIcon,
      color: 'text-purple-600'
    }
  ];

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getChangeIcon = (change) => {
    if (change > 0) {
      return <TrendingUpIcon className="h-4 w-4 text-green-500" />;
    } else if (change < 0) {
      return <TrendingDownIcon className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  const getChangeColor = (change) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="loading-spinner w-8 h-8"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ChartBarIcon className="h-8 w-8 text-indigo-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Phân tích & Báo cáo</h1>
              <p className="text-gray-600">Theo dõi hiệu suất nội dung và tương tác</p>
            </div>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {timeRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div key={metric.name} className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{metric.name}</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatNumber(metric.value)}
                </p>
                <div className={`flex items-center space-x-1 text-sm ${getChangeColor(metric.change)}`}>
                  {getChangeIcon(metric.change)}
                  <span>
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <metric.icon className={`h-8 w-8 ${metric.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Lượt xem theo thời gian</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center text-gray-500">
              <ChartBarIcon className="h-12 w-12 mx-auto mb-2" />
              <p>Biểu đồ sẽ được hiển thị ở đây</p>
            </div>
          </div>
        </div>

        {/* Engagement Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Tương tác theo nền tảng</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center text-gray-500">
              <ChartBarIcon className="h-12 w-12 mx-auto mb-2" />
              <p>Biểu đồ tròn sẽ được hiển thị ở đây</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Content */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Nội dung hiệu suất cao</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {contentPerformance?.length > 0 ? (
            contentPerformance.slice(0, 5).map((content, index) => (
              <div key={content.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-800 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{content.title}</h4>
                        <p className="text-sm text-gray-500">{content.type}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <EyeIcon className="h-4 w-4" />
                      <span>{formatNumber(content.views)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <HeartIcon className="h-4 w-4" />
                      <span>{formatNumber(content.likes)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ShareIcon className="h-4 w-4" />
                      <span>{formatNumber(content.shares)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <ChartBarIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Chưa có dữ liệu hiệu suất nội dung</p>
            </div>
          )}
        </div>
      </div>

      {/* Platform Performance */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Hiệu suất theo nền tảng</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {analyticsData?.platformStats?.map((platform) => (
            <div key={platform.name} className="text-center p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">{platform.name}</h4>
              <div className="space-y-2">
                <div>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatNumber(platform.views)}
                  </span>
                  <p className="text-sm text-gray-500">Lượt xem</p>
                </div>
                <div>
                  <span className="text-lg font-semibold text-green-600">
                    {platform.engagementRate}%
                  </span>
                  <p className="text-sm text-gray-500">Tỷ lệ tương tác</p>
                </div>
              </div>
            </div>
          )) || (
            <div className="col-span-3 text-center text-gray-500">
              <p>Chưa có dữ liệu nền tảng</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;