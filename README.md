# Sustainable Delivery 🚚🌱

A community-driven delivery platform that turns neighbors' regular errands into sustainable, rewarding opportunities to deliver packages.

---

## 🎯 The Problem

Traditional last-mile delivery is inefficient, environmentally costly, and lacks community connection. It creates unnecessary traffic, carbon emissions, and high costs for single-purpose trips.

##💡 Our Solution

Sustainable Delivery solves this by creating a peer-to-peer network where verified local volunteers deliver packages along their existing routes. Our platform uses smart technology to match deliveries with volunteers, creating a system that is efficient, rewarding, and good for the planet.

## ✨ Core Features

- **Smart Matching:** An algorithm connects package requests with the most efficient volunteer routes.
- **Real-time Tracking:** Live GPS tracking for all deliveries from store to door.
- **Community Trust:** A robust verification and peer-to-peer rating system.
- **Gamified Rewards:** Volunteers earn credits and unlock badges for successful deliveries.
- **Impact Tracking:** Users can see their direct contribution to reducing carbon emissions.
- **Flexible Scheduling:** Recipients can set preferred delivery windows.

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Backend & Database:** Firebase (Firestore, Authentication, Cloud Functions)
- **Mapping:** Leaflet & React-Leaflet
- **AI Features:** Gemini API

## ⚙️ Getting Started

### Prerequisites

- Node.js (v18+)
- npm / yarn
- Firebase CLI (`npm install -g firebase-tools`)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/your-username/your-repository-name.git](https://github.com/your-username/your-repository-name.git)
    cd your-repository-name
    ```

2.  **Install Dependencies:**
    ```sh
    npm install
    ```

3.  **Set up Firebase:**
    - Create a project on the [Firebase Console](https://console.firebase.google.com/).
    - Enable **Authentication** and **Firestore**.
    - Create a `.env.local` file in the project root and add your Firebase config keys:
      ```env
      VITE_FIREBASE_CONFIG={"apiKey":"...","authDomain":"...","projectId":"..."}
      ```

4.  **Run the App:**
    ```sh
    npm run dev
    ```
    The application will be running on `http://localhost:5173`.

---

Built with ❤️ for the Walmart Converge Hackathon.

