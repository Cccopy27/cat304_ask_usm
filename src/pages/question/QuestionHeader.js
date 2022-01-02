import styles from "./QuestionHeader.module.css";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { useGlobalState } from "state-pool";

export default function QuestionFilter({setFilter}) {
    const [orderList, setorderList] = useGlobalState("order");

    const navigate = useNavigate();
    // navigate to add question
    const handleAddQuestion = (e) =>{
        navigate("/addquestion");
    }

    const handleFilter=(options)=>{
        switch(options.value){
            case "Latest": 
                setFilter(["added_at","desc"]);
                break;
            case "View": 
                // setFilter(["added_at","desc"]);
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

    return (
        
        <div className={styles.question_header}>
            <div className={styles.question_filter}>
                <h2 className={styles.question_header_title}>All Questions</h2>
                {/* <div className={styles.question_tags}>Tags</div> */}

                <div className={styles.question_sort}>
                    <Select
                    onChange={handleFilter}
                    options={orderList}
                    defaultValue={orderList[0]}
                    />
                </div>
            </div>
            <div className={styles.question_add}>
                <button className={styles.question_add_btn} onClick={handleAddQuestion}>Ask Something</button>
            </div>

        </div>
        
    )
}
