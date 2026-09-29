$desktop = [Environment]::GetFolderPath('Desktop')
$ws = New-Object -ComObject WScript.Shell
$shortcutPath = [System.IO.Path]::Combine($desktop, 'MarkTypo编辑器.lnk')
$s = $ws.CreateShortcut($shortcutPath)
$s.TargetPath = 'wscript.exe'
$s.Arguments = "`"$PSScriptRoot\启动MarkTypo_无黑框.vbs`""
$s.WorkingDirectory = $PSScriptRoot
$s.Description = 'MarkTypo - 本地 Markdown 编辑器'
$s.Save()

Write-Host "成功！已在桌面创建快捷方式: $shortcutPath" -ForegroundColor Green
