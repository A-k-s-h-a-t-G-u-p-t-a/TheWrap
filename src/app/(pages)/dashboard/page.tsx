"use client";
import React, { useEffect, useId, useRef, useState } from "react";
import { Search, Sparkles } from 'lucide-react';
import { Input } from "@/components/ui/input";
import AIToolCard from "@/components/tools_card";

type AITool = {
  id: string;
  title: string;
  description: string;
  link: string;
};

export default function Dashboard() {
  const ref = useRef<HTMLDivElement | null>(null);
  const id = useId();

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{
    id: string;
    name: string;
    description: string;
    link: string;
  }>>([]);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      try {
        const res = await fetch(`http://localhost:8000/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        console.log(data);
        setSearchResults(data.data || []);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    // logic of debounce used for search at interval of 400ms 
    const debounce = setTimeout(fetchResults, 400); 
    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <>
      <h1 className="text-4xl font-bold text-center text-white mb-6 tracking-tight">Discover AI Tools</h1>
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-4 py-2 mb-8">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-purple-300">Discover the Future of AI</span>
        </div>
      </div>
      <div className="relative max-w-2xl mx-auto mb-16">
        <div className="relative">
          <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for AI tools, features, or use cases..."
            className="w-full pl-14 pr-6 py-5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 text-lg"
          />
        </div>
      </div>
      
      {/* Display search results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
        {searchResults.map((result) => (
          <AIToolCard
            key={result.id}
            tool={{
              id: result.id,
              title: result.name,
              description: result.description,
              link: result.link,
            }}
          />
        ))}
      </div>
      
      {/* Show message when no results */}
      {query.trim().length >= 2 && searchResults.length === 0 && (
        <div className="text-center text-gray-400 mt-8">
          No tools found matching your search. Try different keywords.
        </div>
      )}
    </>
  );
}

