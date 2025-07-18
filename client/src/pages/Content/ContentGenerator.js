import React, { useState } from 'react';
import { useQuery } from 'react-query';
import toast from 'react-hot-toast';
import {
  DocumentTextIcon,
  SparklesIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';

const ContentGenerator = () => {
  const [formData, setFormData] = useState({
    topic: '',
    contentType: 'blog',
    tone: 'professional',
    length: 'medium',
    keywords: ''
  });
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);

  const contentTypes = [
    { value: 'blog', label: 'Bài viết Blog' },
    { value: 'social', label: 'Bài đăng mạng xã hội' },
    { value: 'email', label: 'Email Marketing' },
    { value: 'product', label: 'Mô tả sản phẩm' },
    { value: 'ad', label: 'Quảng cáo' }
  ];

  const tones = [
    { value: 'professional', label: 'Chuyên nghiệp' },
    { value: 'casual', label: 'Thân thiện' },
    { value: 'humorous', label: 'Hài hước' },
    { value: 'formal', label: 'Trang trọng' },
    { value: 'creative', label: 'Sáng tạo' }
  ];

  const lengths = [
    { value: 'short', label: 'Ngắn (100-200 từ)' },
    { value: 'medium', label: 'Trung bình (300-500 từ)' },
    { value: 'long', label: 'Dài (800-1000 từ)' }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generateContent = async () => {
    if (!formData.topic.trim()) {
      toast.error('Vui lòng nhập chủ đề');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/content/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedContent(data.content);
        toast.success('Nội dung đã được tạo thành công!');
      } else {
        throw new Error('Không thể tạo nội dung');
      }
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    toast.success('Đã sao chép vào clipboard!');
  };

  const saveContent = async () => {
    if (!generatedContent) {
      toast.error('Không có nội dung để lưu');
      return;
    }

    try {
      const response = await fetch('/api/content/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title: formData.topic,
          content: generatedContent,
          type: formData.contentType,
          keywords: formData.keywords
        })
      });

      if (response.ok) {
        toast.success('Nội dung đã được lưu!');
      } else {
        throw new Error('Không thể lưu nội dung');
      }
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <SparklesIcon className="h-8 w-8 text-indigo-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tạo nội dung AI</h1>
            <p className="text-gray-600">Tạo nội dung chất lượng cao với sức mạnh AI</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Cài đặt nội dung</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chủ đề *
              </label>
              <textarea
                name="topic"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Nhập chủ đề hoặc ý tưởng cho nội dung..."
                value={formData.topic}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại nội dung
              </label>
              <select
                name="contentType"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.contentType}
                onChange={handleInputChange}
              >
                {contentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giọng điệu
              </label>
              <select
                name="tone"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.tone}
                onChange={handleInputChange}
              >
                {tones.map((tone) => (
                  <option key={tone.value} value={tone.value}>
                    {tone.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Độ dài
              </label>
              <select
                name="length"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.length}
                onChange={handleInputChange}
              >
                {lengths.map((length) => (
                  <option key={length.value} value={length.value}>
                    {length.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Từ khóa (tùy chọn)
              </label>
              <input
                type="text"
                name="keywords"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Nhập từ khóa, cách nhau bằng dấu phẩy"
                value={formData.keywords}
                onChange={handleInputChange}
              />
            </div>

            <button
              onClick={generateContent}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <SparklesIcon className="h-5 w-5" />
              <span>{loading ? 'Đang tạo...' : 'Tạo nội dung'}</span>
            </button>
          </div>
        </div>

        {/* Generated Content */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Nội dung được tạo</h2>
            {generatedContent && (
              <div className="flex space-x-2">
                <button
                  onClick={copyToClipboard}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                >
                  <ClipboardDocumentIcon className="h-4 w-4 mr-1" />
                  Sao chép
                </button>
                <button
                  onClick={saveContent}
                  className="inline-flex items-center px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
                >
                  <DocumentTextIcon className="h-4 w-4 mr-1" />
                  Lưu
                </button>
              </div>
            )}
          </div>

          <div className="min-h-96 border border-gray-300 rounded-md p-4">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="loading-spinner w-8 h-8"></div>
              </div>
            ) : generatedContent ? (
              <div className="whitespace-pre-wrap text-gray-900">
                {generatedContent}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <DocumentTextIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Nội dung sẽ xuất hiện ở đây sau khi được tạo</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentGenerator;