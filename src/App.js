import React, { useState, useEffect } from "react";
import axios from "axios";
import HigherOrLower from "./components/HigherOrLower";

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
    setRandomId(Math.floor(Math.random() * maxId) + 1);
    setRandomId2(Math.floor(Math.random() * maxId) + 1);
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
  }, []);

  // creates list of two stats to compare
  useEffect(() => {
    setCompareStats(
      [...compareStats, pokemonStatTotal2].filter((x) => x !== false)
    );
  }, []);

  // generates the outcome once the higher button has been clicked
  function userClickHigher() {
    setOutcome([
      HigherOrLower(pokemonStatTotal, pokemonStatTotal2, "higher"),
      ...outcome,
    ]);
    generateRandom();
  }

  // generates the outcome once the lower button has been clicked
  function userClickLower() {
    setOutcome([
      HigherOrLower(pokemonStatTotal, pokemonStatTotal2, "lower"),
      ...outcome,
    ]);
    generateRandom();
  }

  function showBaseStats() {
    return (
      <>
        <div>
          {pokemonStatTotal} vs {pokemonStatTotal2}
        </div>
      </>
    );
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
      <div>
        <div>Score: {score}</div>
        <div>{pokemonName}</div>
        <div>
          <img src={pokemonSprite} alt={pokemonName} />
        </div>
        <div>{pokemonName2}</div>
        <div>
          <img src={pokemonSprite2} alt={pokemonName2} />
        </div>
        <div>
          <button onClick={userClickHigher}>Higher</button>
          <button onClick={userClickLower}>Lower</button>
        </div>
        <button onClick={generateRandom}>Generate New Pokemon</button>
      </div>
    </>
  );
}
