𝗧𝗵𝗲 𝗣𝗲𝗮𝗿𝗹 🌴 - Your Ultimate Sri Lankan Tour Planner
The Pearl is a modern, full-stack web application designed to connect tourists with professional tour guides for personalized and unforgettable journeys across Sri Lanka. It features separate, feature-rich dashboards for tourists, tour guides, and administrators, providing a seamless experience from trip planning to completion.

✨ Core Features
The application is divided into three distinct roles, each with its own dedicated interface and functionalities.

🤵 For Tourists
Multi-Step Trip Planning: An intuitive, step-by-step wizard to plan trips, from selecting destinations to confirming details.

Wishlist & Itinerary Management: Save desired destinations to a "Dream Bucket" and move them to a "Make The Dream Real" list to build an itinerary.

AI-Powered Chatbot ("Wandy"): An integrated RAG-based chatbot to help tourists with their travel queries.

User Profile Management: Tourists can view and update their personal information, including their profile picture and contact details.

Active Trip Viewing: View details of ongoing or accepted trips directly from the trip planning page.

Real-Time Chat: Securely chat with assigned tour guides to coordinate trip details.

👨‍💼 For Tour Guides
Dedicated Dashboard: A professional interface to manage all tour-related activities.

Profile Management: Tour guides can manage their personal and professional details, which are displayed to tourists.

Trip Request Management: View, accept, or reject incoming trip requests from tourists. Accepting a request automatically sends a confirmation email.

Active Trip Management: Track and update the status of accepted and started trips, including managing payment statuses.

Completed Tours Overview: A dedicated page to view the history of all completed tours.

Real-Time Chat: A dedicated chat interface to communicate directly with tourists who have booked trips.

⚙️ For Administrators
Statistical Dashboard: An overview of key metrics, including total destinations, completed trips, and user counts.

Destination Management (CRUD): A full-featured interface to add, view, update, and delete travel destinations.

Tour Guide Management (CRUD): A complete system to manage tour guides, including adding new guides (which triggers a registration email) and viewing/deleting existing ones.

Trip Oversight: A centralized view to monitor all trips happening within the platform.

🛠️ Tech Stack
Frontend: Next.js with React & TypeScript

Styling: Tailwind CSS

Backend: FastAPI (Python)

Real-Time Chat: Firebase Firestore

Email Notifications: EmailJS

Authentication: JWT-based authentication with role management via Next.js Middleware.

🚀 Getting Started
To get a local copy up and running, follow these simple steps.

Prerequisites
Node.js (v18 or newer)

npm or yarn

Python 3.8+

An active Firebase project for the chat functionality.

An EmailJS account for sending email notifications.

Installation
Clone the repo

Bash

git clone https://github.com/your_username/the-pearl.git
Install Frontend NPM packages

Bash

cd the_pearl
npm install
Set up environment variables
Create a .env.local file in the root of the project and add your API base URL:

Code snippet

NEXT_PUBLIC_API_URL=http://127.0.0.1:8003
Run the Frontend Development Server

Bash

npm run dev
Your application should now be running on http://localhost:3000.

📁 Project Structure
The project uses the Next.js App Router. The main directories are structured by user role:

/app/admin/: Contains all pages and components for the admin dashboard.

/app/tour-guide/: Contains all pages and components for the tour guide dashboard.

/app/tourist/: Contains all pages and components for the tourist-facing application.

/components/: Shared components used across different parts of the application.

/contexts/: Houses the React Context providers, such as the AuthContext.

/middleware.ts: Handles authentication and role-based route protection.

🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request
