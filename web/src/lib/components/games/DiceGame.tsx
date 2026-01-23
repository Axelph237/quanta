import { useEffect, useState } from "react";

export default function DiceGame() {
  const [numDice, setNumDice] = useState<number>(2);
  const [diceValues, setDiceValues] = useState<number[]>([1, 1]);

  useEffect(() => {
    const rollDice = () => {
      setDiceValues(
        Array.from(
          { length: numDice },
          () => Math.floor(Math.random() * 6) + 1,
        ),
      );
    };
    rollDice();
  }, [numDice]);

  return (
    <div className="flex flex-row items-center justify-center gap-5">
      {diceValues.map((value, index) => (
        <div
          key={index}
          className="w-10 md:w-20 aspect-square bg-primary text-xl md:text-3xl font-bold flex items-center justify-center rounded-sm"
        >
          {value}
        </div>
      ))}
    </div>
  );
}
