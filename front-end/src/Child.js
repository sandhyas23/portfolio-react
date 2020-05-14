import React from 'react';
import ReactCommonmark from 'react-commonmark';
import {BrowserRouter as Router, Switch,Route, Link,NavLink,Redirect,useLocation } from 'react-router-dom';
import Prism from 'prismjs';
import 'prismjs/themes/prism-coy.css';
//import aboutMe from './data/aboutme';
//import outline from './data/outline';
import img from './data/default.jpg';
import navLinks from './data/navLinks';
import ReactModal from "react-modal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faThumbsUp} from "@fortawesome/free-solid-svg-icons";
// /static/media/testhh.5b0b62bf.jpg


export default class Child extends React.Component{

  constructor(props){
      super(props);
      this.state ={id: props.match.params.id, aboutMe:"", fileName:"", showModal:false,
      navLinks:props.navLinks, subCategory:"", articleName:"", content:"", edit:"",
      viewArticle:true, imageFile:null, liked:false,likeCount:0, role:props.role,
      comments:[], comment:"", likes:[], allData:[]}
  }

  componentDidMount() {
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
      fetch('/navlinks/aboutMe' , {
          method: 'GET',
          headers: {
              "Content-type": "application/json",
              'Accept': 'application/json'
          },
      }).then( response=> response.json()).then(function (data) {

          //console.log("about" +data);
          _this.setState({aboutMe: data});

      });

      fetch(`/comments/${this.state.id}`, {
          method:'GET',
          headers: {
              "Content-type": "application/json"
          },
      }).then(response => response.json()).then(data =>{
          if(data !== undefined){
              _this.setState({allData:data.commentsAndLikes})
          }
          else{
              _this.setState({allData:[]})
          }

      })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
      let _this = this;
      fetch(`/comments/${this.state.id}`, {
          method:'GET',
          headers: {
              "Content-type": "application/json"
          },
      }).then(response => response.json()).then(data =>{
          if(data !== undefined){
              _this.setState({allData:data.commentsAndLikes})
          }
          else{
              _this.setState({allData:[]})
          }

      })
  }

  static getDerivedStateFromProps(props,state) {
      if (props.match.params.id === state.id) {
          return null;
      }
      return {
          id: props.match.params.id, fileName: "", showModal: false,
          navLinks: props.navLinks, subCategory: "", articleName: "", content: "", edit: "",
          viewArticle: false, imageFile:null,liked:false,likeCount:0,role:props.role,
          comments:[], comment:"", likes:[]
      };
  }

  handleChange(e){
      let target = e.target;
      let name = target.name;
      let value = target.value;

      this.setState({
          [name]: value
      });
  }

  handleFile(e){
      let name = e.target.name;
      let reader = new FileReader();
      let file = e.target.files[0];

      if (e.target.value.length !== 0) {

          reader.onloadend = async (e) => {
              // The file's text will be printed here
              if(name === "aboutMe"){
                  //console.log("in if abput me");
                  let object = {category:"home",aboutMe:e.target.result, path:"/home"}
                  let _this = this;
                  fetch('/navlinks/aboutMe' , {
                      method: 'PUT',
                      headers: {
                          "Content-type": "application/json",
                          'Accept': 'application/json'
                      },
                      body: JSON.stringify(object)
                  }).then(response => response.json()).then(data => {
                      if(!data.success){
                          alert(data.message);
                          _this.setState({role:"user"});
                      }
                      else{
                          _this.setState({aboutMe: e.target.result, fileName: file.name});
                      }
                  })


              }
              else{
                   this.setState({[name]: e.target.result, fileName: file.name});
              }
          };

          reader.readAsText(file);
      }
      else{
          this.setState({[name]: this.state[name], fileName: this.state.fileName});
      }

  }


    handleOpenModal (str, article) {
      if(article === undefined){
          this.setState({ showModal: true, edit:str, articleName:"",
              subCategory:"", content:"", articleIndex: -1});
      }
      else{
          let articleIndex = this.state.navLinks.find((item,index,array)=>{
              return item.category === this.state.id;
          }).items.findIndex((el,index,array)=>{
              return el.item === article.item;
          })
          this.setState({ showModal: true, edit:str, articleName:article.item,
              subCategory:article["sub-category"], content:article.content, articleIndex:articleIndex,
              toBeChangedArticleName:article.item});
      }
    }

