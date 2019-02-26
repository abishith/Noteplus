import React, { Component } from 'react';

export default class AssignedNames extends Component
{
    constructor(props){
        super(props)
        this.state = {assignies:this.props.assignies}
    }
    render()
    {
        var array = this.state.assignies
        var element = ""
        var id= this.props.id+"assignies"
        if (array !== undefined) 
        {
            if (array.length > 1) {
                for (let index = 0; index < array.length; index++) {
                    element = element+" @"+array[index];
                }
                return <span contentEditable="true" id={id}
                 className="assignedNames"
                 >{element}</span>
            }
            element = element+" @"+array[0];
            return <span contentEditable="true" id={id} 
            className="assignedNames"
            >{element}</span>
        }
        return <span contentEditable="true" id={id} 
        className="assignedNames"
        >{element}</span>
    }
}