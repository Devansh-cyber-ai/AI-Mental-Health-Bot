# 🧠 AI Mental Health Bot

An AI-powered mental health support chatbot that provides empathetic, confidential conversations and connects users with professional mental health providers.

## ✨ Features

- **AI-Powered Chat** — Empathetic, context-aware conversations using Gemini & Groq AI models
- **User Authentication** — Secure signup/login with JWT-based sessions
- **Provider Directory** — Browse and connect with mental health professionals near you
- **Modern UI** — Responsive, beautifully designed interface built with React + Vite
- **Secure Backend** — Express.js REST API with MongoDB for data persistence

## 🛠️ Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React, Vite, React Router           |
| Backend    | Node.js, Express.js                 |
| Database   | MongoDB (Mongoose ODM)              |
| AI         | Google Gemini, Groq, Cohere         |
| Auth       | JWT, bcryptjs                       |

## 📁 Project Structure

```
ai-mental-health-bot/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── pages/          # Home, Chat, Login, Signup
│   │   ├── App.jsx         # Root component & routing
│   │   └── main.jsx        # Entry point
│   └── index.html
├── server/                 # Express backend
│   ├── models/             # Mongoose schemas (User)
│   ├── routes/             # API routes (auth, chat, providers)
│   ├── middleware/          # Auth middleware
│   ├── db.js               # MongoDB connection
│   └── index.js            # Server entry point
├── .env                    # Environment variables (not committed)
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (or local MongoDB)
- API keys for [Google Gemini](https://ai.google.dev/), [Groq](https://console.groq.com/), and [Cohere](https://cohere.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-username>/ai-mental-health-bot.git
   cd ai-mental-health-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd client && npm install && cd ..
   ```

3. **Configure environment variables**

   Create a `.env` file in the project root:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   GROQ_API_KEY=your_groq_api_key
   COHERE_API_KEY=your_cohere_api_key
   ```

4. **Run the app**
   ```bash
   npm run dev
   ```
   This starts the backend (port 5000) and frontend (port 5173) concurrently.

## 📜 Available Scripts

| Command           | Description                              |
|-------------------|------------------------------------------|
| `npm run dev`     | Start both client & server in dev mode   |
| `npm run server`  | Start only the backend (nodemon)         |
| `npm run client`  | Start only the frontend (Vite)           |
| `npm start`       | Start the server in production mode      |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.
