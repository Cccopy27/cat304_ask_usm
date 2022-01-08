import styles from "./AdminDashboard.module.css"
import { NavLink } from "react-router-dom";
import { useFirestore } from "../hooks/useFirestore";
import { useCollection } from "../hooks/useCollection";
import Swal from "sweetalert2";
import { useState, useRef } from "react";
export default function AdminDashboard() {
    const {document,error} = useCollection(["contactForm"],null,["added_at","desc"]);
    const {deleteDocument, response} = useFirestore(["contactForm"]);
    const [mode, setMode] = useState("Contact");


    const handleContactCLick = (e) =>{
        e.preventDefault();
        setMode("Contact");
    }

    const handleReportCLick = (e) =>{
        e.preventDefault();
        setMode("Report");
    }

    const handleDeleteContact = (e,id) =>{
        e.preventDefault();
        deleteDocument(id)
        .then(()=>{
            Swal.fire("Deleted!","","success");
        })
        .catch((err)=>{
            console.log(err);
            Swal.fire("Failed!","","success");

        });
    }


    return (
        <div className={styles.adminDashboard}>
            <div className={styles.title}>
                    <button className={mode==="Contact"? `${styles.contact_btn} ${styles.active}`:styles.contact_btn} onClick={handleContactCLick} >Message</button>
                    <button className={mode==="Report"? `${styles.report_btn} ${styles.active}`:styles.report_btn} onClick={handleReportCLick} >Report</button>
            </div>
            {mode === "Contact" && <div className={styles.result}>
                {document && document.map(doc=>(
                    <div className={styles.singleContact}key={doc.id}>
                        <div className={styles.contactUp}>
                            <div className={styles.contactSubject}>Subject: {doc.subject}</div>
                            <div className={styles.contactMessage}>Message: {doc.message}</div>
                        </div>
                        <div className={styles.contactdown}>
                            <div className={styles.contactName}>Name: {doc.name}</div>
                            <div className={styles.contactEmail}>Email: {doc.email}</div>
                        </div>
                        <div className={styles.contactDelete}>
                            <button className={styles.contactDelBtn} onClick={(e)=>handleDeleteContact(e,doc.id)}>delete</button>
                        </div>

                    </div>
                ))}
                {!document && <div>no document</div>}
            </div>
            }
            {mode === "Report" && <div className={styles.result}>
                {/* {document && document.map(doc=>(
                    <div className={styles.singleContact}key={doc.id}>
                        <div className={styles.contactUp}>
                            <div className={styles.contactSubject}>Subject: {doc.subject}</div>
                            <div className={styles.contactMessage}>Message: {doc.message}</div>
                        </div>
                        <div className={styles.contactdown}>
                            <div className={styles.contactName}>Name: {doc.name}</div>
                            <div className={styles.contactEmail}>Email: {doc.email}</div>
                        </div>
                        <div className={styles.contactDelete}>
                            <button className={styles.contactDelBtn} onClick={(e)=>handleDeleteContact(e,doc.id)}>delete</button>
                        </div>

                    </div>
                ))} */}
                {!document && <div>no document</div>}
            </div>
            }
        </div>
    )
}
