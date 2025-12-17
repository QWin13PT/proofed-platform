import { cn } from "@/lib/utils";

export default function Card({ children, title, description, className, variant = "default", topRight, image }) {
  const baseClasses = "flex flex-col rounded-3xl p-6";
  const variantClasses = {
    default: "bg-white text-dark flex flex-col",
    light: "bg-light text-dark ",
    dark: "bg-dark text-light",
    border: "border border-dark/20 text-dark",
    highlight: "bg-highlight text-dark",
    accent: "bg-accent text-light",
  }
  return (
    <div className={cn(baseClasses, variantClasses[variant], className)}>
      {(title || topRight || image) && (
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-start gap-3">
            {image && <div className="shrink-0 w-14 h-14 rounded-xl flex items-center justify-center shadow-sm bg-dark/5">{image}</div>}
            <div className="flex flex-col  gap-1">
              <h2 className="text-2xl font-bold ">{title}</h2>
              {description && <p className="text-sm opacity-50">{description}</p>}
            </div>
          </div>
          {topRight && <div className="shrink-0">{topRight}</div>}
        </div>
      )}
      {children}
    </div>
  );
}