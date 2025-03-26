# Project Setup Guide

Project Info: This project is a scalable backend system for processing CSV files using an in-memory queue. It supports concurrent uploads, tracks file processing status, and computes NPIs per state per year. The system ensures non-blocking processing with real-time status updates and error handling.

This project consists of two main parts:
- **Frontend** (located in the `frontend` folder)
- **Backend** (located in the `backend` folder)

## 🚀 Getting Started

📥 Cloning the Repository

First, clone the repository to your local machine:

```sh 
git clone https://github.com/naquiyaa/csv-processor.git
```

### 1️⃣ Running the Backend

1. Navigate to the `backend` folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the backend server:
   ```sh
   npm run dev
   ```
### 2️⃣ Running the Frontend

1. Navigate to the `frontend` folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
## 📌 Notes
- Make sure you have **Node.js** and **npm** installed.
- Run the backend **before** the frontend to ensure API connections work correctly.


## 📄 File Structure
```
csv-processor/
│── frontend/   # Frontend application
│── backend/    # Backend application
│── README.md   # Project setup guide
```

