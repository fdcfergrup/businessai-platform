import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import toast from 'react-hot-toast';
import {
  CalendarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const SocialScheduler = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [formData, setFormData] = useState({
    content: '',
    platform: 'facebook',
    scheduledTime: '',
    status: 'scheduled'
  });

  const platforms = [
    { value: 'facebook', label: 'Facebook', color: 'bg-blue-600' },
    { value: 'instagram', label: 'Instagram', color: 'bg-pink-600' },
    { value: 'twitter', label: 'Twitter', color: 'bg-sky-500' },
    { value: 'linkedin', label: 'LinkedIn', color: 'bg-blue-700' },
    { value: 'tiktok', label: 'TikTok', color: 'bg-black' }
  ];

  const { data: scheduledPosts, refetch } = useQuery('scheduledPosts', async () => {
    const response = await fetch('/api/scheduler/posts', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error('Không thể tải danh sách bài đăng');
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = selectedPost 
        ? `/api/scheduler/posts/${selectedPost.id}`
        : '/api/scheduler/posts';
      
      const method = selectedPost ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success(selectedPost ? 'Cập nhật thành công!' : 'Tạo lịch đăng thành công!');
        setShowCreateModal(false);
        setSelectedPost(null);
        setFormData({
          content: '',
          platform: 'facebook',
          scheduledTime: '',
          status: 'scheduled'
        });
        refetch();
      } else {
        throw new Error('Có lỗi xảy ra');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deletePost = async (postId) => {
    if (!window.confirm('Bạn có chắc muốn xóa bài đăng này?')) return;

    try {
      const response = await fetch(`/api/scheduler/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        toast.success('Đã xóa bài đăng!');
        refetch();
      } else {
        throw new Error('Không thể xóa bài đăng');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const editPost = (post) => {
    setSelectedPost(post);
    setFormData({
      content: post.content,
      platform: post.platform,
      scheduledTime: post.scheduledTime,
      status: post.status
    });
    setShowCreateModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'published': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'scheduled': return 'Đã lên lịch';
      case 'published': return 'Đã đăng';
      case 'failed': return 'Thất bại';
      default: return 'Không xác định';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CalendarIcon className="h-8 w-8 text-green-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Lên lịch đăng bài</h1>
              <p className="text-gray-600">Quản lý và lên lịch bài đăng trên các nền tảng mạng xã hội</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Tạo lịch đăng</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Đã lên lịch</p>
              <p className="text-2xl font-semibold text-gray-900">
                {scheduledPosts?.filter(p => p.status === 'scheduled').length || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CalendarIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Đã đăng</p>
              <p className="text-2xl font-semibold text-gray-900">
                {scheduledPosts?.filter(p => p.status === 'published').length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scheduled Posts */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Danh sách bài đăng</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {scheduledPosts?.length > 0 ? (
            scheduledPosts.map((post) => (
              <div key={post.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        platforms.find(p => p.value === post.platform)?.color || 'bg-gray-600'
                      } text-white`}>
                        {platforms.find(p => p.value === post.platform)?.label}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                        {getStatusText(post.status)}
                      </span>
                    </div>
                    <p className="text-gray-900 mb-2">{post.content}</p>
                    <p className="text-sm text-gray-500">
                      Lên lịch: {new Date(post.scheduledTime).toLocaleString('vi-VN')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => editPost(post)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => deletePost(post.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <CalendarIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Chưa có bài đăng nào được lên lịch</p>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {selectedPost ? 'Chỉnh sửa bài đăng' : 'Tạo lịch đăng mới'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nội dung *
                  </label>
                  <textarea
                    name="content"
                    rows={4}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Nhập nội dung bài đăng..."
                    value={formData.content}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nền tảng
                  </label>
                  <select
                    name="platform"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.platform}
                    onChange={handleInputChange}
                  >
                    {platforms.map((platform) => (
                      <option key={platform.value} value={platform.value}>
                        {platform.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thời gian đăng *
                  </label>
                  <input
                    type="datetime-local"
                    name="scheduledTime"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.scheduledTime}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setSelectedPost(null);
                      setFormData({
                        content: '',
                        platform: 'facebook',
                        scheduledTime: '',
                        status: 'scheduled'
                      });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    {selectedPost ? 'Cập nhật' : 'Tạo lịch'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialScheduler;