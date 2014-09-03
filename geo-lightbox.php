<?php
/**
 * Plugin Name: Geo lightbox
 * Plugin URI: 
 * Description: Geo lightbox 
 * Version: 0.9
 * Author: daozhao chen 
 * Author URI: http://daozhao.goflytoday.com
 *
 * @copyright 2014
 * @version 0.9
 * @author daozhao chen
 * @link http://daozhao.goflytoday.com/
 * @license MIT
 *
 */

/**
 * Add page shortcodes
 */

add_action('plugins_loaded','wp_daozhao_geo_lightbox_loadjs' );

function wp_daozhao_geo_lightbox_loadjs ()
{
    if (is_admin() || !function_exists('plugins_url')) return;
      
    $path = plugins_url('/geo-lightbox/');
      
	//wp_enqueue_script('google-map-api-v3', 'http://maps.google.com/maps/api/js?sensor=false', array(),"3.0");			
    //wp_enqueue_script('geo-lightbox', $path.'jquery.Geolightbox-0.5.js', array('jquery'), '0.5');
	wp_enqueue_style('geo-lightbox', $path . 'css/jquery.geolightbox-0.5.css', array(), '1.0');			
      
    
}

add_action('wp_footer', 'wp_daozhao_geo_lightbox_footer');

function wp_daozhao_geo_lightbox_footer()
{
    
    if (is_admin() || !function_exists('plugins_url')) return;
      
    $path = plugins_url('/geo-lightbox/');
      
//	wp_enqueue_script('google-map-api-v3', 'http://maps.google.com/maps/api/js?sensor=false', array(),"3.0");			
    wp_enqueue_script('geo-lightbox', $path.'jquery.Geolightbox-0.5.js', array('jquery'), '0.5');
//	wp_enqueue_style('geo-lightbox', $path . 'css/jquery.geolightbox-0.5.css', array(), '1.0');			
 
	?>
	<script type="text/javascript">
		jQuery(document).ready(function(){
            var geo_lightbox_image_path = "<?php echo $path ?>";
            jQuery('a[rel*=lightbox]').autoGeoLightbox(
                       			{
                                imageLoading:	geo_lightbox_image_path + 'images/lightbox-ico-loading.gif',
                    			imageBtnPrev:	geo_lightbox_image_path + 'images/lightbox-btn-prev.gif',
                    			imageBtnNext:	geo_lightbox_image_path + 'images/lightbox-btn-next.gif',
                    			imageBtnClose:	geo_lightbox_image_path + 'images/lightbox-btn-close.gif',
                    			imageBtnPIC:	geo_lightbox_image_path + 'images/lightbox-btn-pic.png',
                    			imageBtnGEO:	geo_lightbox_image_path + 'images/lightbox-btn-geo.png',
                    			imageBlank:	    geo_lightbox_image_path + 'images/lightbox-blank.gif',
                                imageCamera:           geo_lightbox_image_path + 'images/beachflag.png',
								imageCurrentCamera:  geo_lightbox_image_path +   'images/camera_geo.png'                               
							   	}
                               );
            jQuery.getScript( "http://maps.google.com/maps/api/js?sensor=false&callback=after_load_google" )
                .done(function( script, textStatus ) {
                    //console.log( "load google map is ok");
                })
                .fail(function( jqxhr, settings, exception ) {
                    //console.log( "load google map error" );
                });
		});
    function after_load_google(){
        //console.log( "load google map is done");
    }
	</script>
<?php
    
}

add_action('admin_menu', 'wp_daozhao_geo_lightbox_menu');

function wp_daozhao_geo_lightbox_menu()
{
    add_options_page('Geo Lightbox', 'Geo Lightbox', 8,basename(__FILE__), 'wp_daozhao_geo_lightbox_options');
}

function wp_daozhao_geo_lightbox_options()
{
    if($_POST["wp_DTD_Submit"]
        && ( strlen(trim($_POST['wp_DTD_id'])) < 1
        || strlen(trim($_POST['wp_DTD_description'])) < 1 ) ){
    }    
    else if($_POST["wp_DTD_Submit"]){
    }
?>
    <h2>Geo Lightbox setting</h2>
    <hr/>
    <form method="post" action="<?php echo $_SERVER['PHP_SELF']; ?>?page=<?php echo basename(__FILE__); ?>">
    </form>
        
<?php
}

?>
