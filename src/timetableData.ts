export type ColorType = 'blue' | 'yellow' | 'orange' | 'green' | 'pink';

export interface ClassEntry {
  name: string;
  room: number;
  color: ColorType;
}

export interface Period {
  period: number;
  startTime: string;
  endTime: string;
}

export const PERIODS: Period[] = [
  { period: 1, startTime: '09:00', endTime: '10:00' },
  { period: 2, startTime: '10:00', endTime: '11:00' },
  { period: 3, startTime: '11:00', endTime: '12:00' },
  { period: 4, startTime: '12:00', endTime: '13:00' },
  { period: 5, startTime: '13:00', endTime: '14:00' },
  { period: 6, startTime: '14:00', endTime: '15:00' },
  { period: 7, startTime: '15:00', endTime: '16:00' },
  { period: 8, startTime: '16:00', endTime: '17:00' },
  { period: 9, startTime: '17:00', endTime: '18:00' },
  { period: 10, startTime: '18:00', endTime: '19:00' },
];

export const DAYS = ['月', '火', '水', '木', '金'] as const;
export type Day = typeof DAYS[number];

// timetable[period][day] = ClassEntry | null
export const TIMETABLE: Record<number, Record<Day, ClassEntry | null>> = {
  1: {
    月: { name: 'クラウド構築演習\n※NS / ネットワーク管理演習', room: 733, color: 'blue' },
    火: null,
    水: null,
    木: { name: '機械学習基礎', room: 646, color: 'yellow' },
    金: { name: '行動科学分析\n※経情マネコース', room: 646, color: 'blue' },
  },
  2: {
    月: { name: 'クラウド構築演習', room: 733, color: 'blue' },
    火: { name: '金融工学', room: 646, color: 'yellow' },
    水: { name: 'LAN ※NS', room: 732, color: 'blue' },
    木: { name: '機械学習基礎', room: 646, color: 'yellow' },
    金: { name: '行動科学分析', room: 646, color: 'blue' },
  },
  3: {
    月: { name: 'クラウド構築演習', room: 733, color: 'blue' },
    火: { name: '金融工学', room: 646, color: 'yellow' },
    水: { name: 'LAN ※NS', room: 732, color: 'blue' },
    木: { name: 'キャリアデザイン3\n※情報NS', room: 646, color: 'orange' },
    金: null,
  },
  4: {
    月: { name: 'クラウド構築演習', room: 733, color: 'blue' },
    火: null,
    水: null,
    木: { name: 'キャリアデザイン3\n※情報NS', room: 646, color: 'orange' },
    金: null,
  },
  5: {
    月: null,
    火: { name: '経済学', room: 612, color: 'pink' },
    水: { name: 'ソフトコンピューティング\n※情報', room: 646, color: 'green' },
    木: null,
    金: null,
  },
  6: {
    月: null,
    火: null,
    水: null,
    木: null,
    金: null,
  },
  7: {
    月: { name: 'クラウドコンピューティング', room: 646, color: 'green' },
    火: { name: 'データベース ※NS', room: 733, color: 'yellow' },
    水: { name: 'マルチメディア情報処理', room: 646, color: 'blue' },
    木: null,
    金: { name: 'Webプログラミング実験', room: 733, color: 'green' },
  },
  8: {
    月: null,
    火: { name: 'データベース ※NS', room: 646, color: 'yellow' },
    水: { name: 'マルチメディア情報処理', room: 646, color: 'blue' },
    木: null,
    金: { name: 'Webプログラミング実験', room: 733, color: 'green' },
  },
  9: {
    月: null,
    火: null,
    水: null,
    木: null,
    金: { name: 'Webプログラミング実験', room: 733, color: 'green' },
  },
  10: {
    月: null,
    火: null,
    水: null,
    木: null,
    金: null,
  },
};

export const ATTENDANCE_BASE_URL =
  'https://attendance.is.it-chiba.ac.jp/attendance/class_room/';
