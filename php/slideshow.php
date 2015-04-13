<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Slideshow holder</title>
<style>
/* include the styles here from the .css file that could change */
body {
 background-color:#000;
}
.galleria-container {
	position: relative;
	overflow: hidden;
 background: #000;
}
.galleria-stage {
	position: absolute;
	top:  12px;
 bottom: 17px;
	left: 10px;
	right: 10px;
	overflow:hidden;
}
.galleria-thumbnails-container {
 height: 50px;
 bottom: 0px;
	position: absolute;
	left: 10px;
	right: 10px;
	z-index: 2;
}
.galleria-carousel .galleria-thumbnails-list {
 margin-left: 30px;
 margin-right: 30px;
}
.galleria-thumbnails .galleria-image {
 height: 40px;
 width: 60px;
	background: #000;
	margin: 0 5px 0 0;
	border: 0px solid #000;
	float: left;
	cursor: pointer;
}
.galleria-thumb-nav-left, .galleria-thumb-nav-right {
	cursor: pointer;
	display: none;
	background-position: -495px 5px;
	position: absolute;
	left: 0;
 top: 0;
	height: 40px;
	width: 23px;
	z-index: 3;
	opacity: .8;
	filter: alpha(opacity=80);
}
.galleria-thumb-nav-right {
	background-position: -578px 5px;
	border-right: none;
	right: 0;
	left: auto;
}
.galleria-credit {
 color:#ccc;
	font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
	font-size:57%;

	bottom: 5px;
	position: absolute;
	
	right: 20px;
	z-index: 4;
}
a:link, a:visited, a:active, a:focus {
 color:#ccc;
}
a:hover {
	color:#3b9f3b;
}
.content {
	width:100%;
	height:0px;
}
.galleria-info-link {
	background-position: -669px -5px;
	opacity: .7;
	filter: alpha(opacity=70);
	position: absolute;
	width: 20px;
	height: 20px;
	cursor: pointer;
 background-color: #000;
}
#galleria {
	width:100%;
 }
.galleria-thumb-nav-left, .galleria-thumb-nav-right, .galleria-info-link, .galleria-info-close, .galleria-image-nav-left, .galleria-image-nav-right {
 background-image: url(/themes/classic-map.png);
	background-repeat: no-repeat;
}
.galleria-image-nav-left, .galleria-image-nav-right {
 opacity: 0.3;
	filter: alpha(opacity=30);
	cursor: pointer;
	width: 62px;
	height: 124px;
	position: absolute;
	left: 10px;
	z-index: 2;
	background-position: 0 46px;
}
.galleria-image-nav-right {
	left: auto;
	right: 10px;
	background-position: -254px 46px;
	z-index: 2;
}
.notouch .galleria-thumb-nav-left:hover, .notouch .galleria-thumb-nav-right:hover {
	opacity: 1;
	filter: alpha(opacity=100);
}
.touch .galleria-thumb-nav-left:active, .touch .galleria-thumb-nav-right:active {
	opacity: 1;
	filter: alpha(opacity=100);
}

.galleria-info {
	top:  12px;
	left: 10px;
	right: 10px;
    z-index: 2;
    position: absolute;
}

</style>

<!-- load jQuery -->
<script src="//ajax.googleapis.com/ajax/libs/jquery/1/jquery.js"></script>

<!-- load Galleria -->
<script src="//cdnjs.cloudflare.com/ajax/libs/galleria/1.4.2/galleria.min.js"></script>

<!-- load flickr plugin -->
<script src="js/galleria.flickr.min.js"></script>

</head>
<body>
<div class="content"> 
  
  <!-- Adding gallery images. This is just a container for the dynamic flickr images -->
  <div id="galleria"></div>
</div>
<script>
	var speed = 5000;var clickNext = false;Galleria.loadTheme('themes/galleria.classic.min.js');
	// handle image changing
Galleria.on('image', function(e){
            var img = e.imageTarget;
            var picSource = $(img).attr("src");
            if (picSource == undefined){
            picSource = $("img:first").attr("src");
            }
            var slashPieces = picSource.split("/");   
            var lastSlash = (slashPieces[slashPieces.length -1]);
            var lastPieces = lastSlash.split("_");
            var newUrl = "http://flickr.com/photo.gne?id=" + lastPieces[0];
            $("#flick").attr("href", newUrl);
            });
	
Galleria.run('#galleria', {autoplay: speed,responsive: true,preload:4,initialTransition: 'fade',debug:true,idleMode:false,pauseOnInteraction: true,fullscreenDoubleTap: false,backlink:false,transition: 'slide',showInfo: false,showCounter: false,clicknext: clickNext,thumbnails: 'none', flickrOptions: {description: true,max: 30,imageSize: '',sort: 'interestingness-desc',
thumbSize : 'thumb',},extend: function() {var gallery = this;this.$('image-nav-right').click(function() {if (speed){if (!gallery.isPlaying() && !clickNext){gallery.play();	} else if (clickNext){if (!gallery.isPlaying()){gallery.play();	}}}});this.$('thumb-nav-left, thumb-nav-right').click(function() {if (gallery.isPlaying()){gallery.pause();	}});$("#flick").click(function() {gallery.pause();});}});
 
 
 $(document).ready(function(){
 var iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false );
 var layout = "";
 if(iOS && layout == "responsive"){
	 // change bottom point for iOS
 $("#creditDiv").css("bottom", "25px");
 }
 });
 
 </script>

  

</body>
</html>
