/**
 * jQuery Geo-lightBox plugin
 * This jQuery plugin was inspired and based on Lightbox 2 by Lokesh Dhakar (http://www.huddletogether.com/projects/lightbox2/)
 * and based on jquery-lightbox-0.5.js(http://leandrovieira.com/projects/jquery/lightbox/) adapted to me for use like a plugin from jQuery.
 * @name jquery-Geo-lightbox-0.5.js
 * @author Daozhao Chen -- http://daozhao.goflytoday.com/
 * @version 0.5
 * @date DEC 04, 2011
 * @category jQuery plugin
 * @copyright (c) 2011 Daozhao Chen(http://daozhao.goflytoday.com/)
 * @license CC Attribution-No Derivative Works 2.5 Brazil - http://creativecommons.org/licenses/by-nd/2.5/br/deed.en_US
 * @example Visit http://daozhao.goflytoday.com/geo-lightbox-wordpress-plugin/ for more informations about this jQuery plugin
 */

// Offering a Custom Alias suport - More info: http://docs.jquery.com/Plugins/Authoring#Custom_Alias
(function($) {
    
/*
    $.autoGeoLightbox = function(rel_str)
    {
        
    	var groups = {};
    	$.each($('a[@rel*='+ rel_str +']'), function(index, obj){
    	//$.each($(rel_str), function(index, obj){
				var rel = $(obj).attr('rel');
				if ( typeof groups[rel] === 'undefined' )
				{	// Make the group
					groups[rel] = [];
				}
				groups[rel].push(obj);
			});
			// Lightbox groups
			$.each(groups, function(index, group){
				$(group).geoLightBox();
			});
			return true;
    }
*/
    
    $.fn.autoGeoLightbox = function(settings)
    {
        
		settings = jQuery.extend({
                        attr: "rel"
                        },settings);
    	var groups = {};
        if ( 1 == this.length )
        {
            $(this).geoLightBox(settings);
        }
        else
        {
        	$.each(this, function(index, obj){
				var rel = $(obj).attr(settings.attr);
				if ( typeof groups[rel] === 'undefined' )
				{	// Make the group
					groups[rel] = [];
				}
				groups[rel].push(obj);
			});
			// Lightbox groups
			$.each(groups, function(index, group){
				$(group).geoLightBox(settings);
			});
        }
			return true;
    }	/**
	 * $ is an alias to jQuery object
	 *
	 */
	$.fn.geoLightBox = function(settings) {
		// Settings to configure the jQuery lightBox plugin how you like
		settings = jQuery.extend({
			// Configuration related to overlay
			overlayBgColor: 		'#000',		// (string) Background color to overlay; inform a hexadecimal value like: #RRGGBB. Where RR, GG, and BB are the hexadecimal values for the red, green, and blue values of the color.
			overlayOpacity:			0.8,		// (integer) Opacity value to overlay; inform: 0.X. Where X are number from 0 to 9
			// Configuration related to navigation
			fixedNavigation:		false,		// (boolean) Boolean that informs if the navigation (next and prev button) will be fixed or not in the interface.
			// Configuration related to images
			imageLoading:			'images/lightbox-ico-loading.gif',		// (string) Path and the name of the loading icon
			imageBtnPrev:			'images/lightbox-btn-prev.gif',			// (string) Path and the name of the prev button image
			imageBtnNext:			'images/lightbox-btn-next.gif',			// (string) Path and the name of the next button image
			imageBtnClose:			'images/lightbox-btn-close.gif',		// (string) Path and the name of the close btn
			imageBtnPIC:			'images/lightbox-btn-geo.gif',		// (string) Path and the name of the close btn
			imageBtnGEO:			'images/lightbox-btn-geo.gif',		// (string) Path and the name of the close btn
			imageBlank:				'images/lightbox-blank.gif',			// (string) Path and the name of a blank image (one pixel)
            imageCamera:            'images/beachflag.png',
            imageCurrentCamera:     'images/camera.jpg',
            btnGEOTitle:            'View geo tag in google maps',
            btnPICTitle:            'View the picture',
			// Configuration related to container image box
			containerBorderSize:	10,			// (integer) If you adjust the padding in the CSS for the container, #lightbox-container-image-box, you will need to update this value
			containerResizeSpeed:	400,		// (integer) Specify the resize duration of container image. These number are miliseconds. 400 is default.
			// Configuration related to texts in caption. For example: Image 2 of 8. You can alter either "Image" and "of" texts.
			txtImage:				'Image',	// (string) Specify text "Image"
			txtOf:					'of',		// (string) Specify text "of"
			// Configuration related to keyboard navigation
			keyToClose:				'c',		// (string) (c = close) Letter to close the jQuery lightBox interface. Beyond this letter, the letter X and the SCAPE key is used to.
			keyToPrev:				'p',		// (string) (p = previous) Letter to show the previous image
			keyToNext:				'n',		// (string) (n = next) Letter to show the next image.
			// Don´t alter these variables in any way
			imageArray:				[],
			imagegeo:				[],
            markerArray:            [],
			activeImage:			0,
            map:                    null,
            mapOrImage:             "Image", // "Image" or "Map"
            mapWidth:               640,
            mapHeight:              480,
            mapLevel:              15
		},settings);
		// Caching the jQuery object with all elements matched
		var jQueryMatchedObj = this; // This, in this context, refer to jQuery object
        //var jQueryMatchedObj.map = null;
        
		/**
		 * Initializing the plugin calling the start function
		 *
		 * @return boolean false
		 */
		function _initialize() {
			_start(this,jQueryMatchedObj); // This, in this context, refer to object (link) which the user have clicked
			return false; // Avoid the browser following the link
		}
		/**
		 * Start the jQuery lightBox plugin
		 *
		 * @param object objClicked The object (link) whick the user have clicked
		 * @param object jQueryMatchedObj The jQuery object with all elements matched
		 */
		function _start(objClicked,jQueryMatchedObj) {
			// Hime some elements to avoid conflict with overlay in IE. These elements appear above the overlay.
			$('embed, object, select').css({ 'visibility' : 'hidden' });
			// Call the function to create the markup structure; style some elements; assign events in some elements.
            //objClicked.map = null; 
            //this.map = null; 
			_set_interface();
            //_init_map();
			// Unset total images in imageArray
			settings.imageArray.length = 0;
			settings.imagegeo.length = 0;
			// Unset image active information
			settings.activeImage = 0;
			// We have an image set? Or just an image? Let´s see it.
            
            
			if ( jQueryMatchedObj.length == 1 ) {
				//settings.imageArray.push(new Array(objClicked.getAttribute('href'),objClicked.getAttribute('title')));
				settings.imageArray.push(new Array(_gethref(objClicked),objClicked.getAttribute('title')));
				//_addhref(objClicked);
                _addGeo(objClicked,objClicked.getAttribute('lat'),objClicked.getAttribute('lng'));
			} else {
				// Add an Array (as many as we have), with href and title atributes, inside the Array that storage the images references
                //var lat = jQueryMatchedObj[i].getAttribute('lat');
                //var lng = jQueryMatchedObj[i].getAttribute('lng');
				for ( var i = 0; i < jQueryMatchedObj.length; i++ ) {
					//settings.imageArray.push(new Array(jQueryMatchedObj[i].getAttribute('href'),jQueryMatchedObj[i].getAttribute('title')));
					settings.imageArray.push(new Array(_gethref(jQueryMatchedObj[i]),jQueryMatchedObj[i].getAttribute('title')));
					//_addhref(jQueryMatchedObj[i]);
                    _addGeo(jQueryMatchedObj[i],jQueryMatchedObj[i].getAttribute('lat'),jQueryMatchedObj[i].getAttribute('lng'));
        		}
			}
			while ( settings.imageArray[settings.activeImage][0] != _gethref(objClicked) ) {
			//while ( settings.imageArray[settings.activeImage][0] != objClicked.getAttribute('href') ) {
				settings.activeImage++;
			}
			// Call the function that prepares image exibition
            if ( "Image" == settings.mapOrImage ||  null == settings.imagegeo[settings.activeImage] )
            {
                _set_image_to_view();
            }
            else
            {
                _set_map_to_view();
            }
            //_init_map();
            //_set_map_to_view();
            
		}
        
        function _gethref(obj)
        {
            
            rev_str =  obj.getAttribute('rev');
            //alert(rev_str);
            if ( null != rev_str && rev_str.length > 0 )
            {
                eval("rev_obj = {" + rev_str + "}");
                if ( null != rev_obj.href && rev_obj.href.length > 0 )
                {
            		//settings.imageArray.push(new Array(rev_obj.href,obj.getAttribute('title')));
                    return  rev_obj.href;
                }
            }
    		//settings.imageArray.push(new Array(obj.getAttribute('href'),obj.getAttribute('title')));
            return obj.getAttribute('href');
        }
        
        function _addGeo(obj,lat,lng)
        {
            if ( !( null == lat || null == lng || '' == lat || '' ==lng ) )
            {
                settings.imagegeo.push(new Array(lat,lng));
                return;
            }
            rev_str =  obj.getAttribute('rev');
            //alert(rev_str);
            if ( null == rev_str || '' == rev_str )
            {
                settings.imagegeo.push(null);
                return ;
            }
            
            eval("rev_obj = {" + rev_str + "}");
            //alert(rev_obj);
            if ( !(null == rev_obj.lat || null == rev_obj.lng || '' == rev_obj.lat || '' == rev_obj.lng) )
            {
                settings.imagegeo.push(new Array(rev_obj.lat,rev_obj.lng));
                return ;
            }
            
            settings.imagegeo.push(null);
            /*
            if ( null == lat || null == lng || '' == lat || '' ==lng )
            {
                rev_str =  obj.getAttribute('rev');
                alert(rev_str);
                if ( null == rev_str || '' == rev_str )
                {
                    settings.imagegeo.push(null);
                }
                else
                {
                   // rev_obj =
                    eval("rev_obj = {" + rev_str + "}");
                    alert(rev_obj);
                    if ( null == rev_obj.lat || null == rev_obj.lng || '' == rev_obj.lat || '' == rev_obj.lng )
                    {
                        settings.imagegeo.push(null);
                    }
                    else
                    {
                        settings.imagegeo.push(new Array(rev_obj.lat,rev_obj.lng));
                    }
                }
            }
            else
            {
                settings.imagegeo.push(new Array(lat,lng));
            }
            */
        }
		/**
		 * Create the jQuery lightBox plugin interface
		 *
		 * The HTML markup will be like that:
			<div id="jquery-overlay"></div>
			<div id="jquery-lightbox">
				<div id="lightbox-container-image-box">
					<div id="lightbox-container-image">
						<img src="../fotos/XX.jpg" id="lightbox-image">
						<div id="lightbox-nav">
							<a href="#" id="lightbox-nav-btnPrev"></a>
							<a href="#" id="lightbox-nav-btnNext"></a>
						</div>
						<div id="lightbox-loading">
							<a href="#" id="lightbox-loading-link">
								<img src="../images/lightbox-ico-loading.gif">
							</a>
						</div>
					</div>
				</div>
				<div id="lightbox-container-image-data-box">
					<div id="lightbox-container-image-data">
						<div id="lightbox-image-details">
							<span id="lightbox-image-details-caption"></span>
							<span id="lightbox-image-details-currentNumber"></span>
						</div>
						<div id="lightbox-secNav">
							<a href="#" id="lightbox-secNav-btnClose">
								<img src="../images/lightbox-btn-close.gif">
							</a>
						</div>
					</div>
				</div>
			</div>
		 *
		 */
		function _set_interface() {
			// Apply the HTML markup into body tag
			//$('body').append('<div id="jquery-overlay"></div><div id="jquery-lightbox"><div id="lightbox-container-image-box"><div id="lightbox-container-image"><img id="lightbox-image"><div style="" id="lightbox-nav"><a href="#" id="lightbox-nav-btnPrev"></a><a href="#" id="lightbox-nav-btnNext"></a></div><div id="lightbox-loading"><a href="#" id="lightbox-loading-link"><img src="' + settings.imageLoading + '"></a></div></div></div><div id="lightbox-container-image-data-box"><div id="lightbox-container-image-data"><div id="lightbox-image-details"><span id="lightbox-image-details-caption"></span><span id="lightbox-image-details-currentNumber"></span></div><div id="lightbox-secNav"><a href="#" id="lightbox-secNav-btnClose"><img src="' + settings.imageBtnClose + '"></a></div></div></div></div>');
            $('body').append('<div id="jquery-overlay"></div>'
                                +'<div id="jquery-lightbox">'
                                +'	<div id="lightbox-container-image-box">'
                                //+'  <div id="lightbox-geo-map" style="display:none;width:645px; height:485px">'
                                //+'  <div id="lightbox-geo-map" >'
                                +'      <div id="lightbox-geo-map"  style="width:'+ settings.mapWidth + 'px; height:'+ settings.mapHeight + 'px"></div>'
                                //+'  </div>'
                                //+'  <div id="lightbox-geo-map" style="display:none;width:400px; height:400px"></div>'
                                +'	    <div id="lightbox-container-image">'
                                +'			<img id="lightbox-image">'
                                +'			<div id="lightbox-nav">'
                                +'				<a href="#" id="lightbox-nav-btnPrev"></a>'
                                +'				<a href="#" id="lightbox-nav-btnNext"></a>'
                                +'			</div>'
                                +'		</div>'
								+'		<div id="lightbox-loading">'
                                +'			<a href="#" id="lightbox-loading-link">'
                                +'				<img src="' + settings.imageLoading + '">'
                                +'			</a>'
                                +'		</div>'
                                +'	</div>'

                                //+'  <div id="lightbox-geo-map" style="width:300px; height:300px"></div>'
                                +'	<div id="lightbox-container-image-data-box">'
                                +'		<div id="lightbox-container-image-data">'
                                +'			<div id="lightbox-image-details">'
                                +'				<span id="lightbox-image-details-caption"></span>'
                                +'				<span id="lightbox-image-details-currentNumber"></span>'
                                +'			</div>'
                                +'			<div id="lightbox-secNav">'
//                                +'              <div>'
                                +'				<a href="#" id="lightbox-secNav-btnGEO" title="'+ settings.btnGEOTitle +'">'
                                +'					<img class="function-icon" src="' + settings.imageBtnGEO + '">'
                                +'				</a>'
                                +'				<a href="#" id="lightbox-secNav-btnPIC" title="'+ settings.btnPICTitle +'">'
                                +'					<img class="function-icon" src="' + settings.imageBtnPIC + '">'
                                +'				</a>'
                                //+'              <div>aa'
                                //+'              </div>'
                                //+'               <br/>'
                                //+'              <div id="lightbox-secNav-btnClose-div">'
                                +'				<a href="#" id="lightbox-secNav-btnClose">'
                                +'					<img  src="' + settings.imageBtnClose + '">'
                                +'				</a>'
                                //+'              </div>'
                                +'			</div>'
                                +'		</div>'
                                +'	</div>'
                                +'</div>');
            
			// Get page sizes
			var arrPageSizes = ___getPageSize();
			// Style overlay and show it
			$('#jquery-overlay').css({
				backgroundColor:	settings.overlayBgColor,
				opacity:			settings.overlayOpacity,
				width:				arrPageSizes[0],
				height:				arrPageSizes[1]
			}).fadeIn();
			// Get page scroll
			var arrPageScroll = ___getPageScroll();
			// Calculate top and left offset for the jquery-lightbox div object and show it
			$('#jquery-lightbox').css({
				top:	arrPageScroll[1] + (arrPageSizes[3] / 10),
				left:	arrPageScroll[0]
			}).show();
			// Assigning click events in elements to close overlay
			$('#jquery-overlay').click(function() {
			//$('#jquery-overlay,#jquery-lightbox').click(function() {
				_finish();									
			});
			// Assign the _finish function to lightbox-loading-link and lightbox-secNav-btnClose objects
			$('#lightbox-loading-link,#lightbox-secNav-btnClose').click(function() {
				_finish();
				return false;
			});
            $("#lightbox-secNav-btnGEO").unbind()
										.bind('click',function(){
                 _set_map_to_view();
                //_resize_container_image_box(400,400,false);
                //_show_image(true);
				 return false;
            });
            $("#lightbox-secNav-btnPIC").unbind()
										.click(function(){
                _set_image_to_view();
                //_show_image(false);
				 return false;
            });
			// If window was resized, calculate the new overlay dimensions
			$(window).resize(function() {
				// Get page sizes
				var arrPageSizes = ___getPageSize();
				// Style overlay and show it
				$('#jquery-overlay').css({
					width:		arrPageSizes[0],
					height:		arrPageSizes[1]
				});
				// Get page scroll
				var arrPageScroll = ___getPageScroll();
				// Calculate top and left offset for the jquery-lightbox div object and show it
				$('#jquery-lightbox').css({
					top:	arrPageScroll[1] + (arrPageSizes[3] / 10),
					left:	arrPageScroll[0]
				});
                /*
				$('#lightbox-geo-map').css({
					top:	arrPageScroll[1] + (arrPageSizes[3] / 10),
					left:	arrPageScroll[0]
				});
            */
			});
		}
        function _init_map()
        {
            //var latlng = new google.maps.LatLng(settings.imagegeo[settings.activeImage][0],settings.imagegeo[settings.activeImage][1]);
           // var latlng = new google.maps.LatLng(-34.397, 150.644);
           //var lat,lng,latlng;
            var lat = Number( settings.imagegeo[settings.activeImage][0]);
            var lng = Number( settings.imagegeo[settings.activeImage][1]);
            var latlng = new google.maps.LatLng(lat,lng);
            
            if ( null ==  settings.map)
            {
                //alert("create map");
                var myOptions = {
                  zoom: 15,
                  center: latlng,
                  mapTypeId: google.maps.MapTypeId.ROADMAP
                  //noResize : true
                };
                settings.map = new google.maps.Map(document.getElementById("lightbox-geo-map"), myOptions);
                //settings.map = new google.maps.Map(document.getElementById("lightbox-geo-map-div"), myOptions);
                   
                //for (var i = 0; i < settings.imageArray.length; i++) 
                for (var i = 0; i < settings.imagegeo.length; i++) {
                        var beach = settings.imagegeo[i];
                        if ( null != beach)
                        {
                            var myLatLng = new google.maps.LatLng(Number(beach[0]),Number(beach[1]));
                            //var marker
                            var icon = settings.imageCamera; //'images/beachflag.png';
                            var zIndex = 0;
                            if ( i == settings.activeImage )
                            {
                                icon = settings.imageCurrentCamera; // 'images/camera.jpg';
                                zIndex = 1;
                            }
                                
                            settings.markerArray[i] = new google.maps.Marker({
                                position: myLatLng,
                                map: settings.map,
                                //shadow: shadow,
                                icon:  icon,
                                //shape: shape,
                                title: settings.imageArray[i][1],
                                zIndex: zIndex,
                                clickable: true
                                });
                            settings.markerArray[i].imageindex_number = i;
                            google.maps.event.addListener(settings.markerArray[i], 'click', function() {
                                //alert("map click");
                                //alert("map click:" + this.imageindex_number);
                                settings.activeImage = this.imageindex_number;
                                _set_image_to_view();                                //var b = i;
                                    //alert( + ":" + this.title + " click");
                            });
                        }
                        else
                        {
                            settings.markerArray[i] = null;
                            //alert(i + " is null");
                        }
                }
                //settings.markerArray[settings.activeImage].set_icon('images/camera.png');
			}
            else
            {
                settings.map.setCenter(latlng);
                
                for (var i = 0; i < settings.markerArray.length; i++)
                {
                    if ( i == settings.activeImage )
                    {
                        if (settings.markerArray[settings.activeImage] != null)
                        {
                            settings.markerArray[settings.activeImage].setIcon(settings.imageCurrentCamera);
                        }
                    }
                    else
                    {
                        if ( settings.markerArray[i] != null )
                        {
                            settings.markerArray[i].setIcon(settings.imageCamera);
                        }
                    }
                    /*
                    if ( null != settings.markerArray[i])
                    {
                     google.maps.event.addListener(settings.markerArray[i], 'click', function() {
                                alert("map 2 click:" + this.imageindex_number);
                                settings.activeImage = this.imageindex_number;
                                _set_image_to_view();                                //var b = i;
                                    //alert( + ":" + this.title + " click");
                            });
                     }
                     */
                }
            }
        }
        function _set_map_to_view()
        {
            
			//$('#lightbox-loading').show();
            //$('#lightbox-image').hide();
			if ( settings.fixedNavigation ) {
				$('#lightbox-geo-map,#lightbox-image,#lightbox-container-image-data-box,#lightbox-image-details-currentNumber').hide();
			} else {
				// Hide some elements
				$('#lightbox-geo-map,#lightbox-image,#lightbox-nav,#lightbox-nav-btnPrev,#lightbox-nav-btnNext,#lightbox-container-image-data-box,#lightbox-image-details-currentNumber').hide();
			}
            _resize_container_image_box(settings.mapWidth + 5,settings.mapHeight + 5,false);
            //_show_image(false);
            //_init_map();
            //_show_image_data();
            //$("lightbox-geo-map").click(function(){ alert("test");});
        }
		/**
		 * Prepares image exibition; doing a image´s preloader to calculate it´s size
		 *
		 */
		function _set_image_to_view() { // show the loading
			// Show the loading
			$('#lightbox-loading').show();
			if ( settings.fixedNavigation ) {
				$('#lightbox-geo-map,#lightbox-image,#lightbox-container-image-data-box,#lightbox-image-details-currentNumber').hide();
			} else {
				// Hide some elements
				$('#lightbox-geo-map,#lightbox-image,#lightbox-nav,#lightbox-nav-btnPrev,#lightbox-nav-btnNext,#lightbox-container-image-data-box,#lightbox-image-details-currentNumber').hide();
			}
			// Image preload process
			var objImagePreloader = new Image();
			objImagePreloader.onload = function() {
				$('#lightbox-image').attr('src',settings.imageArray[settings.activeImage][0]);
				// Perfomance an effect in the image container resizing it
				_resize_container_image_box(objImagePreloader.width,objImagePreloader.height,true);
				//	clear onLoad, IE behaves irratically with animated gifs otherwise
				objImagePreloader.onload=function(){};
			};
			objImagePreloader.src = settings.imageArray[settings.activeImage][0];
		};
		/**
		 * Perfomance an effect in the image container resizing it
		 *
		 * @param integer intImageWidth The image´s width that will be showed
		 * @param integer intImageHeight The image´s height that will be showed
		 */
		function _resize_container_image_box(intImageWidth,intImageHeight,shownavigation) {
			// Get current width and height
			var intCurrentWidth = $('#lightbox-container-image-box').width();
			var intCurrentHeight = $('#lightbox-container-image-box').height();
			// Get the width and height of the selected image plus the padding
			var intWidth = (intImageWidth + (settings.containerBorderSize * 2)); // Plus the image´s width and the left and right padding value
			var intHeight = (intImageHeight + (settings.containerBorderSize * 2)); // Plus the image´s height and the left and right padding value
			// Diferences
			var intDiffW = intCurrentWidth - intWidth;
			var intDiffH = intCurrentHeight - intHeight;
			// Perfomance the effect
			$('#lightbox-container-image-box').animate({ width: intWidth, height: intHeight }
                                                       ,settings.containerResizeSpeed
                                                       ,function() { _show_image(shownavigation);
                                                                    if ( false == shownavigation )
                                                                    {
                                                                        _init_map();
                                                                    }
                                                                    
                                                                    });
			if ( ( intDiffW == 0 ) && ( intDiffH == 0 ) ) {
				if ( $.browser.msie ) {
					___pause(250);
				} else {
					___pause(100);	
				}
			} 
			$('#lightbox-container-image-data-box').css({ width: intImageWidth });
			$('#lightbox-nav-btnPrev,#lightbox-nav-btnNext').css({ height: intImageHeight + (settings.containerBorderSize * 2) });
		};
		/**
		 * Show the prepared image
		 *
		 */
		function _show_image(shownavigation) {
			$('#lightbox-loading').hide();
            if (shownavigation)
            {
                $('#lightbox-image').fadeIn(function() {
    				_show_image_data();
    				_set_navigation();
                    //$('#lightbox-geo-map').hide();
                    $('#lightbox-container-image').show();
                    if ( null != settings.imagegeo[settings.activeImage])
                    {
                        $('#lightbox-secNav-btnGEO').show();
													//.unbind('click')
													//.click(function(){ _set_map_to_view(); return false; });
                    }
                    else
                    {
                        $('#lightbox-secNav-btnGEO').hide();
                    }
                    $('#lightbox-secNav-btnPIC').hide();
                    
                });
            }
            else
            {
                    $('#lightbox-container-image').hide();
                    $('#lightbox-geo-map').show();
                    $('#lightbox-secNav-btnPIC').show();
                    $('#lightbox-secNav-btnGEO').hide();
    				_show_image_data();
            }
			_preload_neighbor_images();
		};
		/**
		 * Show the image information
		 *
		 */
		function _show_image_data() {
			$('#lightbox-container-image-data-box').slideDown('fast');
			$('#lightbox-image-details-caption').hide();
			if ( settings.imageArray[settings.activeImage][1] ) {
				$('#lightbox-image-details-caption').html(settings.imageArray[settings.activeImage][1]).show();
			}
			// If we have a image set, display 'Image X of X'
			if ( settings.imageArray.length > 1 ) {
				$('#lightbox-image-details-currentNumber').html(settings.txtImage + ' ' + ( settings.activeImage + 1 ) + ' ' + settings.txtOf + ' ' + settings.imageArray.length).show();
			}
		}
		/**
		 * Display the button navigations
		 *
		 */
		function _set_navigation() {
			$('#lightbox-nav').show();

			// Instead to define this configuration in CSS file, we define here. And it´s need to IE. Just.
			$('#lightbox-nav-btnPrev,#lightbox-nav-btnNext').css({ 'background' : 'transparent url(' + settings.imageBlank + ') no-repeat' });
			
			// Show the prev button, if not the first image in set
			if ( settings.activeImage != 0 ) {
				if ( settings.fixedNavigation ) {
					$('#lightbox-nav-btnPrev').css({ 'background' : 'url(' + settings.imageBtnPrev + ') left 15% no-repeat' })
						.unbind()
						.bind('click',function() {
							settings.activeImage = settings.activeImage - 1;
							_set_image_to_view();
							return false;
						});
				} else {
					// Show the images button for Next buttons
					$('#lightbox-nav-btnPrev').unbind().hover(function() {
						$(this).css({ 'background' : 'url(' + settings.imageBtnPrev + ') left 15% no-repeat' });
					},function() {
						$(this).css({ 'background' : 'transparent url(' + settings.imageBlank + ') no-repeat' });
					}).show().bind('click',function() {
						settings.activeImage = settings.activeImage - 1;
						_set_image_to_view();
						return false;
					});
				}
			}
			
			// Show the next button, if not the last image in set
			if ( settings.activeImage != ( settings.imageArray.length -1 ) ) {
				if ( settings.fixedNavigation ) {
					$('#lightbox-nav-btnNext').css({ 'background' : 'url(' + settings.imageBtnNext + ') right 15% no-repeat' })
						.unbind()
						.bind('click',function() {
							settings.activeImage = settings.activeImage + 1;
							_set_image_to_view();
							return false;
						});
				} else {
					// Show the images button for Next buttons
					$('#lightbox-nav-btnNext').unbind().hover(function() {
						$(this).css({ 'background' : 'url(' + settings.imageBtnNext + ') right 15% no-repeat' });
					},function() {
						$(this).css({ 'background' : 'transparent url(' + settings.imageBlank + ') no-repeat' });
					}).show().bind('click',function() {
						settings.activeImage = settings.activeImage + 1;
						_set_image_to_view();
						return false;
					});
				}
			}
			// Enable keyboard navigation
			_enable_keyboard_navigation();
		}
		/**
		 * Enable a support to keyboard navigation
		 *
		 */
		function _enable_keyboard_navigation() {
			$(document).keydown(function(objEvent) {
				_keyboard_action(objEvent);
			});
		}
		/**
		 * Disable the support to keyboard navigation
		 *
		 */
		function _disable_keyboard_navigation() {
			$(document).unbind();
		}
		/**
		 * Perform the keyboard actions
		 *
		 */
		function _keyboard_action(objEvent) {
			// To ie
			if ( objEvent == null ) {
				keycode = event.keyCode;
				escapeKey = 27;
			// To Mozilla
			} else {
				keycode = objEvent.keyCode;
				escapeKey = objEvent.DOM_VK_ESCAPE;
			}
			// Get the key in lower case form
			key = String.fromCharCode(keycode).toLowerCase();
			// Verify the keys to close the ligthBox
			if ( ( key == settings.keyToClose ) || ( key == 'x' ) || ( keycode == escapeKey ) ) {
				_finish();
			}
			// Verify the key to show the previous image
			if ( ( key == settings.keyToPrev ) || ( keycode == 37 ) ) {
				// If we´re not showing the first image, call the previous
				if ( settings.activeImage != 0 ) {
					settings.activeImage = settings.activeImage - 1;
					_set_image_to_view();
					_disable_keyboard_navigation();
				}
			}
			// Verify the key to show the next image
			if ( ( key == settings.keyToNext ) || ( keycode == 39 ) ) {
				// If we´re not showing the last image, call the next
				if ( settings.activeImage != ( settings.imageArray.length - 1 ) ) {
					settings.activeImage = settings.activeImage + 1;
					_set_image_to_view();
					_disable_keyboard_navigation();
				}
			}
		}
		/**
		 * Preload prev and next images being showed
		 *
		 */
		function _preload_neighbor_images() {
			if ( (settings.imageArray.length -1) > settings.activeImage ) {
				objNext = new Image();
				objNext.src = settings.imageArray[settings.activeImage + 1][0];
			}
			if ( settings.activeImage > 0 ) {
				objPrev = new Image();
				objPrev.src = settings.imageArray[settings.activeImage -1][0];
			}
		}
		/**
		 * Remove jQuery lightBox plugin HTML markup
		 *
		 */
		function _finish() {
			$('#jquery-lightbox').remove();
			$('#jquery-overlay').fadeOut(function() { $('#jquery-overlay').remove(); });
			// Show some elements to avoid conflict with overlay in IE. These elements appear above the overlay.
            settings.map = null;
            for (var i = 0; i < settings.markerArray.length; i++) 
            {
                settings.markerArray[i] = null;
            }
            $('embed, object, select').css({ 'visibility' : 'visible' });
		}
		/**
		 / THIRD FUNCTION
		 * getPageSize() by quirksmode.com
		 *
		 * @return Array Return an array with page width, height and window width, height
		 */
		function ___getPageSize() {
			var xScroll, yScroll;
			if (window.innerHeight && window.scrollMaxY) {	
				xScroll = window.innerWidth + window.scrollMaxX;
				yScroll = window.innerHeight + window.scrollMaxY;
			} else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
				xScroll = document.body.scrollWidth;
				yScroll = document.body.scrollHeight;
			} else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
				xScroll = document.body.offsetWidth;
				yScroll = document.body.offsetHeight;
			}
			var windowWidth, windowHeight;
			if (self.innerHeight) {	// all except Explorer
				if(document.documentElement.clientWidth){
					windowWidth = document.documentElement.clientWidth; 
				} else {
					windowWidth = self.innerWidth;
				}
				windowHeight = self.innerHeight;
			} else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
				windowWidth = document.documentElement.clientWidth;
				windowHeight = document.documentElement.clientHeight;
			} else if (document.body) { // other Explorers
				windowWidth = document.body.clientWidth;
				windowHeight = document.body.clientHeight;
			}	
			// for small pages with total height less then height of the viewport
			if(yScroll < windowHeight){
				pageHeight = windowHeight;
			} else { 
				pageHeight = yScroll;
			}
			// for small pages with total width less then width of the viewport
			if(xScroll < windowWidth){	
				pageWidth = xScroll;		
			} else {
				pageWidth = windowWidth;
			}
			arrayPageSize = new Array(pageWidth,pageHeight,windowWidth,windowHeight);
			return arrayPageSize;
		};
		/**
		 / THIRD FUNCTION
		 * getPageScroll() by quirksmode.com
		 *
		 * @return Array Return an array with x,y page scroll values.
		 */
		function ___getPageScroll() {
			var xScroll, yScroll;
			if (self.pageYOffset) {
				yScroll = self.pageYOffset;
				xScroll = self.pageXOffset;
			} else if (document.documentElement && document.documentElement.scrollTop) {	 // Explorer 6 Strict
				yScroll = document.documentElement.scrollTop;
				xScroll = document.documentElement.scrollLeft;
			} else if (document.body) {// all other Explorers
				yScroll = document.body.scrollTop;
				xScroll = document.body.scrollLeft;	
			}
			arrayPageScroll = new Array(xScroll,yScroll);
			return arrayPageScroll;
		};
		 /**
		  * Stop the code execution from a escified time in milisecond
		  *
		  */
		 function ___pause(ms) {
			var date = new Date(); 
			curDate = null;
			do { var curDate = new Date(); }
			while ( curDate - date < ms);
		 };
		// Return the jQuery object for chaining. The unbind method is used to avoid click conflict when the plugin is called more than once
		return this.unbind('click').click(_initialize);
	};
})(jQuery); // Call and execute the function immediately passing the jQuery object
