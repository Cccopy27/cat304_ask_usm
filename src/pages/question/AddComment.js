import { useState } from "react";
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
            // comment_image_name:imageName,
            // comment_image_url:imageURLs,
        }
        // await addDoc(collection_Ref, commentObj).then(()=>{
        //     console.log("added");
        // }).catch(err=>{
        //     console.log(err);
        // });

        await addDocument(commentObj);
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
                <button onClick={handleSubmit}>Add Comments</button>
            </div>
            
        </div>
    )
}
