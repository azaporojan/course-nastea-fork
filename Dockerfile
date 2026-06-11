# ── Stage 1: build frontend ──────────────────────────────────────────────────
FROM node:22-alpine AS frontend
WORKDIR /fe
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# ── Stage 2: build backend (frontend baked into static resources) ────────────
FROM eclipse-temurin:21-jdk AS backend
WORKDIR /app
COPY gradlew settings.gradle.kts build.gradle.kts ./
COPY gradle ./gradle
RUN chmod +x gradlew && ./gradlew --no-daemon dependencies > /dev/null 2>&1 || true
COPY src ./src
COPY --from=frontend /fe/dist ./src/main/resources/static
RUN ./gradlew --no-daemon bootJar -x test

# ── Stage 3: runtime ─────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=backend /app/build/libs/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
