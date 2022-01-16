import styles from "./AdminDashboard.module.css"
import { NavLink } from "react-router-dom";
import { useFirestore } from "../hooks/useFirestore";
import { useCollection } from "../hooks/useCollection";
import Swal from "sweetalert2";
import { useState, useRef, useEffect } from "react";
import ReactPaginate from 'react-paginate';

export default function AdminDashboard() {
    const {document,error, loading:loadingForm} = useCollection(["contactForm"],null,["added_at","desc"]);
    const {document:reportDoc,error:reportDocError, loading:loadingReport} = useCollection(["report"],null,["added_at","desc"]);
    const {deleteDocument, response} = useFirestore(["contactForm"]);
    const {deleteDocument:deleteDocumentReport, response:responseReport} = useFirestore(["report"]);
    // const [loading, setLoading] = useState(false);

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
        Swal.fire({
            title: 'Are you sure?',
            showDenyButton: true,
            confirmButtonText: 'Yes',
            denyButtonText: `No`,
        }).then(async(result)=>{
            if(result.isConfirmed){
                Swal.fire({
                    title:"Now Loading...",
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                })
                Swal.showLoading();
                await deleteDocument(id)
                .then(()=>{
                    Swal.fire("Deleted!","","success");
                })
                .catch((err)=>{
                    console.log(err);
                    Swal.fire("Failed!","","success");
        
                });
            }
        })
        
    }

    const handleDeleteReport = (e,id) =>{
        e.preventDefault();
        Swal.fire({
            title: 'Are you sure?',
            showDenyButton: true,
            confirmButtonText: 'Yes',
            denyButtonText: `No`,
        }).then(async(result)=>{
            if(result.isConfirmed){
                Swal.fire({
                    title:"Now Loading...",
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                })
                Swal.showLoading();
                await deleteDocumentReport(id)
                    .then(()=>{
                        Swal.fire("Deleted!","","success");
                    })
                    .catch((err)=>{
                        console.log(err);
                        Swal.fire("Failed!","","success");

                    });
            }
        })

        
    }

    const Items =({currItem})=>{
        console.log(currItem);
        return(
            <>
            {mode === "Contact" && <div className={styles.result}>
            {currItem && currItem.map(doc=>(
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
            </div>
            }
            {mode === "Report" && <div className={styles.result}>
                {currItem && currItem.map(doc=>(
                    <div className={styles.singleContact}key={doc.id}>
                        <div className={styles.contactUp}>
                            <div className={styles.contactSubject}>Question: {doc.question}</div>
                            <div className={styles.contactMessage}>Problem: {doc.message}</div>
                        </div>
                        <div className={styles.contactdown}>
                            <div className={styles.contactName}>Report User: {doc.report_user_id}</div>
                            <div className={styles.contactEmail}>Time: { Date(doc.added_at.nanoseconds)}</div>
                        </div>
                        <div className={styles.contactDelete}>
                            <button className={styles.contactDelBtn} onClick={(e)=>handleDeleteReport(e,doc.id)}>delete</button>
                        </div>

                    </div>
                ))}
            </div>
            }
            </>
        )
    }

    const PaginatedItems = ({itemsPerPage}) => {
        const [currentItems, setCurrentItems] = useState(null);
        const [pageCount, setPageCount] = useState(0);
        const [itemOffset, setItemOffset] = useState(0);
        const currentDocument = mode === "Report" ? reportDoc : document;
        // useEffect(()=>{

        // })
        useEffect(() => {

            // Fetch items from another resources.
            const endOffset = itemOffset + itemsPerPage;
            setCurrentItems(currentDocument.slice(itemOffset, endOffset));
            setPageCount(Math.ceil(currentDocument.length / itemsPerPage));
        }, [itemOffset, itemsPerPage]);

        // Invoke when user click to request another page.
        const handlePageClick = (event) => {
            const newOffset = (event.selected * itemsPerPage) % currentDocument.length;
            setItemOffset(newOffset);
        };

        return (
            <>
              <Items currItem={currentItems} />
              <ReactPaginate className={styles.paginateBar}
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={2}
                marginPagesDisplayed={2}
                pageCount={pageCount}
                previousLabel="< previous"
                pageClassName={styles.page_item}
                pageLinkClassName={styles.page_link}
                previousClassName={styles.page_item}
                previousLinkClassName={styles.page_link}
                nextClassName={styles.page_item}
                nextLinkClassName={styles.page_link}
                breakLabel="..."
                breakClassName={styles.page_item}
                breakLinkClassName={styles.page_link}
                containerClassName={styles.pagination}                activeClassName={`${styles.active}`}                renderOnZeroPageCount={null}
              />
            </>
        );
    }

    return (
        <div className={styles.adminDashboard}>
            {!loadingForm && !loadingReport && <div className={styles.title}>
                    <button className={mode==="Contact"? `${styles.contact_btn} ${styles.active}`:styles.contact_btn} onClick={handleContactCLick} >Message</button>
                    <button className={mode==="Report"? `${styles.report_btn} ${styles.active}`:styles.report_btn} onClick={handleReportCLick} >Report</button>
            </div>}
            {loadingForm && loadingReport && <div>Loading</div>}
            {(reportDoc || document) && <PaginatedItems itemsPerPage={9} /> } 
            {(!reportDoc && !document) && <div>no document</div> }              
        </div>
    )
}
