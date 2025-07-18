import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  CalendarIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const navigation = [
    { name: 'Tổng quan', href: '/dashboard', icon: HomeIcon },
    { name: 'Tạo nội dung', href: '/content', icon: DocumentTextIcon },
    { name: 'Tạo video', href: '/video', icon: VideoCameraIcon },
    { name: 'Lên lịch đăng', href: '/scheduler', icon: CalendarIcon },
    { name: 'SEO Tools', href: '/seo', icon: MagnifyingGlassIcon },
    { name: 'Phân tích', href: '/analytics', icon: ChartBarIcon },
    { name: 'AI Chat', href: '/chat', icon: ChatBubbleLeftRightIcon }
  ];

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-indigo-100 text-indigo-700 border-r-2 border-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon
                  className="mr-3 h-5 w-5 flex-shrink-0"
                  aria-hidden="true"
                />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
        <div className="bg-indigo-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-indigo-900">Nâng cấp Pro</h3>
          <p className="text-xs text-indigo-700 mt-1">
            Mở khóa tất cả tính năng premium
          </p>
          <button className="mt-2 w-full bg-indigo-600 text-white text-xs py-2 px-3 rounded-md hover:bg-indigo-700">
            Nâng cấp ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;