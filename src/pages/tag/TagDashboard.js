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
    // const {document,error} = useCollection(["questions"],"",filter);
    const [fetchData, setFetchData] = useState();
    const {result} = useParams();
    const [tag,setTag]=  useState([]);
    const [loading, setLoading] = useState(false);

    // update fetch data when document exist
    // useEffect(()=>{
    //     setFetchData(document);
    // },[document])


    // update tag when page navigation
    useEffect(() => {

        setTag(result.split("&"));
    }, [result]);

    useEffect(()=>{
        // fetch data again with sort by filter
        const getDataFilter=async()=>{
            const ref = query(collection(db, "questions"), orderBy(...filter));
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
        
    },[filter])


    return (
        <div className={styles.tagDashboard_container}>
            <TagFilter setTag={setTag} tag={tag} setFilter={setFilter}/>
            <div className={styles.TagDashboard_content}>
                 {!loading && fetchData && <TagResult tag={tag} document={fetchData}/>}
                 {loading && <div>Loading</div>}
            </div>
        </div>
    )
}
