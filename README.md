# Config Scanner & Secrets Detector

## Overview

**Config Scanner & Secrets Detector** is a powerful DevOps security tool designed to automatically scan local projects for security vulnerabilities, configuration errors, and exposed secrets. It helps developers and DevOps engineers catch issues early in the development cycle before they reach production.

The application features a robust **Spring Boot** backend for scanning logic and processing, paired with a modern **React** frontend for visualizing scan results through interactive dashboards and detailed reports.

## Features

### 🛡️ Security Scanning
*   **Secret Detection**: Identifies exposed AWS Access Keys, API keys, tokens, and other secrets.
*   **Sensitive File Exposure**: Detects accidental commit of sensitive files like `.env`, `.env.local`, and `application-dev.yml`.
*   **Weak Credentials**: Flags usage of default passwords (e.g., `admin`, `123456`) and risky usernames like `root`.

### ⚙️ Configuration Validation
*   **Security Misconfigurations**: Checks for dangerous settings such as:
    *   Debug mode enabled (`debug=true`).
    *   SSL disabled (`ssl=false`).
    *   CORS wildcard (`allowAllOrigins=true`).
*   **Missing Configurations**: Ensures essential properties like database credentials and server ports are defined.
*   **Syntax Validation**: Validates the structural integrity of JSON and YAML configuration files.

### 📊 Visualization & Reporting
*   **Dashboard**: Overview of scan history, issue severity distribution, and trends.
*   **Detailed Reports**: Line-by-line breakdown of detected issues with severity levels (Critical, High, Medium).
*   **Charts**: Visual representations using Chart.js.

## Tech Stack

### Backend
*   **Language**: Java 17
*   **Framework**: Spring Boot 3.2.0
*   **Database**: MongoDB
*   **Build Tool**: Maven
*   **Libraries**:
    *   `SnakeYAML`: For parsing YAML configurations.
    *   `Lombok`: For reducing boilerplate code.
    *   `Github API`: For potential future git integration.

### Frontend
*   **Library**: React 19
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS 4
*   **Charts**: Chart.js / react-chartjs-2
*   **Icons**: Lucide React
*   **HTTP Client**: Axios

## Prerequisites

Before running the application, ensure you have the following installed:
*   [Java Development Kit (JDK) 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)
*   [Node.js](https://nodejs.org/) (Latest LTS recommended)
*   [MongoDB](https://www.mongodb.com/try/download/community) (Running locally on default port 27017)
*   [Maven](https://maven.apache.org/) (Optional if using `mvnw` wrapper, but recommended)

## Installation & Setup

### 1. Backend Setup

Navigate to the backend directory and run the Spring Boot application.

```bash
cd backend
mvn spring-boot:run
```

The backend server will start at `http://localhost:8080`.

### 2. Frontend Setup

Open a new terminal, navigate to the frontend directory, install dependencies, and start the development server.

```bash
cd frontend
npm install
npm run dev
```

The frontend application will typically start at `http://localhost:5173` (check the terminal output for the exact URL).

### 3. Database
Ensure your local MongoDB instance is running. The application connects to `mongodb://localhost:27017/config-scanner` (default Spring Boot configuration).

## Project Structure

```
DevopsProject/
├── backend/                # Spring Boot Backend
│   ├── src/main/java/      # Java Source Code
│   │   ├── com/configscanner/
│   │   │   ├── controller/ # REST Controllers
│   │   │   ├── model/      # Data Models
│   │   │   ├── repository/ # MongoDB Repositories
│   │   │   └── service/    # Scanning Logic (ScannerService.java)
│   └── pom.xml             # Maven Dependencies
│
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI Components
│   │   │   ├── DashboardCharts.jsx
│   │   │   └── ...
│   │   ├── App.jsx         # Main Component
│   │   └── main.jsx        # Entry Point
│   ├── package.json        # NPM Dependencies
│   └── tailwind.config.js  # Tailwind Configuration
│
└── README.md               # Project Documentation
```

## Usage

1.  Open the frontend application in your browser.
2.  Use the interface to trigger a scan on a provided local project path.
3.  View the results on the dashboard, categorized by severity.
4.  Drill down into specific files to see the exact line numbers and issues detected.

## License

[MIT](https://choosealicense.com/licenses/mit/)
