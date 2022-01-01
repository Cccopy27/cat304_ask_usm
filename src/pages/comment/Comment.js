import styles from "./Comment.module.css";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { useState } from "react";
import EditComment from "./EditComment";
import Swal from "sweetalert2";
import {ref, deleteObject } from "firebase/storage";
import {storage} from "../../firebase/config";
import { useFirestore } from "../../hooks/useFirestore";

export default function Comment({comment, question_id}) {
    const [editMode,setEditMode] = useState(false);
    const[loading,setLoading] = useState(false);
    const {deleteDocument} = useFirestore(["questions",question_id,"comment"]);

    // edit mode on
    const handleEdit= (e)=>{
        e.preventDefault();
        setEditMode(true);
    };

    // delete comment
    const handleDelete= (e)=>{
        e.preventDefault();
        // alert user
        Swal.fire({
            title: 'Do you want to delete this comment?',
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

                // delete storage image
                // loop each image
                comment.comment_image_name.forEach(image_name=>{
                    // Create a reference to the file to delete
                    const desertRef = ref(storage, `comment/${comment.id}/${image_name}`);
                    // Delete the file
                    deleteObject(desertRef).then(() => {
                        // File deleted successfully

                    }).catch((error) => {
                        console.log(error);
                    // Uh-oh, an error occurred!
                    });
                })

                // delete document comment
                await deleteDocument(comment.id);
              Swal.fire('Deleted!', '', 'success');
              setLoading(false);
            } 
            else if (result.isDenied) {
              Swal.fire('Comment not deleted', '', 'info')
            }
          })
    };
    return (
        <div className={styles.comment_big_container}>
            {!editMode && 
                <div className={styles.comment_container}> 
                    <p className={styles.comments}>{comment.comments}</p>
                    <div className={styles.image_container}></div>
                    {comment.comment_image_url && comment.comment_image_url.map(imageSrc=>
                        <img className={styles.image_preview} key={imageSrc}src={imageSrc} alt="image_preview"/>)}
                    <div className={styles.comment_bottom}>
                        <div className={styles.comment_left}>
                            <p className={styles.comment_time}>added {formatDistanceToNow(comment.added_at.toDate(),{addSuffix:true})}</p>
                            {comment.edited_at && 
                                <p className={styles.comment_edit}>edited       {formatDistanceToNow(comment.edited_at.toDate(),{addSuffix:true})}
                                </p>
                            }
                            
                            <p className={styles.comment_author}>added by {comment.created_by}</p>
                        </div>
                        
                        <div className={styles.btn}>
                            {!loading && <button className={styles.btnEdit}onClick={handleEdit}>Edit</button>}
                            {!loading && <button className={styles.btnDelete}onClick={handleDelete}>Delete</button>}
                            {loading && <button className={styles.btnEdit} disabled onClick={handleEdit}>Edit</button>}
                            {loading && <button className={styles.btnDelete}disabled onClick={handleDelete}>Delete</button>}
                        </div>
                        
                    </div>
                    
                </div>
            }
            {comment && <EditComment document={comment} editMode={editMode} setEditMode={setEditMode} question_id={question_id}/>}
        </div>
    )
}
