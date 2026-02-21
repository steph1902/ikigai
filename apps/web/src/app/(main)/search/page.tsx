"use client";

import { useState } from "react";

const PRICE_OPTIONS = [
  { value: "", label: "指定なし" },
  { value: "30000000", label: "3,000万円" },
  { value: "50000000", label: "5,000万円" },
  { value: "70000000", label: "7,000万円" },
  { value: "100000000", label: "1億円" },
];

const LAYOUT_OPTIONS = ["1R", "1K", "1LDK", "2LDK", "3LDK", "4LDK"];

const WALK_OPTIONS = [
  { value: "5", label: "5分以内" },
  { value: "10", label: "10分以内" },
  { value: "15", label: "15分以内" },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [selectedLayouts, setSelectedLayouts] = useState<string[]>([]);

  const toggleLayout = (layout: string) => {
    setSelectedLayouts((prev) =>
      prev.includes(layout)
        ? prev.filter((l) => l !== layout)
        : [...prev, layout],
    );
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-[#1A1A2E] mb-6">物件検索</h1>

      {/* Search Bar */}
      <div className="relative mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="エリア、駅名、マンション名で検索"
          className="w-full rounded-xl border border-[#E0E0E8] px-4 py-3 pl-11 text-sm focus:outline-none focus:ring-2 focus:ring-[#3D5A80] focus:border-transparent bg-white"
        />
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6B80]"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="space-y-6">
          {/* Price Range */}
          <div>
            <h3 className="text-sm font-medium text-[#1A1A2E] mb-2">
              価格帯
            </h3>
            <div className="space-y-2">
              <select className="w-full rounded-md border border-[#E0E0E8] px-3 py-2 text-sm bg-white">
                {PRICE_OPTIONS.map((o) => (
                  <option key={`min-${o.value}`} value={o.value}>
                    {o.value ? `${o.label}以上` : o.label}
                  </option>
                ))}
              </select>
              <select className="w-full rounded-md border border-[#E0E0E8] px-3 py-2 text-sm bg-white">
                {PRICE_OPTIONS.map((o) => (
                  <option key={`max-${o.value}`} value={o.value}>
                    {o.value ? `${o.label}以下` : o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Layout */}
          <div>
            <h3 className="text-sm font-medium text-[#1A1A2E] mb-2">
              間取り
            </h3>
            <div className="flex flex-wrap gap-2">
              {LAYOUT_OPTIONS.map((layout) => (
                <button
                  key={layout}
                  type="button"
                  onClick={() => toggleLayout(layout)}
                  className={`px-3 py-1.5 rounded-md text-sm border transition-colors ${selectedLayouts.includes(layout)
                      ? "bg-[#3D5A80] text-white border-[#3D5A80]"
                      : "bg-white text-[#2D2D44] border-[#E0E0E8] hover:border-[#3D5A80]"
                    }`}
                >
                  {layout}
                </button>
              ))}
            </div>
          </div>

          {/* Walk Minutes */}
          <div>
            <h3 className="text-sm font-medium text-[#1A1A2E] mb-2">
              駅徒歩
            </h3>
            <select className="w-full rounded-md border border-[#E0E0E8] px-3 py-2 text-sm bg-white">
              <option value="">指定なし</option>
              {WALK_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Earthquake Standard */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="earthquake"
              className="rounded border-[#E0E0E8]"
            />
            <label htmlFor="earthquake" className="text-sm text-[#2D2D44]">
              新耐震基準のみ
            </label>
          </div>

          {/* Search Button */}
          <button
            type="button"
            className="w-full bg-[#3D5A80] text-white rounded-md py-2.5 text-sm font-medium hover:bg-[#2C4A6E] transition-colors"
          >
            検索する
          </button>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-3">
          <div className="bg-[#F0F0F5] rounded-xl p-12 text-center">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-[#6B6B80] text-sm">
              条件を指定して検索してください
            </p>
            <p className="text-[#6B6B80] text-xs mt-2">
              または、AIチャットで「渋谷区で3LDKの物件を探して」と話しかけてください
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
