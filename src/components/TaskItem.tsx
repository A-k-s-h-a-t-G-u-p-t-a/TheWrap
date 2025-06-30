
interface TaskItemProps {
  task: {
    id: string;
    name: string;
    duration: string;
    completed?: boolean;
  };
  index: number;
  onToggleComplete?: (taskId: string) => void;
  showCheckbox?: boolean;
}

export default function TaskItem({ task, index, onToggleComplete, showCheckbox = false }: TaskItemProps) {
  return (
    <div className="flex justify-between items-center bg-zinc-800 px-3 py-2 rounded">
      <div className="flex items-center gap-3 w-2/3">
        {showCheckbox && (
          <input
            type="checkbox"
            checked={task.completed || false}
            onChange={() => onToggleComplete && onToggleComplete(task.id)}
            className="w-4 h-4 text-lime-400 bg-zinc-700 border-zinc-600 rounded focus:ring-lime-400 focus:ring-2"
          />
        )}
        <span className="mr-2 font-mono text-zinc-400">{index}</span>
        <p className={`truncate text-sm ${task.completed ? 'line-through text-zinc-500' : ''}`}>
          {task.name}
        </p>
      </div>
      <span className="text-xs text-zinc-500">{task.duration}</span>
    </div>
  );
}
