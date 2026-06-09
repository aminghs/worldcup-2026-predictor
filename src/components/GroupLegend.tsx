const ITEMS = [
  { color: 'bg-pos1', label: '1st – Advances' },
  { color: 'bg-pos2', label: '2nd – Advances' },
  { color: 'bg-pos3', label: '3rd – May advance (8 best)' },
  { color: 'bg-pos4', label: '4th – Eliminated' },
];

export function GroupLegend() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-500">
      {ITEMS.map((i) => (
        <span key={i.label} className="flex items-center gap-1.5">
          <span className={`h-2.5 w-2.5 rounded-full ${i.color}`} />
          {i.label}
        </span>
      ))}
    </div>
  );
}
