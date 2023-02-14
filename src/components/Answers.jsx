import React from 'react'

export default function Answers(props) {
    const styles = {
        backgroundColor: props.isTrue && props.isHeld || props.isTrue && !props.isHeld? "#4dff4d" : !props.isTrue && props.isHeld? "#F8BCBC" : "#d1e0e0"
    }
    
    const stylesColor = {
        opacity: props.isTrue && props.isHeld || props.isTrue && !props.isHeld? 1 : 0.5
    }
    
    const stylesBorder = {
        border: props.isTrue && props.isHeld || props.isTrue && !props.isHeld? "1px solid #4dff4d": !props.isTrue && props.isHeld? "1px solid #F8BCBC" : "1px solid #005200"
    }
    
    return (
        <div className="answers-grid" onClick={props.holdAnswer} style={{...styles, ...stylesColor, ...stylesBorder}}>
            <p className="answers">{props.option}</p>
        </div>
    )
}