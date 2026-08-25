import React, { useEffect, useState } from 'react';
import { LeadRecord } from '../types';
import { X, Download, Phone, RefreshCw, CheckCircle2, FileSpreadsheet } from 'lucide-react';

interface LeadsManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeadsManagerModal: React.FC<LeadsManagerModalProps> = ({ isOpen, onClose }) => {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLeads();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden text-right">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={fetchLeads}
              disabled={loading}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
              title="تحديث البيانات"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2 justify-end">
              <span>لوحة متابعة الطلبات المسجلة</span>
              <span className="text-xs bg-blue-100 text-blue-800 font-mono px-2 py-0.5 rounded-full">
                {leads.length} طلب
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              جميع الطلبات المتزامنة مع Google Sheet
            </p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="px-5 py-3 bg-white border-b border-slate-100 flex items-center justify-between">
          <a
            href="/api/leads/export-csv"
            download
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تحميل ملف Google Sheet (CSV)</span>
          </a>

          <span className="text-xs text-slate-400">
            يتم إرسال كل طلب فوراً وبشكل تلقائي لـ Google Sheet
          </span>
        </div>

        {/* Modal Body / Table */}
        <div className="p-4 overflow-y-auto flex-1">
          {leads.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="text-3xl">📭</div>
              <p className="text-sm font-semibold text-slate-700">لا توجد طلبات مسجلة بعد</p>
              <p className="text-xs text-slate-500">عندما يقوم زبون بتعبئة الاستمارة ستظهر بياناته هنا فوراً وسيتم إرسالها إلى Google Sheet.</p>
            </div>
          ) : (
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">رقم الطلب (ID)</th>
                    <th className="p-3">التاريخ</th>
                    <th className="p-3">اسم الزبون</th>
                    <th className="p-3">رقم الهاتف</th>
                    <th className="p-3">المدينة</th>
                    <th className="p-3">العنوان الكامل</th>
                    <th className="p-3">المنتج المختار</th>
                    <th className="p-3">رسالة إضافية</th>
                    <th className="p-3">Google Sheet</th>
                    <th className="p-3 text-center">اتصال</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-mono font-bold text-sky-800">
                        #{lead.id}
                      </td>
                      <td className="p-3 text-slate-500 whitespace-nowrap">
                        {lead.date}
                      </td>
                      <td className="p-3 font-bold text-slate-900">
                        {lead.name}
                      </td>
                      <td className="p-3 font-mono text-slate-800 dir-ltr text-right font-medium">
                        {lead.phone}
                      </td>
                      <td className="p-3 font-medium text-slate-700">
                        {lead.city}
                      </td>
                      <td className="p-3 text-slate-600 max-w-[150px] truncate" title={lead.address}>
                        {lead.address || '-'}
                      </td>
                      <td className="p-3 font-bold text-blue-700">
                        {lead.selectedDevice}
                      </td>
                      <td className="p-3 text-slate-600 max-w-[150px] truncate" title={lead.additionalMessage || '-'}>
                        {lead.additionalMessage || '-'}
                      </td>
                      <td className="p-3">
                        {lead.googleSheetSent !== false ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            متزامن
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                            -
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-1">
                          <a
                            href={`tel:${lead.phone}`}
                            className="p-1.5 rounded-md hover:bg-sky-50 text-sky-600 transition-colors"
                            title="اتصال هاتفي"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
