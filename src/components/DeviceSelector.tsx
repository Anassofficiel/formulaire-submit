import React from 'react';
import { DeviceOption } from '../types';

interface DeviceSelectorProps {
  devices: DeviceOption[];
  selectedDeviceId: string;
  onSelectDevice: (device: DeviceOption) => void;
  isValid?: boolean;
  errorMessage?: string | null;
}

export const DeviceSelector: React.FC<DeviceSelectorProps> = ({
  devices,
  selectedDeviceId,
  onSelectDevice,
  errorMessage,
}) => {
  return (
    <div className="w-full flex flex-col gap-2.5">
      {/* Title */}
      <div className="flex items-center justify-between">
        <label className="text-xs sm:text-sm font-bold text-slate-700">
          اختار نوع المنتج <span className="text-rose-500">*</span>
        </label>
        <span className="text-[11px] text-slate-400 font-medium">اضغط لتحديد اختيارك</span>
      </div>

      {/* Clean Selectable Cards/Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {devices.map((device) => {
          const isSelected = selectedDeviceId === device.id;

          return (
            <button
              key={device.id}
              type="button"
              onClick={() => onSelectDevice(device)}
              className={`w-full py-3 px-3 sm:py-3.5 sm:px-4 rounded-xl text-center text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer border select-none ${
                isSelected
                  ? 'bg-blue-50/90 border-blue-600 text-blue-700 shadow-xs ring-2 ring-blue-500/20'
                  : 'bg-slate-50 hover:bg-slate-100/90 border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              {device.name}
            </button>
          );
        })}
      </div>

      {errorMessage && (
        <p className="text-xs text-rose-500 font-medium pt-0.5">{errorMessage}</p>
      )}
    </div>
  );
};
