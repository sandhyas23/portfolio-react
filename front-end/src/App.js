import React from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Switch,Route, Link,NavLink,Redirect } from 'react-router-dom';
import Child from './Child'
import navLinks from './data/navLinks';
import ReactModal from "react-modal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTrash,faPenSquare} from "@fortawesome/free-solid-svg-icons";
import { faLinkedin,faPinterest,faGithub } from '@fortawesome/free-brands-svg-icons';


export default class App extends React.Component{

  constructor(props){
    super(props);
    this.state={navLinks:navLinks,  showModal: false, itemName:"", subCategory:"", subCategoryLists:[],
        editSubCategory:false};

  }
  componentDidMount() {
    ReactModal.setAppElement('body');
  }

  login(){

  }


  handleOpenModal (str,nav,index) {
      if(nav === null && str === "addCategory"){
          this.setState({ showModal: true, edit:str, itemName:"", subCategoryLists:[], categoryIndex:-1 });
      }
      else{
          console.log(nav.subCategories);
          this.setState({ showModal: true, edit:str, itemName:nav.category, subCategoryLists:nav.subCategories,
          categoryIndex:index, items:nav.items});
      }

  }

  handleCloseModal () {
    this.setState({ showModal: false, itemName:"", subCategoryLists:[], editSubCategory:false });
  }

  addNewItem(){
      if(this.state.edit === "addCategory"){
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
      else if(this.state.edit === "editCategory"){
          let object = {category:this.state.itemName,path:`/${this.state.itemName}`, subCategories:this.state.subCategoryLists
              , items:this.state.items};
          this.state.navLinks.splice(this.state.categoryIndex,1,object);
          alert("Item edited");
          this.setState({navLinks:this.state.navLinks,showModal:false})
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
      //console.log(this.state.editSubCategory)
      if(this.state.editSubCategory === false){
          if(this.state.subCategory.length >0 && !this.state.subCategoryLists.includes(this.state.subCategory)){
              this.state.subCategoryLists.push(this.state.subCategory);
              this.setState({subCategoryLists: this.state.subCategoryLists});
          }
      }
      else{
          if(this.state.currentSubCategory.length >0 && !this.state.subCategoryLists.includes(this.state.currentSubCategory)){
              this.state.subCategoryLists.push(this.state.currentSubCategory);
              this.setState({subCategoryLists: this.state.subCategoryLists});
          }
      }

  }
  handleDeleteSubCategory(index,e){
      this.state.subCategoryLists.splice(index,1);
      this.setState({subCategoryLists:this.state.subCategoryLists});
  }

  handleEditSubCategory(index){
      let subCategory = this.state.subCategoryLists[index];
      this.setState({editSubCategory:true, indexToEdit:index, currentSubCategory:subCategory})
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
            <h1 style={{"textAlign":"center"}}>
                {this.state.edit === "addCategory" ? "Add a New Nav Item!" : "Edit a category"}
            </h1>
            <form>
              <label> Item Name: </label>
                <input name="itemName" value={this.state.itemName} onChange={(e)=>this.handleChange(e)} type={"text"} />
              <label>Add categories:</label>
                <input name="subCategory" value={this.state.subCategory} onChange={(e)=>this.handleChange(e)} type={"text"} />
            </form>
              <button onClick={()=>this.addSubCategories()} disabled={this.state.subCategory.length<=0}>Add this category</button>
              {this.state.subCategoryLists.length > 0 ?
                  <ul>
                      {console.log("aaa")}
                      {this.state.subCategoryLists.map((el, index, arry) => {
                          return <li key={`subView${el}${index}`}>
                              {this.state.editSubCategory && index === this.state.indexToEdit ?
                                  <input type={"text"} name={"currentSubCategory"} value={this.state.currentSubCategory}
                                         onChange={(e)=>this.handleChange(e)}/>
                                  :
                                  el
                              }
                              {/*<FontAwesomeIcon style={{"marginLeft":3}}*/}
                              {/*                 onClick={()=>this.handleEditSubCategory(index)} icon={faPenSquare} />*/}
                              <FontAwesomeIcon style={{"marginLeft":3}}
                                  onClick={()=>this.handleDeleteSubCategory(index)} icon={faTrash}/>
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
    console.log(this.state.navLinks);
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
                        {nav.category === "home" ? null :
                            <span>
                            <FontAwesomeIcon style={{"marginLeft": 3}}
                                             onClick={() => this.handleOpenModal("editCategory", nav,index)}
                                             icon={faPenSquare} size="1x"/>

                            <FontAwesomeIcon style={{"marginLeft":2}}
                            onClick ={()=>this.handleDeleteCategory(nav)} icon={faTrash} size="1x"/>
                            </span>
                        }
                    </li>
                  } )
                }
                <li>
                    <button  onClick={()=>this.handleOpenModal("addCategory",null)}>
                        Add Category
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
                {/*<Route path="*">*/}
                {/*    component={()=>(<Redirect to='/home'/>)}/>*/}
                {/*</Route>*/}
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











