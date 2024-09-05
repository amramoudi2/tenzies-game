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
    const [lowes, setLowes] = React.useState(() => {
        // Get the saved lowest roll from localStorage or initialize to a high value (999)
        return localStorage.getItem("lowesRoll") || 999;
    });

    React.useEffect(() => {
        const allTrue = dice.every(die => die.isHeld);
        const firstVal = dice[0].value;
        const sameVal = dice.every(die => die.value === firstVal);

        if (allTrue && sameVal) {
            setTenzies(true);
        }
    }, [dice]);

    React.useEffect(() => {
        if (tenzies) {
            const savedLowestRoll = parseInt(localStorage.getItem("lowesRoll")) || 999;

            // If the current roll count is lower than the saved value, update the localStorage and state
            if (rolls < savedLowestRoll) {
                localStorage.setItem("lowesRoll", rolls);
                setLowes(rolls);
            }
        }
    }, [tenzies, rolls]);

    function creatNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        };
    }

    function newDies() {
        const dieArr = [];
        for (let i = 0; i < 10; i++) {
            dieArr.push(creatNewDie());
        }
        return dieArr;
    }

    function holdDice(id) {
        setDice(prevDice => prevDice.map(die => {
            return (
                id === die.id ? { ...die, isHeld: !die.isHeld } : die
            );
        }));
    }

    function incrementRoll() {
        setRolls(prevRoll => prevRoll + 1);
    }

    function rollDice() {
        if (tenzies) {
            setTenzies(false);
            setDice(newDies());
            setRolls(0);
        } else {
            setDice(prevDice => prevDice.map(die => {
                return die.isHeld ? die : creatNewDie();
            }));
            incrementRoll();
        }
    }

    function howToPlayClick() {
        setHowPlay(prevHow => !prevHow);
    }

    const diceMapArr = dice.map(die => (
        <Die
            isHeld={die.isHeld}
            value={die.value}
            key={die.id} // Use the die.id directly here
            holdDice={() => holdDice(die.id)}
        />
    ));

    const styles = {
        color: rolls <= 0 ? "#fff" : "#000"
    };

    const styles2 = {
        color: lowes < 999 ? "#000" : "#fff" // Show in black if we have a valid lowes value
    };

    return (
        <main>
            {tenzies && <Confetti width={400} height={400} />}
            <h1>{tenzies ? "YOU WON!" : "Tenzies"}</h1>
            <div className="main--content">
                {diceMapArr}
            </div>
            <button onClick={rollDice}>{tenzies ? "Play Again" : "Roll"}</button>
            {!howPlay && <p onClick={howToPlayClick} className="how--to--play--btn">How to Play</p>}
            {howPlay && <How how={howToPlayClick} />}
            <h2 className="rolls" style={styles}>Rolls: {rolls}</h2>
            <p className="best--rolls" style={styles2}>Best Rolls: {lowes !== 999 ? lowes : "N/A"}</p>
        </main>
    );
}
