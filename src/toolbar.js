(function( Wysiwyg ) {

Wysiwyg.fn.createToolbar = function( ){

	var control, i, item, self = this, target = this.toolbar;
	
	target.empty();
	
	for ( i in this.controls ) {
		
		control = this.controls[i];
				
		if ( $.type( control) === 'string' && control == "|" ){ // Handle separators
			createSeparator();
			continue;
		}	
			
		item = $('<li></li>');
		
		item.addClass(i)
		   .attr('role', 'menuitem')
		   .attr('aria-readonly', 'true')
		   .attr('unselectable', 'on')
		   .attr('title', Wysiwyg.t(i))
		   .data('wysiwyg', control)
		   .bind('click.wysiwyg', function ( event ){
				var c = $(this).data('wysiwyg');
				c.exec.apply(self);
			});		   
		
		target.append(item);
	}
	
	function createSeparator(){
		target.append($("<li><span class='separator'>|</span></li>"));
	}
	
};

})( Wysiwyg );