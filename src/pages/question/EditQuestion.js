import styles from "./EditQuestion.module.css";
import { useEffect, useState,useRef } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import {Timestamp} from "firebase/firestore";
import {useFirestore} from "../../hooks/useFirestore";
import {ref, deleteObject } from "firebase/storage";
import {storage} from "../../firebase/config";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import Select from "react-select";

export default function EditQuestion({document,editMode,setEditMode}) {
    
    const {updateDocument,response} = useFirestore(["questions"]);
    const [loading,setLoading] = useState(false);
    const [title, settitle] = useState("");
    const [des, setdes] = useState(""); 
    const [tag, settag] = useState([]);
    const [image, setimage] = useState([]);
    const [imageURL,setImageURL] = useState([]);
    const [imageName,setImageName] = useState([]);
    // const [error, setError] = useState(false);
    const tempArray =[];
    const formInput = useRef();
    const textAreaDes = useRef();
    const textAreaTitle = useRef();
    const navigate = useNavigate();

    // categories
    const categories = [
        {value: "MyCsd", label: "MyCsd"},
        {value: "Other", label: "Other"},
        {value: "Hostel", label: "Hostel"},
        {value: "CAT304", label: "CAT304"},
        {value: "Club", label: "Club"},
    ];
    
    // set all document value to current input field
    useEffect(() => {
        window.scrollTo(0,0);

        const getData=async()=>{
            if(document){
                settitle(document.question_title);
                setdes(document.question_description); 
                // get picture
                if( document.question_image_url){
                    await document.question_image_url.forEach(item=>{
                        tempArray.push(item);
                    })
                    setImageURL(tempArray);
                    setImageName(document.question_image_name);
                }
            }
        }
        getData();
        if(title && textAreaTitle.current){
            textAreaTitle.current.style.height="auto";
            textAreaTitle.current.style.height=textAreaTitle.current.scrollHeight + "px";
        }
        if(des && textAreaDes.current){
            textAreaDes.current.style.height="auto";
            textAreaDes.current.style.height=textAreaDes.current.scrollHeight + "px";
        }
        
    }, [document,editMode]);
    
    // textarea grow
    useEffect(()=>{
        if(title && textAreaTitle.current){
            textAreaTitle.current.style.height="auto";
            textAreaTitle.current.style.height=textAreaTitle.current.scrollHeight + "px";
        }
    },[title]);

    // textarea grow

    useEffect(()=>{
        if(des && textAreaDes.current){
            textAreaDes.current.style.height="auto";
            textAreaDes.current.style.height=textAreaDes.current.scrollHeight + "px";
        }
    },[des]);

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

    // save changes
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
                const question_object={
                    question_title: title,
                    question_description: des,
                    question_tag: tag,
                    question_image_name:imageName,
                    question_image_url:"",
                    edited_at: Timestamp.now(),
                    created_by:""
                }
                // if user use back old image
                if(image.length === 0){
                    question_object.question_image_url = document.question_image_url;
                }

                // if user upload new image
                // delete all image from storage
                if(image.length !== 0){
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
                }
                
    
                //update  database
                await updateDocument(document.id,question_object,image,"question");
                setLoading(false);
    
                if(!response.error){
                    settag([]);
                    settitle("");
                    setdes("");
                    setimage([]);
                    setImageURL([]);
                    formInput.current.reset();
                    Swal.fire('Saved!', '', 'success');
                    navigate(`/question/${document.id}`);
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
                title:"Make sure the form is completed!",
                showConfirmButton: true,
            })
        }
    }

    const handleCancel = (e) =>{ 
        e.preventDefault();
        Swal.fire({
            title:"Are you sure want to discard your changes?",
            showConfirmButton: true,
            showDenyButton: true,
            confirmButtonText: "Yes",
            
        }).then((result)=>{
            // discard changes
            if(result.isConfirmed){
                settag([]);
                settitle("");
                setdes("");
                setimage([]);
                setImageURL([]);
                formInput.current.reset();
                navigate(`/question/${document.id}`);
                setEditMode(false);
            }
        })
    }

    return (
        <div>
            <div className={styles.question_container}>
                {editMode && 
                    <div className={styles.question_details}>
                        <form className={styles.add_question_form}  ref={formInput}>
                            <div className={styles.question_top}>
                                <div className={styles.question_header}>
                                    <label className={styles.add_question_title}>
                                        <textarea
                                        className={styles.question_title}
                                        ref={textAreaTitle}
                                        // type="text"
                                        required
                                        onChange={e=>{settitle(e.target.value)}}
                                        value={title}
                                        />
                                    </label>
                                </div>

                                <div className={styles.question_subTitle}>
                                    <div className={styles.question_subTitle_left}>
                                        <p className={styles.question_subTitle_time}>  
                                            Added {formatDistanceToNow(document.added_at.toDate(),{addSuffix:true})}
                                        </p>

                                        {document.edited_at && 
                                        <p className={styles.question_subTitle_edit}>  
                                            Edited {formatDistanceToNow(document.edited_at.toDate(),{addSuffix:true})}
                                        </p>}
                                        
                                        <p className={styles.question_subTitle_author}>
                                            Created by: {document.created_by}
                                        </p>
                                    </div>
                                    <div className={styles.question_subTitle_right}>
                                        {!loading && 
                                        <button className={styles.saveBtn}onClick={handleSave}>Save</button> }
                                        {!loading && 
                                        <button className={styles.cancelBtn}onClick={handleCancel}>Cancel</button> }
                                        {loading && 
                                        <button className={styles.saveBtn}disabled onClick={handleSave}>Save</button> }
                                        {loading && 
                                        <button className={styles.cancelBtn}disabled onClick={handleCancel}>Cancel</button> }
                                    </div>
                                </div>  
                            </div>
                            
                    <div className={styles.question_bottom}>
                        <div className={styles.tag_container}>
                            <p className={styles.tag_name}>Tags: </p>
                            <Select
                                className={styles.tag}
                                onChange={(option)=>settag(option)}
                                options={categories}
                                defaultValue={document.question_tag}
                                isMulti
                            />
                        </div>
                        

                        <label className={styles.add_question_des}>
                            <textarea 
                            className={styles.question_des}
                            ref={textAreaDes}
                            required
                            onChange={e=>{setdes(e.target.value)}}
                            value={des}
                            />
                        </label>
                                
                        <label>
                            <input
                            className={styles.add_question_img}
                            type="file"
                            onChange={e => {setimage([...e.target.files])}}
                            multiple accept="image/*"
                            />
                        </label>   
                        <div className={styles.image_preview_container}>
                            {imageURL && imageURL.map(imageSrc=>
                            <img className={styles.image_preview} key={imageSrc}src={imageSrc}/>)}
                        </div>
                    </div>
                         
                    </form>           
                </div>
                }
            </div>
        </div>
        
        
        
    )
}
