//
// Dialogs are basically proxies to a specific dialog class. By default it is WysiwygDialog. 
// Dialog windows are actually created on html nodes, like any other library (jquery-ui for example). This way 
// it is easy to integrate other libraries if desired.
//
var WysiwygDialog = function( el, config ){
	
};

// Open a new dialog, based on a html template. 
// If an object is passed for data, it is parsed before the dialog is opened.
//
Wysiwyg.dialog.open = function( tpl, data ){
	
};

Wysiwyg.dialog.close = function( el ){
	
};

// Create jQuery plugin format for dialogs.
//
$.fn.dialog = function( els, config ){
	
};