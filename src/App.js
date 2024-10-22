import React, { useState, useEffect } from 'react';
import {antd} from "antd";
import {Input, Button} from "antd";
import { Typography } from "antd";
import './App.css';

const {Paragraph, Title} = Typography;


const getRandomCities = (citiesArray, numOfCities) => {
  const selectedCities = [];
  const availableCities = [...citiesArray];

  for (let i = 0; i < numOfCities; i++) {
    const randomIndex = Math.floor(Math.random() * availableCities.length);
    selectedCities.push(availableCities.splice(randomIndex, 1)[0]);
  }

  return selectedCities;
};

const App = () => {
  const allCities = [
    'London', 'New York', 'Tokyo', 'Berlin', 'Moscow', 'Paris', 'Sydney', 'Toronto', 'Beijing', 'Rio de Janeiro',
    'Dubai', 'Rome', 'Delhi', 'Madrid', 'Bangkok', 'Cairo', 'Istanbul', 'Mexico City', 'Seoul', 'Los Angeles'
  ];

  const [cities, setCities] = useState(getRandomCities(allCities, 5));
  const [guesses, setGuesses] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [step, setStep] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const fetchWeatherData = async () => {
      const apiKey = "fd48bdf8a8b87b3c140f17625f4e2d57";
      const results = await Promise.all(
        cities.map(async (city) => {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
          );
          const data = await response.json();
          return data.main.temp;
        })
      );
      setCorrectAnswers(results);
    };

    fetchWeatherData();
  }, [cities]);

  const handleGuessSubmit = () => {
    if (step < 5) {
      setGuesses([...guesses, Number(currentGuess)]);
      setCurrentGuess('');
      setStep(step + 1);
      setTimeout(()=> {
        if (step === 4) {
          setGameOver(true);
        }
      },2000)      
    }
  };

  const handleReset = () => {
    setCities(getRandomCities(allCities, 5)); 
    setGuesses([]); 
    setCorrectAnswers([]); 
    setCurrentGuess(''); 
    setStep(0); 
    setGameOver(false); 
  };

  const correctGuessesCount = guesses.filter(
    (guess, index) => Math.abs(guess - correctAnswers[index]) <= 5
  ).length;

  return (
    <div className='container'>
      <Title level={1}>Temperature Guessing Game</Title>
      {!gameOver ? (
        <div className=''>
          <Title level={2}>Guess the temperature for <i style={{color:"red"}}>{cities[step]}</i></Title>
          <Input 
            type="number"
            value={currentGuess}
            onChange={(e) => setCurrentGuess(e.target.value)}
            placeholder="Enter temperature"
          />
          <Button onClick={handleGuessSubmit}>Submit Guess</Button>

          <div className="guess-grid">
            {guesses.map((guess, index) => {
              const isCorrect = Math.abs(guess - correctAnswers[index]) <= 4;
              return (
                <div
                  key={index}
                  className={`guess-box ${isCorrect ? 'correct' : 'incorrect'}`}
                >
                  <Paragraph>{cities[index]}</Paragraph>
                  <Paragraph>Your guess: {guess}°C</Paragraph>
                  <Paragraph>Actual: {correctAnswers[index]}°C</Paragraph>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div>
          {correctGuessesCount >= 4 ? (
            <h2>Congratulations! You won with {correctGuessesCount} correct guesses!</h2>
          ) : (
            <h2>Game Over. You got {correctGuessesCount} correct guesses.</h2>
          )}
          <Button onClick={handleReset} style={{backgroundColor:"red"}}>Reset Game</Button>
        </div>
      )}
    </div>
  );
};

export default App;
