import React, { useState, useEffect } from "react";
import axios from "axios";
import HigherOrLower from "./components/HigherOrLower";
import Instructions from "./components/Instructions";

export default function App() {
  const [loading, setLoading] = useState(true);
  // variable for highest id from pokeapi
  const [maxId, setMaxId] = useState(0);
  // variables for pokemon information
  const [randomId, setRandomId] = useState("");
  const [randomId2, setRandomId2] = useState("");
  const [pokemonName, setPokemonName] = useState("");
  const [pokemonName2, setPokemonName2] = useState("");
  const [pokemonSprite, setPokemonSprite] = useState();
  const [pokemonSprite2, setPokemonSprite2] = useState();
  const [pokemonStatTotal, setPokemonStatTotal] = useState(null);
  const [pokemonStatTotal2, setPokemonStatTotal2] = useState(null);
  // list of two stats to compare
  const [compareStats, setCompareStats] = useState([]);
  // list of outcomes with most recent at head
  const [outcome, setOutcome] = useState([]);
  // score counter
  const [score, setScore] = useState(0);
  // show higher, lower buttons and hide generate new pokemon
  const [showButtons, setShowButtons] = useState(false);
  // show base stats
  const [showStats, setShowStats] = useState(false);

  // finds the highest id from pokeapi
  useEffect(() => {
    setLoading(true);
    const allPokemonCall = "https://pokeapi.co/api/v2/pokemon-species/?limit=0";
    let cancel;
    axios
      .get(allPokemonCall, {
        cancelToken: new axios.CancelToken((c) => (cancel = c)),
      })
      .then((res) => {
        setLoading(false);
        setMaxId(res.data.count);
      });

    return () => cancel();
  }, []);

  // generates two random ids
  function generateRandom() {
    setCompareStats([]);
    setShowStats(false);
    setRandomId(Math.floor(Math.random() * maxId) + 1);
    setRandomId2(Math.floor(Math.random() * maxId) + 1);
    setShowButtons(true);
  }

  // uses random ids to populate pokemon information
  function generateUsingId(Id, num) {
    const PokemonIdCall = `https://pokeapi.co/api/v2/pokemon/${Id}`;
    let cancel;
    axios
      .get(PokemonIdCall, {
        cancelToken: new axios.CancelToken((c) => (cancel = c)),
      })
      .then((res) => {
        if (num === 1) {
          setPokemonName(res.data.name);
          setPokemonSprite(res.data.sprites.front_default);
          let statTotal = 0;
          for (let i = 0; i < res.data.stats.length; i++) {
            statTotal += res.data.stats[i].base_stat;
          }
          setPokemonStatTotal(statTotal);
        } else if (num === 2) {
          setPokemonName2(res.data.name);
          setPokemonSprite2(res.data.sprites.front_default);
          let statTotal = 0;
          for (let i = 0; i < res.data.stats.length; i++) {
            statTotal += res.data.stats[i].base_stat;
          }
          setPokemonStatTotal2(statTotal);
        }
      });
    return () => cancel();
  }

  // generates new pokemon when random ids change
  useEffect(() => {
    generateUsingId(randomId, 1);
    generateUsingId(randomId2, 2);
  }, [randomId, randomId2]);

  // creates list of two stats to compare
  useEffect(() => {
    setCompareStats(
      [...compareStats, pokemonStatTotal].filter((x) => x !== false)
    );
  }, [compareStats, pokemonStatTotal]);

  // creates list of two stats to compare
  useEffect(() => {
    setCompareStats(
      [...compareStats, pokemonStatTotal2].filter((x) => x !== false)
    );
  }, [compareStats, pokemonStatTotal2]);

  // generates the outcome once the higher button has been clicked
  function userClickHigher() {
    setOutcome([
      HigherOrLower(pokemonStatTotal, pokemonStatTotal2, "higher"),
      ...outcome,
    ]);
    setShowStats(true);
    setTimeout(generateRandom, 2000);
  }

  // generates the outcome once the lower button has been clicked
  function userClickLower() {
    setOutcome([
      HigherOrLower(pokemonStatTotal, pokemonStatTotal2, "lower"),
      ...outcome,
    ]);
    setShowStats(true);
    setTimeout(generateRandom, 2000);
  }

  // score counter
  useEffect(() => {
    if (outcome[0] === true) {
      setScore((prevState) => prevState + 1);
    } else {
      setScore(0);
    }
  }, [outcome]);

  if (loading) return "Loading...";

  return (
    <>
      {showButtons && <div className="score">Score: {score}</div>}
      {!showButtons && <Instructions />}
      {!showButtons && (
        <div className="generate-random-button">
          <button onClick={() => generateRandom()}>Start Game</button>
        </div>
      )}
      <div className="container">
        <div className="pokemon">
          <div className="pokemon-name">{pokemonName}</div>
          <div>
            <img
              src={pokemonSprite}
              alt={pokemonName}
              className="pokemon-sprite"
            />
          </div>
          {showStats && (
            <div className={outcome[0] ? "incorrect" : "correct"}>
              {pokemonStatTotal}
            </div>
          )}
        </div>
        <div className="pokemon">
          {showButtons && (
            <button onClick={() => userClickHigher()} className="higher-button">
              Higher
            </button>
          )}
          <div className="pokemon-name">{pokemonName2}</div>
          <div>
            <img
              src={pokemonSprite2}
              alt={pokemonName2}
              className="pokemon-sprite"
            />
          </div>
          {showStats && (
            <div className={outcome[0] ? "correct" : "incorrect"}>
              {pokemonStatTotal2}
            </div>
          )}
          {showButtons && (
            <button onClick={() => userClickLower()} className="lower-button">
              Lower
            </button>
          )}
        </div>
      </div>
    </>
  );
}
