import React, { useState } from 'react';
import { Trash2, FileText, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

interface TrashItem {
  id: string;
  name: string;
  originalLocation: string;
  dateDeleted: string;
  size: string;
  type: string;
}

const INITIAL_TRASH: TrashItem[] = [
  { id: '1', name: '2024_New_Year_Fitness_Plan.doc', originalLocation: 'C:\\Hopes\\', dateDeleted: 'Jan 4, 2024', size: '14 KB', type: 'Word 97 Document' },
  { id: '2', name: 'Unopened_Books_On_Focus.zip', originalLocation: 'C:\\Kindle\\Guilt\\', dateDeleted: 'Mar 12, 2024', size: '4.8 GB', type: 'Compressed Archive' },
  { id: '3', name: 'High_School_Potential.tmp', originalLocation: 'C:\\Nostalgia\\', dateDeleted: 'Oct 14, 2018', size: '0 bytes', type: 'Empty File' },
  { id: '4', name: 'Monthly_Budget_Strict.xls', originalLocation: 'C:\\Finances\\', dateDeleted: 'Yesterday', size: '240 KB', type: 'Excel Worksheet' },
  { id: '5', name: 'Clean_Eating_Meal_Prep.pdf', originalLocation: 'C:\\Kitchen\\', dateDeleted: '2 hours ago', size: '18 KB', type: 'Acrobat Document' },
  { id: '6', name: 'Shower_Arguments_I_Won.log', originalLocation: 'C:\\Brain\\Ego\\', dateDeleted: 'Ongoing', size: '128 MB', type: 'Text Log' },
  { id: '7', name: 'Accountability_Partner_Texts.dat', originalLocation: 'C:\\Friendships\\Ghosted\\', dateDeleted: 'Last month', size: '2 KB', type: 'Ignored Data' },
];

export const RecycleBinWindow: React.FC = () => {
  const [items, setItems] = useState<TrashItem[]>(INITIAL_TRASH);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleEmptyBin = () => {
    sounds.playTrash();
    setItems([]);
    setShowConfirm(false);
  };

  const handleRestore = () => {
    if (!selectedId) return;
    sounds.playError();
    alert("Restore Error: You cannot restore discarded resolutions. They have expired in the court of personal responsibility.");
  };

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] font-win98 text-xs p-1 select-none">
      {/* Top Toolbar */}
      <div className="flex items-center gap-1.5 p-1 bg-[#d4d4d4] win98-raised mb-1">
        <button
          onClick={() => setShowConfirm(true)}
          disabled={items.length === 0}
          className="px-2.5 py-1 bg-[#c0c0c0] win98-raised win98-btn flex items-center gap-1 font-bold hover:bg-[#e0e0e0] text-black disabled:opacity-50"
        >
          <Trash2 size={13} className="text-red-700" />
          <span>Empty Recycle Bin</span>
        </button>

        <button
          onClick={handleRestore}
          disabled={!selectedId || items.length === 0}
          className="px-2.5 py-1 bg-[#c0c0c0] win98-raised win98-btn flex items-center gap-1 hover:bg-[#e0e0e0] text-black disabled:opacity-50"
        >
          <span>Attempt to Restore</span>
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 z-[99999] flex items-center justify-center p-4">
          <div className="w-80 bg-[#c0c0c0] win98-raised p-3 shadow-2xl flex flex-col gap-3 font-win98 text-black">
            <div className="win98-titlebar px-2 py-0.5 text-white font-bold text-xs flex justify-between">
              <span>Confirm Regret Deletion</span>
              <button onClick={() => setShowConfirm(false)} className="text-white hover:text-red-300">✕</button>
            </div>
            <div className="flex items-start gap-2 text-xs">
              <AlertTriangle size={24} className="text-amber-600 shrink-0 mt-1" />
              <p>
                Are you sure you want to permanently delete all {items.length} unfulfilled promises and life regrets? This will not absolve you of emotional guilt.
              </p>
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={handleEmptyBin}
                className="px-3 py-1 bg-[#c0c0c0] win98-raised win98-btn font-bold hover:bg-[#d4d4d4]"
              >
                Yes (Purge Regrets)
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-3 py-1 bg-[#c0c0c0] win98-raised win98-btn hover:bg-[#d4d4d4]"
              >
                No (Hoard Shame)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File List Table */}
      <div className="flex-1 bg-white win98-sunken p-1 overflow-auto">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-2 p-6 text-center">
            <CheckCircle2 size={32} className="text-green-600" />
            <div className="font-bold text-sm text-gray-800">Recycle Bin is Clean!</div>
            <p className="text-xs max-w-xs">
              All past mistakes have been incinerated. Don't worry, you will generate plenty of new ones by lunchtime.
            </p>
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#d4d4d4] border-b border-[#808080] text-[11px] font-bold">
                <th className="p-1 win98-raised-sm">Name</th>
                <th className="p-1 win98-raised-sm">Original Location</th>
                <th className="p-1 win98-raised-sm">Date Deleted</th>
                <th className="p-1 win98-raised-sm">Size</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const isSelected = selectedId === item.id;
                return (
                  <tr
                    key={item.id}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedId(item.id);
                    }}
                    className={`cursor-pointer ${
                      isSelected ? 'bg-[#000080] text-white font-bold' : 'hover:bg-blue-50 text-black'
                    }`}
                  >
                    <td className="p-1 border-b border-gray-100 flex items-center gap-1.5 truncate max-w-[200px]">
                      <FileText size={13} className={isSelected ? 'text-yellow-200' : 'text-gray-600'} />
                      <span className="truncate">{item.name}</span>
                    </td>
                    <td className="p-1 border-b border-gray-100 truncate">{item.originalLocation}</td>
                    <td className="p-1 border-b border-gray-100">{item.dateDeleted}</td>
                    <td className="p-1 border-b border-gray-100">{item.size}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="p-1 text-[11px] text-gray-600 flex justify-between">
        <span>{items.length} regrets in bin</span>
        <span>Total Wasted Potential: 5.2 GB</span>
      </div>
    </div>
  );
};
