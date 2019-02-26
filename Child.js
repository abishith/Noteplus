import React, { Component } from 'react';
import Tags from './Tags';
import AssignedNames from './AssignedNames';
import DueDate from './DueDate'
import Note from './Note'
import RecursiveRenderer from'./RecursiveRenderer'

export default class Child extends Component 
{	
    constructor(props)
    {
        super(props)
        this.state =  { 
            JsonData:this.props.JsonData,
            update:this.props.update,
            note:this.props.note,
            id:this.props.id,
            parent:this.props.parent,
            child:this.props.child,
            deleted:this.props.deleted,
            currentText:"",
            dueDate:this.props.dueDate,
            tags:this.props.tags,
            assignies :this.props.assignies,
            function:this.props.function,
            displayStatus:"none"
        };
    }
	render() 
	{
        let element = <></>
        if (this.props.note !== undefined) {
                element =   <li>
                                <form autoComplete="off" >
                                    <div style={{float:"left"}}
                                        onKeyDown={(e) => this.state.function.handleTabSpace(e, this.props)}
                                        onKeyPress={(e) => this.state.function.handleKeyPress(e, this.props)}>
                                        <Note 
                                            key={this.props.id+"note"} 
                                            edited={false}
                                            note={this.props.note} 
                                            id={this.props.id}/>&nbsp;
                                        <Tags 
                                            key={this.props.id+"tags"}
                                            edited={false} 
                                            id={this.props.id} 
                                            tags={this.props.tags}
                                            function={this.state.function}/>&nbsp;
                                        <AssignedNames 
                                            key={this.props.id+"assignies"}
                                            edited={false} 
                                            id={this.props.id} 
                                            assignies={this.props.assignies}/>&nbsp;
                                    </div>
                                    <span>
                                        <div id={this.props.id+"#"} style={{display:"none",float:"left"}}>
                                            <input 
                                                style={{width:"5cm"}}
                                                type="text" 
                                                onKeyDown={(e) => { this.state.function.handleKeyPress(e, this.props) }}
                                                onKeyPress={(e) => { this.state.function.handleKeyPressForTags(e, this.props) }}
                                                id={this.props.id+"t"}>
                                            </input>
                                        </div>
                                        <div id={this.props.id+"dateDiv"} style={{display:"none",float:"left"}}>
                                            <input id={this.props.id+"date"} onChange={this.state.function.setDate} style={{position:"absolute"}} type="date"></input>
                                        </div>
                                    </span>
                                </form>
                                <DueDate 
                                    key={this.props.id+"dueDate"} 
                                    edited={false}
                                    id={this.props.id} 
                                    dueDate={this.props.dueDate}/>
                            </li>
        }
        return  (<ul id={this.props.id}>
                    {element}
                    <RecursiveRenderer 
                        newId={this.props.newId} 
                        key={this.props.id}
                        update={this.props.update} 
                        JsonData={this.props.JsonData} 
                        child={this.props.child}>
                    </RecursiveRenderer>
                </ul>)
    }
}