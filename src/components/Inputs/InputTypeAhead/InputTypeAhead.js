import React from "react";
import InputUnderline from "../InputUnderline/InputUnderline.js";
import Icons from "../../../support/Icons.js";
import $T from "../../../support/translations.js";
import styles from "./InputTypeAhead.module.css";
import InputTypeAheadItem from "./InputTypeAheadItem.js";

class InputTypeAhead extends InputUnderline {
	
	styles = Object.assign({}, this.styles, styles);
	autoCompletionRequest = undefined;
	controlsListener = undefined;
	selectBlock = false;
	enteredText = "";
	searchText = "";

	constructor(props, context) {
		super(props, context);
		this.state.preSelectedID = "";
		this.state.isOpen = false;
	}

	onselect(id) {
		let selectedCaption;
		
		if (this.selectBlock) return;

		selectedCaption = this.getItemById(id).caption;

		this.selectBlock = true;	

		this.props.onchange(id);

		this.inputDOM.value = selectedCaption ? selectedCaption : "";

		setTimeout((function() {
			this.selectBlock = false;
			this.closeDropDown();
		}).bind(this), 300);
	}

	getItemById(id) {
		return this.props.items.find(function(item) {
			return item.id === id;
		});
	}

	getSelectedCaption() {
		var selectedItem = this.getItemById(this.props.selectedID);

		return (selectedItem && selectedItem.caption) || "";
	}

	hasContent() {
		return !!this.searchText || !!this.props.selectedID;
	}

	findMatch(enteredText) {
		if (!enteredText) return "";

		function matchTest(item) {
			return item.caption.substr(0, enteredText.length).toLowerCase() === enteredText.toLowerCase();
		}

		return this.props.items.filter(matchTest.bind(this))[0];
	}

	getPreSelectedIndex() {
		return this.props.items.findIndex((function(item) {
			return item.id === this.state.preSelectedID;
		}).bind(this));
	}

	onchange(event) {
		var enteredText = event.target.value;
		var isDelete = enteredText.length === this.searchText.length - 1 || enteredText.length <= this.enteredText.length;

		if (isDelete) enteredText = enteredText.slice(0, -1);
		
		this.enteredText = enteredText;
		this.inputDOM = event.target;

		event.preventDefault();

		function refreshItemsSuccess() {
			if (enteredText.length >= 3) {
				this.setState({ 
					preSelectedID: this.props.items[0] && this.props.items[0].id,
				});

				this.autocomplete(enteredText);
				
				this.openDropDown();
			}
		}
		
		clearTimeout(this.autoCompletionRequest);

		if (event.target.value.length < 3 ) {
			this.searchText = event.target.value;
			
			this.closeDropDown();
			
			return;
		}

		this.autocomplete(enteredText);

		this.autoCompletionRequest = setTimeout((function() {
			if (enteredText.length < 3) return;
			
			this.props.refreshItems(enteredText, refreshItemsSuccess.bind(this));
		}).bind(this), 700);
	}

	autocomplete(enteredText) {
		var match = this.findMatch(enteredText) || {};

		if (match.caption) {
			this.searchText = match.caption;
			this.inputDOM.value = this.searchText;
			this.inputDOM.setSelectionRange(enteredText.length, match.caption.length);
		}   				
	}

	clearSelected () {
		this.searchText = "";
		this.props.onchange("");
	}

	onsearchblur() {
		var match = this.props.items.filter((function(item) {
			return item.caption === this.searchText;
		}).bind(this))[0];

		if (match) this.props.onchange(match.id);
	}

	openDropDown() {
		document.addEventListener("keydown", this.dropdownControls);
		window.addEventListener("click", this.closeDropDown);

		this.setState({ isOpen: true });
	}

	closeDropDown = () => {
		document.removeEventListener("keydown", this.dropdownControls);
		window.removeEventListener("click", this.closeDropDown);
		
		this.setState({ isOpen: false });
	}

	dropdownControls = (event) => {
		var wasIndex = this.getPreSelectedIndex();
		
		// Key Up
		if (event.which === 38) {
			event.preventDefault();

			// Top of list can"t go up.
			if (wasIndex === 0) return;
			this.setState({ preSelectedID: this.props.items[wasIndex - 1].id});
			return;
		}

		// Key Down
		if (event.which === 40) {
			event.preventDefault();
			// Bottom of list can"t go down.
			if (wasIndex === this.props.items.length -1) return;

			this.setState({ preSelectedID: this.props.items[wasIndex + 1].id});
			
			return;
		}

		// Enter Key
		if (event.which === 13) {
			event.preventDefault();
			this.onselect(this.state.preSelectedID);
		}

		// ESC Key
		if (event.which === 27) {
			event.preventDefault();
			this.closeDropDown();
			return;
		}
	}


	dropdownElement() {
		return (
			<div className={ this.styles["dropdown"] }>
				<div className={ this.styles["triangle-container"] }>
					<div className={ this.styles["dropdown-triangle"] }>
					</div>
				</div>
				{
					this.props.items.length > 0 &&
					<div className={ this.styles["content"] }>
						{
							this.props.items.map((item) => {
								return (
									<InputTypeAheadItem 
										caption={ item.caption }
										key={ item.id }
										dataKey={ item.id }
										onselect={ this.onselect.bind(this) }
										selected={ item.id === this.state.preSelectedID }
									/>
								);
							})
						}
						<div className={ this.styles["notice"] }>
							{ this.props.notice }
						</div>
					</div>
				}
				{
					this.props.items.length === 0 &&
					<div className={ this.styles["content"] }>
						<div className={ this.styles["error-content"] }>
							<div className={ this.styles["error-title"] }>
								{ $T(1) /* No Results */}
							</div>
							<div className={ this.styles["empty-message"] }>
								{ this.props.emptyMessage }
							</div>
						</div>
					</div>
				}
			</div>
		);
	}

	inputElement() {
		return (
			<div className={ this.styles["input-container"] }>
				{
					this.props.selectedID && 
					<div className={ this.styles["selected-container"] }
						style={{ width: this.props.inputWidth }}
					>
						<div className={ this.styles["selected-content"] }>
							<div className={ this.styles["selected-caption"] }>
								{ this.getSelectedCaption() }
							</div>
							<div className={ this.styles["clear-icon-container"] }
								onClick={ this.clearSelected.bind(this) }
							>
								<div className={ this.styles["clear-icon"] }>
									{ Icons.insert("clear") }
								</div>
							</div>
						</div>
					</div>
				}
				{
					!this.props.selectedID && 
					<div>
						<input 
							className={ this.hasContent()? this.styles["input-filled"] : this.styles["input"] } 
							placeholder={ this.props.placeholder }
							onChange={ this.onchange.bind(this) }
							onBlur={ this.onsearchblur.bind(this) }
							style={{ width: this.props.inputWidth }}
							type={ this.constructor.type }
							autoComplete={ this.props.autocomplete? "on" : "new-password" }
						/>
						<div className={ this.styles["search-icon-container"] }>
							<div className={ this.styles["search-icon"] }>
								{ Icons.insert("search") }
							</div>
						</div>
					</div>				
				}
				{ this.state.isOpen && this.dropdownElement() }
			</div>
		);

	}
}

export default InputTypeAhead;