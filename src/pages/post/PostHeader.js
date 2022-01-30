import styles from "./PostHeader.module.css";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { useState } from "react";
import { useGlobalState } from "state-pool";
import { useAuthContext } from "../../hooks/useAuthContext";
import Swal from "sweetalert2";

export default function PostFilter({setFilter, setPostTypeFilter}) {
    const [orderList, setorderList] = useGlobalState("order");
    const {user} = useAuthContext();
    const [postType, setPostType] = useGlobalState("postType");
    const [chosenPostType, setChosenPostType] = useState("");
    const navigate = useNavigate();

    // navigate to add post
    const handleAddPost = (e) =>{
        e.preventDefault();
        if (!user) {
            Swal.fire("Please login to add something","","warning");
        }
        else{
            navigate("/addpost");
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
                setFilter(["upVote","desc"])
                break;
            case "Oldest":
                setFilter(["added_at","asc"]);
                
                break;
            default: 
                setFilter(["added_at","desc"]);
        }
    }

    const handlePostType = (options) => {
        switch(options.value) {
            case "Question":
                setPostTypeFilter(["post_type", "==", "Question"]);
                break;

            case "Non-Question":
                setPostTypeFilter(["post_type", "==", "Non-Question"]);
                break;

            case "All":
                setPostTypeFilter([]);
                break;

            default:
                setPostTypeFilter([]);
        }
    }

    return (
        
        <div className={styles.post_header}>
            <div className={styles.post_filter}>
                <h2 className={styles.post_header_title}>All Results</h2>
                {/* <div className={styles.post_tags}>Tags</div> */}

                <div className={styles.post_sort}>
                    <Select
                    onChange={handleFilter}
                    options={orderList}
                    defaultValue={orderList[0]}
                    />
                </div>

                <div className={styles.post_type}>
                    <Select
                        onChange={handlePostType}
                        options={postType}
                        defaultValue={{label: "All",value:"All"}}
                    />
                </div>
            </div>
            <div className={styles.post_add}>
                <button className={styles.post_add_btn} onClick={handleAddPost}>Add Something</button>
            </div>

        </div>
        
    )
}
