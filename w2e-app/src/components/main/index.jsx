import {useState, useEffect, useRef} from 'react';
import input from './input.txt';
import Keyboard from 'react-simple-keyboard';
import "react-simple-keyboard/build/css/index.css";

const Main = () => {
    const [inputWord, setInputWord] = useState("");
    const [words, setWords] = useState();
    const [counter, setCounter] = useState(0);
    const [timer, setTimer] = useState({count: 60, time: 60});
    const [wpm, setWpm] = useState(0); 
    const [isActive, setIsActive] = useState(true);
    const [accuracy, setAccuracy] = useState();
    const [step, setStep] = useState(20);
    const [readyWords, setReadyWords] = useState();
    const keyboard = useRef();
    const [layout, setLayout] = useState("default");

    const setDefault = () => {
        setInputWord("");
        setCounter(0);
        const count = timer.time;
        setTimer({...timer, count});
        setIsActive(true);
        setStep(20);
    }

    const onChange = (input) => {
        setInputWord(input);
        console.log("Input changed", input);
        
    };

    const handleTimer = () => {
        const id = setTimeout(() => {
            // console.log(`tick id=${id}`, timer);
            const count = timer.count - 1;
            
            setTimer({ ...timer, count });
        }, 1000);
        return () => clearTimeout(id);
    }

    const handleInputWord = (event) => {
        setInputWord(event.target.value);
        // keyboard.current.setInputWord(event.target.value);
        if(isActive) {
            handleTimer();
        }
        if(words[counter].name.indexOf(inputWord.trim()) !== 0){
            words[counter].class = "red";
        }else{
            words[counter].class = "default";
        }
        
    }

    const handleSpace = (event) => {
        if (event.keyCode === 32) {
            if(inputWord.trim() === words[counter].name){
                words[counter].class = "green";
            }else{
                words[counter].class = "red";
            }
            setInputWord("");
            setCounter(counter + 1);
        }
    }

    const handleTextRefresh = () => {
        fetch(input)
            .then(function(res){
                return res.text();
            }).then(function (content) {

                
            const arr = content.split(/\r?\n/);
            
            const shuffledArr = arr.sort((a, b) => 0.5 - Math.random());
            
            let obj = [];

            for(let i = 0; i < 200; i++){
                obj.push({
                    id: i,
                    name: shuffledArr[i],
                    class: ""
                });
            }

            setDefault();
            setWords(obj);
            setReadyWords(obj.filter((word) => word.id <= step));
            
            
        })
    }

    useEffect(() => {
        handleTextRefresh();
    }, []);

    if(timer.count <= 0){
        
        let cnt = words.filter((word) => word.class === "green" && word.id <= counter).length;
        let sum = (60 / timer.time) * cnt;
        let acrcy = cnt / counter * 100;
        setWpm(sum);
        console.log(wpm);
        if(acrcy === 100) {
            setAccuracy(acrcy);
        }else{
            setAccuracy(acrcy.toPrecision(2));
        }
        
        
        const count = timer.time;
        setTimer({...timer, count});
        setIsActive(false);
    }

    if(counter > step){
        setReadyWords(words.filter((word) => word.id > step && word.id <= step + 20))
        setStep(step + 20);
    }

    const handleShift = () => {
        const newLayoutName = layout === "default" ? "shift" : "default";
        setLayout(newLayoutName);
    };

    const onKeyPress = (button) => {
        console.log("Button pressed", button);

        /**
         * If you want to handle the shift and caps lock buttons
         */
        if (button === "{shift}" || button === "{lock}") handleShift();
    };

    

    return (
        <div className="page">
            <div className={isActive ? "text": "not-text"}>
                {readyWords?.map((word) => (
                    <p key={word.id} className={word.class}>{word.name}</p>
                ))}
            </div>
            <div className="input-word">
                <input type="text" value={inputWord} onChange={handleInputWord} onKeyDown={handleSpace}/>
                <button className="refresh-button" onClick={handleTextRefresh}>Refresh text</button>
                <div>{timer.count}</div>
                <div>WPM: {wpm}</div>
                <div>Accuracy: {accuracy}%</div>
            </div>
            
            <Keyboard
                keyboardRef={(r) => (keyboard.current = r)}
                layoutName={layout}
                onChange={onChange}
                onKeyPress={onKeyPress}
            />
        </div>
    );
}

export default Main;