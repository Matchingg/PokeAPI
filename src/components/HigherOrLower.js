import React from "react";

export default function HigherOrLower({ statTotal1, statTotal2 }) {
  function CheckCorrect(guess) {
    let score = 0;
    if (
      (guess === "higher" && statTotal2 >= statTotal1) ||
      (guess === "lower" && statTotal2 <= statTotal1)
    ) {
      score += 1;
    } else {
      score = 0;
    }
  }
  return (
    <>
      <button onClick={CheckCorrect("higher")}>Higher</button>
      <button onClick={CheckCorrect("lower")}>Lower</button>
    </>
  );
}
