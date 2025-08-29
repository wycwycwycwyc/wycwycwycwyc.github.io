@echo off
echo 正在安装服务请稍等...
set curdir=%~dp0
cd /d %curdir%
sc create TestService binpath= "C:\Users\18111379676\Desktop\jbcfz\映射.exe" start= auto displayname= "ScriptHubService"
sc description TestService "Windows测试服务，不要删除"
echo -----------------------------
echo    服务安装成功
echo -----------------------------
echo 正在启动服务请稍等...
net start TestService
echo -----------------------------
echo    服务启动成功
echo -----------------------------
pause