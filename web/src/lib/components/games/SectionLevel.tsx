import { useEffect } from "react";
import { LevelComponentProps } from "./GameHandler";

export default function SectionLevel({
  header,
  subheader,
  levelAPI,
  startTrigger,
}: {
  header: string;
  subheader: string;
} & LevelComponentProps) {
  useEffect(() => {
    levelAPI?.ready();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (startTrigger) {
      levelAPI?.playing();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTrigger]);
  return (
    <div className="game-section-title w-full h-full flex flex-col items-center justify-center gap-4">
      <h1 className="heading-text-lg font-bold">{header}</h1>
      <p className="heading-text-sm text-quanta-on-surface/65">{subheader}</p>
      <button
        className="button-primary bg-quanta-primary"
        onClick={() => levelAPI?.end({ result: "win" })}
      >
        Continue
      </button>
    </div>
  );
}
