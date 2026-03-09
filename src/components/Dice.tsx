"use client";

type RollResult = "nothing" | "share" | "block";

interface DiceProps {
  roll: number;
  result: RollResult;
}

const FACE_CLASS = "absolute flex items-center justify-center rounded-lg border-2 border-amber-900/40 bg-gradient-to-b from-amber-600/90 to-amber-800 shadow-inner";
const FACE_SIZE = 64;

export function Dice({ roll, result }: DiceProps) {
  const accentClass =
    result === "block"
      ? "ring-2 ring-bitcoin-orange/60"
      : result === "share"
        ? "ring-2 ring-emerald-500/50"
        : "";

  return (
    <div className={`flex flex-col items-center gap-4 sm:gap-6 rounded-2xl p-3 sm:p-4 ${accentClass}`}>
      {/* 3D dice container with perspective - slightly smaller on mobile */}
      <div
        className="relative w-[72px] h-[72px] sm:w-[88px] sm:h-[88px] flex items-center justify-center scale-90 sm:scale-100"
        style={{ perspective: "220px" }}
      >
        <div
          className="absolute w-[64px] h-[64px] animate-dice-tumble"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* front */}
          <div
            className={FACE_CLASS}
            style={{
              width: FACE_SIZE,
              height: FACE_SIZE,
              transform: "rotateY(0deg) translateZ(32px)",
              background: "linear-gradient(to bottom, rgba(230,150,80,0.95), rgba(180,120,60,0.9))",
            }}
          />
          {/* back */}
          <div
            className={FACE_CLASS}
            style={{
              width: FACE_SIZE,
              height: FACE_SIZE,
              transform: "rotateY(180deg) translateZ(32px)",
              background: "linear-gradient(to bottom, rgba(180,120,60,0.9), rgba(120,80,40,0.9))",
            }}
          />
          {/* right */}
          <div
            className={FACE_CLASS}
            style={{
              width: FACE_SIZE,
              height: FACE_SIZE,
              transform: "rotateY(90deg) translateZ(32px)",
              background: "linear-gradient(to bottom, rgba(200,130,70,0.9), rgba(140,90,50,0.9))",
            }}
          />
          {/* left */}
          <div
            className={FACE_CLASS}
            style={{
              width: FACE_SIZE,
              height: FACE_SIZE,
              transform: "rotateY(-90deg) translateZ(32px)",
              background: "linear-gradient(to bottom, rgba(190,125,65,0.9), rgba(130,85,45,0.9))",
            }}
          />
          {/* top */}
          <div
            className={FACE_CLASS}
            style={{
              width: FACE_SIZE,
              height: FACE_SIZE,
              transform: "rotateX(90deg) translateZ(32px)",
              background: "linear-gradient(to bottom, rgba(220,150,80,0.95), rgba(180,120,60,0.9))",
            }}
          />
          {/* bottom */}
          <div
            className={FACE_CLASS}
            style={{
              width: FACE_SIZE,
              height: FACE_SIZE,
              transform: "rotateX(-90deg) translateZ(32px)",
              background: "linear-gradient(to bottom, rgba(160,100,50,0.9), rgba(100,65,35,0.9))",
            }}
          />
        </div>
      </div>

      {/* Result number - fades in after dice lands */}
      <div
        className="flex flex-col items-center gap-1 animate-fade-in-up opacity-0"
        style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
      >
        <span className="text-xs text-gray-500 uppercase tracking-widest">Roll</span>
        <span
          className={`text-4xl sm:text-5xl font-heading font-bold tabular-nums ${
            result === "block"
              ? "text-bitcoin-orange drop-shadow-sm"
              : result === "share"
                ? "text-emerald-400"
                : "text-gray-300"
          }`}
        >
          {roll}
        </span>
        <span
          className={`text-sm font-semibold uppercase tracking-wider ${
            result === "block"
              ? "text-bitcoin-orange"
              : result === "share"
                ? "text-emerald-400"
                : "text-gray-500"
          }`}
        >
          {result === "block" ? "Block!" : result === "share" ? "Share" : "Try again"}
        </span>
      </div>
    </div>
  );
}
