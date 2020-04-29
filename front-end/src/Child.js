import React from 'react';
import ReactCommonmark from 'react-commonmark';
import {BrowserRouter as Router, Switch,Route, Link,NavLink,Redirect,useLocation } from 'react-router-dom';
import Prism from 'prismjs';
import 'prismjs/themes/prism-coy.css';
import aboutMe from './data/aboutme';
//import outline from './data/outline';
import img from './data/img_5terre.jpg';
import navLinks from './data/navLinks';
import ReactModal from "react-modal";


export default class Child extends React.Component{

  constructor(props){
      super(props);
      this.state ={id: props.match.params.id, aboutMe:aboutMe.content, fileName:"", showModal:false,
      navLinks:navLinks, subCategory:"", articleName:"", content:"", mode:"admin", edit:"",
      viewArticle:false}
  }

  componentDidMount() {
      Prism.highlightAll()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
      Prism.highlightAll()
  }

  static getDerivedStateFromProps(props,state) {
      if (props.match.params.id === state.id) {
          return null;
      }
      return {
          id: props.match.params.id, aboutMe: aboutMe.content, fileName: "", showModal: false,
          navLinks: navLinks, subCategory: "", articleName: "", content: "", mode: "admin", edit: "",
          viewArticle: false
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

              this.setState({[name]: e.target.result, fileName: file.name});
              //// console.log(this.state.content);
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
              subCategory:article["sub-category"], content:article.content, articleIndex:articleIndex});
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
                        <label>Attach thumbnail:</label>
                        <input type={"file"} accept="image/*" className={"file"} name={"content"} onChange={ (e) => this.handleFile(e) }/>
                    </form><button onClick={()=> this.addNewItem()}> Add the article </button>

                    <button onClick={()=>this.handleCloseModal()}>Close</button>
                </ReactModal>
            </div>
        );

    }

    addNewItem(){
        //console.log(this.state.articleName);
        let categoryArrayIndex  = this.state.navLinks.findIndex((item,index,array)=> {
            return item.category === this.state.id;
        });
        let articleIndex = this.state.navLinks.find((item,index,array)=>{
            return item.category === this.state.id;
        }).items.findIndex((article,index,array)=>{
            return article.item === this.state.articleName;
        })


        if(this.state.articleIndex === -1){
            console.log("if",articleIndex);
            this.state.navLinks[categoryArrayIndex].items.push({item:this.state.articleName, "sub-category": this.state.subCategory,
            content:this.state.content,uploadedOn:new Date().toISOString(),
                path:`/${this.state.id}/${this.state.articleName.replace(/\s/g, '')}`});
            //console.log(this.state.navLinks);
            alert("Article added");
            this.setState({navLinks:this.state.navLinks,showModal:false});
        }
        else if(this.state.edit === "edit"){
            console.log("else if",this.state.articleIndex);
            let article = this.state.navLinks.find((item,index,array)=>{
                return item.category === this.state.id;
            }).items.find((article,index,array)=>{
                return article.item === this.state.articleName;
            });
            let item={item:this.state.articleName, "sub-category": this.state.subCategory,
                content:this.state.content,uploadedOn:new Date().toISOString(),
                path:`/${this.state.id}/${this.state.articleName.replace(/\s/g, '')}`}
            this.state.navLinks[categoryArrayIndex].items.splice(this.state.articleIndex,1,item);
            alert("Article edited");
            this.setState({navLinks:this.state.navLinks, showModal:false})
        }
        else{
            alert("Article already exists");
        }

    }

    deleteArticle(articleName){
        let categoryArrayIndex  = this.state.navLinks.findIndex((item,index,array)=> {
            return item.category === this.state.id;
        });
      if(window.confirm("Are you sure?")){
          let index = this.state.navLinks.find((element,index,array)=> {
              return element.category === this.state.id
          }).items.findIndex((el,index,array)=>{
                  return el.item === articleName;
              });

          this.state.navLinks[categoryArrayIndex].items.splice(index,1);
          this.setState({navLinks:this.state.navLinks});
          alert("Article deleted");
      }
    }


    render() {
      console.log("in child",this.state.navLinks);
        const markdownInstruction = this.state.aboutMe;
        const rawHtml = <div id="rawHtml" className="language-html">
            <ReactCommonmark source={markdownInstruction} />
        </div>
        return(
            <div>
                { this.state.id === "home" ||
                    this.state.navLinks.find((el,index,array)=>{
                        return el.category === this.state.id
                    }) === undefined
                    ?
                    <div>
                    <input type={"file"} accept={".md"} className={"addItem"} name={"aboutMe"} onChange={ (e) => this.handleFile(e) }/>
                    <article style={{overflow: 'auto',minHeight:330,maxWidth:900,minWidth:200 }}>
                        {rawHtml}
                    </article>
                    </div>
                    :
                    // except home page
                    <Router>
                    <Switch>
                        <Route exact path={`/${this.state.id}`}>
                            <h3>Please select an item.</h3>
                            <div>
                                <button onClick={()=>this.handleOpenModal("add")}>
                                    Add a new element
                                </button>
                                {this.AddLink()}

                                <section className={"grid-c"}>
                                    {
                                        this.state.navLinks.find((element, index, array) => {
                                        return element.category === this.state.id;
                                    }).items !== undefined ?
                                            this.state.navLinks.find((element, index, array) => {
                                            return element.category === this.state.id;
                                        }).items.map((el, index, ar) => {
                                        return <div className={"row grid-i"} key={`div${el.item}${index}`}>
                                            {this.state.mode === "admin" ? <div><button
                                                onClick={() => this.deleteArticle(el.item)}>X</button>
                                                <button onClick={()=> this.handleOpenModal("edit",el)}>
                                                    Edit article
                                                </button>
                                            </div> : null}
                                            <hr/>
                                            <Link to={{pathname:`${this.props.match.url}/${el.item.replace(/\s/g, '')}`,
                                                state: {
                                                    article: el
                                                }
                                            }}>
                                                <img src={img} className={"column"} key={`image${el.item}${index}`}
                                                     width="200" height="200" style={{backgroundColor: "grey"}}/>
                                                <div className={"column"} key={`${el.item}${index}`}>
                                                    <p>
                                                        <span className={"itemHeading"}>Item :</span>
                                                        <span className={"itemName"}>{el.item}</span>
                                                    </p>
                                                    <p>
                                                        <span className={"itemHeading"}>Sub-category:</span>
                                                        <span className={"itemName"}>{el["sub-category"]}</span>
                                                    </p>
                                                </div>
                                            </Link>
                                        </div>
                                    }) :
                                            null
                                    }
                                </section>
                                {this.AddLink()}
                            </div>
                        </Route>
                        {Prism.highlightAll()}
                        <Route exact path={`${this.props.match.path}/:topicId`} render={(props)=>
                            <div>
                                <button>
                                    <Link to={`${this.props.location.pathname}`}>Back</Link>
                                </button>
                                <h3>{props.location.state.article.item}</h3>
                                <article style={{overflow: 'auto',minHeight:330,maxWidth:900,minWidth:200 }}>
                                    <div id="rawHtml" className="language-html">
                                    <ReactCommonmark source= {this.state.navLinks.find((element, index, arryay) => {
                                        return element.category === this.state.id
                                    }).items.find((item, index, array) => {
                                        return item.item.replace(/\s/g, '') === props.match.params.topicId
                                    }).content
                                    }
                                    />
                                </div>
                                </article>
                            </div>
                        } />
                    </Switch>

                    </Router>
                }
            </div>

        );
    }
}




