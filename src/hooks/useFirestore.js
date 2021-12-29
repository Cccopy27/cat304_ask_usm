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

export const useFirestore=(collections)=>{
    const [response, dispatch] = useReducer(firestoreReducer, initialState);
    const [isCancelled, setIsCancelled] = useState(false);
    // only dispatch if not cancelled
    const dispatchIfNotCancelled = (action)=>{
        if(!isCancelled){
            dispatch(action);
        }
    }

    // collection ref
    const collection_Ref = collection(db, collections);

    // add document
    const addDocument = async(document,image)=>{
        dispatch({type:"IS_PENDING"});
        try{
            
            const addedDocument = await addDoc(collection_Ref, document);

            // handle image
            if(image){
                console.log("enter");
                // convert filelist to array to user array method
                const image_arr = Array.from(image);
                // upload photo to storage firebase to get its photo URL
                image_arr.forEach(img=>{
                    // the image will store in question/question.id/image.name
                    const uploadPath = `question/${addedDocument.id}/${img.name}`;
                    const storageRef = ref(storage, uploadPath);

                    uploadBytes(storageRef, img)
                    .then((storageImg) =>{
                        // get image URL from storage
                        getDownloadURL(storageRef)
                        .then((imgURL)=>{
                            // update doc imgURL
                            updateDoc(doc(collection_Ref,addedDocument.id), {
                                question_image_url: arrayUnion(imgURL)
                            })
                            .then(()=>{
                                console.log(imgURL);

                            })
                            // updateDocument(doc.id,{
                            //     question_image_url: arrayUnion(imgURL)
                            // })
                            // updateDoc(doc(db,"questions",addedDoc.id),{
                            //     question_image_url: arrayUnion(imgURL)
                            // })
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
    const updateDocument= async(id,updates)=>{
        dispatch({type: "IS_PENDING"});

        try{
            const updatedoc = await updateDoc(doc(collection_Ref,id), updates);
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