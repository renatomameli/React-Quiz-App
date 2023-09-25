import React from "react"
import QuizPart from './components/QuizPart'
import {nanoid} from 'nanoid'


export default function App() {
    const [startScreen, setStartScreen] = React.useState(true)
    const [quizData, setQuizData] = React.useState([])
    const [gameFinished, setGameFinished] = React.useState(false)
    const [correctAnswers, setCorrectAnswers] = React.useState(0)
    const [selectedAnswers, setSelectedAnswers] = React.useState(["","","",""])
    const [newGame, setNewGame] = React.useState(0)
    
    React.useEffect(function() {
        fetch("https://opentdb.com/api.php?amount=4")
            .then(res => res.json())
            .then(data => setQuizData(data.results.map(result => {
                let allAnswers = result.incorrect_answers.map(incorrectAnswer => {  
                    return {answer: incorrectAnswer, correct: false}})
                allAnswers.push({answer: result.correct_answer, correct: true})
                allAnswers = shuffleArray(allAnswers)
                return {...result, allAnswers}
            })))
    }, [newGame])

    let i = -1
    const quizQuestions = quizData.map(result => {
            i++
            return (
                <QuizPart 
                    question={result.question}
                    correctAnswer={result.correct_answer}
                    incorrectAnswers={result.incorrect_answers}
                    selectAnswer={selectAnswer}
                    key={nanoid()}
                    index={i}
                    selectedAnswer={selectedAnswers[i]}
                    gameFinished={gameFinished}
                    allAnswers={result.allAnswers}
                />)
    })
    
    function startQuiz(){
        setStartScreen(prevStartScreen => !prevStartScreen)
    }
    
    function selectAnswer(answer, index){
        switch(index) {
            case 0:
                setSelectedAnswers(prev => [answer,selectedAnswers[1],selectedAnswers[2],selectedAnswers[3]])
                break
            case 1:
                setSelectedAnswers(prev => [selectedAnswers[0],answer,selectedAnswers[2],selectedAnswers[3]])
                break
            case 2:
                setSelectedAnswers(prev => [selectedAnswers[0],selectedAnswers[1],answer,selectedAnswers[3]])
                break
            case 3:
                setSelectedAnswers(prev => [selectedAnswers[0],selectedAnswers[1],selectedAnswers[2],answer])
                break
            default:
                setSelectedAnswers(prev => [selectedAnswers[0],selectedAnswers[1],selectedAnswers[2],selectedAnswers[3]])
        }
    }
    
    function submitAnswers(){
        let correctAnswers = 0
        for (let i=0; i<quizData.length; i++){
            if (quizData[i].correct_answer === selectedAnswers[i]){
                correctAnswers++
            }            
        }
        setCorrectAnswers(correctAnswers)
        setGameFinished(true)
    }
    
    function startNewGame(){
        setNewGame(newGame+1)
        setGameFinished(false)
        setSelectedAnswers(["","","",""])
    }
    
    function shuffleArray(a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }
    
   
    return (
        <main>
            <img src="./img/bluebackground.png" className="blueback" 
            width={startScreen ? "200px" : "70px"}
            />
            <img src="./img/yellowbackground.png" className="yellowback" 
            width={startScreen ? "200px" : "100px"}
            />
            <div className="main-container">
                {startScreen && <div className="start-container">
                    <h1>Quizzical</h1>
                    <p className="description">Some description if needed</p>
                    <button onClick={startQuiz} className="start-button">Start Quiz</button>
                </div>}
            </div> 
            {!startScreen && <div className="quiz-screen">
                <center>
                    {quizQuestions}
                    {gameFinished == true && <h3 className="result-text">{"You scored " + correctAnswers + "/4 correct answers"}</h3>}
                    {gameFinished ? <button onClick={startNewGame} className="check-button">New Game</button> : <button onClick={submitAnswers} className="check-button">Check Answers</button>}
                </center>
            </div>}       
        </main>
    )
}

// Play new game function
// decoding text
// Show wrong/right answers
// Align buttons 
// Random Index Performance improvement