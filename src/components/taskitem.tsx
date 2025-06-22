
export default function TaskItem({ task, index }: any) {
  return (
    <div className="flex justify-between items-center bg-zinc-800 px-3 py-2 rounded">
      <p className="truncate w-2/3 text-sm">
        <span className="mr-2 font-mono text-zinc-400">{index}</span>
        {task.name}
      </p>
      <span className="text-xs text-zinc-500">{task.duration}</span>
    </div>
  );
}
