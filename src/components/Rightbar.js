import styles from "./Rightbar.module.css";
import { NavLink } from "react-router-dom";
import { useComponentVisible } from "../hooks/useComponentVisible";
import { useState , useRef, useEffect } from "react";
import Select from "react-select";
import { useGlobalState } from "state-pool";
import { AiOutlineClose, AiTwotoneStar, AiOutlineDelete,AiOutlineStar } from "react-icons/ai";
import Swal from "sweetalert2";
import { useFirestore } from "../hooks/useFirestore";
import { async } from "@firebase/util";
import { useAuthContext } from "../hooks/useAuthContext";
import { useDocument } from "../hooks/useDocument";
import {Link} from "react-router-dom";
import { arrayUnion, doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";

export default function RightBar() {
    const {user} = useAuthContext();
    // const bmRef = useRef();
    const [categories,setCategories] = useGlobalState("tag");
    const [tag, setTag] = useState([]);
    const {updateDocument:updateUserBookmark, response:updateUserBookmarkRes} = useFirestore(["users"]);
    const [userBookMarkTag, setUserBookMarkTag] = useState(null);
    const [userBookMarkTagTop5, setUserBookMarkTagTop5] = useState(null);
    const [userBookMarkUser, setUserBookMarkUser] = useState(null);
    const {bmRef, isComponentVisible:showModalBookmark, setIsComponentVisible:setShowModalBookmark} = useComponentVisible(false);

    // const {document:userDoc, error:userDocError} = useDocument("users",user.uid);
    // console.log(userDoc);
    // console.log(user);
    const handleEdit = (e) => {
        e.preventDefault();
        setShowModalBookmark(true);
    }

    useEffect( async() => {
        if (user) {
            const docRef = doc(db, "users", user.uid);
            const unsub = onSnapshot(docRef, (doc) => {
                setUserBookMarkTag(doc.data().bookmark_tag);

            })

            return()=>{
                unsub();
            }
        }
    },[user])

    useEffect(() => {
        if (userBookMarkTag && userBookMarkTag.length > 5) {
            // let temp = "";
            const temp = userBookMarkTag.filter( item => {
                return(item.favorite)
            })
            const temp2 = userBookMarkTag.filter( item => {
                return(!item.favorite)
            })
            if (temp.length < 5) {
                let count = temp.length;
                for(let i = 0; i < temp2.length; i++) {
                    temp.push(temp2[i]);
                    count++;
                    if(count >= 5){
                        break;
                    }
                }
            }
            setUserBookMarkTagTop5(temp);
        }
        else{
            setUserBookMarkTagTop5(userBookMarkTag);
        }
    },[ userBookMarkTag ])



    const handleAddUser = (e) => {
        e.preventDefault();
    }

    const handleAddTag = async(e) => {
        e.preventDefault();
        if (tag.length === 0){
            Swal.fire("Cannot add empty tag!","","warning");
        }
        else{
            if(userBookMarkTag && userBookMarkTag.length !== 0 && userBookMarkTag.includes(tag.value)){
                Swal.fire("You already bookmark the same tag","","error")
            }
            else{
                const obj = {
                    bookmark_tag: arrayUnion({
                        tagName: tag.value,
                        favorite: false
                    }),
                }
                await updateUserBookmark(user.uid,obj);
    
                if(updateUserBookmarkRes.error){   
                    Swal.fire("Something went wrong","","error");
                }
            }
        }
    }

    const handleUserStar = (e) => {
        e.preventDefault();
    }

    const handleUserDelete = (e) => {
        e.preventDefault();
        
    }

    const handleTagStar = async(e,item) => {
        e.preventDefault();
        let maxReach = false;
        let count = 0 ;
        let iWantToDeselect = false;
        userBookMarkTag.forEach( countItem => {
            if (countItem.favorite) {
                count++;
            }
            if (countItem.tagName === item && countItem.favorite) {
                iWantToDeselect = true;
            }
        });
        if(count === 5){
            maxReach = true;
        }
        if (maxReach && !iWantToDeselect) {
            Swal.fire("Maximum 5 favourite allowed", "","info")
        }
        else{
            const temp = userBookMarkTag.map(tagItem => {
                if(tagItem.tagName === item){
                    return {tagName:tagItem.tagName,
                        favorite:!tagItem.favorite};
                }
                else{
                    return tagItem
                }
            })
    
            const obj = {
                bookmark_tag: temp
            }
            await updateUserBookmark(user.uid,obj);
    
            if(updateUserBookmarkRes.error){   
                Swal.fire("Something went wrong","","error");
            }
        }
        

    }

    const handleTagDelete = async(e, item) => {
        e.preventDefault();
        const temp = userBookMarkTag.filter (tagItem => {
            return(tagItem.tagName != item)
        })
        const obj = {
            bookmark_tag: temp
        }
        await updateUserBookmark(user.uid,obj);

        if(updateUserBookmarkRes.error){   
            Swal.fire("Something went wrong","","error");
        }
    }

    return (
        <>
        <div className={styles.rightbar_container}>
            
            <div className={styles.rightbar_content}>
                <div className={styles.my_question}>
                    <button className={styles.my_question_btn}>Go to My Question</button>
                </div>

                <div className={styles.bookmark_container}>
                    <div className={styles.bookmark_title}>
                        <span className={styles.bookmark_word}>Bookmark</span>
                        <button className={styles.bookmark_edit} onClick={handleEdit}>Edit</button>
                    </div>
                    <div className={styles.bookmark_content}>

                        <div className={styles.bookmark_tag}>
                            <span className={styles.bookmark_tag_title}>Tag</span>
                            <ul className={styles.bookmark_ul}>
                                {userBookMarkTagTop5 && userBookMarkTagTop5.map(item => (
                                    <Link key={item.tagName} to={`/tag/${item.tagName}`} className={styles.bookmark_edit_link}>
                                        <li>{item.tagName}</li>
                                    </Link>
                                ))}
                                {!userBookMarkTagTop5 && <span className={styles.light_font}>Empty</span>}
                            </ul>
                            {userBookMarkTag && userBookMarkTag.length > 5 && <span className={styles.viewmore} onClick={() => {setShowModalBookmark(true)}}> + View more</span>}
                            
                        </div>
                        <div className={styles.bookmark_tag}>
                            <span className={styles.bookmark_tag_title}>User</span>
                            <ul className={styles.bookmark_ul}>
                                <li>User 1</li>
                                <li>User 2</li>
                                <li>User 3</li>
                                <li>User 4</li>
                                <li>User 5</li>
                            </ul>
                            <span className={styles.viewmore}> + View more</span>

                        </div>
                    </div>
                    
                </div>
                

            </div>
            
        </div>
        {showModalBookmark && 
            <div className={styles.bookmark_edit_container} ref={bmRef}> 
                <div className={styles.bookmark_edit_top}>
                    <p className={styles.bookmark_edit_title}>Bookmark Manager</p>
                    <AiOutlineClose className={styles.bookmark_edit_close} onClick={() => {setShowModalBookmark(false)}}/>
                </div>
                <div className={styles.bookmark_edit_mid}>

                        <div className={styles.bookmark_content_left}>
                            <p className={styles.bookmark_left_title}>Tag</p>
                            <div className={styles.bookmark_left_body}>
                                <div className={styles.bookmark_left_body_top}>
                                    <Select
                                        className={styles.bookmark_tag_search}
                                        onChange={(option)=>setTag(option)}
                                        options={categories}
                                    />
                                    <button className={styles.bookmark_tag_add}onClick={handleAddTag}>Add</button>
                                </div>
                                <div className={styles.bookmark_left_body_btm}>
                                    <ul className={styles.bookmark_edit_ul}>
                                        {userBookMarkTag&& userBookMarkTag.map(item => (
                                            <li className={styles.bookmark_edit_li} key={item.tagName}> 
                                            <Link className={styles.bookmark_edit_item}to={`/tag/${item.tagName}`} onClick={() => {setShowModalBookmark(false)}}>
                                            <p >{item.tagName}</p>
                                            </Link>
                                            
                                            {item.favorite&& <AiTwotoneStar className={styles.bookmark_edit_star} onClick={(e) => {handleTagStar(e,item.tagName)}}/>}
                                            {!item.favorite && 
                                            <AiOutlineStar className={styles.bookmark_edit_star} onClick={(e) => {handleTagStar(e,item.tagName)}}/>
                                            }
                                            
                                            
                                            <AiOutlineDelete className={styles.bookmark_edit_delete} onClick={(e) => {handleTagDelete(e,item.tagName)}}/>
                                           
                                        </li>
                                        ))}
                                        
                                        
                                        
                                    </ul>
                                </div>
                            </div>

                        </div>
                        <div className={styles.bookmark_content_right}>
                            <p className={styles.bookmark_left_title}>User</p>
                            <div className={styles.bookmark_right_body}>
                                <div className={styles.bookmark_right_body_top}>
                                    <input className={styles.bookmark_user_input}/>
                                    <button className={styles.bookmark_user_add} onClick={handleAddUser}>Add</button>
                                </div>
                                <div className={styles.bookmark_right_body_btm}>
                                    <ul className={styles.bookmark_edit_ul}>
                                        <li className={styles.bookmark_edit_li}>
                                            <p className={styles.bookmark_edit_item}>item</p>
                                            <AiTwotoneStar className={styles.bookmark_edit_star} onClick={handleUserStar}/>
                                            <AiOutlineDelete className={styles.bookmark_edit_delete} onClick={handleUserDelete}/>
                                           
                                        </li>
                                        
                                    </ul>
                                </div>
                            </div>

                        </div>
                </div>
            </div>
            }
        </>
    )
}
