import { useEffect, useState } from "react";
import { useDocument } from "../../hooks/useDocument";
import { Link } from "react-router-dom";
import { query, orderBy, startAt, collection, limit, getDocs, Timestamp, endAt } from "firebase/firestore";
import { db } from "../../firebase/config";
import PostList from "../../components/PostList";
import styles from "./Home.module.css";
import { useAuthContext } from "../../hooks/useAuthContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import Select from "react-select";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";

export default function Home() {
    const [categories, setCategories] = useState([]);
    const {document:document2, error} = useDocument("record","tag");
    const [popularPost, setPopularPost] = useState("");
    const {user} = useAuthContext();
    const navigate = useNavigate();
    const [filter, setFilter] = useState("");
    const postPopularSortOptions = [
        {value: "This Week", label:"This Week"},
        {value: "This Month", label:"This Month"},
        {value: "All the Time", label:"All the Time"},

    ]

    useEffect(()=>{
        const allTagArr = [];
        if(document2){
            delete document2.id;
            for(const [key,value]of Object.entries(document2)){
                allTagArr.push({tagName:key, value:value})
            }
            allTagArr.sort((a,b)=>{
                return b.value - a.value;
            })
            setCategories(allTagArr.slice(0,18));
        }
    },[document2])

    useEffect(async() => {
        const postRef = collection(db, "posts");
        let q = "";
        const curr = new Date;

        if (filter.value === "This Week") {
            q = query(postRef, orderBy("added_at"),startAt(startOfWeek(curr)), endAt(endOfWeek(curr)));
        }
        else if (filter.value === "This Month"){
            q = query(postRef, orderBy("added_at"),startAt(startOfMonth(curr)), endAt(endOfMonth(curr)));
        }
        else{
            q = query(postRef, orderBy("view","desc"), limit(5));
        }

        const querySnapShot = await getDocs(q);

        const tempArr = [];
        querySnapShot.forEach((doc) => {
            tempArr.push({id:doc.id, ...doc.data()});
        })
        if (filter.value === "This Week" || filter.value === "This Month") {
            tempArr.sort((a,b)=>{
                return b.view - a.view;
            })
            setPopularPost(tempArr);

        } else{
            setPopularPost(tempArr);

        }
    }, [filter])


    const handleAddPost=(e)=>{
        e.preventDefault();
        if (!user) {
            Swal.fire("Please login to add something","","warning");
        }
        else{
            navigate("/addpost");
        }
    }

    return (
    <div className={styles.container}>
        {/* header */}
        <div>
            <span><h1>Home : Dashboard</h1></span>
            <button className={styles.post_add_btn} onClick={handleAddPost}>Add Something</button>
        </div>
        {(!popularPost || !document2) && <div>Loading...</div>}

        {/* popular post */}
        {popularPost &&
        <div>
            <span>
                Popular posts...
            </span>
            <Select 
                onChange={(option)=>setFilter(option)}
                options={postPopularSortOptions}
                defaultValue={postPopularSortOptions[2]}

            />
            <div className={styles.post_list} >
                {popularPost&&<PostList posts={popularPost} dashboardMode={true} />}
            </div>
        </div>
        }

        {/* popular tag  */}
        {document2 && 
        <div className={styles.tag_container}>
            <span>
                <h2>Popular tags...</h2>
            </span>
            <div>
                {categories&&categories.map((item)=>(
                    <Link to={`/tag/${item.tagName}`} key={item.tagName}>
                        <p className={styles.tags_btn}>{item.tagName}</p>
                        <p>Results:{item.value} </p>
                    </Link>
                ))}
            </div>
        </div>}
    </div>)
}
