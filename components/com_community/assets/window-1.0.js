var mouse_is_inside = false;
var cwindow_is_modeless = false;

/* Store window size to diffrent place */
var cWindowHelper = {
    /* Public var */
    contentOuterHeight: 0,
    contentWrapHeight: 0,
    contentHeight: 0,
    intervalHandle: 0,
    /* Save current size */
    save: function(){
        //Select cWindow
        var cWindow = joms.jQuery('#cWindow');
        //Check for cWindow existing
        if(cWindow.length > 0)
        {
            this.contentOuterHeight = cWindow.find('#cWindowContentOuter').height();
            this.contentWrapHeight = cWindow.find('#cWindowContentWrap').height();
            this.contentHeight = cWindow.find('#cWindowContent').outerHeight();
        }
    },
    /* Set old content mark */
    setMark: function (){
        if(this.getMark() == false)joms.jQuery('#cWindow').find('#cWindowContent').append('<div id="oldcontentmark"></div>');
    },
    /* Get old content mark` */  
    getMark: function(){
        /* Select cWindow */
        var cWindow = joms.jQuery('#cWindow');
        /* Check for cWindow existing */
        if(cWindow.length > 0)
        {
            return (cWindow.find('#cWindowContent').find('#oldcontentmark').length > 0)? true: false;
        }else{
            return null;
        }
    },
    /* Start autoresize */
    start: function()
    {
        //If cWindow isn't existed
        if(this.getMark() == null) return;
        //Stop old stream if existed
        this.stop();
        //Start auto resize
        this.intervalHandle = window.setInterval(function(){
            cWindowAutoResize();
        }, 500);
    },
    /* Stop auto resize*/ 
    stop: function(){
        if(this.intervalHandle > 0)
            window.clearInterval(this.intervalHandle);
    }
};

