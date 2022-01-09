import { useState, useEffect, useRef } from 'react';

export const useComponentVisible = (initialIsVisible) =>{
    const [isComponentVisible, setIsComponentVisible] = useState(initialIsVisible);
    const Comref = useRef(null);

    const handleClickOutside = (event) => {
        if (Comref.current && !Comref.current.contains(event.target)) {
            setIsComponentVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);

    return { Comref, isComponentVisible, setIsComponentVisible };
}