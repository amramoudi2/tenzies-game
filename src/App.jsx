import React from "react";
import { nanoid } from "nanoid";
import Die from "./pages/Die.jsx";
import How from "./pages/HowToPlay.jsx";
import Confetti from "react-confetti"


export default function App() {
    const [dice, setDice] = React.useState(newDies())
    const [tenzies, setTenzies] = React.useState(false)
    const [howPlay, setHowPlay] = React.useState(false)
    const [rolls, setRolls] = React.useState(0)
    const [lowes, setLowes] = React.useState(localStorage.getItem("lowesRoll"))

    React.useEffect(() => {
        const allTrue = dice.every(die => die.isHeld)
        const firstVal = dice[0].value
        const sameVal = dice.every(die => die.value === firstVal)

        if(allTrue && sameVal){
            setTenzies(true)
        }

    },[dice])

    React.useEffect(() => {
        let newestRoll
        if(tenzies && rolls !== undefined){
            newestRoll = rolls
            let lastRoll = localStorage.getItem("lowesRoll")
            localStorage.setItem("lowesRoll", newestRoll)
            if(lastRoll < localStorage.getItem("lowesRoll")){
                localStorage.setItem("lowesRoll", lastRoll)
            }
        }

    },[tenzies])


    function creatNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }

    function newDies() {
        const dieArr = [];
        for (let i = 0; i < 10; i++) {
            dieArr.push(creatNewDie());
        }
        return dieArr;
    }

    function holdDice(id){
        setDice(prevDice => prevDice.map(die => {
            return(
                id === die.id ? {...die, isHeld:!die.isHeld } : die
            )
        }));
    }

    function incrementRoll(){
        setRolls(prevRoll => prevRoll + 1)
    }

    function rollDice(){

        if(tenzies){
            setTenzies(false)
            setDice(newDies())
            setRolls(-1)
            setLowes(localStorage.getItem("lowesRoll"))
        }

        setDice(prevDice => prevDice.map(die => {
            return die.isHeld ? die : creatNewDie()
        }))

        incrementRoll()
    }

    function howToPlayClick(){
        setHowPlay(prevHow => !prevHow)
    }

    const diceMapArr = dice.map(die => (
        <Die
            isHeld={die.isHeld}
            value={die.value}
            key={nanoid()}
            holdDice={() => holdDice(die.id)}
        />
    ));

    const styles = {
        color: rolls <= 0 ? "#fff" : "#000"
    }

    let textColor 

    if(lowes === undefined){
        textColor = "#fff"
    }else if (lowes > 0){
        textColor = "#000"
    }else {
        textColor = "#fff"
    }


    const styles2 = {
       color: textColor
    }

    return (
        <main>
            {tenzies && <Confetti
            width={400}
            height={400}
            />}
            <h1>{tenzies ? "YOU WON!" : "Tenzies"}</h1>
            <div className="main--content">
                {diceMapArr}
            </div>
            <button onClick={rollDice}>{tenzies ? "play again" : "Roll"}</button>
            {!howPlay && <p onClick={howToPlayClick} className="how--to--play--btn">how to play</p>}
            {howPlay && <How how={howToPlayClick}/>}
            <h2 className="rolls" style={styles}>Rolls: {rolls}</h2>
            <p className="best--rolls" style={styles2}>Best Rolls: {lowes}</p>
        </main>
    );
}
