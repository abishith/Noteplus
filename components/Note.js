import React, { Component } from 'react';

export default class Note extends Component
{
    render()
    {
        return  <span contentEditable="true" className="test" style={{position:"relative"}} id={this.props.id+"note"}>
        {/* {this.props.note} */}
        {this.props.id+"note"}
        </span>
    }
}