    handleCloseModal () {
        this.setState({ showModal: false });
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
                        {this.state.edit === "add" ?"Add new item" : "Edit item"}
                    </h1>
                    <form>
                        <label> Article Name: </label>
                        <input name="articleName" value={this.state.articleName} onChange={(e)=>this.handleChange(e)} type={"text"} /><br/>
                        <label>Category: </label>
                        <select name="subCategory" value={this.state.subCategory} onChange={(e)=>this.handleChange(e)}>
                            {
                                this.state.navLinks.find((el,index,array)=>{
                                    return el.category === this.state.id
                                }).subCategories.map((sub,index,array)=>{
                                   return <option key ={`subcat${sub}${index}`}>
                                       {sub}
                                    </option>
                                })
                            }
                        </select><br/>
                        <label>Attach content:</label>
                        <input type={"file"} accept={".md"} className={"file"} name={"content"} onChange={ (e) => this.handleFile(e) }/>
                        <br/>

                    </form><button onClick={()=> this.addNewItem()}> Add the article </button>

                    <button onClick={()=>this.handleCloseModal()}>Close</button>
                </ReactModal>
            </div>
        );

    }

    addNewItem(){
       // console.log(this.state.nav);
        let categoryArrayIndex  = this.state.navLinks.findIndex((item,index,array)=> {
            return item.category === this.state.id;
        });


        if(this.state.edit === "add"){
            if(this.state.navLinks.find((el,index,ar)=>{
                return el.category === this.state.id
            }).items.find((ele,ind,array)=>{
                return ele.item === this.state.articleName
            }) === undefined){
                let itemObject = {item:this.state.articleName, "sub-category": this.state.subCategory,
                    content:this.state.content,uploadedOn:new Date().toISOString(),
                    image:false,
                    path:`/${this.state.id}/${this.state.articleName.replace(/\s/g, '')}`};

                let navItem =  this.state.navLinks.find((el,index,array)=>{
                    return el.category === this.state.id
                })

                //console.log(navItem.items);

                navItem.items.push(itemObject)


                let object = {category:navItem.category,path:navItem.path, subCategories:navItem.subCategories
                    , items:navItem.items};

                let _this = this;
                fetch('/navlinks' , {
                    method: 'PUT',
                    headers: {
                        "Content-type": "application/json",
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(object)
                }).then(response => response.json()).then(data => {
                    if(!data.success){
                        alert(data.message);
                        _this.setState({role:"user"})
                    }
                    else{
                        alert("Article added");
                        _this.setState({navLinks:_this.state.navLinks,showModal:false});
                    }
                });

            }

            else{
                alert("Article name already exists");
            }

        }

        else if(this.state.edit === "edit") {
            // if(this.state.navLinks.find((el,index,ar)=>{
            //     return el.category === this.state.id
            // }).items.find((ele,ind,array)=>{
            //     return ele.item === this.state.articleName
            // }) === undefined) {
            let navItem = this.state.navLinks.find((el, index, array) => {
                return el.category === this.state.id
            });

            let indexOfArticle = navItem.items.findIndex((el, index, arry) => {
                return el.item === this.state.toBeChangedArticleName
            });

            let itemObject = {
                    item: this.state.articleName, "sub-category": this.state.subCategory,
                    content: this.state.content, uploadedOn: new Date().toISOString(),
                    image:this.state.articleName === this.state.toBeChangedArticleName && navItem.category === this.state.id,
                    path: `/${this.state.id}/${this.state.articleName.replace(/\s/g, '')}`
                };


                navItem.items.splice(indexOfArticle, 1, itemObject);

                let object = {
                    category: navItem.category, path: navItem.path, subCategories: navItem.subCategories
                    , items: navItem.items
                };

                let _this = this;
                fetch('/navlinks', {
                    method: 'PUT',
                    headers: {
                        "Content-type": "application/json",
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(object)
                }).then(response => response.json()).then(data => {
                    if(!data.success){
                        alert(data.message);
                        _this.setState({role:"user"})
                    }
                    else{
                        alert("Article edited");
                        _this.setState({navLinks: _this.state.navLinks, showModal: false});
                    }
                });
        }

    }

    deleteArticle(articleName){
        let categoryArrayIndex  = this.state.navLinks.findIndex((item,index,array)=> {
            return item.category === this.state.id;
        });

        let navItem =  this.state.navLinks.find((el,index,array)=>{
            return el.category === this.state.id
        });

        let indexOfArticle = navItem.items.findIndex((el,index,arry)=>{
            return el.item === this.state.toBeChangedArticleName
        })

        navItem.items.splice(indexOfArticle,1);

        let object = {category:navItem.category,path:navItem.path, subCategories:navItem.subCategories
            , items:navItem.items};
      if(window.confirm("Are you sure?")){

          let _this = this;
          fetch('/navlinks' , {
              method: 'PUT',
              headers: {
                  "Content-type": "application/json",
                  'Accept': 'application/json'
              },
              body: JSON.stringify(object)
          }).then(response => response.json()).then(data => {
              if(!data.success){
                  alert(data.message);
                  _this.setState({role:"user"})
              }
              else{
                  _this.setState({navLinks:_this.state.navLinks});
                  alert("Article deleted");
              }

          });
      }
  }

    handleThumbnail(el,e){
        //console.log(e.target.files[0],el);
        this.setState({imageFile:e.target.files[0]});
        let navItem =  this.state.navLinks.find((cat,index,array)=>{
            return cat.category === this.state.id
        })
        let itemObject = {
            item: el.item, "sub-category": el["sub-category"],
            content: el.content, uploadedOn: el.uploadedOn,
            path: el.path, image:true
        };

        let indexOfArticle = navItem.items.findIndex((ele, index, arry) => {
            return ele.item === el.item
        });

        navItem.items.splice(indexOfArticle, 1, itemObject);

        let object = {
            category: navItem.category, path: navItem.path, subCategories: navItem.subCategories
            , items: navItem.items
        };


        const formData = new FormData();
        formData.append('myImage', e.target.files[0]);
        let _this = this;
        fetch(`/navlinks/upload/${navItem.category}/${el.item.replace(/\s/g, '')}`,{
            method: 'POST',
            // headers:{
            //     'Content-type': 'multipart/form-data'
            // },
            body: formData
        }).then( response => response.json()).then(data => {
            if(!data.success){
                alert(data.message);
                _this.setState({role:"user"});
            }
            else{
                fetch('/navlinks' , {
                    method: 'PUT',
                    headers: {
                        "Content-type": "application/json",
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(object)
                }).then(function (response) {
                    //alert("Article added");
                    _this.setState({navLinks:_this.state.navLinks});
                });
            }
            //console.log(response.json());
        });
    }

    handleLike(article){
        let user = this.props.user;
        if(user === null){
            alert("Login to like");
        }

        else{
            if(this.state.likes.find((element,index,array)=> {
                return element === user.googleId }) === undefined)
                {
                this.state.likes.push(user.googleId);
                    let object = {category:this.state.id, article:article, comments:this.state.comments,likes:this.state.likes}
                    let _this =this;
                    fetch(`/comments/${this.state.id}/${article}`,{
                        method:'PUT',
                        headers: {
                            "Content-type": "application/json",
                            'Accept': 'application/json'

                        },
                        body: JSON.stringify(object)
                    }).then(response => response.json()).then(data =>{
                        // console.log(data);
                        if(!data.success){
                            alert(data.message);
                        }
                    }).then(()=>{
                        _this.setState({likes:_this.state.likes,liked:true});
                    })

                }

            else{
                let filteredArray = this.state.likes.filter((el,index,arr)=>{
                    return el !== user.googleId;

                });

                let object = {category:this.state.id, article:article, comments:this.state.comments,likes:filteredArray}
                let _this =this;
                fetch(`/comments/${this.state.id}/${article}`,{
                    method:'PUT',
                    headers: {
                        "Content-type": "application/json",
                        'Accept': 'application/json'

                    },
                    body: JSON.stringify(object)
                }).then(response => response.json()).then(data =>{
                    // console.log(data);
                    if(!data.success){
                        alert(data.message);
                    }
                }).then(()=>{
                    _this.setState({likes:filteredArray,liked:false});
                })

            }



    }
    }

    goBack(){

        //this.props.history.goBack();
        this.setState({viewArticle:false})
    }

    addComment(article){
       let user = this.props.user;
      if(user === null){
          alert("Login to comment");
      }
      else{
          let commentDetails = {profileId:user.googleId,name:user.displayName,image:user.image,comment:this.state.comment,
          date:new Date().toISOString()}

          this.state.comments.push(commentDetails);
          this.setState({comments:this.state.comments});
          let object = {category:this.state.id,article:article, comments:this.state.comments,likes:this.state.likes}
          let _this =this;
          fetch(`/comments/${this.state.id}/${article}`,{
              method:'PUT',
              headers: {
                  "Content-type": "application/json",
                  'Accept': 'application/json'
              },
              body: JSON.stringify(object)
          }).then(response => response.json()).then(data =>{
              //console.log(data);
              if(!data.success){
                  alert(data.message);

              }
          })
      }

    }

    handleArticleClick(articleName) {
      let user = this.props.user;
      let likeFound = undefined;
      let _this =this;
      fetch(`/comments/${this.state.id}/${articleName}`, {
          method:'GET',
          headers: {
              "Content-type": "application/json"
          },
      }).then(response => response.json()).then(data =>{
          if(data.comments !== undefined){
              if(user !== null){
                   likeFound = data.likes.find((el,index,arr)=>{
                      return el === user.googleId
                  });
              }
              _this.setState({comments:data.comments, likes:data.likes, liked:likeFound !== undefined})
          }
          else{
              _this.setState({comments:[],likes:[]})
          }

      })
        this.setState({viewArticle: true});
    }



    render() {
        console.log("All data",this.state.allData);


       // console.log("iii" ,i);
        //console.log("comments array",this.state.comments);
        const markdownInstruction = this.state.aboutMe;
        const rawHtml = <div id="rawHtml" className="language-html">
            <ReactCommonmark source={markdownInstruction} />
        </div>
        return(
            <div>
                { this.state.id === "home"
                ||
                    this.state.navLinks.find((el,index,array)=>{
                        //console.log(el.category === this.state.id);
                        return el.category === this.props.match.params.id
                    }) === undefined
                    ?
                    <div>
                        {
                            this.props.role === "admin" ?
                                <input type={"file"} accept={".md"} className={"addItem"} name={"aboutMe"} onChange={ (e) => this.handleFile(e) }/>
                                :
                                null
                        }
                        <div className={"homeArticle"}>
                            {rawHtml}
                        </div>
                    </div>
                    :
                    // except home page
                    <div>
                        {

                            !this.state.viewArticle || this.props.location.pathname === `/${this.state.id}`

                                ?

                                <div>
                                    <h3>Please select an item.</h3>
                                    <div>
                                        {
                                            this.state.role === "admin" ?
                                                <button onClick={()=>this.handleOpenModal("add")}>
                                                    Add a new element
                                                </button>
                                                :
                                                null
                                        }
                                        {this.AddLink()}
                                        <section className={"grid-c"}>
                                            {
                                                this.state.navLinks.find((element, index, array) => {
                                                    return element.category === this.state.id;
                                                }).items !== undefined
                                                    ?
                                                    this.state.navLinks.find((element, index, array) => {
                                                        return element.category === this.state.id;
                                                    }).items.map((el, index, ar) => {
                                                        return <div className={"row grid-i"} key={`div${el.item}${index}`}>
                                                            {
                                                                this.state.role === "admin"
                                                                    ?
                                                                    <div>
                                                                        <button onClick={() => this.deleteArticle(el.item)}>X</button>
                                                                        <button onClick={()=> this.handleOpenModal("edit",el)}>
                                                                            Edit article
                                                                        </button>
                                                                        <label> thumbnail:</label>
                                                                        <input type={"file"} accept="image/*" className={"file"} name={"imageFile"}
                                                                               onChange={ (e) => this.handleThumbnail(el,e) }/>
                                                                    </div>
                                                                    :
                                                                    null
                                                            }
                                                            <hr/>
                                                            <Link to={{pathname:`${this.props.match.url}/${el.item.replace(/\s/g, '')}`,
                                                                state: {
                                                                    article: el
                                                                }
                                                            }} onClick={() => this.handleArticleClick(el.item)}
                                                            >
                                                                {
                                                                    el.image?
                                                                        <img src={require(`./data/${this.state.id}${el.item.replace(/\s/g, '')}.jpg`)}
                                                                             onError={(ev)=> ev.target.src = img}
                                                                             className={"column"} key={`image${el.item}${index}`}
                                                                             width="200" height="200" style={{backgroundColor: "grey"}}
                                                                             alt={el.item}
                                                                        /> :
                                                                        <img src={img}
                                                                             onError={(ev)=> ev.target.src = img}
                                                                             className={"column"} key={`image${el.item}${index}`}
                                                                             width="200" height="200" style={{backgroundColor: "grey"}}
                                                                             alt={el.item}
                                                                        />

                                                                }
                                                                <div className={"column"} key={`${el.item}${index}`}>
                                                                    <p>
                                                                        <span className={"itemHeading"}>Item :</span>
                                                                        <span className={"itemName"}>{el.item}</span>
                                                                    </p>
                                                                    <p>
                                                                        <span className={"itemHeading"}>Sub-category:</span>
                                                                        <span className={"itemName"}>{el["sub-category"]}</span>
                                                                    </p>
                                                                    <p>
                                                                        <span className={"itemHeading"}>Created on:</span>
                                                                        <span className={"itemName"}>{new Date(el.uploadedOn).toLocaleDateString()}</span>
                                                                    </p>

                                                                    <p>
                                                                        <span><FontAwesomeIcon icon={faThumbsUp} size={"1x"}/></span>
                                                                        <span>
                                                                             {
                                                                                 this.state.allData.length > 0 ?
                                                                                     this.state.allData.find((article,index,array)=>{
                                                                                         return article.article === el.item
                                                                                     }) !== undefined ?
                                                                                         this.state.allData.find((article,index,array)=>{
                                                                                             return article.article === el.item
                                                                                         }).likes.length :
                                                                                         null
                                                                                     :
                                                                                     null
                                                                             }
                                                                        </span>
                                                                    </p>
                                                                </div>
                                                            </Link>
                                                        </div>
                                                    })
                                                    :
                                                    null
                                            }
                                        </section>
                                        {this.AddLink()}
                                    </div>
                                </div>

                                :


                                    <Route exact path={`${this.props.match.path}/:topicId`}
                                           render=
                                               {(props)=>
                                                   <div>
                                                       <div>
                                                           <button onClick={()=>this.goBack()}>Back</button>
                                                           <h3>{props.match.params.topicId}</h3>
                                                           <div>
                                                               <div style={{overflow:'hidden',minHeight:330,maxWidth:200,minWidth:50,width:10,float:"left",
                                                               position:"fixed",paddingLeft:40  }}>
                                                               <FontAwesomeIcon icon={faThumbsUp} size={"2x"}/> <hr/>
                                                               {this.state.likes.length}
                                                               </div>
                                                               <div id="rawHtml" className="language-html"
                                                                    style={{overflow: 'auto',minHeight:330,maxWidth:1000,minWidth:200,marginLeft:200}}>
                                                                   <ReactCommonmark source= {this.state.navLinks.find((element, index, arryay) =>
                                                                   {return element.category === this.state.id
                                                                   }).items.find((item, index, array) => {return item.item.replace(/\s/g, '') === props.match.params.topicId
                                                                   }).content
                                                                   }
                                                                   />
                                                               </div>
                                                           </div>
                                                           <div>
                                                               <div style={{padding:5}}>
                                                                   <FontAwesomeIcon icon={faThumbsUp} size={"2x"}
                                                                                onClick={()=> this.handleLike(props.location.state.article.item)}
                                                                                color={this.state.liked? "blue":"black"}

                                                                   />
                                                               </div>

                                                               <div style={{width:800,margin:"0 auto"}}>
                                                                   {this.state.comments.map((el,index,ar)=>{
                                                                       return <div className="commentList">
                                                                           <div className="media mb-3">
                                                                               <img
                                                                                   className="mr-3 bg-light rounded"
                                                                                   width="48"
                                                                                   height="48"
                                                                                   src={el.image}
                                                                                   alt={el.name}
                                                                               />

                                                                               <div className="media-body p-2 shadow-sm rounded bg-light border">
                                                                                   <small className="float-right text-muted">{new Date(el.date).toLocaleTimeString()}</small>
                                                                                   <h6 className="mt-0 mb-1 text-muted">{el.name}</h6>
                                                                                   {el.comment}
                                                                               </div>
                                                                           </div>


                                                                       {/*    <textarea key={`comment${index}${el.googleId}`} readOnly >*/}
                                                                       {/*        {el.comment}*/}
                                                                       {/*</textarea>*/}
                                                                       </div>
                                                                   })}
                                                                   <br/>
                                                                   <textarea className="comment"
                                                                             placeholder={"Add your comment here!"}
                                                                             onChange={(e)=>this.handleChange(e)} name={"comment"}
                                                                             value={this.state.comment}
                                                                   />

                                                                   <button onClick={()=>this.addComment(props.match.params.topicId)}>Add comment</button>

                                                               </div>
                                                           </div>
                                                       </div>
                                                   </div>
                                               }
                                    />


                        }
                    </div>
                }
            </div>
        );
  }
}




