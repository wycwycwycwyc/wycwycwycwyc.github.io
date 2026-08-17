"""
该程序由scripthub提供
*****注意：该程序初衷为作者提供，如有自己的需求，请自行修改代码*******
*****请将文本中的inferno替换为自己的名字********************
"""
import subprocess
import time
import winsound
import os
import threading
import keyboard
import sys
import signal
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

TARGET_IP = "26.29.150.235"#服务端ip
TARGET_PORT = 12345#服务端端口
PING_INTERVAL = 2
count = 0
mc_launched = False
mc_connected = False
mc_process = None
stop_melody = False
mute_sound = False
monitor_only = False  # 仅监控模式
email_sent_success = False
connection_start_time = None
fail_email_sent_this_session = False

# ========== 邮件配置 ==========
SMTP_SERVER = "smtp.163.com"
SMTP_PORT = 465
SENDER_EMAIL = "send@scripthub.com"#邮件发送者  
SENDER_PASSWORD = "your key"#邮件发送者密码（授权码）

PLAYER_EMAIL = "player@scripthub.com"#玩家邮箱
ADMIN_EMAIL = "serveradmin@scripthub.com"#服务器管理员邮箱
NOTIFY_EMAIL = "other@scripthub.com"  # 第三方提醒人

# ========== MC 启动配置 ==========
MC_WORK_DIR = r"D:\PCL 正式版 2.12.8.2\.minecraft\versions\26.1.2-NeoForge_26.1.2.76"
JAVA_EXE = r"C:\Users\12543\AppData\Roaming\.minecraft\runtime\java-runtime-epsilon\bin\java.exe"
MC_LOG_FILE = os.path.join(MC_WORK_DIR, "logs", "latest.log")

