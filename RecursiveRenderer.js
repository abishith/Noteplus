import React, { Component } from 'react';
import Child from'./Child';
import ReactDOM from 'react-dom'
import DueDate from './DueDate'

export default class RecursiveRenderer extends Component{
	constructor(props)
    {
        super(props)
		this.state = {	
			JsonData : this.props.JsonData, 
			child : this.props.child, 
			update:this.props.update,
			date:this.props.date
		};
		this.hashKeyPressed=false
		this.atPressed = false
		this.slashPressed = false
		this.newId = 1000
		this.dataToInsert = null
		this.currentId = ""
		this.currentText = ""
		this.array = []
		this.options = []
		this.function = {	
			handleKeyPress:(e, currentState)=>{
				this.currentId = currentState.id
				this.currentText = document.getElementById(currentState.id+"note").textContent
				var key = e.which || e.keyCode || e.charCode;
				if (key === 35 || key === 64 || key === 47 || key === 8 || key === 13) {
					let a = document.getElementById(this.currentId+"t")
						a.focus()
						document.getElementById(this.currentId+"#").setAttribute("style", "display:'block'");
						switch (key) {
							case 13:
								e.preventDefault();
								let d = new Date();
								this.dataToInsert = {"_id":d.getTime(), "parent":currentState.parent, "note": "", "deleted": false,"child":[]}
								this.state.update.state(this.function.dbOperations(currentState.parent, this.dataToInsert, 'add'))
								this.function.wait(1).then(()=>{document.getElementById(d.getTime()+"note").focus();})
								break;
							case 35:
								this.function.autocomplete(a, this.function.getValue(this.props.JsonData, "tags", "#"))
								break;
							case 64:
								this.function.autocomplete(a, this.function.getValue(this.props.JsonData, "assignies", "@"))
								break;
							case 47:
								this.function.autocomplete(a, ["/due date", "/type of todo"])
								break;
							case 8:
								this.function.wait(1).then(()=>{
									if (a.value.length === 0) {
										document.getElementById(this.currentId+"#").setAttribute("style", "display:'none'");
										this.function.placeCaretAtEnd(document.getElementById(this.currentId+"note") );
									}
								})
								break;
							default:
								// this.state.update.state(this.function.dbOperations(currentState.parent, currentState, 'update'))
								break;
						}
						this.array = []
						a.focus()
				}
				return;
			},addData:(currentState, arrayOfEnteredText, operation)=>{
				var dataToInsert=[];
				for (let index = 0; index < arrayOfEnteredText.length; index++) {
					var element = arrayOfEnteredText[index]
					element = arrayOfEnteredText[index].substring(1,arrayOfEnteredText[index].length);
					dataToInsert.push(element)
				}
				this.state.update.state(this.function.dbOperations(currentState.id, dataToInsert, operation))
			},handleTabSpace:(e, currentState)=>{
				switch (e.keyCode) {
					case 9:
						e.preventDefault();
						var dataToInsert = {
							"_id":currentState.id, 
							"parent":currentState.parent, 
							"note": currentState.note, 
							"deleted": false, 
							"child":currentState.child,
						}
						this.state.update.state(this.function.dbOperations(currentState.parent, dataToInsert, 'tab'))
						this.function.wait(1).then(() => {
							this.function.focusOnNote();
						})
						break;
					case 8:
						if (currentState.parent === "root" && currentState.id === "main") {
							return;
						}
						this.currentText = document.getElementById(currentState.id+"note").textContent
						// this.state.update.state(this.function.dbOperations(currentState.parent, currentState, 'update'))
						if(document.getElementById(currentState.id+"note").textContent.length === 0)
						{
							let dataToInsert = {
								"_id":currentState.id, 
								"parent":currentState.parent, 
								"note": currentState.note, 
								"deleted": true, 
								"child":currentState.child
							}
							this.state.update.state(this.function.dbOperations(currentState.parent, dataToInsert, 'delete'))
						}
						break;
					default:
						break;
				}
			},dbOperations:(noteId, dataToInsert, operation ,JsonClone = this.state.JsonData)=>{
				var id = JsonClone["_id"];
				if(id === noteId)
				{
					switch(operation)
					{
						case 'add' :{
									JsonClone["child"].push(dataToInsert);
									break;
						}case 'update' :{
										var index = (this.function.getIndex(dataToInsert.id, JsonClone["child"]))
										var updatedJson = {
											"_id":dataToInsert.id,
											"parent":dataToInsert.parent,
											"note": this.currentText,
											"deleted": false,
											"child":dataToInsert.child,
											"tags":dataToInsert.tags,
											"assignies":dataToInsert.assignies
											}
										JsonClone["child"].splice(index,1, updatedJson);
										this.function.placeCaretAtEnd(document.getElementById(dataToInsert.id+"note") );
										break;
						}case 'delete':{
										if(JsonClone.child.length >= 1)
										{ 
											let index = (this.function.getIndex(dataToInsert._id, JsonClone.child))
											if(index >=0)
											{
												JsonClone["child"].splice(index,1)
											}   
										}
									break;
						}case 'tab':{
									if(JsonClone.child.length === 1)
									{
										break;
									}
									if(JsonClone.child.length > 1)
									{ 
										let index = (this.function.getIndex(dataToInsert._id, JsonClone.child))
										if(index >= 1)
										{
											let d = new Date();
											this.currentId = d.getTime();
											var note = document.getElementById(dataToInsert._id+"note").textContent
											JsonClone["child"].splice(index,1)
											dataToInsert._id = this.currentId
											dataToInsert.parent = JsonClone["child"][index - 1]._id
											dataToInsert.note = note
											JsonClone["child"][index - 1].child.push(dataToInsert);
										}
									}
									break;
						}case 'tags':{
										// JsonClone["tags"] = []
										// dataToInsert.forEach(element => {JsonClone["tags"].push(element)});
									break;
						}case 'assignies':{
									if (JsonClone["assignies"] === undefined) {
										JsonClone["assignies"] = []
										dataToInsert.forEach(element => {
										JsonClone["assignies"].push(element)
										});
										break;
									}
								else{
									JsonClone["assignies"].push(dataToInsert)
								}
								break;
						}case 'dueDate':{
							let date = new Date();
							let month = date+""
							date = date.getFullYear()+"/"+month.substring(4,7)+"/"+date.getDate();
							JsonClone["dueDate"] = date;
							document.getElementById(id+"dueDate").textContent = date
							break;
						}default:{
							break;
						}
					}
				}
				else 
				{
					JsonClone = JsonClone["child"];
					JsonClone.forEach(element => {
						this.function.dbOperations(noteId, dataToInsert, operation, element);
					});
				}
				return JsonClone;
			},autocomplete:(inp, arr)=>{
				var currentId;
				var currentFocus;
				if (inp) {
					inp.addEventListener("input", function(e) {
						var a, b, i, val = this.value;
						closeAllLists();
						if (!val) { return false;}
						currentFocus = -1;
						a = document.createElement("DIV");
						a.setAttribute("id", this.id + "autocomplete-list");
						currentId = this.id.substring(0, this.id.length-1)
						a.setAttribute("class", "autocomplete-items");
						this.parentNode.appendChild(a);
						for (i = 0; i < arr.length; i++) {
						if (arr[i].substr(0, val.length).toUpperCase() === val.toUpperCase()) {
							b = document.createElement("DIV");
							b.innerHTML = "<span class='highlight'>" + arr[i].substr(0, val.length) + "</span>";
							b.innerHTML += arr[i].substr(val.length);
							b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
							b.addEventListener("click", function(e) {
								inp.value = this.getElementsByTagName("input")[0].value;
								closeAllLists();
							});
							a.appendChild(b);
						}
						}
					});
					inp.addEventListener("keydown", function(e) {
						var x = document.getElementById(this.id + "autocomplete-list");
						if (x) x = x.getElementsByTagName("div");
						if (e.keyCode === 40) {
						currentFocus++;
						addActive(x);
						} else if (e.keyCode === 38) {
						currentFocus--;
						addActive(x);
						} else if (e.keyCode === 13) {
						e.preventDefault();
						if (currentFocus > -1) {
							if (x) x[currentFocus].click();
						}
						}
					});
				}
				document.addEventListener("click", (e)=> {
					wait(1).then(()=>{
						var key = (inp.value.charAt(0) === '@') ? 'assignies' :'tags';
						if (inp.value.charAt(0) === '@' || inp.value.charAt(0) === '#') {
							storeValues(key);
						}
						if (inp.value.charAt(0) === '/') {
							switch (inp.value) {
								case "/due date":
									document.getElementById(currentId+"dateDiv").setAttribute("style", "display:'block'");
									document.getElementById(currentId+"t").setAttribute("style", "display:none")
									inp.value = ""
									break;
								case "/type of todo":
									document.getElementById(currentId+"t").setAttribute("style", "display:none")
									inp.value = ""
									return;
								default:
									break;
							}
						}
					})
					closeAllLists(e.target);
				})
				;function wait(time){
					return new Promise((resolve) => setTimeout(resolve, time));
				}function addActive(x) {
					if (!x) return false;
					removeActive(x);
					if (currentFocus >= x.length) currentFocus = 0;
					if (currentFocus < 0) currentFocus = (x.length - 1);
					x[currentFocus].classList.add("autocomplete-active");
				}function removeActive(x) {
					for (var i = 0; i < x.length; i++) {
					  x[i].classList.remove("autocomplete-active");
					}
				}function closeAllLists(elmnt) {
					var x = document.getElementsByClassName("autocomplete-items");
					for (var i = 0; i < x.length; i++) {
					  if (elmnt !== x[i] && elmnt !== inp) {
						x[i].parentNode.removeChild(x[i]);
					  }
					}
				}function storeValues(key){
					let e = document.getElementById(currentId+"t")
					let tags = document.getElementById(currentId+key).textContent
					tags = tags + " " + e.value
					document.getElementById(currentId+key).textContent = tags
					e.value = ""
					document.getElementById(currentId+"#").setAttribute("style", "display:none");
				}
			},getIndex:(value, array)=>{
				for(var everyNote = 0; everyNote < array.length; everyNote++) {
					if(array[everyNote]["_id"] === value) {
						return everyNote;
					}
				}
				return -1;
			},wait:(time)=>{
				return new Promise((resolve) => setTimeout(resolve, time));
			},setDate:()=>{
				ReactDOM.render(<DueDate 
									edited={true}
									id={this.currentId} 
									dueDate={document.getElementById(this.currentId+"date").value}>
								</DueDate>,
								document.getElementById(this.currentId+"d"))
				document.getElementById(this.currentId+"dateDiv").setAttribute("style", "display:none");
			},focusOnNote:()=>{
				document.getElementById(this.currentId+"note").focus()
			},getValue:(JsonObj, key, char)=>{
				if (JsonObj["child"] !== undefined) {
                    if (JsonObj[key] !== undefined) {
                        JsonObj[key].forEach(element => {
							element = char + element
                            this.array = [...this.array, element]
                        });
                        JsonObj = JsonObj["child"];
                        JsonObj.forEach(element => {
                            this.function.getValue(element, key, char);
                        });
                    }
                    else{
                        JsonObj = JsonObj["child"];
                        JsonObj.forEach(element => {
                            this.function.getValue(element, key, char);
                        });
                    }
				}
                return this.array
			},placeCaretAtEnd:(el)=>{
				el.focus();
				if (typeof window.getSelection != "undefined"
						&& typeof document.createRange != "undefined") {
					var range = document.createRange();
					range.selectNodeContents(el);
					range.collapse(false);
					var sel = window.getSelection();
					sel.removeAllRanges();
					sel.addRange(range);
				} else if (typeof document.body.createTextRange != "undefined") {
					var textRange = document.body.createTextRange();
					textRange.moveToElementText(el);
					textRange.collapse(false);
					textRange.select();
				}
			},saveAfterThreeSeconds:(a, currentId)=>{
				var textInput = a
				var timeout = null;
				textInput.onkeyup = function (e) {
					clearTimeout(timeout);
					timeout = setTimeout(function () {
						if (a.value.length > 0) {
							console.log('Input Value:', textInput.value);
							var key = (a.value.charAt(0) === '@') ? 'assignies' :'tags';
							if (a.value.charAt(0) === '@' || a.value.charAt(0) === '#') {
								let e = document.getElementById(currentId+"t")
								let tags = document.getElementById(currentId+key).textContent
								tags = tags + " " + e.value
								document.getElementById(currentId+key).textContent = tags
								e.value = ""
								document.getElementById(currentId+"#").setAttribute("style", "display:none");
								a.value = null
							}
						}
					}, 3000);
				};
			},storeValues:(key, currentId)=>{
				let e = document.getElementById(currentId+"t")
				let tags = document.getElementById(currentId+key).textContent
				tags = tags + " " + e.value
				document.getElementById(currentId+key).textContent = tags
				e.value = ""
				document.getElementById(currentId+"#").setAttribute("style", "display:none");
				return;
			},handleKeyPressForTags:(e, currentState)=>{
				this.currentId = currentState.id
				this.currentText = document.getElementById(currentState.id+"note").textContent
				var key = e.which || e.keyCode || e.charCode;
				if (key === 35 || key === 64 || key === 47 || key === 8) {
					let a = document.getElementById(this.currentId+"t")
						a.focus()
						document.getElementById(this.currentId+"#").setAttribute("style", "display:'block'");
						switch (key) {
							case 35:
								this.function.autocomplete(a, this.function.getValue(this.props.JsonData, "tags", "#"))
								break;
							case 64:
								this.function.autocomplete(a, this.function.getValue(this.props.JsonData, "assignies", "@"))
								break;
							case 47:
								this.function.autocomplete(a, ["/due date", "/type of todo"])
								break;
							case 8:
								this.function.wait(1).then(()=>{
									if (a.value.length === 0) {
										document.getElementById(this.currentId+"#").setAttribute("style", "display:'none'");
										this.function.placeCaretAtEnd(document.getElementById(this.currentId+"note") );
									}
								})
								break;
							default:
								this.state.update.state(this.function.dbOperations(currentState.parent, currentState, 'update'))
								break;
						}
						this.array = []
						a.focus()
				}
				this.function.saveAfterThreeSeconds(document.getElementById(this.currentId+"t"), this.currentId)
				return;
			}
		}
	}
    render()
    {
		var child = this.props.child
        var arr = [];
		Object.keys(child).forEach(function(key){ arr.push(child[key]);});
		return  (arr.map(item =><><Child
									JsonData={this.state.JsonData} 
									note={item.note} 
                                    parent={item.parent}
                                    child={item.child} 
                                    tags={item.tags}
                                    dueDate={item.dueDate}
                                    assignies={item.assignies}
                                    status={item.status}
                                    typeOfTodo={item.typeOfTodo}
                                    deleted={item.deleted}
                                    id={item._id}
									function={this.function}
									update={this.props.update}
									newId={this.props.newId}
									/></>
									)
            )
	}
}