import { useEffect, useState,useRef } from "react";
import {Timestamp} from "firebase/firestore";
import {useFirestore} from "../../hooks/useFirestore";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import styles from "./AddQuestion.module.css";
import Select from "react-select";
import { useGlobalState } from "state-pool";

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
    const titleRef = useRef();
    const desRef = useRef();
    const {addDocument, response} = useFirestore(["questions"]);
    const navigate = useNavigate();
    const [categories, setCategories] = useGlobalState("tag");

    // when user submit the form
    const handleSubmit=(e)=>{
        e.preventDefault();
        if(formInput.current.checkValidity()){
            Swal.fire({
                title: 'Are you sure?',
                showDenyButton: true,
                confirmButtonText: 'Yes',
                denyButtonText: `No`,
              }).then(async(result) => {
                if (result.isConfirmed) {
                    setloading(true);
                    Swal.fire({
                        title:"Now Loading...",
                        allowEscapeKey: false,
                        allowOutsideClick: false,
                    })
                    Swal.showLoading();
                    let tagList=[];
                    //get tag value
                    tag.forEach(item=>{
                        tagList.push(item.value);
                    })
                
                    // user input as object
                    const question_object={
                        question_title: title,
                        question_description: des,
                        question_tag: tagList,
                        question_image_name:imageName,
                        question_image_url:"",
                        // question_comments:[],
                        added_at: Timestamp.now(),
                        edited_at:"",
                        created_by:""
                    }
                    console.log(question_object);
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
                        Swal.fire('Uploaded!', '', 'success')
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
                  Swal.fire('Nothing happen...', '', 'info')
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
            
            <div className={styles.add_question_form_container}>
                <div className={styles.add_question_header}>
                    <p className={styles.add_question_title_header}>Add something</p>
                </div>
                <form className={styles.add_question_form} ref={formInput}>
                    <label className={styles.add_question_title}>
                        <span className={styles.span_title}>Title:</span>
                        <input
                        required
                        // ref={titleRef}
                        maxLength={74}
                        type="text"
                        className={`${styles.input_style} ${styles.add_title_input}`}
                        onChange={e => {settitle(e.target.value)}}
                        value={title}
                        placeholder="Title ..."
                        />
                    </label>

                    <label className={styles.add_question_tag}>
                        <span className={styles.span_title}>Tags:</span>
                        <Select
                            onChange={(option)=>settag(option)}
                            options={categories}
                            isMulti
                        />
                        {/* add tag here  */}
                    </label>

                    <label className={styles.add_question_des}>
                        <span className={styles.span_title}>Description:</span>
                        <textarea 
                        className={`${styles.add_question_des_input} ${styles.input_style}`}
                        required
                        ref={desRef}
                        onChange={e => {setdes(e.target.value)}}
                        value={des}
                        placeholder="Description ..."
                        />
                    </label>


                    <label className={styles.add_question_img}>
                        <span className={styles.span_title}>Image: </span>
                        <input
                        // className={styles.input_style}
                        type="file"
                        className={styles.add_img_btn}
                        onChange={e => {setimage([...e.target.files])}}
                        multiple accept="image/*"
                        />
                    </label>

                    <div className={styles.image_preview_container}>
                        {imageURLs.map(imageSrc=>
                        <img className={styles.image_preview} key={imageSrc}src={imageSrc} alt="image-preview"/>)}
                    </div>

                    {!loading && <button className={styles.submit_btn} onClick={handleSubmit}>Upload</button>}
                    {loading && <button className={styles.submit_btn}disabled>loading</button>}
                </form>
            </div>
            
        </div>
    )
}
