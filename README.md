# 🌌 Character Forge

Character Forge is a powerful, AI-assisted platform for world-builders, writers, and RPG enthusiasts to weave intricate universes, worlds, and characters. From defining the laws of a new reality to forging the destiny of its inhabitants, Character Forge provides the tools to bring your imagination to life.

## ✨ Features

-   **Universe Forging**: Create and manage multiple overarching universes.
-   **World Building**: Define realms within your universes, complete with timelines and custom attributes.
-   **Character Forge**: Detailed character creation with dynamic attributes, tags, and status tracking.
-   **Cosmic Insights**: A data-driven dashboard providing high-precision analytics (KDE models, demographics) of your creations.
-   **AI Weavers**: Interactive, AI-simulated chat interfaces to help you brainstorm and refine your lore.
-   **Secure Authentication**: Fully featured registration, login, and personalized onboarding experience.

## 🚀 Tech Stack

-   **Backend**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.11)
-   **Database**: [PostgreSQL](https://www.postgresql.org/) (with SQLAlchemy ORM)
-   **Frontend**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Containerization**: [Docker](https://www.docker.com/) & Docker Compose

## 🛠️ Getting Started

### Prerequisites

-   Docker and Docker Compose installed on your machine.

### Installation & Setup

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd Char_Forge_App
    ```

2.  **Configure Environment Variables**:
    Copy the example environment file and fill in your values:
    ```bash
    cp .env_example .env
    ```
    *Note: Ensure `POSTGRES_PASSWORD` and `JWT_SECRET_TOKEN` are set to secure values.*

3.  **Spin up the containers**:
    ```bash
    sudo docker compose up --build -d
    ```

4.  **Access the Application**:
    -   **Frontend**: [http://localhost:5173](http://localhost:5173)
    -   **Backend API**: [http://localhost:8000](http://localhost:8000)
    -   **API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs) (Swagger UI)

## 📁 Project Structure

```text
Char_Forge_App/
├── backend/
│   ├── app/
│   │   ├── core/          # Database config, auth, and init scripts
│   │   ├── models/        # SQLAlchemy models
│   │   ├── routers/       # API endpoints (Auth, Universe, World, Character)
│   │   ├── schemas/       # Pydantic models (Data validation)
│   │   └── main.py        # App entry point & table initialization
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── features/      # Business logic components
│   │   ├── services/      # API communication
│   │   ├── shared/        # Reusable UI components
│   │   └── App.jsx
│   └── Dockerfile
└── docker-compose.yml     # Multi-container orchestration
```

## 🔒 Security

-   Passwords are hashed using **Bcrypt**.
-   Authentication is handled via **JWT (JSON Web Tokens)**.
-   Database access is protected via a dedicated schema (`charforge_schema`).
-   Sensitive data is managed exclusively through environment variables.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an issue for any bugs or feature requests.


