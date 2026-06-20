# ──────────────────────────────────────────────────────────────
# LearnHub — Start Backend + Frontend for local development
# Usage: powershell -File start-dev.ps1
# ──────────────────────────────────────────────────────────────

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  LearnHub — Starting Dev Environment  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Start Backend (Spring Boot) in a new terminal window
Write-Host "[1/2] Starting Backend (Spring Boot on port 8080)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; Write-Host 'Starting Spring Boot...' -ForegroundColor Green; .\mvnw.cmd spring-boot:run '-Dspring-boot.run.profiles=local'"

Start-Sleep -Seconds 2

# Start Frontend (Vite on port 5173) in a new terminal window
Write-Host "[2/2] Starting Frontend (Vite on port 5173)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; Write-Host 'Starting Vite dev server...' -ForegroundColor Green; npm run dev"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Both servers are starting!           " -ForegroundColor Green
Write-Host "  Backend:  http://localhost:8080       " -ForegroundColor White
Write-Host "  Swagger:  http://localhost:8080/swagger-ui.html" -ForegroundColor White
Write-Host "  Frontend: http://localhost:5173       " -ForegroundColor White
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
