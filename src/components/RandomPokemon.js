import axios from "axios";
import React, { useState, useEffect } from "react";

export default function RandomPokemon() {
  const [loading, setLoading] = useState(true);
  const [maxId, setMaxId] = useState(0);
  const [randomId, setRandomId] = useState("");

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

  if (loading) return "Loading...";

  return (
    <>
      <div>
        <h1>Hello world</h1>
      </div>
      <div>{randomId}</div>
      <button onClick={generateRandom}>Generate New Pokemon ID</button>
    </>
  );
}
