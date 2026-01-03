# Collaborative Task Manager

A real-time Collaborative Task Management application built with the **MERN stack** (MongoDB, Express.js, React, Node.js). This application allows users to create, update, and delete tasks in real-time, with updates instantly reflected across all connected clients using **Socket.io**.

### Live URL: https://collab-task-client.onrender.com

### Github Repo: https://github.com/Aashutoshpatel11/Collaborative-Task-Manager

## Setup Instructions

### Prerequisites
* Node.js (v16+ recommended)
* MongoDB (running locally or a cloud instance like Atlas)
* Docker & Docker Compose (optional, for containerized run)

### 1. Run Locally (Manual)

#### Backend (Server)
1.  Navigate to the server directory:
    ```bash
    cd Server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `Server` directory with the following variables:
    ```env
    PORT=8000
    MONGODB_URI=your_mongodb_connection_string
    CORS_ORIGIN=http:http://localhost:3000
    ACCESS_TOKEN_SECRET=your_access_token_secret_key_here
    ACCESS_TOKEN_EXPIRY=1d
    REFRESH_TOKEN_SECRET=your_refresh_token_secret_key_here
    REFRESH_TOKEN_EXPIRY=10d
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```

#### Frontend (Client)
1.  Navigate to the client directory:
    ```bash
    cd Client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Vite development server:
    ```bash
    npm run dev
    ```
4.  Open your browser at `http://localhost:3000`.

### 2. Run with Docker 

The project includes a `docker-compose.yml` file for easy setup.

1.  Ensure Docker is running on your machine.
2.  From the root directory, run:
    ```bash
    docker-compose up --build
    ```
3.  The application will be available at:
    * **Frontend**: `http://localhost:3000`
    * **Backend**: `http://localhost:4000`

---

## API Contract Documentation

**Base URL:** `/api/v1`

### User Authentication (`/users`)

| Method | Endpoint      | Description                          | Protected |
| :----- | :------------ | :----------------------------------- | :-------- |
| `POST` | `/register`   | Register a new user account          | No        |
| `POST` | `/login`      | Login user & set JWT HttpOnly cookies| No        |
| `POST` | `/logout`     | Clear cookies & end session          | **Yes** |
| `GET`  | `/current-user`| Get details of the logged-in user   | **Yes** |

### Tasks (`/tasks`)

| Method  | Endpoint | Description                          | Protected |
| :------ | :------- | :----------------------------------- | :-------- |
| `GET`   | `/`      | Get all tasks for the current user   | **Yes** |
| `POST`  | `/`      | Create a new task                    | **Yes** |
| `PATCH` | `/:id`   | Update a task (status/content)       | **Yes** |
| `DELETE`| `/:id`   | Delete a specific task               | **Yes** |

---

## Architecture & Design Decisions

### 1. Database: MongoDB & Mongoose
* **Why MongoDB?**: Selected for its document-oriented nature, which maps naturally to JSON-like task objects. It allows for flexible schema evolution if task properties change in the future.
* **Mongoose**: Used as the ODM to enforce strict schema validation (`user.model.ts`, `task.model.ts`) to ensure data integrity before it hits the database.

### 2. Authentication: JWT (JSON Web Tokens)
* **Strategy**: Stateless authentication using Access Tokens and Refresh Tokens.
* **Security**: Tokens are stored in **HttpOnly, Secure cookies**. This prevents client-side JavaScript (XSS attacks) from accessing sensitive tokens, unlike `localStorage`.
* **Mechanism**:
    * `auth.middleware.ts` intercepts requests to verify the `accessToken`.
    * If the access token expires, the refresh token endpoint (implicitly handled) generates a new one.

### 3. Service Layer Implementation
* **Pattern**: The application uses a "Controller-Service" hybrid approach where business logic resides in the Controllers (`task.controller.ts`, `user.controller.ts`), supported by utility functions (`src/utils`) and middlewares.
* **Validation**: **Zod** is used for runtime request body validation (`src/schema/*.ts`). This ensures the API fails fast with descriptive errors if invalid data is sent, protecting the core logic.

---

## Real-Time Integration (Socket.io)

**Goal**: To enable collaborative features where task updates are pushed immediately to the client without polling.

**Integration Strategy:**
1.  **Server Initialization**: The Socket.io server is initialized in `Server/src/socket/socket.ts`, wrapping the HTTP server. It listens for `connection` events.
2.  **Event Emission**:
    * When a user performs a Create, Update, or Delete operation in `task.controller.ts`, the server emits a specific event (e.g., `newTask`, `updateTask`, `deleteTask`) to the connected clients.
3.  **Client Handling**:
    * The React frontend initializes the socket connection on mount.
    * It uses event listeners to catch these broadcasts and dispatches actions to the Redux store to update the UI state instantly.

---

## Scaling for Production

To scale this application for a high-traffic production environment, I would implement the following strategies to ensure availability, performance, and reliability:

1. **Infrastructure & Orchestration**
    * *Container Orchestration (Kubernetes/Docker Swarm):* Deploy the Dockerized frontend and backend services into a Kubernetes cluster (EKS/GKE/AKS). This allows for auto-scaling of pods based on CPU/memory usage and ensures zero-downtime deployments.
    * *Load Balancing (Nginx/AWS ELB):* Place a Load Balancer in front of the backend API instances to distribute incoming traffic evenly, preventing any single instance from becoming a bottleneck.

2. **Backend Optimization**
    * *Caching (Redis):* Implement Redis to cache frequently accessed data (like user profiles or task lists) and session management. This reduces database load and speeds up response times.
    * *Horizontal Scaling:* Run multiple instances of the Node.js backend server. Since the application uses JWT for stateless authentication, we can easily add more instances without worrying about sticky sessions.

3. **Database Scalin**
    * *Replica Sets:* Use MongoDB Replica Sets to ensure high availability and data redundancy.
    * *Read Replicas:* Separate read and write operations. Direct complex queries and read operations to read replicas to offload the primary database instance.
    * *Sharding:* For extremely large datasets, implement database sharding to distribute data across multiple machines.

4. **Frontend Performance**
    * *CDN (Cloudflare/AWS CloudFront):** Host the static frontend assets (build files, images) on a Content Delivery Network (CDN) to serve them from edge locations closer to the user, reducing latency.
    * *Lazy Loading:* Implement lazy loading for React components and routes to decrease the initial load time of the application.

5. **Real-time Communication**
    * *Socket.io Redis Adapter:* To scale the WebSocket server across multiple instances, use the Socket.io Redis Adapter. This ensures that messages are broadcasted correctly to clients connected to different backend instances.

## Trade-offs & Assumptions

1.  **Scalability**:
    * *Trade-off*: The current Socket.io setup uses the default in-memory adapter.
    * *Impact*: This works for a single server instance. If the backend were to scale horizontally (multiple containers/pods), a **Redis Adapter** would be required to broadcast events between server instances.

2.  **State Management**:
    * *Decision*: Redux Toolkit is used for state management.
    * *Trade-off*: Adds boilerplate compared to React Context, but provides a robust structure for handling complex asynchronous flows (API calls) and socket updates simultaneously.

3.  **Data Isolation**:
    * *Assumption*: Currently, tasks are private to the user (Single-Tenant logic). If "Team Collaboration" were added, the schema would need a `projectId` or `teamId` to broadcast socket events only to specific rooms, rather than the current implementation which focuses on the logged-in user context.
