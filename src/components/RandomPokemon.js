import axios from "axios";
import React, { useState, useEffect } from "react";

export default function RandomPokemon() {
  const [loading, setLoading] = useState(true);
  const [maxId, setMaxId] = useState(0);
  const [randomId, setRandomId] = useState("");
  const [pokemonSprite, setPokemonSprite] = useState("");
  const [pokemonName, setPokemonName] = useState("");

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
    setRandomId(Math.floor(Math.random() * maxId) + 1);
  }

  useEffect(() => {
    setLoading(true);
    const PokemonIdCall = `https://pokeapi.co/api/v2/pokemon/${randomId}`;
    let cancel;
    axios
      .get(PokemonIdCall, {
        cancelToken: new axios.CancelToken((c) => (cancel = c)),
      })
      .then((res) => {
        setLoading(false);
        setPokemonName(res.data.name);
        setPokemonSprite(res.data.sprites.front_default);
      });
    return () => cancel();
  }, [randomId]);

  if (loading) return "Loading...";

  return (
    <>
      <div>
        <h1>Pokemon Generator</h1>
      </div>
      <div>{pokemonName.toUpperCase()}</div>
      <div>
        <img src={pokemonSprite} alt={pokemonName} height="200px" />
      </div>
      <button onClick={generateRandom}>Generate New Pokemon</button>
    </>
  );
}
