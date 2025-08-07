const fs = require('fs');
const path = require('path');

const envContent = `BACKEND_URL=http://localhost:5000
`;

const envPath = path.join(__dirname, '.env.local');

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env.local file created successfully!');
  console.log('🔗 Backend URL set to: http://localhost:5000');
} else {
  console.log('⚠️  .env.local file already exists');
}

console.log('\n📋 Next steps:');
console.log('1. Make sure the backend is running on port 5000');
console.log('2. Run: npm run dev');
console.log('3. Access the app at: http://localhost:3000'); 