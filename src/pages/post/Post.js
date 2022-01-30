import styles from "./Post.module.css";
import { useState, useEffect } from "react";
import {useParams} from "react-router-dom";
import {useDocument} from "../../hooks/useDocument";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { useFirestore } from "../../hooks/useFirestore";
import { useNavigate } from "react-router";
import {ref, deleteObject } from "firebase/storage";
import {storage,db} from "../../firebase/config";
import Swal from "sweetalert2";
import EditPost from "./EditPost";
import AddComment from "../comment/AddComment";
import CommentSection from "../comment/CommentSection";
import { writeBatch,doc,collection, getDocs, Timestamp,getDoc, arrayUnion, arrayRemove,increment } from "firebase/firestore";
import {AiOutlineTag,AiOutlineUser,AiOutlineEye,AiOutlineClose} from "react-icons/ai";
import {BsCaretUp, BsCaretUpFill, BsCaretDown, BsCaretDownFill} from "react-icons/bs";
import {MdReportProblem} from "react-icons/md";
import { useComponentVisible } from "../../hooks/useComponentVisible";
import { useAuthContext } from "../../hooks/useAuthContext";

export default function Post() {
    // get id from param
    const {id} = useParams();
    const [change,setChange] = useState(0);
    const {error, document} = useDocument("posts",id,setChange);
    const {deleteDocument } = useFirestore(["posts"]);
    const navigate = useNavigate();
    // const [loading,setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const {updateDocument,response} = useFirestore(["posts"]);
    const {updateDocument:updateDocument2} = useFirestore(["record"]);
    const [prob, setProb] = useState("");
    const {Comref, isComponentVisible:showReportModal, setIsComponentVisible:setShowReportModal} = useComponentVisible(false);
    const {addDocument, response:ReportResponse} = useFirestore(["report"]);
    const [userName, setUserName] = useState(null);
    const {user} = useAuthContext();

    useEffect(() => {
        // only update view 1
        if(document && change === 1 && !localStorage.getItem(document.id)){
            Swal.showLoading();
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
            Swal.close();

        } 
    }, [document,change]);

    useEffect(()=>{
        window.scrollTo(0,0); 
    },[])

    useEffect(async() => {
        // get user name for post when successful fetch post data
        if (document) {
            Swal.showLoading();
            const docRef = doc(db, "users", document.created_by);
            const docSnap = await getDoc(docRef);
            setUserName(docSnap.data().displayName);
            Swal.close();
        }


    },[document])

    // delete post
    const handleDelete=(e)=>{
        e.preventDefault();
        // alert user
        Swal.fire({
            title: 'Do you want to delete the post?',
            showDenyButton: true,
            confirmButtonText: 'Delete',
            denyButtonText: `Don't delete`,
            confirmButtonColor: `#dc3741`,
            denyButtonColor: `#7066e0`,
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
                
                document.post_image_name.forEach(image_name=>{
                    // Create a reference to the file to delete
                    const desertRef = ref(storage, `post/${document.id}/${image_name}`);
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

                document.post_tag.forEach(tag=>{
                    updateObj[tag] = increment(-1);
                })
                await updateDocument2("tag",updateObj);
                // delete subCollection
                const commentList = await getDocs(collection(db,"posts",tempKey,"comment"));
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
                navigate("/post");
            } else if (result.isDenied) {
              Swal.fire('Post not deleted', '', 'info')
            }
          })
    };

    

    // set edit mode to false
    const handleEdit=()=>{
        setEditMode(true);
    }

    // add post
    const handleAddPost=(e)=>{
        e.preventDefault();
        if (!user) {
            Swal.fire("Please login to add something","","warning");
        }
        else{
            navigate("/addpost");
        }
    }

    //report
    const handleReport = (e) =>{
        e.preventDefault();
        setShowReportModal(true);
    }

    const handleReportSubmit = (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Are you sure?',
            showDenyButton: true,
            confirmButtonText: 'Yes',
            denyButtonText: `No`,
            
        }).then(async(result)=>{

            if (result.isConfirmed) {
                Swal.fire({
                    title:"Now Loading...",
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                })
                Swal.showLoading();
                const reportObj={
                    message: prob,
                    post: id,
                    report_user_id: "",
                    added_at:Timestamp.now(),
                }

                await addDocument(reportObj);

                if(!ReportResponse.error){
                    setProb("");                
                    Swal.fire('Report successful !', '', 'success');
                    setShowReportModal(false);
                }else{
                    console.log(ReportResponse.error);
                    Swal.fire('Something wrong...', '', 'error');
                }
            }
            else if(result.isDenied){
                Swal.fire('Nothing happen', '', 'info')
            }}
        )
    }

    const handleUpVote = async(e) => {
        e.preventDefault();

        if (!document.upVoteList.includes(user.uid)) {
            let post_object = "";
            if (document.downVoteList.includes(user.uid)) {
                post_object={
                    upVote:increment(1),
                    downVote:increment(-1),
                    upVoteList:arrayUnion(user.uid),
                    downVoteList:arrayRemove(user.uid)
                }
            }
            else {
                post_object={
                    upVote:increment(1),
                    upVoteList:arrayUnion(user.uid)
                }
            }
            
            //update  database
            await updateDocument(id,post_object);
    
            if (response.error){
                Swal.fire("Something wrong","","error");
            }
        } else{
            const post_object={
                upVote:increment(-1),
                upVoteList:arrayRemove(user.uid),
            }
            //update  database
            await updateDocument(id,post_object);
    
            if (response.error){
                Swal.fire("Something wrong","","error");
            }
        }
        

    }

    const handleDownVote = async(e) => {
        e.preventDefault();
        
        if (!document.downVoteList.includes(user.uid)) {
            let post_object = "";
            if (document.upVoteList.includes(user.uid)) {
                post_object={
                    upVote:increment(-1),
                    downVote:increment(1),
                    upVoteList:arrayRemove(user.uid),
                    downVoteList:arrayUnion(user.uid)
                }
            }
            else {
                post_object={
                    downVote:increment(1),
                    downVoteList:arrayUnion(user.uid)
                }
            }

            //update  database
            await updateDocument(id,post_object);

            if (response.error){
                Swal.fire("Something wrong","","error");
            }
        }
        else {
            const post_object = {
                downVote: increment(-1),
                downVoteList: arrayRemove(user.uid)
            }

            //update  database
            await updateDocument(id,post_object);

            if (response.error){
                Swal.fire("Something wrong","","error");
            }
        }

        
    }
    if(error){
        return <div>{error}</div>
    };

    return (
        <div>
            <div className={styles.post_container}>
                {!document && <div>Loading</div>}
                {!editMode && document && 
                    <div className={styles.post_details}>
                        <div className={styles.post_top}>
                            <div className={styles.post_header}>
                                <p className={styles.post_title}>{document.post_title}</p>
                                <div className={styles.questoin_report}>
                                    <MdReportProblem className={styles.post_report} onClick={handleReport}/>
                                    <span className={styles.report_span}>Click to Report</span>
                                </div>
                                <div className={styles.post_add}>
                                    <button className={styles.post_add_btn} onClick={handleAddPost}>Add Something</button>
                                </div>
                        
                            </div>
                            <div className={styles.post_subTitle}>
                                <div className={styles.post_subTitle_left}>
                                    <p className={styles.post_view}>
                                        <AiOutlineEye className={styles.eye}/>
                                        {document.view}
                                        
                                    </p>
                                    <p className={styles.post_subTitle_time}>  
                                        Added {formatDistanceToNow(document.added_at.toDate(),{addSuffix:true})}
                                    </p>

                                    {document.edited_at && 
                                        <p className={styles.post_subTitle_edit}>  
                                            Edited {formatDistanceToNow(document.edited_at.toDate(),{addSuffix:true})}
                                        </p>
                                    }
                                    
                                    <p className={styles.post_subTitle_author}>
                                        <AiOutlineUser className={styles.peopleIcon}/>
                                        <span className={styles.peopleName}>{userName}</span>
                                    </p>
                                </div>
                                {user && ((user.uid === document.created_by) || (user.uid === "ZuYyHrRcx3bVYqhCIp4ZB6U1gve2")) && 
                                <div className={styles.post_subTitle_right}>
                                    <button className={styles.editBtn}onClick={handleEdit}>Edit</button>
                                    <button className={styles.deleteBtn}
                                    onClick={handleDelete}>Delete</button>
                                    
                                </div>
                                }
                                
                            </div>
                        </div>
                        <div className={styles.post_bottom_container}>
                            <div className={styles.post_vote_container}> 
                                <span className={styles.upVoteSpan}>{document.upVote}</span>
                                {document.upVoteList.includes(user.uid) && <BsCaretUpFill className={styles.upVote} onClick={(e)=>handleUpVote(e)}/>}
                                {!document.upVoteList.includes(user.uid) &&<BsCaretUp className={styles.upVote} onClick={(e)=>handleUpVote(e)}/>}
                                {document.downVoteList.includes(user.uid) && <BsCaretDownFill className={styles.downVote} onClick={(e)=>handleDownVote(e)}/>}
                                {!document.downVoteList.includes(user.uid) &&<BsCaretDown className={styles.downVote} onClick={(e)=>handleDownVote(e)}/>}

                                <span className={styles.downVoteSpan}>{document.downVote}</span>

                            </div>
                            <div className={styles.post_bottom}>
                                <div className={styles.post_tag_big_container}>
                                    <p className={styles.post_subTitle_tags}>
                                        <AiOutlineTag className={styles.tagicon}/>
                                    </p>
                                    <div className={styles.post_tag_container}>
                                        {document.post_tag.map(tag=>(
                                        <span className={styles.tag} key={tag}>{tag}</span>
                                    ))}
                                    </div>
                                </div>
                                
                                <div className={styles.post_type_container}>
                                    <span className={styles.post_type}>{document.post_type}</span>
                                </div>
                                <p className={styles.post_des}>{document.post_description}</p>
                                {document.post_image_url && document.post_image_url.map(imageSrc=>
                                    <img className={styles.image_preview} key={imageSrc}src={imageSrc} alt="image-preview"/>)}
                            </div>
                        </div>
                </div>
                }
                {document && <EditPost document = {document}editMode={editMode} setEditMode={setEditMode} displayName={userName}/>}
                {document && !editMode && <AddComment post_id={document.id}/>}
                {document && !editMode && <CommentSection post_id={document.id}/>}
            </div>
            {showReportModal && <div className={styles.report_modal_container} ref={Comref}>
                <form className={styles.report_modal_form}>
                    <div className={styles.report_modal_top}>
                        <p className={styles.report_modal_span}> Report Form </p>
                        <AiOutlineClose className={styles.report_modal_close} onClick={()=>{setShowReportModal(false)}}/>
                    </div>
                    <label className={styles.report_modal_form_prob}>
                        <span className={styles.report_modal_form_prob_span}>What is the problem?</span>
                        <textarea 
                        className={styles.report_modal_form_prob_textarea}
                        required
                        value={prob}
                        onChange={(e)=>{setProb(e.target.value)}}
                        />
                    </label>
                    <p className={styles.report_modal_info}>Only admin know your report content </p>
                    <button className={styles.report_modal_button} onClick={handleReportSubmit}>Submit</button>
                </form>
            </div>}
                
        </div>
    )
}
