
import TaskItem from "@/Components/TaskItem";

export default function ListCard({ list }: any) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="bg-zinc-700 text-white px-2 py-1 rounded text-sm font-bold">
          {list.tag}
        </span>
        <h2 className="text-lg font-semibold">{list.name}</h2>
      </div>

      <div className="space-y-2">
        {list.tasks.map((task: any, index: number) => (
          <TaskItem key={task.id} task={task} index={index + 1} />
        ))}
      </div>

      <div className="mt-4 flex justify-between text-sm text-zinc-400">
        <p>{list.tasks.length} pending tasks</p>
        <p>Est: {calculateTotalTime(list.tasks)}</p>
      </div>
    </div>
  );
}

function calculateTotalTime(tasks: any[]) {
  const totalMins = tasks.reduce((acc, t) => {
    const [h, m] = t.duration.split(":").map(Number);
    return acc + h * 60 + m;
  }, 0);
  const hours = Math.floor(totalMins / 60);
  return `${hours}hr`;
}
