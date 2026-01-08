// --- 輪播數據 ---
        const slides = [
            { img: './assets/ptg00.jpg', title: '配天宮', desc: '糖廠媽祖的糖業守護' },
            { img: './assets/sugar00.jpg', title: '蒜頭糖廠', desc: '明治寶庫裡的五分車時光' },
            { img: './assets/yon9.png', title: '用九柑仔店', desc: '走進電視劇裡的溫暖時光' },
            { img: './assets/xwbp00.jpg', title: '興旺餅舖', desc: '傳承一甲子的手作溫度' },
            { img: './assets/tofup00.jpg', title: '木精靈豆花', desc: '長壽橋畔旁的甜蜜蜜' }
        ];

        // 景點詳細數據
        const spotsData = {
            '興旺餅舖': {
                mainImg: './assets/xwbp00.jpg',
                gallery: ['./assets/xwbp00.jpg', './assets/xwbp01.jpg', './assets/xwbp02.jpg'],
                description: '六腳在地老字號餅舖，傳承三代的傳統糕餅手藝。',
                details: `<h3>基本資訊</h3><p><strong>地址：</strong><a href="https://maps.app.goo.gl/VGWyfzM71yJpqjqu5" target="_blank" style="color: var(--color-primary); text-decoration: none;">嘉義縣六腳鄉南宮路481號</a></p><p><strong>營業時間：</strong>週一至週日 07:00～21:00</p><p><strong>特色商品：</strong>蒜頭餅、綠豆椪、鳳梨酥、麻糬</p><h3>家鄉的味道</h3><p>在六腳，有一種味道是老一輩出遠門時最思念的家鄉味，還有著傳承一甲子的手作溫度，就是在巷弄裡的「興旺餅舖」。</p><h3>剛出爐的餅香</h3><p>走進餅舖，剛出爐的餅香撲鼻而來。這裡最出名的蒜頭餅，外皮酥香、內餡軟糯，鹹甜交織的滋味讓人難忘。</p><h3>手工的溫度</h3><p>每一塊都是老師傅手工捏製，這不只是一份伴手禮，更是六腳人代代相傳的記憶。在這個機械生產盛行的年代，興旺餅舖依然堅持那份手感的溫度，讓每一口都能感受到那份最樸實的鄉村熱情。</p>`
            },
            '木精靈豆花': {
                mainImg: './assets/tofup00.jpg',
                gallery: ['./assets/tofup00.jpg', './assets/tofup01.jpg', './assets/tofup02.jpg', './assets/tofup03.jpg'],
                description: '隱身田野間的特色豆花店，使用在地食材製作的古早味豆花。',
                details: `<h3>基本資訊</h3><p><strong>地址：</strong><a href="https://maps.app.goo.gl/Pw6j7jdt2D8VYuwi8" target="_blank" style="color: var(--color-primary); text-decoration: none;">嘉義縣六腳鄉南宮路32號</a></p><p><strong>營業時間：</strong>週一、三、四、五 12:00～17:30，週末 09:30～18:00（週二公休）</p><p><strong>推薦品項：</strong>招牌豆花、紅豆豆花、粉圓豆花、冬瓜茶</p><h3>旅程的完美句點</h3><p>旅行的尾聲，最適合用一碗冰涼、綿密的甜點來做結尾。位於六家佃長壽橋旁的古早味，是在地人大推的隱藏版美食。</p><h3>真材實料的堅持</h3><p>這裡沒有浮誇的裝飾，靠的是真材實料。老闆堅持使用優質黃豆，遵循古法製作，豆花吃起來綿密細緻，帶著濃厚的豆香味。</p><h3>品嚐方式</h3><p>配上熬煮到軟爛的紅豆，又或是搭配上Q彈的粉圓，再淋上幾杓不死甜的豆漿，甜而不膩，溫潤入心。這份簡單的甜，正是六腳鄉生活美學的最佳寫照。</p>`
            },
            '配天宮': {
                mainImg: './assets/ptg00.jpg',
                gallery: ['./assets/ptg00.jpg', './assets/ptg01.jpg', './assets/ptg02.jpg', './assets/ptg03.jpg'],
                description: '糖廠媽祖的糖業守護',
                details: `<h3>基本資訊</h3><p><strong>地址：</strong><a href="https://maps.app.goo.gl/DnZMANRLxRvwPqau6" target="_blank" style="color: var(--color-primary); text-decoration: none;">嘉義縣六腳鄉工廠村1號</a></p><p><strong>開放時間：</strong>週一至週日 08:00～17:00</p><h3>糖廠內的信仰中心</h3><p>在蒜頭糖廠的園區內，有一座全台少見、與糖廠息息相關的信仰中心。這座廟與一般的宮廟不同，它與日治時期的糖業有著很深的關聯，見證了糖廠的興衰。</p><h3>寧靜的參拜空間</h3><p>進到廟裡就會發現，這裡的香火有著淡淡的甘蔗甜香。與市中心的嘈雜不同，這裡多了一份靜謐與莊嚴。這裡的媽祖保佑著這片土地的農作與居民。</p><h3>參拜意義</h3><p>來到這邊，不只是宗教的參拜，更是對台灣近代產業史的一場致敬。讓我們在配天宮的信仰中，用心感受從日治時期延續至今、能夠安撫人心的力量。</p>`
            },
            '蒜頭糖廠': {
                mainImg: './assets/sugar00.jpg',
                gallery: ['./assets/sugar00.jpg', './assets/sugar01.jpg', './assets/sugar02.jpg', './assets/sugar03.jpg', './assets/sugar04.jpg', './assets/sugar05.jpg', './assets/sugar06.jpg', './assets/sugar07.jpg'],
                description: '蒜頭糖廠是台灣僅存的製糖工廠，保留了日式建築與古老機械。',
                details: `<h3>基本資訊</h3><p><strong>地址：</strong><a href="https://maps.app.goo.gl/A1bUjNWxBiT4kBkG6" target="_blank" style="color: var(--color-primary); text-decoration: none;">嘉義縣六腳鄉工廠村1號</a></p><p><strong>開放時間：</strong>週一至週日 08:00～17:00</p><p><strong>特色：</strong>古早味冰棒、五分車、工廠參觀</p><h3>歷史背景</h3><p>這裡曾被譽為「明治寶庫」，是六腳鄉的靈魂起點。雖然現在已經不產糖，但那份歷史的焦糖味仍然飄散於空氣中。</p><h3>五分車體驗</h3><p>來到蒜頭糖廠，你絕對不能錯過這裡最具特色的五分車。隨著一聲長笛，老舊的列車搖搖晃晃地駛入翠綠的田野，沿途聽著專業導覽解說著糖業的歷史，彷彿時光倒流。</p><h3>推薦體驗</h3><p>下車後，一定要買一支招牌的紅豆冰棒在日式木造建築群的樹蔭下，好好享受六腳鄉最迷人的午後風景。參觀保留完整的製糖機械設備，感受台灣糖業的歷史風華。</p>`
            },
            '用九柑仔店': {
                mainImg: './assets/yon9.png',
                gallery: ['./assets/yon9.png', './assets/yon901.jpg', './assets/yon902.jpg', './assets/yon903.jpg', './assets/yon904.jpg'],
                description: '懷舊的柑仔店，販售傳統零食和生活用品，充滿復古韻味。',
                details: `<h3>基本資訊</h3><p><strong>地址：</strong><a href="https://maps.app.goo.gl/GbzAnq6KDg7ZK9G69" target="_blank" style="color: var(--color-primary); text-decoration: none;">嘉義縣六腳鄉166縣道91號</a></p><p><strong>營業時間：</strong>週一至週日 06:30～20:30</p><p><strong>特色商品：</strong>傳統零食、古早味糖果</p><p><strong>氛圍：</strong>懷舊復古、溫馨親切</p><h3>電視劇取景地</h3><p>如果你看過電視劇《用九柑仔店》，那你對這裡一定不陌生。這座擁有百年歷史的木造老建築，現在已成為具有情懷的打卡聖地。</p><h3>古早味的故事</h3><p>這裡保留了滿滿的古早味，從二樓的木製閣樓到擺滿零食的櫥櫃，都像是在對旅人訴說著過去的故事。這裡不賣名牌，賣的是鄰里間的關心與問候。</p><h3>心靈的照顧</h3><p>就像劇中說的：「這裡不只是賣東西，這裡是照顧大家的心靈。」踏入時光隧道，在柑仔店裡尋找兒時的回憶。琳瑯滿目的傳統零食，喚醒每個人心中的童年美好。</p>`
            },
            // --- 新增的推薦景點資料 ---
            '在地炭烤美味': {
                mainImg: './assets/T1.jpg',
                description: '炭火慢烤後外皮微焦、內餡多汁，咬下瞬間肉香四溢，令人回味無窮。',
                details: `<h3>30年老店大腸加香腸</h3><p><strong>地址：</strong><a href="https://maps.app.goo.gl/WCune3NbVfT5vZet5" target="_blank" style="color: var(--color-primary); text-decoration: none;">嘉義縣六腳鄉188之7號</a></p><p><strong>營業時間：</strong>週二至週日 13:30~17:30</p><h3>在地人的下午茶</h3><p>炭火慢烤後外皮微焦、內餡多汁，咬下瞬間肉香四溢，令人回味無窮。這裡沒有華麗的裝潢，卻能成為居民日常與遊客記憶中難忘的味道。</p><h3>美味秘訣</h3><p>搭配蒜片或米腸一起享用，更能感受到當地的美食魅力。</p>`
            },
            '朴子溪黃花風鈴木': {
                mainImg: './assets/T2.jpg',
                description: '每年春季，朴子溪畔換上金黃色的風景，形成一條明亮而溫柔的賞花步道。',
                details: `<h3>朴子溪黃花風鈴木</h3><p><strong>花期：</strong>2月下旬至4月上旬（春季限定）</p><h3>季節限定美景</h3><p>每年春季，朴子溪畔換上金黃色的風景，在藍天與流水的陪襯下，形成一條明亮而溫柔的賞花步道。</p><h3>漫步體驗</h3><p>漫步其中，不僅能欣賞季節限定的自然美景，也能感受朴子溪帶來的悠閒與寧靜。</p>`
            },
            '六家佃長壽橋': {
                mainImg: './assets/T3.jpg',
                description: '橋身橫跨溪流，串連糖廠與木精靈豆花，成為遊客漫步與騎行的重要路線。',
                details: `<h3>連結景點的橋梁</h3><p>這裡結合了生活風景與地方情感的小型景點。橋身橫跨溪流，串連糖廠與木精靈豆花，成為遊客漫步與騎行的重要路線。</p><h3>美好寓意</h3><p>這座橋也承載著對「平安、健康、長久」的美好祝福，是自行車族必經的打卡點。</p>`
            },
            '古早味烤玉米': {
                mainImg: './assets/T4.jpg',
                description: '經過炭火的慢烤，外層微焦、內層飽滿多汁，配上獨門醬汁反覆刷烤，香味四溢。',
                details: `<h3>下鄉古早味烤香腸烤玉米</h3><p><strong>地址：</strong><a href="https://maps.app.goo.gl/1sPnvknAbUbAdT1XA" target="_blank" style="color: var(--color-primary); text-decoration: none;">嘉義縣六腳鄉蒜頭村94號</a></p><p><strong>營業時間：</strong>不定時</p><h3>傳承的醬香</h3><p>經過炭火的慢烤，外層微焦、內層飽滿多汁，配上獨門醬汁反覆刷烤，香味四溢，讓人一聞就停下腳步。</p><h3>不只是點心</h3><p>一支烤玉米，不只是點心，更承載著六腳鄉的生活節奏與人情溫度。</p>`
            }
        };


// --- 動畫數據 ---