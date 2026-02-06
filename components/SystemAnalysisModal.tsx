
import React, { useState, useEffect } from 'react';
import { X, Cpu, Cloud, GitFork, Activity } from 'lucide-react';
import { SystemAnalysisData } from '../types';

interface SystemAnalysisModalProps {
  onClose: () => void;
}

const generateSystemData = (): SystemAnalysisData => {
  const historyLength = 20;
  return {
    cpu: Array.from({ length: historyLength }).map(() => Math.floor(Math.random() * 80) + 10),
    networkIn: Array.from({ length: historyLength }).map(() => Math.floor(Math.random() * 200) + 50),
    networkOut: Array.from({ length: historyLength }).map(() => Math.floor(Math.random() * 150) + 30),
    activeConnections: Math.floor(Math.random() * 500) + 100,
  };
};

export const SystemAnalysisModal: React.FC<SystemAnalysisModalProps> = ({ onClose }) => {
  const [data, setData] = useState<SystemAnalysisData>(generateSystemData());
  const [cpuUsage, setCpuUsage] = useState(0);
  const [networkTraffic, setNetworkTraffic] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newCpu = [...prev.cpu.slice(1), Math.floor(Math.random() * 80) + 10];
        const newNetworkIn = [...prev.networkIn.slice(1), Math.floor(Math.random() * 200) + 50];
        const newNetworkOut = [...prev.networkOut.slice(1), Math.floor(Math.random() * 150) + 30];
        const newActiveConnections = Math.floor(Math.random() * 500) + 100;

        setCpuUsage(newCpu[newCpu.length - 1]);
        setNetworkTraffic(newNetworkIn[newNetworkIn.length - 1] + newNetworkOut[newNetworkOut.length - 1]);

        return {
          cpu: newCpu,
          networkIn: newNetworkIn,
          networkOut: newNetworkOut,
          activeConnections: newActiveConnections,
        };
      });
    }, 1500); // Update every 1.5 seconds

    return () => clearInterval(interval);
  }, []);

  const LineGraph = ({ dataPoints, color, maxValue }: { dataPoints: number[], color: string, maxValue: number }) => {
    const points = dataPoints.map((val, i) => {
      const x = (i / (dataPoints.length - 1)) * 100;
      const y = 100 - (val / maxValue) * 100;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
        <polyline fill="none" stroke={color} strokeWidth="2" points={points} />
        <linearGradient id={`${color}-gradient`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.4"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
        <path d={`M0,100 L${points} L100,100 Z`} fill={`url(#${color}-gradient)`} />
      </svg>
    );
  };

  return (
    <div className="fixed inset-0 z-[110] bg-bg-0/95 backdrop-blur-xl flex items-center justify-center p-6">
      <div className="relative w-full max-w-4xl bg-bg-1 border border-line-1 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in-95 duration-500">
        <div className="flex justify-between items-center p-10 border-b border-line-0 bg-bg-0 relative">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <h3 className="text-xl font-black text-white uppercase tracking-[0.2em] flex items-center gap-4 relative z-10 italic">
            <Cpu className="w-7 h-7 text-accent-2 animate-pulse" /> SİSTEM <span className="text-accent-2">ANALİZ PANELİ</span>
          </h3>
          <button onClick={onClose} className="text-slate-700 hover:text-white transition-all relative z-10 p-2 bg-bg-3 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-10 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-bg-2 border border-line-1 rounded-2xl p-6 flex flex-col justify-center items-center">
              <Cpu className="w-10 h-10 text-accent-2 mb-4 animate-bounce" />
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">CPU YÜKÜ</p>
              <h4 className="text-3xl font-black text-white mt-2 italic">{cpuUsage}%</h4>
            </div>
            <div className="bg-bg-2 border border-line-1 rounded-2xl p-6 flex flex-col justify-center items-center">
              <Cloud className="w-10 h-10 text-status-info mb-4 animate-pulse" />
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">AĞ TRAFİĞİ</p>
              <h4 className="text-3xl font-black text-white mt-2 italic">{networkTraffic} Mbps</h4>
            </div>
            <div className="bg-bg-2 border border-line-1 rounded-2xl p-6 flex flex-col justify-center items-center">
              <GitFork className="w-10 h-10 text-status-ok mb-4" />
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">AKTİF BAĞLANTI</p>
              <h4 className="text-3xl font-black text-white mt-2 italic">{data.activeConnections}</h4>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-bg-2 border border-line-1 rounded-2xl p-8 h-64 relative overflow-hidden">
              <h4 className="text-[10px] font-black text-text-2 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-accent-2" /> CPU Kullanımı (Son 30sn)
              </h4>
              <LineGraph dataPoints={data.cpu} color="#C10F2B" maxValue={100} />
            </div>
            <div className="bg-bg-2 border border-line-1 rounded-2xl p-8 h-64 relative overflow-hidden">
              <h4 className="text-[10px] font-black text-text-2 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-status-info" /> Ağ Trafiği (Mbps)
              </h4>
              <div className="absolute inset-0">
                <LineGraph dataPoints={data.networkIn} color="#3B82F6" maxValue={250} />
                <LineGraph dataPoints={data.networkOut} color="#10B981" maxValue={250} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
