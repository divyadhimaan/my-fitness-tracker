# Divya's 12-Week Fitness Plan

A personal Next.js web app for self-directed training — built from your TrainWithKaushik workout + diet plan.

## Features
- 📋 **Overview** — phases, weekly schedule, warmup, golden rules, milestones
- 🏋️ **Workouts** — full exercise list by day + phase, tap to check off each exercise
- 🥗 **Diet** — training day vs rest day meals, food choice guide, FAQ tips
- 📊 **Check-in** — weekly weight/measurements tracker saved to browser storage

## Setup (takes ~2 minutes)

### 1. Install Node.js
Download from https://nodejs.org (choose LTS version)

### 2. Open this folder in terminal
```bash
cd divya-fitness
```

### 3. Install dependencies
```bash
npm install
```

### 4. Run the app
```bash
npm run dev
```

### 5. Open in browser
Go to: **http://localhost:3000**

---

## Hosting (optional — access from your phone too)

### Option A: Vercel (free, easiest)
1. Push this folder to GitHub
2. Go to vercel.com → Import project → Deploy
3. You'll get a URL like `divya-fitness.vercel.app`

### Option B: Run on your phone via local network
When running `npm run dev`, your terminal shows something like:
```
- Local:   http://localhost:3000
- Network: http://192.168.1.x:3000
```
Open the Network URL on your phone (must be on same WiFi).

---

## Your Data
- Check-in data is saved to your browser's localStorage
- It persists between visits on the same browser
- To export: open browser console → `JSON.parse(localStorage.getItem('divya-checkins'))`
