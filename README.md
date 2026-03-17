# 🚀 CommuteGo — Smart Commute Planner & Analytics Platform

<div align="center">

![React](https://img.shields.io/badge/React-18.3-blue?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20.x-green?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express-4.x-gray?style=for-the-badge&logo=express)
![MySQL](https://img.shields.io/badge/MySQL-8.x-00758f?style=for-the-badge&logo=mysql)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38bdf8?style=for-the-badge&logo=tailwind-css)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?4style=for-the-badge&logo=vercel)

**Smarter routes. Better journeys.**

*A full-stack, backend-driven travel and commute optimization platform*

[🌐 Live Demo](https://commutego.vercel.app) • [📖 Documentation](#-documentation) • [🐛 Report Bug](https://github.com/keshabdas/commutego/issues) • [💬 Discussions](https://github.com/keshabdas/commutego/discussions)

</div>

---

## ✨ Why CommuteGo?

Daily commuters and travelers often struggle with:

- ❌ Choosing the most efficient route
- ❌ Understanding true travel cost and time
- ❌ Comparing multiple transport modes
- ❌ Lack of analytics and insights

**CommuteGo solves this by centralizing commute intelligence into a single platform**, with all decision-making handled on the backend for scalability and accuracy.

---

## 🧠 Key Features

### 👤 User Features

| Feature | Description |
|---------|-------------|
| 🚗 **Smart Route Planning** | Plan commutes using source, destination, date, and time |
| 🚌 **Multiple Transport Modes** | View routes via Cab, Bus, Train, Metro, Walk, or Mixed |
| ⏱️ **Time Estimation** | Pre-calculated total travel time for each route |
| 💰 **Cost Analysis** | Detailed cost breakdown for every option |
| 🌱 **Carbon Footprint** | Environmental impact tracking for eco-friendly decisions |
| 📊 **Commute History** | View and manage past commute records |
| 🔐 **Secure Authentication** | JWT-based authentication with role management |

### 🛠️ Admin Features

| Feature | Description |
|---------|-------------|
| 👑 **Role-Based Access** | Secure admin dashboard with role checks |
| 📈 **System Metrics** | Total users, routes planned, peak hours |
| 📊 **Analytics Dashboard** | Interactive charts and visualizations |
| 📉 **Commutes Per Day** | Line chart showing daily commute trends |
| 💵 **Revenue Tracking** | Revenue trend analysis |
| ⏰ **Peak Hours Analysis** | Bar chart for peak commute times |
| 🥧 **Mode Distribution** | Pie chart for transport mode usage |

### ✈️ Flight Booking Features

| Feature | Description |
|---------|-------------|
| 🔍 **Flight Search** | Search flights by origin, destination, date, passengers |
| 📋 **Flight Details** | View pricing, amenities, seat availability, ratings |
| 🎫 **Easy Booking** | Multi-step booking with passenger info and add-ons |
| 📄 **Booking Management** | View, modify, and cancel flight bookings |
| 🚌 **Multi-Modal Transport** | Compare flights, buses, and trains |
| 💳 **Secure Payments** | Mock payment integration with booking confirmation |

---

## 🏗️ Architecture Overview

### Backend (Primary Intelligence Layer)

```
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND (Node.js + Express)            │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Routes    │  │ Analytics   │  │   Optimization      │ │
│  │  Controller │  │  Controller │  │     Agent           │ │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘ │
│         │                │                     │            │
│  ┌──────┴────────────────┴─────────────────────┴──────────┐ │
│  │                    Services Layer                        │ │
│  │  • Route Optimization  • Cost Calculation  • Analytics │ │
│  └──────────────────────────┬───────────────────────────────┘ │
│                             │                                 │
│  ┌──────────────────────────┴───────────────────────────────┐ │
│  │                    Database (MySQL)                       │ │
│  │  users | routes | route_options | commute_history | alerts│ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ REST API
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                   │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │
│  │   Pages     │  │ Components │  │      Hooks          │   │
│  │  • Home     │  │ • RouteCard │  │ • useCommuteQueries │   │
│  │  • Plan     │  │ • Charts    │  │ • useAlertQueries   │   │
│  │  • Admin    │  │ • UI        │  │                     │   │
│  └─────────────┘  └─────────────┘  └─────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Tech Stack

#### Backend

- **Runtime:** Node.js 20.x
- **Framework:** Express.js
- **Database:** MySQL 8.x
- **Authentication:** JWT (JSON Web Tokens)
- **Architecture:** REST API-first

#### Frontend

- **Framework:** React 18.3
- **Build Tool:** Vite
- **Styling:** Tailwind CSS 3.x
- **UI Components:** shadcn/ui
- **Charts:** Recharts
- **Routing:** React Router DOM

---

## 🔐 Security

- ✅ JWT-based authentication
- ✅ Role embedded in JWT payload
- ✅ Admin APIs protected on backend
- ✅ Frontend role checks for UX only
- ✅ CORS enabled with strict origin control
- ✅ Password hashing with bcrypt

---

## 📁 Project Structure

```
CommuteGo2.0/
├── client/                          # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── commute/             # Commute-related components
│   │   │   │   ├── AgentInsights.jsx
│   │   │   │   ├── AgentLoading.jsx
│   │   │   │   ├── AgentRouteCard.jsx
│   │   │   │   └── RouteCard.jsx
│   │   │   ├── dashboard/           # Dashboard components
│   │   │   │   ├── RouteVisualization.jsx
│   │   │   │   └── StatsCard.jsx
│   │   │   ├── layout/             # Layout components
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Layout.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Sidebar.jsx
│   │   │   └── ui/                 # UI components (shadcn)
│   │   │       ├── button.tsx
│   │   │       ├── card.tsx
│   │   │       ├── dialog.tsx
│   │   │       └── ...
│   │   ├── pages/                  # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── PlanCommute.jsx
│   │   │   ├── AgenticPlanCommute.jsx
│   │   │   ├── AdminDashboard/
│   │   │   └── ...
│   │   ├── context/                # React contexts
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/                  # Custom hooks
│   │   │   ├── useCommuteQueries.js
│   │   │   └── useAlertQueries.js
│   │   ├── services/               # API services
│   │   │   └── api.js
│   │   └── lib/                    # Utilities
│   │       └── utils.ts
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                          # Backend (Node.js + Express)
│   ├── agents/                     # AI Agents
│   │   ├── AnalyticsAgent.js
│   │   ├── OptimizationAgent.js
│   │   ├── PlanningAgent.js
│   │   └── Orchestrator.js
│   ├── controllers/                # Route controllers
│   │   ├── authController.js
│   │   ├── commuteController.js
│   │   ├── analyticsController.js
│   │   └── adminController.js
│   ├── middlewares/                # Express middlewares
│   │   ├── auth.js
│   │   └── roleCheck.js
│   ├── models/                      # Database models
│   │   ├── User.js
│   │   ├── Route.js
│   │   ├── RouteOption.js
│   │   └── Alert.js
│   ├── routes/                     # API routes
│   │   ├── auth.js
│   │   ├── commute.js
│   │   ├── analytics.js
│   │   └── admin.js
│   ├── services/                   # Business logic
│   │   ├── routeService.js
│   │   ├── analyticsService.js
│   │   └── optimizationService.js
│   ├── config/                      # Configuration
│   │   ├── database.js
│   │   └── appConfig.js
│   ├── utils/                       # Utilities
│   │   ├── calculations.js
│   │   ├── jwt.js
│   │   └── validators.js
│   ├── app.js
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 18.x |
| npm | ≥ 9.x |
| MySQL | ≥ 8.x |

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/keshabdas/commutego.git
   cd CommuteGo2.0
   ```

2. **Setup Backend**

   ```bash
   cd server
   npm install
   # Configure your database in config/database.js
   npm run dev
   ```

3. **Setup Frontend**

   ```bash
   cd client
   npm install
   npm run dev
   ```

4. **Environment Variables**

   Create `.env` files by copying from `.env.example`:

   ```bash
   # Server configuration
   cp .env.example server/.env
   
   # Client configuration
   echo "VITE_API_URL=http://localhost:5000/api" > client/.env
   ```

   **Required Server Variables:**

   | Variable | Description |
   |----------|-------------|
   | `DB_HOST` | MySQL database host |
   | `DB_USER` | MySQL username |
   | `DB_PASSWORD` | MySQL password |
   | `DB_NAME` | Database name (commutego) |
   | `JWT_SECRET` | Secret key for JWT tokens |

   **Optional API Keys:**

   | Variable | Description | Required |
   |----------|-------------|----------|
   | `TINYFISH_API_KEY` | API key for real transportation data | No (falls back to mock data) |
   | `GOOGLE_MAPS_API_KEY` | API key for geocoding & directions | No |

   > **Note:** Without `TINYFISH_API_KEY`, the system uses realistic mock data for testing. Get your free API key at [tinyfish.ai](https://tinyfish.ai)

---

## 📊 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/profile` | Get user profile |

### Commute

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/commute/plan` | Plan a commute |
| GET | `/api/commute/history` | Get commute history |
| GET | `/api/commute/routes/:id` | Get route details |

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/overview` | Get analytics overview |
| GET | `/api/analytics/commutes` | Get commute analytics |
| GET | `/api/analytics/modes` | Get transport mode stats |

### Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | List all users |
| GET | `/api/admin/stats` | Get system stats |
| PUT | `/api/admin/users/:id` | Update user |

---

## 🔄 Real-Time Strategy

Due to serverless and free-tier hosting constraints:

- ❌ WebSockets not used
- ❌ Automatic polling disabled
- ✅ **Manual refresh button** triggers data fetch
- ✅ Optimized for **Vercel (frontend)** and **Render Free (backend)**

---

## 🎨 UI Screenshots

The application features:

- 🌙 **Dark/Light Mode** support
- 📱 **Responsive Design** for all devices
- 🎭 **Smooth Animations** and transitions
- 📊 **Interactive Charts** with Recharts
- 🃏 **Card-based** route displays

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## 📌 Future Enhancements

- [ ] Redis caching for analytics APIs
- [ ] Date-range filters for admin charts
- [ ] Progressive Web App (PWA) support
- [ ] Paid-tier real-time updates
- [ ] Mobile app (React Native)
- [ ] AI-powered route recommendations

---

## 👨‍💻 Author

<div align="center">

**Keshab Das**

*2025 Passout, B.Tech (IT) | Full Stack Developer*

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Keshab1113)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/keshab-das-6a84ab234/)

*Skills: React, Node.js, Express, MySQL, MongoDB, Tailwind CSS*

</div>

---

## 📜 License

This project is licensed for educational and portfolio use.

---

## ⭐ Show Your Support

If you found this project helpful, please give it a ⭐️!

[![Star](https://img.shields.io/github/stars/keshabdas/commutego?style=for-the-badge&logo=github)](https://github.com/keshabdas/commutego/stargazers)

---

<div align="center">

*Built with ❤️ using React, Node.js, and MySQL*

</div>


