'use client';

import React, { useState } from 'react';
import { X, Ruler, Sparkles } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose, category }) => {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  if (!isOpen) return null;

  const chartInches = [
    { size: 'XS', bust: '31 - 33', waist: '24 - 26', hip: '34 - 36', length: '46 - 54' },
    { size: 'S', bust: '33 - 35', waist: '26 - 28', hip: '36 - 38', length: '47 - 55' },
    { size: 'M', bust: '35 - 37', waist: '28 - 30', hip: '38 - 40', length: '48 - 56' },
    { size: 'L', bust: '37 - 40', waist: '30 - 33', hip: '40 - 43', length: '49 - 56' },
    { size: 'XL', bust: '40 - 43', waist: '33 - 36', hip: '43 - 46', length: '50 - 57' },
    { size: 'XXL', bust: '43 - 46', waist: '36 - 39', hip: '46 - 49', length: '50 - 57' },
  ];

  const chartCm = [
    { size: 'XS', bust: '78 - 84', waist: '61 - 66', hip: '86 - 91', length: '117 - 137' },
    { size: 'S', bust: '84 - 89', waist: '66 - 71', hip: '91 - 96', length: '119 - 140' },
    { size: 'M', bust: '89 - 94', waist: '71 - 76', hip: '96 - 102', length: '122 - 142' },
    { size: 'L', bust: '94 - 102', waist: '76 - 84', hip: '102 - 109', length: '124 - 142' },
    { size: 'XL', bust: '102 - 109', waist: '84 - 91', hip: '109 - 117', length: '127 - 145' },
    { size: 'XXL', bust: '109 - 117', waist: '91 - 99', hip: '117 - 124', length: '127 - 145' },
  ];

  const activeChart = unit === 'in' ? chartInches : chartCm;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#141418] border border-[#2B2B36] rounded-2xl shadow-2xl p-6 text-[#EFEFF5] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#252530]">
          <div className="flex items-center space-x-2">
            <Ruler className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="font-editorial text-xl font-bold text-white tracking-wide">
              DS Wardrobe Sizing Guide
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#888896] hover:text-white rounded-full hover:bg-[#202026] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Unit Toggle */}
        <div className="flex items-center justify-between py-4">
          <p className="text-xs text-[#9E9EAA]">
            Standard tailored measurements for ready-to-wear drops ({category || 'All apparel'}).
          </p>
          <div className="flex items-center bg-[#1D1D24] p-1 rounded-lg border border-[#2B2B36] text-xs font-semibold">
            <button
              onClick={() => setUnit('in')}
              className={`px-3 py-1 rounded-md transition-all ${
                unit === 'in' ? 'bg-[#D4AF37] text-black font-bold' : 'text-[#8A8A96] hover:text-white'
              }`}
            >
              Inches
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 rounded-md transition-all ${
                unit === 'cm' ? 'bg-[#D4AF37] text-black font-bold' : 'text-[#8A8A96] hover:text-white'
              }`}
            >
              CM
            </button>
          </div>
        </div>

        {/* Sizing Table */}
        <div className="overflow-x-auto rounded-xl border border-[#272733] bg-[#18181F]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1F1F28] text-[#D4AF37] uppercase font-bold tracking-wider text-[11px] border-b border-[#282835]">
              <tr>
                <th className="py-3 px-3.5">Size</th>
                <th className="py-3 px-3.5">Bust ({unit})</th>
                <th className="py-3 px-3.5">Waist ({unit})</th>
                <th className="py-3 px-3.5">Hips ({unit})</th>
                <th className="py-3 px-3.5">Length ({unit})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#22222E] text-[#D6D6E0]">
              {activeChart.map(row => (
                <tr key={row.size} className="hover:bg-[#20202A] transition-colors">
                  <td className="py-2.5 px-3.5 font-bold text-white">{row.size}</td>
                  <td className="py-2.5 px-3.5">{row.bust}</td>
                  <td className="py-2.5 px-3.5">{row.waist}</td>
                  <td className="py-2.5 px-3.5">{row.hip}</td>
                  <td className="py-2.5 px-3.5">{row.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Fit Advice Callout */}
        <div className="mt-5 bg-[#1B1B22] p-4 rounded-xl border border-[#282836] space-y-2 text-xs text-[#A8A8B6]">
          <div className="flex items-center space-x-2 text-[#F3E5AB] font-semibold text-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>How to Measure Like a Stylist</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-[11px] leading-relaxed">
            <li><strong>Bust:</strong> Measure around the fullest part of your bust while keeping the tape horizontal.</li>
            <li><strong>Waist:</strong> Measure around your natural waistline, where your body naturally bends.</li>
            <li><strong>Between Sizes?</strong> If your measurements fall between two sizes, we recommend sizing up for structured fabrics (e.g. Brocade, Organza) and sizing down for stretch knits.</li>
            <li><strong>Need Custom Guidance?</strong> WhatsApp our personal styling concierge directly at <strong>+91 70329 32549</strong>.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
