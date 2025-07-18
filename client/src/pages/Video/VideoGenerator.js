import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
  VideoCameraIcon,
  PlayIcon,
  ArrowDownTrayIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const VideoGenerator = () => {
  const [formData, setFormData] = useState({
    script: '',
    voiceType: 'female',
    videoStyle: 'modern',
    duration: '30',
    background: 'gradient'
  });
  const [generatedVideo, setGeneratedVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const voiceTypes = [
    { value: 'female', label: 'Giọng nữ' },
    { value: 'male', label: 'Giọng nam' },
    { value: 'child', label: 'Giọng trẻ em' }
  ];

  const videoStyles = [
    { value: 'modern', label: 'Hiện đại' },
    { value: 'minimal', label: 'Tối giản' },
    { value: 'colorful', label: 'Nhiều màu sắc' },
    { value: 'professional', label: 'Chuyên nghiệp' }
  ];

  const backgrounds = [
    { value: 'gradient', label: 'Gradient' },
    { value: 'solid', label: 'Màu đơn' },
    { value: 'pattern', label: 'Họa tiết' },
    { value: 'image', label: 'Hình ảnh' }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generateVideo = async () => {
    if (!formData.script.trim()) {
      toast.error('Vui lòng nhập kịch bản video');
      return;
    }

    setLoading(true);
    setProgress(0);
    
    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 1000);

      const response = await fetch('/api/video/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (response.ok) {
        const data = await response.json();
        setGeneratedVideo(data);
        toast.success('Video đã được tạo thành công!');
      } else {
        throw new Error('Không thể tạo video');
      }
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const downloadVideo = () => {
    if (generatedVideo?.videoUrl) {
      const link = document.createElement('a');
      link.href = generatedVideo.videoUrl;
      link.download = `video_${Date.now()}.mp4`;
      link.click();
      toast.success('Đang tải video...');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <VideoCameraIcon className="h-8 w-8 text-purple-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tạo video AI</h1>
            <p className="text-gray-600">Chuyển đổi văn bản thành video chuyên nghiệp</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Cài đặt video</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kịch bản video *
              </label>
              <textarea
                name="script"
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Nhập kịch bản cho video của bạn..."
                value={formData.script}
                onChange={handleInputChange}
              />
              <p className="text-sm text-gray-500 mt-1">
                Độ dài khuyến nghị: 50-200 từ
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giọng đọc
              </label>
              <select
                name="voiceType"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={formData.voiceType}
                onChange={handleInputChange}
              >
                {voiceTypes.map((voice) => (
                  <option key={voice.value} value={voice.value}>
                    {voice.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phong cách video
              </label>
              <select
                name="videoStyle"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={formData.videoStyle}
                onChange={handleInputChange}
              >
                {videoStyles.map((style) => (
                  <option key={style.value} value={style.value}>
                    {style.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thời lượng (giây)
              </label>
              <select
                name="duration"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={formData.duration}
                onChange={handleInputChange}
              >
                <option value="15">15 giây</option>
                <option value="30">30 giây</option>
                <option value="60">60 giây</option>
                <option value="120">2 phút</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nền video
              </label>
              <select
                name="background"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={formData.background}
                onChange={handleInputChange}
              >
                {backgrounds.map((bg) => (
                  <option key={bg.value} value={bg.value}>
                    {bg.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={generateVideo}
              disabled={loading}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <VideoCameraIcon className="h-5 w-5" />
              <span>{loading ? 'Đang tạo video...' : 'Tạo video'}</span>
            </button>

            {loading && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}
          </div>
        </div>

        {/* Video Preview */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Xem trước video</h2>
            {generatedVideo && (
              <button
                onClick={downloadVideo}
                className="inline-flex items-center px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
              >
                <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                Tải xuống
              </button>
            )}
          </div>

          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            {loading ? (
              <div className="text-center">
                <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
                <p className="text-gray-600">Đang tạo video... {progress}%</p>
              </div>
            ) : generatedVideo ? (
              <div className="w-full h-full relative">
                <video
                  controls
                  className="w-full h-full rounded-lg"
                  poster={generatedVideo.thumbnail}
                >
                  <source src={generatedVideo.videoUrl} type="video/mp4" />
                  Trình duyệt không hỗ trợ video.
                </video>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <VideoCameraIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>Video sẽ xuất hiện ở đây sau khi được tạo</p>
              </div>
            )}
          </div>

          {generatedVideo && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <ClockIcon className="h-4 w-4 mr-2" />
                Thời lượng: {generatedVideo.duration}s
              </div>
              <div className="text-sm text-gray-600">
                Kích thước: {generatedVideo.fileSize}
              </div>
              <div className="text-sm text-gray-600">
                Định dạng: MP4 (1080p)
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoGenerator;