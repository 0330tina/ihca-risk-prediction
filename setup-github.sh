#!/bin/bash

# GitHub 發布快速設定腳本
# 使用方法: bash setup-github.sh

echo "🚀 開始設定 GitHub 倉庫..."

# 檢查是否已初始化 Git
if [ ! -d ".git" ]; then
    echo "📦 初始化 Git 倉庫..."
    git init
else
    echo "✅ Git 倉庫已存在"
fi

# 檢查是否有未提交的變更
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 發現未提交的變更，正在添加..."
    git add .
    
    read -p "請輸入提交訊息 (預設: Initial commit): " commit_msg
    commit_msg=${commit_msg:-"Initial commit: IHCA risk prediction system"}
    
    git commit -m "$commit_msg"
    echo "✅ 變更已提交"
else
    echo "✅ 沒有未提交的變更"
fi

# 詢問 GitHub 用戶名
read -p "請輸入您的 GitHub 用戶名: " github_username
read -p "請輸入倉庫名稱 (預設: ihca-risk-prediction): " repo_name
repo_name=${repo_name:-"ihca-risk-prediction"}

# 檢查是否已有遠端倉庫
if git remote | grep -q "origin"; then
    echo "⚠️  遠端倉庫已存在，正在更新..."
    git remote set-url origin "https://github.com/$github_username/$repo_name.git"
else
    echo "🔗 添加遠端倉庫..."
    git remote add origin "https://github.com/$github_username/$repo_name.git"
fi

# 設定分支為 main
git branch -M main

echo ""
echo "📋 下一步："
echo "1. 前往 https://github.com/new 創建新倉庫"
echo "2. 倉庫名稱: $repo_name"
echo "3. 不要勾選 README、.gitignore 或 license"
echo "4. 創建倉庫後，執行以下命令推送："
echo ""
echo "   git push -u origin main"
echo ""
echo "或者，如果已經創建了倉庫，現在就推送？(y/n)"
read -p "> " push_now

if [ "$push_now" = "y" ] || [ "$push_now" = "Y" ]; then
    echo "📤 正在推送到 GitHub..."
    git push -u origin main
    echo "✅ 完成！"
    echo "🌐 您的倉庫網址: https://github.com/$github_username/$repo_name"
else
    echo "✅ 設定完成！請在創建 GitHub 倉庫後執行: git push -u origin main"
fi

