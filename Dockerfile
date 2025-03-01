# Multi-Stage Build

# Stage 1: Build the frontend (React app)
FROM node:22.14.0 AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install
COPY frontend ./
RUN npm run build

# Stage 2: Build the backend (Node app)
FROM node:22.14.0 AS backend-builder

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm install
COPY backend ./

# Stage 3: Final image
FROM node:22.14.0 AS final

WORKDIR /app

# Copy the built frontend files from the frontend-builder stage
COPY --from=frontend-builder /app/frontend/build /app/frontend/build

# Copy the backend source code and node_modules
COPY --from=backend-builder /app/backend /app/backend
COPY --from=backend-builder /app/backend/node_modules /app/backend/node_modules

# Expose necessary ports (if applicable)
EXPOSE 3000 5000

# Command to start the backend
CMD ["npm", "run", "start", "--prefix", "backend"]