        // 全局变量
        let currentMode = 'basic';
        let basicValue = '0';
        let basicHistory = '';
        let scientificValue = '0';
        let scientificHistory = '';
        
        let functions = [];
        let graph = null;
        
        // 切换标签页
        function switchTab(tabId) {
            document.querySelectorAll('.tab').forEach(tab => {
                tab.classList.remove('active');
            });
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            document.querySelector(`.tab[onclick="switchTab('${tabId}')"]`).classList.add('active');
            document.getElementById(tabId).classList.add('active');
            currentMode = tabId;
            
            // 初始化图表
            if (tabId === 'graphing' && !graph) {
                initGraph();
            }
        }
        
        // 普通计算器功能
        function appendNumber(mode, num) {
            const display = document.getElementById(`${mode}-display`);
            let currentValue = mode === 'basic' ? basicValue : scientificValue;
            
            if (currentValue === '0' && num !== '.') {
                currentValue = num;
            } else {
                currentValue += num;
            }
            
            updateDisplay(mode, currentValue);
        }
        
        function appendDecimal(mode) {
            const display = document.getElementById(`${mode}-display`);
            let currentValue = mode === 'basic' ? basicValue : scientificValue;
            
            // 防止重复添加小数点
            if (!currentValue.includes('.')) {
                currentValue += '.';
                updateDisplay(mode, currentValue);
            }
        }
        
        function appendOperator(mode, operator) {
            const display = document.getElementById(`${mode}-display`);
            let currentValue = mode === 'basic' ? basicValue : scientificValue;
            let history = mode === 'basic' ? basicHistory : scientificHistory;
            
            // 如果当前值是0且历史记录为空，则不添加操作符
            if (currentValue === '0' && history === '') {
                return;
            }
            
            // 如果历史记录不为空且当前值不为空，则先计算结果
            if (history !== '' && currentValue !== '0') {
                calculate(mode);
                currentValue = mode === 'basic' ? basicValue : scientificValue;
            }
            
            history = currentValue + ' ' + operator + ' ';
            currentValue = '0';
            
            if (mode === 'basic') {
                basicHistory = history;
            } else {
                scientificHistory = history;
            }
            
            updateDisplay(mode, currentValue, history);
        }
        
        function clearDisplay(mode) {
            if (mode === 'basic') {
                basicValue = '0';
                basicHistory = '';
            } else {
                scientificValue = '0';
                scientificHistory = '';
            }
            updateDisplay(mode, '0', '');
        }
        
        function toggleSign(mode) {
            let currentValue = mode === 'basic' ? basicValue : scientificValue;
            
            if (currentValue !== '0') {
                if (currentValue.startsWith('-')) {
                    currentValue = currentValue.substring(1);
                } else {
                    currentValue = '-' + currentValue;
                }
            }
            
            updateDisplay(mode, currentValue);
        }
        
        function percentage(mode) {
            let currentValue = mode === 'basic' ? basicValue : scientificValue;
            
            currentValue = (parseFloat(currentValue) / 100).toString();
            updateDisplay(mode, currentValue);
        }
        
        function backspace(mode) {
            let currentValue = mode === 'basic' ? basicValue : scientificValue;
            
            if (currentValue.length === 1 || (currentValue.length === 2 && currentValue.startsWith('-'))) {
                currentValue = '0';
            } else {
                currentValue = currentValue.slice(0, -1);
            }
            
            updateDisplay(mode, currentValue);
        }
        
        function calculate(mode) {
            let currentValue = mode === 'basic' ? basicValue : scientificValue;
            let history = mode === 'basic' ? basicHistory : scientificHistory;
            
            if (history === '') {
                return;
            }
            
            // 替换显示的操作符为JavaScript可识别的操作符
            let expression = history.replace('×', '*') + currentValue;
            
            try {
                currentValue = eval(expression).toString();
                history = '';
            } catch (e) {
                currentValue = 'Error';
                history = '';
            }
            
            updateDisplay(mode, currentValue, history);
        }
        
        function updateDisplay(mode, value, history = null) {
            const display = document.getElementById(`${mode}-display`);
            const historyDisplay = document.getElementById(`${mode}-history`);
            
            if (mode === 'basic') {
                basicValue = value;
                if (history !== null) basicHistory = history;
            } else {
                scientificValue = value;
                if (history !== null) scientificHistory = history;
            }
            
            display.textContent = value;
            historyDisplay.textContent = history || '';
            
            // 添加动画效果
            display.style.transform = 'scale(1.05)';
            setTimeout(() => {
                display.style.transform = 'scale(1)';
            }, 100);
        }
        
        // 科学计算器功能
        function scientificFunction(mode, func) {
            let currentValue = mode === 'basic' ? basicValue : scientificValue;
            
            switch (func) {
                case 'sin(':
                case 'cos(':
                case 'tan(':
                case 'log(':
                case 'ln(':
                case 'sqrt(':
                case 'pow(':
                    currentValue = func;
                    break;
                case 'pi':
                    currentValue = Math.PI.toString();
                    break;
                case 'e':
                    currentValue = Math.E.toString();
                    break;
                case '^2':
                    currentValue = `Math.pow(${currentValue}, 2)`;
                    evaluateScientific(mode);
                    return;
                case '^3':
                    currentValue = `Math.pow(${currentValue}, 3)`;
                    evaluateScientific(mode);
                    return;
                case '(':
                case ')':
                    currentValue += func;
                    break;
                default:
                    break;
            }
            
            updateDisplay(mode, currentValue);
        }
        
        function factorial(mode) {
            let currentValue = mode === 'basic' ? basicValue : scientificValue;
            let num = parseInt(currentValue);
            
            if (num < 0) {
                currentValue = 'Error';
            } else if (num === 0 || num === 1) {
                currentValue = '1';
            } else {
                let result = 1;
                for (let i = 2; i <= num; i++) {
                    result *= i;
                }
                currentValue = result.toString();
            }
            
            updateDisplay(mode, currentValue);
        }
        
        function evaluateScientific(mode) {
            let currentValue = mode === 'basic' ? basicValue : scientificValue;
            
            try {
                // 替换数学函数为JavaScript可识别的函数
                let expression = currentValue
                    .replace(/sin\(/g, 'Math.sin(')
                    .replace(/cos\(/g, 'Math.cos(')
                    .replace(/tan\(/g, 'Math.tan(')
                    .replace(/log\(/g, 'Math.log10(')
                    .replace(/ln\(/g, 'Math.log(')
                    .replace(/sqrt\(/g, 'Math.sqrt(')
                    .replace(/\^/g, '**')
                    .replace(/pow\(/g, 'Math.pow(');
                
                currentValue = eval(expression).toString();
            } catch (e) {
                currentValue = 'Error';
            }
            
            updateDisplay(mode, currentValue);
        }
        
        // 函数画图功能
        function initGraph() {
            const canvas = document.getElementById('graph-canvas');
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            
            graph = {
                canvas: canvas,
                ctx: canvas.getContext('2d'),
                xMin: -10,
                xMax: 10,
                yMin: -10,
                yMax: 10,
                functions: []
            };
            
            drawGraph();
        }
        
        function addFunction() {
            const input = document.getElementById('function-input');
            const funcText = input.value.trim();
            
            if (funcText === '') return;
            
            // 生成随机颜色
            const hue = Math.floor(Math.random() * 360);
            const color = `hsl(${hue}, 80%, 60%)`;
            
            const newFunc = {
                text: funcText,
                color: color,
                id: Date.now()
            };
            
            functions.push(newFunc);
            input.value = '';
            
            updateFunctionList();
            drawGraph();
        }
        
        function removeFunction(id) {
            functions = functions.filter(func => func.id !== id);
            updateFunctionList();
            drawGraph();
        }
        
        function updateFunctionList() {
            const list = document.getElementById('function-list');
            list.innerHTML = '';
            
            functions.forEach(func => {
                const item = document.createElement('div');
                item.className = 'function-item';
                item.innerHTML = `
                    <span style="color: ${func.color}">${func.text}</span>
                    <button onclick="removeFunction(${func.id})">删除</button>
                `;
                list.appendChild(item);
            });
        }
        
        function updateGraph() {
            const xMin = parseFloat(document.getElementById('x-min').value);
            const xMax = parseFloat(document.getElementById('x-max').value);
            const yMin = parseFloat(document.getElementById('y-min').value);
            const yMax = parseFloat(document.getElementById('y-max').value);
            
            if (isNaN(xMin) || isNaN(xMax) || isNaN(yMin) || isNaN(yMax)) {
                alert('请输入有效的范围值');
                return;
            }
            
            graph.xMin = xMin;
            graph.xMax = xMax;
            graph.yMin = yMin;
            graph.yMax = yMax;
            
            drawGraph();
        }
        
        function drawGraph() {
            if (!graph) return;
            
            const { canvas, ctx, xMin, xMax, yMin, yMax } = graph;
            const width = canvas.width;
            const height = canvas.height;
            
            // 清除画布
            ctx.clearRect(0, 0, width, height);
            
            // 设置背景
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--graph-bg');
            ctx.fillRect(0, 0, width, height);
            
            // 绘制网格线
            drawGrid();
            
            // 绘制坐标轴
            drawAxes();
            
            // 绘制所有函数
            functions.forEach(func => {
                drawFunction(func.text, func.color);
            });
        }
        
        function drawGrid() {
            const { ctx, xMin, xMax, yMin, yMax } = graph;
            const width = graph.canvas.width;
            const height = graph.canvas.height;
            
            ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--graph-line');
            ctx.lineWidth = 1;
            
            // 绘制垂直线
            const xStep = getStepSize(xMax - xMin);
            for (let x = Math.ceil(xMin / xStep) * xStep; x <= xMax; x += xStep) {
                if (Math.abs(x) < 0.0001) continue; // 跳过y轴
                
                const screenX = ((x - xMin) / (xMax - xMin)) * width;
                ctx.beginPath();
                ctx.moveTo(screenX, 0);
                ctx.lineTo(screenX, height);
                ctx.stroke();
                
                // 绘制刻度标签
                ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
                ctx.font = '10px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(x.toFixed(1), screenX, height - 5);
            }
            
            // 绘制水平线
            const yStep = getStepSize(yMax - yMin);
            for (let y = Math.ceil(yMin / yStep) * yStep; y <= yMax; y += yStep) {
                if (Math.abs(y) < 0.0001) continue; // 跳过x轴
                
                const screenY = height - ((y - yMin) / (yMax - yMin)) * height;
                ctx.beginPath();
                ctx.moveTo(0, screenY);
                ctx.lineTo(width, screenY);
                ctx.stroke();
                
                // 绘制刻度标签
                ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
                ctx.font = '10px Arial';
                ctx.textAlign = 'left';
                ctx.fillText(y.toFixed(1), 5, screenY + 3);
            }
        }
        
        function drawAxes() {
            const { ctx, xMin, xMax, yMin, yMax } = graph;
            const width = graph.canvas.width;
            const height = graph.canvas.height;
            
            ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
            ctx.lineWidth = 2;
            
            // 绘制x轴
            const xAxisY = height - ((0 - yMin) / (yMax - yMin)) * height;
            if (xAxisY >= 0 && xAxisY <= height) {
                ctx.beginPath();
                ctx.moveTo(0, xAxisY);
                ctx.lineTo(width, xAxisY);
                ctx.stroke();
                
                // 绘制箭头
                ctx.beginPath();
                ctx.moveTo(width - 10, xAxisY - 5);
                ctx.lineTo(width, xAxisY);
                ctx.lineTo(width - 10, xAxisY + 5);
                ctx.stroke();
                
                // 绘制x轴标签
                ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
                ctx.font = '12px Arial';
                ctx.textAlign = 'right';
                ctx.fillText('x', width - 5, xAxisY - 10);
            }
            
            // 绘制y轴
            const yAxisX = ((0 - xMin) / (xMax - xMin)) * width;
            if (yAxisX >= 0 && yAxisX <= width) {
                ctx.beginPath();
                ctx.moveTo(yAxisX, 0);
                ctx.lineTo(yAxisX, height);
                ctx.stroke();
                
                // 绘制箭头
                ctx.beginPath();
                ctx.moveTo(yAxisX - 5, 10);
                ctx.lineTo(yAxisX, 0);
                ctx.lineTo(yAxisX + 5, 10);
                ctx.stroke();
                
                // 绘制y轴标签
                ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
                ctx.font = '12px Arial';
                ctx.textAlign = 'left';
                ctx.fillText('y', yAxisX + 5, 15);
            }
            
            // 绘制原点标签
            if (xAxisY >= 0 && xAxisY <= height && yAxisX >= 0 && yAxisX <= width) {
                ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
                ctx.font = '12px Arial';
                ctx.textAlign = 'right';
                ctx.fillText('0', yAxisX - 5, xAxisY + 15);
            }
        }
        
        function drawFunction(funcText, color) {
            const { ctx, xMin, xMax, yMin, yMax } = graph;
            const width = graph.canvas.width;
            const height = graph.canvas.height;
            
            const step = (xMax - xMin) / width;
            const points = [];
            
            // 计算函数值
            for (let i = 0; i <= width; i++) {
                const x = xMin + (i / width) * (xMax - xMin);
                try {
                    // 替换数学函数和符号
                    const expr = funcText
                        .replace(/sin\(/g, 'Math.sin(')
                        .replace(/cos\(/g, 'Math.cos(')
                        .replace(/tan\(/g, 'Math.tan(')
                        .replace(/log\(/g, 'Math.log10(')
                        .replace(/ln\(/g, 'Math.log(')
                        .replace(/sqrt\(/g, 'Math.sqrt(')
                        .replace(/\^/g, '**')
                        .replace(/pow\(/g, 'Math.pow(')
                        .replace(/pi/g, 'Math.PI')
                        .replace(/e/g, 'Math.E');
                    
                    const y = eval(expr.replace(/x/g, `(${x})`));
                    
                    if (isFinite(y) && y >= yMin && y <= yMax) {
                        points.push({
                            x: i,
                            y: height - ((y - yMin) / (yMax - yMin)) * height
                        });
                    }
                } catch (e) {
                    console.error('Error evaluating function:', e);
                }
            }
            
            // 绘制函数曲线
            if (points.length > 0) {
                ctx.strokeStyle = color;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(points[0].x, points[0].y);
                
                for (let i = 1; i < points.length; i++) {
                    ctx.lineTo(points[i].x, points[i].y);
                }
                
                ctx.stroke();
            }
        }
        
        function getStepSize(range) {
            const log10 = Math.log10(range);
            const power = Math.floor(log10);
            const fraction = log10 - power;
            
            let step;
            if (fraction < 0.15) {
                step = Math.pow(10, power) / 5;
            } else if (fraction < 0.5) {
                step = Math.pow(10, power) / 2;
            } else {
                step = Math.pow(10, power);
            }
            
            return step;
        }
        
        // 初始化
        document.addEventListener('DOMContentLoaded', () => {
            // 检查是否处于深色模式
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.classList.add('dark-mode');
            }
            
            // 监听深色模式变化
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
                if (event.matches) {
                    document.documentElement.classList.add('dark-mode');
                } else {
                    document.documentElement.classList.remove('dark-mode');
                }
                
                if (currentMode === 'graphing') {
                    drawGraph();
                }
            });
            
            // 为范围输入框添加事件监听
            document.getElementById('x-min').addEventListener('change', updateGraph);
            document.getElementById('x-max').addEventListener('change', updateGraph);
            document.getElementById('y-min').addEventListener('change', updateGraph);
            document.getElementById('y-max').addEventListener('change', updateGraph);
        });