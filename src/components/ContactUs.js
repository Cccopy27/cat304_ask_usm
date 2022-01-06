import styles from "./ContactUs.module.css"
import { useRef, useState } from "react"
import Swal from "sweetalert2";
import { useFirestore } from "../hooks/useFirestore";

export default function ContactUs() {
    const formRef = useRef();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const {addDocument,response} = useFirestore(["contactForm"])

    const handleSubmit = (e) =>{
        e.preventDefault();
        if(formRef.current.checkValidity()){
            Swal.fire({
                title: 'Are you sure?',
                showDenyButton: true,
                confirmButtonText: 'Yes',
                denyButtonText: `No`,
              }).then(async(result) => {
                  if(result.isConfirmed){
                      setLoading(true);
                    Swal.fire({
                        title:"Now Loading...",
                        allowEscapeKey: false,
                        allowOutsideClick: false,
                    })
                    Swal.showLoading();

                    const contactObj={
                        name,
                        email,
                        subject,
                        message
                    }

                    await addDocument(contactObj);

                    if(!response.error){
                        setName("");
                        setEmail("");
                        setSubject("");
                        setMessage("");
                        Swal.fire('Uploaded!', '', 'success');
                        setLoading(false);

                    }else{
                        console.log(response.error);
                        Swal.fire({
                            icon:"error",
                            title:"Something wrong",
                            showConfirmButton: true,
                        })
                    }

                  }
              })
        }else{
            Swal.fire({
                title:"Make sure the form is completed!",
                showConfirmButton: true,
            })
        }
    }
    return (
        <div className={styles.contact_us_container}>
            <div className={styles.contact_form_container}>
                <div className={styles.contact_form_header}>
                    <p className={styles.add_contact_title_header}>Need help? Contact us</p>
                </div>
                <form className={styles.add_contact_form} ref={formRef}>
                    <div className={styles.add_form_name_email}>
                        <label className={styles.add_form_name}>
                            <span className={styles.span_title}>Full Name:</span>
                            <input
                            required
                            // ref={titleRef}
                            type="text"
                            className={`${styles.input_style} ${styles.add_name_input}`}
                            onChange={e => {setName(e.target.value)}}
                            value={name}
                            placeholder="Name"
                            />
                        </label>

                        <label className={styles.add_form_email}>
                            <span className={styles.span_title}>Email: </span>
                            <input
                            required
                            // ref={titleRef}
                            type="email"
                            className={`${styles.input_style} ${styles.add_email_input}`}
                            onChange={e => {setEmail(e.target.value)}}
                            value={email}
                            placeholder="Email"
                            />
                        </label>
                    </div>
                    

                    <label className={styles.add_form_subject}>
                        <span className={styles.span_title}>Subject: </span>
                        <input
                        required
                        // ref={titleRef}
                        type="text"
                        className={`${styles.input_style} ${styles.add_subject_input}`}
                        onChange={e => {setSubject(e.target.value)}}
                        value={subject}
                        placeholder="Subject"
                        />
                    </label>

                    <label className={styles.add_form_message}>
                        <span className={styles.span_title}>Message:</span>
                        <textarea 
                        className={`${styles.add_message_input} ${styles.input_style}`}
                        required
                        onChange={e => {setMessage(e.target.value)}}
                        value={message}
                        placeholder="Message"
                        />
                    </label>

                    {!loading && <button className={styles.submit_btn} onClick={handleSubmit}>Send Message</button>}
                    {loading && <button className={styles.submit_btn}disabled>Loading</button>}
                </form>
            </div>
        </div>
    )
}
