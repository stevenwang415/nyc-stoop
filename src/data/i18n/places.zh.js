// ── zh-TW editorial content sidecar ─────────────────────────────────────────
// Keyed by place id: { d: description, t: insiderTip }. English is the
// automatic fallback — a missing id or field simply shows the English text,
// same graceful-degrade philosophy as t() in src/lib/i18n.js.
// places.js itself is NEVER touched: enrichment scripts stay safe, and the
// English voice remains the single source of truth.
//
// Batch 1 (2026-08-17): 20 marquee places — quality-check batch.

export const PLACES_ZH = {
  seed_katz_s_delicatessen: {
    d: '1888 年開業的老派熟食店，煙燻牛肉三明治疊得像小山一樣高，付一些小費能獲得試吃。',
  },
  seed_joe_s_pizza: {
    d: '格林威治村傳奇披薩店的現代分店 — 經典紐約式薄片，摺起來邊走邊吃才道地。',
  },
  seed_the_metropolitan_museum_of_art: {
    d: '第五大道上橫跨五千年的人類藝術 — 一座讓其他博物館用來自我衡量的百科全書式殿堂。',
  },
  seed_central_park: {
    d: '曼哈頓的綠色心臟 — 步道、球場、動物園、旋轉木馬、划船湖與蓄水池，一應俱全。',
  },
  seed_the_high_line: {
    d: '架在廢棄鐵道上、高於街面九公尺的空中公園 — 一路是哈德遜河與城市景色。',
  },
  seed_empire_state_building: {
    d: '1931 年落成的裝飾藝術地標 — 86 樓與 102 樓觀景台，把整座城市盡收眼底。',
  },
  seed_statue_of_liberty: {
    d: '1886 年矗立至今的自由女神，獨佔一座小島 — 從砲台公園搭渡輪前往，基座與皇冠需提前預約。',
    t: '皇冠門票常常提前數月售罄；基座加博物館是比較實際（也依然壯觀）的安排。',
  },
  seed_grand_central_terminal: {
    d: '以宏偉外觀與星空大廳聞名的百年車站 — 站內還有商店、餐廳與生蠔吧。',
  },
  seed_chelsea_market: {
    d: '室內市集名店雲集 — 海鮮、蔬果、雜貨、小店與各國美食一次逛齊。',
  },
  seed_american_museum_of_natural_history: {
    d: '從恐龍到外太空無所不包 — 一座展示自然奇觀的巨型博物館。博物館驚魂夜部分取景！',
  },
  seed_brooklyn_bridge_promenade: {
    d: '走上布魯克林大橋的木板步道 — 曼哈頓天際線在眼前緩緩展開，紐約最經典的一段路。',
  },
  seed_dumbo_manhattan_bridge_view: {
    d: '以曼哈頓大橋為背景的知名打卡路口 — DUMBO 最具代表性的一張照片就在這裡。',
  },
  seed_russ_daughters: {
    d: '1914 年開業的猶太煙燻魚老舖 — 貝果配燻鮭魚與奶油乳酪，下東城的百年滋味。',
  },
  seed_smorgasburg_williamsburg: {
    d: '週六限定的戶外美食市集 — 75 家以上攤販加上曼哈頓天際線，吃貨的朝聖地。',
  },
  seed_time_out_market_new_york_dumbo: {
    d: '河濱美食廣場 — 頂樓露台近距離面對兩座大橋的景色。',
  },
  seed_taiwanese_gourmet: {
    d: '不花俏的台菜食堂 — 排骨飯、三杯雞、海鮮，都是家鄉的味道。',
  },
  seed_hometown_bar_b_que: {
    d: '質樸的櫃檯點餐燒烤名店 — 慢燻肉品配精釀啤酒，週末還有現場音樂。',
  },
  seed_apollo_bagels: {
    d: '排隊排到街角的那一家 — 天然酵母貝果，名不虛傳。',
    t: '除非你喜歡跟整個網路一起排隊，建議挑離峰時段（下午三四點）去。',
  },
  seed_metrograph: {
    d: '新型態藝術電影院 — 附設美式餐廳與兩間酒吧，重現老好萊塢的氛圍。',
  },
  seed_spongies_cafe: {
    d: '華埠低調小咖啡店 — 介於堅尼路與公園之間，喝杯咖啡配甜點剛剛好。',
    t: '搭配轉角宰也街（Doyers Street）的散步行程剛剛好。',
  },
  // ── Batches 2–7 (2026-08-17): full catalog, machine-translated, zh-TW ──
  seed_ornithology_jazz_club: {
    d: 'Bushwick 的爵士聆聽空間，店名取自 Charlie Parker 的同名曲 — 每晚都有正經爵士演出，小巧親密、氣氛專注。',
    t: '每晚都有場次，全場刻意保持安靜 — 這裡是專心聽的爵士，不是當背景音樂的那種。',
  },
  seed_salon_on_kingston: {
    d: 'Crown Heights 的小酒吧，有自然酒、調酒和客廳般的自在感 — 街坊們捨不得說出去的那種口袋名單。',
  },
  seed_bakery_by_textbook: {
    d: 'Bed-Stuy 的街角麵包店，開在 Hancock Street — 早晨的酥皮點心配咖啡；記得早點去，好貨常常一早就賣光。',
  },
  seed_shuya: {
    d: 'Kips Bay 的日式小食堂，賣拉麵和居酒屋經典菜 — 店小、熱氣蒸騰、吃完很滿足。',
  },
  seed_sey_coffee: {
    d: '新派微型烘豆坊，在滿是植物、有天窗的空間裡喝咖啡配點心。',
  },
  seed_l_industrie_pizzeria_williamsburg: {
    d: '重新定義紐約披薩話題的 Williamsburg 切片店 — 鋪滿 burrata 起司的方形披薩和鬆軟圓餅，門口永遠在排隊。',
    t: 'burrata 切片是招牌 — 而且隊伍動得比看起來快。',
  },
  seed_ramenya_west_village: {
    d: '6th Avenue 上的 West Village 拉麵老面孔 — 濃郁豚骨湯頭，吧台出餐快速。',
  },
  seed_le_paris_dakar: {
    d: '輕鬆自在的可麗餅店，也賣三明治、沙拉、咖啡飲品和法式烘焙點心。',
  },
  seed_olea: {
    d: '地中海餐館，在充滿波希米亞風、綠意盎然的空間裡供應創意 tapas、早午餐和 sangria。',
  },
  seed_prima_brooklyn: {
    d: '開在褐石老宅裡的溫馨小店，附露台，供應義式咖啡、茶飲、三明治和咖啡館輕食。',
  },
  seed_mike_s_coffee_shop: {
    d: '街角小店裡的經典美式餐館菜色，家常氣氛，深受 Pratt 學生和在地人喜愛。',
  },
  seed_pura_vida_nomad: {
    d: '邁阿密健康系咖啡館的 NoMad 分店 — 果昔碗、捲餅，什麼都能冷壓。',
  },
  seed_barney_greengrass: {
    d: '1908 年開業的猶太熟食店老字號，以煙燻魚出名 — 還有不收信用卡這件事。',
  },
  seed_don_angie: {
    d: '在大理石點綴的空間裡，供應義裔美式經典菜，搭配葡萄酒與調酒。',
  },
  seed_guh_song_korean_style_chinese_restaurant: {
    d: '韓式中華料理的經典菜色，配啤酒和葡萄酒，用餐空間舒適寬敞。',
  },
  seed_ginjan_caf: {
    d: 'East Harlem 的咖啡館，由兩位幾內亞兄弟開設 — 125th Street 上喝得到西非薑汁飲「ginjan」、香料咖啡和可麗餅。',
  },
  seed_red_rover: {
    d: 'Greenpoint 的咖啡館，開在 Manhattan Avenue — 出了 G 線地鐵，就有咖啡和一片安靜。',
  },
  seed_kajiken_ramen: {
    d: '來自名古屋的油拌麵（abura soba）專門店 — 無湯的「油麵」自己拌著吃，比拉麵更濃郁，卻一滴湯都沒有。',
  },
  seed_ludlow_coffee_supply: {
    d: '有型又不張揚的舒服空間，供應咖啡、酥皮點心、餅乾等等。',
  },
  seed_ivan_ramen: {
    d: 'Ivan Orkin 的 Lower East Side 旗艦店 — 這位紐約人先征服了東京拉麵界才回家開店；裸麥麵條是招牌。',
    t: '先點鹽味（shio）— 傳奇就是靠這碗裸麥麵條打出來的。',
  },
  seed_hanamizuki_cafe: {
    d: '極簡風的日式咖啡館，主打各式創意內餡的飯糰，還有味噌湯。',
  },
  seed_tabetomo: {
    d: '在溫馨的空間裡供應傳統拉麵、沾麵、日式小菜和清酒。',
  },
  seed_ciao_gloria: {
    d: '白天限定的聚會據點，溫暖的空間裡有咖啡和甜鹹烘焙點心。',
  },
  seed_sawada_coffee: {
    d: '悠閒的咖啡館，回收木料和藝術感佈置，供應義式濃縮和抹茶飲品。',
  },
  seed_runner_stone: {
    d: '社區型餐館，自家做的麵包和酥皮點心，加上季節性新美式料理和調酒。',
  },
  seed_sarge_s_delicatessen_diner: {
    d: '煙燻牛肉、猶太丸子湯（matzo ball soup）等猶太熟食經典，在這間翻新過的老式餐館都吃得到。',
  },
  seed_luigi_s_pizzeria: {
    d: '1973 年開業的社區老店，在小巧樸實的空間裡賣紐約式披薩和切片。',
  },
  seed_th_i_s_n: {
    d: '法院附近的樸實小店，供應河粉（pho）和其他越南家常菜。',
  },
  seed_red_hook_tavern: {
    d: '向紐約經典老店致敬的美式料理，在溫暖的木質空間裡上桌。',
  },
  seed_olio_e_pi: {
    d: 'West Village 的義大利小館，就在 6th Avenue 旁 — 拿坡里路線的義大利麵和披薩，用餐空間像溫室一樣漂亮。',
  },
  seed_diego_s_gyros: {
    d: 'Bushwick 的小吃櫃台，賣塞到爆滿的 gyro 捲餅和酥脆薯條 — 便宜、快速，整個街區都愛。',
  },
  seed_mono_mono: {
    d: '韓式炸雞和其他料理，配燒酒調酒，還有 DJ 現場放爵士黑膠。',
  },
  seed_lys_e: {
    d: '韓法混血的精品甜點店，供應維也納酥皮、法式甜點和旅行蛋糕（gâteaux de voyage）。',
  },
  seed_soju_haus: {
    d: '寬敞的餐廳，主打韓國經典菜配燒酒和其他韓國酒的搭配。',
  },
  seed_kopitiam: {
    d: '小小的櫃台式店面，賣甜鹹馬來西亞料理，還有早餐、咖啡和茶。',
  },
  seed_salt_bread_ko: {
    d: '韓國城的鹽可頌小攤 — 外皮酥脆、奶油香十足的麵包捲，常常下午就完售。',
    t: '下午三點前去；鹽可頌賣完就是賣完了。',
  },
  seed_broad_nosh_bagels_deli_catering_58th_street: {
    d: 'Columbus Circle 附近的手工貝果和滿滿一櫃熟食 — 進 Central Park 前的早餐首選。',
  },
  seed_mixed_ingredients: {
    d: 'Orchard Street 上的迷你咖啡館，為 Lower East Side 的逛畫廊行程供應濃縮咖啡和抹茶。',
  },
  seed_little_canal: {
    d: '舒服的櫃台式小店，供應咖啡、酥皮點心、輕食和三明治。',
  },
  seed_dimes_deli: {
    d: '櫃台式空間，賣早餐三明治、飯碗和布丁，還兼賣一些雜貨。',
  },
  seed_wayla: {
    d: '以曼谷市場為靈感的家常泰國菜，在有露台的時髦空間裡供應。',
  },
  seed_habana_outpost_brooklyn: {
    d: '櫃台點餐的戶外餐館，賣墨西哥－古巴料理，不過冬天不營業。',
  },
  seed_healthy_market: {
    d: '不裝模作樣的市場兼熟食店，有早餐、burrito、咖啡、漢堡等等。',
  },
  seed_the_gin_mill: {
    d: '球迷（尤其是 Florida Gators 的）聚在電視前看比賽的酒館，有酒吧小食和 beer pong。',
  },
  seed_strand_book_store: {
    d: '地標級書店，從哲學到金融的新書、二手書和珍本都有，還有各種書迷小物。',
  },
  seed_north_5th_street_pier_and_park: {
    d: '在點綴著長椅的碼頭和步道欣賞曼哈頓和 East River 景色，旁邊還有一片人工草坪公園。',
  },
  seed_the_wayland: {
    d: '前衛調酒配樸實無華的空間，輕鬆自在的小酒館。',
  },
  seed_elsewhere: {
    d: '超大型場館，好幾個空間（包括屋頂露台）輪番上演現場音樂和 DJ 之夜。',
  },
  seed_felix: {
    d: '法式小酒館經典菜吸引著 SoHo 的逛街人潮，大片窗戶直接向街道敞開。',
  },
  seed_fanelli_caf: {
    d: '簡單的酒吧料理、啤酒和調酒，開在這間 1847 年就存在的 SoHo 經典老酒館裡。',
  },
  seed_minetta_tavern: {
    d: '名人愛去、一位難求的酒館餐廳，高檔法式小酒館菜色配上重新演繹的復古裝潢。',
  },
  seed_baker_s_dozen_bagels: {
    d: '生意很好的小店，有幾張桌子，賣貝果、早餐、三明治、漢堡和沙拉。',
  },
  seed_knickerbocker_bagel: {
    d: '熱鬧的貝果店，供應蛋三明治、湯品、沙拉等早午餐選擇。',
  },
  seed_court_street_bagels: {
    d: '低調但生意興隆的小店，各種口味的貝果和抹醬。只收現金。',
  },
  seed_bagel_boy: {
    d: '熟食店兼烘焙坊，有貝果、捲餅、帕尼尼和潛艇堡，還有湯品和沙拉。',
  },
  seed_la_bagel_delight_at_dumbo: {
    d: '櫃台式熟食店，供應各式貝果，還有早餐和午餐的三明治與捲餅。',
  },
  seed_greenberg_s_bagels: {
    d: '布魯克林出身的貝果店，如今在 Hudson Square 附近坐鎮 — 有嚼勁、表皮起泡，不搞花樣。',
    t: '多拿幾張餐巾紙，帶去往西走五分鐘的 Hudson River Park 碼頭吃。',
  },
  seed_terrace_bagels: {
    d: '手工貝果、各種口味的奶油乳酪和三明治，店裡熱鬧滾滾，只有幾張桌子。',
  },
  seed_bagel_point: {
    d: '輕鬆隨性的小店，全天供應各式手工貝果和奶油乳酪。',
  },
  seed_shelsky_s_brooklyn_bagels: {
    d: '出自猶太燻魚老舖之手 — 也就是說，貝果上面的煙燻魚跟下面的貝果一樣講究。',
    t: '白魚沙拉是隱藏版冠軍；沒吃到別走。',
  },
  seed_bagel_hole: {
    d: 'Park Slope 出了名的迷你老派貝果守門人：小顆、紮實、有嚼勁 — 蓬鬆派的天敵。',
    t: '別要求烤過。他們對這件事很堅持，而且他們是對的。',
  },
  seed_olde_brooklyn_bagel_shoppe: {
    d: 'Prospect Heights 的街坊常備店 — 份量大方、口味經典、毫不做作。',
    t: '去 Prospect Park 或 Brooklyn Museum 晃一個早上之前，外帶一份剛剛好。',
  },
  seed_bagel_pub: {
    d: '輕鬆的落腳處，有豐盛的貝果三明治和自製奶油乳酪，還有烘焙點心和咖啡。',
  },
  seed_bar_laika_by_e_flux: {
    d: '藝術出版社 e-flux 在 Clinton Hill 開的藝文酒吧 — 放映、朗讀，喝酒之餘更重視對話。',
  },
  seed_dino: {
    d: 'Fort Greene 的溫馨義大利小館，有鄉村風菜色、人行道座位和圍著白色柵欄的後院露台。',
  },
  seed_lil_frankie_s_grocery: {
    d: 'East Village 老字號 Lil\' Frankie\'s 的外帶部門 — 柴燒披薩切片、三明治和義大利食材雜貨，通通帶著走。',
  },
  seed_balthazar: {
    d: '指標性的法式 brasserie，紅色卡座的典雅空間裡有牛排薯條、早午餐和酥皮點心。',
  },
  seed_pebble_beach: {
    d: '遍布礫石的河畔小灘，是欣賞 Brooklyn Bridge 和曼哈頓天際線日落的熱門地點。',
  },
  seed_red_coffee_stand: {
    d: 'Dumbo 的濃縮咖啡小攤，開在 Front Street — 拍橋的空檔，快速來一杯好咖啡。',
  },
  seed_12_chairs_cafe: {
    d: '中東料理（鷹嘴豆泥尤其出色），在悠閒的鄉村風空間裡上桌。',
  },
  seed_the_odeon: {
    d: '熱鬧的小酒館，有戶外座位，供應法美料理，還有早午餐和深夜小食。',
  },
  seed_tasty_hand_pulled_noodles: {
    d: '樸實的中式櫃台小店，賣湯麵、餃子、炒飯和炒麵。',
  },
  seed_patisserie_tomoko: {
    d: 'Tomoko Kato 的創意甜點店，供應帶日式風味的法式甜點，還有葡萄酒和咖啡。',
  },
  seed_martha_s_country_bakery: {
    d: '氣氛溫暖的烘焙坊，賣老派蛋糕和點心，還有義式冰淇淋和一座濃縮咖啡吧。',
  },
  seed_10_ft_single_by_stella_dallas: {
    d: '不大的店面裡塞了相當可觀的男女古著、鞋履等等。',
  },
  seed_prem_thai_restaurant_and_noodle_bar: {
    d: 'Park Slope 的泰式麵館，開在 5th Avenue — 快速上桌的麵和咖哩，帶著街坊小店的溫度。',
  },
  seed_ayada: {
    d: '皇后區名店的曼哈頓分店，有辣咖哩、麵食和其他傳統泰國菜。',
  },
  seed_blue_brown_cafe: {
    d: 'Williamsburg 的全日咖啡館，開在 Havemeyer 上 — 認真的咖啡，配上簡短的早午餐和烘焙菜單。',
  },
  seed_coffee_project_new_york_east_village: {
    d: '溫馨的紅磚小店，賣解構拿鐵、氮氣冷萃等創意咖啡。',
  },
  seed_grind_the_nyc_coffee_shop_bagel_house: {
    d: 'Hell\'s Kitchen 的咖啡貝果櫃台，開在 9th Avenue — 手工貝果配濃縮咖啡，看戲前的早晨剛剛好。',
  },
  seed_the_back_room: {
    d: '禁酒令年代氛圍的隱密酒吧，調酒裝在茶杯裡，啤酒裹著紙袋上桌。',
  },
  seed_union_pool: {
    d: '由泳池用品店改建的人氣酒吧，有現場音樂，後院還停著一台 taco 餐車。',
  },
  seed_kaew_jao_jorm: {
    d: 'Grand Street 上的家族泰國菜，不走外賣店那套菜單 — 地方菜系、真材實料的辣，是 Williamsburg 的泰式遺珠。',
  },
  seed_the_django: {
    d: 'Roxy Hotel 地下、洞穴般的巴黎風爵士酒吧，定期有現場演出。',
  },
  seed_dream_baby_bar_and_cocktail_parlour: {
    d: '氣氛放鬆又私密的雞尾酒吧，有舒服的卡座、創意調酒和復古音樂。',
  },
  seed_rice_miso: {
    d: '線條俐落的日式外帶小店，菜單不長，主打飯糰和其他日式料理。',
  },
  seed_michele_varian_shop_design: {
    d: '設計師自營的精品店，賣別緻的抱枕與寢具，還有飾品、餐具等居家好物。',
  },
  seed_horseman_antiques: {
    d: '多層樓的寬敞古董店，專營 mid-century、丹麥現代與工業風家具。',
  },
  seed_public_records: {
    d: 'Hi-fi 唱片酒吧，有吃有喝，還附設小型表演空間和純素咖啡店。',
  },
  seed_still_life: {
    d: 'Gowanus 安靜 Sackett 街區上的社區咖啡店 — 手沖、糕點，還有真的坐得下來的空間。',
  },
  seed_peter_luger_steak_house: {
    d: '只收現金的牛排傳奇，老派服務生在德式啤酒館氛圍裡端上熟成牛肉。',
  },
  seed_pikchi_photobooth: {
    d: 'Eldridge Street 上的韓式自助拍貼店 — 道具、相框、帶得走的拍貼條，LES 最可愛的十五分鐘。',
  },
  seed_hom_cafe_wine: {
    d: '7th Avenue 上會變身的 Park Slope 咖啡店 — 白天糕點配 espresso，開瓶器一登場就成了酒吧。',
  },
  seed_un_posto_italiano: {
    d: 'Park Slope 巷內道地的義式咖啡館 — 白天是 espresso 的儀式，傍晚換上開胃酒和自然酒。',
  },
  seed_mr_boddington_s_studio: {
    d: '童趣文具品牌在 Park Slope 的店面 — 插畫卡片和帶點俏皮的紙品。',
  },
  seed_the_analog_stationer: {
    d: 'Prospect Heights 給手寫信徒的紙品店 — Vanderbilt Avenue 上的鋼筆、筆記本和卡片。',
  },
  seed_unnameable_books: {
    d: '獨立書店，買賣新書與二手書，還有滿滿的講座、新書發表和朗讀活動。',
  },
  seed_otway: {
    d: '自家分切肉品、自家烘焙，做成美式小酒館料理，空間明亮有型。',
  },
  seed_laser_wolf_brooklyn: {
    d: '時髦又放鬆的頂樓餐廳，以色列風串燒小食配曼哈頓天際線。',
  },
  seed_crosby_street_hotel: {
    d: '精緻飯店裡的講究客房與套房，附華麗餐廳和頂樓花園。',
  },
  seed_i_sodi: {
    d: '小巧浪漫的餐廳，托斯卡尼風味料理配葡萄酒和調酒。',
  },
  seed_king: {
    d: '明亮溫馨的小餐廳，南義季節菜單配獨特調酒。',
  },
  seed_kiki_s: {
    d: '直球的希臘料理 — 海鮮、羊肉，木樑外露的空間溫暖自在。',
  },
  seed_beacon_s_closet: {
    d: '時髦的二手服飾店，古著和現代衣飾都有，從平價品牌到頂級設計師。',
  },
  seed_sm_r: {
    d: '溫馨的北歐小店，做開面吐司、碗食和三明治，還有早餐和啤酒。',
  },
  seed_the_stumble_inn: {
    d: '啤酒乒乓、飲料優惠、電視轉播運動賽事 — 這間人氣酒吧的日常就這麼簡單。',
  },
  seed_jua: {
    d: 'Flatiron 的米其林星級韓式板前 — 主廚 Hoyoung Kim 對首爾技法精準、當令的詮釋。',
  },
  seed_goods_for_the_study_nolita: {
    d: '溫馨小店，賣有型的家具、藝術版畫、桌上文具等居家辦公好物。',
  },
  seed_the_meadow_mulberry_st: {
    d: '高檔鹽、巧克力、葡萄酒和苦精的補給站，還有現剪鮮花。',
  },
  seed_juliana_s: {
    d: '披薩傳奇 Patsy Grimaldi 開的店，煤炭窯烤的經典與特色披薩，空間現代。',
  },
  seed_a_taste_of_katz_s: {
    d: 'DeKalb Market Hall 裡知名 Katz\'s Delicatessen 的攤位，猶太熟食三明治份量驚人。',
  },
  seed_no_gem: {
    d: 'Canal Street 的概念店兼咖啡店 — 前面賣咖啡，後面是一排精挑細選的服飾和選物。',
  },
  seed_coming_soon: {
    d: '高檔又繽紛的藝廊型選物店，設計師居家小物、復古家具和有創意的禮物。',
  },
  seed_arthur_avenue_retail_market: {
    d: '頗具規模的義大利市場，醃肉、起司、麵包、糕點通通有，還有一間低調的咖啡店。',
  },
  seed_union_square_greenmarket: {
    d: '全年營業的農夫市集（固定日子開市），集結各路農場和小批次食品生產者。',
  },
  seed_grand_central_market: {
    d: 'Grand Central 裡對通勤族友善的美食攤商群，賣熟食和特色食材。',
  },
  seed_fabrique_artisan_bakery: {
    d: '瑞典連鎖烘焙坊的紐約分店，招牌是小豆蔻捲和肉桂捲。',
  },
  seed_la_bicyclette_bakery: {
    d: 'Driggs Avenue 上的法式麵包店 — 長棍、kouign-amann，以及 Williamsburg 的早晨可頌排隊人潮。',
  },
  seed_supermoon_bakehouse: {
    d: '以 cruffin（各種內餡的可頌馬芬）和其他天馬行空甜點聞名的烘焙坊。',
  },
  seed_librae_bakery: {
    d: '寬敞的烘焙據點，特製糕點和餅乾，室內戶外都有位子。',
  },
  seed_tai_pan_bakery: {
    d: '熱鬧的中式餅店，蛋糕、糕點加上叉燒包、蛋撻等經典。',
  },
  seed_westlight: {
    d: '頂樓酒吧，露台和玻璃帷幕酒廊都看得到全景天際線，配精緻調酒。',
  },
  seed_artists_fleas_market_williamsburg: {
    d: '只在週末開的室內市集，賣時髦手作工藝品和古著。',
  },
  seed_monk_vintage: {
    d: '五彩繽紛的古著店，二手鞋、衣服、配件塞得滿滿卻整理得井井有條。',
  },
  seed_sadelle_s_new_york: {
    d: '煙燻魚、自製貝果等經典猶太式輕食，復古風空間熱鬧滾滾。',
  },
  seed_soothr: {
    d: 'East Village 有死忠粉絲的泰式餐廳 — 船麵、依善菜，還有值得等的 khao soi。',
    t: '先訂位，不然就準備排隊 — 大家都是為了船麵來的。',
  },
  seed_fish_cheeks: {
    d: 'Bond Street 上的泰式海鮮派對 — 椰奶蟹咖哩、全魚料理，味道毫不客氣。',
    t: '椰奶蟹咖哩必點 — 帶朋友來一起分。',
  },
  seed_domino_park: {
    d: '舊糖廠改建的綠地，有遊樂場、狗狗活動區和 East River 河景。',
  },
  seed_new_york_stock_exchange: {
    d: 'Wall Street 上的地標建築，世界頂尖證券交易所之一的所在地。',
  },
  seed_two_hands: {
    d: '澳洲風咖啡館兼酒吧，輕鬆空間裡供應有創意的療癒系餐點和飲品。',
  },
  seed_leon_s_bagels: {
    d: 'NYU 地盤上的貝果站 — 快速、實在，離 Washington Square 近得剛剛好。',
    t: '帶去公園吃吧，噴泉旁的座位就是你的用餐區。',
  },
  seed_wah_fung_no_1_fast_food: {
    d: '平價中式小店，賣街頭風味料理，招牌是叉燒。',
  },
  seed_los_tacos_no_1: {
    d: '三位來自 Tijuana 和 San Diego 的朋友開的站食 taco 店 — 手工麵粉餅皮的 adobada 是紐約最棒的平價美食之一。',
    t: '點 adobada，跟大家一樣站在櫃檯邊吃 — 沒有座位!',
  },
  seed_mui: {
    d: '光鮮亮麗的 lounge，把韓日街頭小吃玩出新版本，配調酒和 DJ 音樂。',
  },
  seed_autophoto_photobooth_gallery_busier_than_usual: {
    d: 'Orchard Street 上的類比拍貼藝廊 — 修復的復古拍貼機拍出真正的化學顯影相片條，牆上還有輪替的攝影展。',
    t: '相片條要幾分鐘才顯影 — 等的時候順便逛逛展覽。',
  },
  seed_wo_hop: {
    d: '地下室小館，賣撈麵、餃子等四川特色菜，門口還有路邊座位。',
  },
  seed_thai_villa: {
    d: 'Flatiron 的華麗泰式宮殿 — 木雕、黃銅燈籠和皇室食譜咖哩；光空間就值回一半。',
  },
  seed_subject_a_cocktail_bar: {
    d: '熱鬧的雞尾酒吧，主打野心十足的創作調酒，還有一小份精緻下酒菜單。',
  },
  seed_the_mayfly: {
    d: '悠閒的餐酒館，升級版酒吧料理配飛行主題調酒。',
  },
  seed_apotheke_chinatown: {
    d: '調酒師穿著藥劑師袍，在這間隱身巷弄的酒吧調製複雜的雞尾酒。',
  },
  seed_xiang_hotpot_brooklyn: {
    d: '四川火鍋人氣店的 Borough Park 分店 — 咕嚕滾的鴛鴦鍋、手拉麵，和料超齊全的自助醬料吧。',
  },
  seed_mountain_house_flushing: {
    d: 'Szechuan Mountain House 的 Flushing 本家 — 詩意的擺盤（著名的鞦韆五花肉）配上扎實的麻辣功夫。',
  },
  seed_nick_sons_bakery: {
    d: 'Greenpoint 人氣烘焙坊，招牌是酸種麵包和 morning bun — Lorimer Street 的週末排隊人龍說明一切。',
  },
  seed_rule_of_thirds: {
    d: '知名餐飲團隊做的創意日式家常菜，挑高天花板下的溫馨空間。',
  },
  seed_clinton_st_baking_company: {
    d: '以週末早午餐和鬆餅聞名的美式餐廳，也有外帶區。',
  },
  seed_fornino: {
    d: '老字號披薩店，柴燒窯烤披薩，店裡氣氛親切。',
  },
  seed_partners_coffee_cafe_roastery: {
    d: '時髦的職人咖啡，espresso 和茶飲之外還賣沖煮器材、開沖煮課。',
  },
  seed_burrow: {
    d: 'Dumbo 迷你精緻烘焙小舖，馬芬、餅乾和客製蛋糕都帶著現代藝術感。',
  },
  seed_sunday_in_brooklyn: {
    d: 'Atera 出身主廚的美式餐廳，有小舖、酒吧區、樓上用餐室和花園。',
  },
  seed_qahwah_house_coffee_williamsburg_brooklyn: {
    d: 'Bedford 上的葉門咖啡館 — 幾百年的沖煮傳統、adeni 奶茶和 sabaya 蜂巢麵包。',
    t: '點 adeni 奶茶配 sabaya 蜂巢麵包 — 然後好好坐下來；葉門咖啡文化沒有外帶的匆忙。',
  },
  seed_the_four_horsemen: {
    d: 'LCD Soundsystem 的 James Murphy 開的葡萄酒吧，小巧的淺色木質空間裡供應小盤料理。',
  },
  seed_myrtle_thai: {
    d: 'Myrtle Avenue 上 Clinton Hill 的街坊泰式 — 咖哩和麵份量大方，快速又可靠。',
  },
  seed_black_brick_coffee: {
    d: '燈光昏暗的咖啡店，Stumptown 咖啡配烘焙點心，復古擺設低調沉靜。',
  },
  seed_oxomoco: {
    d: '明亮通風的墨西哥餐廳，柴火料理配上豐富的 tequila 和 mezcal 調酒，還有露天座位。',
  },
  seed_happy_zoe_vegan_bakery: {
    d: '以各式純素蛋糕和糕點出名，溫馨空間裡擺著混搭風裝飾。',
  },
  seed_spoonbill_sugartown_books: {
    d: '溫馨的獨立書店，賣藝術、建築和設計類的珍稀新書與二手書。',
  },
  seed_lisbonata: {
    d: 'Crown Heights 的葡萄牙烘焙坊 — 焦香頂的葡式蛋塔，配一杯 galão 剛剛好。',
    t: '趁熱吃蛋塔 — 出爐幾分鐘內最好吃。',
  },
  seed_bakeri: {
    d: '鄉村雅緻風的據點，職人咖啡、現烤麵包點心和輕鬆的咖啡館餐點。',
  },
  seed_prince_street_pizza: {
    d: 'NoLita 披薩店，方形披薩用街坊的街名命名，好吃又有趣。',
  },
  seed_l_industrie_pizzeria_west_village: {
    d: 'Williamsburg 名店的 West Village 分店 — 一樣的 burrata 切片，Christopher Street 的排隊也一併附上。',
  },
  seed_una_pizza_napoletana: {
    d: '自學成材的披薩師 Anthony Mangieri 的 12 吋柴燒拿坡里披薩，空間現代簡潔。',
  },
  seed_united_nations_headquarters: {
    d: 'East River 畔佔地 18 英畝的建築群，193 個會員國在此進行國際外交。',
  },
  seed_flatiron_building: {
    d: '建築師 Daniel Burnham 1902 年的三角形地標大樓，因形似熨斗而得名。',
  },
  seed_new_york_public_library_stephen_a_schwarzman_building: {
    d: 'Fifth Avenue 上有石獅守門的 Beaux-Arts 旗艦館 — 免費走進去，在 Rose Main Reading Room 抬頭看就對了。',
    t: '免費入場 — 直奔三樓的 Rose Main Reading Room，再從後門走出去就是 Bryant Park。',
  },
  seed_intrepid_museum: {
    d: 'Hudson 河上的航空母艦博物館 — 甲板上停戰鬥機，展館裡有太空梭，旁邊還泊著一艘潛艇。',
  },
  seed_trinity_church: {
    d: '歷史悠久的聖公會教堂與墓園，Alexander Hamilton 等美國開國先賢長眠於此。',
  },
  seed_9_11_memorial_museum: {
    d: '雙塔原址上的兩座倒影池，以及底下的博物館 — 在事件發生的地方，講述那一天最完整的紀錄。',
    t: '戶外紀念池免費且全天開放；要進博物館的話，請留兩小時以上和一些安靜的心情。',
  },
  seed_ground_zero: {
    d: 'World Trade Center 舊址 — 兩座紀念池和橡樹林就落在雙塔的地基上；免費、開放，安靜得讓人震撼。',
  },
  seed_st_patrick_s_cathedral: {
    d: '1879 年落成的新哥德式大教堂，在 Fifth Avenue 的高樓群中依然氣勢不減 — 雙尖塔、絢爛的彩繪玻璃，免費入場。',
  },
  seed_wolfgang_s_steakhouse: {
    d: '高檔牛排館連鎖，在優雅的空間裡供應乾式熟成牛排、海鮮和葡萄酒。',
  },
  seed_dover_street_market_new_york: {
    d: '時髦又寬敞的高端服飾殿堂，陳列前衛大膽，還附設一間美食咖啡廳。',
  },
  seed_acme: {
    d: '餐廳兼酒吧，供應精緻的法式與義式小館料理，還有葡萄酒和調酒。',
  },
  seed_tomatoes_vintage: {
    d: '藏在 Chinatown 的小型古著店，值得專程尋找 — 精挑細選的衣架就在 East Broadway 商場樓上。',
  },
  seed_eileen_s_special_cheesecake: {
    d: '經營多年的烘焙老店，主打起司蛋糕，還有餅乾、cannoli 和其他甜點。',
  },
  seed_dominique_ansel_bakery: {
    d: '甜點主廚 Dominique Ansel 領軍的烘焙咖啡店，端出一件件創意十足又漂亮的法式甜點。',
  },
  seed_keki_modern_cakes: {
    d: '迷你烘焙小舖，專賣日式手工起司蛋糕和塔類等甜點。',
  },
  seed_wenwen: {
    d: '小巧的餐廳，在輕鬆自在的氣氛裡供應台灣菜和調酒。',
  },
  seed_ok_ryan: {
    d: '不擺架子的商場小店，在明亮繽紛的空間裡端出傳統台灣料理。',
  },
  seed_main_street_imperial_taiwanese: {
    d: '裝潢樸實的小店，供應各種外面很難找到的台灣特色菜，內臟料理也有。',
  },
  seed_francie: {
    d: '熱鬧的開放式廚房餐館，供應歐陸風味料理和精緻調酒。',
  },
  seed_scalino_gp: {
    d: '在鄉村風的環境裡供應傳統義大利麵、肉類料理和輕食。',
  },
  seed_wayan: {
    d: '名廚 Jean-Georges 之子 Cédric Vongerichten 打造的法式印尼料理，在時髦俐落的空間裡登場。',
  },
  seed_crown_shy: {
    d: '精緻的新美式餐廳，融合各國風味，挑高天花板讓空間格外開闊。',
  },
  seed_devoci_n: {
    d: '嚴選哥倫比亞咖啡豆，在明亮的紅磚牆空間裡配著皮沙發慢慢喝。',
  },
  seed_simpl_coffee: {
    d: 'Nassau Street 上的 FiDi 濃縮咖啡站 — 快速、穩定，專為市中心的匆忙節奏而生。',
  },
  seed_devoci_n_2: {
    d: '嚴選哥倫比亞咖啡豆，在明亮的紅磚牆空間裡配著皮沙發慢慢喝。',
  },
  seed_mountain_house: {
    d: '適合揪團的家常川菜館，滿桌辣椒料理，再配上一壺壺熱茶。',
  },
  seed_mari_vanna: {
    d: '老派俄羅斯菜，用餐空間布置得像客廳，擺滿書本、蕾絲、老照片和小古董。',
  },
  seed_temple_court: {
    d: 'Tom Colicchio 開在地標 Beekman Hotel 裡的美式餐廳，裝潢華麗講究。',
  },
  seed_a_pasta_bar: {
    d: '主廚在中央廚房現煮現上義大利麵的小館，吧台座位看得到全程。',
  },
  seed_kinzan_omakase: {
    d: '藏在 Village 靜謐空間裡的高檔 omakase — 小吧台前的江戶前套餐，屬於要提前訂位的那種。',
  },
  seed_zero_otto_nove_manhattan: {
    d: '傳統義大利料理和酒飲，空間溫暖，帶著舊世界的氛圍。',
  },
  seed_rokunana: {
    d: 'Lower East Side 的小壽司吧 — 店名就是地址 Clinton 街 67 號，以親民的 omakase 打破曼哈頓的價格行情。',
  },
  seed_le_coucou: {
    d: '精緻法式料理 — 龍蝦、兔肉、鴨肉、鵝肝，在明亮優雅的空間裡上桌。',
  },
  seed_oiji_mi: {
    d: '復古裝潢的時髦餐廳，供應帶現代詮釋的高檔韓國料理。',
  },
  seed_chalong_southern_thai: {
    d: 'Hell\'s Kitchen 的南泰料理 — 薑黃味濃厚的咖哩和貨真價實的辣度，跟 pad thai 完全是兩個世界。',
  },
  seed_keens_steakhouse: {
    d: '巨無霸牛排和招牌羊排，在一間間木板牆的老派俱樂部式包廂裡上桌。',
  },
  seed_jora: {
    d: '裝潢優雅的餐廳酒吧，主打秘魯料理和 pisco 調酒。',
  },
  seed_locanda_verde_tribeca: {
    d: 'TriBeCa 的人氣餐廳，在熱鬧的氣氛裡端出鄉村風義大利料理。',
  },
  seed_l_artusi: {
    d: '義式小盤料理配上豐富的酒單，樓上樓下兩層的餐廳。',
  },
  seed_jungsik: {
    d: '創新的高端韓國料理，在優雅的現代空間裡登場，酒單也很可觀。',
  },
  seed_torien: {
    d: '東京名店的紐約分店，專做炭火烤雞肉串。',
  },
  seed_ikigai: {
    d: 'Fort Greene 的壽司和日式家常菜，Lafayette Avenue 上一方安靜的空間 — 這一帶約會晚餐的首選。',
  },
  seed_musaafer: {
    d: 'Tribeca 珠寶盒般的空間裡的華麗印度精緻料理 — 各地區菜色端得像舞台劇，出自 Houston 本店的原班人馬。',
  },
  seed_genesis_house: {
    d: '精緻的韓式佳餚，在附有寬敞露台的現代餐廳裡上桌。',
  },
  seed_manhatta: {
    d: 'Danny Meyer 開在金融區上空 60 樓的餐廳 — 法式路線的菜單，紐約港就在腳下。',
    t: '酒吧區接受現場候位 — 同樣的天際線，少一半的隆重感。',
  },
  seed_shukette: {
    d: 'Ayesha Nurdjaja 在 Chelsea 開的中東餐廳，熱鬧又歡樂 — 烤得起泡的麵包、salatim 抹醬拼盤，還有炭烤鮮魚。',
    t: '整餐圍著麵包點就對了 — frena 配 toum 很快就賣完。',
  },
  seed_portale: {
    d: 'Alfred Portale 在 Chelsea 的現代義大利菜 — 掌管 Gotham Bar & Grill 三十年的主廚做的精緻義大利麵。',
  },
  seed_mitr_thai_restaurant: {
    d: 'Diamond District 的泰國菜，開在俐落的中城空間裡 — 離 Rockefeller Center 幾條街就吃得到道地曼谷味。',
  },
  seed_leitao: {
    d: 'Hudson Street 上的葡萄牙菜 — 烤魚、petiscos 小點和 vinho verde，帶著 West Village 的悠閒。',
  },
  seed_saitong_thai: {
    d: '劇院區的泰國菜，深度遠超過看戲前隨便吃的 pad see ew — 曼谷風味上菜夠快，趕八點開演也沒問題。',
  },
  seed_momokawa: {
    d: '小而精的日本料理店，用傳統手法做經典日式菜色。',
  },
  seed_saint_julivert: {
    d: 'Battersby 團隊在 Cobble Hill 開的海鮮小館 — 放眼世界的小盤料理，配上低調的自然酒。',
  },
  seed_pranakhon: {
    d: 'University Place 上帶曼谷街頭味的泰國菜 — Village 一帶的老班底，跑 NYU 辦事途中來碗 khao soi 或船麵剛剛好。',
  },
  seed_jojo_by_jean_georges: {
    d: 'Jean-Georges Vongerichten 開在優雅聯排別墅裡的餐廳，供應季節性法式菜單。',
  },
  seed_the_dead_rabbit: {
    d: '金融區的愛爾蘭酒吧，屢次獲選世界最佳酒吧 — 樓下是啤酒間，樓上是調酒沙龍，愛爾蘭咖啡永遠都在。',
    t: '愛爾蘭咖啡是這裡的標竿 — 就算是衝著調酒單來的，也點一杯試試。',
  },
  seed_le_pavillon: {
    d: '高檔餐廳，滿室綠意、挑高天花板和城市景觀，供應葡萄酒和法式料理。',
  },
  seed_place_des_f_tes: {
    d: '時髦的葡萄酒吧，鄉村雅緻風裝潢，供應精心挑選的酒款和小盤料理。',
  },
  seed_tonchin_new_york: {
    d: '東京連鎖的紐約分店，主打豚骨拉麵、鐵板料理和炸雞。',
  },
  seed_little_ruby_s_soho: {
    d: '小巧的澳洲咖啡館，vegemite 吐司和牛肉漢堡吸引一票時髦客人。',
  },
  seed_thep_thai_restaurant: {
    d: 'Upper East Side 的泰國菜，辣度是真正的曼谷等級 — 一間完全不肯妥協的社區餐廳。',
  },
  seed_cho_dang_gol: {
    d: '輕鬆自在的韓式餐館，主打自製豆腐的湯品和燉鍋，還有其他療癒系家常菜。',
  },
  seed_tompkins_square_bagels_east_village_bagels: {
    d: '手工貝果、三明治、糕點和咖啡，開在時髦的紅磚牆空間裡，有座位可以坐。',
  },
  seed_ess_a_bagel: {
    d: '紐約知名的超大蓬鬆貝果 — 隊伍排到門外，但值得排一次。',
    t: '隊伍動得比看起來快；輪到你之前先想好要點什麼。',
  },
  seed_kanoyama: {
    d: '裝潢簡單，魚料選擇卻很豐富（也有素食選項），隔壁還有清酒生蠔吧。',
  },
  seed_leo_s_bagels: {
    d: 'FiDi 的老派手工貝果店，就在 Hanover Square 旁 — 在連鎖店環伺的街區裡吃到真材實料。',
    t: '平日早上九點前的上班族人潮很可觀；晚十分鐘再去就清靜了。',
  },
  seed_liberty_bagels_midtown: {
    d: '簡單的櫃台式小店，自製貝果配奶油乳酪、蛋或午餐肉類三明治。',
  },
  seed_cath_drale_restaurant: {
    d: 'Moxy East Village 飯店裡的餐廳，在戲劇感十足的用餐空間裡供應法式地中海料理。',
  },
  seed_the_fulton_by_jean_georges: {
    d: '水岸餐廳，用野生捕撈的海鮮做現代菜色，再配上季節性調酒。',
  },
  seed_buddakan: {
    d: '巨大又華麗的餐廳，供應亞洲料理和調酒。',
  },
  seed_electric_lemon: {
    d: 'Equinox Hotel 裡的餐廳，主打蔬食料理和生魚薄片，空間精緻還有露台。',
  },
  seed_martiny_s: {
    d: '時髦的裸磚牆酒吧，端出講究的調酒和精緻小點。',
  },
  seed_double_chicken_please: {
    d: '時髦又溫馨的小酒吧，供應手指小食、雞肉三明治和創意調酒。',
  },
  seed_angel_s_share: {
    d: 'East Village 的 speakeasy 風格酒吧，在一個很酷又不好找的空間裡供應異國調酒。',
  },
  seed_amor_y_amargo: {
    d: 'Sother Teague 在 East Village 開的迷你苦精酒吧 — 以 amaro 為主軸、只用攪拌的調酒，吧台小得像衣櫥。',
    t: '沒有搖盪調酒、不加果汁 — 就放心交給調酒師帶你走一趟 amaro 之旅。',
  },
  seed_retrography: {
    d: '中城的底片攝影聖地 — 古董相機買賣兼維修，還有底片讓你把這座城市拍下來。',
  },
  seed_mother_s_ruin: {
    d: '客製調酒、下酒小食和加了酒的冰沙，讓這間社區酒吧總是熱熱鬧鬧。',
  },
  seed_death_co_east_village: {
    d: '打領結、吊褲帶的調酒師重現 speakeasy 年代，燈光昏暗、氣氛滿點的調酒酒吧。',
  },
  seed_spring_lounge: {
    d: '1920 年代開到現在的社區小酒館，早上八點就有人來喝基本款酒飲，週末還有貝果。',
  },
  seed_maison_premiere: {
    d: '生蠔、調酒和小盤料理，紐奧良風格的空間加上一座氣氛滿分的花園。',
  },
  seed_employees_only: {
    d: '復古裝潢的禁酒令風格酒吧，端出充滿創意的調酒。',
  },
  seed_madame_george: {
    d: '以 Van Morrison 歌曲命名的昏暗中城調酒吧 — 在不怎麼正經的中城地帶認真做酒。',
  },
  seed_tomi_jazz: {
    d: '低調的小酒吧，日式小食配現場爵士，溫馨空間帶著 speakeasy 的氣氛。',
  },
  seed_katana_kitten: {
    d: '很酷的兩層樓酒吧，供應居酒屋料理和經典美式小食，調酒充滿玩心。',
  },
  seed_banzarbar: {
    d: 'Freemans 樓上的隱密調酒閣樓，藏在 Freeman Alley 巷底 — 海味小食搭配走低酒精路線的酒單。',
  },
  seed_dante_west_village: {
    d: '名店的海鮮燒烤分店，時髦有型，附設 aperitivo 開胃酒吧和露台。',
  },
  seed_the_newsroom: {
    d: '撐起 43rd Avenue 的 Long Island City 餐酒館 — 療癒系料理、一座像樣的吧台，重要賽事時還有大螢幕。',
  },
  seed_fig_19: {
    d: '從一間祕密藝廊穿進去，就是這處吊燈映照的溫馨小天地，主打精緻調酒。',
  },
  seed_sonnyboy: {
    d: '時髦的聚會據點，供應季節限定料理和調酒，還有 happy hour。',
  },
  seed_hole_in_the_wall: {
    d: '澳式咖啡酒吧的 Flatiron 分店 — 白天是經典早午餐和 flat white，晚上換成調酒。',
  },
  seed_dudleys: {
    d: '雅緻的全日咖啡酒吧，用在地食材做帶澳洲風味的美式小點。',
  },
  seed_little_collins: {
    d: '時髦又溫暖的咖啡館，供應早餐、糕點、三明治和沙拉，下午也有得吃。',
  },
  seed_l_amico: {
    d: 'Laurent Tourondel 開在 Eventi Hotel 裡的鄉村時髦風義大利餐廳，披薩、義大利麵樣樣有。',
  },
  seed_davelle: {
    d: '日式咖啡店，供應早餐與午間套餐，還有咖啡、茶和抹茶拿鐵。',
  },
  seed_citizens_of_chelsea_a_breakfast_restaurant_cafe: {
    d: 'Chelsea 熱情大方的澳式咖啡店 — High Line 西側，有創意早午餐和道地的 flat white。',
  },
  seed_cafeteria: {
    d: '走時髦路線的美式餐館，深夜吸引愛看人群的客人和剛從夜店散場的人。',
  },
  seed_la_pecora_bianca_nomad: {
    d: 'NoMad 明亮的義大利餐廳 — 白磁磚空間裡吃時令義大利麵、喝 spritz，訂位比附近鄰居容易得多。',
  },
  seed_buvette: {
    d: '人氣古雅小酒館，從早餐、午餐到晚餐都供應法式小盤料理。',
  },
  seed_jeju_noodle_bar: {
    d: '主打韓式拉麵和開胃小點的韓國餐廳，空間現代、燈光溫暖。',
  },
  seed_hole_in_the_wall_murray_hill: {
    d: 'Murray Hill 的澳式全日咖啡酒吧 — 白天喝 flat white 吃早午餐，晚上換 espresso martini 上場。',
  },
  seed_duane_park: {
    d: 'Bowery 上邊吃晚餐邊看秀的晚餐俱樂部 — 滑稽歌舞、爵士和雜耍，配上精緻美式菜色。',
    t: '訂有表演的場次 — 重點是看秀，晚餐只是藉口。',
  },
  seed_urban_jungle: {
    d: '寬敞不做作的古著店，男女裝、鞋子的 vintage 和二手選擇都很多。',
  },
  seed_jersey_gardens: {
    d: '數十個人氣品牌的 outlet，還有 Saks OFF 5TH、Neiman Marcus Last Call 和電影院。',
  },
  seed_au_cheval: {
    d: '芝加哥豪華版美式餐館的 Tribeca 分店 — 皮革卡座、鋅製吧台，還有那顆橫掃各大排行榜的起司漢堡。',
    t: '單層起司漢堡其實就是雙層 — 加顆煎蛋，保證不後悔。',
  },
  seed_luigi_s_pizza: {
    d: '1973 年開到現在的社區小店，在小巧樸實的空間賣紐約式披薩和切片。',
  },
  seed_cafe_mogador: {
    d: '經典摩洛哥風味加上戶外座位，讓這家社區老店聚集了一票波希米亞風的常客。',
  },
  seed_century_21_nyc: {
    d: '品牌服飾、鞋子和配件的折扣百貨，男裝、女裝、童裝都有。',
  },
  seed_rosemary_s_east: {
    d: '酸種麵團披薩、手工義大利麵和 spritz 吧台，空間寬敞明亮，還有戶外座位。',
  },
  seed_blind_barber: {
    d: '白天在前廳剪頭髮喝飲料，晚上後面的房間搖身變成熱鬧的雞尾酒吧。',
  },
  seed_eataly: {
    d: '知名義大利市集的分店，有各式櫃台、餐廳和烹飪示範。',
  },
  seed_lost_in_paradise_rooftop: {
    d: 'Long Island City 43rd Avenue 上方的頂樓酒吧 — 熱帶調酒，拿 Manhattan 天際線當裝飾。',
  },
  seed_paterson_great_falls_national_historical_park: {
    d: '以 77 英尺瀑布聞名的國家歷史公園，1792 年正是這道瀑布帶動了水力開發。',
  },
  seed_the_museum_of_modern_art: {
    d: '館藏從梵谷一路到 Warhol 與更當代的作品，還有雕塑花園、兩間咖啡店和 The Modern 餐廳。',
  },
  seed_joyface: {
    d: '低調的 1970 年代風格酒吧，有絨布沙發、迪斯可球和水床，供應創意調酒。',
  },
  seed_gospel: {
    d: '藝術感十足的夜間去處，有素食晚餐俱樂部、酒吧和氣氛迷離的現場音樂空間。',
  },
  seed_the_nines: {
    d: '浪漫老派的鋼琴酒廊，有服裝規定，供應調酒和魚子醬之類的高級小點。',
  },
  seed_bar_belly: {
    d: '溫馨小店，在復古風空間裡供應生蠔、小食和飲品，還有現場音樂和 DJ 之夜。',
  },
  seed_swift_hibernian_lounge: {
    d: '低調的在地愛爾蘭酒吧，生啤和瓶裝啤酒選擇很多。',
  },
  seed_ray_s: {
    d: 'dive bar 氣氛的小酒館，有迪斯可球和撞球桌，供應啤酒和手工調酒。',
  },
  seed_hotel_delmano: {
    d: 'Williamsburg 人氣酒吧，在讓人想起老紐約的雅致空間裡喝調酒。',
  },
  seed_the_spaniard: {
    d: '美式經典菜、漢堡、威士忌和調酒，帶復古氛圍的社區 gastropub。',
  },
  seed_elvis: {
    d: 'Great Jones Street 上帶點法國味的幽暗調酒與葡萄酒小窩 — 燈光昏暗、選曲很好，就在 NoHo 最酷的一條街上。',
  },
  seed_tom_and_jerry_s: {
    d: '悠閒自在的酒吧，調酒之外還有豐富的精釀啤酒單，吸引不少科技圈客人。',
  },
  seed_radegast_hall_biergarten: {
    d: '寬敞熱鬧的啤酒大廳，有啤酒、炸肉排和定期的現場音樂。',
  },
  seed_dorrian_s_red_hand_nyc: {
    d: '以社交場面聞名的社區老店，供應調酒和標準酒吧菜。',
  },
  seed_carousel: {
    d: '獨一無二的旋轉木馬，坐的是巨大的虹彩玻璃纖維魚，還有海底風格的燈光效果。',
  },
  seed_the_happiest_hour: {
    d: '有馬蹄形吧台的雞尾酒廊，用餐區帶 tiki 風，樓下還有爵士味十足的私密空間。',
  },
  seed_the_seville: {
    d: '時髦有活力的聚會場所，絨布沙發風裝潢，供應調酒、小盤菜，還有現場音樂和 DJ。',
  },
  seed_bethesda_terrace: {
    d: '湖畔雙層露台，有大噴泉，還有象徵四季與晨昏的雕刻。',
  },
  seed_charging_bull: {
    d: 'Wall Street 附近三噸重的銅牛雕像，象徵紐約的金融業。',
  },
  seed_broadway_theatre: {
    d: '1924 年啟用的百老匯劇院，1,761 個座位，以上演大型音樂劇聞名。',
  },
  seed_little_island: {
    d: '造型搶眼、立在高腳柱上的島嶼公園，有花圃和水岸圓形劇場的演出。',
  },
  seed_time_square: {
    d: '劇院區心臟地帶的熱鬧景點，以霓虹燈海、購物和百老匯演出聞名。',
  },
  seed_chavelas_ch: {
    d: '明亮熱鬧的墨西哥餐廳，以 enchiladas 和爆滿的週末早午餐聞名。',
  },
  seed_cornbread_ch: {
    d: '南方靈魂料理 — 炸雞、焗烤起司通心粉和玉米麵包。',
  },
  seed_friends_and_lovers_ch: {
    d: '酒吧兼音樂展演空間，有 DJ 之夜、現場演出，還能跳舞。',
  },
  seed_franklin_park_ch: {
    d: '寬敞的啤酒花園，也是人氣每月朗讀會的老牌主場。',
  },
  seed_bar_bayeux_ch: {
    d: '小巧親密的葡萄酒吧，每晚都有現場爵士。',
  },
  seed_king_tai_ch: {
    d: '輕鬆自在的社區酒吧，調酒、啤酒都有，還有後院露台。',
  },
  seed_kissa_kissa_ch: {
    d: '調酒吧，後院露台寬敞、滿滿綠意。',
  },
  seed_little_zelda_ch: {
    d: 'Franklin Ave 上迷你卻深受喜愛的咖啡店，賣 espresso 和自家做的點心。',
  },
  seed_cafe_con_libros_ch: {
    d: '女性主義書店兼咖啡吧，飲品用公平貿易原料。',
  },
  seed_hibiscus_brew_ch: {
    d: '女性經營、帶加勒比海風味的咖啡店，以繽紛的拿鐵和巴西莓果碗聞名。',
  },
  seed_lincoln_station_ch: {
    d: 'Brooklyn Museum 附近的咖啡店兼餐館，用的是 La Colombe 的咖啡。',
  },
  seed_most_high_ch: {
    d: '溫馨的精品 espresso 吧，有蜂蜜奶油系的創意咖啡。',
  },
  seed_chocolatte_espresso_bar_ch: {
    d: 'Jewish Children\'s Museum 裡的 24 小時 kosher 以色列 espresso 吧。',
  },
  seed_weeksville_heritage_ch: {
    d: '博物館與歷史建築群，保存的 Weeksville 是南北戰爭前美國最大的自由黑人社區之一。',
  },
  seed_gage_tollner_dtbk: {
    d: '列入古蹟的 19 世紀牛排館，修復後重新開幕 — Brooklyn 的華麗老飯廳。',
  },
  seed_french_louie_dtbk: {
    d: 'Boerum Hill 與 Downtown 交界的鄉村風法式小酒館，有後院露台。',
  },
  seed_mile_end_delicatessen_dtbk: {
    d: 'Montreal 式猶太熟食店 — 煙燻肉、poutine 和貝果。',
  },
  seed_sottocasa_pizzeria_dtbk: {
    d: 'Atlantic Ave 上的拿坡里柴燒披薩。',
  },
  seed_bacchus_bistro_dtbk: {
    d: '輕鬆的法式小酒館，有花園，離 BAM 幾步路。',
  },
  seed_ki_sushi_dtbk: {
    d: 'Smith St 上穩定可靠的社區壽司店。',
  },
  seed_rucola_dtbk: {
    d: '帶農舍氛圍的北義大利小館。',
  },
  seed_grand_army_dtbk: {
    d: '調酒與生蠔吧，happy hour 深受喜愛。',
  },
  seed_sunken_harbor_club_dtbk: {
    d: 'Gage & Tollner 樓上的航海風 tiki 調酒吧。',
  },
  seed_clover_club_dtbk: {
    d: '得過獎的經典調酒吧，帶維多利亞風情。',
  },
  seed_the_brooklyn_inn_dtbk: {
    d: '19 世紀傳下來的歷史社區酒吧，吧台後方是整面雕花木牆。',
  },
  seed_devoci_n_downtown_brooklyn_dtbk: {
    d: '天光灑落的烘豆咖啡店，有室內花園，哥倫比亞莊園直送的新鮮咖啡。',
  },
  seed_white_noise_coffee_dtbk: {
    d: '自家烘焙的手工咖啡店，座位多、有 Wi-Fi。',
  },
  seed_absolute_coffee_dtbk: {
    d: 'Boerum Hill 溫馨、適合工作的社區咖啡店。',
  },
  seed_one_girl_cookies_dtbk: {
    d: '迷人的烘焙咖啡店，以 whoopie pie 和餅乾聞名。',
  },
  seed_konditori_dtbk: {
    d: '瑞典式 espresso 吧，適合快速來一杯濃的。',
  },
  seed_brooklyn_academy_of_music_dtbk: {
    d: '150 年歷史的表演藝術重鎮 — 歌劇、舞蹈、戲劇、音樂和電影都有。',
  },
  seed_bam_harvey_theater_dtbk: {
    d: 'BAM 的第二舞台，開在修復過的 1904 年劇院裡，氣氛獨特。',
  },
  seed_brooklyn_paramount_dtbk: {
    d: '華麗的 1920 年代劇院，2024 年重新開幕成為演唱會場地。',
  },
  seed_bric_house_dtbk: {
    d: '免費演出、藝廊，也是 Celebrate Brooklyn 的大本營。',
  },
  seed_theatre_for_a_new_audience_dtbk: {
    d: '在 Polonsky Shakespeare Center 上演莎士比亞和經典戲劇。',
  },
  seed_mark_morris_dance_center_dtbk: {
    d: 'Mark Morris Dance Group 的演出和舞蹈課程。',
  },
  seed_roulette_dtbk: {
    d: '400 席的表演廳，專演實驗與前衛音樂。',
  },
  seed_new_york_transit_museum_dtbk: {
    d: '1936 年的地鐵站裡展示老地鐵車廂 — 全美最大的交通博物館。',
  },
  seed_mocada_dtbk: {
    d: '當代非裔離散藝術博物館，現在落腳於 L10 文化中心。',
  },
  seed_center_for_brooklyn_history_dtbk: {
    d: 'Brooklyn 的檔案館與博物館，位在 1881 年的古蹟建築裡。',
  },
  seed_urbanglass_dtbk: {
    d: '玻璃吹製工作室，還有免費參觀的當代玻璃藝術藝廊。',
  },
  seed_the_invisible_dog_art_center_dtbk: {
    d: '舊工廠改建的三層樓藝廊與藝術家工作室。',
  },
  seed_cadman_plaza_park_dtbk: {
    d: '綠樹成蔭的帶狀公園，有農夫市集，介於 Downtown 和 Brooklyn Heights 之間。',
  },
  seed_metrotech_commons_dtbk: {
    d: '綠意造景的公共廣場，公共藝術作品定期更換。',
  },
  seed_willoughby_square_park_dtbk: {
    d: 'Downtown Brooklyn 最新的公園，就蓋在公共停車場上方。',
  },
  seed_building_92_dtbk: {
    d: '訴說 Brooklyn Navy Yard 故事的遊客暨展覽中心，從 1801 年一路講到今日的創新基地。',
  },
  seed_brooklyn_war_memorial_dtbk: {
    d: 'Cadman Plaza Park 裡的地標級二戰紀念碑，巨大的石灰岩雕像向 Brooklyn 的退伍軍人致敬。',
  },
  seed_gair_dumbo: {
    d: 'DUMBO 首屈一指的調酒去處，就開在最多人拍照的那個轉角。',
  },
  seed_kinjo_dumbo: {
    d: '工業時髦風酒吧，前身是魚雷工廠，供應亞洲風味調酒。',
  },
  seed_nobody_told_me_dumbo: {
    d: '明亮的轉角小店，創意調酒加上寬敞的戶外座位。',
  },
  seed_randolph_beer_dumbo_dumbo: {
    d: '自助啤酒牆，還有滾球機和沙狐球可以玩。',
  },
  seed_olympia_wine_bar_dumbo: {
    d: '精緻卻不拘謹的葡萄酒吧，供應 tapas 和小盤料理。',
  },
  seed_harriet_s_rooftop_dumbo: {
    d: '1 Hotel 頂樓的屋頂酒吧，全年開放，天際線一覽無遺。',
  },
  seed_arabica_dumbo: {
    d: '來自京都的名店，落地窗正對大橋，自家烘焙的單品豆。',
  },
  seed_brooklyn_roasting_company_dumbo: {
    d: 'DUMBO 烘豆咖啡館的先驅，開在挑高的工業空間裡。',
  },
  seed_bluestone_lane_dumbo: {
    d: 'Empire Stores 裡的澳式咖啡館，flat white 加上完整的早午餐菜單。',
  },
  seed_almondine_bakery_dumbo: {
    d: '法式烘焙坊，正統糕點配 espresso。',
  },
  seed_joe_coffee_dumbo: {
    d: '紐約在地咖啡小連鎖的寬敞分店，遠端工作者的據點。',
  },
  seed_butler_dumbo: {
    d: '來自 Williamsburg，米其林班底的糕點加 espresso。',
  },
  seed_fontainhas_dumbo: {
    d: '印度精品咖啡店，供應 filter kaapi 和單品 espresso。',
  },
  seed_st_ann_s_warehouse_dumbo: {
    d: '改建自 Tobacco Warehouse 的場地，戲劇和音樂演出都排得很大膽。',
  },
  seed_bargemusic_dumbo: {
    d: '水岸邊的世界級室內樂，持續演出將近 50 年。',
  },
  seed_brooklyn_bridge_park_dumbo: {
    d: '85 英畝的水岸公園，有碼頭、草坪，還有無可比擬的 Manhattan 景色。',
  },
  seed_empire_fulton_ferry_dumbo: {
    d: '兩座大橋下的河畔草坪，Jane\'s Carousel 就在這裡。',
  },
  seed_main_street_park_dumbo: {
    d: 'Brooklyn Bridge Park 的 DUMBO 段，有遊樂場和一片鵝卵石小海灘。',
  },
  seed_pearl_street_triangle_dumbo: {
    d: 'Manhattan Bridge 橋下的鵝卵石行人廣場。',
  },
  seed_john_street_park_dumbo: {
    d: 'Brooklyn Bridge Park 較安靜的水岸段，有一片潮汐鹽沼。',
  },
  seed_jane_s_carousel_dumbo: {
    d: '修復重生的 1922 年旋轉木馬，裝在 Jean Nouvel 設計的玻璃亭裡，就在 Brooklyn Bridge 正下方。',
  },
  seed_squibb_park_bridge_dumbo: {
    d: '走起來會微微彈跳的木鋼行人橋，從 Brooklyn Heights 一路連到 Brooklyn Bridge Park 的 Pier 1。',
  },
  seed_sofreh_ph: {
    d: '全紐約數一數二的波斯餐廳 — 煙燻茄子、燉羊腿。',
  },
  seed_chuko_ph: {
    d: '人氣拉麵店，湯頭濃郁，小菜也不馬虎。',
  },
  seed_pasta_night_ph: {
    d: '小小的店面，新鮮現做的義大利麵，價格實在。',
  },
  seed_nin_hao_ph: {
    d: 'Washington Ave 上評價很高的新派中菜。',
  },
  seed_weather_up_ph: {
    d: '低調的精緻調酒吧，講究的冰塊加上綠意垂掛的露台。',
  },
  seed_gold_star_beer_counter_ph: {
    d: '精釀啤酒吧，酒單又深又常輪替。',
  },
  seed_sharlene_s_ph: {
    d: '輕鬆自在的酒吧，調酒便宜又好喝，還有後院。',
  },
  seed_the_commissioner_ph: {
    d: '小巧溫馨的調酒吧兼生蠔店。',
  },
  seed_bearded_lady_ph: {
    d: '有調酒，也有撞球桌和便宜的美國啤酒。',
  },
  seed_hungry_ghost_coffee_ph: {
    d: '寬敞明亮的咖啡館，座位很多。',
  },
  seed_sit_wonder_ph: {
    d: '有個可愛小後院的咖啡館，很適合帶筆電來工作。',
  },
  seed_radio_bakery_ph: {
    d: '備受讚譽的烘焙坊（連紐約時報都排過名），糕點和咖啡都值得。',
  },
  seed_caffe_de_martini_ph: {
    d: '來自 Turin 家族的道地義大利咖啡與巧克力店。',
  },
  seed_brooklyn_high_low_ph: {
    d: '紐約最棒的茶館之一，也供應咖啡。',
  },
  seed_milk_bar_ph: {
    d: '早上想快速來杯咖啡配點心的首選。',
  },
  seed_brooklyn_botanic_garden_ph: {
    d: '52 英畝的植物園，有櫻花大道、溫室和日式庭園。',
  },
  seed_brooklyn_public_library_ph: {
    d: 'Grand Army Plaza 旁的地標級 Art Deco 總圖書館。',
  },
  seed_prospect_park_zoo_ph: {
    d: '小而美的 WCS 動物園，有海獅、小貓熊和一座穀倉。',
  },
  seed_lefferts_historic_house_ph: {
    d: 'Prospect Park 裡修復的 18 世紀荷蘭農舍博物館。',
  },
  seed_prospect_park_ph: {
    d: '526 英畝的 Olmsted 與 Vaux 傑作 — Long Meadow、the Ravine，還有那座湖。',
  },
  seed_grand_army_plaza_ph: {
    d: '氣勢十足的廣場，有 Soldiers\' and Sailors\' Arch，週六還有農夫市集。',
  },
  seed_mount_prospect_park_ph: {
    d: '夾在圖書館和植物園之間的小山丘公園。',
  },
  seed_al_di_la_trattoria_ps: {
    d: '北義老字號，從 1998 年就在餵飽這個街區。',
  },
  seed_fonda_ps: {
    d: '新派墨西哥菜，margarita 調得很有力。',
  },
  seed_ginger_s_bar_ps: {
    d: '全美僅存的女同志酒吧之一，後院深受喜愛。',
  },
  seed_greenwood_park_ps: {
    d: '超大啤酒花園，有滾球場、60 個酒頭和冰沙調酒。',
  },
  seed_brookvin_ps: {
    d: '低調的葡萄酒吧，附一個後花園。',
  },
  seed_logan_s_run_ps: {
    d: '街坊小店，介於 dive bar 和調酒吧之間。',
  },
  seed_union_hall_ps: {
    d: '有滾球場的酒吧，地下室還有現場音樂表演空間。',
  },
  seed_sea_witch_ps: {
    d: '航海主題酒吧，有魚缸和一個大後院。',
  },
  seed_southside_coffee_ps: {
    d: '溫馨的街坊自家烘焙咖啡館。',
  },
  seed_old_stone_house_ps: {
    d: '重建的 1699 年荷蘭農舍，也是 Battle of Brooklyn 博物館。',
  },
  seed_brooklyn_conservatory_of_music_ps: {
    d: '社區音樂學校，常有音樂會和演奏會。',
  },
  seed_j_j_byrne_playground_ps: {
    d: '圍繞著 Old Stone House 的 Washington Park 綠地和遊樂場。',
  },
  seed_bartel_pritchard_square_ps: {
    d: 'Park Slope 通往 Prospect Park 的石柱大門。',
  },
  seed_the_bell_house_ps: {
    d: '1920 年代倉庫改建的雙廳表演場地 — 演唱會、喜劇，還有益智問答之夜。',
  },
  seed_zerospace_ps: {
    d: '沉浸式藝術中心，數位世界和互動裝置橫跨四個工作室。',
  },
  seed_t_rst_gp: {
    d: '松木內裝的丹麥設計啤酒吧 — 21 個酒頭加上約 100 款瓶罐裝。',
  },
  seed_the_esters_gp: {
    d: '綠意滿滿的露台酒吧，調酒扎實，還有 Detroit 式 pizza。',
  },
  seed_bar_americano_gp: {
    d: '靈感來自西班牙和北義的開胃酒吧 — 香艾酒配肉腸拼盤。',
  },
  seed_goldie_s_gp: {
    d: '復古 Vegas 風的 dive bar，主打啤酒配 shot，還有免費的 Goldfish 小餅乾。',
  },
  seed_the_hidden_pearl_gp: {
    d: '藏在拉麵店 Wanpaku 後面的日式風格調酒吧。',
  },
  seed_sonny_s_corner_bar_gp: {
    d: '熱鬧的轉角酒吧，開在昔日 Pencil Factory 的空間裡。',
  },
  seed_cafe_grumpy_gp: {
    d: '這個品牌 2005 年開的明亮創始店，烘豆廠就在隔壁。',
  },
  seed_peter_pan_donut_pastry_shop_gp: {
    d: 'Greenpoint 的老字號象徵，經典甜甜圈，清晨 4 點半就開門。',
  },
  seed_sweetleaf_gp: {
    d: '近水岸的溫馨烘豆咖啡館，用自家 espresso。',
  },
  seed_pueblo_querido_coffee_roasters_gp: {
    d: '哥倫比亞背景的烘豆商，供應自家烘的單品豆。',
  },
  seed_champion_coffee_gp: {
    d: 'Manhattan Ave 北端經營多年的街坊咖啡吧。',
  },
  seed_warsaw_gp: {
    d: 'Polish National Home 裡容納千人的歷史演出廳 — 龐克、嘻哈、搖滾，還有波蘭餃子。',
  },
  seed_newtown_creek_nature_walk_gp: {
    d: 'George Trakas 設計的四分之一英里公共水岸步道，沿著 Newtown Creek，就在 Digester Eggs 旁邊。',
  },
  seed_wnyc_transmitter_park_gp: {
    d: '建在昔日 WNYC 電台發射站舊址的 Greenpoint 水岸公園，有碼頭和 Manhattan 景色。',
  },
  seed_hartley_s_ch2: {
    d: '不起眼的愛爾蘭酒吧，卻倒得出全街區最好的一杯 Guinness。',
  },
  seed_skytown_ch2: {
    d: '氣氛輕鬆的調酒吧，有後院露台。',
  },
  seed_sisters_ch2: {
    d: '餐廳兼酒吧，有 DJ 和現場音樂之夜。',
  },
  seed_sweetbee_ch2: {
    d: '極簡風咖啡館，用 Variety 的豆子、Baltazar 的糕點，後院很讚。',
  },
  seed_primrose_cafe_ch2: {
    d: '藏在 brownstone 門前階梯下的溫馨咖啡館，用 Sweetleaf 的豆子。',
  },
  seed_calyer_ch2: {
    d: '漂亮的小餐館兼咖啡店，供應濃郁的 Partners Coffee。',
  },
  seed_burly_coffee_ch2: {
    d: '街坊評價最高的 espresso 吧。',
  },
  seed_the_good_batch_ch2: {
    d: '以鬆餅、荷蘭焦糖煎餅和咖啡出名的烘焙咖啡店。',
  },
  seed_pratt_institute_sculpture_park_ch2: {
    d: '25 英畝的校園公園裡散落著 70 多件雕塑 — 全美數一數二的大學藝術收藏。',
  },
  seed_underwood_park_ch2: {
    d: '綠意盎然的社區公園，有遊樂場和狗狗放風區。',
  },
  seed_putnam_triangle_plaza_ch2: {
    d: '行人廣場，有座位可以歇腳，每週還有農夫市集。',
  },
  seed_sugar_monk_hl: {
    d: '氣氛放鬆的調酒酒吧，在滿是藝術品的空間裡端出創意調酒。',
  },
  seed_the_honey_well_hl: {
    d: 'Hamilton Heights 的昏暗調酒小窩，帶著 70 年代家庭娛樂室的溫暖 — 精緻調酒卻不收下城的價格。',
  },
  seed_harlem_public_hl: {
    d: '溫馨小酒館，生啤選擇多到誇張，烈酒和調酒也一應俱全。',
  },
  seed_angel_of_harlem_hl: {
    d: '寬敞又有個性的店，大卡座、中央吧台加露台，主打加勒比海料理和調酒。',
  },
  seed_the_chipped_cup_hl: {
    d: '溫馨咖啡館，在復古又時髦的空間裡供應義式咖啡和輕食，還有花園座位。',
  },
  seed_double_dutch_espresso_hl: {
    d: '磚牆配復古燈飾的迷人咖啡館，有糕點、Wi-Fi 和後院露台。',
  },
  seed_the_dead_poet_uws: {
    d: '狹長的文學主題愛爾蘭酒吧，調酒都以已故詩人命名，也有酒吧小食。',
  },
  seed_george_keeley_uws: {
    d: '標準的社區酒吧 — 酒吧小食、飛鏢、超長的精釀啤酒單，還有啤酒俱樂部。',
  },
  seed_prohibition_uws: {
    d: '爵士年代風格的晚餐俱樂部，調酒單很長，每晚都有現場音樂表演。',
  },
  seed_the_owl_s_tail_uws: {
    d: '帶著溫馨復古氣氛的熱門小店，主打創意調酒和世界風味小盤菜。',
  },
  seed_dublin_house_uws: {
    d: '1933 年開業的 Upper West Side 老酒吧 — 油氈地板、木牆板，還有那塊老派霓虹燈招牌。',
  },
  seed_blue_bottle_coffee_uws: {
    d: '時髦的連鎖咖啡店，供應精品咖啡和糕點，也賣咖啡豆和沖煮器材。',
  },
  seed_daily_provisions_uws: {
    d: '輕鬆自在的咖啡館，有咖啡、早餐和烘焙點心，也供應三明治和家庭式晚餐。',
  },
  seed_irving_farm_coffee_roasters_uws: {
    d: '時髦的在地連鎖咖啡館，用自家烘焙的豆子做咖啡，也有輕食。',
  },
  seed_sote_coffee_uws: {
    d: 'Amsterdam Avenue 上的 Upper West Side 咖啡補給站 — 在中央公園和自然史博物館人潮之間，來一杯扎實的義式咖啡。',
  },
  seed_bemelmans_bar_ues: {
    d: 'Carlyle Hotel 裡優雅的鋼琴酒吧，牆上是 Ludwig Bemelmans 著名的壁畫。',
  },
  seed_the_penrose_ues: {
    d: '老派調酒配上豐富的啤酒和威士忌酒單，環繞在回收木材和復古壁紙之間。',
  },
  seed_auction_house_ues: {
    d: '華麗的裝潢加上昏暗燈光，讓這間私密酒廊成為約會好去處。',
  },
  seed_caledonia_bar_ues: {
    d: '狹長溫暖的蘇格蘭酒吧，威士忌選擇多、有生啤，酒吧小食也做得講究。',
  },
  seed_oslo_coffee_roasters_ues: {
    d: '溫馨小店，用自家烘焙的豆子做義式咖啡、冷萃等各種飲品。',
  },
  seed_ralph_s_coffee_ues: {
    d: '開在店內的優雅復古咖啡座，供應有機咖啡、烘焙點心和輕早餐。',
  },
  seed_birch_coffee_ues: {
    d: '在地連鎖咖啡館，自家烘焙、用心選豆，店裡時髦又熱鬧。',
  },
  seed_787_coffee_ues: {
    d: '波多黎各小型連鎖咖啡店，豆子來自自家農場 — 濃烈的義式咖啡和 coquito 拿鐵，是 UES 常客的心頭好。',
  },
  seed_cafe_bleriot_ues: {
    d: '在溫馨老派的空間裡喝咖啡配糕點，有壁紙和優雅的吊燈。',
  },
  seed_ophelia_me: {
    d: 'Beekman Tower 的頂樓酒廊，舒服的絨面卡座、調酒，還有 East River 景色。',
  },
  seed_monkey_bar_me: {
    d: '復古壁畫加華麗傢俱的高檔美式餐廳，客人非富即貴。',
  },
  seed_king_cole_bar_me: {
    d: '氣派的歷史飯店酒吧，在著名的 Maxfield Parrish 壁畫下喝經典調酒。',
  },
  seed_the_polo_bar_me: {
    d: '設計師 Ralph Lauren 開的帥氣美式餐廳，供應經典菜色、酒吧小食和飲品。',
  },
  seed_seed_library_me: {
    d: 'Ryan Chetiyawardana 開在 Ace Hotel 地下室的調酒吧 — 燈光昏暗，用意想不到的食材做極簡「lo-fi」調酒。',
  },
  seed_valerie_me: {
    d: '精緻美式料理配調酒，空間走復古風，有黃銅和磁磚細節。',
  },
  seed_gregorys_coffee_me: {
    d: '俐落連鎖咖啡店的分店，供應自家烘焙咖啡、免費 WiFi 和輕食。',
  },
  seed_joe_coffee_me: {
    d: '供應公平貿易咖啡、烘焙點心的咖啡店，也開課程和外燴，空間現代熱鬧。',
  },
  seed_porchlight_ch: {
    d: 'Danny Meyer 開的酒吧，在漂亮的空間裡供應南方風味調酒和小食。',
  },
  seed_bathtub_gin_ch: {
    d: '地下酒吧風格的店，琴酒調酒配小盤菜。',
  },
  seed_the_tippler_ch: {
    d: '藏在 Chelsea Market 底下的氣氛酒館，有創意調酒、舊物改造的裝潢和 DJ。',
  },
  seed_bar_snack_ch: {
    d: 'East Village 的社區酒吧，店如其名 — 好喝的酒、好吃的小食，不需要什麼花俏概念。',
  },
  seed_seven_grams_caffe_ch: {
    d: '時髦極簡的空間裡供應講究的義式咖啡、甜鹹糕點和免費 Wi-Fi。',
  },
  seed_blue_bottle_coffee_ch: {
    d: '時髦的連鎖咖啡店，供應精品咖啡和糕點，也賣咖啡豆和沖煮器材。',
  },
  seed_joe_coffee_ch: {
    d: '輕鬆小連鎖的分店，咖啡師現沖一杯杯熱騰騰的咖啡。',
  },
  seed_patent_pending_fg: {
    d: '藏在 Patent Coffee 暗門後的昏暗酒吧，調酒以「電」為主題。',
  },
  seed_undercote_fg: {
    d: '藏在高級餐廳底下的地下空間，有精緻調酒、香檳和叢林風裝潢。',
  },
  seed_broken_shaker_fg: {
    d: '向 Miami 本店致敬的熱帶風酒吧，有城市景觀、講究的調酒和小食。',
  },
  seed_the_flatiron_room_fg: {
    d: '帶復古氣息的高雅夜間去處，收藏超過 750 款威士忌等棕色烈酒，還有現場爵士演出。',
  },
  seed_dear_irving_fg: {
    d: '調酒沙龍，在以「時空旅行」為主題的精緻空間裡供應華麗調酒和講究小食。',
  },
  seed_birch_coffee_fg: {
    d: '在地連鎖咖啡館，自家烘焙、用心選豆，店裡時髦又熱鬧。',
  },
  seed_stumptown_coffee_roasters_fg: {
    d: '連鎖咖啡吧，供應自家烘焙的直接貿易咖啡，也賣沖煮器材和咖啡豆。',
  },
  seed_maman_fg: {
    d: '鄉村風小店配古董傢俱，供應法式和美式經典烘焙點心，還有湯品、三明治和沙拉。',
  },
  seed_by_by_hk: {
    d: 'Hell\'s Kitchen 10th Avenue 上的混合體 — 白天是咖啡館的活力，入夜變成社區調酒吧。',
  },
  seed_miss_nellie_s_hk: {
    d: 'Restaurant Row 上的劇院區調酒吧 — 開演前喝一杯，不用付觀光客稅。',
  },
  seed_monkey_thief_hk: {
    d: 'Hell\'s Kitchen 一間昏暗的小調酒室 — 有創意的酒，沒有地下酒吧那套戲劇效果。',
  },
  seed_rudy_s_bar_grill_hk: {
    d: '1933 年開業的社區老店，以毫不做作的氣氛和免費熱狗聞名。',
  },
  seed_bar_blondeau_wb: {
    d: '時髦的法式調酒吧，菜單以海鮮為主，還有一整片 Manhattan 天際線美景。',
  },
  seed_donna_wb: {
    d: '別緻的餐廳酒吧，供應泛拉丁料理，調酒、葡萄酒和啤酒都有。',
  },
  seed_sunny_s_bar_lb: {
    d: 'Red Hook 百年歷史的水岸老酒館 — 滿屋子小玩意、親民的現金價，還有全 Brooklyn 最溫暖的藍草音樂即興演出。',
    t: '挑藍草音樂之夜去 — 樂手們在後面的房間圍成一圈，功夫夠好的人都能加入。',
  },
  seed_threes_brewing_lb: {
    d: '自家釀酒廠直供的生啤酒吧，也有其他精釀，食物則由快閃餐飲輪番進駐。',
  },
  seed_black_mountain_wine_house_lb: {
    d: 'Carroll Gardens 街角一間農舍風的溫馨葡萄酒小屋 — 壁爐燒著、起司拼盤上桌，冬天 Brooklyn 最舒服的角落。',
  },
  seed_cremini_s_lb: {
    d: 'Carroll Gardens 的街角小店，薄脆披薩、義大利菜加一個像樣的吧台 — Court Street 平日晚餐的輕鬆解答。',
  },
  seed_liz_s_book_bar_lb: {
    d: 'Smith Street 上書店、咖啡館和葡萄酒吧的三合一 — 逛書、買書，再配一杯酒讀起來；Carroll Gardens 最溫馨的第三空間。',
  },
  seed_principles_gi_coffee_house_lb: {
    d: '9th Street 上的 Gowanus 咖啡館 — 社區感的義式咖啡，配上工業 Brooklyn 的骨架。',
  },
  seed_cocktail_bed_stuy_eb: {
    d: '昏暗狹長的酒吧，供應季節調酒和小廠精釀，還有露台座位。',
  },
  seed_bar_lunatico_eb: {
    d: 'Bed-Stuy 由音樂人開的聚會所 — 每晚的現場演出（爵士、拉丁、西非音樂）就在你的 Negroni 旁邊上演。',
    t: '音樂大多在九點左右開始 — 早點到，空間很小，很快就被熟客坐滿。',
  },
  seed_all_night_skate_eb: {
    d: '骨子裡流著溜冰場懷舊血液的 Bed-Stuy 酒吧 — 迪斯可能量、俏皮的調酒，還有 Rockaway Avenue 的在地客。',
  },
  seed_sleepwalk_eb: {
    d: '為黑膠和深夜長談而生的 Bushwick 酒吧 — Bushwick Avenue 上的聆聽室氛圍。',
  },
  seed_little_skips_eb: {
    d: 'Bushwick 老字號的藝術青年咖啡館 — 壁畫、筆電、夠濃的咖啡，還有帶著樂團傳單氣息的三明治。',
  },
  seed_death_co_ev2: {
    d: '打著領結、吊著背帶的調酒師重現地下酒吧年代 — 昏暗迷人的調酒酒廊。',
  },
  seed_attaboy_ev2: {
    d: '在時髦的工業風空間裡，端出創新調酒和經典款。',
  },
  seed_gertie: {
    d: 'Vanderbilt 大道上陽光滿滿的全日咖啡館，做著 Brooklyn 數一數二漂亮的貝果三明治，還有霜淇淋和自然酒 — 現代猶太熟食店的能量。',
    t: '週末早午餐的隊伍十點後暴增 — 早點來，或直接在櫃檯點外帶。',
  },
  seed_black_seed_bagels: {
    d: 'Montreal 式貝果 — 更小、更甜、柴燒出爐 — 成功說服紐約：兩種貝果傳統可以共存。',
    t: '點芝麻貝果配蔥花奶油乳酪，就是這個組合。',
  },
  seed_baker_s_dozen: {
    d: 'Greenpoint 手工搓製的社區貝果店 — 老派手藝，新派客人。',
    t: '週末很快賣完，十一點前去比較保險。',
  },
  seed_b_bagels: {
    d: 'Lenox Hill 可靠的社區小店 — 正經貝果，不必特地朝聖。',
    t: '去 Central Park 繞一圈或逛 Met 之前的絕佳補給站，兩個都走路就到。',
  },
  seed_bagel_joint: {
    d: 'Greenpoint 的新秀，已有死忠粉絲 — 證明外區貝果文藝復興是真的。',
    t: '吃完散步到 Transmitter Park，隔著 East River 看曼哈頓天際線。',
  },
  seed_tompkins_square_bagels: {
    d: 'East Village 人氣店，以那份誇張又美妙的奶油乳酪清單聞名 — 從蔥花到生日蛋糕口味都有。',
    t: '至少點一次創意口味的奶油乳酪，經典款明天還會在。',
  },
  seed_best_bagel_coffee: {
    d: 'Garment District 上班族的傳奇 — 早上 8:45 的排隊人龍就是它的米其林星星。',
    t: '看起來很混亂，其實動得很快；前台付現，幾分鐘就能拿到貝果。',
  },
  seed_brooklyn_bagel_coffee_company: {
    d: '沒錯，這家「Brooklyn」開在 Chelsea — 蓬鬆的大貝果，加上陣容堅強的奶油乳酪櫃。',
    t: '離 High Line 南端只要繞兩個街區，帶上去邊走邊吃。',
  },
  seed_utopia_bagels: {
    d: '深受喜愛的 Queens 老店進駐 Manhattan — 手工搓製、水煮出爐，屢屢被封為全城最強。',
    t: '如果他們問你要不要剛出鍋還熱的，什麼都說好。',
  },
  seed_the_bronx_museum_of_the_arts: {
    d: 'Grand Concourse 上的當代美術館，聚焦 Bronx 與離散族群藝術家 — 而且永遠免費入場。',
    t: '順道走走 Grand Concourse 那段 Art Deco 建築群 — 本身就是一座露天博物館。',
  },
  seed_new_york_botanical_garden: {
    d: '250 英畝的花園和原始森林環繞著水晶宮般的 Haupt Conservatory — 玩上一整天，完全忘了自己還在紐約。',
    t: '搭配 Arthur Avenue 的午餐 — Bronx 真正的 Little Italy，十分鐘就到。',
  },
  seed_morningside_park: {
    d: 'Columbia 大學下方氣勢十足的崖壁公園 — 石階、池塘與瀑布，還有 Harlem 的屋頂風景。',
    t: '從 110th Street 進去直達池塘和瀑布 — 這座公園最精華的五分鐘。',
  },
  seed_inwood_hill_park: {
    d: 'Manhattan 僅存的原生森林和鹽沼 — 洞穴、冰河巨石和老鷹，就在島的最北端。',
    t: '去找 Shorakkopoch Rock — 傳說 Manhattan 就是在這裡用 60 荷蘭盾買下的，樹林裡藏著歷史。',
  },
  seed_fort_tryon_park: {
    d: '崖頂花園配上開闊的 Hudson River 景色 — the Cloisters 和美麗的 Heather Garden 都在這裡。',
    t: '先逛 the Cloisters，再到 Heather Garden 的露台看 Hudson River 的日落。',
  },

  // ── Planner restaurants (RESTAURANT_DATA ids — tDesc looks these up too) ──
  nan_xiang: { d: 'Flushing 最富盛名的小籠包 — 皮薄如紙，一咬爆出湯汁與豬肉鮮味。' },
  wo_hop: { d: '1938 年開業的 Mott Street 地下室廣東老店 — 凌晨兩點的叉燒撈麵，牆上掛滿五十年來的熟客照片。' },
  ny_noodletown: { d: '櫥窗掛著燒臘、鹽焗海鮮連廚師下班後都來吃 — 只收現金、態度直接、無可挑剔。' },
  xian_midtown: { d: '手工扯麵 biang biang 與孜然羊肉夾饃 — 從 Flushing 攤位征服曼哈頓，至今仍不到 $15。' },
  redfarm_hudson: { d: '充滿玩心的農場直送點心 — Pac-Man 蝦餃與煙燻牛肉蛋捲，藏身西村的木造小屋。' },
  keens: { d: '1885 年開業的牛排館，天花板掛著 45,000 支陶菸斗 — 必點傳奇羊排，不只是 porterhouse。' },
  old_homestead: { d: '1868 年起在 Meatpacking 供應牛排 — 霓虹牛招牌下的老派 porterhouse。' },
  cho_dang_gol: { d: '韓國城的豆腐專門店 — 每天現做的嫩豆腐鍋在石鍋裡滾燙上桌，遠離烤肉煙霧。' },
  burger_joint: { d: '藏在豪華飯店大廳布簾後的漢堡吧 — 塗鴉牆、現金優先、紐約最有名的秘密之一。' },
  zenkichi: { d: '隱身無名木門後的居酒屋 — 簾幕包廂與呼叫鈴，約會首選的無菜單風格日式料理。' },
  rule_of_thirds: { d: 'Greenpoint 的明亮居酒屋 — 麴發酵炸雞與季節小皿，像經過北歐轉機的東京。' },
  win_son: { d: '帶著布魯克林口音的台美料理 — 滷肉飯、蒼蠅頭、蔥油餅，排隊人潮就是證明。' },
  kings_co_imperial: { d: '有花園、自釀醬油的川菜館 — 燈籠下的擔擔麵與煙燻雞。' },
  east_harbor: { d: 'Sunset Park 的宴會廳式飲茶 — 蝦餃與蘿蔔糕的推車在十人大圓桌間穿梭，整個週末不停。' },
  lilia: { d: 'Missy Robbins 在舊修車廠裡的義大利麵殿堂 — 粉紅胡椒 mafaldini 值得每一次搶不到的訂位。' },
  al_di_la: { d: '讓 Park Slope 成為美食目的地的威尼斯家常菜 — malfatti 與燉兔肉，不花俏的好房間。' },
  lindustrie: { d: '終結「披薩只有曼哈頓」爭論的那一片 — burrata 切片讓 South 2nd 街排出人龍，每分鐘都值得。' },
  robertas: { d: '啟發無數模仿者的 Bushwick 披薩基地 — Bee Sting 辣蜂蜜披薩、tiki 後院，依然吵鬧、依然出色。' },
  emmy_squared: { d: '底特律式方形披薩、起司焦脆邊 — 還有 Le Big Matt，低調的全城最佳漢堡之一。' },
  maison_premiere: { d: '紐奧良風格的生蠔與苦艾酒吧 — 馬蹄形大理石吧台、一元生蠔的 happy hour、後方花園。' },
  sunday_in_bk: { d: '榛果楓糖布朗尼醬的麥芽鬆餅，是全區排隊的早午餐 — 晚餐也默默地很出色。' },
  buttermilk_channel: { d: 'Carroll Gardens 的街坊餐桌 — 白脫牛奶炸雞配切達鬆餅，溫暖得像星期天。' },

  // ── Coverage expansion 2026-08-19 ──
  seed_sylvias: { d: "1962 年開業的 Harlem 靈魂食物老店——炸雞、燉豬排配玉米麵包，就在 Lenox Avenue 上。", t: "週日的福音音樂早午餐最有氣氛，記得先訂位，不然要有排隊的心理準備。" },
  seed_red_rooster: { d: "名廚 Marcus Samuelsson 在 Lenox Avenue 上的熱鬧餐廳，把靈魂食物經典玩出世界各地的風味。", t: "訂位前先查一下地下室 Ginny's Supper Club 的節目表，常有現場表演。" },
  seed_amy_ruths: { d: "深受喜愛的 Harlem 家常菜餐廳，招牌炸雞鬆餅以社區傳奇人物命名。", t: "週末早午餐排隊人潮很多，平日去一樣的鬆餅完全不用等。" },
  seed_melbas: { d: "Frederick Douglass Boulevard 上溫馨的社區靈魂食物名店，招牌是炸雞配蛋酒鬆餅。", t: "店面不大，晚餐時段很快客滿，建議早點到，不然就得在小吧台等位子。" },
  seed_studio_museum_harlem: { d: "Harlem 藝術圈的核心，長期支持非裔藝術家，如今搬進 125th Street 上醒目的新館。", t: "免費入場——看完往西走幾個街區，順道經過 Apollo Theater。" },
  seed_hispanic_society: { d: "藏在 Audubon Terrace 的寶庫，有 Goya、El Greco 和 Sorolla 的巨幅 Vision of Spain 壁畫，完全避開 Museum Mile 的人潮。", t: "免費入場，外面的 Beaux-Arts 中庭本身就值得慢慢繞一圈。" },
  seed_wallach_gallery: { d: "Columbia 大學的當代藝術畫廊，位在 Renzo Piano 設計的 Lenfest Center，就在通透的 Manhattanville 校區裡。", t: "展覽免費參觀，但換展期間會閉館，出發前先查開放時間。" },
  seed_sugar_hill_museum: { d: "位在 David Adjaye 設計的雕塑感建築裡的小型兒童藝術館，結合展覽和說故事活動。", t: "帶小朋友的雨天好去處，逛完再散步看看附近 Sugar Hill 的褐石老宅街區。" },
  seed_jacobs_pickles: { d: "Amsterdam Avenue 上的療癒系餐廳，招牌是堆得超高的比司吉三明治、自家醃黃瓜和南方風早午餐。", t: "早午餐等位時間很長——先登記候位，再去 Amsterdam Avenue 逛逛等簡訊通知。" },
  seed_grays_papaya: { d: "72nd 街和 Broadway 口的 24 小時熱狗小攤，一份煎得脆脆的熱狗配木瓜飲料，就是最經典的老紐約味。", t: "站在櫃台點 Recession Special 就對了——這裡沒有座位，站著吃才是精髓。" },
  seed_folk_art_museum: { d: "免費的小巧博物館，收藏拼布被、風向標和素人藝術家作品，就在 Lincoln Center 對面。", t: "看 Lincoln Center 演出前的完美行程，45 分鐘剛剛好，而且永遠免費入場。" },
  seed_nyhistorical: { d: "紐約最古老的博物館，有 Hudson River School 風景畫、整面牆的 Tiffany 彩繪玻璃燈，特展也很精彩。", t: "直接上四樓看 Tiffany 燈具展廳——最震撼的一區，很多人反而錯過。" },
  seed_beacon_theatre: { d: "1929 年落成的金碧輝煌老戲院，如今是搖滾傳奇、脫口秀和連續駐場演出的舞台。", t: "便宜的座位視野也不錯——早點到，先好好欣賞修復後華麗的大廳。" },
  seed_the_dakota: { d: "1884 年落成、氣勢沉穩的公寓城堡，矗立在 Central Park West，永遠和 John Lennon 與老紐約傳奇連在一起。", t: "在 72nd 街轉角欣賞山牆立面就好，接著過馬路進公園走到 Strawberry Fields。" },
  seed_cmom: { d: "褐石街區裡五層樓的互動展覽，是 Upper West Side 親子家庭放電的好地方。", t: "平日下午人最少；週末常常完售，記得先上網預約時段票。" },
  seed_riverside_park: { d: "Upper West Side 沿著 Hudson River 綿延四英里的河岸公園——層層步道、花園和看日落的水岸視野。", t: "從 83rd Street 附近走下到貼著河邊的步道，是看夕陽最美的一段。" },
  seed_strawberry_fields: { d: "Central Park 裡靠近 Dakota 的一小片安靜綠地，中心是紀念 John Lennon 的黑白 Imagine 馬賽克。", t: "早上十點前來，才能避開吉他手和旅行團，安靜看馬賽克。" },
  seed_teddy_roosevelt_park: { d: "環繞自然史博物館的綠蔭公園，有長椅、遛狗區，還有在老榆樹下看書的當地人。", t: "靠 Columbus Avenue 那側的 Margaret Mead Green 最安靜，野餐首選。" },
  seed_cafe_carlyle: { d: "Carlyle Hotel 裡的傳奇晚餐俱樂部，1955 年起就是小型爵士與歌廳演出的殿堂。", t: "低消不便宜——吧台座位是比較親切的入門選擇，穿正式一點絕不會突兀。" },
  seed_brandys_piano_bar: { d: "Yorkville 的迷你鋼琴酒吧，會唱歌的服務生每晚輪番獻唱音樂劇金曲和經典老歌，常客超死忠。", t: "表演大約晚上 9:30 開始——早點進場才有桌位，記得有兩杯飲料的低消。" },
  seed_american_trash: { d: "掛滿廢五金收藏的搖滾 dive bar，1993 年起就在 Upper East Side 撐起現場樂團和 jam night 的場子。", t: "平日晚上的 jam session 才是精髓——吧台結帳用現金最快。" },
  seed_jewish_museum: { d: "Museum Mile 上的法式哥德風豪宅博物館，把數百年猶太文化和大膽的現代藝術特展放在一起。", t: "週六免費入場——樓下的 Russ & Daughters 分店本身就值得安排一頓午餐。" },
  seed_mcny: { d: "Museum Mile 最北端的典雅博物館，從 Lenape 原住民時代講到今日，完整說盡紐約的故事。", t: "先看一樓的 Timescapes 影片，再逛其他展廳會更有感覺。" },
  seed_carl_schurz_park: { d: "Yorkville 的河岸祕境——綠意環繞 Gracie Mansion 的公園，還有涼風徐徐的 East River 濱水步道。", t: "黃昏時走 John Finley Walk 濱河步道，看 Hell Gate Bridge 的景色最美。" },
  seed_conservatory_water: { d: "Central Park 裡童話感十足的模型帆船池，四周環繞長椅，旁邊還有 Alice in Wonderland 雕像。", t: "天氣暖的季節可以在小亭子租遙控帆船，完全是 Stuart Little 的場景。" },
  seed_jko_reservoir: { d: "環繞 Central Park 大水域的 1.58 英里碎石步道，四面八方都是明信片等級的天際線倒影。", t: "從 90th Street 的 Engineers' Gate 進場，記得逆時針方向跑——這是跑道上的默契規則。" },
  seed_sony_hall: { d: "藏在 Paramount Hotel 地下的中型演唱會場地，前身是 1930 年代的 Diamond Horseshoe 夜總會——金碧輝煌的老骨架配上現代音響，從放克到金屬都排得進檔期。", t: "一樓是站席；樓上座位跟一般票一起賣，不想久站就早點下手。" },
  seed_town_hall: { d: "1921 年由婦女參政運動者蓋的地標音樂廳，當初的理念是「每個座位都平等」——現在排的是民謠傳奇、爵士巡演和 podcast 現場錄音。", t: "「人人平等的視野」不是口號：便宜的後排座位看起來還是意外地近。" },
  seed_morgan_library: { d: "金融大亨 Pierpont Morgan 1906 年的私人圖書館，像個珠寶盒——三層樓高的書牆、泥金手抄本，還有水準很高的素描與善本輪展。", t: "週五晚上免費入場，記得先上網搶時段票。" },
  seed_mad_museum: { d: "位在 Columbus Circle 的白色小塔樓，把工藝、設計和珠寶當正經藝術展——展品的手感和材質趣味是一般美術館少有的。", t: "不買票也能搭電梯上九樓的 Robert 餐酒館，Central Park 景色直接送你。" },
  seed_fountain_house_gallery: { d: "開在 Hell's Kitchen 街角的畫廊，2000 年起代理有精神疾病經歷的藝術家——作品是被認真收藏的，不是同情分。", t: "開幕活動免費又親切，藝術家常常就在現場，可以直接聊。" },
  seed_pier_84: { d: "Hudson River Park 裡最大的公共碼頭——有噴泉、狗狗運動場、船屋，還能正面看到隔壁 Intrepid 航空母艦的甲板。", t: "日落時走到碼頭最尾端，剩下的交給 Hudson River 就好。" },
  seed_clinton_community_garden: { d: "1978 年社區花園運動的先鋒，藏在 48 街的街廓中段——離劇院區的人潮只隔一條大道，裡面卻是玫瑰和蜂箱。", t: "前段花園白天對所有人開放；後段上鎖的部分是會員限定，別翻牆。" },
  seed_greeley_square: { d: "Macy's 南邊的三角小廣場，有小餐桌、餐車亭和免費座椅——在 Herald Square 的人潮裡想坐下喘口氣，就是這裡。", t: "直接在廣場上的 Urbanspace 小攤買午餐，邊吃邊看 Broadway 人來人往，比去搶美食街座位聰明。" },
  seed_st_peters_jazz: { d: "紐約人口中的「爵士教堂」，就藏在 Citicorp 大樓底下——週日傍晚有爵士晚禱，中午也有音樂會，堂內還有 Louise Nevelson 設計的純白小教堂。", t: "最容易入門的是週三的 Midtown Jazz at Midday：小額樂捐，就能聽一小時正規好手。" },
  seed_club_macanudo: { d: "上東區的雪茄俱樂部，皮沙發、雪茄保濕櫃，多數晚上都有現場爵士——毫不掩飾的老紐約做派。", t: "不抽菸也沒關係：挑有爵士的晚上晚點到，點杯威士忌慢慢感受就好。" },
  seed_japan_society: { d: "建築師吉村順三 1971 年的靜謐地標，就在 UN 附近——藝廊的日本藝術展是美術館等級，另有影展系列和室內竹林瀑布小庭園。", t: "電影檔期也要看一下：他們的日本電影回顧展常常默默完售。" },
  seed_society_illustrators: { d: "1901 年至今的插畫協會，開在一棟聯排屋裡——有 Rockwell 原作、漫畫特展，三樓酒吧當年就是會員邊喝邊畫的地方。", t: "晚上的現場人體速寫課有音樂又對外開放——帶素描本就好，程度不拘。" },
  seed_greenacre_park: { d: "只有 60 英尺寬的口袋公園，卻有一道 25 英尺高的瀑布，水聲大到把 Midtown 整個蓋掉——皂莢樹蔭、可移動座椅，還有一群守口如瓶的上班族。", t: "想坐瀑布旁就中午前來，午餐時段的熟客可不客氣。" },
  seed_paley_park: { d: "1967 年的「口袋公園」始祖——一整面水牆、爬滿常春藤的側牆和細鐵絲椅，離 Fifth Avenue 只有一個門面。", t: "逛完 MoMA 或第五大道走到腿軟時來重開機剛剛好，53 街上幾步就有咖啡攤。" },
  seed_dag_plaza: { d: "通往 UN 大門的林蔭廣場，邊上還有 Katharine Hepburn Garden——一半是抗議舞台，一半是街坊的綠色客廳。", t: "在地人的玩法是週三來逛農夫市集，順便散步到 East River 河濱步道。" },
  seed_tudor_city_greens: { d: "藏在 42 街上方崖頂的雙子花園，屬於 1920 年代的 Tudor City 社區——碎石小徑、長椅，離 Grand Central 兩個街口卻安靜得不可思議。", t: "跨越 42 街的 Tudor City Place 天橋是拍 Manhattanhenge 的名點，那幾天傍晚要非常早到。" },
  seed_magnolia_bleecker: { d: "1996 年開的 Bleecker Street 本店，杯子蛋糕排隊熱潮的始作俑者——但在地人排的其實是香蕉布丁，不是糖霜。", t: "跳過杯子蛋糕直接買香蕉布丁，拐到 W 11th 街找個門前台階坐著吃。" },
  seed_grounded_jane: { d: "開在 Jane Street 二十年的老咖啡館，滿屋子植物、不成套的椅子和很扎實的拿鐵——根本是 Village 的公共客廳，沒人趕你。", t: "平日下午是甜蜜時段；週末早午餐時間會塞滿筆電族和嬰兒車。" },
  seed_doughnut_plant_chelsea: { d: "Doughnut Plant 開在 Hotel Chelsea 樓下的分店——方形果醬甜甜圈和招牌焦糖布蕾口味，吧台座位可以配咖啡慢慢吃。", t: "必點焦糖布蕾小圓球 doughseed；中午前來，架上口味才齊。" },
  seed_city_winery_pier57: { d: "開在 Pier 57 裡、真的有在釀酒的音樂餐廳——創作歌手和老牌樂手在台上演出，玻璃牆後面就是陳釀中的酒桶。", t: "多數場次是對號入座，想坐前排桌就早點買票；餐點是認真的，餓著肚子來剛好。" },
  seed_racket_nyc: { d: "Highline Ballroom 原址重生的 650 人搖滾場地——獨立樂團巡演和舞曲之夜，離 Chelsea Market 一個街口。", t: "全站席而且地板是平的；身高沒有 180 的話，開門時間就到吧。" },
  seed_white_columns: { d: "紐約最老的另類藝術空間，1970 年創立——至今仍是許多沒有畫廊代理的藝術家第一次正式在紐約亮相的地方。", t: "展覽換得很快而且免費；沿著 Horatio Street 往河邊走時順路彎進來就對了。" },
  seed_westbeth_gallery: { d: "Westbeth Artists Housing 裡的藝廊——這棟前 Bell Labs 廠房在 1970 年變成全美第一個大型藝術家社區，展的多半是住戶藝術家的作品。", t: "大廳和中庭也值得逛，這棟樓的工業骨架本身就是半個展覽。" },
  seed_days_end: { d: "藝術家 David Hammons 的永久裝置：用細鋼構「描」出 1975 年 Gordon Matta-Clark 切開的碼頭倉庫輪廓，像一座可以看夕陽穿過的幽靈建築。", t: "傍晚光線低的時候從 Gansevoort Peninsula 岸邊看，鋼構的線條映著 Hudson River 最清楚。" },
  seed_aids_memorial: { d: "立在 St. Vincent's Triangle 的白色鋼構頂棚，對面就是當年愛滋疫情風暴中心的醫院舊址——腳下花崗岩刻著 Walt Whitman 的詩句，一圈圈旋開。", t: "站到地面圖紋的圓心，順著 Jenny Holzer 設計的文字往外讀——這件作品本來就是要用走的。" },
  seed_hotel_chelsea: { d: "1884 年的紅磚傳奇旅館，Dylan Thomas、Patti Smith、Leonard Cohen 都住過、寫過——如今整修一新，鑄鐵陽台和那些傳說還在。", t: "先讀大門兩側的銅牌，大廳開放時再進去看樓梯間的藝術收藏。" },
  seed_gansevoort_peninsula: { d: "Manhattan 唯一的公共沙灘——2023 年新加入 Hudson River Park 的半島，有鹽沼、球場，還能第一排欣賞 Little Island。", t: "不能下水，但夕陽時分脫了鞋踩沙沒人會管你。" },
  seed_pier57_rooftop: { d: "Pier 57 屋頂上的免費公共草坪，像浮在 Hudson River 上——背後是天際線，正前方就是 Little Island 和港灣。", t: "從 Market 57 美食街旁搭電梯上樓，日落前一小時先佔好草皮——這是這一帶最棒的免費演出。" },
  seed_abingdon_square: { d: "1831 年就有的迷你三角公園，卡在 Hudson Street 轉彎處——花圃、一戰 Doughboy 銅像，還有一排像從小鎮借來的長椅。", t: "週六的農夫市集規模小但品質好，想買到好麵包要早點來。" },
  seed_gramercy_theatre: { d: "23rd Street 上由老電影院改成的搖滾場地，約六百人的規模，離舞台近到幾乎能碰到樂團，票價便宜到可以賭一把暖場團。", t: "不想在前排人擠人的話，後方架高的座位區視野好，還能安心喝啤酒。" },
  seed_paddy_reillys: { d: "Second Avenue 上的老牌愛爾蘭音樂酒吧，Black 47 就是從這裡起家的——小提琴和愛爾蘭鼓的即興演奏配上生啤 Guinness，完全不裝模作樣。", t: "挑有 session 的晚上去，坐在樂手角落附近，傳統樂手會陸續加入，氣氛越晚越熱。" },
  seed_jazz_gallery: { d: "藏在 Broadway 樓上五樓的非營利爵士空間，是爵士樂新聲音的實驗場——Vijay Iyer、Roy Hargrove 都在這裡磨練過。", t: "每晚兩場，晚場比較放得開，平日通常現場買票就有位子。" },
  seed_baruch_pac: { d: "Baruch College 在 Lexington Avenue 的地下表演藝術中心——小型演奏廳裡有室內樂、爵士和當代音樂系列，票價非常學生友善。", t: "留意弦樂四重奏和當代音樂的節目表，票價常常比附近一杯調酒還便宜。" },
  seed_national_arts_club: { d: "Gramercy Park 旁的鍍金年代宅邸，彩繪玻璃圓頂下有對外開放的藝術展覽——這裡曾是 Tilden 的故居，如今仍以沙龍方式掛畫。", t: "展廳大多數下午免費對非會員開放，慢慢走過主樓層，記得抬頭看天花板。" },
  seed_mishkin_gallery: { d: "Baruch College 位於 Gramercy Park 附近的免費小型美術館——現代與當代藝術的展覽策劃嚴謹，遠超出空間本身的規模。", t: "開放時間跟著學校走，平日下午順路造訪最保險。" },
  seed_museum_of_sex: { d: "Fifth Avenue 上大膽直白的情慾博物館——樓上有關於性文化的正經藝術與設計展，偶爾還有充氣城堡這種玩心十足的裝置。", t: "建議晚上去，看完正好接著逛 NoMad 的酒吧，禮品店本身就值得一逛。" },
  seed_swann_galleries: { d: "1941 年營業至今的拍賣行，專精紙上作品——拍賣前的免費預展就像一座輪展的博物館，滿是珍稀海報、版畫與攝影。", t: "每場拍賣前的預展任何人都能進場，翻翻圖錄也沒人期待你舉牌。" },
  seed_momath: { d: "MoMath 把數學變成可以動手玩的東西——騎方形輪子的三輪車、穿過雷射迷宮，就在 Madison Square Park 對面。", t: "平日早上多是校外教學團，大人想安靜玩的話挑傍晚去。" },
  seed_appellate_courthouse: { d: "俯瞰 Madison Square 的布雜藝術風格法院，屋頂立著一整排大理石立法者雕像——是紐約最華麗、至今仍在運作的法庭之一。", t: "沒有開庭時通常可以入內參觀彩繪玻璃與壁畫，過安檢時客氣一點就行。" },
  seed_madison_square_park: { d: "Flatiron Building 的前院——有輪替的公共藝術裝置、超熱鬧的狗狗運動區，還有梧桐樹下的第一家 Shake Shack。", t: "從 23rd Street 和 Broadway 的入口進來，趕在午餐人潮前拍下 Flatiron 的明信片角度。" },
  seed_union_square_park: { d: "紐約的城市廣場——下棋的高手、南側階梯上的滑板客，西南角花園裡還藏著一座甘地雕像。", t: "沒有農夫市集的日子北側廣場最清靜，想看人來人往就坐南側階梯。" },
  seed_gramercy_park: { d: "曼哈頓最有名的上鎖花園——只有持鑰匙的住戶能進去，但鑄鐵圍欄、瓦斯燈和連排老宅讓繞園一圈本身就是重點。", t: "黃昏瓦斯燈亮起時繞著圍欄走一圈，再看看南側 The Players 和 National Arts Club 的立面。" },
  seed_asser_levy: { d: "東河邊由 1908 年公共澡堂改建的地標休閒中心——羅馬復興式柱廊、夏季戶外泳池，遊樂場人潮也不多。", t: "夏天戶外泳池免費開放，記得自備鎖頭放置物櫃，一開門就到最不用排隊。" },
  seed_cafe_wha: { d: "MacDougal Street 的地下室，Dylan 和 Hendrix 都從這裡起步——如今是駐店樂團的狂歡現場，從放克到 Zeppelin 什麼都演。", t: "先上網訂位、點到低消就好——駐店樂團的第二輪演出才是全場最嗨的時刻。" },
  seed_bitter_end: { d: "紐約最老的搖滾俱樂部，1961 年起就在 Bleecker Street 營業——舞台後那面磚牆見證過 Neil Diamond 到 Lady Gaga。", t: "入場費便宜、一晚好幾組表演——建議待到最後，十一點那組沒沒無聞的樂團往往才是驚喜。" },
  seed_drawing_center: { d: "SoHo 碩果僅存的非營利美術館——鑄鐵建築裡明亮的展場只專注於「素描」這件事，從大師到你會搶著說自己最早發現的新銳。", t: "有自由捐款時段，順路排進 Wooster Street 的畫廊散步路線剛剛好。" },
  seed_leslie_lohman: { d: "全球第一間以 LGBTQ+ 藝術為主題的博物館，就開在 Wooster Street 的街面——展覽犀利又扎實，館藏累積了數十年。", t: "免費入場——和對街的 The Drawing Center 一起看，一條街就是一趟迷你博物館行程。" },
  seed_judd_foundation: { d: "Donald Judd 位於 101 Spring Street 的鑄鐵宅邸，完整保留他生前的樣子——五層樓的 Judd、Flavin 和 Oldenburg，就照藝術家當年的生活方式陳設。", t: "只能跟小型導覽參觀——提早幾週上網預約，現場排隊幾乎進不去。" },
  seed_earth_room: { d: "Walter De Maria 1977 年的作品：一整層 SoHo 閣樓填滿 28 萬磅濕潤的黑土——由 Dia 基金會維護，就藏在 Wooster Street 樓上。", t: "免費參觀但夏季閉館——按 2B 的門鈴上樓，深吸一口氣；館內禁止拍照，而這正是重點。" },
  seed_father_demo_square: { d: "Village 裡的三角小廣場，有噴泉、鴿子，還能正面欣賞 Our Lady of Pompeii 教堂的鐘塔——吃披薩看路人的經典據點。", t: "去 Carmine Street 的 Joe's 買一片披薩，再回來佔一張噴泉旁的長椅。" },
  seed_jj_walker_park: { d: "Hudson Street 旁的球場公園，正對 St. Luke's Place 一排點著街燈的褐石老宅——在地人的滾球、少棒和一圈樹蔭長椅。", t: "逛完沿 St. Luke's Place 走一段——前市長 Jimmy Walker 的故居門前還立著市長專屬的路燈。" },
  seed_st_lukes_garden: { d: "藏在 Hudson Street 旁、佔地兩英畝的教堂花園——1822 年小教堂後方有磚砌小徑、玫瑰與蝴蝶，找得到門的人都能進去。", t: "從教堂南側 Hudson Street 上的小門進入，最裡面角落的長椅最安靜。" },
  seed_petrosino_square: { d: "SoHo 與 Little Italy 交界的細長三角廣場，以對抗黑手黨殉職的警探 Petrosino 命名——有公共雕塑、長椅和 Lafayette Street 的最佳觀察位。", t: "距離 Prince Street Pizza 只有一個街口，排隊前在這裡坐著等剛剛好。" },
  seed_webster_hall: { d: "11th Street 上 1886 年的大舞廳，從無政府主義者的舞會辦到 Prince 的演出——重新開幕後成了紐約最好的中型搖滾場地之一。", t: "二樓欄杆邊是最佳位置：看得到整個舞台又不用擠進人群，記得在暖場結束前卡位。" },
  seed_mercury_lounge: { d: "Houston Street 上的樂團孵化器，The Strokes 和 Yeah Yeah Yeahs 早期都在這裡演出——250 人的後場至今仍搶先預訂明日之星。", t: "只要是稍微聽過名字的樂團就先買預售票，這裡光靠口碑就會完售。" },
  seed_drom_nyc: { d: "Avenue A 的世界音樂地下場——巴爾幹銅管、土耳其迷幻、拉丁爵士和 klezmer 輪番上陣，整個空間就是為跳舞而生。", t: "留意巴爾幹和土耳其之夜的檔期；桌位保留給用餐客人，想坐就先訂位。" },
  seed_swiss_institute: { d: "St. Marks Place 上免費的當代藝術館——四層樓的國際級展覽，頂樓還有一座小小的屋頂花園。", t: "永遠免費——記得一路走樓梯到頂，屋頂的裝置作品很容易錯過。" },
  seed_ukrainian_museum: { d: "烏克蘭以外規模最大的烏克蘭博物館，就扎根在東村的 Little Ukraine——有民俗織品、彩繪復活節蛋，還有 Archipenko 等現代主義藝術家。", t: "復活節前去可以看到 pysanka 彩蛋特展，看完再走兩個街口去 Veselka 吃波蘭餃。" },
  seed_karma_gallery: { d: "散布在 East 2nd Street 幾個街面空間的重量級畫廊——繪畫展覽有美術館等級，還附設紐約數一數二的藝術書店。", t: "136 E 3rd Street 的書店值得專程一逛，這裡出的展覽圖錄常常變成收藏品。" },
  seed_performance_space_ny: { d: "First Avenue 上的老校舍、前身是 PS122，1980 年起就是下城表演藝術的原點——舞蹈、劇場，還有那些還沒被命名的創作。", t: "票價刻意壓低，隨便挑一檔沒聽過的節目直接進場——這地方本來就該這樣用。" },
  seed_tompkins_square_park: { d: "東村的客廳，也是這一帶的歷史課本——硬蕊龐克日場、Hare Krishna 之樹，還有全紐約第一座狗狗運動區。", t: "週日下午有鼓陣和狗狗運動區的即興好戲，Avenue B 那側的咖啡店是最佳觀賞位。" },
  seed_6bc_garden: { d: "East 6th Street 介於 Avenue B 和 C 之間、由志工打造的植物園——有小池塘、小橋，承載四十年 Loisaida 社區園藝史。", t: "開放時間看志工排班——週末下午最有機會進去，門口會貼當週時刻表。" },
  seed_la_plaza_cultural: { d: "Alphabet City 的社區花園，垂柳環繞，圍籬上是 Rolando Politi 用回收物做的雕塑——從佔屋年代留下來的綠地，夏天還有露天演出。", t: "找找圍籬上用回收物拼成的「花」，再看看門口佈告欄的夏日電影與劇場夜檔期。" },
  seed_hamilton_fish_park: { d: "Pitt Street 上大蕭條時期建成的公園，有一座氣派的布雜藝術涼亭，還有全市最受歡迎的免費戶外泳池之一。", t: "奧運規格的泳池整個夏天免費開放——帶鎖頭和毛巾，平日早上去人最少。" },
  seed_pier17_rooftop: { d: "Seaport 碼頭屋頂的露天音樂場地——一邊是曼哈頓天際線，一邊是 Brooklyn Bridge。", t: "夏季場次很快完售，想佔到看夜景的位置就提早買票。" },
  seed_pac_nyc: { d: "World Trade Center 旁會發光的大理石方盒，劇場、音樂和舞蹈在可變形的廳裡輪番上演。", t: "傍晚路過最值得，半透明的外牆會從裡面亮起來。" },
  seed_winter_garden_brookfield: { d: "Hudson 河邊種滿棕櫚樹的玻璃中庭，Arts Brookfield 常在這裡辦免費音樂會。", t: "先查 Arts Brookfield 的節目表，大多免費，大理石階梯就是最好的座位。" },
  seed_china_institute: { d: "FiDi 裡低調卻專業的藝廊，從青銅器到水墨，展覽都是博物館等級。", t: "一年只換兩三檔展，出發前先確認檔期。" },
  seed_hall_des_lumieres: { d: "1912 年銀行大廳改造的沉浸式光影展場，投影在大理石上流動，就在 City Hall 對面。", t: "平日早上人最少，可以站在光影正中央慢慢看。" },
  seed_nmai_nyc: { d: "Bowling Green 旁舊海關大樓裡的免費 Smithsonian 博物館，圓頂壁畫下展著原住民藝術與設計。", t: "免門票，就算只有二十分鐘也值得進去看圓頂。" },
  seed_city_hall_park: { d: "夾在 City Hall 和 Woolworth Building 之間的綠地，噴泉四周都是歷史。", t: "要去 Brooklyn Bridge 人行道入口，直接從公園穿過去最順。" },
  seed_bowling_green: { d: "紐約最老的公園，1733 年就存在的小橢圓綠地，就在 Broadway 的起點。", t: "Charging Bull 前擠滿觀光客，柵欄內的長椅反而安靜。" },
  seed_zuccotti_park: { d: "Broadway 與 World Trade Center 之間的花崗岩廣場，紅色鋼雕和吃午餐的上班族是日常風景。", t: "週末幾乎沒人，是走去 9/11 Memorial 的安靜捷徑。" },
  seed_saint_vitus: { d: "Manhattan Avenue 北端的黑牆金屬樂聖地，大咖樂團常突襲加開小型場。", t: "盯緊他們的社群帳號，驚喜場次常常前一天才公布。" },
  seed_good_room: { d: "Meserole Avenue 上的迪斯可球舞池，音響一流，DJ 常放到天亮。", t: "隔壁較小的 Bad Room 常有更怪、更好的 set。" },
  seed_le_fanfare: { d: "Manhattan Avenue 上的燭光義大利小館，幾乎每晚有現場爵士，不收入場費。", t: "坐吧台離樂團最近，義大利麵菜單很短但每道都好。" },
  seed_greenpoint_gallery: { d: "McGuinness Blvd 閣樓裡的沙龍式藝廊，本地畫家的作品從地板掛到天花板。", t: "開幕夜最有趣，一半是展覽、一半是派對。" },
  seed_calico_gallery: { d: "藏在 67 West St 工作室大樓裡的藝術家自營藝廊，展的是 Greenpoint 在地創作者。", t: "開幕時整棟樓都熱鬧，順便逛逛其他樓層的工作室。" },
  seed_st_anthony_padua: { d: "1870 年代的尖塔教堂，正對 Manhattan Avenue 的視覺端點，是 Greenpoint 的明信片畫面。", t: "往南走幾個街口，站在大道正中線上拍最好看。" },
  seed_st_stanislaus_kostka: { d: "雙塔教堂是波蘭裔 Greenpoint 的心臟，Karol Wojtyła 在 1969 年、成為若望保祿二世之前曾在此主持彌撒。", t: "週日的波蘭語彌撒依然滿座，附近街區保留最多老 Greenpoint 的味道。" },
  seed_film_noir_cinema: { d: "迷你邪典電影院，專放恐怖片、黑色電影和串流平台上找不到的怪片。", t: "座位很少，先買票、早點到才搶得到沙發。" },
  seed_polish_slavic_center: { d: "老派的波蘭社區中心，自助餐廳的 pierogi 和蒔蘿湯是佛心價。", t: "拿個餐盤直接排隊，帶現金最保險，份量很大。" },
  seed_newtown_barge_park: { d: "Greenpoint 最北端整修過的河濱綠地，球場旁就是正面直視 Midtown 的天際線。", t: "在這裡的草坪看日落，比南邊 Transmitter Park 的人潮舒服多了。" },
  seed_american_playground: { d: "Franklin Street 上樹蔭剛好的小公園，是咖啡行程中間的歇腳點。", t: "到兩個街口外的 Radio Bakery 買個麵包，坐這裡的長椅吃。" },
  seed_babys_all_right: { d: "Broadway 上的小型名場面製造機，很多樂團爆紅前都先站上這個 LED 背牆舞台。", t: "週末下午場通常是最便宜的票。" },
  seed_music_hall_williamsburg: { d: "Bowery Presents 經營的 550 人場館，是那種「趁他們還沒進體育館前快去看」的經典場地。", t: "夾層欄杆邊視野最好，開門就進場卡位。" },
  seed_national_sawdust: { d: "Wythe Ave 上未來感十足的室內樂盒子，古典、歌劇和電子實驗在這裡互相碰撞。", t: "場地很小，最後一排也很近，音場會把一切補齊。" },
  seed_brooklyn_bowl: { d: "保齡球道、炸雞和正規演唱會舞台全塞在 Wythe Avenue 的同一個屋簷下。", t: "演出夜球道很搶手，想邊打球邊聽暖場就先預約。" },
  seed_wah_center: { d: "1867 年銀行建築改造的藝術中心，從 1996 年起鎮守 Williamsburg 的 Broadway 端，風格獨樹一格。", t: "開放時間不固定，專程去之前先確認。" },
  seed_city_reliquary: { d: "鞋盒大小的紐約文物博物館——地鐵代幣、氣泡水瓶、自由女神紀念品通通有。", t: "由志工經營、只開週末幾個小時，要抓好時間再去。" },
  seed_nitehawk_cinema: { d: "可以邊吃邊看的獨立電影院，調酒會在電影演到一半時悄悄送到座位上。", t: "點主題特調，菜單會跟著上映的片子換。" },
  seed_weylin_savings_bank: { d: "橋頭旁 1875 年的金頂儲蓄銀行，修復後成為 Brooklyn 最華麗的室內空間之一。", t: "現在是活動場地，平時從 Broadway 欣賞金色圓頂，偶有開放日可入內參觀。" },
  seed_our_lady_mt_carmel: { d: "七月 Giglio Feast 的主場，數十人扛著五層樓高的塔在街上邊走邊跳。", t: "七月中的慶典週最精彩，平時就安靜地進去看看。" },
  seed_marsha_p_johnson_park: { d: "舊鐵道場改成的河濱草坪，曼哈頓全景就在眼前，週六隔壁就是 Smorgasburg。", t: "水邊的水泥階梯是看日落的特等席。" },
  seed_mccarren_park: { d: "Williamsburg 和 Greenpoint 共用的大後院——跑道、夏季泳池、狗公園和週末農夫市集。", t: "週六 North 12th 街角的 Greenmarket 是在地人的採買行程。" },
  seed_continental_army_plaza: { d: "Williamsburg Bridge 下的花崗岩廣場，1906 年的華盛頓騎馬雕像氣勢十足。", t: "從這裡踏上橋的人行道，可以一路走到 Lower East Side。" },
  seed_archway_dumbo: { d: "藏在 Manhattan Bridge 橋墩下的挑高鵝卵石廣場，是 DUMBO 的非官方市中心；夏季免費的 Live at the Archway 系列讓樂團與 DJ 在地鐵轟隆聲中開演，氣氛獨一無二。", t: "演出多在六到九月的週四傍晚舉行，早點到還能順便跟旁邊的攤販買晚餐。" },
  seed_smack_mellon: { d: "位於 Plymouth Street 一棟十九世紀鍋爐房改建的非營利藝術空間，挑高木柱下常有企圖心十足的大型個展，主推被低估的藝術家。", t: "週三到週日免費參觀，可以順著 Plymouth Street 往東把附近幾間藝廊一次逛完。" },
  seed_air_gallery: { d: "美國第一間由女性藝術家自營的藝廊，1972 年創立於 SoHo，如今落腳 DUMBO 的明亮店面，會員與駐村藝術家的檔期輪替得很勤。", t: "開幕活動頻繁又親切，出發前查一下檔期，新展通常在週六開跑。" },
  seed_klompching: { d: "Water Street 上專營當代攝影的精緻藝廊，把美術館等級的展牆留給新銳與成名攝影師。", t: "空間不大，適合和 Empire Stores、附近的大橋景點串成一條 Water Street 散步路線。" },
  seed_minus_space: { d: "位在 16 Main Street、低調卻有影響力的藝廊，專攻極簡與幾何抽象，展覽俐落沉靜，值得慢慢看。", t: "週三至週六下午開放，按鈴入內慢慢欣賞，展雖小但很有份量。" },
  seed_plymouth_church: { d: "1849 年落成的教堂，廢奴牧師 Henry Ward Beecher 曾在此向 Lincoln 與上千群眾佈道，也是地下鐵路（Underground Railroad）的秘密中繼站，靜靜藏在 Brooklyn Heights 的巷弄裡。", t: "別錯過旁邊的庭院，有 Beecher 雕像，拱廊邊還嵌著一塊 Plymouth Rock 的碎片。" },
  seed_st_ann_holy_trinity: { d: "Montague Street 上的哥德復興式地標教堂，擁有美國本土製作的第一批人物彩繪玻璃；如今的 St. Ann's Warehouse 藝術機構正是從這裡起家。", t: "挑晴天下午進去看 William Jay Bolton 的彩繪玻璃最漂亮，也常有免費的管風琴與合唱活動。" },
  seed_fulton_ferry_landing: { d: "布魯克林與曼哈頓最早以渡輪相連的碼頭，欄杆上鑄著 Walt Whitman 的詩作〈Crossing Brooklyn Ferry〉，旁邊還停著駁船音樂廳 Bargemusic。", t: "黃昏時來讀欄杆上的詩最有味道，再到碼頭邊的冰淇淋店排隊，配經典天際線一起享用。" },
  seed_mofad: { d: "位在 Empire Stores 倉庫二樓的趣味博物館，用互動展覽講美國飲食文化，聞香機與試吃就直接做進展場裡。", t: "從 Brooklyn Bridge Park 那側的中庭樓梯上樓，週末常有以試吃為主的活動，出發前查一下日曆。" },
  seed_issue_project_room: { d: "前衛音樂重鎮，在 110 Livingston 大樓底層一座 1920 年代的大理石劇場裡，端出全紐約數一數二實驗性的聲音藝術與新音樂演出。", t: "座位不多且常完售，記得提前訂票、早點入場，坐中間幾排最能感受空間的殘響。" },
  seed_brooklyn_ballet: { d: "布魯克林在地芭蕾舞團，以 Schermerhorn Street 的玻璃帷幕排練場為基地，把古典芭蕾混搭嘻哈與街舞，演出親密又有街區味。", t: "冬季的《Brooklyn Nutcracker》用在地舞蹈傳統重新詮釋經典，票很快就完售。" },
  seed_rudin_family_gallery: { d: "BAM 位於 Fulton Street「BAM Strong」側翼的免費臨街藝廊，視覺藝術展覽常與舞台演出季互相呼應，看 Harvey Theater 演出前很值得先繞進來。", t: "免費參觀，售票處開放時間內都能進去，Next Wave 藝術節期間的展覽尤其精彩。" },
  seed_cmon_everybody: { d: "Franklin Avenue 上一間帶著七〇年代華麗感的小酒吧，後方舞台幾乎夜夜有節目：獨立樂團、變裝秀、滑稽歌舞和 DJ 派對輪番上陣，是布魯克林最友善的酷兒場館之一。", t: "前面的酒吧免費入場，後方演出需另外購票，出發前先在網路上買好。" },
  seed_barclays_center: { d: "Atlantic 與 Flatbush 交口那座鏽鐵色環繞的體育館，Nets 主場之外也是大型巡演進駐布魯克林的據點，入口上方的環形雨棚廣場本身就是地標。", t: "搭地鐵到 Atlantic Av–Barclays Ctr 站最省事，出站就是大門口，開車來幾乎找不到停車位。" },
  seed_brooklyn_music_kitchen: { d: "Vanderbilt Avenue 上的社區型聆聽空間，爵士、放克、靈魂樂與即興 jam 輪番登場，一半是正經舞台、一半是有吃有喝的客廳氛圍。", t: "留意行事曆上的 jam night，在地樂手會輪流上台，入場費不貴而且音樂常玩到很晚。" },
  seed_schafler_gallery: { d: "Pratt Institute 化學大樓裡的旗艦藝廊，輪流展出學生、教授與客座策展的精彩作品，也是免費逛這座漂亮校園的好藉口。", t: "白天校園開放參觀，看完展順便走走外頭的雕塑公園最划算。" },
  seed_corridor_gallery: { d: "位於 Clinton Hill 褐石街區的一間小巧藝廊，與 Rush Arts 藝術家族淵源深厚，以推介新銳有色人種藝術家聞名。", t: "只在週三至週六下午開放，出發前先確認目前檔期比較保險。" },
  seed_jack_arts: { d: "Waverly Avenue 上一座 1920 年代車庫改建的六十席實驗表演空間，曾獲 OBIE 獎，端出大膽的戲劇、舞蹈與音樂，帶有濃厚的社會關懷色彩。", t: "票價便宜且常採自由定價，場地很小，口碑檔期記得提前訂位。" },
  seed_emmanuel_baptist: { d: "Clinton Hill 的 1887 年砂岩大教堂，由石油大亨 Charles Pratt 出資興建的法式哥德傑作，雙塔俯瞰著 Lafayette Avenue 的豪宅群。", t: "看完教堂順便走 Clinton Avenue 和 Washington Avenue 幾個街區，是欣賞老宅邸的最佳路線。" },
  seed_seeds_brooklyn: { d: "Vanderbilt Avenue 上僅三十席的創作音樂空間，前衛爵士與即興演出近得像家庭音樂會，連樂手的呼吸聲都聽得見。", t: "採自由樂捐入場，座位先到先坐，出發前查好線上日曆並提早到場。" },
  seed_fivemyles: { d: "由 Hanne Tierney 創立、位於 Crown Heights 舊車庫的非營利藝術空間，自 1999 年起持續展出視覺與行為藝術，與周邊社區的連結相當深。", t: "週四至週日下午開放，開幕茶會溫馨又有街坊感，值得配合時間造訪。" },
  seed_colson_patisserie: { d: "紮根 Park Slope 的比利時風味法式甜點店，可頌與 merveilleux 蛋白霜甜點鎮守 9th St 與 6th Ave 街角二十年。", t: "外帶甜點後可直接鑽進隔壁的 Barbès 聽一場傍晚的現場演出。" },
  seed_winner_park_slope: { d: "主廚 Daniel Eddy 的街角麵包咖啡店，天然酵母麵包、季節甜點和招牌烤雞擠在同一間小店面裡。", t: "熱門甜點常在上午賣完，週末最好十點前報到。" },
  seed_barbes: { d: "Park Slope 的迷你酒吧卻有超乎規模的名聲，後室幾乎每晚都有一流的爵士、klezmer 與西非音樂演出。", t: "空間只容得下約 50 人，請早點到，並準備現金投給樂手的小費桶。" },
  seed_littlefield: { d: "由倉庫改建的 Gowanus 表演場地，節目在獨立樂團、知名脫口秀與各式怪奇綜藝之間輪替。", t: "喜劇之夜經常完售，建議先訂票；買不到可以改看姐妹場館 Union Hall。" },
  seed_freddys_bar: { d: "這間頑強的小酒吧在 Barclays Center 抗爭後遷到現址，如今後室幾乎每晚都有免費樂團和古怪表演。", t: "多半不收入場費，平日晚上人少，看團最舒服。" },
  seed_powerhouse_arts: { d: "矗立在 Gowanus 運河畔的 1904 年發電廠建築，重生為非營利藝術製作基地，挑高大廳氣勢驚人。", t: "這裡不是每天開放的美術館，出發前先查官網的展覽與公眾活動日程。" },
  seed_textile_arts_center: { d: "位在 Carroll St 的紡織工作室，織布機、染缸和駐村藝術家讓布魯克林的纖維藝術持續發熱。", t: "單堂織布與植物染工作坊很快額滿，記得先上網報名。" },
  seed_interference_archive: { d: "由志工經營的社會運動檔案館，收藏抗議海報與獨立刊物，免費展覽還能親手翻閱。", t: "每週只開放少數幾個下午，出發前先確認開放時間。" },
  seed_open_source_gallery: { d: "由修車行改建的非營利街邊藝廊，實驗性展覽與公共藝術計畫常常延伸到 17th St 街上。", t: "開幕之夜最熱鬧；平日開放時間有限，先打電話確認再去。" },
  seed_gowanus_dredgers: { d: "自 1999 年起帶大家划進 Gowanus 運河的志工船屋，堪稱紐約最超現實的工業風獨木舟體驗。", t: "季節性開放免費現場划船（約春季到秋季），到場簽切結書即可參加。" },
  seed_gowanus_canal_esplanade: { d: "沿運河而建的 Bond St 公共濱水步道，新植栽與木棧道長椅面對水面，不時有獨木舟划過。", t: "傍晚金色時刻最美，走完可順道跨越百年木造的 Carroll St 平移橋。" },
  seed_owl_music_parlor: { d: "位於 Rogers Ave、像客廳一般的小型聆聽空間，室內樂、爵士與實驗音樂在全場安靜中演出。", t: "這裡是坐席安靜聆聽的場地，開演前入座，順便在小吧台點杯酒。" },
  seed_jewish_childrens_museum: { d: "Eastern Pkwy 上的玻璃帷幕博物館，是全美最大的猶太兒童博物館，用兩層樓的互動展覽介紹猶太文化。", t: "週六安息日休館；週日人最多，平日造訪最從容。" },
  seed_770_eastern_parkway: { d: "哥德復興式紅磚建築，是 Chabad-Lubavitch 猶太運動的全球總部，世界各地甚至有依原樣複製的分館。", t: "外觀隨時可參觀；請穿著保守，安息日前後保持低調。" },
  seed_brower_park: { d: "綠蔭濃密的社區公園，起伏草坪與高大懸鈴木環繞，緊鄰 Brooklyn Children's Museum。", t: "遛完遊樂場可直接逛隔壁博物館，館頂平台還能眺望樹海。" },
  seed_st_johns_rec: { d: "占地整個街廓的公園局設施，有球場、遊樂場，以及 WPA 時期興建、附室內泳池的活動中心。", t: "戶外球場與遊樂場每天免費開放；室內泳池需辦理便宜的活動中心會員。" },
  seed_eastern_parkway_malls: { d: "全美第一條林蔭園道，由 Olmsted 與 Vaux 於 1870 年代規劃，綠蔭步道是 Crown Heights 的門廊，也是西印度嘉年華的遊行路線。", t: "勞動節來看鋼鼓與化裝樂隊遊行，平常的週日則適合沿褐石屋悠閒散步。" },
  seed_cafe_ornithology: { d: "Ornithology Jazz Club 轉角處的姐妹聆聽室，每晚爵士演出搭配蔬食地中海料理與自然酒。", t: "建議聽早場並點一份 mezze 拼盤，樂團演奏時全場保持輕聲細語。" },
  seed_bossa_nova_civic_club: { d: "Myrtle Ave 上的熱帶風地下小舞廳，是紐約最具影響力的小型電子音樂俱樂部之一，每晚都有地下 DJ 進駐。", t: "午夜後非常擁擠，平日早點到既有空間跳舞、入場費也較便宜。" },
  seed_richard_beavers_gallery: { d: "位於 Bed-Stuy 的藝廊，長期推廣當代黑人藝術家，具象作品與窗外的街區生活直接對話。", t: "開放時間多在下午與週末，先看 Instagram 確認當期展覽與開幕活動。" },
  seed_living_gallery: { d: "位在 Broadway 高架鐵軌下的社區藝術空間，展覽、工作坊與招牌的 BYOB 人體速寫之夜輪番登場。", t: "週日晚間的速寫課歡迎完全新手，自備素描本即可。" },
  seed_akwaaba_mansion: { d: "MacDonough St 上 1860 年代的義大利式豪宅，被細心修復為指標性的黑人經營民宿，也是 Stuyvesant Heights 的地標。", t: "就算不住宿也值得繞著街區走走，這裡有布魯克林數一數二的褐石建築。" },
  seed_stuyvesant_heights_hd: { d: "Bed-Stuy 核心的法定歷史街區，1880-90 年代的褐石屋與教堂連綿成排，是全市保存最完整的維多利亞式街景之一。", t: "從 MacDonough 與 Stuyvesant 路口出發往 Decatur St 逛，傍晚斜陽下的立面最好看。" },
  seed_saratoga_park: { d: "Bed-Stuy 東側優雅的方形小公園，百年榆樹與蜿蜒步道被褐石屋環抱，連夏日週末都很清幽。", t: "Halsey St 那一側大榆樹下的長椅樹蔭最棒，適合帶杯咖啡歇腳。" },
  seed_fulton_park: { d: "沿 Fulton St 延伸的狹長綠帶公園，Robert Fulton 雕像坐鎮，儼然是 Stuyvesant Heights 的市民廣場。", t: "夏季週末的廣場端常有鼓隊與社區活動，值得停留。" },
  seed_industry_city: { d: "由十六棟舊航運倉庫改造的創意園區，公共藝術、職人工作室、藝廊與中庭裝置散布在 Sunset Park 濱水區。", t: "平日逛免費的中庭與設計小店最自在，週末美食街周邊人潮洶湧。" },
  seed_greenwood_cemetery: { d: "占地 478 英畝的維多利亞式墓園，也是國家歷史地標；哥德式大門、布魯克林戰役遺址與 Leonard Bernstein 之墓同在全區最高的丘陵上。", t: "從 25th St 大門進入，抬頭聽聽在尖塔築巢的野生和尚鸚鵡。" },
  seed_red_hook_park: { d: "Red Hook 的大型運動公園，有球場、WPA 時期的超大戶外泳池，以及讓球場聲名遠播的夏季拉美小吃攤。", t: "夏季週末最熱鬧，球賽開打、pupusa 與 taco 攤位全數出動。" },
  seed_erie_basin_park: { d: "環繞舊 Todd 造船廠、位於 IKEA 後方的濱水步道，保留下來的龍門吊車與乾塢遺構框出開闊的海港景色。", t: "抓準日落時分來看 Erie Basin 的晚霞，之後轉往 Van Brunt St 吃燒烤。" },
  seed_red_hook_community_farm: { d: "由柏油球場蛻變而成的都市農場，是全市規模最大的之一，與社區青年一起種菜、做堆肥。", t: "產季的週六有農產小攤，也可以報名週末志工時段親自下田。" },
}
