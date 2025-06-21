import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Download, Search, Tag } from "lucide-react";
import { motion } from "framer-motion";

const fetchSuggestions = async (query) => {
  const res = await fetch(
    `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${encodeURIComponent(query)}`
  );
  const data = await res.json();
  return data[1];
};

export default function RAPIDTAGSYT() {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateTags = async () => {
    setLoading(true);
    const suggestions = await fetchSuggestions(title);
    const uniqueTags = [...new Set(suggestions.map((s) => s.trim()))];
    setTags(uniqueTags);
    setLoading(false);
  };

  const copyToClipboard = (tag) => {
    navigator.clipboard.writeText(tag);
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + tags.join(",");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "youtube_tags.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-8">
      <header className="w-full flex items-center justify-between px-6 py-4 bg-white shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-gray-800">RAPIDTAGSYT</span>
        </div>
        <a
          href="#"
          className="bg-black text-white px-3 py-1 rounded-sm font-bold text-sm border-b-4 border-cyan-500 border-r-4 border-pink-500 shadow-md"
        >
          TAG GENERATOR
        </a>
      </header>

      <main className="flex flex-col items-center justify-center flex-grow mt-16 w-full">
        <h2 className="text-3xl font-bold text-gray-700 mb-6">TAG GENERATOR</h2>

        <div className="relative w-full max-w-xl mb-10">
          <Input
            placeholder="Enter your next YouTube video title to generate tags"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="pl-10 pr-10 py-3 text-lg"
          />
          <Tag className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
          <button
            onClick={generateTags}
            disabled={!title || loading}
            className="absolute right-3 top-3.5 text-gray-500 hover:text-black"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {tags.length > 0 && (
          <motion.div
            className="w-full max-w-xl space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex justify-end">
              <Button variant="outline" onClick={exportCSV}>
                <Download className="w-4 h-4 mr-2" /> Export CSV
              </Button>
            </div>
            {tags.map((tag, idx) => (
              <Card
                key={idx}
                className="flex justify-between items-center px-4 py-2 bg-white shadow-sm rounded-md"
              >
                <CardContent className="p-0 text-sm truncate max-w-[85%]">
                  {tag}
                </CardContent>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(tag)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </Card>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}
