import { useState, useEffect, useRef } from "react";
import "./EditComment.css";
import Swal from "sweetalert2";
import { useFirestore } from "../../hooks/useFirestore";
import { Timestamp } from "firebase/firestore";
import {ref, deleteObject } from "firebase/storage";
import {storage} from "../../firebase/config";


export default function EditComment({document,editMode,setEditMode, question_id}) {
    const [newComment,setNewComment] = useState("");
    const [image, setimage] = useState([]);
    const [imageURL,setImageURL] = useState([]);
    const [imageName,setImageName] = useState([]);
    const [loading,setLoading] = useState(false);
    const [error, setError] = useState(false);
    const tempArray =[];
    const formInput = useRef();
    const {updateDocument,response} = useFirestore(["questions",question_id,"comment"]);


    // show current comment 
    useEffect(async() => {
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
                // showCancelButton: true,
                confirmButtonText: 'Yes',
                // denyButtonText: `Don't save`,
              }).then(async(result) => {
                if (result.isConfirmed) {
                    setLoading(true);
                    Swal.fire({
                        title:"Now Loading...",
                        allowEscapeKey: false,
                        allowOutsideClick: false,
                    })
                    Swal.showLoading();
                
                // user input as object
                const comment_object={
                    comments: newComment,
                    created_by:"",
                    added_at:Timestamp.now(),
                    comment_image_name:imageName,
                    comment_image_url:"",
                    subComment:document.subComment,
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
                setLoading(false);
    
                if(!response.error){
                    setNewComment("");
                    setimage([]);
                    setImageURL([]);
                    formInput.current.reset();
                    Swal.fire('Saved!', '', 'success');
                    // navigate(`/question/${question.id}`);
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

    const handleCancel =(e) =>{
        e.preventDefault();
    }
     
    return (
        <div>
            {editMode && 
                <div>
                    <form ref={formInput}>
                        <label>
                        <input
                            required
                            type="text"
                            className="input-style"
                            onChange={e => {setNewComment(e.target.value)}}
                            value={newComment}
                            />
                        </label>

                        <div className="image-preview-container">
                            {imageURL && imageURL.map(imageSrc=>
                            <img className="image-preview" key={imageSrc}src={imageSrc}/>)}
                        </div>
                        <label className="add-command-img">
                            <span className="span-title">Image:</span>
                            <input
                            className="input-style"
                            type="file"
                            onChange={e => {setimage([...e.target.files])}}
                            multiple accept="image/*"
                            />
                        </label>

                        <button onClick={handleSave}>Save</button>
                        <button onClick={handleCancel}>Cancel</button>
                    </form>
                </div>
            
            }
        </div>
    )
}