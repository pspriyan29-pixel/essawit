@echo off
echo ============================================
echo   Web Management Sawit - Setup Script
echo ============================================
echo.

echo [1/4] Installing root dependencies...
call npm install
echo.

echo [2/4] Installing backend dependencies...
cd backend
call npm install
cd ..
echo.

echo [3/4] Installing frontend dependencies...
cd frontend
call npm install
cd ..
echo.

echo [4/4] Creating .env file...
if not exist backend\.env (
    copy backend\env.example backend\.env
    echo .env file created successfully!
) else (
    echo .env file already exists, skipping...
)
echo.

echo ============================================
echo   Setup Complete!
echo ============================================
echo.
echo Next steps:
echo 1. Make sure MongoDB is running
echo 2. Run: npm run dev
echo 3. Open http://localhost:7777 in browser
echo.
pause

