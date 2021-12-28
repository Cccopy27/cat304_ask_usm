import { useReducer, useState,useEffect } from "react";
import {collection, addDoc, Timestamp,doc, deleteDoc,updateDoc} from "firebase/firestore";
import { db } from "../firebase/config";

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
    const ref = collection(db, collections);

    // add document
    const addDocument = async(doc)=>{
        dispatch({type:"IS_PENDING"});
        try{
            const createdAt = Timestamp.now();
            const addedDocument = await addDoc(ref, {...doc, createdAt});
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
            await deleteDoc(doc(ref,id));
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
            const updatedoc = await updateDoc(doc(ref,id), updates);
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