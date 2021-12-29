import "./CommentSection.css";
import { db } from "../../firebase/config";
import { getDocs,collection,onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import SubCommentSection from "./SubCommentSection";
import AddSubComment from "./AddSubComment";

export default function CommentSection({question_id}) {
    const col_ref = collection(db,"questions",question_id,"comment");
    const [comments,setComments] = useState([]);
    useEffect(()=>{
        const unsub =  onSnapshot(col_ref,  (querySnapshot)=>{
            let result =[];
             querySnapshot.forEach((doc)=>{
                result.push({...doc.data(),id:doc.id});
            })
            setComments(result);
            
        })
        console.log(comments);
        return()=>{unsub()};
    },[])

    return (
        <div>
            <h3>Comments</h3>
            {comments.map(item => (
                <div key={item.id}>
                    <h4>{item.comments}</h4>
                    <div>added {formatDistanceToNow(item.added_at.toDate(),{addSuffix:true})}</div>
                    <div>{item.created_by}</div>
                    <AddSubComment question_id={question_id} comment_id={item.id}/>
                    <SubCommentSection question_id={question_id} comment_id={item.id}/>
                </div>

            ))}
        </div>
    )
}
