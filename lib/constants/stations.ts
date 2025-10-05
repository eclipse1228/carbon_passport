/**
 * Station data constants for KORAIL stations
 * Includes coordinates and multilingual names
 */

export interface StationData {
  code: string
  name_ko: string
  name_en: string
  name_ja: string | null
  name_zh: string | null
  latitude: number
  longitude: number
  region?: string
  isKTX?: boolean
}

export const STATIONS: StationData[] = [
  // Seoul Metropolitan Area
  {
    code: 'SEOUL',
    name_ko: '서울역',
    name_en: 'Seoul Station',
    name_ja: 'ソウル駅',
    name_zh: '首尔站',
    latitude: 37.5547,
    longitude: 126.9707,
    region: 'seoul',
    isKTX: true,
  },
  {
    code: 'YONGSAN',
    name_ko: '용산역',
    name_en: 'Yongsan Station',
    name_ja: '龍山駅',
    name_zh: '龙山站',
    latitude: 37.5298,
    longitude: 126.9648,
    region: 'seoul',
    isKTX: true,
  },
  {
    code: 'GANGNAM',
    name_ko: '강남역',
    name_en: 'Gangnam Station',
    name_ja: 'カンナム駅',
    name_zh: '江南站',
    latitude: 37.4971,
    longitude: 127.0276,
    region: 'seoul',
  },
  {
    code: 'YEONGDEUNGPO',
    name_ko: '영등포역',
    name_en: 'Yeongdeungpo Station',
    name_ja: '永登浦駅',
    name_zh: '永登浦站',
    latitude: 37.5156,
    longitude: 126.9074,
    region: 'seoul',
  },
  
  // Gyeonggi Province
  {
    code: 'SUWON',
    name_ko: '수원역',
    name_en: 'Suwon Station',
    name_ja: '水原駅',
    name_zh: '水原站',
    latitude: 37.2659,
    longitude: 126.9999,
    region: 'gyeonggi',
    isKTX: true,
  },
  {
    code: 'PYEONGTAEK',
    name_ko: '평택역',
    name_en: 'Pyeongtaek Station',
    name_ja: '平沢駅',
    name_zh: '平泽站',
    latitude: 36.9906,
    longitude: 127.0855,
    region: 'gyeonggi',
  },
  {
    code: 'CHEONAN',
    name_ko: '천안역',
    name_en: 'Cheonan Station',
    name_ja: '天安駅',
    name_zh: '天安站',
    latitude: 36.7938,
    longitude: 127.1458,
    region: 'gyeonggi',
  },
  {
    code: 'UIJEONGBU',
    name_ko: '의정부역',
    name_en: 'Uijeongbu Station',
    name_ja: '議政府駅',
    name_zh: '议政府站',
    latitude: 37.7382,
    longitude: 127.0450,
    region: 'gyeonggi',
  },
  {
    code: 'GWANGMYEONG',
    name_ko: '광명역',
    name_en: 'Gwangmyeong Station',
    name_ja: '光明駅',
    name_zh: '光明站',
    latitude: 37.4160,
    longitude: 126.8848,
    region: 'gyeonggi',
    isKTX: true,
  },
  
  // Incheon
  {
    code: 'INCHEON',
    name_ko: '인천역',
    name_en: 'Incheon Station',
    name_ja: '仁川駅',
    name_zh: '仁川站',
    latitude: 37.4767,
    longitude: 126.6167,
    region: 'incheon',
  },
  {
    code: 'INCHEON_AIRPORT',
    name_ko: '인천공항역',
    name_en: 'Incheon Airport Station',
    name_ja: '仁川空港駅',
    name_zh: '仁川机场站',
    latitude: 37.4477,
    longitude: 126.4523,
    region: 'incheon',
  },
  
  // Gangwon Province
  {
    code: 'CHUNCHEON',
    name_ko: '춘천역',
    name_en: 'Chuncheon Station',
    name_ja: '春川駅',
    name_zh: '春川站',
    latitude: 37.8850,
    longitude: 127.7166,
    region: 'gangwon',
  },
  {
    code: 'GANGNEUNG',
    name_ko: '강릉역',
    name_en: 'Gangneung Station',
    name_ja: '江陵駅',
    name_zh: '江陵站',
    latitude: 37.7641,
    longitude: 128.8990,
    region: 'gangwon',
    isKTX: true,
  },
  {
    code: 'WONJU',
    name_ko: '원주역',
    name_en: 'Wonju Station',
    name_ja: '原州駅',
    name_zh: '原州站',
    latitude: 37.3387,
    longitude: 127.9504,
    region: 'gangwon',
  },
  {
    code: 'PYEONGCHANG',
    name_ko: '평창역',
    name_en: 'Pyeongchang Station',
    name_ja: '平昌駅',
    name_zh: '平昌站',
    latitude: 37.5705,
    longitude: 128.3920,
    region: 'gangwon',
    isKTX: true,
  },
  
  // Chungcheong Province
  {
    code: 'DAEJEON',
    name_ko: '대전역',
    name_en: 'Daejeon Station',
    name_ja: '大田駅',
    name_zh: '大田站',
    latitude: 36.3333,
    longitude: 127.4333,
    region: 'chungcheong',
    isKTX: true,
  },
  {
    code: 'CHEONGJU',
    name_ko: '청주역',
    name_en: 'Cheongju Station',
    name_ja: '清州駅',
    name_zh: '清州站',
    latitude: 36.6277,
    longitude: 127.4313,
    region: 'chungcheong',
  },
  {
    code: 'CHUNGJU',
    name_ko: '충주역',
    name_en: 'Chungju Station',
    name_ja: '忠州駅',
    name_zh: '忠州站',
    latitude: 36.9720,
    longitude: 127.9261,
    region: 'chungcheong',
  },
  {
    code: 'ASAN',
    name_ko: '아산역',
    name_en: 'Asan Station',
    name_ja: '牙山駅',
    name_zh: '牙山站',
    latitude: 36.7920,
    longitude: 127.0044,
    region: 'chungcheong',
  },
  {
    code: 'OSONG',
    name_ko: '오송역',
    name_en: 'Osong Station',
    name_ja: 'オソン駅',
    name_zh: '五松站',
    latitude: 36.6200,
    longitude: 127.3267,
    region: 'chungcheong',
    isKTX: true,
  },
  {
    code: 'GONGJU',
    name_ko: '공주역',
    name_en: 'Gongju Station',
    name_ja: '公州駅',
    name_zh: '公州站',
    latitude: 36.4467,
    longitude: 127.0983,
    region: 'chungcheong',
    isKTX: true,
  },
  
  // Jeolla Province
  {
    code: 'JEONJU',
    name_ko: '전주역',
    name_en: 'Jeonju Station',
    name_ja: '全州駅',
    name_zh: '全州站',
    latitude: 35.8472,
    longitude: 127.1617,
    region: 'jeolla',
  },
  {
    code: 'GWANGJU',
    name_ko: '광주역',
    name_en: 'Gwangju Station',
    name_ja: '光州駅',
    name_zh: '光州站',
    latitude: 35.1657,
    longitude: 126.9090,
    region: 'jeolla',
    isKTX: true,
  },
  {
    code: 'MOKPO',
    name_ko: '목포역',
    name_en: 'Mokpo Station',
    name_ja: '木浦駅',
    name_zh: '木浦站',
    latitude: 34.7936,
    longitude: 126.3886,
    region: 'jeolla',
    isKTX: true,
  },
  {
    code: 'YEOSU_EXPO',
    name_ko: '여수엑스포역',
    name_en: 'Yeosu Expo Station',
    name_ja: '麗水エキスポ駅',
    name_zh: '丽水世博站',
    latitude: 34.7525,
    longitude: 127.7460,
    region: 'jeolla',
    isKTX: true,
  },
  {
    code: 'SUNCHEON',
    name_ko: '순천역',
    name_en: 'Suncheon Station',
    name_ja: '順天駅',
    name_zh: '顺天站',
    latitude: 34.9454,
    longitude: 127.5035,
    region: 'jeolla',
  },
  {
    code: 'IKSAN',
    name_ko: '익산역',
    name_en: 'Iksan Station',
    name_ja: '益山駅',
    name_zh: '益山站',
    latitude: 35.9383,
    longitude: 126.9917,
    region: 'jeolla',
    isKTX: true,
  },
  
  // Gyeongsang Province
  {
    code: 'BUSAN',
    name_ko: '부산역',
    name_en: 'Busan Station',
    name_ja: '釜山駅',
    name_zh: '釜山站',
    latitude: 35.1154,
    longitude: 129.0413,
    region: 'gyeongsang',
    isKTX: true,
  },
  {
    code: 'DAEGU',
    name_ko: '대구역',
    name_en: 'Daegu Station',
    name_ja: '大邱駅',
    name_zh: '大邱站',
    latitude: 35.8781,
    longitude: 128.6281,
    region: 'gyeongsang',
  },
  {
    code: 'DONGDAEGU',
    name_ko: '동대구역',
    name_en: 'Dongdaegu Station',
    name_ja: '東大邱駅',
    name_zh: '东大邱站',
    latitude: 35.8797,
    longitude: 128.6286,
    region: 'gyeongsang',
    isKTX: true,
  },
  {
    code: 'ULSAN',
    name_ko: '울산역',
    name_en: 'Ulsan Station',
    name_ja: '蔚山駅',
    name_zh: '蔚山站',
    latitude: 35.5516,
    longitude: 129.1387,
    region: 'gyeongsang',
    isKTX: true,
  },
  {
    code: 'POHANG',
    name_ko: '포항역',
    name_en: 'Pohang Station',
    name_ja: '浦項駅',
    name_zh: '浦项站',
    latitude: 36.0719,
    longitude: 129.3433,
    region: 'gyeongsang',
    isKTX: true,
  },
  {
    code: 'GYEONGJU',
    name_ko: '경주역',
    name_en: 'Gyeongju Station',
    name_ja: '慶州駅',
    name_zh: '庆州站',
    latitude: 35.7984,
    longitude: 129.1404,
    region: 'gyeongsang',
  },
  {
    code: 'SINGYEONGJU',
    name_ko: '신경주역',
    name_en: 'Singyeongju Station',
    name_ja: '新慶州駅',
    name_zh: '新庆州站',
    latitude: 35.7978,
    longitude: 129.1392,
    region: 'gyeongsang',
    isKTX: true,
  },
  {
    code: 'JINJU',
    name_ko: '진주역',
    name_en: 'Jinju Station',
    name_ja: '晋州駅',
    name_zh: '晋州站',
    latitude: 35.1498,
    longitude: 128.0334,
    region: 'gyeongsang',
  },
  {
    code: 'CHANGWON',
    name_ko: '창원역',
    name_en: 'Changwon Station',
    name_ja: '昌原駅',
    name_zh: '昌原站',
    latitude: 35.2242,
    longitude: 128.6719,
    region: 'gyeongsang',
  },
  {
    code: 'MASAN',
    name_ko: '마산역',
    name_en: 'Masan Station',
    name_ja: '馬山駅',
    name_zh: '马山站',
    latitude: 35.2350,
    longitude: 128.5725,
    region: 'gyeongsang',
  },
  {
    code: 'GIMCHEON_GUMI',
    name_ko: '김천구미역',
    name_en: 'Gimcheon-Gumi Station',
    name_ja: '金泉亀尾駅',
    name_zh: '金泉龟尾站',
    latitude: 36.1094,
    longitude: 128.3317,
    region: 'gyeongsang',
    isKTX: true,
  },
  
  // Jeju (for reference, no direct train)
  {
    code: 'JEJU',
    name_ko: '제주',
    name_en: 'Jeju',
    name_ja: '済州',
    name_zh: '济州',
    latitude: 33.5000,
    longitude: 126.5311,
    region: 'jeju',
  },
]

