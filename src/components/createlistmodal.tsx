// components/CreateListModal.tsx
"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";

interface CreateListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: { title: string; tag: string }) => void;
}

const tags = [
  "Work",
  "Personal",
  "Study",
  "Health",
  "Shopping",
  "Project",
  "General",
];

export default function CreateListModal({ isOpen, onClose, onCreate }: CreateListModalProps) {
  const [title, setTitle] = useState("");
  const [selectedTag, setSelectedTag] = useState(tags[0]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onCreate({ title, tag: selectedTag });
    setTitle("");
    setSelectedTag(tags[0]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-lg bg-zinc-900 p-6 text-white shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-semibold">Create a new list</Dialog.Title>
            <button onClick={onClose}><X /></button>
          </div>

          <div className="mb-4">
            <p className="text-sm text-zinc-400 mb-2">Pick a category</p>
            <div className="grid grid-cols-4 gap-2">
              {tags.map((tag, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-2 rounded-lg text-sm border ${
                    selectedTag === tag 
                      ? "bg-lime-400 text-black border-lime-400" 
                      : "bg-zinc-800 text-white border-zinc-700 hover:border-zinc-600"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your list title"
            className="w-full px-4 py-2 rounded bg-zinc-800 text-white focus:outline-none border border-zinc-700 mb-6"
          />

          <div className="flex justify-between">
            <button
              onClick={onClose}
              className="border border-white px-4 py-2 rounded-lg text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-lime-400 to-green-400 px-4 py-2 rounded-lg text-black font-semibold"
            >
              Create
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
