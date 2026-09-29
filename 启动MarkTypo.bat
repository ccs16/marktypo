@echo off
chcp 65001 >nul
title 正在启动 MarkTypo 本地编辑器...

cd /d "%~dp0"
echo ========================================================
echo       MarkTypo - 极简高颜值本地 Markdown 编辑器
echo ========================================================
echo 正在启动桌面客户端，请稍候...

npm run app
