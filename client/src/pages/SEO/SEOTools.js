import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
  MagnifyingGlassIcon,
  ChartBarIcon,
  DocumentTextIcon,
  LinkIcon
} from '@heroicons/react/24/outline';

const SEOTools = () => {
  const [activeTab, setActiveTab] = useState('keyword');
  const [keywordData, setKeywordData] = useState({
    keyword: '',
    results: null,
    loading: false
  });
  const [contentData, setContentData] = useState({
    content: '',
    results: null,
    loading: false
  });

  const tabs = [
    { id: 'keyword', name: 'Nghiên cứu từ khóa', icon: MagnifyingGlassIcon },
    { id: 'content', name: 'Phân tích nội dung', icon: DocumentTextIcon },
    { id: 'backlink', name: 'Kiểm tra backlink', icon: LinkIcon },
    { id: 'competitor', name: 'Phân tích đối thủ', icon: ChartBarIcon }
  ];

  const analyzeKeyword = async () => {
    if (!keywordData.keyword.trim()) {
      toast.error('Vui lòng nhập từ khóa');
      return;
    }

    setKeywordData(prev => ({ ...prev, loading: true }));
    
    try {
      const response = await fetch('/api/seo/keyword-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ keyword: keywordData.keyword })
      });

      if (response.ok) {
        const results = await response.json();
        setKeywordData(prev => ({ ...prev, results }));
        toast.success('Phân tích từ khóa thành công!');
      } else {
        throw new Error('Không thể phân tích từ khóa');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setKeywordData(prev => ({ ...prev, loading: false }));
    }
  };

  const analyzeContent = async () => {
    if (!contentData.content.trim()) {
      toast.error('Vui lòng nhập nội dung');
      return;
    }

    setContentData(prev => ({ ...prev, loading: true }));
    
    try {
      const response = await fetch('/api/seo/content-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content: contentData.content })
      });

      if (response.ok) {
        const results = await response.json();
        setContentData(prev => ({ ...prev, results }));
        toast.success('Phân tích nội dung thành công!');
      } else {
        throw new Error('Không thể phân tích nội dung');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setContentData(prev => ({ ...prev, loading: false }));
    }
  };

  const renderKeywordTab = () => (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Nghiên cứu từ khóa</h3>
        <div className="flex space-x-4">
          <input
            type="text"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Nhập từ khóa cần phân tích..."
            value={keywordData.keyword}
            onChange={(e) => setKeywordData(prev => ({ ...prev, keyword: e.target.value }))}
          />
          <button
            onClick={analyzeKeyword}
            disabled={keywordData.loading}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {keywordData.loading ? 'Đang phân tích...' : 'Phân tích'}
          </button>
        </div>
      </div>

      {keywordData.results && (
        <div className="bg-white shadow rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Kết quả phân tích</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">
                {keywordData.results.searchVolume || 'N/A'}
              </div>
              <div className="text-sm text-gray-500">Lượt tìm kiếm/tháng</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {keywordData.results.difficulty || 'N/A'}
              </div>
              <div className="text-sm text-gray-500">Độ khó (0-100)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {keywordData.results.cpc || 'N/A'}
              </div>
              <div className="text-sm text-gray-500">CPC ($)</div>
            </div>
          </div>
          
          {keywordData.results.relatedKeywords && (
            <div className="mt-6">
              <h5 className="font-medium text-gray-900 mb-3">Từ khóa liên quan</h5>
              <div className="flex flex-wrap gap-2">
                {keywordData.results.relatedKeywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderContentTab = () => (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Phân tích nội dung SEO</h3>
        <div className="space-y-4">
          <textarea
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Nhập nội dung cần phân tích SEO..."
            value={contentData.content}
            onChange={(e) => setContentData(prev => ({ ...prev, content: e.target.value }))}
          />
          <button
            onClick={analyzeContent}
            disabled={contentData.loading}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {contentData.loading ? 'Đang phân tích...' : 'Phân tích nội dung'}
          </button>
        </div>
      </div>

      {contentData.results && (
        <div className="bg-white shadow rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Kết quả phân tích</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {contentData.results.seoScore || 0}/100
              </div>
              <div className="text-sm text-gray-500">Điểm SEO</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {contentData.results.readabilityScore || 0}/100
              </div>
              <div className="text-sm text-gray-500">Điểm dễ đọc</div>
            </div>
          </div>

          {contentData.results.suggestions && (
            <div>
              <h5 className="font-medium text-gray-900 mb-3">Gợi ý cải thiện</h5>
              <ul className="space-y-2">
                {contentData.results.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="flex-shrink-0 w-2 h-2 bg-yellow-400 rounded-full mt-2"></span>
                    <span className="text-gray-700">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderPlaceholderTab = (title) => (
    <div className="bg-white shadow rounded-lg p-12 text-center">
      <div className="text-gray-400 mb-4">
        <ChartBarIcon className="h-16 w-16 mx-auto" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500">Tính năng này đang được phát triển</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <MagnifyingGlassIcon className="h-8 w-8 text-yellow-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Công cụ SEO</h1>
            <p className="text-gray-600">Tối ưu hóa nội dung và từ khóa cho công cụ tìm kiếm</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'keyword' && renderKeywordTab()}
          {activeTab === 'content' && renderContentTab()}
          {activeTab === 'backlink' && renderPlaceholderTab('Kiểm tra Backlink')}
          {activeTab === 'competitor' && renderPlaceholderTab('Phân tích Đối thủ')}
        </div>
      </div>
    </div>
  );
};

export default SEOTools;