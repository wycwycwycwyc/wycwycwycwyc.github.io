    const Service = require('node-windows').Service;

    // 创建服务对象
    const svc = new Service({
        name: 'ScriptHubService',
        description: '脚本存放站服务',
        script: 'server.js' // 确保这里的路径是正确的
    });

    // 当服务安装后自动启动服务
    svc.on('install', () => {
        console.log(`${svc.name} installed`);
        svc.start().then(() => {
            console.log(`${svc.name} started`);
        });
    });

    // 监听服务启动事件
    svc.on('start', () => {
        console.log(`${svc.name} started`);
    });

    // 监听服务停止事件
    svc.on('stop', () => {
        console.log(`${svc.name} stopped`);
    });

    // 监听服务错误事件
    svc.on('error', (error) => {
        console.error(`Error: ${error}`);
    });

    // 安装服务
    svc.install();