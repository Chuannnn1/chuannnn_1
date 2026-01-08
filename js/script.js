    // --- 氣象 API ---
        async function updateSix腳Weather() {
            const url = "https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-D0047-093?Authorization=CWA-F3248D88-C0EF-4FCD-B78D-3BECE3DD9B51&locationId=F-D0047-031&LocationName=%E5%85%AD%E8%85%B3%E9%84%89&sort=time";
            try {
                const response = await fetch(url);
                const data = await response.json();
                const weatherElements = data.records.Locations[0].Location[0].WeatherElement;
                const weatherDesc = weatherElements.find(el => el.ElementName === "天氣現象").Time[0].ElementValue[0].Weather;
                const temp = weatherElements.find(el => el.ElementName === "平均溫度").Time[0].ElementValue[0].Temperature;
                const pop = weatherElements.find(el => el.ElementName === "12小時降雨機率").Time[0].ElementValue[0].ProbabilityOfPrecipitation;
                renderWeatherToPage(weatherDesc, temp, pop);
            } catch (error) {
                console.error("氣象資料抓取失敗:", error);
                const descEl = document.getElementById('w-desc');
                if (descEl) { descEl.innerText = "連線失敗"; }
            }
        }

        function getWeatherVisual(desc = '') {
            if (desc.includes("雨")) {
                return { iconClass: "fas fa-cloud-showers-heavy", color: "#8DA399" };
            }
            if (desc.includes("雲")) {
                return { iconClass: "fas fa-cloud-sun", color: "#D8D3C5" };
            }
            return { iconClass: "fas fa-sun", color: "#C67C6D" };
        }

        function updateMascotWeather(desc, temp, rain) {
            const mascot = document.getElementById('floating-mascot');
            if (!mascot) return;

            const descEl = document.getElementById('mascot-w-desc');
            const tempEl = document.getElementById('mascot-w-temp');
            const rainEl = document.getElementById('mascot-w-rain');
            const iconEl = document.getElementById('mascot-w-icon');
            const rainVal = rain === "-" ? "0" : rain;

            if (descEl) descEl.innerText = desc;
            if (tempEl) tempEl.innerText = temp + "°C";
            if (rainEl) rainEl.innerText = "降雨 " + rainVal + "%";
            if (iconEl) {
                const visual = getWeatherVisual(desc);
                iconEl.className = visual.iconClass;
                iconEl.style.color = visual.color;
            }
        }

        function renderWeatherToPage(desc, temp, rain) {
            const descEl = document.getElementById('w-desc');
            const tempEl = document.getElementById('w-temp');
            const rainEl = document.getElementById('w-rain');
            const iconEl = document.getElementById('w-icon');
            const rainVal = rain === "-" ? "0" : rain;

            if (descEl) descEl.innerText = desc;
            if (tempEl) tempEl.innerText = temp + "°C";
            if (rainEl) rainEl.innerText = "降雨機率：" + rainVal + "%";
            if (iconEl) {
                const visual = getWeatherVisual(desc);
                iconEl.className = visual.iconClass;
                iconEl.style.color = visual.color;
            }

            updateMascotWeather(desc, temp, rainVal);
        }

        // --- 核心邏輯 ---
        let introDismissed = false; 
        function dismissIntro() {
            if (!introDismissed) {
                const introLayer = document.getElementById('intro-layer');
                introLayer.classList.add('hidden'); 
                introDismissed = true;
                window.removeEventListener('wheel', dismissIntro);
                window.removeEventListener('touchmove', dismissIntro);
                introLayer.removeEventListener('click', dismissIntro);
            }
        }
        window.addEventListener('wheel', dismissIntro, { once: true }); 
        window.addEventListener('touchmove', dismissIntro, { once: true });
        document.getElementById('intro-layer').addEventListener('click', dismissIntro);

        function updatePrevButtonPosition() {
            const prevBtn = document.querySelector('.prev-btn');
            if (prevBtn && prevBtn.style.display !== 'none') {
                const root = document.documentElement;
                const sidebarWidthStr = getComputedStyle(root).getPropertyValue('--sidebar-width').trim();
                const sidebarWidth = window.innerWidth > 1024 ? parseInt(sidebarWidthStr) : 0;
                prevBtn.style.left = (sidebarWidth + 20) + 'px';
            }
        }
        window.addEventListener('load', () => {
            updatePrevButtonPosition();
            startAutoSlide();
        });
        window.addEventListener('resize', updatePrevButtonPosition);

        document.addEventListener('DOMContentLoaded', () => {
            initFloatingMascot();
            updateMascotVisibility('page-home');
            const mascot = document.getElementById('floating-mascot');
            if (mascot) {
                requestAnimationFrame(() => keepMascotInView(mascot));
            }
            updateSix腳Weather();
        });

        // 點擊瀏覽器區域（除了導航列外）時關閉側邊欄
        document.addEventListener('click', (e) => {
            const sidebar = document.getElementById('sidebar');
            const menuBtn = document.querySelector('.menu-btn');
            
            // 檢查點擊是否在側邊欄或漢堡按鈕外
            if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
                closeSidebar();
            }
        });

        function toggleSidebar() {
            const sidebar = document.getElementById("sidebar");
            const body = document.body;
            sidebar.classList.toggle("active");
            if (window.innerWidth <= 1024) {
                body.classList.toggle("blur-active");
            }
        }

        function closeSidebar() {
            document.getElementById("sidebar").classList.remove("active");
            document.body.classList.remove("blur-active");
        }

        function toggleSubmenu() {
            const submenu = document.getElementById("submenu");
            submenu.style.display = (submenu.style.display === "block") ? "none" : "block";
        }

        const mascotVisiblePages = ['page-home', 'page-spot-detail', 'page-intro', 'page-recommend'];

        function updateMascotVisibility(pageId) {
            const mascot = document.getElementById('floating-mascot');
            if (!mascot) return;
            if (mascotVisiblePages.includes(pageId)) {
                mascot.classList.add('show');
            } else {
                mascot.classList.remove('show');
            }
        }

        function navigateTo(pageId) {
            const pages = document.querySelectorAll('.page-section');
            pages.forEach(p => p.style.display = 'none');
            const navButtons = document.querySelectorAll('.slider-nav');
            if (pageId === 'page-home') {
                // 重置為配天宮（首頁預設背景）
                current = 0;
                document.getElementById('bg-slider').style.backgroundImage = `url('${slides[0].img}')`;
                document.getElementById('bg-slider').style.backgroundPosition = 'center';
                document.getElementById('home-title').innerText = slides[0].title;
                document.getElementById('home-desc').innerText = slides[0].desc;
                navButtons.forEach(btn => {
                    btn.style.display = 'flex';
                    btn.style.opacity = '1';
                    btn.style.pointerEvents = 'auto';
                });
                stopAutoSlide();
                startAutoSlide();
                setTimeout(updatePrevButtonPosition, 0);
            } else {
                navButtons.forEach(btn => {
                    btn.style.display = 'none';
                });
                stopAutoSlide();
            }
            if (pageId === 'page-intro') {
                initIntroDetailsToggle();
            }
            if (pageId === 'page-weather') {
                updateSix腳Weather(); 
            }
            if (pageId === 'page-about') {
                // 改變背景為 we.jpg
                document.getElementById('bg-slider').style.backgroundImage = "url('./assets/we.jpg')";
                document.getElementById('bg-slider').style.backgroundPosition = 'center';
                // 初始化雙擊事件監聽器
                initAboutImageDoubleClick();
            }
            const target = document.getElementById(pageId);
            if (target) {
                target.style.display = (pageId === 'page-home') ? 'flex' : 'block';
            }
            updateMascotVisibility(pageId);
            closeSidebar(); 
            window.scrollTo(0, 0);
        }

        function navigateToSpot(name, imgUrl) {
            const spotData = spotsData[name];
            if (spotData) {
                document.getElementById('spot-title').innerText = name;
                document.getElementById('spot-main-img').src = spotData.mainImg;
                document.getElementById('spot-desc').innerText = spotData.description;
                generateSpotDetailsToggle(spotData.details);
                const gallery = document.getElementById('spot-gallery');
                gallery.innerHTML = '';
                if (spotData.gallery && spotData.gallery.length > 0) {
                    spotData.gallery.forEach(img => {
                        const thumbImg = document.createElement('img');
                        thumbImg.src = img;
                        thumbImg.alt = name;
                        thumbImg.style.width = '80px';
                        thumbImg.style.height = '80px';
                        thumbImg.style.objectFit = 'cover';
                        thumbImg.style.borderRadius = '4px';
                        thumbImg.style.cursor = 'pointer';
                        thumbImg.onclick = () => {
                            document.getElementById('spot-main-img').src = img;
                        };
                        gallery.appendChild(thumbImg);
                    });
                }
                document.getElementById('bg-slider').style.backgroundImage = `url('${spotData.mainImg}')`;
            } else {
                document.getElementById('spot-title').innerText = name;
                document.getElementById('spot-desc').innerText = `這是 ${name} 的詳細介紹。`;
                document.getElementById('spot-details').innerHTML = '<p>敬請期待更多資訊...</p>';
            }
            // 設置返回按鈕
            const backButton = document.querySelector('#page-spot-detail button');
            if (name === '蒜頭糖廠' || name === '用九柑仔店' || name === '興旺餅舖' || name === '木精靈豆花' || name === '配天宮') {
                backButton.setAttribute('onclick', "navigateTo('page-home')");
                backButton.innerText = '回首頁';
            } else {
                backButton.setAttribute('onclick', "navigateTo('page-recommend')");
                backButton.innerText = '返回';
            }
            navigateTo('page-spot-detail');
        }

        function generateSpotDetailsToggle(htmlContent) {
            const detailsContainer = document.getElementById('spot-details');
            detailsContainer.innerHTML = '';
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;
            const sections = [];
            let currentSection = null;
            tempDiv.childNodes.forEach(node => {
                if (node.tagName === 'H3') {
                    if (currentSection) {
                        sections.push(currentSection);
                    }
                    currentSection = { title: node.textContent, content: [] };
                } else if (node.tagName === 'P' && currentSection) {
                    currentSection.content.push(node.outerHTML);
                }
            });
            if (currentSection) { sections.push(currentSection); }
            sections.forEach((section, index) => {
                const toggleItem = document.createElement('div');
                toggleItem.className = 'info-toggle';
                const header = document.createElement('div');
                header.className = 'info-toggle-header';
                header.innerHTML = `<span>${section.title}</span><i class="fas fa-chevron-down"></i>`;
                const content = document.createElement('div');
                content.className = 'info-toggle-content';
                content.innerHTML = section.content.join('');
                if (index === 0) { header.classList.add('active'); content.classList.add('active'); }
                header.addEventListener('click', () => {
                    const isActive = header.classList.toggle('active');
                    content.classList.toggle('active');
                });
                toggleItem.appendChild(header);
                toggleItem.appendChild(content);
                detailsContainer.appendChild(toggleItem);
            });
        }

        function initIntroDetailsToggle() {
            const detailsContainer = document.getElementById('intro-details');
            const hiddenDiv = detailsContainer.parentElement.querySelector('div[style*="display:none"]');
            
            if (!hiddenDiv) return;
            
            detailsContainer.innerHTML = '';
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = hiddenDiv.innerHTML;
            
            const sections = [];
            let currentSection = null;
            
            tempDiv.childNodes.forEach(node => {
                if (node.tagName === 'H3') {
                    if (currentSection) {
                        sections.push(currentSection);
                    }
                    currentSection = { title: node.textContent, content: [] };
                } else if (node.tagName === 'P' && currentSection) {
                    currentSection.content.push(node.outerHTML);
                }
            });
            
            if (currentSection) { sections.push(currentSection); }
            
            sections.forEach((section, index) => {
                const toggleItem = document.createElement('div');
                toggleItem.className = 'info-toggle';
                
                const header = document.createElement('div');
                header.className = 'info-toggle-header';
                header.innerHTML = `<span>${section.title}</span><i class="fas fa-chevron-down"></i>`;
                
                const content = document.createElement('div');
                content.className = 'info-toggle-content';
                content.innerHTML = section.content.join('');
                
                if (index === 0) { 
                    header.classList.add('active'); 
                    content.classList.add('active'); 
                }
                
                header.addEventListener('click', () => {
                    const isActive = header.classList.toggle('active');
                    content.classList.toggle('active');
                });
                
                toggleItem.appendChild(header);
                toggleItem.appendChild(content);
                detailsContainer.appendChild(toggleItem);
            });
        }

        // 【關於我們頁面】初始化圖片雙擊打開 YouTube 播放器
        function initAboutImageDoubleClick() {
            const aboutImg = document.getElementById('about-img');
            if (!aboutImg) return;

            aboutImg.addEventListener('dblclick', function() {
                openYouTubePlayer();
            });
        }

        // 打開 YouTube 網頁內嵌播放器
        function openYouTubePlayer() {
            const youtubeUrl = 'https://youtu.be/Z1uQ9CIK5BM?si=X81eokGcH0l1PXTR';
            // 轉換為嵌入式網址
            const videoId = 'Z1uQ9CIK5BM';
            const embedUrl = `https://www.youtube.com/embed/${videoId}`;

            // 建立模態視窗
            const modal = document.createElement('div');
            modal.id = 'youtube-modal';
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
            `;

            // 建立播放器容器
            const playerContainer = document.createElement('div');
            playerContainer.style.cssText = `
                width: 90%;
                max-width: 800px;
                background-color: white;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                position: relative;
            `;

            // 建立關閉按鈕
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '<i class="fas fa-times"></i>';
            closeBtn.style.cssText = `
                position: absolute;
                top: 15px;
                right: 15px;
                background-color: #ff6b6b;
                color: white;
                border: none;
                width: 35px;
                height: 35px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 18px;
                z-index: 10001;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            closeBtn.addEventListener('mouseover', () => {
                closeBtn.style.backgroundColor = '#ff5252';
            });
            closeBtn.addEventListener('mouseout', () => {
                closeBtn.style.backgroundColor = '#ff6b6b';
            });
            closeBtn.addEventListener('click', () => {
                modal.remove();
            });

            // 建立 iframe
            const iframe = document.createElement('iframe');
            iframe.src = embedUrl;
            iframe.style.cssText = `
                width: 100%;
                height: 450px;
                border: none;
            `;
            iframe.setAttribute('allowfullscreen', '');
            iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');

            // 組合 DOM
            playerContainer.appendChild(closeBtn);
            playerContainer.appendChild(iframe);
            modal.appendChild(playerContainer);
            document.body.appendChild(modal);

            // 點擊背景區域關閉
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });

            // 按下 ESC 鍵關閉
            const closeOnEsc = (e) => {
                if (e.key === 'Escape') {
                    modal.remove();
                    document.removeEventListener('keydown', closeOnEsc);
                }
            };
            document.addEventListener('keydown', closeOnEsc);
        }


        // =========================================
        // [新增] 輪盤小遊戲邏輯
        // =========================================
        
        // 定義輪盤選項 (順序需對應 CSS conic-gradient)
        // 0-72度, 72-144度, 144-216度, 216-288度, 288-360度
        const rouletteItems = [
            { name: '興旺餅舖', color: '#C67C6D', img: './assets/xwbp00.jpg' },
            { name: '木精靈豆花', color: '#E6E2D6', img: './assets/tofup00.jpg' },
            { name: '配天宮', color: '#8DA399', img: './assets/ptg00.jpg' },
            { name: '蒜頭糖廠', color: '#D8D3C5', img: './assets/sugar00.jpg' },
            { name: '用九柑仔店', color: '#A89B9D', img: './assets/yon9.png' }
        ];

        let currentDeg = 0; // 記錄當前角度

        // 初始化輪盤文字標籤
        function initRouletteLabels() {
            const wheel = document.getElementById('wheel');
            // 清除除了中間點以外的內容
            const center = wheel.querySelector('.wheel-center');
            wheel.innerHTML = '';
            wheel.appendChild(center);

            const segmentDeg = 360 / rouletteItems.length; // 每個扇形 72 度

            rouletteItems.forEach((item, index) => {
                const label = document.createElement('div');
                label.className = 'wheel-label';
                label.innerText = item.name;
                
                // 計算旋轉角度：每個扇形的中間線
                // index 0 (0-72) -> 中間是 36
                const rotateDeg = (index * segmentDeg) + (segmentDeg / 2);
                
                // 為了讓文字閱讀方向正確，我們將文字放在扇形中間
                label.style.transform = `rotate(${rotateDeg}deg) translateX(10px)`;
                
                wheel.appendChild(label);
            });
        }

        let isWheelSpinning = false; // 追蹤輪盤是否正在旋轉
        let spinTimeoutId = null; // 保存 setTimeout ID，方便取消

        function openRoulette() {
            closeSidebar(); // 關閉側邊欄
            initRouletteLabels(); // 確保標籤位置正確
            const modal = document.getElementById('roulette-modal');
            modal.style.display = 'flex';
            // 延遲添加 opacity 達到淡入效果
            setTimeout(() => modal.classList.add('show'), 10);
        }

        function closeRoulette() {
            const modal = document.getElementById('roulette-modal');
            const wheel = document.getElementById('wheel');
            
            // 如果輪盤正在旋轉，立即停止動畫
            if (isWheelSpinning) {
                // 清除未執行的 setTimeout
                if (spinTimeoutId !== null) {
                    clearTimeout(spinTimeoutId);
                    spinTimeoutId = null;
                }
                
                wheel.style.transition = 'none'; // 移除過渡效果
                wheel.style.transform = `rotate(${currentDeg}deg)`; // 停止在當前位置
                isWheelSpinning = false;
                
                // 重置按鈕狀態
                const spinBtn = document.getElementById('spin-btn');
                spinBtn.disabled = false;
                spinBtn.innerText = '開始旋轉';
            }
            
            modal.classList.remove('show');
            setTimeout(() => modal.style.display = 'none', 300);
        }

        function spinWheel() {
            const wheel = document.getElementById('wheel');
            const spinBtn = document.getElementById('spin-btn');
            
            // 清除之前的 timeout（以防用戶快速連續點擊）
            if (spinTimeoutId !== null) {
                clearTimeout(spinTimeoutId);
                spinTimeoutId = null;
            }
            
            // 禁用按鈕防止重複點擊
            spinBtn.disabled = true;
            spinBtn.innerText = "旋轉中...";
            isWheelSpinning = true; // 標記輪盤正在旋轉

            // 隨機旋轉圈數 (5圈到10圈之間) + 隨機角度
            const randomSpins = 5 + Math.random() * 5; 
            const randomDegree = Math.floor(Math.random() * 360);
            
            // 累加角度，確保每次都從當前位置繼續轉
            currentDeg += (randomSpins * 360) + randomDegree;
            
            // 確保應用過渡效果
            wheel.style.transition = 'transform 8s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
            wheel.style.transform = `rotate(${currentDeg}deg)`;

            // 8秒後顯示結果 (對應 CSS transition 時間)
            spinTimeoutId = setTimeout(() => {
                spinTimeoutId = null; // 清空 timeout ID
                // 再次檢查是否還在旋轉（防止被中止的旋轉觸發結果）
                if (isWheelSpinning) {
                    isWheelSpinning = false; // 旋轉結束
                    calculateWinner(currentDeg);
                    spinBtn.disabled = false;
                    spinBtn.innerText = "再來一次";
                }
            }, 8000);
        }

        function calculateWinner(deg) {
        // 1. 計算最後停下來的角度 (取餘數 0-360)
        const actualDeg = deg % 360;
        
        // 2. 轉換為指針下的角度
        // 輪盤是順時針轉，所以指針相對是逆時針移動
        // 加上 360 是為了避免負數運算問題
        const pointDeg = (360 - actualDeg) % 360;
        
        // 3. 計算每個扇形的角度 (72度)
        const segmentDeg = 360 / rouletteItems.length; 
        
        // 4. 計算原始 Index
        let index = Math.floor(pointDeg / segmentDeg);
        

        index = (index - 1) % rouletteItems.length;

        if(index < 0) {
            index += rouletteItems.length;
        }

        const winner = rouletteItems[index];

        const userWantToNavigate = confirm(`蒜頭小醬幫你選中了：\n【${winner.name}】\n\n要現在前往查看嗎？`);
        
        if(userWantToNavigate) {
            closeRoulette();
            navigateToSpot(winner.name, winner.img);
        } else {
            // 用戶選擇不前往，重置輪盤按鈕
            const spinBtn = document.getElementById('spin-btn');
            spinBtn.disabled = false;
            spinBtn.innerText = '再來一次';
        }
}


        let current = 0;
        let autoSlideInterval;
        
        function startAutoSlide() {
            autoSlideInterval = setInterval(() => {
                nextSlide();
            }, 4000);
        }
        
        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }
        
        function nextSlide() {
            current = (current + 1) % slides.length;
            stopAutoSlide();
            updateSlide();
            startAutoSlide();
        }
        function prevSlide() {
            current = (current - 1 + slides.length) % slides.length;
            stopAutoSlide();
            updateSlide();
            startAutoSlide();
        }
        function updateSlide() {
            const bgSlider = document.getElementById('bg-slider');
            const img = new Image();
            img.onload = () => {
                // 模糊動畫
                bgSlider.classList.add('fade-out');
                
                setTimeout(() => {
                    bgSlider.style.backgroundImage = `url('${slides[current].img}')`;
                    if (slides[current].title === '興旺餅舖') {
                        bgSlider.style.backgroundPosition = '60% center';
                    } else {
                        bgSlider.style.backgroundPosition = 'center';
                    }
                    // 清除模糊
                    bgSlider.classList.remove('fade-out');
                    
                    if(document.getElementById('page-home').style.display !== 'none'){
                        document.getElementById('home-title').innerText = slides[current].title;
                        document.getElementById('home-desc').innerText = slides[current].desc;
                    }
                }, 300);
            };
            img.src = slides[current].img;
        }
        function goToCurrentSpot() {
            const currentSlide = slides[current];
            navigateToSpot(currentSlide.title, currentSlide.img);
        }

        function getMascotMinLeft() {
            const root = document.documentElement;
            const sidebarWidthStr = getComputedStyle(root).getPropertyValue('--sidebar-width').trim();
            const sidebarWidth = parseInt(sidebarWidthStr, 10) || 0;
            return window.innerWidth > 1024 ? sidebarWidth + 12 : 8;
        }

        function keepMascotInView(mascot) {
            const rect = mascot.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) { return; }
            let left = rect.left;
            let top = rect.top;
            const minLeft = getMascotMinLeft();
            const maxLeft = window.innerWidth - mascot.offsetWidth - 8;
            const maxTop = window.innerHeight - mascot.offsetHeight - 8;
            left = Math.min(Math.max(minLeft, left), maxLeft);
            top = Math.min(Math.max(8, top), maxTop);
            mascot.style.left = `${left}px`;
            mascot.style.top = `${top}px`;
            mascot.style.right = 'auto';
            mascot.style.bottom = 'auto';
        }

        function initFloatingMascot() {
            const mascot = document.getElementById('floating-mascot');
            if (!mascot) return;

            let isDragging = false;
            let offsetX = 0;
            let offsetY = 0;

            const getPoint = (e) => {
                if (e.touches && e.touches.length) {
                    return { x: e.touches[0].clientX, y: e.touches[0].clientY };
                }
                return { x: e.clientX, y: e.clientY };
            };

            const startDrag = (e) => {
                const point = getPoint(e);
                isDragging = true;
                mascot.classList.add('dragging');
                const rect = mascot.getBoundingClientRect();
                offsetX = point.x - rect.left;
                offsetY = point.y - rect.top;
            };

            const onDrag = (e) => {
                if (!isDragging) return;
                if (e.cancelable) { e.preventDefault(); }
                const point = getPoint(e);
                let left = point.x - offsetX;
                let top = point.y - offsetY;
                const minLeft = getMascotMinLeft();
                const maxLeft = window.innerWidth - mascot.offsetWidth - 8;
                const maxTop = window.innerHeight - mascot.offsetHeight - 8;
                left = Math.min(Math.max(minLeft, left), maxLeft);
                top = Math.min(Math.max(8, top), maxTop);
                mascot.style.left = `${left}px`;
                mascot.style.top = `${top}px`;
                mascot.style.right = 'auto';
                mascot.style.bottom = 'auto';
            };

            const endDrag = () => {
                isDragging = false;
                mascot.classList.remove('dragging');
            };

            mascot.addEventListener('mousedown', startDrag);
            mascot.addEventListener('touchstart', startDrag, { passive: true });
            window.addEventListener('mousemove', onDrag, { passive: false });
            window.addEventListener('touchmove', onDrag, { passive: false });
            window.addEventListener('mouseup', endDrag);
            window.addEventListener('touchend', endDrag);
            window.addEventListener('resize', () => keepMascotInView(mascot));

            keepMascotInView(mascot);
        }

        // --- 桌寵 ---
        let petLoaded = false; 
        let petElements = []; 
        function spawnPet() {
            const petBtn = document.getElementById('pet-btn');
            if (petLoaded) {
                petElements.forEach(el => {
                    if (el && el.parentNode) {
                        el.style.transition = 'opacity 0.5s';
                        el.style.opacity = '0';
                        setTimeout(() => { try { el.remove(); } catch(e) {} }, 500);
                    }
                });
                setTimeout(() => {
                    const allImgs = document.querySelectorAll('img');
                    allImgs.forEach(img => {
                        if (img.style.position === 'fixed' && img.style.cursor === 'grab' && img.style.zIndex === '9998') {
                            img.style.opacity = '0';
                            img.style.transition = 'opacity 0.3s';
                            setTimeout(() => img.remove(), 300);
                        }
                    });
                    const allDivs = document.querySelectorAll('div[style*="pointerEvents"]');
                    allDivs.forEach(div => {
                        if (div.style.zIndex === '9998' && div.style.position === 'fixed') {
                            div.style.opacity = '0';
                            div.style.transition = 'opacity 0.3s';
                            setTimeout(() => div.remove(), 300);
                        }
                    });
                }, 100);
                petElements = [];
                petLoaded = false;
                if (petBtn) { petBtn.innerHTML = '<i class="fas fa-cat"></i> 召喚桌寵'; }
                closeSidebar();
                return;
            }
            const script = document.createElement('script');
            script.src = 'pet.js?t=' + new Date().getTime(); 
            script.onload = function() {
                petLoaded = true;
                setTimeout(() => {
                    const allImgs = document.querySelectorAll('img');
                    allImgs.forEach(img => {
                        if (img.style.cursor === 'grab' && img.style.position === 'fixed') {
                            petElements.push(img);
                        }
                    });
                    const heartsContainer = document.querySelector('div[style*="pointerEvents: none"]');
                    if (heartsContainer && heartsContainer.style.position === 'fixed') {
                        petElements.push(heartsContainer);
                    }
                }, 300);
                if (petBtn) { petBtn.innerHTML = '<i class="fas fa-times-circle"></i> 取消召喚'; }
            };
            script.onerror = function() { alert("召喚失敗，請檢查 pet.js 路徑是否正確。"); };
            document.body.appendChild(script);
            if (typeof closeSidebar === "function") { closeSidebar(); }
        }
        
        // ==========================================


        // 留言板功能 (與後端 API 溝通)

        // 1. 設定後端 API 的基地台網址
        
        const API_URL = 'https://lujiao-messaging-board.onrender.com/api/messages';

        // 2. 當網頁載入完成後，立刻執行抓取留言的動作
        document.addEventListener('DOMContentLoaded', () => {
            fetchMessages();
        });

        // ==========================================
        // 模組一：抓取並顯示留言 (GET)
        // ==========================================
        async function fetchMessages() {
            try {
                const response = await fetch(API_URL);
                const messages = await response.json();

                const messageList = document.getElementById('message-list');
                messageList.innerHTML = ''; // 先清空舊內容

                if (messages.length === 0) {
                    messageList.innerHTML = '<p style="text-align: center; color: #999; padding: 30px;">還沒有留言，快來分享你的故事吧！</p>';
                    return;
                }

                messages.forEach(msg => {
                    // 建立留言卡片的 HTML 結構（對話氣泡風格）
                    const messageTime = new Date(msg.created_at).toLocaleString('zh-TW');
                    const imageHtml = msg.image_url ? `<img src="${msg.image_url}" alt="留言圖片" class="message-image">` : '';
                    const likeCount = msg.likes || 0;
                    
                    // 檢查 localStorage 中是否已按讚過此留言
                    const likeKey = `liked_message_${msg.id}`;
                    const isLiked = localStorage.getItem(likeKey) === 'true';
                    const likeIconSrc = isLiked ? './assets/goood_liked.png' : './assets/Goood_like_yet.png';
                    
                    const card = `
                        <div class="message-card">
                            <img src="./assets/MascotWithBG.jpeg" alt="蒜頭小醬" class="mascot-avatar">
                            <div class="message-bubble-wrapper">
                                <div class="message-bubble">
                                    <p class="message-content">${msg.content}</p>
                                    ${imageHtml}
                                    <div class="message-footer">
                                        <div class="message-time">${messageTime}</div>
                                        <div class="message-like-area">
                                            <button class="message-like-btn" data-msg-id="${msg.id}" title="按讚">
                                                <img src="${likeIconSrc}" alt="讚">
                                            </button>
                                            <span class="message-like-count">${likeCount}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    messageList.innerHTML += card;
                });

                // 綁定事件監聽器
                attachMessageEventListeners();
            } catch (error) {
                console.error('抓取留言失敗:', error);
                document.getElementById('message-list').innerHTML = '<p style="text-align: center; color: #999; padding: 30px;">留言加載失敗，請稍後重試</p>';
            }
        }

        // 綁定留言卡片的事件監聽器
        function attachMessageEventListeners() {
            // 圖片上傳按鈕事件
            document.querySelectorAll('.message-photo-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const input = this.nextElementSibling;
                    input.click();
                });
            });

            // 圖片選擇事件
            document.querySelectorAll('.message-photo-input').forEach(input => {
                input.addEventListener('change', async function() {
                    const file = this.files[0];
                    if (!file) return;

                    const formData = new FormData();
                    const msgCard = this.closest('.message-card');
                    const msgId = msgCard.querySelector('.message-photo-btn').dataset.msgId;
                    
                    formData.append('image', file);
                    formData.append('message_id', msgId);

                    try {
                        const response = await fetch(`${API_URL}/${msgId}/image`, {
                            method: 'POST',
                            body: formData
                        });

                        if (response.ok) {
                            const updatedMsg = await response.json();
                            // 更新圖片顯示
                            const existingImg = msgCard.querySelector('.message-image');
                            if (existingImg) {
                                existingImg.src = updatedMsg.image_url;
                            } else {
                                const newImg = document.createElement('img');
                                newImg.src = updatedMsg.image_url;
                                newImg.alt = '留言圖片';
                                newImg.className = 'message-image';
                                msgCard.querySelector('.message-bubble').appendChild(newImg);
                            }
                            alert('圖片上傳成功！');
                        }
                    } catch (error) {
                        console.error('圖片上傳失敗:', error);
                        alert('圖片上傳失敗，請稍後重試');
                    }

                    // 重置輸入框
                    this.value = '';
                });
            });

            // 點讚按鈕事件
            document.querySelectorAll('.message-like-btn').forEach(btn => {
                btn.addEventListener('click', async function() {
                    // 防止重複點擊：如果按鈕已經被禁用，直接返回
                    if (this.disabled) {
                        console.warn('按讚請求已在進行中，請稍候...');
                        return;
                    }

                    const msgId = this.dataset.msgId;
                    const msgCard = this.closest('.message-card');
                    const likeCountEl = msgCard.querySelector('.message-like-count');
                    const likeImg = this.querySelector('img');
                    const likeBtn = this; // 保存按鈕引用

                    // 檢查本地 localStorage 中是否已按讚過此留言
                    const likeKey = `liked_message_${msgId}`;
                    const isAlreadyLiked = localStorage.getItem(likeKey) === 'true';
                    
                    // 決定執行的動作：已按讚就執行 'remove'，未按讚就執行 'add'
                    const action = isAlreadyLiked ? 'remove' : 'add';

                    // 【凍結按鈕】禁用按鈕，防止重複點擊
                    likeBtn.disabled = true;
                    likeBtn.style.opacity = '0.5';
                    likeBtn.style.cursor = 'not-allowed';

                    try {
                        const response = await fetch(`${API_URL}/${msgId}/like`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ action })
                        });

                        const result = await response.json();
                        console.log(`點讚操作: ${action}, 結果:`, result);
                        
                        if (response.ok && result.success) {
                            // 更新點讚數
                            likeCountEl.textContent = result.newLikes || 0;
                            
                            // 切換按讚狀態
                            if (action === 'add') {
                                // 第一次按讚
                                localStorage.setItem(likeKey, 'true');
                                if (likeImg) {
                                    likeImg.src = './assets/goood_liked.png';
                                    console.log('圖片已更新為: goood_liked.png');
                                } else {
                                    console.warn('找不到按讚圖片元素');
                                }
                            } else {
                                // 取消按讚
                                localStorage.removeItem(likeKey);
                                if (likeImg) {
                                    likeImg.src = './assets/Goood_like_yet.png';
                                    console.log('圖片已更新為: Goood_like_yet.png');
                                } else {
                                    console.warn('找不到按讚圖片元素');
                                }
                            }
                        } else {
                            throw new Error(result.error || '更新失敗');
                        }
                    } catch (error) {
                        console.error('點讚失敗:', error);
                        alert('點讚失敗，請稍後重試\n錯誤: ' + error.message);
                    } finally {
                        // 【解凍按鈕】請求完成後（無論成功或失敗），恢復按鈕狀態
                        likeBtn.disabled = false;
                        likeBtn.style.opacity = '1';
                        likeBtn.style.cursor = 'pointer';
                    }
                });
            });
        }

        // ==========================================
        // 模組二：傳送新留言 (POST)
        // ==========================================
        // 非同步函式，可以避免主執行緒被post阻塞
        async function sendMessage() {
            const contentInput = document.getElementById('message-content');
            const imageInput = document.getElementById('image-upload');
            const content = contentInput.value;

            if (!content) {
                alert('請輸入留言內容！');
                return;
            }

            let imageUrl = null;

            // 如果有選擇圖片，先上傳到 Cloudinary
            if (imageInput.files.length > 0) {
                imageUrl = await uploadToCloudinary(imageInput.files[0]);
                if (!imageUrl) {
                    alert('圖片上傳失敗，請稍後重試');
                    return;
                }
            }

            const payload = {
                content: content,
                image_url: imageUrl || null
            };

            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    contentInput.value = ''; // 清空輸入框
                    imageInput.value = ''; // 清空圖片選擇
                    fetchMessages(); // 重新整理列表，看到最新留言
                    alert('留言成功！');
                }
            } catch (error) {
                console.error('送出留言失敗:', error);
                alert('留言發送失敗，請稍後重試');
            }
        }

        // Cloudinary 設定
        const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dmgkbovcu/image/upload';
        const UPLOAD_PRESET = 'lujiao_preset';

        // 【功能：上傳圖片到 Cloudinary】
        async function uploadToCloudinary(file) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', UPLOAD_PRESET);

            try {
                const response = await fetch(CLOUDINARY_URL, {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();
                return data.secure_url; // 這就是 Cloudinary 給我們的圖片永久網址
            } catch (error) {
                console.error('圖片上傳失敗:', error);
                return null;
            }
        }

        // 綁定表單圖片上傳按鈕
        document.addEventListener('DOMContentLoaded', () => {
            const photoBtn = document.querySelector('.comment-photo-btn');
            const photoInput = document.getElementById('image-upload');

            if (photoBtn && photoInput) {
                photoBtn.addEventListener('click', () => {
                    photoInput.click();
                });
            }
        });