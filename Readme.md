# 🏏 CricAIlytics – AI-powered Cricket Stats Assistant

**CricAIlytics** is an intelligent cricket assistant that uses Google Gemini Pro to generate in-depth career summaries, insights, and statistics about any cricketer — past or present. Just enter a player’s name and let the AI do the rest.

---

## 🚀 Live Demo

🌐 [Frontend App](https://cricailytics.vercel.app)  
🌐 [Backend API](https://cricailytics.onrender.com)

---

## 🧠 Features

- 🔍 Enter any cricketer's name (e.g. *Virat Kohli*, *M.S. Dhoni*)
- 🧠 Get AI-generated career analysis, achievements, and match insights
- 🤖 Powered by **Gemini Pro**
- 🌐 FastAPI + React + Tailwind + Render/Vercel
- 🌍 Fully CORS-enabled for seamless frontend-backend integration

---

## 🛠️ Tech Stack

### 🔹 Frontend
- **React + Vite**
- **TypeScript**
- **Tailwind CSS**
- Axios for HTTP requests
- Deployed on **Vercel**

### 🔹 Backend
- **FastAPI (Python)**
- Pydantic for request validation
- **Google Gemini Pro API** (via `google.generativeai`)
- CORS middleware
- Deployed on **Render**

---

## ⚙️ How It Works

1. **Frontend** takes user input (`player_name`)
2. Sends a POST request to `https://cricailytics.onrender.com/analyze-player/`
3. **Backend** sends a prompt to **Gemini Pro** using the player’s name
4. Gemini responds with a detailed cricket summary
5. Response is sent back to the frontend and displayed to the user

---

## 🧪 How to Use Locally

### 1️⃣ Clone the repo

git clone https://github.com/SyedFaisal30/CricAIlytics.git
cd cricailytics

2️⃣ Backend Setup

cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

pip install -r requirements.txt
🔐 Create .env file

GOOGLE_API_KEY=your_gemini_api_key_here
🔄 Run FastAPI Server

uvicorn main:app --reload
Server will run at: http://localhost:8000

3️⃣ Frontend Setup

cd frontend
npm install
🛠️ Configure .env

VITE_BACKEND_URL=http://localhost:8000
🔄 Start Frontend

npm run dev
App will run at: http://localhost:5173

📬 API Documentation
POST /analyze-player/
Request Body:


{
  "player_name": "Sachin Tendulkar"
}
Response:

{
  "result": "Sachin Ramesh Tendulkar, often regarded as the greatest..."
}
📸 Screenshots
Add screenshots or demo GIFs here showing the UI and output.

🙌 Acknowledgements
Google Gemini API

FastAPI

Vercel

Render

🤝 Contributing
Contributions, suggestions, and issues are welcome!
Feel free to fork the repo and raise a PR.

📄 License
This project is licensed under the MIT License.

💬 Contact
Created with ❤️ by Syed Faisal Abdul Rahman Zulfequar
🔗 GitHub • LinkedIn



---

Let me know if you'd like a Hindi/Urdu version, or if you want to include:
- Fallbacks if Gemini fails  
- Rate limiting / logging details  
- Team credits  

I can also generate badges, social preview images, or deploy instructions if you're making it open