import { useState, useEffect } from "react";
import "./AddComment.css";
import { useFirestore } from "../../hooks/useFirestore";
import { Timestamp } from "firebase/firestore";
import Swal from "sweetalert2";


export default function AddComment({question_id}) {
    const [comments, setComments] = useState("");
    const [reply, setReply] = useState(null);
    const [image, setimage] = useState([]);
    const [imageURLs,setImageURLs] = useState([]);
    const [imageName,setImageName] = useState([]);
    const [loading,setLoading] = useState(false);
    const {addDocument, response} = useFirestore(["questions",question_id,"comment"]);
    // submit comment
    const handleSubmit=async(e)=>{
        e.preventDefault();

        const commentObj = {
            comments,
            created_by:"",
            added_at:Timestamp.now(),
            comment_image_name:imageName,
            comment_image_url:"",
            subComment:"",
        }

        await addDocument(commentObj,image,"comment");
        // got error
        if(response.error){
            console.log("something wrong");
            Swal.fire({
                icon:"error",
                title:"Something wrong",
                showConfirmButton: true,
            })
        }
    }

    // preview image
    useEffect(()=>{
        const newImageURLs = [];
        const imageNameList = [];
        image.forEach(image=>{
            newImageURLs.push(URL.createObjectURL(image));
            imageNameList.push(image.name);
        });
        setImageName(imageNameList);
        setImageURLs(newImageURLs);
    },[image]);

    
    return (
        <div className="comment-container">
            <div className="comment-input-area">
                <label className="add-comment">
                    <span className="span-title">Add your comment:</span>
                    <textarea 
                    
                    onChange={e => {setComments(e.target.value)}}
                    value={comments}
                    />
                </label>
                <label className="add-comment-img">
                    <span className="span-title">Image:</span>
                    <input
                    className="input-style"
                    type="file"
                    onChange={e => {setimage([...e.target.files])}}
                    multiple accept="image/*"
                    />
                </label>

                <div className="image-preview-container">
                    {imageURLs.map(imageSrc=>
                    <img className="image-preview" key={imageSrc}src={imageSrc}/>)}
                </div>

                <button onClick={handleSubmit}>Add Comments</button>
            </div>
            
        </div>
    )
}