MC_FULL_CMD = r'''
-XX:HeapDumpPath=MojangTricksIntelDriversForPerformance_javaw.exe_minecraft.exe.heapdump --sun-misc-unsafe-memory-access=allow --enable-native-access=ALL-UNNAMED "-Djava.library.path=D:\PCL 正式版 2.12.8.2\.minecraft\versions\26.1.2-NeoForge_26.1.2.76\26.1.2-NeoForge_26.1.2.76-natives" "-Djna.tmpdir=D:\PCL 正式版 2.12.8.2\.minecraft\versions\26.1.2-NeoForge_26.1.2.76\26.1.2-NeoForge_26.1.2.76-natives" "-Dorg.lwjgl.system.SharedLibraryExtractPath=D:\PCL 正式版 2.12.8.2\.minecraft\versions\26.1.2-NeoForge_26.1.2.76\26.1.2-NeoForge_26.1.2.76-natives" "-Dio.netty.native.workdir=D:\PCL 正式版 2.12.8.2\.minecraft\versions\26.1.2-NeoForge_26.1.2.76\26.1.2-NeoForge_26.1.2.76-natives" -Dminecraft.launcher.brand=PCL -Dminecraft.launcher.version=406 -cp "D:\PCL 正式版 2.12.8.2\.minecraft\libraries\at\yawk\lz4\lz4-java\1.10.1\lz4-java-1.10.1.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\com\azure\azure-json\1.4.0\azure-json-1.4.0.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\com\github\oshi\oshi-core\6.9.0\oshi-core-6.9.0.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\com\google\code\gson\gson\2.13.2\gson-2.13.2.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\com\google\guava\failureaccess\1.0.3\failureaccess-1.0.3.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\com\google\guava\guava\33.5.0-jre\guava-33.5.0-jre.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\com\ibm\icu\icu4j\77.1\icu4j-77.1.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\com\microsoft\azure\msal4j\1.23.1\msal4j-1.23.1.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\com\mojang\authlib\7.0.63\authlib-7.0.63.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\com\mojang\blocklist\1.0.10\blocklist-1.0.10.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\com\mojang\brigadier\1.3.10\brigadier-1.3.10.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\com\mojang\datafixerupper\9.0.19\datafixerupper-9.0.19.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\com\mojang\jtracy\1.0.37\jtracy-1.0.37.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\com\mojang\jtracy\1.0.37\jtracy-1.0.37-natives-windows.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\com\mojang\logging\1.6.11\logging-1.6.11.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\com\mojang\patchy\2.2.10\patchy-2.2.10.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\com\mojang\text2speech\1.18.11\text2speech-1.18.11.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\commons-codec\commons-codec\1.19.0\commons-codec-1.19.0.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\commons-io\commons-io\2.20.0\commons-io-2.20.0.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\io\netty\netty-buffer\4.2.7.Final\netty-buffer-4.2.7.Final.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\io\netty\netty-codec-base\4.2.7.Final\netty-codec-base-4.2.7.Final.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\io\netty\netty-codec-compression\4.2.7.Final\netty-codec-compression-4.2.7.Final.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\io\netty\netty-codec-http\4.2.7.Final\netty-codec-http-4.2.7.Final.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\io\netty\netty-common\4.2.7.Final\netty-common-4.2.7.Final.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\io\netty\netty-handler\4.2.7.Final\netty-handler-4.2.7.Final.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\io\netty\netty-resolver\4.2.7.Final\netty-resolver-4.2.7.Final.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\io\netty\netty-transport-classes-epoll\4.2.7.Final\netty-transport-classes-epoll-4.2.7.Final.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\io\netty\netty-transport-classes-kqueue\4.2.7.Final\netty-transport-classes-kqueue-4.2.7.Final.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\io\netty\netty-transport-native-unix-common\4.2.7.Final\netty-transport-native-unix-common-4.2.7.Final.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\io\netty\netty-transport\4.2.7.Final\netty-transport-4.2.7.Final.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\it\unimi\dsi\fastutil\8.5.18\fastutil-8.5.18.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\net\java\dev\jna\jna-platform\5.17.0\jna-platform-5.17.0.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\net\java\dev\jna\jna\5.17.0\jna-5.17.0.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\net\sf\jopt-simple\jopt-simple\5.0.4\jopt-simple-5.0.4.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\org\apache\commons\commons-compress\1.28.0\commons-compress-1.28.0.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\org\apache\commons\commons-lang3\3.19.0\commons-lang3-3.19.0.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\org\apache\logging\log4j\log4j-api\2.25.2\log4j-api-2.25.2.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\org\apache\logging\log4j\log4j-core\2.25.2\log4j-core-2.25.2.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\org\apache\logging\log4j\log4j-slf4j2-impl\2.25.2\log4j-slf4j2-impl-2.25.2.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\org\jcraft\jorbis\0.0.17\jorbis-0.0.17.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\org\joml\joml\1.10.8\joml-1.10.8.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\org\jspecify\jspecify\1.0.0\jspecify-1.0.0.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\org\lwjgl\lwjgl-freetype\3.4.1\lwjgl-freetype-3.4.1.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\org\lwjgl\lwjgl-freetype\3.4.1\lwjgl-freetype-3.4.1-natives-windows.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\org\lwjgl\lwjgl-freetype\3.4.1\lwjgl-freetype-3.4.1-natives-windows-arm64.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\org\lwjgl\lwjgl-freetype\3.4.1\lwjgl-freetype-3.4.1-natives-windows-x86.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\org\lwjgl\lwjgl-glfw\3.4.1\lwjgl-glfw-3.4.1.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\org\lwjgl\lwjgl-glfw\3.4.1\lwjgl-glfw-3.4.1-natives-windows.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\org\lwjgl\lwjgl-glfw\3.4.1\lwjgl-glfw-3.4.1-natives-windows-arm64.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\org\lwjgl\lwjgl-glfw\3.4.1\lwjgl-glfw-3.4.1-natives-windows-x86.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\org\lwjgl\lwjgl-jemalloc\3.4.1\lwjgl-jemalloc-3.4.1.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\org\lwjgl\lwjgl-jemalloc\3.4.1\lwjgl-jemalloc-3.4.1-natives-windows.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\org\lwjgl\lwjgl-jemalloc\3.4.1\lwjgl-jemalloc-3.4.1-natives-windows-arm64.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\org\lwjgl\lwjgl-jemalloc\3.4.1\lwjgl-jemalloc-3.4.1-natives-windows-x86.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\org\lwjgl\lwjgl-openal\3.4.1\lwjgl-openal-3.4.1.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\org\lwjgl\lwjgl-openal\3.4.1\lwjgl-openal-3.4.1-natives-windows.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\org\lwjgl\lwjgl-openal\3.4.1\lwjgl-openal-3.4.1-natives-windows-arm64.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\org\lwjgl\lwjgl-openal\3.4.1\lwjgl-openal-3.4.1-natives-windows-x86.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\org\lwjgl\lwjgl-opengl\3.4.1\lwjgl-opengl-3.4.1.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\org\lwjgl\lwjgl-opengl\3.4.1\lwjgl-opengl-3.4.1-natives-windows.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\org\lwjgl\lwjgl-opengl\3.4.1\lwjgl-opengl-3.4.1-natives-windows-arm64.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\org\lwjgl\lwjgl-opengl\3.4.1\lwjgl-opengl-3.4.1-natives-windows-x86.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\org\lwjgl\lwjgl-stb\3.4.1\lwjgl-stb-3.4.1.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\org\lwjgl\lwjgl-stb\3.4.1\lwjgl-stb-3.4.1-natives-windows.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\org\lwjgl\lwjgl-stb\3.4.1\lwjgl-stb-3.4.1-natives-windows-arm64.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\org\lwjgl\lwjgl-stb\3.4.1\lwjgl-stb-3.4.1-natives-windows-x86.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\org\lwjgl\lwjgl-tinyfd\3.4.1\lwjgl-tinyfd-3.4.1.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\org\lwjgl\lwjgl-tinyfd\3.4.1\lwjgl-tinyfd-3.4.1-natives-windows.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\org\lwjgl\lwjgl-tinyfd\3.4.1\lwjgl-tinyfd-3.4.1-natives-windows-arm64.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\org\lwjgl\lwjgl-tinyfd\3.4.1\lwjgl-tinyfd-3.4.1-natives-windows-x86.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\org\lwjgl\lwjgl\3.4.1\lwjgl-3.4.1.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\org\lwjgl\lwjgl\3.4.1\lwjgl-3.4.1-natives-windows.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\org\lwjgl\lwjgl\3.4.1\lwjgl-3.4.1-natives-windows-arm64.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\org\lwjgl\lwjgl\3.4.1\lwjgl-3.4.1-natives-windows-x86.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\org\slf4j\slf4j-api\2.0.17\slf4j-api-2.0.17.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\net\neoforged\fancymodloader\earlydisplay\11.0.13\earlydisplay-11.0.13.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\net\neoforged\fancymodloader\loader\11.0.13\loader-11.0.13.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\net\neoforged\accesstransformers\11.0.2\accesstransformers-11.0.2.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\org\ow2\asm\asm-commons\9.9.1\asm-commons-9.9.1.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\net\neoforged\mergetool\2.0.7\mergetool-2.0.7-api.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\org\ow2\asm\asm-util\9.9.1\asm-util-9.9.1.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\org\ow2\asm\asm-analysis\9.9.1\asm-analysis-9.9.1.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\org\ow2\asm\asm-tree\9.9.1\asm-tree-9.9.1.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\net\neoforged\bus\8.0.5\bus-8.0.5.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\org\ow2\asm\asm\9.9.1\asm-9.9.1.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\com\electronwill\night-config\toml\3.8.3\toml-3.8.3.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\com\electronwill\night-config\core\3.8.3\core-3.8.3.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\net\neoforged\JarJarSelector\0.5.0\JarJarSelector-0.5.0.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\net\neoforged\JarJarMetadata\0.5.0\JarJarMetadata-0.5.0.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\org\apache\maven\maven-artifact\3.9.9\maven-artifact-3.9.9.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\net\jodah\typetools\0.6.3\typetools-0.6.3.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\net\minecrell\terminalconsoleappender\1.3.0\terminalconsoleappender-1.3.0.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\net\fabricmc\sponge-mixin\0.17.3+mixin.0.8.7\sponge-mixin-0.17.3+mixin.0.8.7.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\net\neoforged\accesstransformers\at-parser\11.0.2\at-parser-11.0.2.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\org\jline\jline-reader\3.20.0\jline-reader-3.20.0.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\org\jline\jline-terminal\3.20.0\jline-terminal-3.20.0.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\net\neoforged\srgutils\1.0.10\srgutils-1.0.10.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\com\google\guava\listenablefuture\9999.0-empty-to-avoid-conflict-with-guava\listenablefuture-9999.0-empty-to-avoid-conflict-with-guava.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\com\google\errorprone\error_prone_annotations\2.41.0\error_prone_annotations-2.41.0.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\com\google\j2objc\j2objc-annotations\3.1\j2objc-annotations-3.1.jar;D:\PCL 正式版 2.12.8.2\.minecraft\libraries\org\codehaus\plexus\plexus-utils\3.5.1\plexus-utils-3.5.1.jar;D:\PCL 正式版 2.12.8.2\.minecraft\versions\26.1.2-NeoForge_26.1.2.76\26.1.2-NeoForge_26.1.2.76.jar" -Djava.net.preferIPv6Addresses=system "-DlibraryDirectory=D:\PCL 正式版 2.12.8.2\.minecraft\libraries" --add-opens java.base/java.lang.invoke=ALL-UNNAMED --add-exports jdk.naming.dns/com.sun.jndi.dns=java.naming -XX:-OmitStackTraceInFastThrow -Djdk.lang.Process.allowAmbiguousCommands=True -Dfml.ignoreInvalidMinecraftCertificates=True -Dfml.ignorePatchDiscrepancies=True -javaagent:"C:\Users\12543\AppData\Roaming\Meloong\LUA.jar" -Xmx7168m -XX:+UnlockExperimentalVMOptions -XX:+UseCompactObjectHeaders -XX:+UseG1GC -XX:G1NewSizePercent=20 -XX:G1ReservePercent=20 -XX:G1HeapRegionSize=32M -XX:MaxGCPauseMillis=50 -XX:+PerfDisableSharedMem -XX:MinHeapFreeRatio=25 -XX:MaxHeapFreeRatio=40 -Dlog4j2.formatMsgNoLookups=true -Dstdout.encoding=UTF-8 -Dstderr.encoding=UTF-8 -Dfile.encoding=COMPAT net.neoforged.fml.startup.Client --username inferno --version 26.1.2-NeoForge_26.1.2.76 --gameDir "D:\PCL 正式版 2.12.8.2\.minecraft\versions\26.1.2-NeoForge_26.1.2.76" --assetsDir "D:\PCL 正式版 2.12.8.2\.minecraft\assets" --assetIndex 30 --uuid 00000FFFFFFFFFFFFFFFFFFFFFF3565D --accessToken 00000FFFFFFFFFFFFFFFFFFFFFF3565D --clientId ${clientid} --xuid ${auth_xuid} --versionType PCL --width 854 --height 480 --fml.neoForgeVersion 26.1.2.76 --fml.mcVersion 26.1.2 --fml.neoFormVersion 1 --quickPlayMultiplayer 26.29.150.235:12345
'''.strip()#请在生成的mc启动脚本中加上自动进入服务端命令
# ===========请在此处一次粘贴你的mc地址，Java地址，mc启动脚本====================

