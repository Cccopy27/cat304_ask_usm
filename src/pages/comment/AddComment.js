import { useState, useEffect } from "react";
import styles from "./AddComment.module.css";
import { useFirestore } from "../../hooks/useFirestore";
import { Timestamp } from "firebase/firestore";
import Swal from "sweetalert2";


export default function AddComment({question_id}) {
    const [comments, setComments] = useState("");
    const [image, setimage] = useState([]);
    const [imageURLs,setImageURLs] = useState([]);
    const [imageName,setImageName] = useState([]);
    // const [loading,setLoading] = useState(false);
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
        else{
            Swal.fire('Added!', '', 'success');
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
        <div className={styles.comment_container}>
            <div className={styles.comment_input_area}>
                <label className={styles.add_comment}>
                    <span className={styles.span_title}>Add your comment:</span>
                    <textarea 
                    
                    onChange={e => {setComments(e.target.value)}}
                    value={comments}
                    />
                </label>
                <label className={styles.add_comment_img}>
                    <span className={styles.span_title}>Image:</span>
                    <input
                    className={styles.input_style}
                    type="file"
                    onChange={e => {setimage([...e.target.files])}}
                    multiple accept="image/*"
                    />
                </label>

                <div className={styles.image_preview_container}>
                    {imageURLs.map(imageSrc=>
                    <img className={styles.image_preview} key={imageSrc}src={imageSrc} alt="image_preview"/>)}
                </div>

                <button onClick={handleSubmit}>Add Comments</button>
            </div>
            
        </div>
    )
}
