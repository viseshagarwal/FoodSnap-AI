import { FC } from "react";

interface PlaceholderImageProps {
  name: string;
  className?: string;
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getRandomColor = (name: string) => {
  const colors = [
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
    "bg-orange-100 text-orange-700",
    "bg-emerald-100 text-emerald-700",
    "bg-purple-100 text-purple-700",
    "bg-blue-100 text-blue-700",
  ];
  const index = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
};

const PlaceholderImage: FC<PlaceholderImageProps> = ({
  name,
  className = "",
}) => {
  const initials = getInitials(name);
  const colorClasses = getRandomColor(name);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div
        className={`absolute inset-0 ${colorClasses} flex items-center justify-center`}
      >
        <div className="relative">
          {/* Food icon */}
          <svg
            className="w-12 h-12 opacity-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" />
          </svg>
          <span className="text-2xl font-semibold relative z-10">
            {initials}
          </span>
        </div>
      </div>
      {/* Overlay pattern */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
          backgroundSize: "8px 8px",
        }}
      />
    </div>
  );
};

export default PlaceholderImage;