function cWindowShow(windowCall, winTitle, contentWidth, contentHeight, winType)
{
    // Added to avoid the event bound on cMiniWindowShow
    joms.jQuery("body").unbind("mouseup");
    
    //Remove old cWindow
    joms.jQuery('#cWindow').remove();

    /* Original HTML at bottom. Edit, encodeURIComponent and put it back here. */
    var cWindowHTML = decodeURIComponent('%3Cdiv%20id%3D%22cWindow%22%20class%3D%22%7BcWindoClass%7D%22%3E%0A%09%3Cdiv%20id%3D%22cwin_tl%22%3E%3C%2Fdiv%3E%0A%09%3Cdiv%20id%3D%22cwin_tm%22%3E%3C%2Fdiv%3E%0A%09%3Cdiv%20id%3D%22cwin_tr%22%3E%3C%2Fdiv%3E%0A%09%3Cdiv%20style%3D%22clear%3A%20both%3B%22%3E%3C%2Fdiv%3E%0A%0A%09%3Cdiv%20id%3D%22cwin_ml%22%3E%3C%2Fdiv%3E%0A%09%3Cdiv%20id%3D%22cWindowContentOuter%22%3E%0A%0A%09%09%3Cdiv%20id%3D%22cWindowContentTop%22%3E%0A%09%09%09%3Ca%20href%3D%22javascript%3Avoid(0)%3B%22%20onclick%3D%22cWindowHide()%3B%22%20id%3D%22cwin_close_btn%22%3E%3C%2Fa%3E%0A%09%09%09%3Cdiv%20id%3D%22cwin_logo%22%3E%3C%2Fdiv%3E%0A%09%09%09%3Cdiv%20class%3D%22clr%22%3E%3C%2Fdiv%3E%0A%09%09%3C%2Fdiv%3E%0A%0A%09%09%3Cdiv%20id%3D%22cWindowContentWrap%22%3E%0A%09%09%09%3Cdiv%20id%3D%22cWindowContent%22%3E%3C%2Fdiv%3E%0A%09%09%3C%2Fdiv%3E%0A%0A%09%3C%2Fdiv%3E%0A%09%3Cdiv%20id%3D%22cwin_mr%22%3E%3C%2Fdiv%3E%0A%09%3Cdiv%20style%3D%22clear%3A%20both%3B%22%3E%3C%2Fdiv%3E%0A%0A%09%3Cdiv%20id%3D%22cwin_bl%22%3E%3C%2Fdiv%3E%0A%09%3Cdiv%20id%3D%22cwin_bm%22%3E%3C%2Fdiv%3E%0A%09%3Cdiv%20id%3D%22cwin_br%22%3E%3C%2Fdiv%3E%0A%09%3Cdiv%20style%3D%22clear%3A%20both%3B%22%3E%3C%2Fdiv%3E%0A%3C%2Fdiv%3E');

    // add additional class to cWindow
    if (cwindow_is_modeless)
        cWindowHTML = cWindowHTML.replace('{cWindoClass}', 'dialog modeless');
    else
        cWindowHTML = cWindowHTML.replace('{cWindoClass}', 'dialog');

    cwindow_is_modeless = false;

    var cWindow = joms.jQuery(cWindowHTML);

    var cWindowSize;
    var cBrowserWidth = joms.jQuery(window).width();

    if (cBrowserWidth <= '480') {

        cWindowSize = {
            contentWrapHeight: function() {
                return +contentHeight
            },
            contentOuterWidth: function() {
                return +cBrowserWidth - 20
            },
            contentOuterHeight: function() {
                return +contentHeight + 40
            },
            width: function() {
                return this.contentOuterWidth() - 50
            },
            height: function() {
                return this.contentOuterHeight() + 2
            },
            left: function() {
                return (joms.jQuery(window).width() - this.width()) / 2
            },
            top: function() {
                return joms.jQuery(document).scrollTop() + ((joms.jQuery(window).height() - this.height()) / 2)
            },
            zIndex: function() {
                return cGetZIndexMax() + 1
            }
        };
        //console.log('smartphone');

    } else {

        cWindowSize = {
            contentWrapHeight: function() {
                return +contentHeight
            },
            contentOuterWidth: function() {
                return +contentWidth
            },
            contentOuterHeight: function() {
                return +contentHeight + 40
            },
            width: function() {
                return this.contentOuterWidth() + 2
            },
            height: function() {
                return this.contentOuterHeight() + 2
            },
            left: function() {
                return (joms.jQuery(window).width() - this.width()) / 2
            },
            top: function() {
                return joms.jQuery(document).scrollTop() + ((joms.jQuery(window).height() - this.height()) / 2)
            },
            zIndex: function() {
                return cGetZIndexMax() + 1
            }
        };
        //console.log('normal');

    }

    cWindow.find('#cwin_logo')
            .html(winTitle);

    cWindow.find('#cWindowContentWrap')
            .css(
            {
                'height': cWindowSize.contentWrapHeight()
            });

    cWindow.find('#cWindowContentOuter, #cwin_tm, #cwin_bm')
            .css(
            {
                'width': cWindowSize.contentOuterWidth()
            });

    cWindow.find('#cWindowContentOuter, #cwin_ml, #cwin_mr')
            .css(
            {
                'height': cWindowSize.contentOuterHeight()
            });

    cWindow
            .attr(
            {
                'class': winType
            })
            .css(
            {
                'width': cWindowSize.width(),
                'height': cWindowSize.height(),
                'top': cWindowSize.top(),
                'left': cWindowSize.left(),
                'zIndex': cWindowSize.zIndex()
            })
            .prependTo('body');


    // Set up behaviour
    jax.loadingFunction = function() {
        joms.jQuery('#cWindowContentWrap').addClass('loading');
    };
    jax.doneLoadingFunction = function() {
        joms.jQuery('#cWindowContentWrap').removeClass('loading')
                .css('overflow', 'auto');
    };

    if (windowCall != undefined && typeof(windowCall) == "string")
        eval(windowCall);
    if (typeof(windowCall) == "function")
        windowCall();

    /* Fixes */
    // Rebuild alpha transparent border in IE6
    if (joms.jQuery.browser.msie && joms.jQuery.browser.version.substr(0, 1) < 7 && typeof(jomsIE6) != "undefined" && jomsIE6 == true)
    {
        joms.jQuery('#cwin_tm, #cwin_bm, #cwin_ml, #cwin_mr').each(function()
        {
            joms.jQuery(this)[0].filters(0).sizingMethod = "crop";
        })
    }
    
    // Hide iframe as it appear on top of cWindow
    joms.jQuery('#community-wrap iframe').css('visibility', 'hidden');
    /* Fixes */
    
    //Save current size
    cWindowHelper.save();
    //Start cWindow auto resize
    cWindowHelper.start();
}

