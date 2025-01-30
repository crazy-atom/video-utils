# **Video Utils** 🎥

A **Node.js** application that allows users to **upload, trim, merge videos, and share links** with expiration time. The project is built using **Express.js**, **SQLite**, and **Jest** for testing.

It provides **configurable limits** for video uploads, including **maximum file size and duration**, while also supporting video **trimming and merging** functionalities.

---

## **Features** 🚀

### **1. Video Upload** 📤
Users can upload videos while ensuring compliance with configurable limits:
- **Maximum File Size** – e.g., **5 MB**, **25 MB** (can be configured).
- **Video Duration** – Minimum and maximum duration can be set (e.g., **5 seconds**, **25 seconds**).

### **2. Video Trimming** ✂️
Users can trim an uploaded video by providing **start and end times**. The trimmed video is stored separately.

### **3. Video Merging** 🔀
Users can merge multiple uploaded video clips into **a single video file**.

### **4. Link Sharing with Expiry** 🔗⏳
Users can generate **temporary shareable links** for their videos with an **expiry time** (e.g., **1 hour**).

---

## **Tech Stack** 🛠️

- **Backend:** [Node.js](https://nodejs.org/) with [Express.js](https://expressjs.com/)
- **Database:** [SQLite](https://www.sqlite.org/) (Lightweight SQL-based storage)
- **Video Processing:** [FFmpeg](https://ffmpeg.org/)
- **Testing:** [Jest](https://jestjs.io/)
- **Logging:** [Winston](https://github.com/winstonjs/winston)

---

## **Installation & Setup** 🏗️

### **1. Clone the Repository**
Run the following command in your terminal:
```sh
git clone https://github.com/crazy-atom/video-utils.git
cd video-utils
```

### **2. Install Dependencies**
Make sure you have **Node.js (v14.x or above)** installed.
Then, install the required dependencies:
```sh
npm install
```

### **3. Configure Environment Variables**
- Create a .env file from the provided .env.example template.
- Then, install the required dependencies:

### **4. Run Tests 🧪**
- To test the application and check test coverage, use:
```sh
npm test
```


## **API Documentation 📜 🏗️
- API documentation, including request examples and responses, is available via Postman:
- **👉** [Postman Documentation](https://documenter.getpostman.com/view/4132297/2sAYX2MPTE)
