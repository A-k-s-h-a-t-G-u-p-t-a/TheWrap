"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";

export default function AddTaskModal({ isOpen, onClose, onSave, listOptions }: any) {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("00:30"); // Default 30 minutes
  const [selectedListId, setSelectedListId] = useState("");

  // Update selectedListId when listOptions change
  useEffect(() => {
    if (listOptions.length > 0 && !selectedListId) {
      setSelectedListId(listOptions[0].id);
    }
  }, [listOptions, selectedListId]);

  const handleSave = () => {
    if (title.trim() && selectedListId) {
      onSave({ title, listId: selectedListId, duration });
      setTitle("");
      setDuration("00:30");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/60" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-zinc-900 rounded-lg p-6 w-full max-w-md text-white">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold">Add task to list</Dialog.Title>
            <button onClick={onClose}>
              <X className="text-zinc-400 hover:text-white" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm">Title</label>
              <input
                type="text"
                placeholder="Enter task title*"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mt-1 p-2 rounded bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500"
              />
            </div>

            <div>
              <label className="text-sm">Estimated Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full mt-1 p-2 rounded bg-zinc-800 border border-zinc-700 text-white"
              >
                <option value="00:15">15 minutes</option>
                <option value="00:30">30 minutes</option>
                <option value="01:00">1 hour</option>
                <option value="01:30">1.5 hours</option>
                <option value="02:00">2 hours</option>
                <option value="03:00">3 hours</option>
                <option value="04:00">4 hours</option>
                <option value="08:00">8 hours</option>
              </select>
            </div>

            <div>
              <label className="text-sm">Select a list to add your task to</label>
              {listOptions.length > 0 ? (
                <select
                  value={selectedListId}
                  onChange={(e) => setSelectedListId(e.target.value)}
                  className="w-full mt-1 p-2 rounded bg-zinc-800 border border-zinc-700 text-white"
                >
                  {listOptions.map((list: any) => (
                    <option key={list.id} value={list.id}>
                      {list.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="w-full mt-1 p-2 rounded bg-zinc-800 border border-zinc-700 text-zinc-400">
                  No lists available. Please create a list first.
                </div>
              )}
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={onClose}
                className="border border-white rounded-full px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!title.trim() || !selectedListId || listOptions.length === 0}
                className="bg-gradient-to-r from-lime-400 to-green-400 text-black font-semibold px-4 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
