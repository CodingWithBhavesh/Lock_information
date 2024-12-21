import React, { useState, useEffect } from "react";
import axios from "axios";

function PokemonQuiz() {
  const [pokemon, setPokemon] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [difficulty, setDifficulty] = useState("easy");
  const [hintVisible, setHintVisible] = useState(false);    

  useEffect(() => {
    fetchQuizData();
  }, [difficulty]);

  const fetchQuizData = async () => {
    setLoading(true);
    const range = getRangeForDifficulty(difficulty);
    const correctId = Math.floor(Math.random() * range) + 1;

    try {
      const correctResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${correctId}`);
      const correctName = correctResponse.data.name;
      const otherOptions = await fetchRandomOptions(correctName, optionsCount());

      setPokemon(correctResponse.data);
      setOptions(shuffleOptions([correctName, ...otherOptions]));
      setFeedback("");
      setImageLoaded(false); // Reset image loaded state
      setHintVisible(false); // Reset hint visibility
    } catch (error) {
      console.error("Error fetching Pokémon data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPokemonData = async (id) => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const { abilities, stats } = response.data;
  
      // Extracting abilities
      const abilityNames = abilities.map(ability => ability.ability.name);
  
      // Extracting stats
      const statDetails = stats.map(stat => ({
        name: stat.stat.name,
        baseStat: stat.base_stat
      }));
  
      console.log('Abilities:', abilityNames);
      console.log('Stats:', statDetails);
    } catch (error) {
      console.error("Error fetching Pokémon data:", error);
    }
  };
  
  

  // Get Pokémon range based on difficulty level
  function getRangeForDifficulty(difficulty) {
    switch (difficulty) {
      case "easy":
        return 150; // 1-150
      case "moderate":
        return 250; // 151-400
      case "hard":
        return 498; // 401-898
      default:
        return 150;
    }
  }

  // Get number of options based on difficulty level
  function optionsCount() {
    switch (difficulty) {
      case "easy":
        return 1; // 1 random option
      case "moderate":
        return 2; // 2 random options
      case "hard":
        return 3; // 3 random options
      default:
        return 1;
    }
  }

  // Fetch random incorrect Pokémon names
  async function fetchRandomOptions(correctName, count) {
    const options = new Set();

    while (options.size < count) {
      const id = Math.floor(Math.random() * 898) + 1;
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const name = response.data.name;  

      if (name !== correctName) {
        options.add(name);
      }
    }

    return Array.from(options);
  }

  // Shuffle options array
  function shuffleOptions(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  // Handle user's answer selection
  function handleAnswer(selectedOption) {
    if (selectedOption === pokemon.name) {
      setFeedback("Correct! 🎉");
      setScore(score + 1);
    } else {
      setFeedback(`Wrong! The correct answer was ${pokemon.name}.`);
    }
  }

  // Get option label (A, B, C, D)
  const getOptionLabel = (index) => {
    const labels = ["A", "B", "C", "D"];
    return labels[index];
  };

  // Handle image loading
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // Handle hint button click
  const handleHint = () => {
    setHintVisible(true);
  };

  return (
    <div className="text-center">
      <h1 className="mb-4" style={{ fontVariantCaps: "unicase" }}>Guess the Pokémon!</h1>

      {/* Difficulty Selection */}
      <div className="my-2 form">
        <select
          className="form-select"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          style={{ width: "10rem" }}
        >
          <option value="easy">Easy</option>
          <option value="moderate">Moderate</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {loading ? (
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : (
        pokemon && (
          <>
            {/* Pokémon Image with Loading State */}
            <div className="card mx-auto" style={{ width: "18rem", border: "none", borderRadius: "15px", boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)" }}>
              <img
                src={pokemon.sprites.front_default}
                alt="pokemon"
                className={`card-img-top ${loading || !imageLoaded ? "d-none" : ""}`}
                onLoad={handleImageLoad}
              />
              {!imageLoaded && (
                <img
                  src="https://via.placeholder.com/150"
                  alt="placeholder"
                  className="card-img-top"
                />
              )}
              <p className="card-text" style={{ fontSize: "0.9rem" }}>Choose the correct Pokémon from the options below:</p>
            </div>

            {/* Hint Button */}
            <button className="btn btn-info mt-3" onClick={handleHint}>Get a Hint</button>

            {/* Hint Display */}
            {hintVisible && (
              <div className="alert alert-info mt-3">
                Abilities: {pokemon.abilities.map(ability => ability.ability.name).join(", ")}
                {/* [{fetchPokemonData()}] */}
              </div>
            )}

            {/* Options */}
            <div className="mt-4">
              <div className="align-items-center">
                {options.map((option, index) => (
                  <button
                    key={index}
                    className="btn btn-outline-primary mx-1 my-1 btn-lg"
                    onClick={() => handleAnswer(option)}
                    disabled={feedback !== ""}
                  >
                    {getOptionLabel(index)}: {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback */}
            {feedback && (
              <div
                className={`alert mt-3 ${feedback.startsWith("Correct") ? "alert-success" : "alert-danger"}`}
              >
                {feedback}
              </div>
            )}

            {/* Next Button */}
            {feedback && (
              <button className="btn btn-secondary mt-4" onClick={fetchQuizData}>
                Next Pokémon
              </button>
            )}

            {/* Score */}
            <h3 className="mt-4">Score: {score}</h3>
          </>
        )
      )}
    </div>
  );
}

export default PokemonQuiz;
