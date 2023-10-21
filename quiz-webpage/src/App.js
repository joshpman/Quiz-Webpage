import {useState, useEffect} from 'react';
import Categories from './Categories';
import Question from './Question';
import './App.css'
const App = ()=>{
    useEffect(()=>{
        getCategories(APIurl);
    }, [])
    const [category, setCategory] = useState([]);
    const [questionNumber, setQuestionNumber] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [correct, setCorrect] = useState(0);
    const [questionAnswers, setQuestionAnswers] = useState([]);
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
       console.log(data.results);
       setQuestionNumber(1);
    }
    useEffect(()=>{
        if(questionNumber>0){
            let temp = shuffle([...questions[questionNumber-1].incorrect_answers, questions[questionNumber-1].correct_answer])
            setQuestionAnswers(temp);
            setQuestion(decodeHTMLEntities(questions[questionNumber-1].question));
        }
    },[questionNumber]);
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
            questionNumber>0?questionAnswers.map((question)=><Question content={question} />):undefined
            }
            </div>
            <select name="category" id="categorySelector">
                <option value="">Select an option below</option>
                {category.length!==0?category.map((item)=><Categories type={item} />):console.log("Empty")}
            
            </select>
           
            </div>
            
            <footer id="footer">
                <button id="startQuiz" onClick={(e)=>{
                    if(document.getElementById("categorySelector").value>0){
                        const startQuiz = new Promise((resolve, reject)=>{
                            getQuestions(document.getElementById("categorySelector").value);
                        });
                        startQuiz.then(
                            document.getElementById("categorySelector").remove(),
                            e.target.remove()
                        ); 
                    }
                }}>
                Confirm
                
                </button>
                {
                    questionNumber>0?
                    <button  onClick={()=>{
                        let current = questionNumber + 1;
                        console.log(current);
                        setQuestionNumber(current++);
                    }}  
                    className="nextButton">{"Next Question"}</button>
                    
                   : undefined
                }
                <h2 id="questionNumber">{questionNumber} of {questions.length}</h2>
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
