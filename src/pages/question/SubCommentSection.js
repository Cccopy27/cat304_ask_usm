import "./SubCommentSection.css";
import { db } from "../../firebase/config";
import { getDocs,collection,onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

export default function SubCommentSection({question_id,comment_id}) {
    const col_ref = collection(db,"questions",question_id,"comment",comment_id,"subComment");
    const [subComments,setSubComments] = useState([]);

    useEffect(()=>{
        const unsub =  onSnapshot(col_ref,  (querySnapshot)=>{
            let result =[];
             querySnapshot.forEach((doc)=>{
                result.push({...doc.data(),id:doc.id});
            })
            setSubComments(result);
            
        })
        console.log(subComments);
        return()=>{unsub()};
    },[])
    return (
        <div>
           <h5>Replys</h5>
            {subComments.map(item => (
                <div key={item.id}>
                    <h5>{item.subComments}</h5>
                    <div>added {formatDistanceToNow(item.added_at.toDate(),{addSuffix:true})}</div>
                    <div>{item.created_by}</div>
                </div>

            ))}
        </div>
    )
}