def send_email(to_email, subject, html_content, is_admin=False):
    try:
        sender_name = "Inferno自动程序" if is_admin else "Minecraft服务器通知"
        msg = MIMEMultipart('alternative')
        msg['From'] = f'"{sender_name}" <{SENDER_EMAIL}>'
        msg['To'] = to_email
        msg['Subject'] = subject
        msg.attach(MIMEText(html_content, 'html', 'utf-8'))
        with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT) as server:
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.sendmail(SENDER_EMAIL, to_email, msg.as_string())
        print(f"邮件已发送至 {to_email}")
        return True
    except Exception as e:
        print(f"发送邮件失败: {e}")
        return False

def send_connection_failed_email():
    global fail_email_sent_this_session
    if fail_email_sent_this_session or monitor_only:
        return
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    player_html = f'''
    <!DOCTYPE html><html><head><meta charset="utf-8">
    <style>body{{font-family:'Microsoft YaHei',Arial,sans-serif;margin:0;padding:20px;background:#f5f5f5}}.container{{max-width:600px;margin:0 auto;background:#fff;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,.1);overflow:hidden}}.header{{background:#d32f2f;color:#fff;padding:25px;text-align:center}}.header h2{{margin:0;font-size:20px;font-weight:normal}}.content{{padding:25px}}.info-box{{background:#fff8e1;border-left:3px solid #ffa000;padding:12px;margin:15px 0}}.info-box p{{margin:3px 0;color:#333;font-size:14px}}.footer{{background:#fafafa;padding:12px;text-align:center;color:#999;font-size:12px;border-top:1px solid #eee}}.status{{color:#d32f2f}}</style></head>
    <body><div class="container"><div class="header"><h2>服务器连接失败</h2><p style="margin:8px 0 0;opacity:.85;font-size:14px">Minecraft 服务器连接超时</p></div>
    <div class="content"><p style="color:#555;font-size:14px">连接状态报告</p>
    <div class="info-box"><p>检测时间: {current_time}</p><p>服务器: {TARGET_IP}:{TARGET_PORT}</p><p>状态: <span class="status">连接超时 (已等待90秒)</span></p><p>用户: inferno</p></div>
    <p style="color:#555;font-size:14px;line-height:1.6">无法连接至服务器。程序会自动重试，请稍候。如长时间无法连接，请联系服主重启服务端。</p></div>
    <div class="footer"><p>此邮件由 Minecraft服务器通知 自动发送</p><p>{current_time}</p></div></div></body></html>'''
    
    admin_html = f'''
    <!DOCTYPE html><html><head><meta charset="utf-8">
    <style>body{{font-family:'Microsoft YaHei',Arial,sans-serif;margin:0;padding:20px;background:#f5f5f5}}.container{{max-width:600px;margin:0 auto;background:#fff;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,.1);overflow:hidden}}.header{{background:#d32f2f;color:#fff;padding:25px;text-align:center}}.header h2{{margin:0;font-size:20px;font-weight:normal}}.content{{padding:25px}}.info-box{{background:#fff8e1;border-left:3px solid #ffa000;padding:12px;margin:15px 0}}.info-box p{{margin:3px 0;color:#333;font-size:14px}}.alert-box{{background:#ffebee;border-left:3px solid #d32f2f;padding:12px;margin:15px 0}}.alert-box p{{margin:3px 0;color:#333;font-size:14px}}.footer{{background:#fafafa;padding:12px;text-align:center;color:#999;font-size:12px;border-top:1px solid #eee}}</style></head>
    <body><div class="container"><div class="header"><h2>需要重启服务器</h2><p style="margin:8px 0 0;opacity:.85;font-size:14px">玩家无法进入服务器</p></div>
    <div class="content"><p style="color:#555;font-size:14px">服务器异常报告</p>
    <div class="info-box"><p>检测时间: {current_time}</p><p>服务器: {TARGET_IP}:{TARGET_PORT}</p><p>用户: inferno</p></div>
    <div class="alert-box"><p>玩家 inferno 已等待90秒仍无法进入服务器，请重启服务端。</p></div>
    <p style="color:#999;font-size:12px">来源: inferno的自动程序</p></div>
    <div class="footer"><p>此邮件由 Inferno自动程序 发送</p><p>{current_time}</p></div></div></body></html>'''
    
    notify_html = f'''
    <!DOCTYPE html><html><head><meta charset="utf-8">
    <style>body{{font-family:'Microsoft YaHei',Arial,sans-serif;margin:0;padding:20px;background:#f5f5f5}}.container{{max-width:600px;margin:0 auto;background:#fff;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,.1);overflow:hidden}}.header{{background:#d32f2f;color:#fff;padding:25px;text-align:center}}.header h2{{margin:0;font-size:20px;font-weight:normal}}.content{{padding:25px}}.info-box{{background:#fff8e1;border-left:3px solid #ffa000;padding:12px;margin:15px 0}}.info-box p{{margin:3px 0;color:#333;font-size:14px}}.footer{{background:#fafafa;padding:12px;text-align:center;color:#999;font-size:12px;border-top:1px solid #eee}}</style></head>
    <body><div class="container"><div class="header"><h2>服务器连接失败</h2><p style="margin:8px 0 0;opacity:.85;font-size:14px">Minecraft 服务器连接超时</p></div>
    <div class="content"><p style="color:#555;font-size:14px">服务器: {TARGET_IP}:{TARGET_PORT}</p>
    <div class="info-box"><p>检测时间: {current_time}</p><p>用户: inferno</p><p>状态: 连接超时 (已等待90秒)</p></div>
    <p style="color:#555;font-size:14px">来源: inferno的自动程序</p></div>
    <div class="footer"><p>此邮件由 Inferno自动程序 发送</p><p>{current_time}</p></div></div></body></html>'''
    
    send_email(PLAYER_EMAIL, "Minecraft服务器连接失败 - inferno", player_html, is_admin=False)
    send_email(ADMIN_EMAIL, "需要重启服务器 - 玩家无法进入", admin_html, is_admin=True)
    send_email(NOTIFY_EMAIL, "Minecraft服务器连接失败 - inferno", notify_html, is_admin=True)
    fail_email_sent_this_session = True

