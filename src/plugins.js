// Core Wysiwyg plugins
(function( Wysiwyg ) {

// Plugins are registered using Wysiwyg.registerPlugin( pluginName, pluginObject );
// where name is the name of the plugin to use, and pluginObject is the actual plugin.
//
Wysiwyg.registerPlugin('createLink', {
	exec: function(){}
});

Wysiwyg.addControl('link', {
	delegate: 'createLink',
	tooltip: 'link'
});

Wysiwyg.registerPlugin('insertImage', {
	exec: function(){}
});

Wysiwyg.addControl('image', {
	delegate: 'insertImage',
	tooltip: 'image'
});


})( Wysiwyg );