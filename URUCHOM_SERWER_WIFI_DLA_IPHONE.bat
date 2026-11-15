@echo off
chcp 65001 >nul
title Serwer Wi-Fi Kompendium Vibe Codingu dla iPhone
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0serwer_iphone_wifi.ps1"
