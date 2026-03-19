import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ChemistryHeartProps {
  score: number;
  characterName: string;
  size?: "sm" | "md";
}

function getHeartColor(score: number): string {
  if (score >= 81) return "#10B981"; // green
  if (score >= 61) return "#22C55E"; // light green
  if (score >= 41) return "#EAB308"; // yellow
  if (score >= 21) return "#F97316"; // orange
  return "#EF4444"; // red
}

function getScoreLabel(score: number): string {
  if (score >= 91) return "Soulmate level!";
  if (score >= 76) return "Intense chemistry!";
  if (score >= 51) return "Things are heating up!";
  if (score >= 26) return "A spark is forming...";
  return "Just getting started";
}

export const ChemistryHeart = ({ score, characterName, size = "sm" }: ChemistryHeartProps) => {
  const [open, setOpen] = useState(false);
  const color = getHeartColor(score);
  const fillPercent = Math.min(Math.max(score, 0), 100);
  const dim = size === "sm" ? 14 : 20;
  const roundedScore = Math.round(score);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="backdrop-blur-sm bg-black/70 rounded-lg px-1.5 py-0.5 flex items-center gap-1 cursor-pointer hover:bg-black/80 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            setOpen((v) => !v);
          }}
          aria-label={`Chemistry score: ${roundedScore}%`}
        >
          <svg
            width={dim}
            height={dim}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <clipPath id={`heart-clip-${characterName}`}>
                <rect
                  x="0"
                  y={24 - (fillPercent / 100) * 24}
                  width="24"
                  height={(fillPercent / 100) * 24}
                />
              </clipPath>
            </defs>
            {/* Empty heart outline */}
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              stroke={color}
              strokeWidth="1.5"
              fill="none"
              opacity="0.4"
            />
            {/* Filled portion */}
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill={color}
              clipPath={`url(#heart-clip-${characterName})`}
            />
          </svg>
          <span className="text-white font-medium text-xs" style={{ color }}>
            {roundedScore}%
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-64 bg-gray-900/95 border-gray-700 text-white p-4"
        side="top"
        sideOffset={8}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-2">
          <h4 className="font-bold text-sm flex items-center gap-1.5">
            <span>🧪</span> Secret Score
          </h4>
          <p className="text-xs text-gray-300">
            Your chemistry with <strong>{characterName}</strong> is{" "}
            <span style={{ color }} className="font-bold">
              {roundedScore}%
            </span>{" "}
            — {getScoreLabel(score)}
          </p>
          <div className="text-xs text-gray-400 space-y-1 pt-1 border-t border-gray-700">
            <p>How to raise your score:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Chat more with {characterName}</li>
              <li>Send longer, more engaging messages</li>
              <li>Flirty conversations boost it faster</li>
              <li>Stay consistent — inactivity lowers it</li>
            </ul>
          </div>
          <p className="text-xs text-purple-300 pt-1">
            💯 Hit 100% as a subscriber to unlock exclusive perks!
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
};
