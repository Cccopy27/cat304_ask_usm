import styles from "./UserHeader.module.css";
import { useState,useRef, useEffect } from "react";
import { useGlobalState } from "state-pool";
import { useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuthContext } from "../../hooks/useAuthContext";
import Select from "react-select";

export default function UserHeader( {setFilter} ) {
    const [userName, setUserName] = useState(null);
    const [orderList, setorderList] = useGlobalState("order");
    const navigate = useNavigate();
    const {user} = useAuthContext();
    const {result} = useParams();

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

    // output result
    const handleSearch = (e)=>{
        e.preventDefault();
        // console.log(tag);
        //check valid
        if(userName){
            const paramURL = `/user/${userName}`;

            setUserName(null);
            navigate(paramURL);

        }
        else{
            Swal.fire('Invalid username', '', 'error');
        }
        
    }

    // reset input when changing pages
    useEffect(()=>{

        setUserName(null);
    },[result]);

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
        <div className={styles.user_filter_container}>
            <div className={styles.user_filter}>
                <h2 className={styles.user_title}>User</h2>
                <form className={styles.user_options}>
                    <label className={styles.userlabel}>
                        <input
                        className={styles.userInput}
                            onChange={(e)=>setUserName(e.target.value)}
                            value={userName}
                            required
                        />
                    </label>
                    
                <div className={styles.user_btn_container}>
                    <button className={styles.user_btn} onClick={handleSearch}>Search</button>
                    <AiOutlineSearch className={styles.user_search} onClick={handleSearch}/>

                </div>
                    
                </form>
                

                <div className={styles.sort_by}>
                    <Select
                        onChange={handleFilter}
                        options={orderList}
                        defaultValue={orderList[0]}
                    />
                </div>
            </div>
            
            <div className={styles.question_add}>
                <button className={styles.question_add_btn} onClick={handleAddQuestion} >Add Something</button>
            </div>
        </div>
    )
}