def send_connection_success_email():
    global email_sent_success
    if email_sent_success or monitor_only:
        return
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    player_html = f'''
    <!DOCTYPE html><html><head><meta charset="utf-8">
    <style>body{{font-family:'Microsoft YaHei',Arial,sans-serif;margin:0;padding:20px;background:#f5f5f5}}.container{{max-width:600px;margin:0 auto;background:#fff;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,.1);overflow:hidden}}.header{{background:#388e3c;color:#fff;padding:25px;text-align:center}}.header h2{{margin:0;font-size:20px;font-weight:normal}}.content{{padding:25px}}.info-box{{background:#e8f5e9;border-left:3px solid #388e3c;padding:12px;margin:15px 0}}.info-box p{{margin:3px 0;color:#333;font-size:14px}}.footer{{background:#fafafa;padding:12px;text-align:center;color:#999;font-size:12px;border-top:1px solid #eee}}.status{{color:#388e3c}}</style></head>
    <body><div class="container"><div class="header"><h2>已成功进入服务器</h2><p style="margin:8px 0 0;opacity:.85;font-size:14px">Minecraft 服务器连接正常</p></div>
    <div class="content"><p style="color:#555;font-size:14px">连接状态报告</p>
    <div class="info-box"><p>进入时间: {current_time}</p><p>服务器: {TARGET_IP}:{TARGET_PORT}</p><p>状态: <span class="status">已成功进入服务器</span></p><p>用户: inferno</p></div>
    <p style="color:#555;font-size:14px">已成功进入服务器，可以开始游玩了。</p></div>
    <div class="footer"><p>此邮件由 Minecraft服务器通知 自动发送</p><p>{current_time}</p></div></div></body></html>'''
    
    admin_html = f'''
    <!DOCTYPE html><html><head><meta charset="utf-8">
    <style>body{{font-family:'Microsoft YaHei',Arial,sans-serif;margin:0;padding:20px;background:#f5f5f5}}.container{{max-width:600px;margin:0 auto;background:#fff;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,.1);overflow:hidden}}.header{{background:#388e3c;color:#fff;padding:25px;text-align:center}}.header h2{{margin:0;font-size:20px;font-weight:normal}}.content{{padding:25px}}.info-box{{background:#e8f5e9;border-left:3px solid #388e3c;padding:12px;margin:15px 0}}.info-box p{{margin:3px 0;color:#333;font-size:14px}}.footer{{background:#fafafa;padding:12px;text-align:center;color:#999;font-size:12px;border-top:1px solid #eee}}</style></head>
    <body><div class="container"><div class="header"><h2>玩家已进入服务器</h2><p style="margin:8px 0 0;opacity:.85;font-size:14px">服务器状态正常</p></div>
    <div class="content"><p style="color:#555;font-size:14px">连接成功报告</p>
    <div class="info-box"><p>进入时间: {current_time}</p><p>服务器: {TARGET_IP}:{TARGET_PORT}</p><p>用户: inferno</p><p>状态: 我已成功进入服务器</p></div>
    <p style="color:#999;font-size:12px">来源: inferno的自动程序</p></div>
    <div class="footer"><p>此邮件由 Inferno自动程序 发送</p><p>{current_time}</p></div></div></body></html>'''
    
    notify_html = f'''
    <!DOCTYPE html><html><head><meta charset="utf-8">
    <style>body{{font-family:'Microsoft YaHei',Arial,sans-serif;margin:0;padding:20px;background:#f5f5f5}}.container{{max-width:600px;margin:0 auto;background:#fff;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,.1);overflow:hidden}}.header{{background:#388e3c;color:#fff;padding:25px;text-align:center}}.header h2{{margin:0;font-size:20px;font-weight:normal}}.content{{padding:25px}}.info-box{{background:#e8f5e9;border-left:3px solid #388e3c;padding:12px;margin:15px 0}}.info-box p{{margin:3px 0;color:#333;font-size:14px}}.footer{{background:#fafafa;padding:12px;text-align:center;color:#999;font-size:12px;border-top:1px solid #eee}}</style></head>
    <body><div class="container"><div class="header"><h2>服务器已开启</h2><p style="margin:8px 0 0;opacity:.85;font-size:14px">Minecraft 服务器连接正常</p></div>
    <div class="content"><p style="color:#555;font-size:14px">服务器: {TARGET_IP}:{TARGET_PORT}</p>
    <div class="info-box"><p>进入时间: {current_time}</p><p>用户: inferno</p><p>状态: 已成功进入服务器</p></div>
    <p style="color:#999;font-size:12px">来源: inferno的自动程序</p></div>
    <div class="footer"><p>此邮件由 Inferno自动程序 发送</p><p>{current_time}</p></div></div></body></html>'''
    
    send_email(PLAYER_EMAIL, "已成功进入Minecraft服务器 - inferno", player_html, is_admin=False)
    send_email(ADMIN_EMAIL, "玩家已成功进入服务器 - inferno", admin_html, is_admin=True)
    send_email(NOTIFY_EMAIL, "Minecraft服务器已开启 - inferno", notify_html, is_admin=True)
    email_sent_success = True

