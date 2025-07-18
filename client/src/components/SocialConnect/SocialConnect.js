import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import {
  LinkIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const SocialConnect = () => {
  const [connecting, setConnecting] = useState(null);
  const queryClient = useQueryClient();

  // Fetch connected accounts
  const { data: accounts, isLoading } = useQuery('socialAccounts', async () => {
    const response = await fetch('/api/social/accounts', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error('Không thể tải danh sách tài khoản');
  });

  // Disconnect mutation
  const disconnectMutation = useMutation(
    async (platform) => {
      const response = await fetch(`/api/social/${platform}/disconnect`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error('Không thể ngắt kết nối');
      }
      return response.json();
    },
    {
      onSuccess: (data, platform) => {
        toast.success(`Đã ngắt kết nối ${platform}`);
        queryClient.invalidateQueries('socialAccounts');
      },
      onError: (error) => {
        toast.error(error.message);
      }
    }
  );

  const platforms = [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: '📘',
      color: 'bg-blue-600',
      description: 'Kết nối Facebook Pages để đăng bài và quản lý nội dung'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: '📷',
      color: 'bg-pink-600',
      description: 'Đăng ảnh và stories lên Instagram Business'
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: '🎵',
      color: 'bg-black',
      description: 'Upload video và quản lý TikTok content'
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: '📺',
      color: 'bg-red-600',
      description: 'Upload video và quản lý YouTube channel'
    }
  ];

  const handleConnect = async (platform) => {
    setConnecting(platform);
    try {
      const response = await fetch(`/api/social/${platform}/auth`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Open OAuth window
        window.open(data.authUrl, '_blank', 'width=600,height=600');
        
        // Listen for OAuth completion
        const checkConnection = setInterval(async () => {
          try {
            const accountsResponse = await fetch('/api/social/accounts', {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });
            if (accountsResponse.ok) {
              const updatedAccounts = await accountsResponse.json();
              if (updatedAccounts[platform]?.connected) {
                clearInterval(checkConnection);
                queryClient.invalidateQueries('socialAccounts');
                toast.success(`Kết nối ${platform} thành công!`);
                setConnecting(null);
              }
            }
          } catch (error) {
            console.error('Error checking connection:', error);
          }
        }, 2000);

        // Clear interval after 2 minutes
        setTimeout(() => {
          clearInterval(checkConnection);
          setConnecting(null);
        }, 120000);
      } else {
        throw new Error('Không thể tạo liên kết xác thực');
      }
    } catch (error) {
      toast.error(error.message);
      setConnecting(null);
    }
  };

  const handleDisconnect = (platform) => {
    if (confirm(`Bạn có chắc muốn ngắt kết nối ${platform}?`)) {
      disconnectMutation.mutate(platform);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="loading-spinner w-8 h-8"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <LinkIcon className="h-8 w-8 text-indigo-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Kết nối mạng xã hội</h2>
            <p className="text-gray-600">Kết nối các tài khoản mạng xã hội để đăng bài tự động</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {platforms.map((platform) => {
            const account = accounts?.[platform.id];
            const isConnected = account?.connected;
            const isConnecting = connecting === platform.id;

            return (
              <div key={platform.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 ${platform.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                      {platform.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{platform.name}</h3>
                      <p className="text-sm text-gray-500">{platform.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {isConnected ? (
                      <CheckCircleIcon className="h-6 w-6 text-green-500" />
                    ) : (
                      <XCircleIcon className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                </div>

                {isConnected && (
                  <div className="mt-4 p-3 bg-green-50 rounded-md">
                    <div className="text-sm text-green-800">
                      <strong>Đã kết nối:</strong>
                      {platform.id === 'facebook' && account.name && (
                        <div>
                          <p>{account.name}</p>
                          {account.pages && account.pages.length > 0 && (
                            <p className="text-xs mt-1">
                              {account.pages.length} trang được kết nối
                            </p>
                          )}
                        </div>
                      )}
                      {platform.id === 'tiktok' && account.displayName && (
                        <p>{account.displayName}</p>
                      )}
                      {platform.id === 'youtube' && account.channelTitle && (
                        <div>
                          <p>{account.channelTitle}</p>
                          {account.subscriberCount && (
                            <p className="text-xs mt-1">
                              {parseInt(account.subscriberCount).toLocaleString()} subscribers
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-4 flex space-x-3">
                  {isConnected ? (
                    <button
                      onClick={() => handleDisconnect(platform.id)}
                      disabled={disconnectMutation.isLoading}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50 text-sm"
                    >
                      Ngắt kết nối
                    </button>
                  ) : (
                    <button
                      onClick={() => handleConnect(platform.id)}
                      disabled={isConnecting}
                      className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center space-x-2 text-sm"
                    >
                      {isConnecting ? (
                        <>
                          <ArrowPathIcon className="h-4 w-4 animate-spin" />
                          <span>Đang kết nối...</span>
                        </>
                      ) : (
                        <span>Kết nối</span>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Connected Accounts Summary */}
      {accounts && Object.values(accounts).some(acc => acc.connected) && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Tài khoản đã kết nối</h3>
          <div className="space-y-3">
            {Object.entries(accounts).map(([platform, account]) => {
              if (!account.connected) return null;
              
              const platformInfo = platforms.find(p => p.id === platform);
              return (
                <div key={platform} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 ${platformInfo?.color} rounded flex items-center justify-center text-white text-sm`}>
                      {platformInfo?.icon}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{platformInfo?.name}</p>
                      <p className="text-sm text-gray-500">
                        {platform === 'facebook' && account.name}
                        {platform === 'tiktok' && account.displayName}
                        {platform === 'youtube' && account.channelTitle}
                      </p>
                    </div>
                  </div>
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialConnect;