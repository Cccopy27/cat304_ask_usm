import { useEffect, useState,useRef } from "react";
import {Timestamp} from "firebase/firestore";
import {useFirestore} from "../../hooks/useFirestore";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import styles from "./AddQuestion.module.css";

export default function AddQuestion() {
    const [title, settitle] = useState("");
    const [des, setdes] = useState(""); 
    const [tag, settag] = useState([]);
    const [image, setimage] = useState([]);
    const [imageURLs,setImageURLs] = useState([]);
    const [imageName,setImageName] = useState([]);
    const [loading,setloading] = useState(false);
    // const [error,setError] = useState(false);
    const formInput = useRef();
    const {addDocument, response} = useFirestore(["questions"]);
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
                        // question_comments:[],
                        added_at: Timestamp.now(),
                        created_by:""
                    }
    
                    //add to database
                    await addDocument(question_object,image,"question");
                    setloading(false);
                    
                    // no error
                    if(!response.error){
                        settag([]);
                        settitle("");
                        setdes("");
                        setimage([]);
                        setImageURLs([]);
                        formInput.current.reset();
                        Swal.fire('Saved!', '', 'success')
                        navigate("/question");
                    }
                    // got error
                    else{
                        console.log("something wrong");
                        Swal.fire({
                            icon:"error",
                            title:"Something wrong",
                            showConfirmButton: true,
                        })
                    }
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
        <div className={styles.add_question_container}>
            <div className={styles.add_question_header}>
                <h2 className={styles.add_question_title}>Add new question</h2>
            </div>
            <div className={styles.add_question_form_container}>
                <form className={styles.add_question_form} ref={formInput}>
                    <label className={styles.add_question_title}>
                        <span className={styles.span_title}>Question title:</span>
                        <input
                        required
                        type="text"
                        className={styles.input_style}
                        onChange={e => {settitle(e.target.value)}}
                        value={title}
                        />
                    </label>

                    <label className={styles.add_question_tag}>
                        <span className={styles.span_title}>Question Tags:</span>
                        {/* add tag here  */}
                    </label>

                    <label className={styles.add_question_des}>
                        <span className={styles.span_title}>Question description:</span>
                        <textarea 
                        className={styles.add_question_des_input,styles.input_style}
                        required
                        onChange={e => {setdes(e.target.value)}}
                        value={des}
                        />
                    </label>


                    <label className={styles.add_question_img}>
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
                        <img className={styles.image_preview} key={imageSrc}src={imageSrc} alt="image-preview"/>)}
                    </div>

                    {!loading && <button className={styles.submit_btn} onClick={handleSubmit}>Add question</button>}
                    {loading && <button className={styles.submit_btn}disabled>loading</button>}
                </form>
            </div>
            
        </div>
    )
}
