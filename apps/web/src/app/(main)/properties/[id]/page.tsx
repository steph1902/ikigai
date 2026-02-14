"use client";

import { Button } from "@ikigai/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PropertyDetailPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="container py-6">
      <div className="mb-4">
        <Link href="/search" className="text-sm text-gray-500 hover:underline">
          ← Back to Search
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video bg-gray-200 rounded-xl flex items-center justify-center relative overflow-hidden group">
            <p className="text-gray-500">3D Viewer / Image Gallery Placeholder</p>
            <div className="absolute bottom-4 right-4 flex gap-2">
              <Button variant="secondary" size="sm">
                View Photos
              </Button>
              <Button variant="secondary" size="sm">
                3D Tour
              </Button>
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold">Modern Apartment in Shibuya</h1>
            <p className="text-xl text-gray-600 mt-1">¥85,000,000</p>
            <p className="text-gray-500 mt-2">Shibuya-ku, Tokyo • 2LDK • 65.4 sqm</p>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed">
              A beautiful modern apartment located in the heart of Shibuya. Features
              floor-to-ceiling windows, high-end appliances, and just a 5-minute walk to the
              station. Perfect for urban professionals.
            </p>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Building Type</span>
                <span>Mansion</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Year Built</span>
                <span>2019</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Structure</span>
                <span>RC</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Floor</span>
                <span>12F / 25F</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="border rounded-xl p-6 sticky top-24 space-y-6">
            <div>
              <p className="text-sm text-gray-500">Price</p>
              <p className="text-3xl font-bold">¥85,000,000</p>
            </div>

            <div className="space-y-3">
              <Button className="w-full" size="lg">
                Schedule Viewing
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                Ask a Question
              </Button>
            </div>

            <div className="text-xs text-gray-400 text-center">
              Listed by Partner Agent: Tanaka Real Estate
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
