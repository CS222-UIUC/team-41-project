import { useState, useRef, useEffect } from "react";
import { CaretDown, CaretUp } from "@phosphor-icons/react";

interface DropdownProps {
  options: { id: string; title: string }[];
  onSelect: (option: { id: string; title: string }) => void;
  placeholder?: string;
}

export function Dropdown({ options, onSelect, placeholder = "Select a song..." }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<{ id: string; title: string } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (option: { id: string; title: string }) => {
    setSelectedOption(option);
    setIsOpen(false);
    onSelect(option);
  };

  return (
    <div className="relative w-full max-w-md cursor-pointer" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm flex items-center justify-between"
      >
        <span className="truncate">{selectedOption ? selectedOption.title : placeholder}</span>
        {isOpen ? (
          <CaretUp size={20} weight="bold" className="text-gray-500" />
        ) : (
          <CaretDown size={20} weight="bold" className="text-gray-500" />
        )}
      </button>

      <div
        className={`absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg transition-all duration-200 ease-in-out ${
          isOpen ? "opacity-100 transform translate-y-0" : "opacity-0 transform -translate-y-2 pointer-events-none"
        }`}
      >
        {options.map((option) => (
          <div
            key={option.id}
            onClick={() => handleSelect(option)}
            className="px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors duration-150"
          >
            {option.title}
          </div>
        ))}
      </div>
    </div>
  );
}
