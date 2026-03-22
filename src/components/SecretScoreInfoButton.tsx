import { useState } from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";

const heartFillStyle = `
@keyframes heart-fill {
  0%, 100% { clip-path: inset(100% 0 0 0); }
  50% { clip-path: inset(0 0 0 0); }
}
`;

export const SecretScoreInfoButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <style>{heartFillStyle}</style>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <button className="inline-flex items-center gap-1 px-1.5 py-1 rounded-lg bg-rose-600/90 backdrop-blur-sm border border-rose-500/50 shadow-lg shadow-rose-500/25 text-white transition-all duration-300 hover:bg-rose-700 cursor-pointer">
            <svg
              width={14}
              height={14}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill="white"
              />
            </svg>
            <div className="flex flex-col leading-none">
              <span className="text-[9px] font-semibold">Secret</span>
              <span className="text-[9px] font-semibold">Score</span>
            </div>
          </button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="text-lg flex items-center justify-center gap-2">
              <svg
                width={22}
                height={22}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Outline heart (always visible, faded) */}
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  stroke="#EF4444"
                  strokeWidth="1.5"
                  fill="none"
                  opacity="0.4"
                />
                {/* Filled heart with fill animation */}
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  fill="#EF4444"
                  style={{ animation: "heart-fill 2s ease-in-out infinite" }}
                />
              </svg>
              Secret Score
            </DrawerTitle>
            <DrawerDescription className="text-center">How your chemistry score works</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-6 space-y-4 text-sm">
            <p className="text-muted-foreground">
              Your Secret Score reflects how deep your connection with each
              companion is. The more you chat, the higher it grows!
            </p>

            <div className="space-y-2">
              <p className="font-medium text-white">How to raise your score:</p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Chat more with your companions</li>
                <li>Send longer, more engaging messages</li>
                <li>Flirty conversations boost it faster</li>
                <li>Stay consistent — daily activity matters</li>
              </ul>
            </div>

            <p className="text-red-400/80">
              ⚠️ Your score decreases after 2 days of inactivity
            </p>

            <p className="text-purple-300">
              🎁 A special bonus awaits at 100%...
            </p>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};
