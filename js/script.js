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
                document.getElementById('w-desc').innerText = "連線失敗";
            }
        }

        function renderWeatherToPage(desc, temp, rain) {
            const descEl = document.getElementById('w-desc');
            const tempEl = document.getElementById('w-temp');
            const rainEl = document.getElementById('w-rain');
            const iconEl = document.getElementById('w-icon');
            descEl.innerText = desc;
            tempEl.innerText = temp + "°C";
            rainEl.innerText = "降雨機率：" + (rain === "-" ? "0" : rain) + "%";
            if (desc.includes("雨")) {
                iconEl.className = "fas fa-cloud-showers-heavy";
                iconEl.style.color = "#8DA399";
            } else if (desc.includes("雲")) {
                iconEl.className = "fas fa-cloud-sun";
                iconEl.style.color = "#D8D3C5";
            } else {
                iconEl.className = "fas fa-sun";
                iconEl.style.color = "#C67C6D";
            }
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
        window.addEventListener('load', updatePrevButtonPosition);
        window.addEventListener('resize', updatePrevButtonPosition);

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
                setTimeout(updatePrevButtonPosition, 0);
            } else {
                navButtons.forEach(btn => {
                    btn.style.display = 'none';
                });
            }
            if (pageId === 'page-intro') {
                initIntroDetailsToggle();
            }
            if (pageId === 'page-weather') {
                updateSix腳Weather(); 
            }
            const target = document.getElementById(pageId);
            if (target) {
                target.style.display = (pageId === 'page-home') ? 'flex' : 'block';
            }
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
            modal.classList.remove('show');
            setTimeout(() => modal.style.display = 'none', 300);
        }

        function spinWheel() {
            const wheel = document.getElementById('wheel');
            const spinBtn = document.getElementById('spin-btn');
            
            // 禁用按鈕防止重複點擊
            spinBtn.disabled = true;
            spinBtn.innerText = "旋轉中...";

            // 隨機旋轉圈數 (5圈到10圈之間) + 隨機角度
            const randomSpins = 5 + Math.random() * 5; 
            const randomDegree = Math.floor(Math.random() * 360);
            
            // 累加角度，確保每次都從當前位置繼續轉
            currentDeg += (randomSpins * 360) + randomDegree;
            
            wheel.style.transform = `rotate(${currentDeg}deg)`;

            // 8秒後顯示結果 (對應 CSS transition 時間)
            setTimeout(() => {
                calculateWinner(currentDeg);
                spinBtn.disabled = false;
                spinBtn.innerText = "再來一次";
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

        if(confirm(`蒜頭小醬幫你選中了：\n【${winner.name}】\n\n要現在前往查看嗎？`)) {
            closeRoulette();
            navigateToSpot(winner.name, winner.img);
        }
}


        let current = 0;
        function nextSlide() {
            current = (current + 1) % slides.length;
            updateSlide();
        }
        function prevSlide() {
            current = (current - 1 + slides.length) % slides.length;
            updateSlide();
        }
        function updateSlide() {
            const bgSlider = document.getElementById('bg-slider');
            const img = new Image();
            img.onload = () => {
                bgSlider.style.backgroundImage = `url('${slides[current].img}')`;
                if (slides[current].title === '興旺餅舖') {
                    bgSlider.style.backgroundPosition = '60% center';
                } else {
                    bgSlider.style.backgroundPosition = 'center';
                }
                if(document.getElementById('page-home').style.display !== 'none'){
                    document.getElementById('home-title').innerText = slides[current].title;
                    document.getElementById('home-desc').innerText = slides[current].desc;
                }
            };
            img.src = slides[current].img;
        }
        function goToCurrentSpot() {
            const currentSlide = slides[current];
            navigateToSpot(currentSlide.title, currentSlide.img);
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