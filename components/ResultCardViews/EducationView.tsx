
import React from 'react';
import { GraduationCap, BookOpen } from 'lucide-react';

interface EducationViewProps {
  data: any;
}

export const EducationView: React.FC<EducationViewProps> = ({ data }) => (
    <div className="space-y-6">
        {data.degrees && (
            <div className="bg-bg-2 border border-purple-900/30 p-4 rounded-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 p-4 opacity-10"><GraduationCap className="w-16 h-16 text-purple-500" /></div>
                <h4 className="text-[10px] font-black text-purple-400 uppercase mb-3">Eğitim Geçmişi</h4>
                <div className="space-y-3">
                    {data.degrees.map((degree: any, i: number) => (
                        <div key={i} className="p-3 bg-bg-3 rounded-lg border border-line-0 flex justify-between items-center hover:border-purple-500/50 transition-colors">
                            <div>
                                <div className="text-xs font-bold text-white">{degree.okul}</div>
                                <div className="text-[10px] text-text-2">{degree.bolum} ({degree.derece})</div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-text-1">Mezuniyet: {degree.tarih}</div>
                                {degree.gpa && <div className="text-[9px] text-text-2 mt-1">GPA: {degree.gpa}</div>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
        {data.exams && (
            <div className="bg-bg-2 border border-line-0 rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-bg-3 border-b border-line-0 text-[10px] font-black text-text-1 uppercase flex items-center gap-2">
                    <BookOpen className="w-3 h-3" /> Sınav Sonuçları
                </div>
                {data.exams.map((exam: any, i: number) => (
                    <div key={i} className="p-4 border-b border-line-0 last:border-0 flex justify-between items-center hover:bg-bg-3/50 transition-colors">
                        <div>
                            <div className="font-bold text-white text-xs">{exam.name}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-text-1">Puan: <span className="text-emerald-400">{exam.score}</span></div>
                            <div className="text-[10px] text-text-2">{exam.date}</div>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
);
