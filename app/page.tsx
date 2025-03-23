"use client";

import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import Link from "next/link";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Id } from "../convex/_generated/dataModel";

export default function Home() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-10 bg-background p-4 border-b-2 border-slate-200 dark:border-slate-800 flex flex-row justify-between items-center">
        <span className="font-semibold">Convex + Next.js + Convex Auth</span>
        <div className="flex items-center gap-4">
          <button
            className="bg-slate-200 dark:bg-slate-800 text-foreground rounded-md px-2 py-1 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            {isSearchOpen ? "Close" : "Search"}
          </button>
          <SignOutButton />
        </div>
      </header>
      
      {isSearchOpen && (
        <div className="p-4 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <MedicineSearch />
        </div>
      )}
      
      <main className="p-8 flex flex-col gap-8">
        <h1 className="text-4xl font-bold text-center">
          Convex + Next.js + Convex Auth
        </h1>
        <Content />
      </main>
      <footer className="p-4 text-center text-sm text-gray-500">
        Built with Convex, Next.js and Tailwind CSS
      </footer>
    </>
  );
}

// Define the proper type for medicine data from the API
interface MedicineData {
  id: Id<"medicine_data">;
  name: string;
  category: string;
  manufacturer: string;
  mrp: number;
}

function MedicineSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<MedicineData[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Query medicine suggestions
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

  // Format price to currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
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
          autoFocus
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
          className="absolute z-10 mt-1 w-full bg-white dark:bg-slate-700 rounded-md shadow-lg max-h-60 overflow-auto border border-gray-200 dark:border-slate-600"
        >
          <ul className="py-1">
            {suggestions.map((suggestion, index) => {
              // Highlight matching parts of the suggestion
              const parts = suggestion.name.split(new RegExp(`(${searchTerm})`, 'gi'));
              
              return (
                <li
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion.name)}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 ${
                    index === highlightedIndex ? "bg-blue-100 dark:bg-blue-800" : ""
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      {parts.map((part, i) => (
                        <span
                          key={i}
                          className={
                            part.toLowerCase() === searchTerm.toLowerCase()
                              ? "font-bold text-blue-600 dark:text-blue-400"
                              : ""
                          }
                        >
                          {part}
                        </span>
                      ))}
                    </div>
                    <div className="text-sm font-medium text-green-600 dark:text-green-400">
                      {formatPrice(suggestion.mrp)}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

function SignOutButton() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  const router = useRouter();
  return (
    <>
      {isAuthenticated && (
        <button
          className="bg-slate-200 dark:bg-slate-800 text-foreground rounded-md px-2 py-1 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
          onClick={() =>
            void signOut().then(() => {
              router.push("/signin");
            })
          }
        >
          Sign out
        </button>
      )}
    </>
  );
}

function Content() {
  const { viewer, numbers } =
    useQuery(api.myFunctions.listNumbers, {
      count: 10,
    }) ?? {};
  const addNumber = useMutation(api.myFunctions.addNumber);

  if (viewer === undefined || numbers === undefined) {
    return (
      <div className="mx-auto">
        <div className="flex flex-col gap-4 max-w-lg mx-auto animate-pulse">
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
          <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-40"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-lg mx-auto">
      <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg shadow-sm">
        <p className="text-xl font-semibold mb-2">Welcome {viewer ?? "Anonymous"}!</p>
        <p className="mb-4">
          Click the button below and open this page in another window - this data
          is persisted in the Convex cloud database!
        </p>
        <div className="flex flex-col gap-4">
          <button
            className="bg-foreground text-background text-sm px-4 py-2 rounded-md hover:opacity-90 transition-opacity w-fit"
            onClick={() => {
              void addNumber({ value: Math.floor(Math.random() * 10) });
            }}
          >
            Add a random number
          </button>
          <div className="bg-slate-200 dark:bg-slate-700 p-3 rounded-md">
            <p className="font-semibold mb-1">Numbers:</p>
            <p>
              {numbers?.length === 0
                ? "Click the button to add numbers!"
                : (numbers?.join(", ") ?? "...")}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg shadow-sm">
        <p className="font-semibold mb-4">Developer Resources:</p>
        <div className="flex flex-col gap-3">
          <p>
            Edit{" "}
            <code className="text-sm font-bold font-mono bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded-md">
              convex/myFunctions.ts
            </code>{" "}
            to change your backend
          </p>
          <p>
            Edit{" "}
            <code className="text-sm font-bold font-mono bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded-md">
              app/page.tsx
            </code>{" "}
            to change your frontend
          </p>
          <p>
            See the{" "}
            <Link href="/server" className="text-blue-600 dark:text-blue-400 underline hover:no-underline">
              /server route
            </Link>{" "}
            for an example of loading data in a server component
          </p>
        </div>
      </div>

      <div className="flex flex-col">
        <p className="text-lg font-bold mb-4">Useful resources:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResourceCard
            title="Convex docs"
            description="Read comprehensive documentation for all Convex features."
            href="https://docs.convex.dev/home"
          />
          <ResourceCard
            title="Stack articles"
            description="Learn about best practices, use cases, and more from a growing collection of articles, videos, and walkthroughs."
            href="https://www.typescriptlang.org/docs/handbook/2/basic-types.html"
          />
          <ResourceCard
            title="Templates"
            description="Browse our collection of templates to get started quickly."
            href="https://www.convex.dev/templates"
          />
          <ResourceCard
            title="Discord"
            description="Join our developer community to ask questions, trade tips & tricks, and show off your projects."
            href="https://www.convex.dev/community"
          />
        </div>
      </div>
    </div>
  );
}

function ResourceCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a 
      href={href} 
      className="flex flex-col gap-2 bg-slate-200 dark:bg-slate-700 p-4 rounded-md h-32 overflow-auto hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="text-sm font-semibold">{title}</span>
      <p className="text-xs">{description}</p>
    </a>
  );
}