// Portfolio
// Author: Sandhya Sankaran

import React from 'react';
import ReactModal from "react-modal";
import * as emailjs from 'emailjs-com'

export default class Contact extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            website: '',
            message: '',
        }

    }
    handleSubmit(e) {
        e.preventDefault()
        const { name, email, website, message } = this.state
        let templateParams = {
            from_name: name,
            to_name: 'svsandhya23@gmail.com',
            from_email:email,
            website: website,
            message_html: message,
        }
        emailjs.send(
            'gmail',
            'template_tou806bX',
            templateParams,
            'user_xqqsPrqFB7QUDuWNcu1Zr'
        )
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
            }, function(err) {
                console.log('FAILED...', err);
            });
        this.resetForm()
    }
    resetForm() {
        this.setState({
            name: '',
            email: '',
            website: '',
            message: '',
        })
    }
    handleChange(e){
        let target = e.target;
        let name = target.name;
        let value = target.value;

        this.setState({
            [name]: value
        });
    }



    componentDidMount() {
        ReactModal.setAppElement('body');
    }


    handleCloseModal(){
        this.props.closeModal()
    }



    render() {
        return(
            <ReactModal
                isOpen={this.props.showComment}
                contentLabel="onRequestClose Example"
                onRequestClose={()=>this.handleCloseModal()}
                className="ContactModal"
                overlayClassName="ContactOverlay"
            >
                <div className={"messageHeader"}>
                    <h2>Contact us
                        <button style={{float:"right",fontSize:30,borderRadius:10}} onClick={()=>this.handleCloseModal()}>X</button>
                    </h2>
                </div>

                <div className={"contactDiv"}>Let us know how we can help!
                    <form className="contact-form" onSubmit={()=>this.handleSubmit()}>
                        <div className={"contactRow"}>
                            <div className={"col-75"}>
                                <input type="text" className="form-group contactInput"
                                       name='name' value={this.state.name} onChange={(e)=>this.handleChange(e)}
                                       placeholder={"Name"}/>
                            </div>
                        </div>
                        <div className={"contactRow"}>
                            <div className={"col-75"}>
                                <input type="text" className="form-group contactInput"
                                       placeholder={"Email*"}
                                       name='email' value={this.state.email}onChange={(e)=>this.handleChange(e)}/>
                            </div>
                        </div>

                        <div className={"contactRow"}>
                            <div className={"col-75"}>
                                <input type="text" className="form-group contactInput"
                                       placeholder={"Website"}
                                       name='website' value={this.state.website} onChange={(e)=>this.handleChange(e)}/>
                            </div>
                        </div>

                        <div className={"contactRow"}>
                            <div className={"col-75"}>
                    <textarea className="form-group contactInput contactTextArea" rows="5"
                              placeholder={"How can we help?"}
                              name='message' value={this.state.message} onChange={(e)=>this.handleChange(e)}/>
                            </div>
                        </div>
                        <div className={"contactRow"}>
                            <button className="contactSubmit" onClick={(e)=>this.handleSubmit(e)}
                                    disabled={this.state.email=== ""}>Submit</button>
                        </div>
                    </form>
                </div>
            </ReactModal>
        )
    }
}