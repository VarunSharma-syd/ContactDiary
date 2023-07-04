import React, {useContext, useRef, useEffect} from 'react'
import ContactContext from '../../context/contact/contactContext'

function ContactFilter() {

    const contactContext = useContext(ContactContext);

    const { filteredContact, clearFilter, filtered } = contactContext;

    const text = useRef('');

    useEffect(()=> {
        if(filtered === null) {
            text.current.value = '';
        }
    })

    const onChange = e => {
        if(text.current.value !== ''){
            filteredContact(e.target.value);
        } else {
            clearFilter();
        }
    }

  return (
    <form>
        <input type="text" ref={text} placeholder="Filtered Contacts..." onChange={onChange} />
    </form>
  )
}

export default ContactFilter