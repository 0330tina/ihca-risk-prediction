@echo off
REM GitHub 發布快速設定腳本 (Windows)
REM 使用方法: setup-github.bat

echo 🚀 開始設定 GitHub 倉庫...

REM 檢查是否已初始化 Git
if not exist ".git" (
    echo 📦 初始化 Git 倉庫...
    git init
) else (
    echo ✅ Git 倉庫已存在
)

REM 檢查是否有未提交的變更
git status --porcelain >nul 2>&1
if %errorlevel% equ 0 (
    echo 📝 發現未提交的變更，正在添加...
    git add .
    
    set /p commit_msg="請輸入提交訊息 (預設: Initial commit): "
    if "%commit_msg%"=="" set commit_msg=Initial commit: IHCA risk prediction system
    
    git commit -m "%commit_msg%"
    echo ✅ 變更已提交
) else (
    echo ✅ 沒有未提交的變更
)

REM 詢問 GitHub 用戶名
set /p github_username="請輸入您的 GitHub 用戶名: "
set /p repo_name="請輸入倉庫名稱 (預設: ihca-risk-prediction): "
if "%repo_name%"=="" set repo_name=ihca-risk-prediction

REM 檢查是否已有遠端倉庫
git remote | findstr /C:"origin" >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  遠端倉庫已存在，正在更新...
    git remote set-url origin https://github.com/%github_username%/%repo_name%.git
) else (
    echo 🔗 添加遠端倉庫...
    git remote add origin https://github.com/%github_username%/%repo_name%.git
)

REM 設定分支為 main
git branch -M main

echo.
echo 📋 下一步：
echo 1. 前往 https://github.com/new 創建新倉庫
echo 2. 倉庫名稱: %repo_name%
echo 3. 不要勾選 README、.gitignore 或 license
echo 4. 創建倉庫後，執行以下命令推送：
echo.
echo    git push -u origin main
echo.
set /p push_now="或者，如果已經創建了倉庫，現在就推送？(y/n): "

if /i "%push_now%"=="y" (
    echo 📤 正在推送到 GitHub...
    git push -u origin main
    echo ✅ 完成！
    echo 🌐 您的倉庫網址: https://github.com/%github_username%/%repo_name%
) else (
    echo ✅ 設定完成！請在創建 GitHub 倉庫後執行: git push -u origin main
)

pause

