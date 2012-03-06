/*jslint browser: true, forin: true */

(function( window, undefined ) {
	"use strict";

	var
		// Previous plugin instance
		previousWysiwyg = null,
		previousFnWysiwyg = null,
		// Use the correct document accordingly with window argument (sandbox)
		document = window.document,
		// jQuery shortcut
		$ = window.jQuery;


	if ($ === undefined) {
		$.error("jQuery not found. Please include jQuery prior to including jwysiwyg.");
		return false;
	}

	previousWysiwyg = $.wysiwyg;
	previousFnWysiwyg = $.fn.wysiwyg;

