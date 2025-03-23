"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export default function MedicineSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Array<{ name: string, id: string }>>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Query medicine suggestions - using the correct API path
  const medicineResults = useQuery(api.medicine.searchMedicines, {
    searchQuery: searchTerm,
    limit: 10,
  });

  // Update suggestions when query results change
  useEffect(() => {
    if (medicineResults && searchTerm.trim() !== "") {
      setSuggestions(medicineResults);
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [medicineResults, searchTerm]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[highlightedIndex].name);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  // Handle outside click to close suggestions
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

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setIsOpen(false);
    setHighlightedIndex(-1);
    // You could perform additional actions here, like navigating to a medicine detail page
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => searchTerm.trim() !== "" && suggestions.length > 0 && setIsOpen(true)}
          placeholder="Search medicines..."
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          autoComplete="off"
        />
        <button 
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          onClick={() => setSearchTerm("")}
        >
          {searchTerm && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>

      {isOpen && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto border border-gray-200"
        >
          <ul className="py-1">
            {suggestions.map((suggestion, index) => {
              // Highlight matching parts of the suggestion
              const parts = suggestion.name.split(new RegExp(`(${searchTerm})`, 'gi'));
              
              return (
                <li
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion.name)}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                    index === highlightedIndex ? "bg-blue-100" : ""
                  }`}
                >
                  {parts.map((part, i) => (
                    <span
                      key={i}
                      className={
                        part.toLowerCase() === searchTerm.toLowerCase()
                          ? "font-bold text-blue-600"
                          : ""
                      }
                    >
                      {part}
                    </span>
                  ))}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}