export interface DeviceOption {
  id: string;
  emoji: string;
  name: string;
  subtitle?: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  tag?: string;
  features?: string[];
}

export interface LeadFormData {
  fullName: string;
  phone: string;
  city: string;
  address: string;

  // المنتج الذي كتبه الزبون
  product?: string;

  deviceId?: string;
  deviceName?: string;
  additionalMessage?: string;
  notes?: string;
}

export interface LeadRecord {
  id: string;
  date: string;
  timestamp: number;
  name: string;
  phone: string;
  city: string;
  address: string;
  selectedDevice: string;
  additionalMessage?: string;
  status: 'New Order' | 'Contacted' | 'Confirmed' | 'Delivered' | 'Cancelled' | 'جديد' | 'تم الاتصال' | 'مؤكد' | 'ملغى';
  emailSent?: boolean;
  googleSheetSent?: boolean;
  notes?: string;
}

export interface LeadSubmissionResponse {
  success: boolean;
  leadId?: string;
  message?: string;
  error?: string;
}
