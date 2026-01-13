type UserIndicatorProps = {
  name: string;
};

export default function UserIndicator({ name }: UserIndicatorProps) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className="
        flex items-center gap-2
        rounded-full
        bg-blue-600/15
        px-2 py-1
        text-blue-400
        cursor-default
      "
      title={name}
    >
      {/* Avatar */}
      <div
        className="
          flex h-8 w-8 items-center justify-center
          rounded-full
          bg-blue-600
          text-xs font-semibold text-white
        "
      >
        {initials}
      </div>

      {/* Nombre (solo desktop) */}
      <span className="hidden lg:block text-sm font-medium text-white/90">
        {name}
      </span>
    </div>
  );
}
