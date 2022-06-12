import React, { useState, useEffect } from "react";
import axios from "axios";
import HigherOrLower from "./components/HigherOrLower";
import Difficulty from "./components/Difficulty";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [maxId, setMaxId] = useState(0);
  const [randomId, setRandomId] = useState("");
  const [randomId2, setRandomId2] = useState("");
  const [pokemonName, setPokemonName] = useState("");
  const [pokemonName2, setPokemonName2] = useState("");
  const [pokemonSprite, setPokemonSprite] = useState();
  const [pokemonSprite2, setPokemonSprite2] = useState();
  const [pokemonStatTotal, setPokemonStatTotal] = useState(null);
  const [pokemonStatTotal2, setPokemonStatTotal2] = useState(null);
  const [compareStats, setCompareStats] = useState([]);
  const [outcome, setOutcome] = useState([]);
  const [score, setScore] = useState(0);

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

  function generateRandom() {
    setCompareStats([]);
    setRandomId(Math.floor(Math.random() * maxId) + 1);
    setRandomId2(Math.floor(Math.random() * maxId) + 1);
  }

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

  useEffect(() => {
    generateUsingId(randomId, 1);
    generateUsingId(randomId2, 2);
  }, [randomId, randomId2]);

  useEffect(() => {
    setCompareStats(
      [...compareStats, pokemonStatTotal].filter((x) => x !== false)
    );
  }, []);

  useEffect(() => {
    setCompareStats(
      [...compareStats, pokemonStatTotal2].filter((x) => x !== false)
    );
  }, []);

  function userClickHigher() {
    setOutcome([
      HigherOrLower(pokemonStatTotal, pokemonStatTotal2, "higher"),
      ...outcome,
    ]);
    generateRandom();
  }

  function userClickLower() {
    setOutcome([
      HigherOrLower(pokemonStatTotal, pokemonStatTotal2, "lower"),
      ...outcome,
    ]);
    generateRandom();
  }

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
        <div>
          <Difficulty />
        </div>
        <div>Score: {score}</div>
        <div>{pokemonName}</div>
        <div>
          <img src={pokemonSprite} alt={pokemonName} />
        </div>
        {/* <div>{pokemonStatTotal}</div> */}
        <div>{pokemonName2}</div>
        <div>
          <img src={pokemonSprite2} alt={pokemonName2} />
        </div>
        {/* <div>{pokemonStatTotal2}</div> */}
        <div>
          <button onClick={userClickHigher}>Higher</button>
          <button onClick={userClickLower}>Lower</button>
        </div>
        <button onClick={generateRandom}>Generate New Pokemon</button>
      </div>
    </>
  );
}
