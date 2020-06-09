// Portfolio
// Author: Sandhya Sankaran

import React from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Switch,Route, Link,NavLink,Redirect } from 'react-router-dom';
import Child from './Child'
import Contact from "./Contact";
import navLinks from './data/navLinks';
import ReactModal from "react-modal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { library } from "@fortawesome/fontawesome-svg-core"
import {faTrash,faPenSquare} from "@fortawesome/free-solid-svg-icons";
import img from "./data/default.jpg";
import message from './data/message.png'
library.add(fab);

const socialIcons= ["Linkedin","Pinterest","Facebook","Github","Twitter","Instagram"]
export default class App extends React.Component{

  constructor(props){
    super(props);
    this.state={navLinks:[],  showModal: false, itemName:"", subCategory:"", subCategoryLists:[],
        editSubCategory:false, role:"user", user:null,items:[],
        addedIcons:[], showSocialModal:false,link:"", social:socialIcons[0], location:window.location.pathname,
        showComment:false};

  }
  componentDidMount() {
      console.log("app mounted",window.location.href);
      let _this = this;
      fetch('/navLinks',{
          method: "GET",
          headers : {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
          }
      }).then(response => response.json()).then(function(data) {

          //console.log("this is what we got" +data);
          _this.setState({navLinks: data});

      });

      fetch('/navLinks/social',{
          method: "GET",
          headers : {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
          }
      }).then(response => response.json()).then(function(data) {

          //console.log("this is what we got from social" +data.icons[0].icon);
          _this.setState({addedIcons: data.icons});

      });

      fetch('/login/secret',{
          method: "GET",
          headers : {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
          }
      }).then(response => response.json()).then(function(data) {
          //console.log(data.success)
          if(data.success){
              let user = JSON.parse(data.User);
              //console.log("this is what we got from secret"+data.User );
              _this.setState({user: user, role:user.role});
          }

      });


      ReactModal.setAppElement('body');
  }

  login(){
      let _this = this;
      fetch('/login/auth/google/',{
          method: "GET",
          headers : {
               'Content-Type': 'application/json',
              'Accept': 'application/json'
          },

      }).then(response => response.json()).then(function(data) {

          //console.log("this is what we got" +data);
          _this.setState({user: data, role:data.role});

      });
  }


  handleOpenModal (str,nav,index) {


      //console.log(i);
      if(nav === null && str === "addCategory"){
          this.setState({ showModal: true, edit:str, itemName:"", subCategoryLists:[], categoryIndex:-1 });
      }
      else{
          let i = this.state.navLinks.findIndex((cat,ind,ar)=>{
              return cat.category === nav.category
          });
          //console.log(nav.items);
          this.setState({ showModal: true, edit:str, itemName:nav.category, subCategoryLists:nav.subCategories,
          categoryIndex:i, items:nav.items});
      }

  }

  handleCloseModal () {
    this.setState({ showModal: false, itemName:"", subCategoryLists:[], editSubCategory:false, showSocialModal:false, showComment:false });
  }

