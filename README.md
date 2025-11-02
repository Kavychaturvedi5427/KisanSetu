# 🌾 Kisan Setu - AI-Powered Agricultural Intelligence Platform

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Installation
```bash
# Run setup script
SETUP.bat

# Start application
START.bat
```

## 📱 Mobile Access

### Option 1: Local Network
```bash
# Get your IP address
GET_IP.bat

# Access on mobile: http://YOUR_IP:5173
```

### Option 2: QR Code
```bash
# Generate QR code for easy mobile access
QR_ACCESS.bat
```

### Option 3: Tunneling (Global Access)
```bash
# Install ngrok first: https://ngrok.com/download
MOBILE_TUNNEL.bat
```

## 🔧 Manual Setup

### Backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

### Frontend
```bash
cd react-frontend
npm install
npm run dev -- --host 0.0.0.0
```

## 🎯 Features

- **🌤️ Weather Intelligence**: Real-time weather updates
- **🛒 Digital Marketplace**: Buy/sell agricultural products
- **🤖 AI Advisory**: Intelligent farming recommendations
- **📊 Smart Dashboard**: Comprehensive farm analytics
- **👥 B2C Connections**: Direct farmer-consumer connections
- **📱 Mobile Responsive**: Full mobile support
- **🌍 Location Services**: GPS-based personalization

## 🔑 Demo Credentials

- **Admin**: admin / password
- **Registration**: Any valid data works

## 🌐 API Endpoints

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:8001
- **API Docs**: http://localhost:8001/docs

## 🛠 Troubleshooting

### Backend Issues
```bash
# Test backend only
BACKEND_ONLY.bat

# Quick API test
QUICK_TEST.bat
```

### Cache Issues
```bash
# Clear browser cache
CLEAR_CACHE.bat
```

### Mobile Issues
```bash
# Test mobile emulator
MOBILE_EMULATOR.bat
```

## 📁 Project Structure

```
KisanSetu/
├── backend/           # FastAPI backend
├── react-frontend/    # React frontend
├── START.bat         # Main startup script
├── SETUP.bat         # Installation script
└── README.md         # This file
```

## 🔒 Security Features

- JWT authentication
- Password hashing
- Admin-only user management
- Secure API endpoints
- Input validation

## 📱 Mobile Features

- Bottom navigation
- Touch-friendly interface
- Responsive design
- GPS location services
- Mobile-optimized forms

## 🌍 Location Services

- Automatic GPS detection
- Manual city selection
- Regional crop information
- Local market prices
- Nearby user connections

---

**© 2025 Kisan Setu | Empowering Farmers Through Technology**