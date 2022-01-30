import styles from "./EditPost.module.css";
import { useEffect, useState,useRef } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import {increment, Timestamp} from "firebase/firestore";
import {useFirestore} from "../../hooks/useFirestore";
import {ref, deleteObject } from "firebase/storage";
import {storage} from "../../firebase/config";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import Select from "react-select";
import { useGlobalState } from "state-pool";
import {AiOutlineTag,AiOutlineUser} from "react-icons/ai";
import { db } from "../../firebase/config"
import { writeBatch,doc } from "firebase/firestore";
import { useAuthContext } from "../../hooks/useAuthContext";

export default function EditPost({document,editMode,setEditMode,displayName}) {
    
    const {updateDocument,response} = useFirestore(["posts"]);
    const {updateDocument:updateDocument2, response:response2} = useFirestore(["record"]);
    const [loading,setLoading] = useState(false);
    const [title, settitle] = useState("");
    const [des, setdes] = useState(""); 
    const [tag, settag] = useState([]);
    const [image, setimage] = useState([]);
    const [imageURL,setImageURL] = useState([]);
    const [imageName,setImageName] = useState([]);
    const [oldTag,setOldTag] = useState([]);
    // const [error, setError] = useState(false);
    let tempArray =[];
    const formInput = useRef();
    const textAreaDes = useRef();
    const textAreaTitle = useRef();
    const navigate = useNavigate();
    const [categories,setCategories] = useGlobalState("tag");
    const [postType, setPostType] = useGlobalState("postType");
    const [defaultSelector, setDefaultSelector] = useState([]);
    const [defaultSelectorType, setDefaultSelectorType] = useState(null);
    const {user} = useAuthContext();
    const [postTypeInput, setPostTypeInput] = useState(null);

    // set all document value to current input field
    useEffect(() => {
        window.scrollTo(0,0);

        const getData=async()=>{
            if(document){
                settitle(document.post_title);
                setdes(document.post_description);
                setPostTypeInput(document.post_type);
                // settag(document.post_tag); 
                // settag([]);
                let tempTagArr = [];
                let tempTagArr2 = [];
                document.post_tag.forEach(tagsss=>{
                    tempTagArr.push({label:tagsss, value:tagsss});
                    tempTagArr2.push(tagsss);
                })
                setOldTag(tempTagArr2);
                settag(tempTagArr);
                // get picture
                if( document.post_image_url){
                    await document.post_image_url.forEach(item=>{
                        tempArray.push(item);
                    })
                    setImageURL(tempArray);
                    setImageName(document.post_image_name);
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

        // format tag select
        let tempArray2 = [];
        document.post_tag.forEach(item=>{
            const tempObj={
                label:item,
                value:item,
            }
            tempArray2.push(tempObj);
        });
        setDefaultSelector(tempArray2);
        const tempObj2 = {
            label:document.post_type,
            value:document.post_type,
        }
        setDefaultSelectorType(tempObj2);

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
        if (!user) {
            Swal.fire("Please login to edit","","warning");
        }
        else{
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

                    let tagList=[];

                    tag.forEach(item=>{
                        tagList.push(item.value);
                    })

                    
                    // user input as object
                    const post_object={
                        post_title: title,
                        post_description: des,
                        post_tag: tagList,
                        post_image_name:imageName,
                        post_image_url:"",
                        edited_at: Timestamp.now(),
                        post_type: postTypeInput,
                    }
                    // if user use back old image
                    if(image.length === 0){
                        post_object.post_image_url = document.post_image_url;
                    }

                    // if user upload new image
                    // delete all image from storage
                    if(image.length !== 0){
                        document.post_image_name.forEach(image_name=>{
                            // Create a reference to the file to delete
                            const desertRef = ref(storage, `posts/${document.id}/${image_name}`);
                            // Delete the file
                            deleteObject(desertRef).then(() => {
                                // File deleted successfully
        
                            }).catch((error) => {
                                console.log(error);
                            // Uh-oh, an error occurred!
                            });
                        })
                    }
                    console.log("hi2",image);
        
                    //update  database
                    await updateDocument(document.id,post_object,image,"posts");

                    //update tag
                    // get the tag tat need to increase
                    const tagIncrease = tagList.filter(newTag => !oldTag.includes(newTag));
                    const tagDecrease = oldTag.filter(old => !tagList.includes(old));
                    console.log(tagIncrease,tagDecrease);
                    const updateObj = {};
                    tagIncrease.forEach(item=>{
                        updateObj[item] = increment(1);
                    })
                    tagDecrease.forEach(item=>{
                        updateObj[item] = increment(-1);
                    })
                    console.log(updateObj);
                    
                    await updateDocument2("tag",updateObj);
                    if(response2.error){
                        console.log(response2.error);
                    }
                    setLoading(false);
                    setOldTag();
        
                    if(!response.error){
                        settag([]);
                        settitle("");
                        setdes("");
                        setimage([]);
                        setImageURL([]);
                        formInput.current.reset();
                        Swal.fire('Saved!', '', 'success');
                        navigate(`/post/${document.id}`);
                        setEditMode(false);
                    }
                    else{
                        console.log("hi",response.error);
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
                navigate(`/post/${document.id}`);
                setEditMode(false);
            }
        })
    }

    return (
        <div>
            <div className={styles.post_container}>
                {editMode && 
                    <div className={styles.post_details}>
                        <form className={styles.add_post_form}  ref={formInput}>
                            <div className={styles.post_top}>
                                <div className={styles.post_header}>
                                    <label className={styles.add_post_title}>
                                        <textarea
                                        className={styles.post_title}
                                        ref={textAreaTitle}
                                        // type="text"
                                        maxLength={74}
                                        required
                                        onChange={e=>{settitle(e.target.value)}}
                                        value={title}
                                        />
                                    </label>
                                </div>

                                <div className={styles.post_subTitle}>
                                    <div className={styles.post_subTitle_left}>
                                        <p className={styles.post_subTitle_time}>  
                                            Added {formatDistanceToNow(document.added_at.toDate(),{addSuffix:true})}
                                        </p>

                                        {document.edited_at && 
                                        <p className={styles.post_subTitle_edit}>  
                                            Edited {formatDistanceToNow(document.edited_at.toDate(),{addSuffix:true})}
                                        </p>}
                                        
                                        <p className={styles.post_subTitle_author}>
                                            <AiOutlineUser className={styles.peopleIcon}/>
                                            
                                            {displayName}
                                        </p>
                                    </div>
                                    <div className={styles.post_subTitle_right}>
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
                            
                    <div className={styles.post_bottom}>
                        <div className={styles.tag_container}>
                            <p className={styles.tag_name}>
                                <AiOutlineTag className={styles.tagicon}/>
                            </p>
                            <Select
                                className={styles.tag}
                                onChange={(option)=>settag(option)}
                                options={categories}
                                defaultValue={defaultSelector}
                                isMulti
                            />
                        </div>
                        
                        <div className={styles.post_type_container}>
                            <Select
                                className={styles.post_type}
                                onChange={(option)=>setPostTypeInput(option.value)}
                                options={postType.slice(0,2)}
                                defaultValue={defaultSelectorType}
                            />    
                        </div>
                        <label className={styles.add_post_des}>
                            <textarea 
                            className={styles.post_des}
                            ref={textAreaDes}
                            required
                            onChange={e=>{setdes(e.target.value)}}
                            value={des}
                            />
                        </label>
                                
                        <label>
                            <input
                            className={styles.add_post_img}
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