// Helper functions
export function getStationByCode(code: string): StationData | undefined {
  return STATIONS.find(station => station.code === code)
}

export function getStationsByRegion(region: string): StationData[] {
  return STATIONS.filter(station => station.region === region)
}

export function getKTXStations(): StationData[] {
  return STATIONS.filter(station => station.isKTX === true)
}

export function searchStations(
  query: string,
  locale: 'ko' | 'en' | 'ja' | 'zh' = 'ko'
): StationData[] {
  const lowerQuery = query.toLowerCase()
  const nameField = `name_${locale}` as keyof StationData
  
  return STATIONS.filter(station => {
    const name = station[nameField] as string | null
    return name && name.toLowerCase().includes(lowerQuery)
  })
}

// Region names
export const REGION_NAMES = {
  seoul: {
    ko: '서울',
    en: 'Seoul',
    ja: 'ソウル',
    zh: '首尔',
  },
  gyeonggi: {
    ko: '경기도',
    en: 'Gyeonggi',
    ja: '京畿道',
    zh: '京畿道',
  },
  incheon: {
    ko: '인천',
    en: 'Incheon',
    ja: '仁川',
    zh: '仁川',
  },
  gangwon: {
    ko: '강원도',
    en: 'Gangwon',
    ja: '江原道',
    zh: '江原道',
  },
  chungcheong: {
    ko: '충청도',
    en: 'Chungcheong',
    ja: '忠清道',
    zh: '忠清道',
  },
  jeolla: {
    ko: '전라도',
    en: 'Jeolla',
    ja: '全羅道',
    zh: '全罗道',
  },
  gyeongsang: {
    ko: '경상도',
    en: 'Gyeongsang',
    ja: '慶尚道',
    zh: '庆尚道',
  },
  jeju: {
    ko: '제주도',
    en: 'Jeju',
    ja: '済州島',
    zh: '济州岛',
  },
}

export type Region = keyof typeof REGION_NAMES