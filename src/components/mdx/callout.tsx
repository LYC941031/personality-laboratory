interface CalloutProps {
  type?: "info" | "warning" | "tip";
  children: React.ReactNode;
}

const styles = {
  info: "bg-blue-50 border-blue-200 text-blue-800",
  warning: "bg-amber-50 border-amber-200 text-amber-800",
  tip: "bg-green-50 border-green-200 text-green-800",
};

export function Callout({ type = "info", children }: CalloutProps) {
  return (
    <div className={`border rounded-xl p-4 my-6 text-sm leading-relaxed ${styles[type]}`}>
      {children}
    </div>
  );
}
