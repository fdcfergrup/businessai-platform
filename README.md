# BusinessAI - Nền tảng AI cho Doanh nghiệp

BusinessAI là một nền tảng toàn diện giúp doanh nghiệp tạo nội dung, quản lý mạng xã hội và tối ưu hóa marketing với sức mạnh của AI.

## 🌐 Demo Live

**URL:** https://businessai-app-8928.azurewebsites.net

**Demo Account:**
- Email: `demo@businessai.com`
- Password: `123456` (bất kỳ mật khẩu nào)

## 🚀 Tính năng chính

### 🤖 AI Content Generator
- Tạo nội dung blog, bài đăng mạng xã hội, email marketing
- Hỗ trợ nhiều giọng điệu và độ dài khác nhau
- Tích hợp từ khóa SEO

### 🎥 AI Video Generator
- Chuyển đổi văn bản thành video
- Tùy chỉnh giọng đọc và phong cách
- Xuất video chất lượng cao

### 📅 Social Media Scheduler
- Lên lịch đăng bài trên nhiều nền tảng
- Hỗ trợ Facebook, Instagram, Twitter, LinkedIn, TikTok
- Theo dõi hiệu suất bài đăng

### 🔍 SEO Tools
- Nghiên cứu từ khóa
- Phân tích nội dung SEO
- Gợi ý tối ưu hóa

### 📊 Analytics & Reports
- Thống kê chi tiết về hiệu suất
- Báo cáo theo thời gian
- Phân tích đối thủ cạnh tranh

### 💬 AI Chat Assistant
- Tư vấn chiến lược marketing
- Hỗ trợ tạo ý tưởng nội dung
- Trả lời câu hỏi về kinh doanh

## 🛠️ Công nghệ sử dụng

### Frontend
- **React 18** - UI Framework
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **React Query** - Data fetching
- **Heroicons** - Icons

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📦 Cài đặt

### Yêu cầu hệ thống
- Node.js >= 16.0.0
- MongoDB >= 4.4
- npm >= 8.0.0

### 1. Clone repository
\`\`\`bash
git clone https://github.com/your-username/businessai.git
cd businessai
\`\`\`

### 2. Cài đặt dependencies
\`\`\`bash
npm run install-deps
\`\`\`

### 3. Cấu hình environment
\`\`\`bash
cp .env.example .env
\`\`\`

Chỉnh sửa file `.env` với thông tin của bạn:
\`\`\`env
MONGODB_URI=mongodb://localhost:27017/businessai
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
\`\`\`

### 4. Khởi động MongoDB
\`\`\`bash
# Trên macOS với Homebrew
brew services start mongodb-community

# Trên Ubuntu
sudo systemctl start mongod

# Hoặc chạy trực tiếp
mongod
\`\`\`

### 5. Chạy ứng dụng
\`\`\`bash
# Development mode (chạy cả frontend và backend)
npm run dev

# Chỉ chạy backend
npm run server

# Chỉ chạy frontend
npm run client
\`\`\`

Ứng dụng sẽ chạy tại:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 🚀 Deployment

### Heroku
\`\`\`bash
# Tạo Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-jwt-secret

# Deploy
git push heroku main
\`\`\`

### Docker
\`\`\`bash
# Build image
docker build -t businessai .

# Run container
docker run -p 5000:5000 businessai
\`\`\`

## 📁 Cấu trúc thư mục

\`\`\`
businessai/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   └── ...
│   └── package.json
├── server/                # Node.js backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── middleware/       # Express middleware
│   └── index.js
├── package.json
└── README.md
\`\`\`

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin user

### Content
- `POST /api/content/generate` - Tạo nội dung AI
- `POST /api/content/save` - Lưu nội dung
- `GET /api/content` - Lấy danh sách nội dung

### Video
- `POST /api/video/generate` - Tạo video AI
- `GET /api/video` - Lấy danh sách video

### Scheduler
- `GET /api/scheduler/posts` - Lấy bài đăng đã lên lịch
- `POST /api/scheduler/posts` - Tạo lịch đăng
- `PUT /api/scheduler/posts/:id` - Cập nhật lịch đăng
- `DELETE /api/scheduler/posts/:id` - Xóa lịch đăng

### SEO
- `POST /api/seo/keyword-analysis` - Phân tích từ khóa
- `POST /api/seo/content-analysis` - Phân tích nội dung

### Analytics
- `GET /api/analytics/dashboard` - Dashboard overview
- `GET /api/analytics/overview` - Thống kê tổng quan
- `GET /api/analytics/content-performance` - Hiệu suất nội dung

### Chat
- `POST /api/chatbot/chat` - Chat với AI
- `GET /api/chatbot/suggestions` - Lấy gợi ý

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Dự án này được phân phối dưới giấy phép MIT. Xem file `LICENSE` để biết thêm chi tiết.

## 📞 Liên hệ

- Email: support@businessai.com
- Website: https://businessai.com
- GitHub: https://github.com/your-username/businessai

## 🙏 Acknowledgments

- [OpenAI](https://openai.com) - AI API
- [Tailwind CSS](https://tailwindcss.com) - CSS Framework
- [Heroicons](https://heroicons.com) - Icons
- [React](https://reactjs.org) - Frontend Framework
- [Express.js](https://expressjs.com) - Backend Framework