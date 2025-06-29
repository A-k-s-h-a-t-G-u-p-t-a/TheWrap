"use client";

import { useEffect, useState } from "react";
import ListCard from "@/components/ListCard";
import AddTaskModal from "@/components/AddTaskModal";
import { fetchUserLists } from "@/lib/actions/fetchUserLists";
import CreateListModal from "@/components/createlistmodal";
import ListDetailModal from "@/components/ListDetailModal";

export default function Workspace() {
  const [lists, setLists] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateListOpen, setIsCreateListOpen] = useState(false);
  const [selectedList, setSelectedList] = useState<any>(null);
  const [isListDetailOpen, setIsListDetailOpen] = useState(false);

  const refreshLists = async () => {
    const data = await fetchUserLists();
    setLists(data);
  };

  const handleCreateList = async ({ title, tag }: { title: string; tag: string }) => {
    try {
      const response = await fetch("/api/lists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, tag }),
      });

      if (!response.ok) {
        throw new Error("Failed to create list");
      }

      const newList = await response.json();
      setLists((prev) => [newList, ...prev]);
    } catch (error) {
      console.error("Error creating list:", error);
      alert("Failed to create list. Please try again.");
    }
  };

  const handleSaveTask = async ({ title, listId, duration }: { title: string; listId: string; duration?: string }) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, listId, duration }),
      });

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      const newTask = await response.json();
      
      // Update the local state to reflect the new task
      setLists((prev) =>
        prev.map((list) =>
          list.id === listId
            ? {
                ...list,
                tasks: [...list.tasks, newTask],
              }
            : list
        )
      );
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task. Please try again.");
    }
  };

  useEffect(() => {
    refreshLists();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Lists</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-lime-400 to-green-400 px-4 py-2 rounded-lg text-black font-semibold"
        >
          Add new task
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {lists.map((list) => (
          <ListCard 
            key={list.id} 
            list={list} 
            onClick={() => {
              setSelectedList(list);
              setIsListDetailOpen(true);
            }}
          />
        ))}

        <button
          onClick={() => setIsCreateListOpen(true)}
          className="border-2 border-dashed border-zinc-700 rounded-lg h-52 flex items-center justify-center text-zinc-500"
        >
          + Add New List
        </button>
      </div>
      <CreateListModal
        isOpen={isCreateListOpen}
        onClose={() => setIsCreateListOpen(false)}
        onCreate={handleCreateList}
      />
      <ListDetailModal
        isOpen={isListDetailOpen}
        onClose={() => {
          setIsListDetailOpen(false);
          setSelectedList(null);
        }}
        list={selectedList}
        onTaskUpdate={refreshLists}
      />
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        listOptions={lists}
      />
    </div>
  );
}
