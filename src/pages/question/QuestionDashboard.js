import QuestionList from "../../components/QuestionList"; 
export default function QuestionDashboard() {
    return (
        <div>
            <div className="question-filter">
                <h2>All Questions</h2>
                {/* filter function here */}
            </div>

            <div className="question-add">
                <button>Add Questions</button>
                {/* add question here */}
            </div>

            <div className="question-list">
                <QuestionList/>
                {/* add question here */}
            </div>
        </div>
    )
}
