import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  ChartBarIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalContent: 0,
    totalVideos: 0,
    scheduledPosts: 0,
    totalViews: 0
  });

  useEffect(() => {
    // Fetch dashboard stats
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/analytics/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const quickActions = [
    {
      name: 'Tạo nội dung',
      description: 'Tạo nội dung mới với AI',
      href: '/content',
      icon: DocumentTextIcon,
      color: 'bg-blue-500'
    },
    {
      name: 'Tạo video',
      description: 'Tạo video từ văn bản',
      href: '/video',
      icon: VideoCameraIcon,
      color: 'bg-purple-500'
    },
    {
      name: 'Lên lịch đăng',
      description: 'Quản lý lịch đăng bài',
      href: '/scheduler',
      icon: CalendarIcon,
      color: 'bg-green-500'
    },
    {
      name: 'SEO Tools',
      description: 'Tối ưu hóa SEO',
      href: '/seo',
      icon: MagnifyingGlassIcon,
      color: 'bg-yellow-500'
    },
    {
      name: 'AI Chat',
      description: 'Trò chuyện với AI',
      href: '/chat',
      icon: ChatBubbleLeftRightIcon,
      color: 'bg-pink-500'
    },
    {
      name: 'Phân tích',
      description: 'Xem báo cáo chi tiết',
      href: '/analytics',
      icon: ChartBarIcon,
      color: 'bg-indigo-500'
    }
  ];

  const statCards = [
    {
      name: 'Tổng nội dung',
      value: stats.totalContent,
      icon: DocumentTextIcon,
      color: 'text-blue-600'
    },
    {
      name: 'Video đã tạo',
      value: stats.totalVideos,
      icon: VideoCameraIcon,
      color: 'text-purple-600'
    },
    {
      name: 'Bài đã lên lịch',
      value: stats.scheduledPosts,
      icon: CalendarIcon,
      color: 'text-green-600'
    },
    {
      name: 'Tổng lượt xem',
      value: stats.totalViews,
      icon: ChartBarIcon,
      color: 'text-indigo-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Chào mừng trở lại, {user?.name}!
        </h1>
        <p className="mt-2 text-gray-600">
          Đây là tổng quan về hoạt động của bạn hôm nay.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Thao tác nhanh</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <a
              key={action.name}
              href={action.href}
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div>
                <span className={`rounded-lg inline-flex p-3 ${action.color} text-white`}>
                  <action.icon className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  <span className="absolute inset-0" />
                  {action.name}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {action.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Hoạt động gần đây</h2>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <DocumentTextIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">Đã tạo nội dung mới: "Hướng dẫn Marketing 2024"</p>
              <p className="text-sm text-gray-500">2 giờ trước</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <CalendarIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">Đã lên lịch 3 bài đăng cho tuần tới</p>
              <p className="text-sm text-gray-500">5 giờ trước</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <VideoCameraIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">Video "Xu hướng 2024" đã được tạo thành công</p>
              <p className="text-sm text-gray-500">1 ngày trước</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;