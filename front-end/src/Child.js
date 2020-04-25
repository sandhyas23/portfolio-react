import React from 'react';
import ReactCommonmark from 'react-commonmark';
import Prism from 'prismjs';
import 'prismjs/themes/prism-coy.css';
import aboutMe from './data/aboutme';
import outline from './data/outline';
import img from './data/img_5terre.jpg';
import navLinks from './data/navLinks';
import ReactModal from "react-modal";


export default class Child extends React.Component{

  constructor(props){
      super(props);
      this.state ={id: props.match.params.id, aboutMe:aboutMe.content, fileName:"", outline:outline, showModal:false,
      navLinks:navLinks, subCategory:"", articleName:"", content:""}
  }

  componentDidMount() {
      Prism.highlightAll()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
      Prism.highlightAll()
  }

    static getDerivedStateFromProps(props,state){
      if(props.match.params.id === state.id){
          return null;
      }
      return {id:props.match.params.id,showModal:false,subCategory:""};
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
      //console.log(e.target.name);
      let reader = new FileReader();
      let file = e.target.files[0];

      if (e.target.value.length !== 0) {
          reader.onloadend = async (e) => {
              // The file's text will be printed here

              this.setState({aboutMe: e.target.result, fileName: file.name});
              //// console.log(this.state.content);
          };

          reader.readAsText(file);
      }
      else{
          this.setState({aboutMe: this.state.aboutMe, fileName: this.state.fileName});
      }
  }


    handleOpenModal () {
        this.setState({ showModal: true });
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
                    <h1 style={{"textAlign":"center"}}>Add a New item!</h1>
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
                    </form><button onClick={()=> this.addNewItem()}> Add the article </button>

                    <button onClick={()=>this.handleCloseModal()}>Close</button>
                </ReactModal>
            </div>
        );

    }

    addNewItem(){
        let article = this.state.outline.find((item,index,array)=>{
            return item.item === this.state.articleName;
        });

        if(article === undefined){
            this.state.outline.push({category:this.state.id , item:this.state.articleName, "sub-category": this.state.subCategory,
            content:this.state.content,uploadedOn:new Date().toISOString()});
            //console.log(this.state.navLinks);
            alert("Article added");
            this.setState({outline:this.state.outline,showModal:false});
        }
        else{
            alert("Article already exists");
        }

    }


    render() {
      console.log(this.state.subCategory);
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
                    <div>
                        <button onClick={()=>this.handleOpenModal()}>
                            Add a new element
                        </button>
                        {this.AddLink()}

                        <section className={"grid-c"}>
                            {this.state.outline.filter((element,index,array)=>{
                            return element.category === this.state.id;
                            }).map((el,index,ar)=>{
                            return <div className={"row grid-i"} key={`div${el.item}${index}`}>
                                <img src={img} className={"column"} key={`image${el.item}${index}`}
                                     width="200" height="200" style={{backgroundColor:"grey" }} />
                                     <div className={"column"}  key={`${el.item}${index}`}>
                                         <p>
                                             <span className={"itemHeading"}>Item :</span>
                                             <span className={"itemName"}>{el.item}</span>
                                         </p>
                                         <p>
                                             <span className={"itemHeading"}>Sub-category:</span>
                                             <span className={"itemName"}>{el["sub-category"]}</span>
                                         </p>
                                     </div>
                            </div>
                            })}
                        </section>
                    </div>
                }
            </div>
        );
    }
}

