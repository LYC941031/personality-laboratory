import { PersonalityType } from "@/../data/personalities";

interface TypeHeroProps {
  type: PersonalityType;
}

export function TypeHero({ type }: TypeHeroProps) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl p-8 sm:p-12 mb-12"
      style={{
        background: `linear-gradient(135deg, ${type.color}15, ${type.color}05)`,
        borderColor: type.color + "30",
        borderWidth: 1,
      }}
    >
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <span
            className="px-3 py-1 rounded-full text-xs font-bold"
            style={{
              backgroundColor: type.color,
              color: "#fff",
            }}
          >
            {type.code}
          </span>
          <span className="text-sm text-muted">{type.nameEn}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold text-foreground mb-3">
          {type.name}
        </h1>

        <p
          className="text-xl sm:text-2xl font-medium mb-6"
          style={{ color: type.color }}
        >
          「{type.tagline}」
        </p>

        <p className="text-muted text-base sm:text-lg leading-relaxed max-w-2xl">
          {type.summary}
        </p>
      </div>

      {/* Background decoration */}
      <div
        className="absolute -right-12 -top-12 w-64 h-64 rounded-full opacity-10"
        style={{ backgroundColor: type.color }}
      />
      <div
        className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full opacity-5"
        style={{ backgroundColor: type.color }}
      />
    </div>
  );
}
