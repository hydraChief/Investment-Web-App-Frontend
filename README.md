# Investment Portfolio Frontend

A modern, responsive React/Next.js frontend application for managing investment portfolios. Features a beautiful UI with real-time charts, professional design, and seamless user experience.

## 🎨 Project Overview

This frontend application provides:
- **Modern Dashboard**: Real-time portfolio analytics and metrics
- **Stock Trading**: Buy, sell, and track stock investments
- **Bond Management**: Government and corporate bond trading
- **Precious Metals**: Gold, silver, platinum, and other metals trading
- **Professional UI**: Glassmorphism design with smooth animations
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Backend API running (see backend README)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Investment-Web-App-Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   npm run setup
   ```
   This will create a `.env.local` file with the backend URL configured.

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Open [http://localhost:3000](http://localhost:3000) in your browser
   - Ensure the backend is running on `http://localhost:5000`

## 🖥️ Virtual Machine Setup Instructions

### Option 1: Using VirtualBox

1. **Install VirtualBox**
   - Download from [VirtualBox.org](https://www.virtualbox.org/)
   - Install on your host machine

2. **Download Ubuntu Desktop ISO**
   - Download Ubuntu Desktop 22.04 LTS from [ubuntu.com](https://ubuntu.com/download/desktop)
   - Recommended: Ubuntu Desktop 22.04 LTS (64-bit)

3. **Create Virtual Machine**
   ```bash
   # Open VirtualBox and create new VM
   # Name: Investment-Portfolio-Frontend
   # Type: Linux
   # Version: Ubuntu (64-bit)
   # Memory: 8GB (8192 MB) minimum for smooth development
   # Hard disk: 30GB minimum
   # Enable 3D acceleration for better performance
   ```

4. **Install Ubuntu Desktop**
   - Boot from Ubuntu ISO
   - Choose "Install Ubuntu"
   - Follow installation wizard
   - Enable "Install third-party software" for better hardware support

5. **Update system**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

6. **Install Node.js**
   ```bash
   # Install Node.js 18.x
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Verify installation
   node --version
   npm --version
   ```

7. **Install additional dependencies**
   ```bash
   # Install Git
   sudo apt install git -y
   
   # Install build essentials (for native modules)
   sudo apt install build-essential -y
   
   # Install additional libraries
   sudo apt install libgtk-3-dev libwebkit2gtk-4.0-dev -y
   ```

8. **Clone and setup project**
   ```bash
   # Clone repository
   git clone <repository-url>
   cd Investment-Web-App-Frontend
   
   # Install dependencies
   npm install
   
   # Setup environment
   npm run setup
   ```

9. **Configure environment**
   ```bash
   # Edit .env.local file
   nano .env.local
   ```
   ```env
   BACKEND_URL=http://localhost:5000
   # If backend is on different VM, use the VM's IP address
   # BACKEND_URL=http://192.168.1.100:5000
   ```

10. **Start development server**
    ```bash
    # Start the frontend
    npm run dev
    
    # Access at http://localhost:3000
    # If accessing from host machine, use VM's IP address
    ```

### Option 2: Using Docker (Recommended for VM)

1. **Install Docker on VM**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   
   # Add user to docker group
   sudo usermod -aG docker $USER
   
   # Install Docker Compose
   sudo apt install docker-compose -y
   
   # Logout and login again for group changes to take effect
   ```

2. **Create Docker Compose file**
   ```bash
   # Create docker-compose.yml in project root
   nano docker-compose.yml
   ```
   ```yaml
   version: '3.8'
   services:
     frontend:
       build: .
       ports:
         - "3000:3000"
       environment:
         - BACKEND_URL=http://backend:5000
       volumes:
         - .:/app
         - /app/node_modules
       depends_on:
         - backend
   
     backend:
       image: investment-backend:latest
       ports:
         - "5000:5000"
       environment:
         - DB_HOST=mysql
         - DB_USER=investment_user
         - DB_PASSWORD=userpassword
         - DB_NAME=investment_db
       depends_on:
         - mysql
   
     mysql:
       image: mysql:8.0
       environment:
         MYSQL_ROOT_PASSWORD: rootpassword
         MYSQL_DATABASE: investment_db
         MYSQL_USER: investment_user
         MYSQL_PASSWORD: userpassword
       ports:
         - "3306:3306"
       volumes:
         - mysql_data:/var/lib/mysql
   
   volumes:
     mysql_data:
   ```

3. **Create Dockerfile**
   ```bash
   # Create Dockerfile in project root
   nano Dockerfile
   ```
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   EXPOSE 3000
   CMD ["npm", "run", "dev"]
   ```

4. **Run with Docker Compose**
   ```bash
   # Build and start services
   docker-compose up --build
   ```

## 📁 Project Structure

```
Investment-Web-App-Frontend/
├── src/
│   ├── app/                    # Next.js 13+ app directory
│   │   ├── api/               # API routes
│   │   │   ├── bonds/         # Bond-related API endpoints
│   │   │   ├── metals/        # Metal-related API endpoints
│   │   │   └── ...            # Other API endpoints
│   │   ├── dashboard/         # Dashboard page
│   │   ├── investments/       # Investments page
│   │   ├── bonds/            # Bonds page
│   │   ├── metals/           # Metals page
│   │   ├── globals.css       # Global styles
│   │   ├── layout.js         # Root layout
│   │   └── page.js           # Landing page
│   ├── components/            # Reusable components
│   │   ├── BarChart.js       # Bar chart component
│   │   ├── LineChart.js      # Line chart component
│   │   ├── PieChart.js       # Pie chart component
│   │   ├── SearchBar.js      # Search functionality
│   │   └── ...               # Other components
│   └── lib/                   # Utility libraries
│       └── api.js            # API client functions
├── public/                    # Static assets
├── setup-env.js              # Environment setup script
├── next.config.mjs           # Next.js configuration
├── package.json
└── README.md
```

## 🎨 Features

### Modern UI/UX
- **Glassmorphism Design**: Translucent cards with blur effects
- **Smooth Animations**: Heartbeat animations on metric cards
- **Professional Gradients**: Multi-layered background system
- **Responsive Layout**: Works on all device sizes

### Investment Management
- **Real-time Charts**: Interactive charts for portfolio analytics
- **Stock Trading**: Buy/sell stocks with real-time pricing
- **Bond Trading**: Government and corporate bond management
- **Precious Metals**: Gold, silver, platinum trading

### Technical Features
- **Next.js 13+**: Latest React framework with app directory
- **Chart.js Integration**: Professional data visualization
- **API Integration**: Seamless backend communication
- **TypeScript Ready**: Full TypeScript support available

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run setup` - Setup environment variables

### Environment Variables

Create a `.env.local` file in the root directory:

```env
BACKEND_URL=http://localhost:5000
```

### Development Tips

1. **Hot Reload**: Changes are reflected immediately in development
2. **Turbopack**: Faster development builds with Next.js 13+
3. **Component Development**: Use Storybook for component development
4. **API Testing**: Use the built-in API routes for testing

## 🎯 Key Pages

### Dashboard (`/dashboard`)
- Portfolio overview with key metrics
- Real-time charts and analytics
- Performance tracking

### Investments (`/investments`)
- Stock search and trading
- Portfolio management
- Transaction history

### Bonds (`/bonds`)
- Bond categories and search
- Government and corporate bonds
- Yield and maturity information

### Metals (`/metals`)
- Precious metals trading
- Gold, silver, platinum
- Price tracking and analytics

## 🐛 Troubleshooting

### Common Issues

1. **Backend Connection Error**
   - Ensure backend is running on `http://localhost:5000`
   - Check `BACKEND_URL` in `.env.local`
   - Verify network connectivity

2. **Port Already in Use**
   - Change port: `npm run dev -- -p 3001`
   - Kill process: `sudo lsof -ti:3000 | xargs kill -9`

3. **Build Errors**
   - Clear cache: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`

### VM-Specific Issues

1. **Display Issues**
   ```bash
   # Install additional display drivers
   sudo apt install mesa-utils -y
   
   # Enable 3D acceleration in VirtualBox
   # Settings > Display > Enable 3D Acceleration
   ```

2. **Performance Issues**
   ```bash
   # Increase VM memory to 8GB minimum
   # Enable multiple CPU cores
   # Use SSD storage if possible
   ```

3. **Network Configuration**
   ```bash
   # Allow port 3000
   sudo ufw allow 3000
   sudo ufw enable
   
   # Check network adapter settings
   # Bridge adapter recommended for development
   ```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the component documentation
- Check Next.js documentation

## 🔗 Related Links

- [Backend Repository](../Investment-Web-App)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Chart.js Documentation](https://www.chartjs.org/docs)
