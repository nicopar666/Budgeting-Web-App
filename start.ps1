# Budgeting Web App - Startup Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Budgeting Web App" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Node.js..." -ForegroundColor Yellow
    winget install OpenJS.NodeJS -e --accept-source-agreements --accept-package-agreements
    Start-Sleep -Seconds 5
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
}

Write-Host "Node.js: $(node --version)" -ForegroundColor Green
Write-Host "npm: $(npm --version)" -ForegroundColor Green
Write-Host ""

# Install dependencies
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Create .env
if (-not (Test-Path ".env")) {
    @"
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="dev-secret-key"
NEXTAUTH_URL="http://localhost:3000"
"@ | Out-File -FilePath ".env" -Encoding utf8
}

# Setup database
Write-Host "Setting up database..." -ForegroundColor Yellow
npx prisma db push
Write-Host ""

# Start app
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Starting at http://localhost:3000" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Open browser
Start-Process "http://localhost:3000"

# Run dev server (keeps window open)
npm run dev
