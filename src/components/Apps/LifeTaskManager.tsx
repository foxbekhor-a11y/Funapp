import React, { useState, useEffect } from 'react';
import { Activity, Cpu, AlertOctagon, RefreshCw, XCircle } from 'lucide-react';
import { LifeProcess } from '../../types/windows';
import { sounds } from '../../utils/soundEffects';

const INITIAL_PROCESSES: LifeProcess[] = [
  { name: 'overthinking.dll', pid: 1042, cpu: 92.4, mem: '148 MB', status: 'Running', description: 'Simulating arguments that will never take place' },
  { name: 'doomscrolling.sys', pid: 2048, cpu: 84.1, mem: '210 MB', status: 'Running', description: 'Consuming 3 hours of short-form video in dark room' },
  { name: 'imposter_syndrome.vxd', pid: 3012, cpu: 65.0, mem: '78 MB', status: 'Running', description: 'Convincing you that your peers will expose you' },
  { name: 'social_comparison.exe', pid: 4096, cpu: 44.2, mem: '92 MB', status: 'Running', description: 'Checking college classmates on LinkedIn to feel worse' },
  { name: 'unanswered_texts.tmp', pid: 5120, cpu: 22.8, mem: '34 MB', status: 'Not Responding', description: 'Guilt accumulator from 17 unread messages' },
  { name: 'dietary_denial.daemon', pid: 6144, cpu: 18.3, mem: '56 MB', status: 'Running', description: 'Classifying midnight snack as protein' },
  { name: 'actual_productive_work.exe', pid: 7168, cpu: 0.04, mem: '4 MB', status: 'Hung', description: 'Stalled indefinitely awaiting motivation' },
  { name: 'gym_discipline.dll', pid: 8192, cpu: 0.00, mem: '1 MB', status: 'Corrupted', description: 'Missing dependency: accountability.lib' },
  { name: 'hydration.bat', pid: 9216, cpu: 0.00, mem: '512 KB', status: 'Zombie', description: 'Only iced coffee detected in bloodstream' }
];

