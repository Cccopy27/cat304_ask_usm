import QuestionList from "../../components/QuestionList";
import { useNavigate } from "react-router-dom"; 
export default function QuestionDashboard() {
    const navigate = useNavigate();
    // navigate to add question
    const handleAddQuestion = (e) =>{
        navigate("/addquestion");
    }
    return (
        <div>
            <div className="question-filter">
                <h2>All Questions</h2>
                {/* filter function here */}
            </div>

            <div className="question-add">
                <button onClick={handleAddQuestion}>Add Questions</button>
                {/* add question here */}
            </div>

            <div className="question-list">
                <QuestionList/>
            </div>
        </div>
    )
}
