import styles from "./QuestionHeader.module.css";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { useState } from "react";
import { useGlobalState } from "state-pool";
import { useAuthContext } from "../../hooks/useAuthContext";
import Swal from "sweetalert2";

export default function QuestionFilter({setFilter, setQuestionTypeFilter}) {
    const [orderList, setorderList] = useGlobalState("order");
    const {user} = useAuthContext();
    const [questionType, setQuestionType] = useGlobalState("questionType");
    const [chosenQuestionType, setChosenQuestionType] = useState("");
    const navigate = useNavigate();

    // navigate to add question
    const handleAddQuestion = (e) =>{
        e.preventDefault();
        if (!user) {
            Swal.fire("Please login to add something","","warning");
        }
        else{
            navigate("/addquestion");
        }
    }

    const handleFilter=(options)=>{
        switch(options.value){
            case "Latest": 
                setFilter(["added_at","desc"]);
                break;
            case "View": 
                setFilter(["view","desc"]);
                break;
            case "Rating":
                
                break;
            case "Oldest":
                setFilter(["added_at","asc"]);
                
                break;
            default: 
                setFilter(["added_at","desc"]);
        }
    }

    const handleQuestionType = (options) => {
        switch(options.value) {
            case "Question":
                setQuestionTypeFilter(["question_type", "==", "Question"]);
                break;

            case "Non-Question":
                setQuestionTypeFilter(["question_type", "==", "Non-Question"]);
                break;

            case "All":
                setQuestionTypeFilter([]);
                break;

            default:
                setQuestionTypeFilter([]);
        }
    }

    return (
        
        <div className={styles.question_header}>
            <div className={styles.question_filter}>
                <h2 className={styles.question_header_title}>All Results</h2>
                {/* <div className={styles.question_tags}>Tags</div> */}

                <div className={styles.question_sort}>
                    <Select
                    onChange={handleFilter}
                    options={orderList}
                    defaultValue={orderList[0]}
                    />
                </div>

                <div className={styles.question_type}>
                    <Select
                        onChange={handleQuestionType}
                        options={questionType}
                        defaultValue={{label: "All",value:"All"}}
                    />
                </div>
            </div>
            <div className={styles.question_add}>
                <button className={styles.question_add_btn} onClick={handleAddQuestion}>Add Something</button>
            </div>

        </div>
        
    )
}
