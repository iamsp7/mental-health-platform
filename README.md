# 🧠 Mental Health Platform (AI‑Assisted)

A full‑stack **AI‑assisted mental health support platform** built as an academic project.
The system helps users reflect on emotions through journaling, visualize mood patterns, and access supportive resources.

This repository contains **all three layers** of the project:

* 🌐 Frontend (React + Tailwind CSS)
* ⚙️ Backend (Java Spring Boot)
* 🤖 ML Service (Python – NLP & emotion analysis)

---

## ▶️ Live Demo (Frontend)

The frontend is deployed using **GitHub Pages** and can be accessed directly:

🔗 **Live URL:**
[https://iamsp7.github.io/mental-health-platform/](https://iamsp7.github.io/mental-health-platform/)

### Demo Instructions

* Click **Login**
* Enter **any username & password** (Demo Mode)
* Explore dashboard, journal UI, mood history, doctors & support pages

> ⚠️ The live demo runs in **Frontend‑only Demo Mode**.
> Backend and ML services are included in this repository but are **not deployed publicly**.

---

## 📁 Repository Structure

```
mental-health-platform/
├── frontend/        # React + Tailwind CSS (GitHub Pages)
├── backend/         # Java Spring Boot REST API
├── ml-service/      # Python ML (FastAPI / NLP models)
└── README.md
```

---

## ✨ Key Features

### Frontend

* Modern glassmorphism UI
* Responsive design (mobile & desktop)
* Journal writing with smooth animations
* Mood history visualization
* Doctors & appointment UI
* Music & video‑based emotional support
* Toast notifications & micro‑interactions

### Backend (Spring Boot)

* User authentication (JWT)
* Journal entry management
* Mood & appointment APIs
* Secure REST architecture

### ML Service (Python)

* Emotion classification (Anxiety, Depression, etc.)
* Suicide‑risk probability scoring
* NLP using transformer‑based embeddings
* REST API for inference

---

## 🛠️ Technology Stack

| Layer      | Tech                              |
| ---------- | --------------------------------- |
| Frontend   | React, Tailwind CSS, React Router |
| Backend    | Java Spring Boot, JPA, JWT        |
| ML         | Python, FastAPI, Transformers     |
| Deployment | GitHub Pages (Frontend)           |

---

## ▶️ Run Locally (Optional)

### 1️⃣ Frontend

```bash
cd frontend
npm install
npm start
```

Runs at: `http://localhost:3000`

### 2️⃣ Backend

```bash
cd backend
./mvnw spring-boot:run
```

Runs at: `http://localhost:8080`

### 3️⃣ ML Service

```bash
cd ml-service
pip install -r requirements.txt
python app.py
```

Runs at: `http://127.0.0.1:8000`

---

## 🎓 Academic Use

This project is suitable for:

* Final‑year CSE / AIML projects
* AI + Web integration demonstrations
* UI/UX evaluation
* System architecture & deployment explanation

---

## 👨‍💻 Author

**iamsp7**
Final Year Computer Science (AI / ML)

---

## ⭐ Acknowledgement

This project was developed for academic learning in the domain of **AI‑assisted mental health support systems**, focusing on responsible AI, usability, and real‑world deployment considerations.

---

> *“Technology cannot replace care, but it can help people reach it.”* 💙
