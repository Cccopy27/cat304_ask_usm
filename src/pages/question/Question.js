import styles from "./Question.module.css";
import { useState, useEffect } from "react";
import {useParams} from "react-router-dom";
import {useDocument} from "../../hooks/useDocument";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { useFirestore } from "../../hooks/useFirestore";
import { useNavigate } from "react-router";
import {ref, deleteObject } from "firebase/storage";
import {storage,db} from "../../firebase/config";
import Swal from "sweetalert2";
import EditQuestion from "./EditQuestion";
import AddComment from "../comment/AddComment";
import CommentSection from "../comment/CommentSection";
import { writeBatch,doc,collection, getDocs } from "firebase/firestore";
import {AiOutlineTag,AiOutlineUser,AiOutlineEye} from "react-icons/ai";
import { increment } from "firebase/firestore";

export default function Question() {
    // get id from param
    const {id} = useParams();
    const [change,setChange] = useState(0);
    const {error, document} = useDocument("questions",id,setChange);
    const {deleteDocument } = useFirestore(["questions"]);
    const navigate = useNavigate();
    // const [loading,setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const {updateDocument,response} = useFirestore(["questions"]);
    const {updateDocument:updateDocument2} = useFirestore(["record"]);


    useEffect(() => {
        // only update view 1
        if(document && change === 1 && !localStorage.getItem(document.id)){
            // console.log(change,"document");
            updateDocument(document.id,{view:increment(1)});
            if(response.error){
                console.log(response.error);
            }

            // update local storage to prevent user reload page to increase view
            // only after 30s it will increase view again
            localStorage.setItem(document.id,true);
            const clearStorage = () =>{
                localStorage.removeItem(document.id);
            }
            setTimeout(clearStorage, 30000);

        } 
    }, [document,change]);

    useEffect(()=>{
        window.scrollTo(0,0); 
    },[])

    // delete question
    const handleDelete=(e)=>{
        e.preventDefault();
        // alert user
        Swal.fire({
            title: 'Do you want to delete the question?',
            showDenyButton: true,
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
                const tempKey = document.id;
                await deleteDocument(document.id);
                const updateObj = {}

                document.question_tag.forEach(tag=>{
                    updateObj[tag] = increment(-1);
                })
                await updateDocument2("tag",updateObj);
                // delete subCollection
                const commentList = await getDocs(collection(db,"questions",tempKey,"comment"));
                // batch declare
                const batch = writeBatch(db);
                // delete all comment in batch
                commentList.forEach(doc=>{

                    // delete storage image
                    // check got image to delete or not
                    if(doc.data().comment_image_name){
                        doc.data().comment_image_name.forEach(image_name=>{
                            // Create a reference to the file to delete
                            const desertRef = ref(storage, `comment/${doc.id}/${image_name}`);

                            // Delete the file
                            deleteObject(desertRef).then(() => {
                                // File deleted successfully

                            }).catch((error) => {
                                console.log(error);
                                // Uh-oh, an error occurred!
                            });
                        })
                        
                    }
                    batch.delete(doc.ref);
                })
                // Commit the batch
                await batch.commit();

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
                        <div className={styles.question_top}>
                            <div className={styles.question_header}>
                                <p className={styles.question_title}>{document.question_title}</p>
                                <div className={styles.question_add}>
                                    <button className={styles.question_add_btn} onClick={handleAddQuestion}>Add Something</button>
                                </div>
                        
                            </div>
                            <div className={styles.question_subTitle}>
                                <div className={styles.question_subTitle_left}>
                                    <p className={styles.question_view}>
                                        <AiOutlineEye className={styles.eye}/>
                                        {document.view}
                                        
                                    </p>
                                    <p className={styles.question_subTitle_time}>  
                                        Added {formatDistanceToNow(document.added_at.toDate(),{addSuffix:true})}
                                    </p>

                                    {document.edited_at && 
                                        <p className={styles.question_subTitle_edit}>  
                                            Edited {formatDistanceToNow(document.edited_at.toDate(),{addSuffix:true})}
                                        </p>
                                    }
                                    
                                    <p className={styles.question_subTitle_author}>
                                        <AiOutlineUser className={styles.peopleIcon}/>
                                        {document.created_by}
                                    </p>
                                </div>
                                <div className={styles.question_subTitle_right}>
                                    <button className={styles.editBtn}onClick={handleEdit}>Edit</button>
                                    <button className={styles.deleteBtn}
                                    onClick={handleDelete}>Delete</button>
                                    
                                </div>
                            </div>
                        </div>
                    
                    <div className={styles.question_bottom}>
                        <div className={styles.question_tag_big_container}>
                        <p className={styles.question_subTitle_tags}>
                            <AiOutlineTag className={styles.tagicon}/>
                        </p>
                            <div className={styles.question_tag_container}>
                            {document.question_tag.map(tag=>(
                            <span className={styles.tag} key={tag}>{tag}</span>
                        ))}
                            </div>
                        </div>
                        
                        
                        <p className={styles.question_des}>{document.question_description}</p>
                        {document.question_image_url && document.question_image_url.map(imageSrc=>
                            <img className={styles.image_preview} key={imageSrc}src={imageSrc} alt="image-preview"/>)}
                    </div>
                    
                    
                </div>
                }
                <EditQuestion document = {document}editMode={editMode} setEditMode={setEditMode}/>
                {!editMode && <AddComment question_id={document.id}/>}
                {!editMode && <CommentSection question_id={document.id}/>}
            </div>
                
        </div>
    )
}
