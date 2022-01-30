import { useEffect, useState,useRef } from "react";
import {Timestamp, increment,doc,writeBatch} from "firebase/firestore";
import {useFirestore} from "../../hooks/useFirestore";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import styles from "./AddPost.module.css";
import Select from "react-select";
import { useGlobalState } from "state-pool";
import {db} from "../../firebase/config";
import { useAuthContext } from "../../hooks/useAuthContext";

export default function AddPost() {
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
    const {addDocument, response} = useFirestore(["posts"]);
    const {updateDocument} = useFirestore(["record"]);
    const navigate = useNavigate();
    const [categories, setCategories] = useGlobalState("tag");
    const [postType, setPostType] = useGlobalState("postType")
    const [batchErr,setBatchErr] = useState(false);
    const {user} = useAuthContext();
    const [postTypeInput, setPostTypeInput] = useState({value:"Question",label:"Question"});
    const [postTypeSearch, setQuestionTypeSearch] = useState();
    


    // when user submit the form
    const handleSubmit=(e)=>{
        e.preventDefault();

        if (!user) {
            Swal.fire('Please login to add something', '', 'warning')
        }
        else{
            if(formInput.current.checkValidity() && tag.length !== 0 && postTypeInput != null){
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
    
                        // const tagObj={}
    
                        let tagList=[];
                        //get tag value
                        tag.forEach(item=>{
                            tagList.push(item.value);
                            // tagObj[item.value] = increment(1)
                        })
                        const curr = new Date();
                    
                        // user input as object
                        const post_object={
                            post_title: title,
                            post_description: des,
                            post_tag: tagList,
                            post_image_name:imageName,
                            post_image_url:"",
                            // post_comments:[],
                            added_at: Timestamp.now(),
                            edited_at:"",
                            created_by:user.uid,
                            post_type:postTypeInput.value,
                            view:0,
                            upVote:0,
                            downVote:0,
                            upVoteList:[],
                            downVoteList:[]
                        }
                        // console.log(post_object);
    
    
                        //add to database
                        await addDocument(post_object,image,"post");
                        // update tag amount post
    
    
                        const updateObj = {};
    
                        tagList.forEach(item=>{
                            updateObj[item] = increment(1);
                        })
                        await updateDocument("tag",updateObj);
    
                        // no error
                        if(!response.error && !batchErr){
                            settag([]);
                            settitle("");
                            setdes("");
                            setimage([]);
                            setImageURLs([]);
                            formInput.current.reset();
                            Swal.fire('Uploaded!', '', 'success')
                            navigate("/post");
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
        <div className={styles.add_post_container}>
            
            <div className={styles.add_post_form_container}>
                <div className={styles.add_post_header}>
                    <p className={styles.add_post_title_header}>Add something</p>
                </div>
                <form className={styles.add_post_form} ref={formInput}>
                    <label className={styles.add_post_title}>
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

                    <label className={styles.add_post_tag}>
                        <span className={styles.span_title}>Tags:</span>
                        <Select
                            onChange={(option)=>settag(option)}
                            options={categories}
                            isMulti
                        />
                        {/* add tag here  */}
                    </label>

                    <label className={styles.add_post_tag}>
                        <span className={styles.span_title}>Type:</span>
                        <Select
                            onChange={(option)=>setPostTypeInput(option)}
                            options={postType.slice(0,2)}
                            defaultValue={{label: "Question",value:"Question"}}
                        />
                    </label>

                    <label className={styles.add_post_des}>
                        <span className={styles.span_title}>Description:</span>
                        <textarea 
                        className={`${styles.add_post_des_input} ${styles.input_style}`}
                        required
                        ref={desRef}
                        onChange={e => {setdes(e.target.value)}}
                        value={des}
                        placeholder="Description ..."
                        />
                    </label>


                    <label className={styles.add_post_img}>
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
