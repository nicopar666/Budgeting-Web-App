@echo off
cd /d "%~dp0"

set PATH=C:\Program Files\nodejs;%PATH%

echo ========================================
echo   Budgeting Web App - Test Runner
echo ========================================
echo.
echo Project Summary:
echo.
echo - Full-stack budgeting app with auth, CRUD, analytics, AI chat
echo - Tech: Next.js 13, Prisma, SQLite, next-auth v4
echo - Features: Rate limiting, security headers, session timeout
echo - Documentation: Proposal, API docs, unit tests, CI/CD
echo - Currency: Philippine Peso (PHP)
echo.
echo ========================================
echo   Running Tests
echo ========================================
echo.

npm run test

echo.
echo ========================================
echo   Tests Complete
echo ========================================
echo.
pause
