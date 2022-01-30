import { useState, useEffect, useRef } from "react";
import styles from "./EditComment.module.css";
import Swal from "sweetalert2";
import { useFirestore } from "../../hooks/useFirestore";
import { Timestamp } from "firebase/firestore";
import {ref, deleteObject } from "firebase/storage";
import {storage} from "../../firebase/config";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { useDocument } from "../../hooks/useDocument";
import { useAuthContext } from "../../hooks/useAuthContext";

export default function EditComment({document,editMode,setEditMode, post_id}) {
    const [newComment,setNewComment] = useState("");
    const [image, setimage] = useState([]);
    const [imageURL,setImageURL] = useState([]);
    const [imageName,setImageName] = useState([]);
    // const [loading,setLoading] = useState(false);
    const tempArray =[];
    const formInput = useRef();
    const {updateDocument,response} = useFirestore(["posts",post_id,"comment"]);
    const commentRef = useRef();
    const {document:document2, error} = useDocument("users",document.created_by);
    const [userName, setUserName] = useState(null);
    const {user} = useAuthContext();

    useEffect(() => {
        if (document2) {
            setUserName(document2.displayName);
        }
    }, [document2])
    // show current comment 
    useEffect(() => {
        const getallData=async()=>{
            if(document){
                setNewComment(document.comments);
                
                // get picture
                if( document.comment_image_url){
                    await document.comment_image_url.forEach(item=>{
                        tempArray.push(item);
                    })
                    setImageURL(tempArray);
                    setImageName(document.comment_image_name);
                }
            }
        }
        getallData();
        if(newComment && commentRef.current){
            commentRef.current.style.height="auto";
            commentRef.current.style.height=commentRef.current.scrollHeight+"px";
        }
        
    }, [document,editMode]);
    
    // preview image
    useEffect(()=>{
        const newImageURLs = [];
        const imageNameList = [];
        image.forEach(image=>{
            newImageURLs.push(URL.createObjectURL(image));
            imageNameList.push(image.name);
        });
        setImageName(imageNameList);
        setImageURL(newImageURLs);
    },[image]);

    // submit comment
    const handleSave=(e)=>{
        e.preventDefault();

        if(formInput.current.checkValidity()){
            Swal.fire({
                title: 'Do you want to save the changes?',
                showDenyButton: true,
                confirmButtonText: 'Yes',
              }).then(async(result) => {
                  // edit
                    if (result.isConfirmed) {
                        //loading
                        // setLoading(true);
                        Swal.fire({
                            title:"Now Loading...",
                            allowEscapeKey: false,
                            allowOutsideClick: false,
                        })
                        Swal.showLoading();
                    
                        // user input as object
                        const comment_object={
                            comments: newComment,
                            edited_at:Timestamp.now(),
                            comment_image_name:imageName,
                            comment_image_url:"",
                            // subComment:document.subComment,
                        }

                        // if user use back old image
                        if(image.length === 0){
                            comment_object.comment_image_url = document.comment_image_url;
                        }

                        // if user use new image
                        // delete all image from storage
                        if(image.length != 0){
                            document.comment_image_name.forEach(image_name=>{
                                // Create a reference to the file to delete
                                const desertRef = ref(storage, `comment/${document.id}/${image_name}`);
                                // Delete the file
                                deleteObject(desertRef).then(() => {
                                    // File deleted successfully
            
                                }).catch((error) => {
                                    console.log(error);
                                // Uh-oh, an error occurred!
                                });
                            })
                        }
                    
        
                        //update  database
                        await updateDocument(document.id,comment_object,image,"comment");
                        // setLoading(false);
            
                        if(!response.error){
                            // reset form
                            setNewComment("");
                            setimage([]);
                            setImageURL([]);
                            formInput.current.reset();
                            Swal.fire('Saved!', '', 'success');
                            setEditMode(false);
                        }
                        else{
                            console.log("something wrong");
                            Swal.fire({
                                icon:"error",
                                title:"Something wrong",
                                showConfirmButton: true,
                            })
                        }

                    }
                })
        }
        else{
            Swal.fire({
                title:"Make sure the comment is not empty!",
                showConfirmButton: true,
            })
        }
    }

    // edit mode = off
    const handleCancel =(e) =>{
        e.preventDefault();
        setEditMode(false);
    }

    // textarea grow
    useEffect(() => {
        if(newComment && commentRef.current){
            commentRef.current.style.height="auto";
            commentRef.current.style.height=commentRef.current.scrollHeight+"px";
        }
        
    }, [newComment])
        
      
    
     
    return (
        <div>
            {editMode && 
                <div>
                    <form ref={formInput}>
                        <label className={styles.comment_label}>
                            <textarea
                                required
                                ref={commentRef}
                                className={styles.input_style}
                                onChange={e=>{setNewComment(e.target.value)}}
                                value={newComment}
                                />
                        </label>
                            <div className={styles.image_preview_container}>
                                {imageURL && imageURL.map(imageSrc=>
                                <img className={styles.image_preview} key={imageSrc}src={imageSrc}/>)}
                            </div>
                            
                            <div className={styles.comment_bottom}>
                                <div className={styles.comment_left}>
                                    <p className={styles.comment_time}>Added {formatDistanceToNow(document.added_at.toDate(),{addSuffix:true})}</p>
                                    {document.edited_at && 
                                        <p className={styles.comment_edited}>Edited {formatDistanceToNow(document.edited_at.toDate(),{addSuffix:true})}</p>
                                    }
                                    
                                    <p className={styles.comment_author}>Added by {userName}</p>
                                </div>
                                
                                <div className={styles.btn}>
                                    <label className={styles.add_command_img}>
                                        <input
                                        className={styles.image_input}
                                        type="file"
                                        onChange={e => {setimage([...e.target.files])}}
                                        multiple accept="image/*"
                                        />
                                    </label>
                                    <button className={styles.saveBtn} onClick={handleSave}>Save</button>
                                    <button className={styles.cancelBtn} onClick={handleCancel}>Cancel</button>
                                </div>
                            </div>
                    </form>
                </div>
            }
        </div>
    )
}
