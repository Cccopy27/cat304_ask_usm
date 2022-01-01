import { useState, useEffect, useRef } from "react";
import styles from "./AddComment.module.css";
import { useFirestore } from "../../hooks/useFirestore";
import { Timestamp } from "firebase/firestore";
import Swal from "sweetalert2";


export default function AddComment({question_id}) {
    const [comments, setComments] = useState("");
    const [image, setimage] = useState([]);
    const [imageURLs,setImageURLs] = useState([]);
    const [imageName,setImageName] = useState([]);
    const [focusMode,setFocusMode] = useState(false);
    // const [loading,setLoading] = useState(false);
    const {addDocument, response} = useFirestore(["questions",question_id,"comment"]);
    const formInput = useRef();
    // submit comment
    const handleSubmit=async(e)=>{
        e.preventDefault();

        if(formInput.current.checkValidity()){
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
                setComments("");
                setimage([]);
                setImageURLs([]);
                setImageName([]);
                Swal.fire('Added!', '', 'success');
                setFocusMode(false);

            }
        }else{
            Swal.fire('Write Something!', '', 'info');  
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

    const handleComment=(e)=>{
        setComments(e.target.value);
        // textarea grow
        if(formInput.current && comments){
            formInput.current.style.height = "auto";
            formInput.current.style.height = formInput.current.scrollHeight + "px";
        }

        // show add comment and upload file option when user enter something in comment
        if(e.target.value.length === 0){
            setFocusMode(false);
        }
        else{
            setFocusMode(true);
        }
    }
    return (
        <div className={styles.comment_container}>
            <div className={styles.comment_input_area}>
                <label className={styles.add_comment}>
                    <textarea
                    ref={formInput}
                    required
                    className={styles.comment_textarea} 
                    onChange={handleComment}
                    value={comments}
                    placeholder="Add comment..."
                    />
                </label>
                {focusMode && <button className={styles.addBtn}onClick={handleSubmit}>Add Comments</button>}
                
            </div>
                {focusMode && 
                <>
                    <label className={styles.add_comment_img}>
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
                </>
                
                }
        </div>
    )
}
