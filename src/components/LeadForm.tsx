import React, { useState } from 'react';
import { ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { LeadFormData } from '../types';
import { MOROCCAN_CITIES } from '../config/devices';
import { motion } from 'motion/react';

interface LeadFormProps {
  onSubmitLead: (data: LeadFormData) => Promise<boolean>;
  isSubmitting: boolean;
}

export const LeadForm: React.FC<LeadFormProps> = ({ onSubmitLead, isSubmitting }) => {
  const [productName, setProductName] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState(MOROCCAN_CITIES[0].split(' ')[0]);
  const [customCity, setCustomCity] = useState('');
  const [address, setAddress] = useState('');

  // Touched state for validation feedback
  const [touched, setTouched] = useState<{
    fullName?: boolean;
    phone?: boolean;
    city?: boolean;
    address?: boolean;
    productName?: boolean;
  }>({});

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Validation calculations
  const trimmedName = fullName.trim();
  const isNameValid = trimmedName.length >= 2;

  // Phone number must accept exactly 10 digits
  const phoneDigitsOnly = phone.replace(/[^0-9]/g, '');
  const isPhoneValid = phoneDigitsOnly.length === 10;

  const activeCity = city === 'مدينة أخرى...' ? customCity.trim() : city.trim();
  const isCityValid = activeCity.length > 0;

  const trimmedAddress = address.trim();
  const isAddressValid = trimmedAddress.length >= 3;

  // Field error messages
  const getNameError = () => {
    if (!touched.fullName && !hasSubmitted) return null;
    if (!trimmedName) return 'الاسم الكامل مطلوب';
    if (trimmedName.length < 2) return 'يرجى إدخال اسم صحيح';
    return null;
  };

  const getPhoneError = () => {
    if (!touched.phone && !hasSubmitted) return null;
    if (!phone.trim()) return 'رقم الهاتف مطلوب';
    if (phoneDigitsOnly.length !== 10) {
      return `يجب أن يتكون رقم الهاتف من 10 أرقام بالضبط (حالياً ${phoneDigitsOnly.length} أرقام) - مثال: 0612345678`;
    }
    return null;
  };

  const getCityError = () => {
    if (!touched.city && !hasSubmitted) return null;
    if (!isCityValid) return 'يرجى اختيار أو تحديد المدينة';
    return null;
  };

  const getAddressError = () => {
    if (!touched.address && !hasSubmitted) return null;
    if (!trimmedAddress) return 'العنوان الكامل مطلوب';
    if (trimmedAddress.length < 3) return 'يرجى إدخال عنوان صحيح ومفصل';
    return null;
  };

  const nameError = getNameError();
  const phoneError = getPhoneError();
  const cityError = getCityError();
  const addressError = getAddressError();

  const handleBlur = (field: 'fullName' | 'phone' | 'city' | 'address' | 'productName') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Border class helper for validation
  const getFieldBorderClass = (isValid: boolean, isFieldTouched: boolean, hasValue: boolean) => {
    if (isFieldTouched || hasSubmitted) {
      if (!isValid) {
        return 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/20 text-slate-800';
      }
      return 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/10 text-slate-800';
    }
    if (hasValue && isValid) {
      return 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/10 text-slate-800';
    }
    return 'border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-400/20 text-slate-800';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    setErrorMsg(null);

    // Validate in order: Name -> Phone -> City -> Address
    if (!isNameValid) {
      setErrorMsg('يرجى إدخال الاسم الكامل بشكل صحيح');
      return;
    }

    if (!isPhoneValid) {
      setErrorMsg('رقم الهاتف يجب أن يتكون من 10 أرقام بالضبط (مثال: 0612345678)');
      return;
    }

    if (!isCityValid) {
      setErrorMsg('يرجى اختيار أو إدخال المدينة');
      return;
    }

    if (!isAddressValid) {
      setErrorMsg('يرجى إدخال العنوان الكامل');
      return;
    }

    const trimmedProduct = productName.trim();

    const leadData: LeadFormData = {
      fullName: trimmedName,
      phone: phoneDigitsOnly,
      city: activeCity,
      address: trimmedAddress,
      deviceId: 'custom',
      deviceName: trimmedProduct || 'غير محدد',
      additionalMessage: trimmedProduct || undefined,
    };

    const success = await onSubmitLead(leadData);
    if (!success) {
      setErrorMsg('حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى');
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 sm:p-8 border border-slate-100 relative overflow-hidden">
      {/* Top Accent Strip */}
      <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-l from-blue-500 to-emerald-400 rounded-t-3xl" />

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Global Error Alert if any */}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs sm:text-sm flex items-center gap-2 font-medium"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </motion.div>
        )}

        {/* 1. Product Type Input (Optional Single Text Input) */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="productName" className="text-xs sm:text-sm font-bold text-slate-700">
              اكتب نوع المنتج الذي تريده بالضبط
            </label>
            <span className="text-[11px] text-slate-400 font-normal">اختياري</span>
          </div>
          <input
            id="productName"
            type="text"
            placeholder="مثال: ثلاجة Samsung أو فران أو ماكينة صابون أو غسالة ماعن أو بلاك..."
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            onBlur={() => handleBlur('productName')}
            className={`w-full rounded-xl px-4 py-3.5 text-sm transition-all text-right placeholder:text-slate-400 outline-none border ${
              productName.trim()
                ? 'border-emerald-500/70 bg-emerald-50/10 text-slate-800'
                : 'border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-400/20 text-slate-800'
            }`}
          />
        </div>

        {/* 2. Customer Contact Info: Full Name & Phone Number */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="fullName" className="text-xs font-bold text-slate-700">
                الاسم الكامل <span className="text-rose-500">*</span>
              </label>
              {(touched.fullName || hasSubmitted) && isNameValid && (
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>صحيح</span>
                </span>
              )}
            </div>
            <input
              id="fullName"
              type="text"
              required
              placeholder="مثال: مصطفى العلمي"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              onBlur={() => handleBlur('fullName')}
              className={`w-full rounded-xl px-4 py-3 text-sm transition-all text-right placeholder:text-slate-400 outline-none border ${getFieldBorderClass(
                isNameValid,
                Boolean(touched.fullName),
                Boolean(fullName)
              )}`}
            />
            {nameError && (
              <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{nameError}</span>
              </p>
            )}
          </div>

          {/* Phone Number (10 Digits strictly validated) */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="phone" className="text-xs font-bold text-slate-700">
                رقم الهاتف <span className="text-rose-500">*</span>
              </label>
              {(touched.phone || hasSubmitted) && isPhoneValid && (
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>10 أرقام (صحيح)</span>
                </span>
              )}
            </div>
            <div className="relative">
              <input
                id="phone"
                type="tel"
                required
                dir="ltr"
                maxLength={14}
                placeholder="0612345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onBlur={() => handleBlur('phone')}
                className={`w-full rounded-xl px-4 py-3 text-sm transition-all text-left font-mono placeholder:text-slate-400 outline-none border ${getFieldBorderClass(
                  isPhoneValid,
                  Boolean(touched.phone),
                  Boolean(phone)
                )}`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-mono text-slate-400 pointer-events-none">
                {phoneDigitsOnly.length}/10
              </span>
            </div>
            {phoneError ? (
              <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{phoneError}</span>
              </p>
            ) : (
              <p className="text-[11px] text-slate-400">
                * يجب إدخال 10 أرقام بالضبط (مثال: 0612345678)
              </p>
            )}
          </div>
        </div>

        {/* 3. City Selection */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="city" className="text-xs font-bold text-slate-700">
              المدينة <span className="text-rose-500">*</span>
            </label>
            {(touched.city || hasSubmitted) && isCityValid && (
              <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>محددة</span>
              </span>
            )}
          </div>
          <select
            id="city"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              handleBlur('city');
            }}
            onBlur={() => handleBlur('city')}
            className={`w-full rounded-xl px-4 py-3 text-sm transition-all text-right font-medium outline-none border cursor-pointer ${getFieldBorderClass(
              isCityValid,
              Boolean(touched.city),
              Boolean(city)
            )}`}
          >
            {MOROCCAN_CITIES.map((c, i) => (
              <option key={i} value={c.split(' ')[0]}>
                {c}
              </option>
            ))}
          </select>

          {/* Quick city shortcuts */}
          <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
            <span className="text-[10px] text-slate-400">مدن شائعة:</span>
            {['الدار البيضاء', 'الرباط', 'طنجة', 'مراكش', 'فاس', 'أكادير'].map((topCity) => (
              <button
                type="button"
                key={topCity}
                onClick={() => {
                  setCity(topCity);
                  handleBlur('city');
                }}
                className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all cursor-pointer ${
                  city === topCity
                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {topCity}
              </button>
            ))}
          </div>

          {/* If "مدينة أخرى" selected */}
          {city.includes('أخرى') && (
            <input
              type="text"
              placeholder="اكتب اسم مدينتك هنا..."
              value={customCity}
              onChange={(e) => setCustomCity(e.target.value)}
              onBlur={() => handleBlur('city')}
              className={`w-full rounded-xl px-4 py-2.5 text-sm transition-all text-right mt-1 outline-none border ${getFieldBorderClass(
                customCity.trim().length > 0,
                Boolean(touched.city),
                Boolean(customCity)
              )}`}
              required
            />
          )}
          {cityError && (
            <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{cityError}</span>
            </p>
          )}
        </div>

        {/* 4. Full Address (Required) directly below City */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="address" className="text-xs font-bold text-slate-700">
              العنوان الكامل <span className="text-rose-500">*</span>
            </label>
            {(touched.address || hasSubmitted) && isAddressValid && (
              <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>صحيح</span>
              </span>
            )}
          </div>
          <input
            id="address"
            type="text"
            required
            placeholder="مثال: الحي، الشارع، رقم المنزل..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onBlur={() => handleBlur('address')}
            className={`w-full rounded-xl px-4 py-3 text-sm transition-all text-right placeholder:text-slate-400 outline-none border ${getFieldBorderClass(
              isAddressValid,
              Boolean(touched.address),
              Boolean(address)
            )}`}
          />
          {addressError && (
            <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{addressError}</span>
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-l from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200/60 transition-all transform active:scale-98 flex items-center justify-center gap-3 text-base sm:text-lg cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>جاري تسجيل طلبك...</span>
              </>
            ) : (
              <>
                <span>تأكيد الطلب</span>
                <ArrowLeft className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* Subtle Reassurance */}
        <p className="text-center text-[11px] text-slate-400">
          🔒 لن تدفع أي درهم حتى تستلم وتتأكد من طلبك شخصياً. التوصيل متوفر لجميع المدن.
        </p>
      </form>
    </div>
  );
};
