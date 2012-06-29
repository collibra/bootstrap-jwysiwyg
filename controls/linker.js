/**
 * Controls: Link plugin
 *
 * Depends on jWYSIWYG
 *
 * By: Jaroslaw Zalucki <jaroslaw@collibra.com>
 */
(function ($) {
  "use strict";

  if (undefined === $.wysiwyg) {
    throw "wysiwyg.link.js depends on $.wysiwyg";
  }

  if (!$.wysiwyg.controls) {
    $.wysiwyg.controls = {};
  }
  
  $.wysiwyg.range = null;
  
  /*
   * Old range must be retrieved when entering into form using IE 
   */
  $.wysiwyg.retriveSelection = function(Wysiwyg) {
      var selection = Wysiwyg.getInternalSelection();
      
      if($.wysiwyg.range) {
          selection.removeAllRanges ? selection.removeAllRanges() : selection.clear(); 
          if(selection.addRange) {
              selection.addRange($.wysiwyg.range);
          } else {
              $.wysiwyg.range.select();
          }
      }
  }
  
  $.wysiwyg.popover = function (Wysiwyg, element, offset, title, label, url) {
      $.wysiwyg.range = Wysiwyg.getInternalRange();
      Wysiwyg.lastPopover = element;
      core.module.use('library/uielements/popover', function(Popover) {
          var l = label || '', 
            u = url || 'http://',
            o = offset || null,
            offsetPopover = {
              top: 0,
              left: 0
            };
          
            if(offset) {
              offsetPopover = o;
            }
            Popover.create(element, {
              className: 'linker',
              title: title, 
              width: 250, 
              height: 250,
              hide: {
                blur: false, 
                manual: true
              },
              show: {
                trigger: null,
                delay: 0
              },
              events: {
                hide: function(event, api) {
                  core.module.use('library/uielements/popover', function(Popover) {
                    Popover.destroy(Wysiwyg.lastPopover);
                    Wysiwyg.lastPopover = null;
                  });
                  core.dom.select('#' + Wysiwyg.controls.createLink.id).removeClass('active');
                },
                visible: function(event, api) {
                  (core.dom.select('.linker-form')[0]).elements['webLabel'].focus();
                },
                show: function(event, api) {
                  core.module.use('library/uielements/radiocheck', function(RadioCheck) {
                      RadioCheck.create('#linker-radiocheck input');
                  });
                }
              },
              offset: offsetPopover,
              icon: 'icon-link',
              content: '<form name="createLink" class="linker-form" >' +
                         '<div id="linker-radiocheck" class="linker-form-header">' +
                             '<input type="radio" name="type" value="0" checked="checked" />' +
                                 '<span class="linker-form-header-label">Web</span>' +
                             '<input type="radio" name="type" value="1" />' +
                                 '<span class="linker-form-header-label">Resource</span>' +
                         '</div>' +
                         '<hr size="1" width="100%" class="separator">' +
                         '<div id="linker-web" class="linker-form-content">' +
                            '<div class="linker-form-label">Label</div> <div class="linker-form-inputs"><input type="text" name="webLabel" value="' + l + '" /></div><br />' +
                            '<div class="linker-form-label">URL</div> <div class="linker-form-inputs"><textarea name="url">' + u + '</textarea></div>' +
                         '</div>' +
                         '<div id="linker-resource" style="display:none">' +
                            'Label <input type="text" name="resourceLabel" /><br />' +
                            'Type <select><option>business term</option></select>' +
                         '</div>' +
                         '<div class="linker-buttons">' +
                             '<button id="linker-save" unselectable="on" class="btn-success no-label linker">' +
                                '<i class="icon-ok white"></i>' +
                             '</button>' +
                             '<button id="linker-cancel" unselectable="on" type="button" class="btn-danger no-label linker">' +
                                 '<i class="icon-close"></i>' +
                             '</button>' +
                         '</div>' +
                     '</form>'
                });
            Popover.show(element);
            core.dom.select('#linker-save').click(function(event) {
              Wysiwyg.triggerControl('addLink', Wysiwyg.controls.addLink);
              return false;
            });
            core.dom.select('#linker-cancel').click(function(event) {
              Wysiwyg.triggerControl('clearLink', Wysiwyg.controls.clearLink); 
              return false;
            });
            core.dom.select('#' + Wysiwyg.controls.createLink.id).addClass('active');
        });
  } 
    
  /*
  * Wysiwyg namespace: public properties and methods
  */
  $.wysiwyg.controls.link = {
    init: function (Wysiwyg) {
      var label = Wysiwyg.getRangeText(),
        offset = {
          top: -15,
          left: 0
        };
      
      Wysiwyg.editor.get(0).contentWindow.focus();
      if("string" !== typeof(label)) {
        label = "";
      }
      $.wysiwyg.popover(Wysiwyg, '#' + Wysiwyg.controls.createLink.id, offset, 'Create Link.', label);
      return false;
    },
  
    addLink: function (Wysiwyg) {
      var label = (core.dom.select('.linker-form')[0]).elements['webLabel'].value || '',
        url = (core.dom.select('.linker-form')[0]).elements['url'].value || '',
        a = Wysiwyg.dom.getElement("a");
      
      $.wysiwyg.retriveSelection(Wysiwyg);
      if(a) {
        if (Wysiwyg.options.controlLink.forceRelativeUrls) {
          baseUrl = window.location.protocol + "//" + window.location.hostname;
          if (0 === url.indexOf(baseUrl)) {
            url = url.substr(baseUrl.length);
          }
        }
        
        if ("string" === typeof (url)) {
          $(a).attr("href", url);
        }
        if ("string" === typeof (label)) {
          a.innerHTML = label;
        }
        core.module.use('library/uielements/popover', function(Popover) {
          if(Popover.has(Wysiwyg.lastPopover)) {
            Popover.destroy(Wysiwyg.lastPopover);
            Wysiwyg.lastPopover = null;
          }
          Popover.destroy(a);
        });
      } else {
        if(label && url) {
          Wysiwyg.editor.get(0).contentWindow.focus();
          Wysiwyg.insertHtml("<a href='" + url + "'>" + label + "</a>");
          core.module.use('library/uielements/popover', function(Popover) {
            Popover.destroy(Wysiwyg.lastPopover);
            Wysiwyg.lastPopover = null;
          });
        }
      }
      core.dom.select('#' + Wysiwyg.controls.createLink.id).removeClass('active');
    },
    
    removeLink: function (Wysiwyg) {
      var a = Wysiwyg.dom.getElement("a");
      
      if(a) {
        core.module.use('library/uielements/popover', function(Popover) {
          if(Popover.has(a)) {
            Popover.destroy(a);
          }
        });
        $(a).replaceWith(a.innerHTML);
      }
    },
    
    editLink: function (Wysiwyg) {
      var wysiwygframe = core.dom.select('#' + Wysiwyg.original.id + '-wysiwyg-iframe')[0],
      offset = {
        top: (Wysiwyg.getOffset(wysiwygframe).top - 3),
        left: (Wysiwyg.getOffset(wysiwygframe).left + 5)
      },
      a = {
        self: Wysiwyg.dom.getElement("a"), // link to element node
        href: "http://",
        title: "",
        target: ""
      };

      if (a.self) {
        a.href = a.self.href ? a.self.href : a.href;
        a.title = a.self.title ? a.self.title : "";
        a.target = a.self.target ? a.self.target : "";
        core.module.use('library/uielements/popover', function(Popover) {
          Popover.destroy(a);
        });
        $.wysiwyg.popover(Wysiwyg, a.self, offset, 'Edit Link.', a.self.innerHTML, a.href);
      }
    },
        
    clearLink: function (Wysiwyg) {
      core.module.use('library/uielements/popover', function(Popover) {
        Popover.destroy(Wysiwyg.lastPopover);
        Wysiwyg.lastPopover = null;
      });
      core.dom.select('#' + Wysiwyg.controls.createLink.id).removeClass('active');
    }
  };
})(jQuery);
