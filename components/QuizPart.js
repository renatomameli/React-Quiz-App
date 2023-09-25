import React from 'react'
import {nanoid} from 'nanoid'

export default function QuizPart(props){
   
    function htmlDecode(input) {
        let doc = new DOMParser().parseFromString(input, "text/html");
        return doc.documentElement.textContent;
    }

    const answerButtons = props.allAnswers.map(answer => {
        var style = {}
        if (props.gameFinished){
            if(answer.correct){
                style = {background: "#94D7A2"}
            }  else if (props.selectedAnswer===answer.answer){
                style = {background: "#F8BCBC"}
            }
            
        } 
        return (
            <button disabled={props.gameFinished} className={props.selectedAnswer === answer.answer ? "selected" : "incorrect"} onClick={(event) => props.selectAnswer(answer.answer, props.index)} key={nanoid()} style={style}>{htmlDecode(answer.answer)} </button>
        )
    })
    
    return (
        <div className="quiz-part">
            <h2>{htmlDecode(props.question)}</h2>
            {answerButtons}
            <hr className="border"></hr> 
        </div>
    )
}