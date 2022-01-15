import styles from "./SubComment.module.css";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { useEffect, useState } from "react";
import EditSubComment from "./EditSubComment";
import { useFirestore } from "../../hooks/useFirestore";
import Swal from "sweetalert2";
import {AiOutlineUser} from "react-icons/ai";
import { useDocument } from "../../hooks/useDocument";

export default function SubComment({subComment,item, question_id, comment_id}) {
    const [editMode, setEditMode] = useState(false);
    const {updateDocument, response} = useFirestore(["questions",question_id,"comment"]);
    const [loading,setLoading] = useState(false);
    const {document, error} = useDocument("users",item.created_by);
    const [userName, setUserName] = useState(null);

    // edit mode = on
    const handleEdit=(e)=>{
        e.preventDefault();
        setEditMode(true);
    }

    useEffect(() => {
        if (document) {
            setUserName(document.displayName);
        }
    }, [document])

    // delete
    const handleDelete=(e)=>{
        e.preventDefault();
        // alert user
        Swal.fire({
            title: 'Do you want to delete this reply?',
            showDenyButton: true,
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
            else if (result.isDenied) {
                Swal.fire('Reply not deleted', '', 'info')
            }
        })
    }
    return (
        <div>
            {!editMode && 
                <div className={styles.subComment_container}>
                    <div className={styles.subComment}>
                        <span className={styles.content}>{item.content}</span>
                        <AiOutlineUser className={styles.created_by_icon}/>
                        <span className={styles.created_by}> {userName}</span>
                        {item.edited_at && 
                            <span className={styles.added_at}> Edited {formatDistanceToNow(item.edited_at.toDate(),{addSuffix:true})}</span>
                        }
                        {!item.edited_at && 
                            <span className={styles.added_at}> Added {formatDistanceToNow(item.added_at.toDate(),{addSuffix:true})}</span>
                        }
                        
                        
                    </div>
                    <div className={styles.btn_group}>
                        <button className={styles.edit_btn} onClick={handleEdit}>Edit</button>
                        <button className={styles.delete_btn} onClick={handleDelete}>Delete</button>
                    </div>
                        
                </div> 
            }
            {editMode && <EditSubComment item={item} editMode={editMode} setEditMode={setEditMode} question_id={question_id} comment_id={comment_id} subComment={subComment}/>}
        </div>
    )
}
