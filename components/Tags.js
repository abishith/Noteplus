import React, { Component } from 'react';

export default class Tags extends Component
{
    render()
    {
        var array1 = this.props.tags+""
        var array = array1.split(",");
        var tagId = this.props.id+"tags"
        let index = 0;
        if (this.props.tags !== undefined) 
        {
            var element = ""
            for (index = 0; index < array.length; index++) 
            {
                element = element+" #"+array[index];
            }
            if (!this.props.edited){
                return  <span 
                            contentEditable="true" 
                            id={tagId}
                            className="TagText">
                            {element}
                        </span>
            }
            return <>{element}</> 
        }
        return  <span 
                    contentEditable="true" 
                    id={tagId}
                    className="TagText">
                </span>
    }
}