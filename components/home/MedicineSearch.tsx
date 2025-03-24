"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { debounce } from "lodash";

interface MedicineData {
  id: Id<"medicine_data">;
  name: string;
  category: string;
  manufacturer: string;
  mrp: number;
  availability?: string;
  packSize?: string;
  discount?: number;
}

export default function MedicineSearch({ 
  onSelect 
}: { 
  onSelect?: (medicine: MedicineData) => void 
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<MedicineData[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const highlightedItemRef = useRef<HTMLLIElement>(null);

  const debouncedSetSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearchTerm(value);
    }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSetSearch(value);
    
    if (value.trim() === "") {
      setIsOpen(false);
    }
  };

  const medicineResults = useQuery(api.medicine.searchMedicines, {
    searchQuery: debouncedSearchTerm,
    limit: 10,
  });

  useEffect(() => {
    if (debouncedSearchTerm.trim() === "") {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    
    if (medicineResults) {
      setSuggestions(medicineResults);
      setIsOpen(true);
      setIsLoading(false);
    }
  }, [medicineResults, debouncedSearchTerm]);

  useEffect(() => {
    if (highlightedIndex >= 0 && highlightedItemRef.current) {
      highlightedItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [highlightedIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;
    
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSuggestionClick(suggestions[highlightedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        inputRef.current?.blur();
        break;
      case "Tab":
        setIsOpen(false);
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSuggestionClick = (medicine: MedicineData) => {
    setSearchTerm(medicine.name);
    setIsOpen(false);
    setHighlightedIndex(-1);
    
    if (onSelect) {
      onSelect(medicine);
    }
    
    inputRef.current?.blur();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(price);
  };

  const calculateDiscountedPrice = (mrp: number, discountDecimal: number) => {
    return mrp - (mrp * discountDecimal);
  };

  const formatDiscountPercentage = (discountDecimal: number) => {
    return Math.round(discountDecimal * 100);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setSuggestions([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full medicine-search">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          onFocus={() => debouncedSearchTerm.trim() !== "" && suggestions.length > 0 && setIsOpen(true)}
          placeholder="Search medicines..."
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800"
          autoComplete="off"
        />
        <div className="search-icon absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        {searchTerm && (
          <button 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
            onClick={clearSearch}
            aria-label="Clear search"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </button>
        )}
        
        {isLoading && searchTerm && (
          <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute z-50 mt-1 w-full bg-white rounded-lg shadow-md max-h-80 overflow-auto border border-gray-200 results-container"
        >
          <ul className="py-1 divide-y divide-gray-100">
            {suggestions.map((medicine, index) => {
              const isHighlighted = index === highlightedIndex;
              const discountedPrice = calculateDiscountedPrice(medicine.mrp, medicine.discount || 0);
              
              return (
                <li
                  ref={isHighlighted ? highlightedItemRef : null}
                  key={medicine.id}
                  onClick={() => handleSuggestionClick(medicine)}
                  className={`px-3 py-2 cursor-pointer ${
                    isHighlighted ? "bg-blue-100" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-sm text-gray-800">{medicine.name}</div>
                      <div className="text-xs text-gray-600 mt-0.5">
                        {medicine.manufacturer} • {medicine.category}
                        {medicine.packSize && ` • ${medicine.packSize}`}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center">
                        <span className="text-xs text-gray-600 line-through mr-1">
                          {formatPrice(medicine.mrp)}
                        </span>
                        <span className="text-xs font-medium text-green-700">
                          {formatPrice(discountedPrice)}
                        </span>
                      </div>
                      {medicine.discount && medicine.discount > 0 && (
                        <div className="text-xs text-blue-700">
                          {formatDiscountPercentage(medicine.discount)}% off
                        </div>
                      )}
                      {medicine.availability && (
                        <div className={`text-xs mt-0.5 px-1.5 py-0.5 rounded-full inline-block ${
                          medicine.availability === 'In Stock' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {medicine.availability}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      
      {isOpen && searchTerm && suggestions.length === 0 && !isLoading && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded-lg shadow-md border border-gray-200 p-4 text-center">
          <p className="text-gray-700 text-sm">No medicines found matching "{searchTerm}"</p>
          <p className="text-gray-600 text-xs mt-1">Try a different search term</p>
        </div>
      )}
    </div>
  );
}