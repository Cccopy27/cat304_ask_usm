import {Link} from "react-router-dom";
import styles from "./QuestionList.module.css";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import ReactPaginate from 'react-paginate';
import { useState, useEffect } from "react";
import {BsCaretUp, BsCaretUpFill, BsCaretDown, BsCaretDownFill} from "react-icons/bs";
import {AiOutlineEye} from "react-icons/ai";

export default function QuestionList({questions, dashboardMode}) {

    // update view when user click in
    const Items=({questions})=>{
        return(
            <div className={styles.question_list}>
                
                {questions && questions.map(question => (
                    <Link className={styles.question_item}to={`/question/${question.id}`} key={question.id}>
                        <div className={styles.left_part}>
                            <div className={styles.left_part_up}>
                                <div className={styles.upVote}>
                                    <span className={styles.upVoteSpan}>
                                        {question.upVote} 
                                    </span>
                                    <BsCaretUp className={styles.arrowUp}/>
                                </div>
                                <div className={styles.downVote}>
                                    <span className={styles.downVoteSpan}>
                                        {question.downVote}  
                                    </span>
                                    <BsCaretDown className={styles.arrowDown}/>
                                </div>
                            </div>
                            <div className={styles.left_part_down}>
                                <span className={styles.view}>{question.view} View</span>
                                
                                {/* <AiOutlineEye className={styles.eye}/> */}
                            </div>
                        </div>
                        <div className={styles.right_part}>
                            <div className={styles.upper_part}>
                                <h4 className={styles.question_title}>
                                    {question.question_title}
                                </h4>
                                <div className={styles.question_up_right}>
                                    <span className={styles.question_span}> 
                                        added {formatDistanceToNow(question.added_at.toDate(),{addSuffix:true})}
                                    </span>
                                    <span className={styles.question_type}>
                                        {question.question_type}
                                    </span>
                                </div>
                                
                            </div>
                            <div className={styles.lower_part}>
                                <div className={styles.tag}>
                                    {question.question_tag.map(item=>(
                                        <span className={styles.tag_item}>{item}</span>
                                    ))}
                                </div>
                                
                            </div>
                            
                            
                        </div>
                    
                    </Link>
                ))}
            </div>

        )
    }

    const PaginatedItems = ({itemsPerPage}) => {
        const [currentItems, setCurrentItems] = useState(null);
        const [pageCount, setPageCount] = useState(0);
        const [itemOffset, setItemOffset] = useState(0);

        useEffect(() => {
            // Fetch items from another resources.
            const endOffset = itemOffset + itemsPerPage;
            setCurrentItems(questions.slice(itemOffset, endOffset));
            setPageCount(Math.ceil(questions.length / itemsPerPage));
        }, [itemOffset, itemsPerPage]);

        // Invoke when user click to request another page.
        const handlePageClick = (event) => {
            const newOffset = (event.selected * itemsPerPage) % questions.length;
            setItemOffset(newOffset);
        };

        return (
            <>
              <Items questions={currentItems} />
              {!dashboardMode && <ReactPaginate className={styles.paginateBar}
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
                }
            </>
        );
    }
    return (
        <>
            {questions.length === 0 && <p>No result...</p>}
            <PaginatedItems itemsPerPage={7} />    
        </>
    )
}
