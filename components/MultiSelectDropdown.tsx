
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';

export interface Option {
  label: string;
  value: string;
  group?: string;
}

interface MultiSelectDropdownProps {
  label: string;
  icon: React.ElementType;
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  align?: 'left' | 'right';
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({ label, icon: Icon, options, selectedValues, onChange, align = 'left' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleOption = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(v => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  // Group options
  const groupedOptions = options.reduce((acc, opt) => {
    const group = opt.group || 'default';
    if (!acc[group]) acc[group] = [];
    acc[group].push(opt);
    return acc;
  }, {} as Record<string, Option[]>);

  const groups = Object.keys(groupedOptions);
  const hasGroups = groups.length > 1 || (groups.length === 1 && groups[0] !== 'default');

  return (
    <div className="relative" ref={containerRef}>
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1 mb-2">
        <Icon size={12}/> {label}
      </label>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-2 border rounded-lg text-sm flex items-center justify-between transition outline-none ${selectedValues.length > 0 ? 'bg-lark-50 border-lark-200 text-lark-700' : 'bg-white border-gray-200 text-gray-600'}`}
      >
        <span className="truncate text-left flex-1 mr-2">
          {selectedValues.length === 0 ? '全部' : `已选 ${selectedValues.length} 项`}
        </span>
        <div className="flex items-center gap-1">
          {selectedValues.length > 0 && (
            <div onClick={clearSelection} className="p-0.5 rounded-full hover:bg-lark-200 text-lark-400 hover:text-lark-600 transition">
               <X size={12} />
            </div>
          )}
          <ChevronDown size={14} className={`text-gray-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <div className={`absolute z-50 top-full ${align === 'right' ? 'right-0' : 'left-0'} w-full min-w-[200px] mt-1 bg-white border border-gray-100 rounded-lg shadow-xl max-h-80 overflow-y-auto custom-scrollbar py-1`}>
          {hasGroups ? (
            groups.map(group => (
              <div key={group} className="mb-2 last:mb-0">
                <div className="px-3 py-1.5 text-xs font-bold text-gray-400 bg-gray-50 sticky top-0 border-b border-gray-100 mb-1">{group}</div>
                {groupedOptions[group].map(opt => (
                  <div 
                    key={opt.value}
                    onClick={() => handleToggleOption(opt.value)}
                    className={`flex items-center gap-2 px-3 py-2 cursor-pointer text-sm transition mx-1 rounded hover:bg-gray-50 ${selectedValues.includes(opt.value) ? 'bg-lark-50 text-lark-700' : 'text-gray-700'}`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${selectedValues.includes(opt.value) ? 'bg-lark-500 border-lark-500' : 'border-gray-300 bg-white'}`}>
                       {selectedValues.includes(opt.value) && <Check size={10} className="text-white" />}
                    </div>
                    <span className="truncate">{opt.label}</span>
                  </div>
                ))}
              </div>
            ))
          ) : (
            options.map(opt => (
              <div 
                key={opt.value}
                onClick={() => handleToggleOption(opt.value)}
                className={`flex items-center gap-2 px-3 py-2 cursor-pointer text-sm transition mx-1 rounded hover:bg-gray-50 ${selectedValues.includes(opt.value) ? 'bg-lark-50 text-lark-700' : 'text-gray-700'}`}
              >
                <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${selectedValues.includes(opt.value) ? 'bg-lark-500 border-lark-500' : 'border-gray-300 bg-white'}`}>
                   {selectedValues.includes(opt.value) && <Check size={10} className="text-white" />}
                </div>
                <span className="truncate">{opt.label}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
