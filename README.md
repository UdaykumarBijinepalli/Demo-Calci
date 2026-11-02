# Clean Calculator Web App with Database History & Backups

A simple, clean, full-stack calculator application that records all math calculation operations into MongoDB, complete with easy database backup and restore commands.

---

## Project Structure
```text
calculator-app/
├── backend/        # Node.js + Express + Mongoose REST API
└── frontend/       # React interactive calculator UI
```

---

## Getting Started Locally

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Make sure your MongoDB is running locally or update MONGODB_URI in .env
npm start
```
*The backend runs on `http://localhost:5000`*.

### 2. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
npm start
```
*The frontend runs on `http://localhost:3000` and automatically connects to the backend API*.

---

## Database Backups & Restores

To test backups cleanly using MongoDB tools:

### Create a Backup Snapshot
```bash
mongodump --db=calculator_db --archive=calculator_backup_$(date +%F).gz --gzip
```

### Restore from Backup
```bash
mongorestore --archive=calculator_backup_YYYY-MM-DD.gz --gzip
```
