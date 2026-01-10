import React from 'react';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

const IllegalMoves = ({ enabled, onToggle }) => {
  return (
    <button 
        onClick={onToggle} 
        className="flex flex-col items-center gap-1.5 p-2 hover:bg-white/5 rounded-lg group min-w-[55px] transition-all"
        title={enabled ? "Illegal Moves Allowed" : "Standard Rules Enforced"}
    >
        <div className={`p-2 rounded-full transition-colors ${
            enabled 
            ? 'bg-amber-500/10 group-hover:bg-amber-500/20' 
            : 'bg-[#252525] group-hover:bg-[#333]'
        }`}>
            {enabled ? (
                <ShieldAlert className="w-4 h-4 text-amber-500" />
            ) : (
                <ShieldCheck className="w-4 h-4 text-green-500" />
            )}
        </div>
        
        <span className={`text-[9px] uppercase font-bold tracking-wider ${
            enabled ? 'text-amber-500/80' : 'text-gray-500 group-hover:text-gray-300'
        }`}>
            {enabled ? 'Free' : 'Strict'}
        </span>
    </button>
  );
};

export default IllegalMoves;