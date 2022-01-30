import styles from "./Comment.module.css";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { useState, useEffect } from "react";
import EditComment from "./EditComment";
import Swal from "sweetalert2";
import {ref, deleteObject } from "firebase/storage";
import {storage} from "../../firebase/config";
import { useFirestore } from "../../hooks/useFirestore";
import {AiOutlineUser} from "react-icons/ai";
import { useDocument } from "../../hooks/useDocument";
import { useAuthContext } from "../../hooks/useAuthContext";
import {BsCaretUp, BsCaretUpFill, BsCaretDown, BsCaretDownFill} from "react-icons/bs";
import { increment, arrayUnion, arrayRemove } from "firebase/firestore";

export default function Comment({comment, post_id}) {
    const [editMode,setEditMode] = useState(false);
    const[loading,setLoading] = useState(false);
    const {deleteDocument} = useFirestore(["posts",post_id,"comment"]);
    const {updateDocument,response} = useFirestore(["posts",post_id,"comment"]);
    const {document, error} = useDocument("users",comment.created_by);
    const [userName, setUserName] = useState(null);
    const {user} = useAuthContext();

    useEffect(() => {
        if (document) {
            setUserName(document.displayName);
        }
    }, [document])
    // edit mode on
    const handleEdit = (e) => {
        e.preventDefault();
        setEditMode(true);
    };

    // delete comment
    const handleDelete = (e) => {
        e.preventDefault();
        // alert user
        Swal.fire ({
            title: 'Do you want to delete this comment?',
            showDenyButton: true,
            confirmButtonText: 'Delete',
            denyButtonText: `Don't delete`,
            
          }).then (async(result) => {
              // delete
            if (result.isConfirmed) {
                // loading
                setLoading(true);
                Swal.fire ({
                    title:"Now Loading...",
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                })
                Swal.showLoading();

                // delete storage image
                // loop each image
                comment.comment_image_name.forEach (image_name => {
                    // Create a reference to the file to delete
                    const desertRef = ref(storage, `comment/${comment.id}/${image_name}`);
                    // Delete the file
                    deleteObject(desertRef).then( () => {
                        // File deleted successfully

                    }).catch( (error) => {
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

    const handleUpVote = async(e) => {
        e.preventDefault();

        if (!comment.upVoteList.includes(user.uid)) {
            let comment_object = "";
            if (comment.downVoteList.includes(user.uid)) {
                comment_object={
                    upVote:increment(1),
                    downVote:increment(-1),
                    upVoteList:arrayUnion(user.uid),
                    downVoteList:arrayRemove(user.uid)
                }
            }
            else {
                comment_object={
                    upVote:increment(1),
                    upVoteList:arrayUnion(user.uid)
                }
            }
            
            //update  database
            await updateDocument(comment.id,comment_object);
    
            if (response.error){
                Swal.fire("Something wrong","","error");
            }

        } else{
            const comment_object = {
                upVote:increment(-1),
                upVoteList:arrayRemove(user.uid),
            }

            //update  database
            await updateDocument(comment.id,comment_object);
    
            if (response.error){
                Swal.fire("Something wrong","","error");
            }
        }
        

    }

    const handleDownVote = async(e) => {
        e.preventDefault();
        
        if (!comment.downVoteList.includes(user.uid)) {
            let comment_object = "";
            if (comment.upVoteList.includes(user.uid)) {
                comment_object={
                    upVote:increment(-1),
                    downVote:increment(1),
                    upVoteList:arrayRemove(user.uid),
                    downVoteList:arrayUnion(user.uid)
                }
            }
            else {
                comment_object={
                    downVote:increment(1),
                    downVoteList:arrayUnion(user.uid)
                }
            }

            //update  database
            await updateDocument(comment.id,comment_object);

            if (response.error){
                Swal.fire("Something wrong","","error");
            }
        }
        else {
            const comment_object = {
                downVote:increment(-1),
                downVoteList:arrayRemove(user.uid),
            }

            //update  database
            await updateDocument(comment.id,comment_object);
    
            if (response.error){
                Swal.fire("Something wrong","","error");
            }
        }

        
    }
    return (
        <div className={styles.comment_big_container}>
            {!editMode && 
            <div className={styles.comment_container_big}>
                <div className={styles.vote_container}>
                    
                    <span className={styles.upVoteSpan}>{comment.upVote}</span>
                    {comment.upVoteList.includes(user.uid) && 
                        <BsCaretUpFill className={styles.upVote} onClick={(e)=>{handleUpVote(e)}}/>
                    }
                    {!comment.upVoteList.includes(user.uid) && 
                        <BsCaretUp className={styles.upVote} onClick={(e)=>{handleUpVote(e)}}/>
                    }
                    {comment.downVoteList.includes(user.uid) && 
                        <BsCaretDownFill className={styles.downVote} onClick={(e)=>{handleDownVote(e)}}/>
                    }
                    {!comment.downVoteList.includes(user.uid) && 
                        <BsCaretDown className={styles.downVote} onClick={(e)=>{handleDownVote(e)}}/>
                    }

                    <span className={styles.downVoteSpan}>{comment.downVote}</span>
                </div>
                <div className={styles.comment_container}> 
                    <p className={styles.comments}>{comment.comments}</p>
                    <div className={styles.image_container}></div>
                    {comment.comment_image_url && comment.comment_image_url.map(imageSrc =>
                        <img className={styles.image_preview} key={imageSrc}src={imageSrc} alt="image_preview"/>)}
                    <div className={styles.comment_bottom}>
                        <div className={styles.comment_left}>
                            <p className={styles.comment_time}>Added {formatDistanceToNow(comment.added_at.toDate(),{addSuffix:true})}</p>
                            {comment.edited_at && 
                                <p className={styles.comment_edit}>Edited       {formatDistanceToNow(comment.edited_at.toDate(),{addSuffix:true})}
                                </p>
                            }
                                <AiOutlineUser className={styles.comment_author_icon}/> 
                                <p className={styles.comment_author}>
                                    {userName}
                                </p>
                            
                        </div>
                        
                        {user && ((user.uid === comment.created_by) || (user.uid === "ZuYyHrRcx3bVYqhCIp4ZB6U1gve2")) &&
                        <div className={styles.btn}>
                            {!loading && <button className={styles.btnEdit}onClick={handleEdit}>Edit</button>}
                            {!loading && <button className={styles.btnDelete}onClick={handleDelete}>Delete</button>}
                            {loading && <button className={styles.btnEdit} disabled onClick={handleEdit}>Edit</button>}
                            {loading && <button className={styles.btnDelete}disabled onClick={handleDelete}>Delete</button>}
                        </div>
                        }                  
                    </div>  
                </div>
            </div>
                
            }
            {comment && <EditComment document={comment} editMode={editMode} setEditMode={setEditMode} post_id={post_id}/>}
        </div>
    )
}
