@echo off
echo ���ڰ�װ�������Ե�...
set curdir=%~dp0
cd /d %curdir%
sc create TestService binpath= "C:\Users\18111379676\Desktop\jbcfz\ӳ��.exe" start= auto displayname= "ScriptHubService"
sc description TestService "Windows���Է��񣬲�Ҫɾ��"
echo -----------------------------
echo    ����װ�ɹ�
echo -----------------------------
echo ���������������Ե�...
net start TestService
echo -----------------------------
echo    ���������ɹ�
echo -----------------------------
pause