import RxReact from 'rx-react';
import React from 'react';
let StateStreamMixin = RxReact.StateStreamMixin;

import Rx from 'rx'
let Observable= Rx.Observable;
let fromEvent = Observable.fromEvent;

import logger from '../utils/log'
let log = logger("Jam-ToolBar");
log.setLevel("info");

import EditableItem from './EditableItem'
import DesignCard   from './DesignCard'

import {setDesignData$} from '../actions/designActions'
import {undo,redo,setDesignAsPersistent$} from '../actions/appActions'


class MainToolBar extends RxReact.Component {
  constructor(props) {
    super(props);
    this.state = {
      appInfos:{
        name:"bla",
        version:"0.0.0"
      },
      designCardVisible:false,
    }
  }

  getStateStream() {
    return Observable.empty()
  }

  handleClick(event){
    console.log("state & props", this.state, this.props)
  }

  setDesignTitle(value){
    setDesignData$({title:value});
  }

  toggleDesignCard(){
    this.setState({
      designCardVisible: !this.state.designCardVisible
    })
  }
  
  render() {
    let fullTitle = `(${this.props.appInfos.name} v  ${this.props.appInfos.version})`;
    let history   = this.props.history;
    //disabled={!disabled}


    let titleStyle = {};
    /*  width:"100%",
      padding: "5 0 0 10"
    };*/
    let fooStyle  = {
      display: "inline-block"
    };

    let designCardWrapper = <div className="designCardWrapper fadesIn" />;
    if(this.state.designCardVisible){
      designCardWrapper = (
      <div className="designCardWrapper fadesOut">
        <DesignCard design={this.props.design}/> 
      </div>);
    }

    //console.log("this.props.undos.length===0",this.props.undos.length===0, this.props.undos.length, this.props.undos)

    let undosDisabled = this.props.undos.length<=1;//
    let redosDisabled = this.props.redos.length===0;

    return (
      <div className="titleBar" style={titleStyle}>
        <h1>
          <EditableItem data={this.props.design.title} changeCallback={ this.setDesignTitle } ref="title" className="designName"/> 
        </h1>
        <span ref="title" className="appInfos"> {fullTitle} </span>
        <span>
          <button onClick={this.toggleDesignCard.bind(this)} className="details"> Details </button>
        </span>

        <span>
          <span>AutoSave online (temporary button?)</span>
          <input type="checkbox" checked={this.props.persisting} onChange={setDesignAsPersistent$}> </input>
        </span>

        <span className="history">
          <button disabled={undosDisabled} onClick={undo} className="undo"> Undo </button> 
          <button disabled={redosDisabled} onClick={redo} className="redo"> Redo </button> 
        </span>

        <span className="social"> 
          <span>
            <button onClick={this.handleClick.bind(this)} className="download"> Download </button>
          </span>
          <div style={fooStyle}>
            <button onClick={this.handleClick.bind(this)} className="viewOnYm"> View on YM </button>
          </div>
          <span>
            <button onClick={this.handleClick.bind(this)} className="share"> Share </button>
          </span>
          <span>
            <button onClick={this.handleClick.bind(this)} className="like"> Like </button>
          </span>
        </span>

        <span className="otherStuff">
          <button onClick={this.handleClick.bind(this)} className="options"> options </button>
        </span>

        <span>

        </span>

        {designCardWrapper}

      </div>
    );
  }
}

export default MainToolBar