export default function HigherOrLower(statTotal1, statTotal2, userGuess) {
  let isCorrect = false;
  if (
    (userGuess === "higher" && statTotal2 >= statTotal1) ||
    (userGuess === "lower" && statTotal2 <= statTotal1)
  ) {
    isCorrect = true;
  }
  return isCorrect;
}
