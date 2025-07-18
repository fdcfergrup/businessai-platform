class BusinessAIService {
  static async generateContent({ topic, contentType, tone, length, keywords }) {
    try {
      // Mock AI content generation
      // In production, integrate with OpenAI, Claude, or other AI services
      
      const templates = {
        blog: {
          professional: {
            short: `# ${topic}\n\n${topic} là một chủ đề quan trọng trong thời đại hiện tại. Với sự phát triển của công nghệ, chúng ta cần hiểu rõ về ${topic} để có thể ứng dụng hiệu quả.\n\n## Tại sao ${topic} quan trọng?\n\n${topic} mang lại nhiều lợi ích thiết thực cho doanh nghiệp và cá nhân. Việc nắm vững kiến thức về ${topic} sẽ giúp bạn:\n\n- Tăng hiệu quả công việc\n- Tiết kiệm thời gian và chi phí\n- Nâng cao chất lượng sản phẩm/dịch vụ\n\n## Kết luận\n\n${topic} không chỉ là xu hướng mà còn là nhu cầu thiết yếu. Hãy bắt đầu tìm hiểu và ứng dụng ngay hôm nay!`,
            medium: `# ${topic}: Hướng dẫn toàn diện\n\n${topic} đang trở thành một yếu tố then chốt trong việc phát triển kinh doanh hiện đại. Trong bài viết này, chúng ta sẽ khám phá sâu về ${topic} và cách ứng dụng hiệu quả.\n\n## Giới thiệu về ${topic}\n\n${topic} không chỉ đơn thuần là một khái niệm mà còn là một phương pháp tiếp cận mới trong việc giải quyết các thách thức kinh doanh. Với sự phát triển không ngừng của công nghệ, ${topic} đã chứng minh được tầm quan trọng của mình.\n\n## Lợi ích của ${topic}\n\n### 1. Tăng hiệu quả hoạt động\n${topic} giúp tối ưu hóa quy trình làm việc, giảm thiểu thời gian và công sức cần thiết.\n\n### 2. Cải thiện chất lượng\nViệc áp dụng ${topic} một cách đúng đắn sẽ nâng cao chất lượng sản phẩm và dịch vụ.\n\n### 3. Tiết kiệm chi phí\n${topic} giúp doanh nghiệp giảm chi phí vận hành và tăng lợi nhuận.\n\n## Cách triển khai ${topic}\n\n### Bước 1: Đánh giá hiện trạng\nTrước khi bắt đầu, cần phân tích kỹ lưỡng tình hình hiện tại của doanh nghiệp.\n\n### Bước 2: Xây dựng kế hoạch\nLập kế hoạch chi tiết với mục tiêu rõ ràng và lộ trình cụ thể.\n\n### Bước 3: Triển khai từng bước\nThực hiện theo từng giai đoạn, đảm bảo kiểm soát chất lượng.\n\n## Thách thức và giải pháp\n\nViệc áp dụng ${topic} không phải lúc nào cũng suôn sẻ. Một số thách thức phổ biến bao gồm:\n\n- Thiếu kiến thức chuyên môn\n- Hạn chế về nguồn lực\n- Kháng cự thay đổi từ nhân viên\n\nĐể vượt qua những thách thức này, doanh nghiệp cần:\n\n- Đầu tư vào đào tạo nhân viên\n- Lập kế hoạch tài chính hợp lý\n- Tạo động lực và sự đồng thuận trong tổ chức\n\n## Kết luận\n\n${topic} là chìa khóa để doanh nghiệp phát triển bền vững trong thời đại số. Việc hiểu rõ và ứng dụng đúng ${topic} sẽ mang lại lợi thế cạnh tranh đáng kể. Hãy bắt đầu hành trình chuyển đổi của bạn ngay hôm nay!`
          },
          casual: {
            short: `# ${topic} - Điều bạn cần biết!\n\nHey! Bạn có biết ${topic} đang "hot" như thế nào không? Hôm nay mình sẽ chia sẻ với bạn những điều thú vị về ${topic} nhé!\n\n## ${topic} là gì?\n\n${topic} đơn giản là cách mới để làm mọi thứ trở nên dễ dàng hơn. Thay vì làm theo cách cũ, chúng ta có thể sử dụng ${topic} để:\n\n- Tiết kiệm thời gian\n- Làm việc hiệu quả hơn\n- Có kết quả tốt hơn\n\n## Tại sao nên quan tâm?\n\nThật ra, ${topic} không chỉ là xu hướng mà còn là "must-have" trong thời đại này. Nếu bạn chưa biết về ${topic}, có thể bạn đang bỏ lỡ nhiều cơ hội đấy!\n\n## Kết\n\nVậy là mình đã chia sẻ với bạn về ${topic} rồi. Hy vọng bạn thấy hữu ích và sẽ thử áp dụng nhé! 😊`
          }
        },
        social: {
          professional: {
            short: `🚀 ${topic} - Xu hướng không thể bỏ qua!\n\n✅ Tăng hiệu quả công việc\n✅ Tiết kiệm thời gian\n✅ Nâng cao chất lượng\n\n#${topic.replace(/\s+/g, '')} #Business #Innovation`,
            medium: `🌟 ${topic} đang thay đổi cách chúng ta làm việc!\n\nTrong thời đại số hóa, ${topic} không chỉ là xu hướng mà còn là yếu tố quyết định thành công.\n\n🔥 Lợi ích chính:\n• Tối ưu hóa quy trình\n• Giảm chi phí vận hành\n• Tăng khả năng cạnh tranh\n• Cải thiện trải nghiệm khách hàng\n\n💡 Bạn đã sẵn sàng cho sự thay đổi?\n\n#${topic.replace(/\s+/g, '')} #DigitalTransformation #Business #Innovation #Success`
          }
        }
      };

      // Get appropriate template
      const typeTemplates = templates[contentType] || templates.blog;
      const toneTemplates = typeTemplates[tone] || typeTemplates.professional;
      const template = toneTemplates[length] || toneTemplates.short;

      // Add keywords if provided
      let content = template;
      if (keywords) {
        const keywordList = keywords.split(',').map(k => k.trim());
        content += `\n\Từ khóa liên quan: ${keywordList.join(', ')}`;
      }

      return content;
    } catch (error) {
      console.error('Content generation error:', error);
      throw new Error('Không thể tạo nội dung');
    }
  }

  static async generateChatResponse({ message, conversationHistory }) {
    try {
      // Mock AI chat response
      // In production, integrate with OpenAI GPT, Claude, or other conversational AI
      
      const responses = {
        greeting: [
          'Xin chào! Tôi có thể giúp gì cho bạn hôm nay?',
          'Chào bạn! Tôi sẵn sàng hỗ trợ bạn về marketing và kinh doanh.',
          'Hi! Bạn cần tư vấn về điều gì?'
        ],
        content: [
          'Tôi có thể giúp bạn tạo nội dung chất lượng cao. Bạn muốn tạo loại nội dung gì? Blog, social media, hay email marketing?',
          'Để tạo nội dung hiệu quả, chúng ta cần xác định: đối tượng mục tiêu, mục đích, và kênh phân phối. Bạn có thể chia sẻ thêm về dự án của mình không?',
          'Nội dung tốt cần có: tiêu đề hấp dẫn, thông tin giá trị, và call-to-action rõ ràng. Tôi có thể giúp bạn với từng phần này.'
        ],
        marketing: [
          'Marketing hiệu quả cần chiến lược rõ ràng. Bạn đang muốn tập trung vào kênh nào? Social media, email, hay SEO?',
          'Để xây dựng chiến lược marketing, chúng ta cần phân tích: thị trường, đối thủ, và khách hàng mục tiêu. Bạn đã có dữ liệu này chưa?',
          'Tôi khuyên bạn nên bắt đầu với việc xác định USP (Unique Selling Proposition) của sản phẩm/dịch vụ. Điều gì làm bạn khác biệt?'
        ],
        seo: [
          'SEO là quá trình dài hạn nhưng rất quan trọng. Bạn muốn tối ưu cho từ khóa nào?',
          'Để SEO hiệu quả, cần tập trung vào: nghiên cứu từ khóa, tối ưu on-page, và xây dựng backlink chất lượng.',
          'Nội dung chất lượng là nền tảng của SEO. Hãy tạo nội dung giải quyết vấn đề thực tế của người dùng.'
        ],
        default: [
          'Đó là một câu hỏi thú vị! Tôi cần thêm thông tin để có thể tư vấn chính xác hơn.',
          'Tôi hiểu vấn đề của bạn. Hãy cùng phân tích từng bước để tìm giải pháp tốt nhất.',
          'Dựa trên kinh nghiệm, tôi nghĩ chúng ta nên tiếp cận vấn đề này theo hướng...'
        ]
      };

      // Simple keyword matching for response selection
      const lowerMessage = message.toLowerCase();
      let responseCategory = 'default';

      if (lowerMessage.includes('xin chào') || lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        responseCategory = 'greeting';
      } else if (lowerMessage.includes('nội dung') || lowerMessage.includes('content') || lowerMessage.includes('viết')) {
        responseCategory = 'content';
      } else if (lowerMessage.includes('marketing') || lowerMessage.includes('quảng cáo') || lowerMessage.includes('bán hàng')) {
        responseCategory = 'marketing';
      } else if (lowerMessage.includes('seo') || lowerMessage.includes('tìm kiếm') || lowerMessage.includes('google')) {
        responseCategory = 'seo';
      }

      const categoryResponses = responses[responseCategory];
      const randomResponse = categoryResponses[Math.floor(Math.random() * categoryResponses.length)];

      return randomResponse;
    } catch (error) {
      console.error('Chat response generation error:', error);
      throw new Error('Không thể tạo phản hồi');
    }
  }
}

module.exports = BusinessAIService;