function cMiniWindowShow(windowCall, winTitle, contentWidth, contentHeight, winType) {
    cwindow_is_modeless = true;
    cWindowShow(windowCall, winTitle, contentWidth, contentHeight, winType);

    /** Catch all click outside main div */
    joms.jQuery('#cWindow').hover(function() {
        mouse_is_inside = true;
    }, function() {
        mouse_is_inside = false;
    });

    joms.jQuery("body").mouseup(function(e) {

        // Add to avoid IE treating select boxes in cWindow as something outside cWindow
        // Therefore, on select option will not close cWindow (in IE Only).
        if (joms.jQuery.browser.msie)
        {
            if (e.target.tagName == 'SELECT' || e.target.tagName == 'OPTION')
            {
                return false;
            }
        }

        if (!mouse_is_inside)
        {
            cMiniWindowHide();
        }
    });
}

function cWindowHide()
{
    var cWindow = joms.jQuery('#cWindow');

    cWindow.find('#cWindowAction').add('<div>')
            .animate({bottom: '-30px'}, 'fast', function()
    {
        cWindow
                .fadeOut('fast', function()
        {
            cWindow.find('iframe').prop('src', '');
            cWindow.remove();
            joms.jQuery('#community-wrap iframe').css('visibility', 'visible');
            //Stop cWindow auto resize
            cWindowHelper.stop();
        });
    });
}

function cMiniWindowHide()
{
    var cWindow = joms.jQuery('#cWindow');
    cWindow.remove();
    joms.jQuery('#community-wrap iframe').css('visibility', 'visible');
}

// Add content to cWindow and auto-resize them
function cWindowAddContent(html, actions, cmd) {
    
    //Current cWindow
    var cWindow = joms.jQuery('#cWindow');

    //Append new HTML
    cWindow.find('#cWindowContent')
            .html(html);

    if (actions)
    {
        joms.jQuery('<div id="cWindowAction">')
                .html(actions)
                .css('bottom', '-30px')
                .appendTo('#cWindowContentOuter')
                .animate({bottom: '0px'});
    }

    if (cmd != undefined && cmd != '') {
        eval(cmd);
    }  
}

function cWindowResize(h)
{
    //Limit cWindow size
    var maxH = joms.jQuery(window).height() * 0.8;
    var minH = joms.jQuery(window).height() * 0.1;
    if (h > maxH) h = maxH;
    if (h < minH) h = minH;
    
    //Find cWindow
    var cWindow = joms.jQuery('#cWindow');
    
    //Make sure cWindow is existing
    if(cWindow.length <= 0) return;
    
    //Get actions bar size
    var actions = cWindow.find('#cWindowAction');
    var actionBarHeight = (actions.length > 0) ? actions.height() : 0;
    
    //Get title bar size
    var title = cWindow.find('#cWindowContentTop');
    var titleBarHeight = (title.length > 0) ? title.height() : 0;
    
    // Get old wrap height
    var oldWrapHeight = cWindowHelper.contentWrapHeight;
    var oldOuterHeight = cWindowHelper.contentOuterHeight;
    
    //New height
    var WrapHeight = parseInt(h);
    var OuterHeight = WrapHeight + actionBarHeight + titleBarHeight;

    cWindow.find('#cWindowContentWrap')
            .animate(
            {
                'height': '+=' + (WrapHeight - oldWrapHeight) + 'px'
            });

    cWindow.find('#cWindowContentOuter, #cwin_ml, #cwin_mr')
            .animate(
            {
                'height': '+=' + (OuterHeight - oldOuterHeight) + 'px'
            });

    cWindow
            .animate(
            {
                'height': '+=' + (OuterHeight - oldOuterHeight) + 'px',
                'top': '-=' + (OuterHeight - oldOuterHeight) / 2 + 'px'
            }, function(){
                cWindowHelper.save();
                cWindowHelper.start();
            });
}

