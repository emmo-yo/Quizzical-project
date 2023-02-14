import React from 'react'

export default function Options(props) {
    
    const styles = {
        backgroundColor: props.isHeld? "#66d9ff" : "#d1e0e0"
    }
    
    const stylesBorder = {
        border: props.isHeld? "1px solid #66d9ff" : "1px solid #005200"
    }
    
    return (
        <div className="answers-grid" onClick={props.holdAnswer} style={{...styles, ...stylesBorder}}>
            <p className="answers">{props.option}</p>
        </div>
    )
}