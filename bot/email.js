// email.js
const fs = require('fs');
const path = require('path');

const webhookUrl = 'https://script.google.com/macros/s/AKfycbzwHgK7DRFY4AOtGu7wiyYs-cGSeiLNU_9BNSWwg0fMek4C3jwM5_TqCBl7RBT_T2_5ow/exec';

async function sendEmailWebhook() {
  try {
    // 1. Xác định đường dẫn tới file data.json
    const dataPath = path.join(__dirname, 'data.json');
    
    // 2. Kiểm tra xem file có tồn tại không
    if (!fs.existsSync(dataPath)) {
      console.error('❌ Không tìm thấy file data.json. Vui lòng tạo file data.json cùng thư mục.');
      process.exit(1);
    }

    // 3. Đọc và parse dữ liệu từ file
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const payload = JSON.parse(rawData);

    // 4. Kiểm tra xem các trường quan trọng có bị thiếu không
    if (!payload.email_nhan || !payload.noi_dung) {
      console.error('❌ Dữ liệu JSON không hợp lệ: Bắt buộc phải có "email_nhan" và "noi_dung".');
      process.exit(1);
    }

    console.log(`Đang gửi email với tiêu đề: "${payload.tieu_de}" tới: ${payload.email_nhan}...`);
    
    // 5. Gửi dữ liệu đi
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      redirect: 'follow' 
    });

    if (response.ok) {
      console.log('✅ Đã gửi email thành công qua Webhook!');
    } else {
      console.error('❌ Lỗi khi gửi. Mã lỗi HTTP:', response.status);
    }
  } catch (error) {
    console.error('❌ Lỗi thực thi:', error.message);
  }
}

// Chạy hàm
sendEmailWebhook();