function cWindowActions(action)
{
    // Remove any existing cWindowAction
    joms.jQuery('#cWindowAction').remove();
    
    //Append actions bar
    if (action)
    {
        joms.jQuery('<div id="cWindowAction">')
                .html(action)
                .css('bottom', '-30px')
                .appendTo('#cWindowContentOuter')
                .animate({bottom: '0px'});
    }
    
    // Set up behavior when actions are invoked
    jax.loadingFunction = function() {
        joms.jQuery('#cWindowAction').addClass('loading');
        joms.jQuery('#cWindowContent').find('input, textarea, button')
                .attr('disabled', true);
    };
    jax.doneLoadingFunction = function() {
        joms.jQuery('#cWindowAction').removeClass('loading');
        joms.jQuery('#cWindowContent').find('input, textarea, button')
                .attr('disabled', false);
    };
    cWindowHelper.save();
    cWindowHelper.start();
}

function cGetZIndexMax()
{
    var allElems = document.getElementsByTagName ?
            document.getElementsByTagName("*") :
            document.all; // or test for that too
    var maxZIndex = 0;

    for (var i = 0; i < allElems.length; i++) {
        var elem = allElems[i];
        var cStyle = null;
        if (elem.currentStyle) {
            cStyle = elem.currentStyle;
        }
        else if (document.defaultView && document.defaultView.getComputedStyle) {
            cStyle = document.defaultView.getComputedStyle(elem, "");
        }

        var sNum;
        if (cStyle) {
            sNum = Number(cStyle.zIndex);
        } else {
            sNum = Number(elem.style.zIndex);
        }
        if (!isNaN(sNum)) {
            maxZIndex = Math.max(maxZIndex, sNum);
        }
    }
    return maxZIndex;
}

/*
 * Since 2.4.1
 */
function cWindowAutoResize()
{
    //Check stream locker
    if(cWindowHelper.getMark() == false)
    {
        //Get content height
        var h = joms.jQuery('#cWindow #cWindowContent').outerHeight();
        
        //Mark content is old
        cWindowHelper.setMark();
        
        if(cWindowHelper.contentHeight != h)
        {
            //Stop stream
            cWindowHelper.stop();
            //Resize cWindow
            cWindowResize(h);
        }
        
    }
}
/*
 <div id="cWindow" class="{cWindoClass}">
 <div id="cwin_tl"></div>
 <div id="cwin_tm"></div>
 <div id="cwin_tr"></div>
 <div style="clear: both;"></div>
 
 <div id="cwin_ml"></div>
 <div id="cWindowContentOuter">
 
 <div id="cWindowContentTop">
 <a href="javascript:void(0);" onclick="cWindowHide();" id="cwin_close_btn">Close</a>
 <div id="cwin_logo"></div>
 <div class="clr"></div>
 </div>
 
 <div id="cWindowContentWrap">
 <div id="cWindowContent"></div>
 </div>
 
 </div>
 <div id="cwin_mr"></div>
 <div style="clear: both;"></div>
 
 <div id="cwin_bl"></div>
 <div id="cwin_bm"></div>
 <div id="cwin_br"></div>
 <div style="clear: both;"></div>
 </div>
 */
