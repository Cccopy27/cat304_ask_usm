import styles from "./UserDashboard.module.css"
import UserHeader from "./UserHeader"
import PostList from "../../components/PostList"
import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import { collection ,onSnapshot, query, where,orderBy,getDocs,doc,getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import Swal from "sweetalert2";

export default function UserDashboard() {
    const [filter, setFilter] = useState(["added_at","desc"]);
    const {result} = useParams();
    const [userNameId, setUserNameId] = useState("");
    const [fetchData, setFetchData] = useState();
    const [loading, setLoading] = useState(false);
    useEffect(async() => {
        if (result) {
            setLoading(true);
            const q = query(collection(db, "users"), where("displayName","==",result));
            const querySnapShot = await getDocs(q);
            if(querySnapShot.docs[0]){
                setUserNameId(querySnapShot.docs[0].id);
            }
            else{
                setUserNameId("");
                setFetchData("");
            }
            setLoading(false);
            // else{
            //     Swal.fire("User Not Found","","error");
            //     set
            // }
        }
        
    },[result])

    useEffect(()=>{

        // fetchRef.current;
        // console.log(filter);

        // fetch data again with sort by filter
        const getDataFilter=async()=>{
            const ref = query(collection(db, "posts"), orderBy(...filter), where("created_by","==",userNameId));
            let results= [];
            const querySnapShot = await getDocs(ref);
    
            querySnapShot.forEach((doc)=>{
                results.push({...doc.data(), id: doc.id});
            })
            //update state
            setFetchData(results);
        }
        if(userNameId){
            setLoading(true);
            getDataFilter();
            setLoading(false);
        }
        
    },[filter, userNameId])

    useEffect(()=>{
        window.scrollTo(0,0);
    },[])
    
    return (
        <div className={styles.userdashboard_container}>
            <UserHeader setFilter={setFilter}/>
            <div className={styles.userdashboard}>
                {loading && <div>Loading</div>}
                {!loading && result && <span>Result for {result}</span>}
                 {!loading && userNameId && fetchData && <PostList posts={fetchData}/>}
                 {!loading && !userNameId && <div>No User Found</div>}
            </div>
        </div>
    )
}
