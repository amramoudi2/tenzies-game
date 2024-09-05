import React from 'react';
import howToPlay from '../assets/how-to-play.gif';


export default function How(props){
    return(
        <div className="howToPlay">
            <div className="howToPlay--contener">
                <p className="how--to--play--text">Roll until all dice are the same. Click <br/> each die to freeze it at its current value <br/> between rolls.</p>
                <img className='how--to--play--img' src={howToPlay} alt="Roll until all dice are the same. Click each die to freeze it at its current value between rolls."/>
                <h1 onClick={props.how} className="close--btn">X</h1>
            </div>
        </div>
    )
}