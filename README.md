# AI Resume Analyzer 📄🚀

AI Resume Analyzer is a full-stack, AI-powered web application that helps job seekers optimize their resumes for target roles. By analyzing a resume alongside a job description, the application calculates match scores, evaluates ATS (Applicant Tracking System) compatibility, highlights key strengths, identifies missing keywords or skills, and provides actionable AI-generated recommendations to improve the resume.

---

## 🌟 Features

- **Multi-Format Support**: Upload resumes in either **PDF** or **DOCX** format.
- **AI-Powered Insights**: Get instant matching statistics and feedback powered by Google's **Gemini API** (`gemini-2.5-flash`).
- **ATS & Job Match Scoring**: Visual gauge showing ATS compatibility and job alignment percentage.
- **Key Strengths**: Highlight what sections or aspects of your resume stand out for the role.
- **Missing Skills Identification**: Extract required keywords and skills from the job description that are missing in your resume.
- **Actionable Suggestions**: Bulleted AI recommendations to improve your resume content and formatting.
- **Analysis History**: Access and review your previous analyses directly from your personal dashboard.
- **Zero-Config Database**: Utilizes an automated **in-memory MongoDB database** (`mongodb-memory-server`) for local development, allowing the app to run instantly without requiring a pre-installed MongoDB database.

---

## 🛠️ Tech Stack

### Frontend
- **React.js** (built with **Vite** for fast HMR)
- **Tailwind CSS** (modern utility-first styling)
- **Lucide React** (beautiful UI icons)
- **Axios** (API requests)
- **React Router Dom** (routing and navigation)

### Backend
- **Node.js** & **Express**
- **MongoDB** & **Mongoose** (using in-memory server as a local fallback)
- **Google Generative AI SDK** (Gemini API integration)
- **Multer** (handling file uploads)
- **pdf-parse** & **mammoth** (extracting raw text from PDF and Word documents)
- **JSON Web Tokens (JWT)** & **Bcrypt.js** (secure authentication)

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- A Google Gemini API Key. You can get a free key from [Google AI Studio](https://aistudio.google.com/).

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/indrijaroy-07/AI-resume-analyzer.git
   cd AI-resume-analyzer
   ```

2. **Install Frontend Dependencies**:
   Navigate to the root directory and install dependencies:
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**:
   Navigate to the backend directory and install dependencies:
   ```bash
   cd resume-backend
   npm install
   ```

---

## ⚙️ Environment Configuration

Create a file named `.env` in the `resume-backend` directory and add the following variables:

```env
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
GEMINI_API_KEY=your_google_gemini_api_key_here

# Optional: Add a persistent MongoDB connection string if you don't want to use the in-memory database
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
```

---

## 🏃 Running the Application

### 1. Start the Backend Server
From the `resume-backend` directory:
```bash
npm run dev
```
The backend server will run on `http://localhost:5000` and start a transient in-memory MongoDB database.

### 2. Start the Frontend Server
Open a new terminal window, navigate back to the project root directory, and start the Vite dev server:
```bash
npm run dev
```
The frontend application will start on `http://localhost:5173`. Open this URL in your web browser.

---

## 🔒 Security Note

The `resume-backend/.env` file containing sensitive API keys and secrets is excluded from version control via `.gitignore` to prevent leaks. Never commit your `.env` file to public repositories.
