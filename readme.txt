=== Plugin Name ===
Contributors: daozhao chen
Donate link: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=5855418
Tags: page, flickr, images, picture, photo, geo, map,
Requires at least: 2.7
Tested up to: 3.2.1
Stable tag: 0.5

Show the big image in lightbox and show the point in the map.

== Description ==
version 0.5:
First version for this plugin.

You can see demo page at <a href="http://daozhao.goflytoday.com/2009/08/malaysia-kuala-lumpur-picture/" target="_blank">http://daozhao.goflytoday.com/2009/08/malaysia-kuala-lumpur-picture/</a>
You insert the photo like it:
&lt;a class="alignnone" title="photo title 1" href="http://www.flickr.com/photos/daozhao/3864377226/" rel="lightbox" rev="href:'http://farm4.static.flickr.com/3455/3864377226_1d3d2d5dcb.jpg',lat:3.155186,lng:101.718041" target="_blank"&gt;
&lt;img class="alignnone" src="http://farm4.static.flickr.com/3455/3864377226_1d3d2d5dcb_t.jpg" alt="photo title 1" width="100" height="67" /&gt;
&lt;/a&gt; 

You must add the geo lightbox information in &lt;a&gt; rev="href:'http://farm4.static.flickr.com/3455/3864377226_1d3d2d5dcb.jpg',lat:3.155186,lng:101.718041"
href:'http://farm4.static.flickr.com/3455/3864377226_1d3d2d5dcb.jpg  is lightbox big image.
lat:3.155186,lng:101.718041 is geo information

You can use my other plugin easy to add flick photo with geo.(<a href="http://wordpress.org/extend/plugins/add-flickr-photo-with-geo-tag/" target="_blank">http://wordpress.org/extend/plugins/add-flickr-photo-with-geo-tag/</a>)


and you can alse add some image in one page,like it:
&lt;a class="alignnone" title="photo title 2" href="http://www.flickr.com/photos/daozhao/3864376534/" rel="lightbox" rev="href:'http://farm4.static.flickr.com/3526/3864376534_9f16d4a28f.jpg',lat:3.110791,lng:101.653747" target="_blank"&gt;
&lt;img class="alignnone" src="http://farm4.static.flickr.com/3526/3864376534_9f16d4a28f_t.jpg" alt="photo title 2" width="100" height="67" /&gt;
&lt;/a&gt; 

&lt;a class="alignnone" title="photo title 3" href="http://www.flickr.com/photos/daozhao/3864375970/" rel="lightbox" rev="href:'http://farm4.static.flickr.com/3424/3864375970_85751205a3.jpg',lat:3.116816,lng:101.649841" target="_blank"&gt;
&lt;img class="alignnone" src="http://farm4.static.flickr.com/3424/3864375970_85751205a3_t.jpg" alt="photo title 3" width="100" height="67" /&gt;
&lt;/a&gt;


== Installation ==

1. Upload `geo-lightbox.php`,`jquery.Geolightbox-0.5.js` to the `/wp-content/plugins/geo-lightbox` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Go to setting pages "Geo Lightbox",but nothing to set.the plugin is already working.



== Screenshots ==

Steps

1. Lightbox show photo
2. Lightbox show the point at the map

