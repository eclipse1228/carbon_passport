-- Insert major KORAIL stations
INSERT INTO stations (code, name_ko, name_en, name_ja, name_zh, latitude, longitude) VALUES
-- Seoul area
('SEOUL', '서울역', 'Seoul Station', 'ソウル駅', '首尔站', 37.5547, 126.9707),
('YONGSAN', '용산역', 'Yongsan Station', '龍山駅', '龙山站', 37.5298, 126.9648),
('GANGNAM', '강남역', 'Gangnam Station', 'カンナム駅', '江南站', 37.4971, 127.0276),
('YEONGDEUNGPO', '영등포역', 'Yeongdeungpo Station', '永登浦駅', '永登浦站', 37.5156, 126.9074),

-- Gyeonggi area
('SUWON', '수원역', 'Suwon Station', '水原駅', '水原站', 37.2659, 126.9999),
('PYEONGTAEK', '평택역', 'Pyeongtaek Station', '平沢駅', '平泽站', 36.9906, 127.0855),
('CHEONAN', '천안역', 'Cheonan Station', '天安駅', '天安站', 36.7938, 127.1458),
('UIJEONGBU', '의정부역', 'Uijeongbu Station', '議政府駅', '议政府站', 37.7382, 127.0450),

-- Incheon
('INCHEON', '인천역', 'Incheon Station', '仁川駅', '仁川站', 37.4767, 126.6167),
('INCHEON_AIRPORT', '인천공항역', 'Incheon Airport Station', '仁川空港駅', '仁川机场站', 37.4477, 126.4523),

-- Gangwon area
('CHUNCHEON', '춘천역', 'Chuncheon Station', '春川駅', '春川站', 37.8850, 127.7166),
('GANGNEUNG', '강릉역', 'Gangneung Station', '江陵駅', '江陵站', 37.7641, 128.8990),
('WONJU', '원주역', 'Wonju Station', '原州駅', '原州站', 37.3387, 127.9504),
('PYEONGCHANG', '평창역', 'Pyeongchang Station', '平昌駅', '平昌站', 37.5705, 128.3920),

-- Chungcheong area
('DAEJEON', '대전역', 'Daejeon Station', '大田駅', '大田站', 36.3333, 127.4333),
('CHEONGJU', '청주역', 'Cheongju Station', '清州駅', '清州站', 36.6277, 127.4313),
('CHUNGJU', '충주역', 'Chungju Station', '忠州駅', '忠州站', 36.9720, 127.9261),
('ASAN', '아산역', 'Asan Station', '牙山駅', '牙山站', 36.7920, 127.0044),

-- Jeolla area
('JEONJU', '전주역', 'Jeonju Station', '全州駅', '全州站', 35.8472, 127.1617),
('GWANGJU', '광주역', 'Gwangju Station', '光州駅', '光州站', 35.1657, 126.9090),
('MOKPO', '목포역', 'Mokpo Station', '木浦駅', '木浦站', 34.7936, 126.3886),
('YEOSU_EXPO', '여수엑스포역', 'Yeosu Expo Station', '麗水エキスポ駅', '丽水世博站', 34.7525, 127.7460),
('SUNCHEON', '순천역', 'Suncheon Station', '順天駅', '顺天站', 34.9454, 127.5035),

-- Gyeongsang area
('BUSAN', '부산역', 'Busan Station', '釜山駅', '釜山站', 35.1154, 129.0413),
('DAEGU', '대구역', 'Daegu Station', '大邱駅', '大邱站', 35.8781, 128.6281),
('ULSAN', '울산역', 'Ulsan Station', '蔚山駅', '蔚山站', 35.5516, 129.1387),
('POHANG', '포항역', 'Pohang Station', '浦項駅', '浦项站', 36.0719, 129.3433),
('GYEONGJU', '경주역', 'Gyeongju Station', '慶州駅', '庆州站', 35.7984, 129.1404),
('JINJU', '진주역', 'Jinju Station', '晋州駅', '晋州站', 35.1498, 128.0334),
('CHANGWON', '창원역', 'Changwon Station', '昌原駅', '昌原站', 35.2242, 128.6719),
('MASAN', '마산역', 'Masan Station', '馬山駅', '马山站', 35.2350, 128.5725),

-- Jeju (for reference, no direct train)
('JEJU', '제주', 'Jeju', '済州', '济州', 33.5000, 126.5311),

-- Additional major KTX stations
('DONGDAEGU', '동대구역', 'Dongdaegu Station', '東大邱駅', '东大邱站', 35.8797, 128.6286),
('SINGYEONGJU', '신경주역', 'Singyeongju Station', '新慶州駅', '新庆州站', 35.7978, 129.1392),
('GWANGMYEONG', '광명역', 'Gwangmyeong Station', '光明駅', '光明站', 37.4160, 126.8848),
('OSONG', '오송역', 'Osong Station', 'オソン駅', '五松站', 36.6200, 127.3267),
('GONGJU', '공주역', 'Gongju Station', '公州駅', '公州站', 36.4467, 127.0983),
('IKSAN', '익산역', 'Iksan Station', '益山駅', '益山站', 35.9383, 126.9917),
('GIMCHEON_GUMI', '김천구미역', 'Gimcheon-Gumi Station', '金泉亀尾駅', '金泉龟尾站', 36.1094, 128.3317);

-- Update all stations as active
UPDATE stations SET is_active = true;