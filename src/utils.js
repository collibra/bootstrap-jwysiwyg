// Encode html entities
Wysiwyg.utils.encodeEntities = function( str ){

	var entities = [ [ "<", ">", "'", '"', " " ], [32] ], 
		aStr, 
		aRet = [];

	if ( entities[1].length === 0 ) {		
		$.each( entities[0], function( i, ch ){
			entities[1].push( ch.charCodeAt() );
		});
	}
	
	aStr = str.split("");
	
	$.each( aStr, function ( i ){
		var iC = aStr[i].charCodeAt();
		if ( $.inArray( iC, entities[1] ) && (iC < 65 || iC > 127 || (iC > 90 && iC < 97)) ){
			aRet.push('&#' + iC + ';');
		} else {
			aRet.push(aStr[i]);
		}
	});

	return aRet.join('');
};

// Replaces wrapInitialContent to make sure that plain text (usually initial content)
// at least has a paragraph tag.

Wysiwyg.utils.wrapTextContent = function( str ){
	var found = str.match(/<\/?p>/gi);
	if ( !found ){
		return "<p>" + str + "</p>";
	} else {
		// :TODO: checking/replacing
	}
	
	return str;
	
};