import {useState, useEffect} from 'react';
import Categories from './Categories';
import Question from './Question';
import './App.css'
const App = ()=>{
    useEffect(()=>{
        getCategories(APIurl);
    }, [])
    const [buttonClicked, setButtonClicked] = useState([]);
    const [category, setCategory] = useState([]);
    const [questionNumber, setQuestionNumber] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [correct, setCorrect] = useState(0);
    const [questionAnswers, setQuestionAnswers] = useState([]);
    const [buttonsSelected, setButtonsSelected] = useState(0);
    const APIurl = "https://opentdb.com/api_category.php"
    const getCategories = async (url)=>{
        const response = await fetch(url);
        const data = await response.json();
        const result = data.trivia_categories;
        setCategory(result);
    };
    const getQuestions = async (input)=>{
       const urlForm = `https://opentdb.com/api.php?amount=10&category=${input}&type=multiple`;
       const response = await fetch(urlForm);
       const data = await response.json();
       setQuestions(data.results);
       setQuestionNumber(1);
    }
    useEffect(()=>{
        if(questionNumber<11){
            if(questionNumber===10){
                document.getElementsByClassName("nextButton")[0].innerHTML = "Submit Quiz";
                let temp = shuffle([...questions[questionNumber-1].incorrect_answers, questions[questionNumber-1].correct_answer])
                setQuestionAnswers(temp);
                setQuestion(decodeHTMLEntities(questions[questionNumber-1].question));
                document.getElementById("questionWrapper").style.display = "flex";
            }else if(questionNumber>0 && questionNumber!==10){
                let temp = shuffle([...questions[questionNumber-1].incorrect_answers, questions[questionNumber-1].correct_answer])
                setQuestionAnswers(temp);
                setQuestion(decodeHTMLEntities(questions[questionNumber-1].question));
                document.getElementById("questionWrapper").style.display = "flex";                       
            }
        }else if(questionNumber===11){
            console.log(questionNumber);
            setQuestion("Congrats!");
            document.getElementsByClassName("nextButton")[0].innerHTML = "Restart Quiz";
        }
    const restartQuiz = ()=>{

    };
    },[questionNumber]);
    const handleButtonClick = (e) =>{
        if(buttonClicked.length===0){
            setButtonClicked(e.target);
            e.target.style.backgroundColor = "rgba(117, 117, 117)" 
        }else if(e.target===buttonClicked){
            e.target.style.backgroundColor = null;
            setButtonClicked([]);
        }else{
            buttonClicked.style.backgroundColor = null;
            e.target.style.backgroundColor = "rgba(117, 117, 117)"
            setButtonClicked(e.target); 
        }
        
    }
    const [question, setQuestion] = useState(["Pick a category"]);
    return( 
        <div className="centerBox">
            <header id="topHeader">
                <h1 id="quizLabel">Quiz</h1>
            </header>
            <div id="mainContent">
            <h1 className="currentQuestion">
                {question}
            </h1>
            <div id="questionWrapper">
            { 
            questionNumber>0 && questionNumber<11?questionAnswers.map((question)=><Question content={question} buttonHandler={handleButtonClick}/>):undefined
            }
            {
                questionNumber>10?
                <div id="resultsWrapper">
                <h1 id="results">{`You scored a ${correct} out of 10`}</h1>
                </div>:undefined
            }
            
            </div>
            {
                questionNumber===0?<select name="category" id="categorySelector">
                <option value="">Select an option below</option>
                {category.length!==0?category.map((item)=><Categories type={item} />):console.log("Empty")}
                </select>
                :undefined
            }
            
           
            </div>
            
            <footer id="footer">
                {
                    questionNumber===0?<button id="startQuiz" onClick={(e)=>{
                        if(document.getElementById("categorySelector").value>0){
                            const startQuiz = new Promise((resolve, reject)=>{
                                getQuestions(document.getElementById("categorySelector").value);
                            });
                            startQuiz.then(
                                
                            ); 
                        }
                    }}>
                    Confirm
                    
                    </button>:undefined

                }
                
                {
                    questionNumber>0?
                    <button  onClick={()=>{
                        let currentSelection = buttonClicked.innerHTML;
                        if(currentSelection !== undefined){
                            buttonClicked.style.backgroundColor = null;
                            let correctAnswer = decodeHTMLEntities(questions[questionNumber-1].correct_answer);
                            if(correctAnswer === currentSelection){
                                let temp = correct + 1;
                                setCorrect(temp);
                            }
                            setButtonClicked([]);
                            let current = questionNumber + 1;
                            setQuestionNumber(current++);
                        }else if(questionNumber===11){
                            setQuestionNumber(0);
                            setQuestion("Pick a category");
                            setCorrect(0);
                            document.getElementById("questionWrapper").style.display = "none";

                        }
                        
                        //console.log(current);
                        
                    }}  
                    className="nextButton">{"Next Question"}</button>
                    
                   : undefined
                }
                {
                    questionNumber<11?<h2 id="questionNumber">{questionNumber} of {questions.length}</h2>:
                    <h2 id="questionNumber">Done!</h2>
                }
                
           </footer>            
        </div>
    )
}
//Fisher-Yates Shuffle
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex > 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }
//HTML Decoder
function decodeHTMLEntities(text) {
    const parser = new DOMParser();
    const dom = parser.parseFromString('<!doctype html><body>' + text, 'text/html');
    return dom.body.textContent;
}
function selectButton(e){

}
export default App;
