(function( Wysiwyg ) {
	
// Empty all content from editor instance
//
Wysiwyg.fn.clear = function(){
	
};

// Creates an editor instance from a dom element.
//
Wysiwyg.fn.create = function(){
	
};

// Completely destroy an editor instance, saving its content back
// to the original dom element
//
Wysiwyg.fn.destroy = function(){
	this.remove();
	this.editor.remove();
	this.element.removeData('wysiwyg');
	return this.element;
};

// Execute a method on editor docuement
//
Wysiwyg.fn.exec = function( method, args ){
	// Support function calls directly
	if ( $.isFunction( method ) ) {
		var selection = this.getSelection();
		method.apply(this.document, selection);
	} else {
		if ( typeof(args) === "undefined" ){
			args = null;
		}
		
		this.document.get(0).execCommand(method, false, args);
	}
};

// Removes wysiwyg functionality from dom element. 
// To completely destroy instance ( including removal from data() ) use
// Wysiwyg.destroy
//
Wysiwyg.fn.remove = function(){
	this.save();
	this.editor.hide();
	this.element.show();
};

// Reset editor content to content of original dom element
//
Wysiwyg.fn.reset = function(){
	
};

// Save editor content back to the dom element
//
Wysiwyg.fn.save = function(){
	this.element.html(this.document.html());
};

})( Wysiwyg );