import { DeviceOption } from '../types';

/**
 * خيارات نوع المنتج
 */
export const DEVICE_OPTIONS: DeviceOption[] = [
  {
    id: 'video_fridge',
    emoji: '',
    name: 'فيديو ثلاجة',
    description: 'فيديو ثلاجة'
  },
  {
    id: 'video_oven',
    emoji: '',
    name: 'فيديو فران',
    description: 'فيديو فران'
  },
  {
    id: 'video_washing_machine',
    emoji: '',
    name: ' فيديو غسالة ماعن',
    description: 'فيديو غسالة'
  },
  {
    id: 'video_chauffe_eau',
    emoji: '',
    name: 'فيديو شوفو',
    description: 'فيديو شوفو'
  },
  {
    id: 'video_pack',
    emoji: '',
    name: 'فيديو PACK CUISINER ',
    description: 'فيديو باك'
  }
];

/**
 * المدن المغربية
 */
export const MOROCCAN_CITIES = [
  'الدار البيضاء (Casablanca)',
  'الرباط (Rabat)',
  'طنجة (Tanger)',
  'مراكش (Marrakech)',
  'فاس (Fès)',
  'أكادير (Agadir)',
  'مكناس (Meknès)',
  'وجدة (Oujda)',
  'القنيطرة (Kénitra)',
  'تطوان (Tétouan)',
  'تمارة (Témara)',
  'سلا (Salé)',
  'المحمدية (Mohammédia)',
  'الجديدة (El Jadida)',
  'بني ملال (Béni Mellal)',
  'الناظور (Nador)',
  'آسفي (Safi)',
  'خريبكة (Khouribga)',
  'سطات (Settat)',
  'العيون (Laâyoune)',
  'الداخلة (Dakhla)',
  'مدينة أخرى...'
];