export const LifeTaskManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'applications' | 'processes' | 'performance'>('processes');
  const [processes, setProcesses] = useState<LifeProcess[]>(INITIAL_PROCESSES);
  const [selectedPid, setSelectedPid] = useState<number | null>(1042);
  const [endTaskAlert, setEndTaskAlert] = useState<string | null>(null);
  const [cpuHistory, setCpuHistory] = useState<number[]>([95, 92, 98, 89, 99, 94, 96, 99, 93, 97, 99]);

  // Live CPU history ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCpuHistory((prev) => {
        const nextVal = Math.min(100, Math.max(88, Math.floor(92 + Math.random() * 8)));
        return [...prev.slice(1), nextVal];
      });
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  const handleEndTask = () => {
    if (!selectedPid) return;
    const proc = processes.find((p) => p.pid === selectedPid);
    if (!proc) return;

    sounds.playError();
    if (proc.name.includes('productive') || proc.name.includes('gym')) {
      setEndTaskAlert(`Cannot terminate '${proc.name}': Process is already dead or never started.`);
    } else {
      setEndTaskAlert(
        `Warning: Ending '${proc.name}' failed. The operation was denied by your subconscious. Error code: 0x80004005 (ACCESS_DENIED_TO_PEACE_OF_MIND).`
      );
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] font-win98 text-xs p-1 select-none">
      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[#808080] mb-2">
        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab('applications');
          }}
          className={`px-3 py-1 text-xs font-semibold ${
            activeTab === 'applications'
              ? 'win98-sunken bg-white border-b-0 -mb-[1px] z-10'
              : 'win98-raised bg-[#d4d4d4] hover:bg-[#e0e0e0]'
          }`}
        >
          Life Applications
        </button>
        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab('processes');
          }}
          className={`px-3 py-1 text-xs font-semibold ${
            activeTab === 'processes'
              ? 'win98-sunken bg-white border-b-0 -mb-[1px] z-10'
              : 'win98-raised bg-[#d4d4d4] hover:bg-[#e0e0e0]'
          }`}
        >
          Processes ({processes.length})
        </button>
        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab('performance');
          }}
          className={`px-3 py-1 text-xs font-semibold ${
            activeTab === 'performance'
              ? 'win98-sunken bg-white border-b-0 -mb-[1px] z-10'
              : 'win98-raised bg-[#d4d4d4] hover:bg-[#e0e0e0]'
          }`}
        >
          Performance
        </button>
      </div>

      {/* Tab 1: Applications */}
      {activeTab === 'applications' && (
        <div className="flex-1 bg-white win98-sunken p-1 overflow-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#d4d4d4] border-b border-[#808080] text-[11px] font-bold">
                <th className="p-1.5 win98-raised-sm">Task</th>
                <th className="p-1.5 win98-raised-sm w-36">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { task: 'Dating Life', status: 'Not Responding' },
                { task: 'Career Trajectory', status: 'Suspended (Awaiting Direction)' },
                { task: 'Sleep Schedule (8 Hours)', status: 'Corrupted' },
                { task: 'Financial Discipline', status: 'Critical Deficit' },
                { task: 'Mental Equilibrium', status: 'Crashing' },
              ].map((app, idx) => (
                <tr key={idx} className="hover:bg-[#000080] hover:text-white cursor-pointer group">
                  <td className="p-1.5 border-b border-gray-100 flex items-center gap-1.5">
                    <span className="text-red-600 group-hover:text-yellow-200">⚠️</span>
                    <span>{app.task}</span>
                  </td>
                  <td className="p-1.5 border-b border-gray-100 text-red-700 font-semibold group-hover:text-yellow-200">
                    {app.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Processes */}
      {activeTab === 'processes' && (
        <div className="flex-1 bg-white win98-sunken p-1 overflow-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="bg-[#d4d4d4] border-b border-[#808080] text-[11px] font-bold font-win98">
                <th className="p-1 win98-raised-sm">Image Name</th>
                <th className="p-1 win98-raised-sm w-16">PID</th>
                <th className="p-1 win98-raised-sm w-16">CPU %</th>
                <th className="p-1 win98-raised-sm w-20">Mem Usage</th>
                <th className="p-1 win98-raised-sm">What it's doing</th>
              </tr>
            </thead>
            <tbody>
              {processes.map((proc) => {
                const isSelected = selectedPid === proc.pid;
                return (
                  <tr
                    key={proc.pid}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedPid(proc.pid);
                    }}
                    className={`cursor-pointer ${
                      isSelected
                        ? 'bg-[#000080] text-white font-bold'
                        : 'hover:bg-[#e8f0fe] text-black'
                    }`}
                  >
                    <td className="p-1 border-b border-gray-200 font-semibold">{proc.name}</td>
                    <td className="p-1 border-b border-gray-200">{proc.pid}</td>
                    <td className={`p-1 border-b border-gray-200 ${proc.cpu > 50 ? 'text-red-600 font-bold' : ''} ${isSelected ? '!text-yellow-300' : ''}`}>
                      {proc.cpu.toFixed(1)}%
                    </td>
                    <td className="p-1 border-b border-gray-200">{proc.mem}</td>
                    <td className="p-1 border-b border-gray-200 truncate max-w-[200px] text-[10px] opacity-90">
                      {proc.description}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Performance */}
      {activeTab === 'performance' && (
        <div className="flex-1 bg-[#000000] win98-sunken p-3 text-green-400 font-retro-mono flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-green-800 pb-2 mb-2">
              <div className="text-sm font-bold flex items-center gap-1.5">
                <Activity size={16} className="text-green-400" />
                <span>CPU USAGE: 99% (MAXIMUM PANIC)</span>
              </div>
              <span className="text-xs text-green-500">THREADS: 84 OVERTHINKING</span>
            </div>

            {/* Oscilloscope Grid */}
            <div className="h-28 w-full border border-green-800/80 bg-green-950/20 relative p-1 flex items-end gap-1">
              {cpuHistory.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end items-center h-full">
                  <div
                    className="w-full bg-green-500 shadow-[0_0_8px_#00ff00] transition-all duration-300"
                    style={{ height: `${val}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="text-[10px] text-green-600 text-right mt-1">
              Time (Last 30 seconds of unproductive anxiety)
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-green-800 text-xs space-y-1">
            <div className="flex justify-between">
              <span>Memory Allocated:</span>
              <span className="text-white">504 MB / 512 MB (98.4%)</span>
            </div>
            <div className="flex justify-between">
              <span>Primary Resource Hog:</span>
              <span className="text-red-400 font-bold">Unresolved Regrets v2.1</span>
            </div>
            <div className="flex justify-between">
              <span>Remaining Sanity:</span>
              <span className="text-yellow-400">1.6% (Pagefile Exhausted)</span>
            </div>
          </div>
        </div>
      )}

      {/* Alert popup if end task fails */}
      {endTaskAlert && (
        <div className="mt-2 p-2 bg-[#ffffcc] win98-raised border border-black flex items-start justify-between text-[11px] text-black">
          <div className="flex items-start gap-1.5">
            <AlertOctagon size={16} className="text-red-700 shrink-0 mt-0.5" />
            <p>{endTaskAlert}</p>
          </div>
          <button
            onClick={() => setEndTaskAlert(null)}
            className="text-xs font-bold px-1 hover:bg-black/10 ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Footer Controls */}
      <div className="mt-2 flex items-center justify-between pt-1 border-t border-[#808080]">
        <div className="text-[11px] text-gray-700">
          Processes: <strong className="text-black">{processes.length}</strong> · CPU Usage: <strong className="text-red-700">99%</strong>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleEndTask}
            disabled={!selectedPid}
            className="px-3 py-1.5 bg-[#c0c0c0] win98-raised win98-btn font-bold hover:bg-[#d4d4d4] active:bg-[#a0a0a0] text-black disabled:opacity-50"
          >
            End Task (Admit Defeat)
          </button>
        </div>
      </div>
    </div>
  );
};
