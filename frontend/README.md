# LearnHub LMS - Full Stack Setup & Architecture

LearnHub is an enterprise-grade Learning Management System split into a Spring Boot backend and a modular React frontend.

## 1. Project Structure

The project maps to three distinct role-based portals on the frontend to ensure maximum security and code maintainability, sitting securely over a Java Spring Boot REST API.

```text
LMS/
├── backend/                       # Spring Boot Application
│   └── src/main/java/com/lms/
│       ├── analytics/             # Controller for Instructor/Student Metrics
│       ├── auth/                  # JWT security and OTP dispatchers
│       ├── course/                # Course & Lesson management + S3 Uploads
│       ├── enrollment/            # Progress tracking and enrollment logic
│       ├── notification/          # System alerts
│       └── user/                  # User management & roles
│
└── frontend/                      # Vite + React Built Architecture
    └── src/
        ├── admin/                 # ADMIN Portal (Dashboard, Manage Users)
        ├── faculty/               # INSTRUCTOR Portal (Dashboard, Course Builder)
        ├── student/               # STUDENT Portal (Dashboard, Video Player)
        ├── components/            # Reusable App UI (Navbar, Footer)
        ├── api/                   # Axios bindings mapping to Spring Boot
        ├── context/               # AuthContext managing React JWT state
        └── pages/                 # Public-facing views (Landing, Auth, Blog)
```

## 2. Authentication & Roles

The system uses JWT Token-based authentication. The JWT inherently encapsulates the user's role and prevents cross-portal contamination.

### Available Roles
1. **`STUDENT` (Default)**: Has access to `/student/*`. Can browse courses, enroll, track learning progress, and earn completion badges.
2. **`INSTRUCTOR`**: Has access to `/faculty/*`. Can use the Course Builder to draft courses, upload video/document files to AWS S3, and publish them to the live site.
3. **`ADMIN`**: Has access to `/admin/*`. Capable of viewing system-wide metrics, suspending users, and overriding system defaults.

> **Admin Login Notice**: Due to bcrypt hashing security, there are no unencrypted hardcoded admin passwords. **Your personal account `sudheerbhuvana25@gmail.com` has been securely elevated to `ADMIN` inside the PostgreSQL database!**

## 3. Core API Endpoints

The frontend `axiosInstance` maps perfectly to these Spring Boot endpoints dynamically using `http://localhost:8080/api/v1/`.

### Authentication
- `POST /auth/signup` - Registers a new user.
- `POST /auth/signin` - Authenticates and returns JWT `Bearer` token.
- `POST /auth/verify-otp` - Submits email OTP verification.

### Courses (Instructor & Public)
- `GET /courses` - Fetches paginated, active course catalog for students.
- `GET /courses/instructor/my` - Fetches authored courses for the faculty dashboard.
- `POST /courses` - Creates a new draft course.
- `PUT /courses/{id}` - Updates course metadata.
- `POST /courses/{id}/thumbnail` - (`multipart/form-data`) Uploads a cover image.
- `PATCH /courses/{id}/publish` - Pushes a draft course live.

### Content & Curriculum Editor
- `GET /courses/{id}/lessons` - Parses all active lessons inside a course.
- `POST /lessons` - (`multipart/form-data`) Inserts a new `VIDEO` or `DOCUMENT` module and uploads the binary to the secure cloud.
- `DELETE /lessons/{id}` - Destroys a mapped lesson.

### Progress Tracking (Students)
- `POST /enrollment/{courseId}` - Links a student to a course.
- `GET /progress/course/{courseId}` - Returns detailed percentages and analytics.
- `PUT /progress/lesson` - Takes `lessonId`, `isCompleted`, and `watchDurationSeconds` to calculate progression.
- `GET /learning-activity/summary` - Fetches visual tracking data (Streak, Time Spent).
