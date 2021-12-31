import "./SubComment.css";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { useState } from "react";
import EditSubComment from "./EditSubComment";
import { useFirestore } from "../../hooks/useFirestore";
import Swal from "sweetalert2";

export default function SubComment({subComment,item, question_id, comment_id}) {
    const [editMode, setEditMode] = useState(false);
    const {updateDocument, response} = useFirestore(["questions",question_id,"comment"]);
    const [loading,setLoading] = useState(false);

    // edit mode = on
    const handleEdit=(e)=>{
        e.preventDefault();
        setEditMode(true);
    }

    // delete
    const handleDelete=(e)=>{
        e.preventDefault();
        // alert user
        Swal.fire({
            title: 'Do you want to delete this reply?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Delete',
            denyButtonText: `Don't delete`,
            
          }).then(async(result) => {
              // delete
            if (result.isConfirmed) {
                // loading
                setLoading(true);
                Swal.fire({
                    title:"Now Loading...",
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                })
                Swal.showLoading();

                // filter out the current subComment 
                const newSubCommentObj = subComment.filter(currComment=>{
                    return currComment.id !== item.id;
                })

                const newCommentChanges={
                    subComment:newSubCommentObj,
                }

                // update latest changes to the comment document
                await updateDocument(comment_id,newCommentChanges);

                if(!response.error){
                    Swal.fire('Deleted!', '', 'success');
                }
                else{
                    console.log("something wrong");
                    Swal.fire({
                        icon:"error",
                        title:"Something wrong",
                        showConfirmButton: true,
                    })
                }
                setLoading(false);
            }
        })
    }
    return (
        <div>
            {!editMode && 
                <div>
                    <div key={item.id}>
                        <h5>{item.content}</h5>
                        <div>added {formatDistanceToNow(item.added_at.toDate(),{addSuffix:true})}</div>
                        <div>{item.created_by}</div>
                    </div>
                    <button onClick={handleEdit}>edit</button>
                    <button onClick={handleDelete}>delete</button>
                </div> 
            }
            {editMode && <EditSubComment item={item} editMode={editMode} setEditMode={setEditMode} question_id={question_id} comment_id={comment_id} subComment={subComment}/>}
        </div>
    )
}
