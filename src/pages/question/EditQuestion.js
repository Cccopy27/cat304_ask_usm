import "./EditQuestion.css";
import { useEffect, useState,useRef } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import {collection, addDoc, Timestamp, updateDoc, arrayUnion, doc} from "firebase/firestore";
import {useFirestore} from "../../hooks/useFirestore";
import {useDocument} from "../../hooks/useDocument";


export default function EditQuestion({document,editMode,setEditMode}) {
    
    const {updateDocument} = useFirestore("questions");
    // const {document,docError} = useDocument("questions",question_id);
    const [loading,setLoading] = useState(false);
    const [title, settitle] = useState("");
    const [des, setdes] = useState(""); 
    const [tag, settag] = useState([]);
    const [image, setimage] = useState([]);
    const [imageURL,setImageURL] = useState([]);
    const [imageName,setImageName] = useState([]);
    const [error, setError] = useState(false);
    const tempArray =[];
    const formInput = useRef();
    const navigate = useNavigate();
    // set all document value to current input field
    useEffect(async() => {
        window.scrollTo(0,0);
        if(document){
            settitle(document.question_title);
            setdes(document.question_description);

            // get picture
            if( document.question_image_url){
                await document.question_image_url.forEach(item=>{
                    tempArray.push(item);
                })
                setImageURL(tempArray);
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
                    question_comments:[],
                    added_at: Timestamp.now(),
                    created_by:""
                }
    
                //update  database
                await updateDocument(document.id,question_object,image);
                setLoading(false);
    
                if(!error){
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
        <>
            {editMode && 
                <div className="question-details">
                    <form className="add-question-form"  ref={formInput}>
                        <label className="add-question-title">
                            <span className="span-title">Question title:</span>
                            <input
                            required
                            type="text"
                            className="input-style"
                            onChange={e => {settitle(e.target.value)}}
                            value={title}
                            />
                        </label>
                        
                        <p>tags:{document.question_tag}</p>

                        <label className="add-question-des">
                            <span className="span-title">Question description:</span>
                            <textarea 
                            className="add-question-des-input input-style"
                            required
                            onChange={e => {setdes(e.target.value)}}
                            value={des}
                            />
                        </label>
                            
                        <div className="image-preview-container">
                            {imageURL && imageURL.map(imageSrc=>
                            <img className="image-preview" key={imageSrc}src={imageSrc}/>)}
                        </div>
                        <label className="add-question-img">
                            <span className="span-title">Image:</span>
                            <input
                            className="input-style"
                            type="file"
                            onChange={e => {setimage([...e.target.files])}}
                            multiple accept="image/*"
                            />
                        </label>
                        {!loading && 
                        <button onClick={handleSave}>saves</button> }
                        {!loading && 
                        <button onClick={handleCancel}>cancel</button> }
                        {loading && 
                        <button disabled onClick={handleSave}>saves</button> }
                        {loading && 
                        <button disabled onClick={handleCancel}>cancel</button> }
                    </form>
                </div>
            }
        </>
        
        
        
    )
}
