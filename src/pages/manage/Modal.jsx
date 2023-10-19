function Modal({isOpen, children, closeModal}){
    return(
        <div style={{display:isOpen ? "block":"none"}}>
            <div className="modal-bg" ></div>
            <div className="modal-content" >
                <button onClick={closeModal} style={{float:"right"}}>X</button>
                <div>{children}</div>
            </div>
        </div>
    )
}

export default Modal;