def print_controls():
    print("\n" + "="*60)
    print("控制说明:")
    print("  F8 = 关闭/开启 所有提示音")
    print("  F9 = 仅关闭/开启 进入服务器后的循环提示音")
    print("  F10 = 切换仅监控模式 (不启动MC/不发邮件，只提示音)")
    print("  请勿直接关闭此窗口，否则Minecraft也会被关闭")
    print("  如需退出，请先正常退出游戏，然后按 Ctrl+C 关闭脚本")
    print("="*60 + "\n")

def play_connected_melody_loop():
    global stop_melody, mute_sound
    print("开始循环播放提示音...")
    melody_up = [(2000, 150), (2500, 150), (3000, 150), (3500, 200), (4000, 300)]
    melody_down = [(3500, 150), (3000, 150), (2500, 150), (2000, 300)]
    while not stop_melody:
        if not mute_sound:
            for freq, duration in melody_up:
                if stop_melody: break
                winsound.Beep(freq, duration)
                time.sleep(0.03)
            if stop_melody: break
            time.sleep(0.1)
            for freq, duration in melody_down:
                if stop_melody: break
                winsound.Beep(freq, duration)
                time.sleep(0.03)
            if stop_melody: break
            time.sleep(0.5)
        else:
            time.sleep(1)

