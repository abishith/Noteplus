import React, { Component } from 'react';
import "react-datepicker/dist/react-datepicker.css";

export default class DueDate extends Component
{
    render()
    {
        var d = new Date();
        var days = "days"
		var date2 = new Date(this.props.dueDate);
        if (this.props.dueDate !== undefined) {
			var milliseconds = date2.getTime()-d.getTime()
            var remainingNoOfDays = Math.floor((milliseconds / (1000*60*60*24)))
            if (remainingNoOfDays === 1) { days = "day"}
            var remainingDays = " " + remainingNoOfDays + days
            var element =  "("+this.props.dueDate+"/ "+remainingDays+")"
            remainingNoOfDays = 0
			if (!this.props.edited) {
				return  <span
							id={this.props.id+"d"} 
							className="dueDate">
                            <span>
                               {element}
                            </span>
                        </span>
			}
			return <>({this.props.dueDate}/{remainingDays})</> 
        }
        return <span    
                    id={this.props.id+"d"}
                    className="dueDate">
                </span>
    }
}