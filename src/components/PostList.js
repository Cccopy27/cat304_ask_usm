import {Link} from "react-router-dom";
import styles from "./PostList.module.css";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import ReactPaginate from 'react-paginate';
import { useState, useEffect } from "react";
import {BsCaretUp, BsCaretUpFill, BsCaretDown, BsCaretDownFill} from "react-icons/bs";
import {AiOutlineEye} from "react-icons/ai";

export default function PostList({posts, dashboardMode}) {

    // update view when user click in
    const Items=({posts})=>{
        return(
            <div className={styles.post_list}>
                
                {posts && posts.map(post => (
                    <Link className={styles.post_item}to={`/post/${post.id}`} key={post.id}>
                        <div className={styles.left_part}>
                            <div className={styles.left_part_up}>
                                <div className={styles.upVote}>
                                    <span className={styles.upVoteSpan}>
                                        {post.upVote} 
                                    </span>
                                    <BsCaretUp className={styles.arrowUp}/>
                                </div>
                                <div className={styles.downVote}>
                                    <span className={styles.downVoteSpan}>
                                        {post.downVote}  
                                    </span>
                                    <BsCaretDown className={styles.arrowDown}/>
                                </div>
                            </div>
                            <div className={styles.left_part_down}>
                                <span className={styles.view}>{post.view} View</span>
                                
                                {/* <AiOutlineEye className={styles.eye}/> */}
                            </div>
                        </div>
                        <div className={styles.right_part}>
                            <div className={styles.upper_part}>
                                <h4 className={styles.post_title}>
                                    {post.post_title}
                                </h4>
                                <div className={styles.post_up_right}>
                                    <span className={styles.post_span}> 
                                        added {formatDistanceToNow(post.added_at.toDate(),{addSuffix:true})}
                                    </span>
                                    <span className={styles.post_type}>
                                        {post.post_type}
                                    </span>
                                </div>
                                
                            </div>
                            <div className={styles.lower_part}>
                                <div className={styles.tag}>
                                    {post.post_tag.map(item=>(
                                        <span key={item}className={styles.tag_item}>{item}</span>
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
            setCurrentItems(posts.slice(itemOffset, endOffset));
            setPageCount(Math.ceil(posts.length / itemsPerPage));
        }, [itemOffset, itemsPerPage]);

        // Invoke when user click to request another page.
        const handlePageClick = (event) => {
            const newOffset = (event.selected * itemsPerPage) % posts.length;
            setItemOffset(newOffset);
        };

        return (
            <>
              <Items posts={currentItems} />
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
            {posts.length === 0 && <p>No result...</p>}
            <PaginatedItems itemsPerPage={7} />    
        </>
    )
}
