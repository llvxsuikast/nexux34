
import React from 'react';
import { RoleDefinition, QueryType, MenuItem } from '../types';
import { MENU_ITEMS } from './Sidebar';
import { Check, X, GitFork } from 'lucide-react';

interface PermissionMatrixProps {
  roles: RoleDefinition[];
}

export const PermissionMatrix: React.FC<PermissionMatrixProps> = ({ roles }) => {
  const categories = [
    { id: 'PERSONAL', label: 'KİŞİSEL & KİMLİK' },
    { id: 'POPULATION', label: 'NÜFUS & AİLE' },
    { id: 'LOCATION', label: 'ADRES & KONUM' },
    { id: 'GSM', label: 'GSM & İLETİŞİM' },
    { id: 'FINANCE', label: 'FİNANS & VARLIK' },
    { id: 'LEGAL', label: 'ADLİ & RESMİ' },
    { id: 'REPORT', label: 'ANALİZ & RAPOR' },
  ];

  const groupedMenuItems: { [key: string]: MenuItem[] } = MENU_ITEMS.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as { [key: string]: MenuItem[] });

  return (
    <div className="space-y-10">
      <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4 italic flex items-center gap-3">
        <GitFork className="w-7 h-7 text-gold-0" /> YETKİ <span className="text-gold-0">MATRİSİ</span>
      </h3>
      <p className="text-sm text-slate-500 max-w-xl leading-relaxed font-mono italic">
        Tanımlanmış her rolün sistemdeki sorgu türlerine erişimini görsel olarak inceleyin. Her kategorideki yetkiler, renk kodları ile rollere atanmıştır.
      </p>

      {categories.map(category => (
        <div key={category.id} className="bg-bg-0/60 border border-line-1 rounded-2xl p-6 relative overflow-hidden shadow-inner">
          <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-600" /> {category.label}
          </h4>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
                  <th className="p-3 whitespace-nowrap">Sorgu Tipi</th>
                  {roles.map(role => (
                    <th key={role.id} className="p-3 text-center whitespace-nowrap" style={{ color: role.color }}>
                      {role.name.replace(/_/g, ' ')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line-0/30">
                {(groupedMenuItems[category.id] || []).map(item => (
                  <tr key={item.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="p-3 text-[11px] font-mono text-white whitespace-nowrap">
                      <div className="flex items-center gap-2">
                          <item.icon className="w-3.5 h-3.5 text-slate-700" />
                          {item.label}
                      </div>
                    </td>
                    {roles.map(role => {
                      const hasPermission = role.permissions.includes(item.id);
                      return (
                        <td key={role.id} className="p-3 text-center">
                          {hasPermission ? (
                            <Check className="w-4 h-4 text-status-ok mx-auto" />
                          ) : (
                            <X className="w-4 h-4 text-slate-700 mx-auto" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};
