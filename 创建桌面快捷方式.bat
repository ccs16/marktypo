@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo 正在为 MarkTypo 生成桌面快捷方式...

powershell -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut([System.IO.Path]::Combine([Environment]::GetFolderPath('Desktop'), 'MarkTypo编辑器.lnk')); $s.TargetPath = 'wscript.exe'; $s.Arguments = '\"%~dp0启动MarkTypo_无黑框.vbs\"'; $s.WorkingDirectory = '%~dp0'; $s.Description = 'MarkTypo - 本地 Markdown 编辑器'; $s.Save()"

if %errorlevel% equ 0 (
    echo.
    echo ========================================================
    echo  成功！桌面快捷方式【MarkTypo编辑器】已创建完成！
    echo  现在你可以直接双击桌面上的图标打开软件，如同使用 Typora 一样！
    echo ========================================================
) else (
    echo 创建快捷方式失败，请手动右键发送到桌面快捷方式。
)
pause
