# ── Stage 1: Build the JAR ──────────────────────────────────────────────
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app

# Cache dependency layer separately for faster rebuilds
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

COPY src ./src

RUN ./mvnw clean package -DskipTests -B

# ── Stage 2: Minimal runtime image ──────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Non-root user for security
RUN addgroup -S lms && adduser -S lms -G lms
USER lms

COPY --from=builder /app/target/mini-lms-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

# JVM tuning for containers
ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=75.0", \
  "-jar", "app.jar", \
  "--spring.profiles.active=${SPRING_PROFILES_ACTIVE:-prod}"]
