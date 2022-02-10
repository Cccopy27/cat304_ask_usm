import styles from "./TagDashboard.module.css"
import TagFilter from "./TagFilter"
import { useState, useEffect } from "react";
import TagResult from "./TagResult";
import { useParams } from "react-router-dom";
import { db } from "../../firebase/config";
import { collection ,onSnapshot, query, where,orderBy,getDocs } from "firebase/firestore";
import { useCollection } from "../../hooks/useCollection";


export default function TagDashboard() {
    const [filter, setFilter] = useState(["added_at","desc"]);
    const [postTypeFilter, setPostTypeFilter] = useState([])
    // const {document,error} = useCollection(["posts"],"",filter);
    const [fetchData, setFetchData] = useState();
    const {result} = useParams();
    const [tag,setTag]=  useState([]);
    const [loading, setLoading] = useState(false);

    // update fetch data when document exist
    // useEffect(()=>{
    //     setFetchData(document);
    // },[document])
    useEffect(()=>{
        window.scrollTo(0,0);
    },[])

    // update tag when page navigation
    useEffect(() => {
        if (result) {
            setTag(result.split("&"));
        }
        else {
            setTag([]);
        }
    
    }, [result]);

    useEffect(()=>{
        if (tag.length !== 0) {
            // fetch data again with sort by filter
            const getDataFilter=async()=>{
                let ref = "";
                if (postTypeFilter.length !== 0) {
                    if (tag.length === 1) {
                        ref = query(collection(db, "posts"),where(...postTypeFilter), where("post_tag","array-contains-any",tag),orderBy(...filter));
                    } else {
                        ref = query(collection(db, "posts"),where(...postTypeFilter), where("post_tag","in",[tag]),orderBy(...filter));
                    }
                    
                    
                }
                else {
                    if (tag.length === 1) {
                        ref = query(collection(db, "posts"),where("post_tag","array-contains-any",tag),orderBy(...filter));
                    } else {
                        ref = query(collection(db, "posts"),where("post_tag","in",[tag]),orderBy(...filter));
                    }
                    
                    
                }
                let results= [];
                console.log("I keep running in get collections");
                const querySnapShot = await getDocs(ref);
        
                querySnapShot.forEach((doc)=>{
                    results.push({...doc.data(), id: doc.id});
                })
                //update state
                setFetchData(results);
            }
            setLoading(true);
            getDataFilter();
            setLoading(false);
        }
        
        
    },[filter, postTypeFilter, tag])


    return (
        <div className={styles.tagDashboard_container}>
            <TagFilter setTag={setTag} tag={tag} setFilter={setFilter} setPostTypeFilter={setPostTypeFilter}/>
            <div className={styles.TagDashboard_content}>
                 {!loading && fetchData && <TagResult tag={tag} document={fetchData}/>}
                 {loading && <div>Loading</div>}
            </div>
        </div>
    )
}
