import { useEffect, useState,useRef } from "react";
import { db, storage } from "../../firebase/config";
import {collection, addDoc, Timestamp, updateDoc, arrayUnion, doc} from "firebase/firestore";
import {ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {useFirestore} from "../../hooks/useFirestore";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import "./AddQuestion.css";

export default function AddQuestion() {
    const [title, settitle] = useState("");
    const [des, setdes] = useState(""); 
    const [tag, settag] = useState([]);
    const [image, setimage] = useState([]);
    const [imageURLs,setImageURLs] = useState([]);
    const [imageName,setImageName] = useState([]);
    const [loading,setloading] = useState(false);
    const [error,setError] = useState(false);
    const formInput = useRef();
    const {addDocument,updateDocument, response} = useFirestore("questions");
    const navigate = useNavigate();

    // when user submit the form
    const handleSubmit=(e)=>{
        e.preventDefault();
        if(formInput.current.checkValidity()){
            Swal.fire({
                title: 'Do you want to add the question?',
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: 'Add',
                denyButtonText: `Don't add`,
              }).then(async(result) => {
                if (result.isConfirmed) {
                    setloading(true);
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
    
                //add to database
                await addDocument(question_object,image);
                setloading(false);
    
                if(!error){
                    settag([]);
                    settitle("");
                    setdes("");
                    setimage([]);
                    setImageURLs([]);
                    formInput.current.reset();
                    navigate("/question");
                }
                  Swal.fire('Saved!', '', 'success')
                } else if (result.isDenied) {
                  Swal.fire('Question not added', '', 'info')
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
        <div className="add-question-container">
            <div className="add-question-header">
                <h2 className="add-question-title">Add new question</h2>
            </div>
            <div className="add-question-form-container">
                <form className="add-question-form" onSubmit={handleSubmit} ref={formInput}>
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

                    <label className="add-question-tag">
                        <span className="span-title">Question Tags:</span>
                        {/* add tag here  */}
                    </label>

                    <label className="add-question-des">
                        <span className="span-title">Question description:</span>
                        <textarea 
                        className="add-question-des-input input-style"
                        required
                        onChange={e => {setdes(e.target.value)}}
                        value={des}
                        />
                    </label>


                    <label className="add-question-img">
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

                    {!loading && <button className="submit-btn" onClick={handleSubmit}>Add question</button>}
                    {loading && <button className="submit-btn"disabled>loading</button>}
                </form>
            </div>
            
        </div>
    )
}
