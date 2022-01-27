import styles from "./TagFilter.module.css";
import Select from "react-select";
import { useState,useRef, useEffect } from "react";
import { useGlobalState } from "state-pool";
import { useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuthContext } from "../../hooks/useAuthContext";

export default function TagFilter({setTag,tag, setFilter, setPostTypeFilter}) {
    const [categories, setCategories] = useGlobalState("tag");
    const [orderList, setorderList] = useGlobalState("order");
    const [postType, setPostType] = useGlobalState("postType");
    const [chosenPostType, setChosenPostType] = useState("");
    const navigate = useNavigate();
    const [tempTag, setTempTag] = useState(tag);
    const tagRef = useRef();
    const {result} = useParams();
    const {user} = useAuthContext();
    
    
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
  
    // output result
    const handleSearch = (e)=>{
        e.preventDefault();
        // console.log(tag);
        //check valid
        if(tempTag.length !== 0){
            let paramURL = "/tag/";
            // change tag format to only value
            setTag(tempTag.map(item=>{
                paramURL+=item.value+"&";
                return item.value;
            }))
    
            // remove last &
            paramURL = paramURL.substring(0,paramURL.length-1);

            // setTag([]);
            setTempTag([]);
            console.log(tagRef.current);

            navigate(paramURL);
        }
        else{
            Swal.fire('Make sure at least one tag was selected', '', 'info');
        }
        
    }

    // reset input when changing pages
    useEffect(()=>{
        // reset form
        tagRef.current.clearValue();
        // setTag([]);
        setTempTag([]);
        
    },[result]);

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
        <div className={styles.tag_filter_container}>
            <div className={styles.tag_filter}>
                <h2 className={styles.tag_title}>Tags</h2>
                <div className={styles.tag_options}>
                    <Select
                        ref={tagRef}
                        onChange={(option)=>setTempTag(option)}
                        options={categories}
                        isMulti
                    />
                    
                </div>
                
                <div className={styles.tag_btn_container}>
                    <button className={styles.tag_btn} onClick={handleSearch}>Search</button>
                    <AiOutlineSearch className={styles.tag_search} onClick={handleSearch}/>

                </div>

                <div className={styles.sort_by}>
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
                <button className={styles.post_add_btn} onClick={handleAddPost} >Add Something</button>
            </div>
        </div>
    )
}
