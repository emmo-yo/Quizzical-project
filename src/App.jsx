import React from 'react'
import Questions from './components/Questions'
import Options from './components/Options'
import Answers from './components/Answers'
import {nanoid} from "nanoid"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCat } from '@fortawesome/free-solid-svg-icons'

export default function App() {
    const [start, setStart] = React.useState(false)
    const [check, setCheck] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [correct, setCorrect] = React.useState(0)
    const [questionArray, setQuestion] = React.useState([{
                id: "",
                qText: "",
                qAnswers: [{optionid: "", option: ["",""], isHeld: false, isTrue: false}],
                trueAnswer: ""
            }])
    
    React.useEffect(() => {
        if(start === true){
            getAPI()
        }
    }, [start])
    
    async function getAPI() {
        await fetch("https://opentdb.com/api.php?amount=5&category=27&difficulty=medium&type=multiple&encode=url3986")
            .then(res => res.json())
            .then(data => createQuestions(data))
        setLoading(false)
    }
    
    function createQuestions(data){
        let num = data.results.length
        const newQuestions = []
        setQuestion( prevQuestion => {
            for(let i=0; i < num; i++){
                let tempArray = data.results[i].incorrect_answers
                let randomNum = Math.floor(Math.random()*4)
                tempArray.splice(randomNum, 0, data.results[i].correct_answer)
                let answerArray = []
                for(let j=0; j < 4; j++) {
                    let option = decodeURIComponent(tempArray[j])
                    answerArray.push({optionid: nanoid(), option: option, isHeld: false, isTrue: false})
                }
                let trueAnswer = decodeURIComponent(data.results[i].correct_answer)
                newQuestions.push({
                    id: nanoid(),
                    qText: decodeURIComponent(data.results[i].question),
                    qAnswers: answerArray,
                    trueAnswer: trueAnswer
                })
            }
            return newQuestions
        })
    }
    
    function holdAnswer(parentID, childID, isSmt) {
        const newArray = []
        setQuestion(oldQuestion => oldQuestion.map(oldQ => {
            if(oldQ.id === parentID){
                oldQ.qAnswers.findIndex((item, index) => {
                    if(item.optionid === childID && item.isSmt === true){
                        newArray.push({...item, [isSmt]: false}) 
                    }
                    else if(item.optionid === childID){
                        newArray.push({...item, [isSmt]: !item.isSmt}) 
                    }
                    else{
                        newArray.push({...item, [isSmt]: false})
                    }
                })
                return {...oldQ, qAnswers: newArray}
            }else{
                return oldQ
            }
        }))
    }
    
    const optionsElements = questionArray.map(q => {
        return (
            <React.Fragment key={q.id}>
                <Questions qText={q.qText}/>
                {
                check 
                ?
                <div>
                    <div className="options-row">
                    {   
                        q.qAnswers.map(function(object, i){
                           return <Answers key={object.optionid} option={object.option} isHeld= {object.isHeld} isTrue={object.isTrue}/>
                       })
                    }
                    </div>
                    <hr className="lines" />
                </div>
                :
                <div>
                    <div className="options-row">
                    {   
                        q.qAnswers.map(function(object, i){
                           return <Options key={object.optionid} option={object.option} isHeld= {object.isHeld}
                           holdAnswer={() => holdAnswer(q.id, object.optionid, "isHeld")}/>
                       })
                    }
                    </div>
                    <hr className="lines" />
                </div>
                }
            </React.Fragment>
        )
    })  
    
    function startQuiz() {
        setLoading(true)
        setStart(!start)
    }  
    
    function playAgain(){
        setCheck(!check)
        setCorrect(0)
        setStart(!start)
    }
    
    function checkAnswer() {
        setCheck(!check)
        for (let quiz in questionArray){
            for (let i =0; i< questionArray[quiz].qAnswers.length; i++){
                if (questionArray[quiz].qAnswers[i].option === questionArray[quiz].trueAnswer){
                    holdAnswer(questionArray[quiz].id, questionArray[quiz].qAnswers[i].optionid, "isTrue")
                    if(questionArray[quiz].qAnswers[i].isHeld === true){  
                        setCorrect(oldCorrect => oldCorrect += 1)
                    }
                
                }
            }
        }
    }     
    
    return (
        <div>
            {
                start 
                ?
                <div className="elements-container">
                    {loading && <h1>Loading ...</h1>}
                    {!loading && optionsElements}
                    {
                        check
                        ?
                        <div className="answers-correct">
                            <h2 id="score">You scored {correct} correct answers</h2>
                            <button id="start-again" className="check-btn all-btn" onClick={playAgain}>Play again</button>
                        </div>
                        :
                        <button className="check-btn all-btn" onClick={checkAnswer}>Check answers</button>
                    }
                    <FontAwesomeIcon 
                        icon={faCat} 
                        className="cat-icon"/
                    >
                </div>
                :
                <div className="start-container">
                    <h1>Quizzical</h1>
                    <h3>Test your knowledge!</h3>
                    <button className="start-btn all-btn" onClick={startQuiz}>Start quiz</button>
                    <FontAwesomeIcon 
                        icon={faCat} 
                        className="cat-icon" 
                        id="cat-place"/
                    >
                </div>
            }      
        </div>
    )
}