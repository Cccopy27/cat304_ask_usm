import { useReducer, useState,useEffect } from "react";
import {collection, addDoc, Timestamp,doc, deleteDoc,updateDoc,arrayUnion} from "firebase/firestore";
import { db,storage } from "../firebase/config";
import {ref, uploadBytes, getDownloadURL } from "firebase/storage";
//add doc, delete doc, update doc, store doc
let initialState = {
    document: null,
    isPending: false,
    error: false,
    success: null,
}

const firestoreReducer = (state, action)=>{
    switch(action.type){
        case "IS_PENDING":
            return {...state, isPending:true, success:false};
        case "ERROR":
            return {success: false, isPending: false, error:action.payload, document:null}
        case "ADDED_DOCUMENT":
            return {success: true, isPending: false, error: null, document: action.payload};  
        case "DELETED_DOCUMENT":
            return {isPending:false, document: null, success: true, error: null};
        case "UPDATED_DOCUMENT":
            return {isPending:false,document: action.payload, success: true, error: null }
        default:
            return state;
    }
}
// collections = the name of collection u wan to access in terms of array
// example,want to collection(db, questions,"questions_id",comment)
// pass [ questions,"questions_id",comment]

export const useFirestore=(collections)=>{
    const [response, dispatch] = useReducer(firestoreReducer, initialState);
    const [isCancelled, setIsCancelled] = useState(false);
    // only dispatch if not cancelled
    const dispatchIfNotCancelled = (action)=>{
        if(!isCancelled){
            dispatch(action);
        }
    }
    let collection_Ref = "";
    
        // collection ref
        collection_Ref = collection(db, ...collections);
    
    // add document
    // document = the document or data u wan to add into
    // image (optional) = for upload image
    // uploadPath (use together with image)(optional) = upload image path
    // if put into question storage, pass string storage
    const addDocument = async(document,image,uploadPathName)=>{
        dispatch({type:"IS_PENDING"});
        try{
            
            const addedDocument = await addDoc(collection_Ref, document);
            const changes = (imgURL)=>{
                if(uploadPathName==="question"){
                    return {
                        question_image_url: arrayUnion(imgURL)
                    }
                }
                else if(uploadPathName === "comment"){
                    return {
                        comment_image_url: arrayUnion(imgURL)
                    }
                }  
            }
            // handle image
            if(image){
                console.log("enter");
                // convert filelist to array to user array method
                const image_arr = Array.from(image);
                // upload photo to storage firebase to get its photo URL
                image_arr.forEach(img=>{
                    // the image will store in question/question.id/image.name
                    const uploadPath = `${uploadPathName}/${addedDocument.id}/${img.name}`;
                    const storageRef = ref(storage, uploadPath);
                    uploadBytes(storageRef, img)
                    .then((storageImg) =>{
                        // get image URL from storage
                        getDownloadURL(storageRef)
                        .then((imgURL)=>{
                            // update doc imgURL
                            updateDoc(doc(collection_Ref,addedDocument.id), changes(imgURL))
                            .then(()=>{
                                console.log(imgURL);

                            })
                        })
                    })          
                });
            }
            
            // console.log(isCancelled);
            dispatchIfNotCancelled({type:"ADDED_DOCUMENT", payload: addedDocument});
        }
        catch(err){
            dispatchIfNotCancelled({type:"ERROR", payload:err.message})
        }
    }

    // delete document
    // id = the document id u wan to delete
    const deleteDocument = async(id)=>{
        dispatch({type:"IS_PENDING"});
        try{
            await deleteDoc(doc(collection_Ref,id));
            dispatchIfNotCancelled({ type: 'DELETED_DOCUMENT' }) 

        }
        catch(err){
            dispatchIfNotCancelled({type:"ERROR", payload:err.message})
        }
    }

    //update document
    // id = the document id u wan to make change with
    // updates = the changes u wan to make
    // image (optional) = for upload image
    // uploadPath (use together with image)(optional) = upload image path
    // if put into question storage, pass string storage
    const updateDocument= async(id, updates, image, uploadPathName)=>{
        dispatch({type: "IS_PENDING"});

        try{
            const updatedoc = await updateDoc(doc(collection_Ref,id), updates);

            // handle image
            if(image){
                const changes = (imgURL)=>{
                    if(uploadPathName==="question"){
                        return {
                            question_image_url: arrayUnion(imgURL)
                        }
                    }
                    else if(uploadPathName === "comment"){
                        return {
                            comment_image_url: arrayUnion(imgURL)
                        }
                    }  
                }
                console.log("enter");
                // convert filelist to array to user array method
                const image_arr = Array.from(image);
                // upload photo to storage firebase to get its photo URL
                image_arr.forEach(img=>{
                    // the image will store in question/question.id/image.name
                    const uploadPath = `${uploadPathName}/${id}/${img.name}`;
                    const storageRef = ref(storage, uploadPath);

                    uploadBytes(storageRef, img)
                    .then((storageImg) =>{
                        // get image URL from storage
                        getDownloadURL(storageRef)
                        .then((imgURL)=>{
                            // update doc imgURL
                            updateDoc(doc(collection_Ref,id), 
                                changes(imgURL))
                            .then(()=>{
                                console.log(imgURL);

                            })
                        })
                    })          
                });
            }

            dispatchIfNotCancelled({type: "UPDATED_DOCUMENT", payload: updatedoc})
            // return updateDoc
        }
        catch(err){
            dispatchIfNotCancelled({type:"ERROR", payload:err.message})
            // return null

        }
    }

    useEffect(()=>{
        return()=> setIsCancelled(true)
    },[])

    return {addDocument, deleteDocument,updateDocument, response}
}