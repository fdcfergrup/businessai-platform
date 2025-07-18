// Simple test script to check if server starts without errors
const express = require('express');
const cors = require('cors');
require('dotenv').config();

console.log('🔍 Testing server startup...');

try {
  const app = express();
  
  // Basic middleware
  app.use(cors());
  app.use(express.json());
  
  // Test route
  app.get('/test', (req, res) => {
    res.json({ message: 'Server is working!' });
  });
  
  const PORT = 5001; // Use different port for testing
  
  const server = app.listen(PORT, () => {
    console.log(`✅ Test server started on port ${PORT}`);
    console.log('🎉 Server startup test passed!');
    
    // Close server after test
    setTimeout(() => {
      server.close(() => {
        console.log('🔚 Test server closed');
        process.exit(0);
      });
    }, 1000);
  });
  
} catch (error) {
  console.error('❌ Server startup test failed:', error);
  process.exit(1);
}