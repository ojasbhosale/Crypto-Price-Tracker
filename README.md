# 📈 Real-Time Crypto Price Tracker  

A responsive **cryptocurrency price tracker** built with Next.js, Redux Toolkit, and TypeScript. This application displays real-time cryptocurrency data with simulated WebSocket updates.

---

## 🔗 Deployed Link  
- [https://crypto-price-ojas.netlify.app](https://crypto-price-ojas.netlify.app)

---

## ✅ Features

- 🔥 Real-time price updates (simulated WebSocket)  
- 📱 Fully responsive design for all devices  
- 🌗 Dark/Light mode support  
- 📊 7-day price charts for each cryptocurrency  
- 🛠️ Sorting and filtering capabilities  
- 🟢🔴 Color-coded price changes  
- 🗂️ State management with Redux Toolkit  

---

## 🛠️ Tech Stack  

- **Framework**: Next.js 14 (App Router)  
- **State Management**: Redux Toolkit  
- **Styling**: Tailwind CSS with shadcn/ui components  
- **Charts**: Chart.js with react-chartjs-2  
- **API**: CoinGecko (Free Tier)  
- **Language**: TypeScript  

---

## 🏗️ Architecture  

The application follows a clean architecture pattern:  

- **Components**: UI components for rendering the interface  
- **Redux Store**: Centralized state management  
  - Crypto slice for managing cryptocurrency data  
  - Async thunks for API calls  
- **API Integration**: CoinGecko API for fetching real cryptocurrency data  
- **WebSocket Simulation**: Interval-based updates to simulate real-time data  

---

## 🚀 Setup Instructions  

1. **Clone the repository:**  

   ```bash
   git clone https://github.com/yourusername/crypto-price-tracker.git
   cd crypto-price-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

---

## Build for Production

```bash
npm run build
npm start
```

---

## Deployment

The application can be easily deployed to Vercel:

```bash
npm install -g vercel
vercel
```

---

## Future Enhancements

- Integration with real WebSocket APIs (Binance, CoinGecko Pro)
- Portfolio tracking functionality
- Price alerts and notifications
- Historical data visualization
- Mobile app with React Native

---

## License

- This project is licensed under the MIT License.