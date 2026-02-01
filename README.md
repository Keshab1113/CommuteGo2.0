# 🚀 CommuteGo – Smart Commute Planner & Analytics Platform

**CommuteGo** is a full-stack, backend-driven travel and commute optimization platform that helps users plan smarter routes based on **time, cost, and sustainability**, while providing **admin-level analytics and system insights**.

> **Smarter routes. Better journeys.**

---

## 🧠 Why CommuteGo?

Daily commuters and travelers often struggle with:
- Choosing the most efficient route
- Understanding true travel cost and time
- Comparing multiple transport modes
- Lack of analytics and insights

**CommuteGo solves this by centralizing commute intelligence into a single platform**, with all decision-making handled on the backend for scalability and accuracy.

---

## ✨ Key Features

### 👤 User Features
- Plan commutes using source, destination, date, and time
- View backend-generated route options:
  - Cab, Bus, Train, Metro, Walk, Mixed
- See pre-calculated:
  - Total travel time
  - Estimated cost
  - Carbon footprint
- View commute history
- Secure JWT-based authentication

---

### 🛠️ Admin Features
- Role-based admin access
- System-wide metrics:
  - Total users
  - Routes planned
  - Peak commute hours
  - Most-used transport modes
- Analytics dashboards:
  - Commutes per day (Line chart)
  - Revenue trend (Line chart)
  - Peak hours (Bar chart)
  - Transport mode distribution (Pie chart)
- **Manual refresh-based polling** for analytics  
  (No WebSockets, no auto polling — hosting friendly)

---

## 🧱 Architecture Overview

### Backend (Primary Intelligence Layer)
- **Node.js + Express**
- **MySQL**
- REST API–first architecture
- All business logic handled server-side:
  - Route optimization
  - Cost & time calculation
  - Ranking & analytics
- Role-based access control (`user`, `admin`)

### Frontend (Display-Only Layer)
- **React**
- **Tailwind CSS**
- **shadcn/ui**
- **Recharts**
- Frontend responsibilities:
  - API consumption
  - UI rendering
  - ZERO business logic

---

## 🔐 Security
- JWT-based authentication
- Role embedded in JWT payload
- Admin APIs protected on backend
- Frontend role checks for UX only

---

## 🔄 Real-Time Strategy (Hosting Aware)

Due to serverless and free-tier hosting constraints:
- ❌ WebSockets not used
- ❌ Automatic polling disabled
- ✅ **Manual refresh button** triggers data fetch
- Optimized for **Vercel (frontend)** and **Render Free (backend)**

---

## 🗄️ Database Design (MySQL)

Key tables:
- `users` (with roles)
- `routes`
- `route_options` (computed backend data)
- `commute_history`
- `alerts`

All analytics are generated using **SQL aggregation queries**.

---

## 📁 Project Structure

```bash
commutego/
├── backend/
│   ├── modules/
│   ├── middlewares/
│   ├── utils/
│   └── server.js
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── routes/
│   └── api/
````

---

## 🚀 Deployment

* **Frontend:** Vercel
* **Backend:** Render (Free Tier)
* Environment variables used for configuration
* CORS and role-based security enforced

---

## 🧾 Resume Highlights

* Backend-driven system design with MySQL analytics
* Role-based routing and access control
* Hosting-aware architectural decisions
* Clean separation of frontend and backend responsibilities
* Real-world SaaS-style admin dashboard

---

## 📌 Future Enhancements

* Redis caching for analytics APIs
* Date-range filters for admin charts
* Progressive Web App (PWA) support
* Paid-tier real-time updates

---

## 👨‍💻 Author

**Keshab Das**
2025 passout, B.Tech (IT) | Full Stack Developer
Skills: React, Node.js, Express, MySQL, MongoDB, Tailwind CSS

---

## 📜 License

This project is licensed for educational and portfolio use.

---

⭐ If you like this project, feel free to star the repository!


