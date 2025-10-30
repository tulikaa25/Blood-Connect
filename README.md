# 🩸 BloodConnect – Blood Donation Management System

A full-stack web platform designed to **streamline the entire blood donation lifecycle** — from donor registration and eligibility screening to appointment scheduling and QR-based verification.  
Built using **Node.js, Express, MongoDB, and React**, BloodConnect simplifies donor–admin coordination while ensuring efficiency, transparency, and security.

---

## 🚨 Problem Statement

Traditional blood donation processes are often **manual, inefficient, and error-prone**.  
Hospitals and donation centers struggle with:
- Managing donor eligibility and scheduling efficiently.  
- Handling repeated registrations and last-minute ineligibility issues.  
- Tracking appointments and verifying donor identities accurately.  
- Monitoring donation activity and center performance.  

These inefficiencies lead to **time wastage**, **donor drop-offs**, and **underutilized resources** in donation centers.

---

## 💡 Solution

**BloodConnect** digitizes and automates the entire donation workflow:
- Donors can register, check eligibility, and book slots online.  
- Admins can manage center operations, view analytics, and verify donors via QR codes.  
- The system ensures that only **eligible donors** are scheduled, **reducing congestion and improving efficiency** at donation centers.  

By automating donor screening and appointment management, BloodConnect helps **save time**, **optimize capacity**, and **increase overall donation throughput**.

---

## ✨ Key Features

### 👥 Role-Based Authentication
Secure login and registration using **JWT**, with separate dashboards for donors and admins.

### 🧾 Donor Eligibility Screening
Interactive health questionnaire that evaluates donor readiness based on predefined medical criteria — **preventing ineligible donors** from booking slots and **saving valuable time for center as well as ineligible persons**.

### 📅 Appointment Scheduling & Verification
- Real-time slot booking system with **capacity-based availability** and **conflict prevention**.  
- Integrated **QR-based verification** for instant donor check-in, ensuring authenticity and traceability.

### 🔍 Donor Filtering & Search
Admins can easily **search and filter donors** based on name, phone number, blood group, or eligibility status.

### 👤 Personalized Donor & Admin Management
- Donors can view their complete donation history, eligibility status, and next donation date.  
- Admins can dynamically update center settings such as total beds and slot durations.

### ⚙️ Smart Eligibility Status Updates
Automatic transition of donor status from **"Deferred" → "Pending Screening"** after 3 months — implemented without external schedulers.

---

## 🧩 Tech Stack

| Layer | Technologies Used |
|-------|--------------------|
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Authentication** | JWT (JSON Web Tokens) |
| **QR Code Handling** | qrcode, multer |
| **Other Utilities** | bcrypt|

---

## ⚙️ Setup & Installation

### 1️⃣ Clone the repository
``` bash
git clone https://github.com/yourusername/bloodconnect.git
cd bloodconnect 
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install
```

### Create a .env file inside the backend folder:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_custom_key

Then run:
npm start
```

## 🚀 Future Enhancements

Here are some ideas for expanding **BloodConnect** in the future:

- 📩 **Appointment Notifications** — Send SMS or email reminders using Twilio or Nodemailer.  
- 📍 **Nearby Centers Locator** — Integrate Google Maps API to suggest the closest donation centers.   
- 🔄 **Live Updates** — Add real-time updates for appointment changes using Socket.IO.  
- 📈 **Dashboard Analytics** - Introduce an interactive analytics panel for administrators to monitor donation trends and most-booked slots. 


## 🧠 Learning Outcomes

This project provided hands-on experience with:

- 🔐 Implementing **JWT-based authentication** and **role-based access control**.  
- 🧩 Designing modular **RESTful APIs** and reusable backend controllers.  
- 🗂️ Structuring a **MERN stack** project with scalable architecture.  
- ⚙️ Managing **slot scheduling** and **conditional eligibility logic**.  


---

> Developed with ❤️ to make blood donation more efficient, transparent, and accessible.




