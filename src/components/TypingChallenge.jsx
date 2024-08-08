import React, { useState, useEffect, useRef } from 'react';
import { FaLinkedin, FaInstagram, FaGithub, FaEnvelope } from 'react-icons/fa';
import '../App.css';

function TypingChallenge() {
  const [currentWord, setCurrentWord] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [level, setLevel] = useState(1);
  const [wordsTyped, setWordsTyped] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [words, setWords] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    // Fetch words from dictionary file
    fetch('/dictionary.json')
      .then(response => response.json())
      .then(data => setWords(data.words))
      .catch(error => console.error('Error fetching words:', error));
  }, []);

  useEffect(() => {
    if (gameStarted && level <= 5) {
      generateWord();
      inputRef.current.focus();
      setLevelCompleted(false);
    }
  }, [level, gameStarted]);

  useEffect(() => {
    if (timeLeft > 0 && !levelCompleted && !gameOver) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0) {
      if (wordsTyped >= getWordTarget(level)) {
        setLevelCompleted(true);
      } else {
        setGameOver(true);
      }
    }
  }, [timeLeft, levelCompleted, gameOver]);

  const generateWord = () => {
    if (words.length > 0) {
      const randomWord = words[Math.floor(Math.random() * words.length)];
      setCurrentWord(randomWord);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim().toLowerCase() === currentWord.toLowerCase()) {
      setWordsTyped(wordsTyped + 1);
      setInputValue('');
      generateWord();
    }
  };

  const handleNextLevel = () => {
    if (levelCompleted && level < 5) {
      setLevel(level + 1);
      setWordsTyped(0);
      setTimeLeft(60);
      setInputValue('');
      setLevelCompleted(false);
    } else if (level === 5) {
      setGameOver(true);
      setLevelCompleted(false);
    }
  };

  const resetGame = () => {
    setWordsTyped(0);
    setTimeLeft(60);
    setInputValue('');
    setGameOver(false);
    setLevelCompleted(false);
    setGameStarted(true); // Keep the user at the current level
  };

  const startGame = () => {
    setGameStarted(true);
  };

  const getWordTarget = (level) => {
    switch (level) {
      case 1: return 10;
      case 2: return 20;
      case 3: return 30;
      case 4: return 40;
      case 5: return 50;
      default: return 10;
    }
  };

  const getLevelDescription = (level) => {
    switch (level) {
      case 1: return 'Beginner Typist';
      case 2: return 'Good Typist';
      case 3: return 'Intermediate Typist';
      case 4: return 'Expert Typist';
      case 5: return 'Highly Skilled Typist';
      default: return '';
    }
  };

  const toggleAbout = () => {
    setShowAbout(!showAbout);
  };

  return (
    <div className="typing-challenge">
      <h2>Typo KIZIGENZA</h2>
      {!gameStarted ? (
        <div>
          <p>Click Start to begin the game.</p>
          <button onClick={startGame} className="start-button">Start</button>
        </div>
      ) : (
        <>
          <p>Level: {level} - {getLevelDescription(level)}</p>
          <p>Minimum Words to Pass: {getWordTarget(level)}</p>
          {gameOver ? (
            <div>
              {level === 5 && levelCompleted ? (
                <div>
                  <p>🎉 Big Congratulations! You're a Top Expert in Typing now, TYPO Kizigenza! 🎉</p>
                </div>
              ) : (
                <div>
                  <p>You failed to pass the level.</p>
                </div>
              )}
              <button onClick={resetGame} className="restart-button">Play Again</button>
            </div>
          ) : (
            <div>
              <p>Time Left: {timeLeft}s</p>
              {!levelCompleted && (
                <>
                  <p>Word: {currentWord}</p>
                  <input 
                    ref={inputRef} 
                    type="text" 
                    value={inputValue} 
                    onChange={handleInputChange} 
                    placeholder="Start typing..."
                  />
                </>
              )}
              <p>Words Typed: {wordsTyped}</p>
              {levelCompleted && (
                <div>
                  <p>🎉 Congratulations! You've successfully passed Level {level}. 🎉</p>
                  <button 
                    onClick={handleNextLevel} 
                    className="next-level-button"
                  >
                    {level < 5 ? 'Next Level' : 'Finish'}
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}

      <button onClick={toggleAbout} className="about-button">About</button>

      {showAbout && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={toggleAbout}>&times;</span>
            <h3>About Typo KIZIGENZA</h3>
            <p><strong>How to Play:</strong> Type the words displayed on the screen as fast as you can. Each correct word will generate a new word to type.</p>
            <p><strong>Aim of the Game:</strong> Reach the target number of words within the given time to progress through the levels. Try to reach Level 5 and become a Typing Expert!</p>
            <p><strong>Levels:</strong></p>
            <ul>
              <li>Level 1: Beginner Typist - Type at least 10 words in 60 seconds.</li>
              <li>Level 2: Good Typist - Type at least 20 words in 60 seconds.</li>
              <li>Level 3: Intermediate Typist - Type at least 30 words in 60 seconds.</li>
              <li>Level 4: Expert Typist - Type at least 40 words in 60 seconds.</li>
              <li>Level 5: Highly Skilled Typist - Type at least 50 words in 60 seconds.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Footer Section */}
      <footer className="footer">
        <p>Developed by Yves IRAKOZE MFURA</p>
        <div className="social-links">
          <a href="https://www.linkedin.com/in/yves-irakoze-mfura-203053252/" target="_blank" rel="noopener noreferrer">
            <FaLinkedin size={24} />
          </a>
          <a href="https://www.instagram.com/yves.mfura/" target="_blank" rel="noopener noreferrer">
            <FaInstagram size={24} />
          </a>
          <a href="https://github.com/yvesmfura" target="_blank" rel="noopener noreferrer">
            <FaGithub size={24} />
          </a>
          <a href="mailto:mfuryves25@gmail.com">
            <FaEnvelope size={24} />
          </a>
        </div>
        <p>&copy; 2024 Yves IRAKOZE MFURA. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default TypingChallenge;
