import QuestionList from "../../components/QuestionList";
import { useNavigate } from "react-router-dom"; 
import "./QuestionDashboard.css";
export default function QuestionDashboard() {
    const navigate = useNavigate();
    // navigate to add question
    const handleAddQuestion = (e) =>{
        navigate("/addquestion");
    }
    return (
        <div className ="question-container">
            <div className="question-header">
                <div className="question-filter">
                    <h2>All Questions</h2>
                    {/* filter function here */}
                </div>

                <div className="question-add">
                    <button className="question-add-btn" onClick={handleAddQuestion}>Ask Questions</button>
                    {/* add question here */}
                </div>
            </div>
            

            <div className="question-list">
                <QuestionList/>
            </div>
        </div>
    )
}
