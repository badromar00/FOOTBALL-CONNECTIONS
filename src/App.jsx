import React, { useState, useEffect } from 'react';
import './App.css';


const wordGroups = [
 { name: "CENTER BACKS", words: ["RAMOS", "MALDINI", "BARESI", "PUYOL"], color: "#2EFF2E" },
 { name: "YOUNG STARS", words: ["DOKU", "PEDRI", "YAMAL", "GULER"], color: "#FFEA00" },
 { name: "WORLD CUP FINAL SCORERS", words: ["INIESTA", "GOTZE", "ZIDANE", "MBAPPE"], color: "#FF5733" },
 { name: "CHELSEA REJECTS", words: ["SALAH", "LUKAKU", "DE BRUYNE", "RICE"], color: "#C41E3A" }
];


const allWords = wordGroups.flatMap(group => group.words);


function App() {
 const [words, setWords] = useState(allWords);
 const [selectedWords, setSelectedWords] = useState([]);
 const [mistakes, setMistakes] = useState(4);
 const [completedGroups, setCompletedGroups] = useState([]);
 const [gameOver, setGameOver] = useState(false);
 const [guessedCombinations, setGuessedCombinations] = useState([]);
 const [message, setMessage] = useState('');
 const [nextPuzzleTime, setNextPuzzleTime] = useState(null);
 const [countdown, setCountdown] = useState('');
 const [showAnimation, setShowAnimation] = useState(false);


 useEffect(() => {
   shuffle();
   calculateNextPuzzleTime();
 }, []);


 useEffect(() => {
   if (nextPuzzleTime) {
     const timer = setInterval(() => {
       const now = new Date();
       const difference = nextPuzzleTime - now;


       if (difference > 0) {
         const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
         const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
         const seconds = Math.floor((difference % (1000 * 60)) / 1000);


         setCountdown(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
       } else {
         clearInterval(timer);
         calculateNextPuzzleTime();
       }
     }, 1000);


     return () => clearInterval(timer);
   }
 }, [nextPuzzleTime]);


 const calculateNextPuzzleTime = () => {
   const now = new Date();
   const pacificTime = new Date(now.toLocaleString("en-US", {timeZone: "America/Los_Angeles"}));
   const tomorrow = new Date(pacificTime);
   tomorrow.setDate(tomorrow.getDate() + 1);
   tomorrow.setHours(0, 0, 0, 0);
   setNextPuzzleTime(tomorrow);
 };


 const toggleWord = (word) => {
   if (gameOver) return;
   if (selectedWords.includes(word)) {
     setSelectedWords(selectedWords.filter(w => w !== word));
   } else if (selectedWords.length < 4) {
     setSelectedWords([...selectedWords, word]);
   }
 };


 const checkGroup = () => {
   if (selectedWords.length !== 4) {
     setMessage("Please select exactly 4 words before submitting.");
     return;
   }
   

   

   const sortedSelection = [...selectedWords].sort().join(',');
   if (guessedCombinations.includes(sortedSelection)) {
     setMessage("You've already guessed this combination!");
     setSelectedWords([]);
     return;
   }


   setGuessedCombinations([...guessedCombinations, sortedSelection]);


   const matchedGroup = wordGroups.find(group =>
     selectedWords.every(word => group.words.includes(word)) &&
     group.words.every(word => selectedWords.includes(word))
   );


   if (matchedGroup) {
     const newCompletedGroups = [...completedGroups, matchedGroup];
     setCompletedGroups(newCompletedGroups);
     setWords(words.filter(word => !selectedWords.includes(word)));
     setSelectedWords([]);
     setMessage("Correct! You've found a group.");
    
     if (newCompletedGroups.length === wordGroups.length) {
       setGameOver(true);
     }
   } else {
     setMistakes(mistakes - 1);
     setMessage("Incorrect. Try again!");
     if (mistakes - 1 === 0) {
       setGameOver(true);
     } else {
       setSelectedWords([]);
     }
   }
 };


 const shuffle = () => {
   setWords([...words].sort(() => Math.random() - 0.5));
 };


 const deselectAll = () => {
   setSelectedWords([]);
 };


 const resetGame = () => {
   setWords(allWords);
   setSelectedWords([]);
   setMistakes(4);
   setCompletedGroups([]);
   setGameOver(false);
   setGuessedCombinations([]);
   setMessage('');
   shuffle();
 };


 const renderGameBoard = () => (
   <>
     {completedGroups.map((group, index) => (
       <div key={index} className="completed-group" style={{backgroundColor: group.color}}>
         <h3>{group.name}</h3>
         <p>{group.words.join(', ')}</p>
       </div>
     ))}
     <div className="word-grid">
       {words.map(word => (
         <button
           key={word}
           className={`word-button ${selectedWords.includes(word) ? 'selected' : ''}`}
           onClick={() => toggleWord(word)}
         >
           {word}
         </button>
       ))}
     </div>
     <div className="message">{message}</div>
     <div className="mistakes">
       Mistakes remaining: {Array(mistakes).fill('').map((_, i) => (
         <span key={i} className="mistake-dot" />
       ))}
     </div>
     <div className="controls">
       <button onClick={shuffle}>Shuffle</button>
       <button onClick={deselectAll}>Deselect all</button>
       <button onClick={checkGroup}>Submit</button>
     </div>
   </>
 );


 const renderGameOver = () => {
   const isWin = completedGroups.length === wordGroups.length;
   return (
     <div className="results">
       {isWin ? <h2>Congratulations, you won!</h2> : <h2>Next Time!</h2>}
       <p>Connections #{1}</p>
       <div className="color-grid">
         {wordGroups.map((group, index) => (
           <div key={index} className="color-row">
             {group.words.map((word, wordIndex) => (
               <div key={wordIndex} className="color-square" style={{backgroundColor: group.color}}></div>
             ))}
           </div>
         ))}
       </div>
       <div className="next-puzzle">
         <p>NEXT PUZZLE IN</p>
         <h3>{countdown}</h3>
       </div>
     </div>
   );
 };


 return (
   <div className="App">
     <h1>Football Connections ⚽️ </h1>
     <h2>Create four groups of four!</h2>
     {gameOver ? renderGameOver() : renderGameBoard()}
   </div>
 );
}


export default App;





