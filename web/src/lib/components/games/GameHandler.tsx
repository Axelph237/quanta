import { useEffect } from "react";

type GameEvents = "game:submit" | "game:reset" | "game:start" | "game:update";
type GameDetail = { expected: unknown; current: unknown };

/**
 * The Game Handler is a component for managing the state and success of a game. It handles state updates passed as events from children.
 * @returns
 */
export default function GameHandler({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {}, []);

  return <div className="bg-primary/25 p-5">{children}</div>;
}