  addNewItem(){
      //console.log("index",this.state.categoryIndex);
      if(this.state.edit === "addCategory"){
          let navItem = this.state.navLinks.find((item,index,array)=>{
              return item.category === this.state.itemName;
          });

          if(navItem === undefined){
              let task = {category:this.state.itemName , path:`/${this.state.itemName}`, subCategories:this.state.subCategoryLists,
                  "items":[]};
              //console.log("task",task);
              let _this = this;
              fetch('/navlinks' , {
                  method: 'PUT',
                  headers: {
                      "Content-type": "application/json"
                  },
                  body: JSON.stringify(task)
              }).then( response => response.json()).then(data => {

                  if(!data.success){
                      alert(data.message);
                      _this.setState({user:null, role:"user", showModal:false})
                  }
                  else{
                      _this.state.navLinks.push({category:_this.state.itemName , path:`/${_this.state.itemName}`, subCategories:_this.state.subCategoryLists,
                          items:_this.state.items});
                      //console.log(this.state.navLinks);
                      alert("Item added");
                      _this.setState({navLinks:_this.state.navLinks,showModal:false});
                  }
              })
          }
          else{
              alert("Item already exists");
          }
      }
      else if(this.state.edit === "editCategory"){
          let object = {category:this.state.itemName,path:`/${this.state.itemName}`, subCategories:this.state.subCategoryLists
              , items:this.state.items};
          let _this = this;
          fetch('/navlinks' , {
              method: 'PUT',
              headers: {
                  "Content-type": "application/json"
              },
              body: JSON.stringify(object)
          }).then( response => response.json()).then( data =>{
              if(!data.success){
                  alert(data.message);
                  _this.setState({user:null, role:"user", showModal:false})
              }
              else{
                  _this.state.navLinks.splice(_this.state.categoryIndex,1,object);
                  alert("Item edited");
                  _this.setState({navLinks:_this.state.navLinks,showModal:false})
              }

          })


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

  handleDeleteCategory(nav){
      let _this = this;
      if(window.confirm("Are you sure")){
          fetch(`/navlinks/${nav.category}` , {
              method: 'DELETE',
              headers: {
                  "Content-type": "application/json"
              },
          }).then( response => response.json()).then(data => {
              if(!data.success){
                  alert(data.message);
                  _this.setState({role:"user", user:null})
              }
              else{
                  let itemIndex = _this.state.navLinks.findIndex((el,index,array)=>{
                      return el.category === nav.category;
                  })
                  _this.state.navLinks.splice(itemIndex,1);
                  //_this.state.navLinks.push({category:_this.state.itemName , path:`/${_this.state.itemName}`, subCategories:_this.state.subCategoryLists});
                  //console.log(this.state.navLinks);
                  alert("Item deleted");
                  _this.setState({navLinks:_this.state.navLinks});
              }
          });
      }

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

    handleSocial(){
      this.setState({showSocialModal:true},
          // ()=>{
          //     console.log(this.state.showSocialModal);
          //     this.showModal()
          //}
          );


    }

    showSocialModal(){
      //console.log("Im shown");
        return <ReactModal
            isOpen={this.state.showSocialModal}
            contentLabel="onRequestClose Example"
            onRequestClose={()=>this.handleCloseModal()}
            className="Modal"
            overlayClassName="Overlay"
        >
            <h1>Add social icons</h1>
            <form>
            <label>Choose Social Icon</label>
            <select name={"social"} value={this.state.social} onChange={(e)=>this.handleChange(e)}>
                {
                    socialIcons.map((icon,index,array)=>{
                        return <option key={`social${icon}${index}`}>
                            {icon}
                        </option>
                    })

                }
            </select>
            <label>Link</label>
            <input type={'text'} name={'link'} value={this.state.link} onChange={(e)=>this.handleChange(e)}/>
            </form>
            <button onClick={()=>this.addIcons()}>Add Social icon</button>
            <br/>

            {this.state.addedIcons.length > 0 ?
                <ul>
                    {this.state.addedIcons.map((el, index, arry) => {
                        return <li key={`iconadded${el.icon}${index}`}>
                            {el.icon}
                            <FontAwesomeIcon style={{"marginLeft":3}}
                                             onClick={()=>this.handleDeleteIcon(index)} icon={faTrash}/>
                        </li>
                    })}
                </ul>
                :
                null
            }

            <button onClick={()=>this.addAllIcons()}>Add All</button>


        </ReactModal>
    }

    addIcons(){
      if(this.state.addedIcons.find((el,index,ar)=>{
          return el.icon === this.state.social
      }) === undefined){
          this.state.addedIcons.push({icon:this.state.social, link:this.state.link});
          this.setState({addedIcons:this.state.addedIcons});
      }
      else{
          alert("Item already exists");
      }
    }


    handleDeleteIcon(index){
      this.state.addedIcons.splice(index,1);
      this.setState({addedIcons:this.state.addedIcons});

    }

    addAllIcons(){
      let object = {googleId:this.state.user.googleId,icons:this.state.addedIcons}
      const _this = this;
      fetch('/navlinks/social',{
          method: 'PUT',
          headers: {
              "Content-type": "application/json",
              "Headers":"application/json"
          },
          body:JSON.stringify(object),
      }).then((response)=> response.json()).then(data =>{
          if(!data.success){
              alert("Login");
          }
          else{
              _this.setState({addedIcons:this.state.addedIcons});
              //console.log(data.social);
          }
      })
    }

    handleDeleteSocialIcon(element){

      if(window.confirm("Are you sure?")){
          let filteredIcons = this.state.addedIcons.filter((el,index,ar)=>{
              return el.icon !== element.icon
          })
          //console.log("fil",filteredIcons, this.state.addedIcons);
          let object = {googleId:this.state.user.googleId,icons:filteredIcons}

          const _this = this;
          fetch('/navlinks/social',{
              method: 'PUT',
              headers: {
                  "Content-type": "application/json",
                  "Headers":"application/json"
              },
              body:JSON.stringify(object),
          }).then((response)=> response.json()).then(data =>{
              if(!data.success){
                  alert("Login");
              }
              else{
                  _this.setState({addedIcons:filteredIcons})
                  //console.log(data.social);
              }
          })
      }

    }


    changeLocation(){
      this.setState({location:window.location.pathname})
    }



  render(){
   // console.log("uri in app",window.location);
    return(
        <Router>
          <div className={"grid-container "}>
            <div className={""}>
            <nav className={"header"}>
              <ul className={"nav"}>
                {
                        this.state.navLinks.find((cat, i, ar) => {
                            return cat.category === "home"
                        }) !== undefined ?
                            <li key={`navhome`}>
                                <NavLink className={"links"} exact to={'/home'} activeStyle={{ color: 'lightseagreen' }}>Home
                                </NavLink>
                            </li>
                            :
                            null
                    }


                  {
                      this.state.navLinks.filter((category,index,array)=>{
                          return category.category !== "home"
                      }).map((nav,index,array) =>{
                    return <li key={`nav${nav.category}${index}`}>
                    <NavLink className={"links"} exact to={nav.path} activeStyle={{ color: 'lightseagreen' }}>{nav.category[0].toUpperCase() + nav.category.slice(1)}
                    </NavLink>
                        {nav.category === "home" ? null :
                                this.state.role === "admin" ? <span>
                            <FontAwesomeIcon style={{"marginLeft": 3}}
                                             onClick={() => this.handleOpenModal("editCategory", nav,index)}
                                             icon={faPenSquare} size="1x"/>

                            <FontAwesomeIcon style={{"marginLeft":2}}
                            onClick ={()=>this.handleDeleteCategory(nav)} icon={faTrash} size="1x"/>
                            </span>
                                        :
                                    null
                        }
                    </li>
                  } )
                }
                  {this.state.role === "admin" ?
                      <li>
                          <button  onClick={()=>this.handleOpenModal("addCategory",null)}
                          style={{fontSize: 15}}>
                              Add Category
                          </button>
                      </li>
                      :
                      null
                  }

                  {this.state.user === null ?
                      <li className={"login links"}>
                          <a href={`http://sandhyasankaran.com/login/auth/google/?returnTo=${this.state.location}`}>Login</a>
                      </li> :
                      <li className={"login "}>
                          <img
                              className="mr-3 bg-light loginImage"
                              width="30"
                              height="30"
                              src={this.state.user.image}
                              alt={this.state.user.displayName}
                          />
                          {`Welcome, ${this.state.user.displayName} `}

                      <a href={"http://sandhyasankaran.com/login/logout"}>Logout</a>
                      </li>
                  }

              </ul>
            </nav>

                <main className={"main content-wrap"}>
              {this.AddLink()}
              {this.showSocialModal()}
              <Switch>
                  <Route exact path='/' component={()=>(<Redirect to='/home'/>)}/>
                  <Route path="/:id" render={(props) => <Child {...props} navLinks={this.state.navLinks}
                                                           role={this.state.role} user={this.state.user}
                                                           changeLocation={()=>this.changeLocation()}
                                                           currentLocation={this.state.location}/>
                  }
                  />
              </Switch>
                    {this.state.showComment ? <Contact showComment={this.state.showComment} closeModal={()=>this.handleCloseModal()}/> :null}

            </main>

            <footer className={"footer"}>
                <img className={"lmessage"} src={message} onClick={()=>this.setState({showComment:!this.state.showComment})}/>

                <div className="container">

                    <ul className="footerIcons">
                        {this.state.addedIcons.length >0 ?
                          this.state.addedIcons.map((element,index,array)=>{
                             return  <li key={`displayicon${element.icon}${index}`}
                                 className="icons" >
                                    <a href={element.link} target="_blank">
                                 <FontAwesomeIcon icon= {["fab",`${element.icon.toLowerCase()}`]}
                                                      size="2x"
                                                      color={element.icon === "Pinterest"? "red":
                                                      element.icon === "Github" ? "black" :"steelblue"}/>
                                    </a>

                                     {
                                         this.state.role === "admin" ?
                                             <FontAwesomeIcon style={{"marginLeft":3}}
                                                              onClick={()=>this.handleDeleteSocialIcon(element)} icon={faTrash} color={"black"}/>
                                                              :
                                             null

                                     }


                              </li>
                          }) :
                            null
                        }

                        {this.state.role === "admin" ?
                            <li>
                                <button style={{fontSize: 15, marginTop:15}}
                                        onClick={()=>this.handleSocial()}> Add Social icon</button>
                            </li>
                            :
                            null
                        }

                    </ul>

                </div>


                <div>
                    <span>
                        © 2020 Copyright: Sandhya Sankaran
                    </span>

                </div>


            </footer>

            </div>
          </div>
        </Router>
    );
  }
}











