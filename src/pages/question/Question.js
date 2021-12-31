import styles from "./Question.module.css";
import { useState, useEffect } from "react";
import {useParams} from "react-router-dom";
import {useDocument} from "../../hooks/useDocument";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { useFirestore } from "../../hooks/useFirestore";
import { useNavigate } from "react-router";
import {ref, deleteObject } from "firebase/storage";
import {storage} from "../../firebase/config";
import Swal from "sweetalert2";
import EditQuestion from "./EditQuestion";
import AddComment from "../comment/AddComment";
import CommentSection from "../comment/CommentSection";

export default function Question() {
    // get id from param
    const {id} = useParams();
    const {error, document} = useDocument("questions",id);
    const {deleteDocument } = useFirestore(["questions"]);
    const navigate = useNavigate();
    // const [loading,setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        window.scrollTo(0,0);  
    }, [document]);

    // delete question
    const handleDelete=(e)=>{
        e.preventDefault();
        // alert user
        Swal.fire({
            title: 'Do you want to delete the question?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Delete',
            denyButtonText: `Don't delete`,
            
          }).then(async(result) => {
              // delete
            if (result.isConfirmed) {
                // loading
                // setLoading(true);
                Swal.fire({
                    title:"Now Loading...",
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                })
                Swal.showLoading();

                // delete storage image
                // loop each image
                
                document.question_image_name.forEach(image_name=>{
                    // Create a reference to the file to delete
                    const desertRef = ref(storage, `question/${document.id}/${image_name}`);
                    // Delete the file
                    deleteObject(desertRef).then(() => {
                        // File deleted successfully

                    }).catch((error) => {
                        console.log(error);
                    // Uh-oh, an error occurred!
                    });
                })
                deleteDocument(document.id)
              Swal.fire('Deleted!', '', 'success');
            //   setLoading(false);
              navigate("/question");
            } else if (result.isDenied) {
              Swal.fire('Question not deleted', '', 'info')
            }
          })
    };
    if(error){
        return <div>{error}</div>
    };
    if(!document){
        return <div>Loading...</div>
    };

    // set edit mode to false
    const handleEdit=()=>{
        setEditMode(true);
    }

    // add question
    const handleAddQuestion=(e)=>{
        e.preventDefault();
        navigate("/addquestion");

    }


    return (
        <div>
            <div className={styles.question_container}>
                {!editMode && 
            
                    <div className={styles.question_details}>
                    <div className={styles.question_header}>
                        <h2 className={styles.question_title}>{document.question_title}</h2>
                        <div className={styles.question_add}>
                            <button className={styles.question_add_btn} onClick={handleAddQuestion}>Ask Questions</button>
                        </div>
                    
                    </div>
                    <div className={styles.question_subTitle}>
                        <p className={styles.question_subTitle_time}>  
                            {formatDistanceToNow(document.added_at.toDate(),{addSuffix:true})}
                        </p>
                        
                        <p className={styles.question_subTitle_author}>
                            created by: {document.created_by}
                        </p>
                        <button onClick={handleDelete}>delete</button>
                        <button onClick={handleEdit}>edit</button>
                    </div>
                    <div >
                        <p className={styles.question_subTitle_tags}>
                            tags:{document.question_tag}
                        </p>
                    </div>
                    <p>{document.question_description}</p>
                    {document.question_image_url && document.question_image_url.map(imageSrc=>
                        <img className={styles.image_preview} key={imageSrc}src={imageSrc} alt="image-preview"/>)}
                    
                </div>
                }
                <EditQuestion document = {document}editMode={editMode} setEditMode={setEditMode}/>
                {!editMode && <AddComment question_id={document.id}/>}
                {!editMode && <CommentSection question_id={document.id}/>}
            </div>
                
        </div>
    )
}