def on_f8_press(event):
    global mute_sound
    mute_sound = not mute_sound
    print("\n所有提示音已关闭" if mute_sound else "\n所有提示音已开启")

def on_f9_press(event):
    global stop_melody
    if mc_connected:
        stop_melody = not stop_melody
        if stop_melody:
            print("\n循环提示音已关闭 (ping提示音保留)")
        else:
            print("\n循环提示音已开启")
            threading.Thread(target=play_connected_melody_loop, daemon=True).start()
    else:
        print("\n尚未进入服务器，无法控制循环提示音")

def on_f10_press(event):
    global monitor_only
    monitor_only = not monitor_only
    if monitor_only:
        print("\n[仅监控模式] 已开启 - 只播放提示音，不启动MC，不发送邮件")
    else:
        print("\n[正常模式] 已恢复 - 将启动MC并发送邮件")

def on_exit():
    print("\n正在关闭脚本...")
    global stop_melody, mc_process
    stop_melody = True
    if mc_process:
        print("正在关闭 Minecraft...")
        try:
            mc_process.terminate()
            time.sleep(2)
            if mc_process.poll() is None:
                mc_process.kill()
            print("Minecraft 已关闭")
        except: pass
    print("脚本已退出")
    sys.exit(0)

def kill_minecraft():
    global mc_process
    if mc_process:
        try:
            print("正在关闭MC进程...")
            mc_process.terminate()
            time.sleep(3)
            if mc_process.poll() is None:
                mc_process.kill()
                time.sleep(2)
            print("MC进程已关闭")
        except Exception as e:
            print(f"关闭MC进程时出错: {e}")
        finally:
            mc_process = None
    try:
        result = subprocess.run(['taskkill', '/F', '/IM', 'java.exe'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if result.returncode == 0:
            print("已强制关闭所有Java进程")
    except: pass

def launch_minecraft():
    global mc_process, connection_start_time, email_sent_success
    kill_minecraft()
    time.sleep(3)
    bat_path = os.path.join(MC_WORK_DIR, "_launch_temp.bat")
    bat_content = f"""@echo off
chcp 65001>nul
cd /D "{MC_WORK_DIR}"
"{JAVA_EXE}" {MC_FULL_CMD}
"""
    with open(bat_path, "w", encoding="utf-8") as f:
        f.write(bat_content)
    mc_process = subprocess.Popen(f'"{bat_path}"', shell=True, cwd=MC_WORK_DIR)
    connection_start_time = time.time()
    email_sent_success = False
    print("MC启动命令已发送，游戏正在加载")

def check_connection_timeout():
    global connection_start_time, mc_launched, mc_connected
    if not mc_launched or mc_connected: return
    if connection_start_time and (time.time() - connection_start_time) > 90:
        print("\n已等待90秒仍未进入服务器")
        if not fail_email_sent_this_session and not email_sent_success:
            print("正在发送连接失败邮件...")
            send_connection_failed_email()
        else:
            print("已发送过邮件，跳过")
        print("正在关闭MC并重新启动...")
        launch_minecraft()

def monitor_mc_logs():
    global mc_connected, stop_melody, mc_launched, email_sent_success
    
    print(f"开始监控MC日志: {MC_LOG_FILE}")
    print("等待进入服务器...")
    
    time.sleep(30)
    
    for i in range(30):
        if os.path.exists(MC_LOG_FILE):
            print("找到日志文件")
            break
        print(f"等待日志文件... ({i+1}/30)")
        time.sleep(2)
    
    if not os.path.exists(MC_LOG_FILE):
        print("未找到MC日志文件")
        return
    
    last_position = 0
    melody_thread = None
    
    while True:
        try:
            if not monitor_only:
                check_connection_timeout()
            
            if not os.path.exists(MC_LOG_FILE):
                time.sleep(2)
                continue
            
            current_size = os.path.getsize(MC_LOG_FILE)
            
            with open(MC_LOG_FILE, 'r', encoding='utf-8', errors='ignore') as f:
                if last_position > current_size:
                    last_position = 0
                
                f.seek(last_position)
                new_lines = f.readlines()
                last_position = f.tell()
                
                for line in new_lines:
                    line_stripped = line.strip()
                    
                    if any(keyword in line for keyword in [
                        "Connecting to",
                        "dimension change",
                    ]):
                        print(f"[日志] {line_stripped}")
                    
                    # 检测无法进入的消息
                    if not mc_connected and mc_launched:
                        if any(keyword in line for keyword in [
                            "You are not whitelisted",
                            "Server is full",
                            "You are banned",
                            "Connection refused",
                            "Failed to connect",
                        ]):
                            print(f"\n检测到无法进入服务器: {line_stripped[:80]}")
                            if not monitor_only and not fail_email_sent_this_session and not email_sent_success:
                                print("正在发送连接失败邮件...")
                                send_connection_failed_email()
                            if not monitor_only:
                                print("立即关闭MC并重启...")
                                launch_minecraft()
                            continue
                    
                    # 检测进入服务器
                    if not mc_connected:
                        if "dimension change" in line:
                            mc_connected = True
                            stop_melody = False
                            print(f"\n已成功进入服务器: {line_stripped[:80]}")
                            print("按 F9 可以关闭/开启循环提示音")
                            
                            if not monitor_only and not email_sent_success:
                                print("正在发送连接成功邮件...")
                                send_connection_success_email()
                            
                            melody_thread = threading.Thread(target=play_connected_melody_loop, daemon=True)
                            melody_thread.start()
                    
                    # 检测断线
                    if mc_connected:
                        if any(keyword in line for keyword in [
                            "Disconnected",
                            "Connection lost",
                            "Timed out",
                            "Lost connection",
                            "Closed by remote host",
                            "Stopping!",
                            "Server closed",
                        ]):
                            print(f"\n检测到断线: {line_stripped[:80]}")
                            mc_connected = False
                            stop_melody = True
                            email_sent_success = False
                            
                            if not monitor_only:
                                print("正在关闭 Minecraft...")
                                kill_minecraft()
                                mc_launched = False
                            print("已重置，继续监控服务器...\n")
                            
        except Exception as e:
            time.sleep(2)
            continue
        
        time.sleep(1)

keyboard.on_press_key("F8", on_f8_press)
keyboard.on_press_key("F9", on_f9_press)
keyboard.on_press_key("F10", on_f10_press)
signal.signal(signal.SIGINT, lambda sig, frame: on_exit())

print_controls()
print(f"持续监控 {TARGET_IP}，连通后蜂鸣 (3000Hz，1秒)")
print(f"首次连通将自动启动 Minecraft")
print(f"进入服务器后持续播放提示音，断线自动关闭MC并重新监控")
print(f"90秒未进入服务器将自动发送邮件通知并重试（失败邮件只发一次）")
print(f"按 F10 切换仅监控模式（不启动MC/不发邮件）")
print(f"请勿直接关闭此窗口，否则MC也会被关闭\n")

connection_monitor_started = False

try:
    while True:
        count += 1
        print(f"第 {count} 次请求...")
        
        res = subprocess.run(
            ["ping", "-n", "1", "-w", "1000", TARGET_IP],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        
        if res.returncode == 0:
            print(f"第{count}次请求: IP连通，发出提示音")
            
            if not mc_launched and not monitor_only:
                print("检测到服务器连通，正在启动 Minecraft...")
                launch_minecraft()
                mc_launched = True
                
                if not connection_monitor_started:
                    threading.Thread(target=monitor_mc_logs, daemon=True).start()
                    connection_monitor_started = True
            
            if not mute_sound:
                winsound.Beep(3000, 1000)
        else:
            print(f"第{count}次请求: 无响应\n")
        
        time.sleep(PING_INTERVAL)
        
except KeyboardInterrupt:
    on_exit()