import "./Comment.css";
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
              Swal.fire('Question not deleted', '', 'info')
            }
          })
    };
    return (
        <div>
            {!editMode && 
                <div> 
                    <h4>{comment.comments}</h4>
                    {comment.comment_image_url && comment.comment_image_url.map(imageSrc=>
                        <img className="image-preview" key={imageSrc}src={imageSrc}/>)}
                    <div>added {formatDistanceToNow(comment.added_at.toDate(),{addSuffix:true})}</div>
                    <div>{comment.created_by}</div>
                    {!loading && <button onClick={handleEdit}>edit</button>}
                    {!loading && <button onClick={handleDelete}>delete</button>}
                    {loading && <button disabled onClick={handleEdit}>edit</button>}
                    {loading && <button disabled onClick={handleDelete}>delete</button>}
                </div>
            }
            {comment && <EditComment document={comment} editMode={editMode} setEditMode={setEditMode} question_id={question_id}/>}
        </div>
    )
}
