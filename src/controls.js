(function( Wysiwyg ) {
	
// Controls have specific properties that define how they work:
// command:  If command is defined, the control is considered an 'execCommand' operator. control.exec is never called in favor of
//			 native execCommand support.
// tooltip:  The i18n key to use when translating the control name. The translation becomes the "title" attribute of the button link
// tags:     The HTML tags this control uses when wrapping content. If 2 entries exist, the first is considered XHTML, the second is
//			 considered HTML4.  When only a single entry exists, it is used for either.
// hotkeys:  This is either an integer or an object representing a keyboard command that can be used to trigger this control.
//			 If shift/control are required, use object notation specifying key: (key integer) and ctrl and/or shift as booleans.
// delegate: If the specified control should delegate execution to a plugin, specify the plugin name here (string value).
//
// css:      If specified, the specified css objected will be applied to the editor selection using jQuery.css
//
// options:  If specified, a drop-down list is used for the control. Options are specified as objects:
//			 	name: The text used for the option
//				control: Same format as a normal control, control lists are basically sub-list controls
//
// Adding controls
// Add controls to core using:
// Wysiwyg.addControl(name, object);
//

Wysiwyg.addControl('bold', {
	command: 'bold',
	hotkeys: { ctrl: true, key: 66 },
	tags: ["strong", "b"],
	tooltip: "bold"
});

Wysiwyg.addControl('highlight', {
	command: ( $.browser.msie || $.browser.safari ) ? "backcolor" : "hilitecolor",
	css:{
		backgroundColor: "rgb(255, 255, 102)"
	},
	tooltip: "highlight"
});

Wysiwyg.addControl('italic', {
	command: 'italic',
	tags: ["em", "i"],
	tooltip: "italic"
});

Wysiwyg.addControl('ol', {
	tooltip: 'orderedList'
});

Wysiwyg.addControl('heading', {
	options: [
		{ name:'h1' },
		{ name:'h2' },
		{ name:'h3' },
		{ name:'h4' }		
	],
	tooltip: 'heading'
});

Wysiwyg.addControl('indent', {
	tooltip: 'indent'
});

Wysiwyg.addControl('outdent', {
	tooltip: 'outdent'
});

Wysiwyg.addControl('paste', {
	tooltip: 'paste'
});

Wysiwyg.addControl('undo', {
	tooltip: 'undo'
});

Wysiwyg.addControl('redo', {
	tooltip: 'redo'
});

Wysiwyg.addControl('hr', {
	command: 'insertHorizontalRule',
	tooltip: 'insertHorizontalRule'
});

Wysiwyg.addControl('ul', {
	tooltip: 'insertUnorderedList'
});

Wysiwyg.addControl('ol', {
	tooltip: 'insertOrderedList'
});

Wysiwyg.addControl('justifyLeft', {
	tooltip: 'justifyLeft'
});

Wysiwyg.addControl('justifyFull', {
	tooltip: 'justifyFull'
});

Wysiwyg.addControl('justifyRight', {
	tooltip: 'justifyRight'
});

Wysiwyg.addControl('strike', {
	command: 'strikeThrough',
	tooltip: 'strikeThrough'
});

Wysiwyg.addControl('sub', {
	command: 'subscript',
	tooltip: 'subscript'
});

Wysiwyg.addControl('sup', {
	command: 'superscript',
	tooltip: 'superscript'
});

Wysiwyg.addControl('underline', {
	command: 'underline',
	tooltip: 'underline'
});

})( Wysiwyg );