import { FolderOpen } from "lucide-react";

export default function EmptyState({ title = "Nothing here yet", body = "New items will appear here.", action }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-mint text-primary">
        <FolderOpen className="h-5 w-5" strokeWidth={1.7} />
      </span>
      <p className="mt-3 text-[13.5px] font-semibold text-brand-ink">{title}</p>
      <p className="mt-1 max-w-[36ch] text-[12.5px] leading-relaxed text-brand-subtle">{body}</p>
      {action}
    </div>
  );
}