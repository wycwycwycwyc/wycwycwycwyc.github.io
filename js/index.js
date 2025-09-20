            document.addEventListener('DOMContentLoaded', function () {
                var body = document.body;
                var darkModeToggle = document.getElementById('darkModeToggle');
                var mainImage = document.getElementById('main-image');
                var opacitySelect = document.getElementById('opacitySelect');
                var blurSelect = document.getElementById('blurSelect');
                // Logo图片路径
                var lightModeLogoSrc = '/icons/logo.svg';
                var darkModeLogoSrc = '/icons/logo_dark.svg';

                // 背景图片路径
                var lightModeBackground = localStorage.getItem('lightModeBgUrl');
                var darkModeBackground = localStorage.getItem('darkModeBgUrl');;
                // 从localStorage中获取深色模式的状态和背景图片设置
                var isDarkMode = localStorage.getItem('darkMode') === 'enabled';
                var storedBackgroundImage = isDarkMode ? darkModeBackground : lightModeBackground;
                // 从 localStorage 中获取透明度设置
                var selectedOpacity = localStorage.getItem('opacity') || '0.3';
                var selectedblur = localStorage.getItem('blur') || '30';
                // 初始化页面的背景、Logo和深色模式类
                body.style.backgroundImage = storedBackgroundImage;
                mainImage.src = isDarkMode ? darkModeLogoSrc : lightModeLogoSrc;
                body.classList.toggle('dark-mode', isDarkMode);

                // 初始化透明度设置
                if (opacitySelect) {
                    opacitySelect.value = selectedOpacity;
                }
                if (blurSelect) {
                    blurSelect.value = selectedblur;
                }
                setElementsOpacity(selectedOpacity, isDarkMode);
                setElementsblur(selectedblur, isDarkMode);
                // 切换深色模式的函数
                function toggleDarkMode() {
                    // 切换深色模式状态
                    isDarkMode = !isDarkMode;

                    // 切换背景图片和Logo
                    body.style.backgroundImage = isDarkMode ? darkModeBackground : lightModeBackground;
                    mainImage.src = isDarkMode ? darkModeLogoSrc : lightModeLogoSrc;

                    // 切换深色模式类
                    body.classList.toggle('dark-mode', isDarkMode);

                    // 更新localStorage中的状态和背景图片
                    localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
                    localStorage.setItem('backgroundImage', body.style.backgroundImage);

                    // 设置元素的背景颜色
                    setElementsOpacity(selectedOpacity, isDarkMode);

                    // 创建全屏涟漪效果
                    var ripple = document.createElement('div');
                    ripple.classList.add('ripple');
                    ripple.style.position = 'fixed';
                    ripple.style.top = '0';
                    ripple.style.left = '0';
                    ripple.style.width = '100%';
                    ripple.style.height = '100%';
                    ripple.style.opacity = '0.5';
                    ripple.style.backgroundColor = isDarkMode ? 'black' : 'white';
                    ripple.style.borderRadius = '50%';
                    ripple.style.animation = 'rippleEffect 1s ease-out forwards';
                    ripple.style.pointerEvents = 'none';

                    // 将涟漪效果添加到body
                    document.body.appendChild(ripple);

                    // 动画结束后移除涟漪效果
                    setTimeout(function () {
                        ripple.remove();
                    }, 1000);
                }

                // 为深色模式切换按钮添加事件监听器
                darkModeToggle.addEventListener('click', toggleDarkMode);

                // 监听透明度选择的变化
                if (opacitySelect) {
                    blurSelect.addEventListener('change', function () {
                        selectedblur = opacitySelect.value;
                        localStorage.setItem('opacity', selectedOpacity);
                        setElementsOpacity(selectedOpacity, isDarkMode);
                    });
                }
                if (blurSelect) {
                    blurSelect.addEventListener('change', function () {
                        selectedblur = blurSelect.value;
                        localStorage.setItem('blur', selectedblur);
                        setElementsblur(selectedblur, isDarkMode);
                    });
                }
            });
                
            
            function setElementsOpacity(opacity, isDarkMode) {
                var elements = document.querySelectorAll('th,table, thead, .bottom-bar, #busuanzi-container, #tips, #time');

                if (elements.length === 0) {
                    return;
                }

                elements.forEach(function (element) {
                    if (isDarkMode) {
                        element.style.backgroundColor = `rgba(16, 16, 16, ${opacity})`;
                    } else {
                        element.style.backgroundColor = `rgba(242, 242, 242, ${opacity})`;
                    }
                });
            }
    function setElementsblur(blur, isDarkMode) {
    var elements = document.querySelectorAll('th, table, thead, .bottom-bar, #busuanzi-container, #tips, #time');

    if (elements.length === 0) {
        return;
    }

    elements.forEach(function(element) {
        // 设置背景模糊（backdrop-filter）
        element.style.backdropFilter = `blur(${blur}px)`;
        element.style.webkitBackdropFilter = `blur(${blur}px)`; // 兼容 Safari

    });
}
            document.addEventListener('DOMContentLoaded', function () {
                var loginStatusElement = document.getElementById('loginStatus');
                var logoutButton = document.getElementById('logoutButton');
                var isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
                var isDarkMode = localStorage.getItem('darkMode') === 'enabled';
                var menuVisible = false;

                if (!isLoggedIn) {
                    logoutButton.style.display = 'none';
                    loginStatusElement.onclick = function () {
                        var loginUrl = '/account/Login.html?redirect=/index.html'; // 替换为您的登录页面URL
                        window.location.href = loginUrl;
                    };
                } else {

                    loginStatusElement.querySelector('.login-status').textContent = '正在加载';
                    var user = localStorage.getItem('username');
                    // 假设有一个按钮或其他元素，用户点击后触发获取用户名的操作
                    // 假设用户ID存储在某个变量中
                    let userId = localStorage.getItem('userid');
                    const imageUrl = `https://jbcfz.serveo.net/get-icon-by-id?id=${localStorage.getItem('userid')}`;
                    document.getElementById('loginStatus').style.backgroundImage = `url('${imageUrl}')`;
                    // 使用fetch发送POST请求到后端接口
                    fetch(`${serverurl}/get-username-by-id`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id: userId })
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then(data => {
                            if (data.success) {
                                // 显示用户名
                                console.log('用户名:', data.data.username);
                                localStorage.setItem('username', data.data.username);
                                loginStatusElement.querySelector('.login-status').textContent = '';
                            } else {
                                // 显示错误信息
                                console.error(data.message);
                                swal({
                                    title: "找不到该用户，是否尝试重新登录？",
                                    text: "注意：如果页面未加载完成时进行操作请忽略，等待页面加载完成即可",
                                    type: "warning",
                                    showCancelButton: true,
                                    confirmButtonColor: "#DD6B55",
                                    confirmButtonText: "是",
                                    cancelButtonText: "否",
                                    closeOnConfirm: false,
                                    closeOnCancel: false
                                }), function (isConfirm) {
                                    if (isConfirm) {
                                        swal("正在跳转!", "正在跳转");
                                        localStorage.removeItem('isLoggedIn');
                                        localStorage.removeItem('username');
                                        localStorage.removeItem('usertype');
                                        localStorage.removeItem('userid');
                                        localStorage.removeItem('developerOptionsEnabled');
                                        window.location.href = '/account/Login.html';

                                    } else {
                                        window.location.reload();
                                    }
                                }
                            }
                        })
                        .catch(error => {
                            swal({
                                title: "找不到该用户，是否尝试重新登录？",
                                text: "注意：如果页面未加载完成时进行操作请忽略，等待页面加载完成即可",
                                type: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#DD6B55",
                                confirmButtonText: "是",
                                cancelButtonText: "否",
                                closeOnConfirm: false,
                                closeOnCancel: false
                            }, function (isConfirm) {
                                if (isConfirm) {
                                    swal("正在跳转!", "正在跳转");
                                    localStorage.removeItem('isLoggedIn');
                                    localStorage.removeItem('username');
                                    localStorage.removeItem('usertype');
                                    localStorage.removeItem('userid');
                                    localStorage.removeItem('developerOptionsEnabled');
                                    window.location.href = '/account/Login.html';
                                } else {
                                    window.location.reload();
                                }
                            })
                        });



                    loginStatusElement.onclick = function (event) {
                        event.stopPropagation(); // 阻止事件冒泡
                        toggleMenu();
                    };

                    document.addEventListener('click', function () {
                        if (!menuVisible) return;
                        hideMenu();
                    });
                }

                function logout() {
                    swal({
                        title: "您确定要退出登录吗？",
                        text: "这将清除你本地的登录信息",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "是",
                        cancelButtonText: "否",
                        closeOnConfirm: false,
                        closeOnCancel: false
                    }, function (isConfirm) {
                        if (isConfirm) {
                            localStorage.removeItem('isLoggedIn');
                            localStorage.removeItem('username');
                            localStorage.removeItem('usertype');
                            localStorage.removeItem('userid');
                            localStorage.removeItem('developerOptionsEnabled');
                            // 重定向到登录页面
                            swal("退出成功成功！", "已退出登录", "success");
                            location.reload();
                        }
                        else {
                            swal({
                                title: "正在取消",
                                text: "正在取消",
                                timer: 0,
                                showConfirmButton: false
                            })
                        }
                    })
                }
                function sa() {
                    swal({
                        title: "您确定要切换账号吗",
                        text: "这将清除你现在的登录信息",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "是",
                        cancelButtonText: "否",
                        closeOnConfirm: false,
                        closeOnCancel: false
                    }, function (isConfirm) {
                        if (isConfirm) {
                            localStorage.removeItem('isLoggedIn');
                            localStorage.removeItem('username');
                            localStorage.removeItem('usertype');
                            localStorage.removeItem('userid');
                            localStorage.removeItem('developerOptionsEnabled');
                            window.location.href = '/account/Login.html';
                        }
                        else {
                            swal({
                                title: "正在取消",
                                text: "正在取消",
                                timer: 0,
                                showConfirmButton: false
                            })
                        }
                    })
                }

                function toggleMenu() {
                    if (menuVisible) {
                        hideMenu();
                    } else {
                        showMenu();
                    }
                }

                function showMenu() {
                    var menu = document.createElement('ul');
                    menu.style.position = 'absolute';
                    menu.style.listStyle = '1px';
                    menu.style.padding = '10px';
                    menu.style.width = '200px';
                    menu.style.height = 'auto';
                    menu.style.backgroundColor = isDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)';
                    menu.style.color = isDarkMode ? 'white' : 'black';
                    menu.style.border = '1px solid #ccc';
                    menu.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.3)';
                    menu.style.zIndex = '1000';
                    menu.style.top = '100%';
                    menu.style.left = '0';
                    menu.style.opacity = '0';
                    menu.style.transform = 'translateY(-20px)';
                    menu.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

                    var menuItems = [
                        { text: '账户设置', action: function () { if(navigator.userAgent.match(/Mobile/i)){ window.location.href = 'settings.html?type=account'; }else{window.location.href = 'settings.html#account';} } },
                        { text: '切换账号', action: function () { sa(); } },
                        { text: '退出登录', action: function () { logout(); } }
                    ];

                    menuItems.forEach(function (item, index) {
                        if (index > 0) {
                            var separator = document.createElement('li');
                            separator.className = 'menu-separator';
                            menu.appendChild(separator);
                        }

                        var menuItem = document.createElement('li');
                        menuItem.className = 'menu-item';
                        menuItem.textContent = item.text;
                        menuItem.onclick = function () {
                            item.action();
                            hideMenu();
                        };
                        menu.appendChild(menuItem);
                    });

                    loginStatusElement.appendChild(menu);
                    setTimeout(function () {
                        menu.style.opacity = '1';
                        menu.style.transform = 'translateY(0)';
                        menuVisible = true;
                    }, 10);
                }
                function hideMenu() {
                    var menu = loginStatusElement.querySelector('ul');
                    if (menu) {
                        menu.style.opacity = '0';
                        menu.style.transform = 'translateY(-20px)';
                        setTimeout(function () {
                            if (menu.parentNode) { // 确保menu仍然有父节点
                                loginStatusElement.removeChild(menu);
                                menuVisible = false;
                            }
                        }, 500);
                    }
                }
            });
                document.addEventListener('DOMContentLoaded', function () {
                    var startDate = new Date('2024-01-18'); // 站点开始运行的日期
                    var currentDate = new Date(); // 当前日期
                    var diffTime = Math.abs(currentDate - startDate); // 两个日期之间的差异（毫秒）
                    var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // 转换为天数并向上取整

                    // 更新访问量元素的文本内容，添加运行时间，并在它们之间添加换行符
                    document.getElementById('busuanzi_container_site_pv').innerHTML = "本站总访问量<span id='busuanzi_value_site_pv'></span>次<br>主站运行总时间:" + diffDays + "天";
                });
            // 假设这是你的openPage函数
            function openPage(url) {
                window.location.href = url;
}
            document.addEventListener('DOMContentLoaded', function () {
                function updateLocalDateTime() {
                    const nowUtc = new Date();
                    const nowUtcAdjusted = new Date(nowUtc.getTime() + (0));
                    const year = nowUtcAdjusted.getFullYear();
                    const month = (nowUtcAdjusted.getMonth() + 1).toString().padStart(2, '0');
                    const day = nowUtcAdjusted.getDate().toString().padStart(2, '0');
                    const hoursUtc = nowUtcAdjusted.getHours().toString().padStart(2, '0');
                    const minutesUtc = nowUtcAdjusted.getMinutes().toString().padStart(2, '0');
                    const secondsUtc = nowUtcAdjusted.getSeconds().toString().padStart(2, '0');

                    document.getElementById('time_now').textContent = '本地时间：' + hoursUtc + ':' + minutesUtc + ':' + secondsUtc;
                    document.getElementById('date_now').textContent = '本地日期：' + year + '-' + month + '-' + day;
                }

                updateLocalDateTime();
                setInterval(updateLocalDateTime, 1000);

                // 监听动画进行事件
                var timeElement = document.getElementById('time');
                var settingsButton = document.getElementById('settingsButton');

                timeElement.addEventListener('animationstart', function () {
                    // 在动画开始时设置按钮的位置
                    settingsButton.style.right = '250px';
                });

                timeElement.addEventListener('animationend', function () {
                    // 在动画结束时重新定位设置按钮
                    settingsButton.style.right = '250px';
                });
            });
    document.addEventListener('DOMContentLoaded', function () {
        // 获取容器
        const tablesContainer = document.getElementById('tables-container');
        const navigationButtons = document.getElementById('navigation-buttons');

        // 存储所有表格和表格信息
        const tables = [];
        const tableNames = [];
        let currentTableIndex = 0;

        // 从服务器加载tables.json
        fetch('/config/tables.json')
            .then(response => response.json())
            .then(data => {
                // 先收集所有表格名称
                Object.keys(data).forEach(tableType => {
                    tableNames.push(tableType);
                });

                // 然后动态创建表格和导航
                createTablesFromJSON(data);
                createNavigationButtons();

                // 初始化显示第一个表格
                showTable(0);
            })
            .catch(error => {
                console.error('加载表格数据失败:', error);
                tablesContainer.innerHTML = '<p>加载表格数据失败，请刷新页面重试</p>';
            });

        // 根据JSON数据创建表格
        function createTablesFromJSON(data) {
            // 清空容器
            tablesContainer.innerHTML = '';

            // 遍历JSON中的每个表格类型
            Object.entries(data).forEach(([tableType, tableData], index) => {
                // 创建表格元素
                const tableWrapper = document.createElement('div');
                tableWrapper.className = 'table-wrapper';
                tableWrapper.style.display = 'none';

                // 创建表格元素
                const table = document.createElement('table');
                table.className = 'main-table';
                table.style.animation = 'slideUp 1.5s forwards, blurIn 1.5s forwards';

                // 创建表头
                const thead = document.createElement('thead');
                const headerRow = document.createElement('tr');

                // 获取表头字段
                const headers = Object.keys(tableData.row1 || {});

                // 创建表头单元格
                headers.forEach((header, headerIndex) => {
                    const th = document.createElement('th');

                    // 只在第一个表头单元格中添加表格选择器（当有多个表格时）
                    if (headerIndex === 0 && tableNames.length > 1) {
                        // 创建选择器
                        const tableSelector = document.createElement('select');
                        tableSelector.className = 'table-selector';
                        tableSelector.onchange = (e) => showTable(parseInt(e.target.value));

                        // 填充选择器选项（使用完整的tableNames数组）
                        tableNames.forEach((name, idx) => {
                            const option = document.createElement('option');
                            option.value = idx;
                            option.textContent = name;
                            option.selected = idx === index;
                            tableSelector.appendChild(option);
                        });

                        // 创建包含文本和选择器的容器
                        const container = document.createElement('div');
                        container.style.display = 'flex';
                        container.style.alignItems = 'center';
                        container.style.justifyContent = 'space-between';

                        const titleSpan = document.createElement('span');
                        titleSpan.textContent = '脚本名';

                        container.appendChild(titleSpan);
                        container.appendChild(tableSelector);
                        th.appendChild(container);
                    } else {
                        // 其他表头单元格正常显示
                        const headerDisplayNames = {
                            'name': '脚本名',
                            'Introduction': '简介',
                            'note': '备注',
                            'view': '查看',
                            'author': '作者',
                            'version': '版本',
                            'date': '日期'
                        };

                        th.textContent = headerDisplayNames[header] || header;
                    }

                    headerRow.appendChild(th);
                });

                thead.appendChild(headerRow);
                table.appendChild(thead);

                // 创建表格主体
                const tbody = document.createElement('tbody');

                // 添加数据行
                Object.entries(tableData).forEach(([rowKey, rowData]) => {
                    if (rowKey === 'row1') return;

                    const tr = document.createElement('tr');

                    headers.forEach(header => {
                        const td = document.createElement('td');

                        if (header === 'view' && rowData[header]) {
                            const button = document.createElement('button');
                            button.className = 'custom-button';
                            button.textContent = '查看';

                            const viewUrl = rowData[header];
                            if (viewUrl.includes('?')) {
                                const urlParts = viewUrl.split('?');
                                const urlParams = new URLSearchParams(urlParts[1]);
                                const title = urlParams.get('title');
                                const file = urlParams.get('file');

                                button.onclick = function () {
                                    openPage(`/code.html?title=${encodeURIComponent(title)}&file=${encodeURIComponent(file)}`);
                                };
                            } else {
                                button.onclick = function () {
                                    openPage(viewUrl);
                                };
                            }

                            td.appendChild(button);
                        } else {
                            td.textContent = rowData[header] || '';
                        }

                        tr.appendChild(td);
                    });

                    tbody.appendChild(tr);
                });

                table.appendChild(tbody);
                tableWrapper.appendChild(table);
                tablesContainer.appendChild(tableWrapper);
                tables.push(tableWrapper);
            });
        }

        // 剩下的代码保持不变...
        // 创建导航按钮（左右箭头）
        function createNavigationButtons() {
            navigationButtons.innerHTML = '';

            if (tables.length <= 1) return;

            // 左侧导航按钮
            const prevButton = document.createElement('button');
            prevButton.className = 'more-button left';
            prevButton.innerHTML = '&lt;';
            prevButton.title = '上一个表格';
            prevButton.style.left = '20px';
            prevButton.style.display = 'none';
            prevButton.onclick = () => showTable(currentTableIndex - 1);
            navigationButtons.appendChild(prevButton);

            // 右侧导航按钮
            const nextButton = document.createElement('button');
            nextButton.className = 'more-button';
            nextButton.innerHTML = '&gt;';
            nextButton.title = '下一个表格';
            nextButton.style.right = '20px';
            nextButton.style.display = 'block';
            nextButton.onclick = () => showTable(currentTableIndex + 1);
            navigationButtons.appendChild(nextButton);
        }

        // 显示指定索引的表格
        function showTable(index) {
            if (index < 0) index = 0;
            if (index >= tables.length) index = tables.length - 1;

            // 隐藏所有表格
            tables.forEach(table => {
                table.style.display = 'none';
            });

            // 显示当前表格
            tables[index].style.display = 'block';
            currentTableIndex = index;

            // 更新所有选择器的选中状态
            updateAllSelectors();

            // 更新导航按钮状态
            updateNavigationButtons();
        }

        // 更新所有表格内的选择器
        function updateAllSelectors() {
            const allSelectors = document.querySelectorAll('.table-selector');
            allSelectors.forEach((selector) => {
                selector.value = currentTableIndex;
            });
        }

        // 更新导航按钮显示状态
        function updateNavigationButtons() {
            const prevButtons = document.querySelectorAll('.more-button.left');
            const nextButtons = document.querySelectorAll('.more-button:not(.left)');

            prevButtons.forEach(button => {
                button.style.display = currentTableIndex > 0 ? 'block' : 'none';
            });

            nextButtons.forEach(button => {
                button.style.display = currentTableIndex < tables.length - 1 ? 'block' : 'none';
            });
        }
    });                                                    