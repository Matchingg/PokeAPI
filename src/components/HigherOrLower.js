import React, { useState } from "react";

export default function HigherOrLower(statTotal1, statTotal2, userGuess) {
  // const [isCorrect, setIsCorrect] = useState(false);
  let isCorrect = false;
  if (
    (userGuess === "higher" && statTotal2 >= statTotal1) ||
    (userGuess === "lower" && statTotal2 <= statTotal1)
  ) {
    isCorrect = true;
  }
  console.log(isCorrect);
  return isCorrect;
}
