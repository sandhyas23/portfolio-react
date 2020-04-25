import React from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Switch,Route, Link,NavLink,Redirect } from 'react-router-dom';
import Child from './Child'
import navLinks from './data/navLinks';
import ReactModal from "react-modal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin,faPinterest,faGithub } from '@fortawesome/free-brands-svg-icons';


export default class App extends React.Component{

  constructor(props){
    super(props);
    this.state={navLinks:navLinks,  showModal: false, itemName:"", subCategory:"", subCategoryLists:[]};

  }
  componentDidMount() {
    ReactModal.setAppElement('body');
  }

  login(){

  }


  handleOpenModal () {
    this.setState({ showModal: true });
  }

  handleCloseModal () {
    this.setState({ showModal: false });
  }

  addNewItem(){
    let navItem = this.state.navLinks.find((item,index,array)=>{
      return item.category === this.state.itemName;
    });

    if(navItem === undefined){
      this.state.navLinks.push({category:this.state.itemName , path:`/${this.state.itemName}`, subCategories:this.state.subCategoryLists});
      //console.log(this.state.navLinks);
      alert("Item added");
      this.setState({navLinks:this.state.navLinks,showModal:false});
    }
    else{
      alert("Item already exists");
    }

  }

  handleChange(e){
     let target = e.target;
     let name = target.name;
     let value = target.value;

     this.setState({
       [name]: value
     });
  }
  addSubCategories(){
      if(this.state.subCategory.length >0){
          this.state.subCategoryLists.push(this.state.subCategory);
          this.setState({subCategoryLists: this.state.subCategoryLists});
      }
  }
  handleDeleteSubCategory(index,e){
      this.state.subCategoryLists.splice(index,1);
      this.setState({subCategoryLists:this.state.subCategoryLists});
  }
  AddLink() {
    return (
        <div>
          {/*<button onClick={()=>this.handleOpenModal()}>Trigger Modal</button>*/}
          <ReactModal
              isOpen={this.state.showModal}
              contentLabel="onRequestClose Example"
              onRequestClose={()=>this.handleCloseModal()}
              className="Modal"
              overlayClassName="Overlay"
          >
            <h1 style={{"textAlign":"center"}}>Add a New Nav Item!</h1>
            <form>
              <label> Item Name: </label>
                <input name="itemName" value={this.state.itemName} onChange={(e)=>this.handleChange(e)} type={"text"} />
              <label>Add categories:</label>
                <input name="subCategory" value={this.state.subCategory} onChange={(e)=>this.handleChange(e)} type={"text"} />
            </form>
              <button onClick={()=>this.addSubCategories()}>Add this category</button>
              {this.state.subCategoryLists.length > 0 ?
                  <ul>
                      {this.state.subCategoryLists.map((el, index, arry) => {
                          return <li key={`subView${el}${index}`}>
                              {el} <button onClick={()=>this.handleDeleteSubCategory(index)}>X</button>
                          </li>
                      })}
                  </ul>
                  :
                  null
              }
              <button onClick={()=> this.addNewItem()} disabled={this.state.itemName==="" || this.state.subCategoryLists.length<=0}>
                  Add </button>
            <button onClick={()=>this.handleCloseModal()}>Close</button>
          </ReactModal>
        </div>
    );

  }



  render(){
    //console.log(this.state);
    return(
        <Router>
          <div className={"grid-container page-container"}>
            <div className={"content-wrap"}>
            <nav className={"header"}>
              <ul className={"nav"}>
                {
                  this.state.navLinks.map((nav,index,array) =>{
                    return <li key={`nav${nav.category}${index}`}>
                    <NavLink exact to={nav.path} activeClassName="selected">{nav.category[0].toUpperCase() + nav.category.slice(1)}
                    </NavLink>
                    </li>
                  } )
                }
                <li>
                  <button  onClick={()=>this.handleOpenModal()}>
                   Add topic
                  </button>
                </li>

                <li className={"login"} onClick={()=>this.login()}>
                  <Link to={"/login"}>Login</Link>
                </li>
              </ul>
            </nav>

            <main className={"main"}>
              {this.AddLink()}
            </main>

            <Switch>
              <Route exact path='/'
                     component={()=>(<Redirect to='/home'/>)}/>
              <Route path="/:id" component={Child} />
            </Switch>

            <footer className={"footer"}>
                <div className="container">

                    <ul className="footerIcons">
                        <li className="icons" >
                                <FontAwesomeIcon icon={faGithub} size="2x" color={"black"}/>
                        </li>
                        <li className="icons">
                            <FontAwesomeIcon icon={faLinkedin} size="2x" color={"steelblue"}/>
                        </li>

                        <li className="icons">
                            <FontAwesomeIcon icon={faPinterest} size="2x" color={"red"}/>
                        </li>
                    </ul>
                </div>


                <div className="footer-copyright text-center py-3">© 2020 Copyright:
                     Sandhya Sankaran
                </div>

            </footer>

            </div>
          </div>
        </Router>
    );
  }
}











