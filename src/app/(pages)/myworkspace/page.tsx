// components/Workspace.tsx
"use client";

import ListCard from "@/components/listcard";
import { useState } from "react";

const mockData = [
  {
    id: "1",
    name: "WEB DEV",
    tag: "W",
    tasks: [
      { id: "t1", name: "WEB 3 lecture", duration: "00:00" },
      { id: "t2", name: "Start with the project", duration: "00:00" },
    ],
  },
  {
    id: "2",
    name: "DSA",
    tag: "D",
    tasks: [
      { id: "t1", name: "5 Question try BINARY", duration: "02:00" },
      { id: "t2", name: "LOOK at Solution of...", duration: "02:00" },
    ],
  },
];

export default function Workspace() {
  const [lists, setLists] = useState(mockData);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Lists</h1>
        <button className="bg-gradient-to-r from-lime-400 to-green-400 px-4 py-2 rounded-lg text-black font-semibold">
          Add new task
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {lists.map((list) => (
          <ListCard key={list.id} list={list} />
        ))}

        {/* Placeholder Add List */}
        <div className="border-2 border-dashed border-zinc-700 rounded-lg h-52 flex items-center justify-center text-zinc-500">
          + Add New List
        </div>
      </div>
    </div>
  );
}
