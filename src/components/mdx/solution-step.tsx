interface SolutionStepProps {
  step: number;
  title: string;
  children: React.ReactNode;
}

export function SolutionStep({ step, title, children }: SolutionStepProps) {
  return (
    <div className="flex gap-4 py-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
        {step}
      </div>
      <div>
        <h4 className="font-semibold text-foreground mb-2">{title}</h4>
        <div className="text-muted text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
