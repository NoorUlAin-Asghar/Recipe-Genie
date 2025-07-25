
# Recipe Genie 🍳

**Recipe Genie** is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application that allows users to discover, post, and share recipes with an interactive AI-powered cooking assistant. Designed for home cooks and food enthusiasts the app features personalized dashboards, real-time ingredient scaling via AI Chatbot, cooking timers, and social engagement tools such as likes and subscriptions.

---

## 🔗 Features

- 🔐 **User Authentication** (JWT-based): Sign up, login, manage profile
- 📜 **Recipe Posting**: Upload recipes with ingredients, instructions, cooking time, servings and images
- ❤️ **Likes and Comments**: Interact with recipes via likes and comments
- 📥 **Subscribe to Creators**: Follow your favorite users and get a custom feed
- ⏲️ **Built-in Timer**: Track your cooking time directly within the recipe
- 🤖 **AI Chatbot Integration**: Get cooking tips, ingredient alternatives, and scaled recipe suggestions via Groq API
- 🖥️ **Desktop-First Design**: Optimized for laptops and PCs (not responsive for mobile)

---

## 🛠️ Tech Stack

| Layer           | Technology                         |
|-----------------|------------------------------------|
| Frontend        | React.js, HTML, CSS                |
| Backend         | Node.js, Express.js                |
| Database        | MongoDB (with Mongoose ODM)        |
| Authentication  | JWT (JSON Web Token)               |
| AI Assistant    | Groq API                           |
| Version Control | Git & GitHub                       |

---

## 📷 Demo

Mockup previews available in [`/mockups`](mockups/)

---

## 📁 Folder Structure

```bash
recipe-genie/
├── Frontend/           # React frontend
│   └── public/
│   └── src/
│       ├── components/ # Reusable React UI components (e.g., Navbar, RecipeCard)
│       ├── pages/      # Different page views (e.g., Home, Login, Profile)
│       ├── api.js      # Axios API calls to backend endpoints
│       └── App.js      # Root component that defines routes and layout
├── Backend/            # Node.js + Express backend
│   ├── contollers/     # Functions that handle business logic for routes (e.g., login, getRecipe, getProfile, createComment)
│   ├── middleware/     # Custom middlewares (auth checker)
│   ├── models/         # Mongoose models/schemas for MongoDB collections (e.g., User, Recipe, Comment)
│   ├── routes/         # Route definitions (e.g., /auth, /recipes)
│   ├── uploads/        # Stores images uploaded by users (stored locally)
│   └── server.js       # Main entry point for the Express server
├── .gitignore          # Ignores node_modules, env, uploads/ etc
└── README.md

```

---

## 🚀 Getting Started

### Prerequisites
- Node.js and npm
- MongoDB atlas
- Git

### Installation

**1. Clone the repo**
```bash
git clone https://github.com/NoorUlAin-Asghar/Recipe-Genie.git
cd recipe-genie
```

**2. Install dependencies**

Frontend:
```bash
cd Frontend
npm install
```

Backend:
```bash
cd ../Backend
npm install
```

**3. Create `.env` files**

In `/Backend/.env`:

```env
PORT=3001
MONGO_URI=<your-mongodb-atlas-connection-string>
JWT_SECRET=<your_jwt_secret>
```

**4. Create uploads folder** 
```bash
cd /Backend/uploads
```

**5. Run the app**

```bash
# In /Frontend
npm start

# In /Backend (separate terminal)
nodemon server.js
```

run localhost:3000 on browser 

---

## 🔐 Environment Variables

- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for token signing
- `GROQ_API_KEY`: API key for AI chatbot (if applicable)

---

## 🤝 Contributors

- Noor Ul Ain Asghar
- Huma Fatima
- Zainab

---

## 📄 License

This project is licensed for educational and demo purposes.


