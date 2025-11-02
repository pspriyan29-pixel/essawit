@echo off
chcp 65001 >nul
echo ========================================
echo     PUSH KE GITHUB - NusaPalma
echo ========================================
echo.
echo Error 403: Diperlukan Authentication!
echo.
echo Pilih cara setup authentication:
echo.
echo [1] Personal Access Token (PAT) - Recommended
echo [2] SSH Key Setup
echo [3] Lihat Status Git
echo [0] Keluar
echo.
set /p choice="Pilih opsi (0-3): "

if "%choice%"=="1" goto PAT
if "%choice%"=="2" goto SSH
if "%choice%"=="3" goto STATUS
if "%choice%"=="0" goto END
goto MENU

:PAT
echo.
echo ========================================
echo   SETUP PERSONAL ACCESS TOKEN (PAT)
echo ========================================
echo.
echo Langkah-langkah:
echo 1. Buka browser: https://github.com/settings/tokens
echo 2. Klik "Generate new token (classic)"
echo 3. Note: essawit-project
echo 4. Expiration: Pilih durasi (contoh: 90 days)
echo 5. Scopes: Centang "repo" (full control)
echo 6. Generate token
echo 7. COPY TOKEN (hanya muncul sekali!)
echo.
echo Setelah dapat token, tekan Enter untuk push...
pause >nul
echo.
git remote set-url origin https://github.com/pspriyan29-pixel/essawit.git
git config credential.helper store
echo.
echo Sekarang jalankan push:
echo   Username: pspriyan29-pixel
echo   Password: Paste PAT token (bukan password GitHub)
echo.
git push -u origin main
goto END

:SSH
echo.
echo ========================================
echo         SETUP SSH KEY
echo ========================================
echo.
echo SSH Public Key Anda:
echo ----------------------------------------
type "%USERPROFILE%\.ssh\id_ed25519.pub"
echo ----------------------------------------
echo.
echo Langkah-langkah:
echo 1. Buka browser: https://github.com/settings/keys
echo 2. Klik "New SSH key"
echo 3. Title: essawit-project
echo 4. Key: Copy-paste SSH public key di atas
echo 5. Add SSH key
echo.
echo Setelah menambahkan SSH key ke GitHub, tekan Enter...
pause >nul
echo.
git remote set-url origin git@github.com:pspriyan29-pixel/essawit.git
echo.
echo Menjalankan push ke GitHub...
git push -u origin main
goto END

:STATUS
echo.
echo ========================================
echo          STATUS GIT
echo ========================================
echo.
echo Remote URL:
git remote -v
echo.
echo Git Config:
git config --global user.name
git config --global user.email
echo.
echo Commit Status:
git status
echo.
pause
goto MENU

:MENU
cls
goto :eof

:END
echo.
echo Selesai!
pause

