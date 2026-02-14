"use client";

import { Button } from "@ikigai/ui/button";
import Link from "next/link";
import { useState } from "react";

// Mock Data
const MOCK_PROPERTIES = [
  {
    id: "1",
    name: "Modern Apartment in Shibuya",
    price: "¥85,000,000",
    location: "Shibuya-ku, Tokyo",
    type: "Mansion",
    size: "65.4 sqm",
    layout: "2LDK",
  },
  {
    id: "2",
    name: "Cozy House in Setagaya",
    price: "¥62,000,000",
    location: "Setagaya-ku, Tokyo",
    type: "Kodate",
    size: "98.2 sqm",
    layout: "3LDK",
  },
  {
    id: "3",
    name: "Luxury Condo in Minato",
    price: "¥120,000,000",
    location: "Minato-ku, Tokyo",
    type: "Mansion",
    size: "80.0 sqm",
    layout: "2LDK",
  },
];

export default function SearchPage() {
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Property Search</h1>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            onClick={() => setViewMode("list")}
          >
            List View
          </Button>
          <Button
            variant={viewMode === "map" ? "default" : "outline"}
            onClick={() => setViewMode("map")}
          >
            Map View
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="md:col-span-1 border rounded-lg p-4 h-fit">
          <h2 className="font-semibold mb-4">Filters</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="price-range" className="text-sm font-medium">Price Range</label>
              <input id="price-range" type="range" className="w-full mt-2" />
            </div>
            <div>
              <span className="text-sm font-medium">Type</span>
              <div className="flex flex-col gap-2 mt-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" /> Mansion
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" /> Kodate
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Results Area */}
        <div className="md:col-span-3">
          {viewMode === "list" ? (
            <div className="grid grid-cols-1 gap-4">
              {MOCK_PROPERTIES.map((property) => (
                <div
                  key={property.id}
                  className="border rounded-lg p-4 flex justify-between items-center hover:shadow-md transition-shadow"
                >
                  <div>
                    <h3 className="font-bold text-lg">{property.name}</h3>
                    <p className="text-gray-600">{property.location}</p>
                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                      <span>{property.type}</span>
                      <span>{property.layout}</span>
                      <span>{property.size}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary">{property.price}</p>
                    <Button asChild className="mt-2">
                      <Link href={`/properties/${property.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border rounded-lg h-[600px] bg-gray-100 flex items-center justify-center">
              <p className="text-gray-500">Map Component Placeholder (MapLibre)</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
