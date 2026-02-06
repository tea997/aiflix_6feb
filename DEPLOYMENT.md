# AIFlix Deployment Guide

## Architecture
- **Frontend**: [Vercel](https://vercel.com) (Vite React App)
- **Backend**: [Render](https://render.com) (Node.js Express Server)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---

## 🚀 Step 1: Deploy Backend to Render

1.  Connect your GitHub repository to Render.
2.  Create a new **Web Service**.
3.  Set **Root Directory** to `AIFlix-main/backend`.
4.  **Environment Variables**:
    *   `MONGO_URI`: (Your MongoDB connection string)
    *   `JWT_SECRET`: (A random secure string)
    *   `CLIENT_URL`: `https://your-frontend-url.vercel.app` (Add this *after* frontend is deployed)
    *   `NODE_ENV`: `production`
5.  **Build Command**: `npm install`
6.  **Start Command**: `npm start`

---

## 🎨 Step 2: Deploy Frontend to Vercel

1.  Connect your GitHub repository to Vercel.
2.  Create a new project and select the root directory: `AIFlix-main/frontend`.
3.  **Environment Variables**:
    *   `VITE_API_URL`: `https://your-backend-url.onrender.com/api`
    *   `VITE_GOOGLE_GENAI_API_KEY`: (Your Google Generative AI API Key)
4.  **Build Settings**: (Defaults are fine, check that it detected Vite).
5.  Click **Deploy**.

---

## ⚡ Important Notes
*   **CORS**: Once the frontend is deployed, copy its URL and update the `CLIENT_URL` in your Render backend environment variables.
*   **Cookies**: We have configured the server to use `sameSite: "none"` and `secure: true` to allow authentication to work across different domains (Vercel and Render).
