obj_to_arr = function (obj) {
	var vls = [];
	for (var key in obj) {
		vls.push(obj[key]);
	}
	return vls;
};

var fotorama_config = {
  width: '100%',
  height: 800,
  loop: true,
  nav: 'thumbs',
  navposition: 'top',
  fit: 'cover',
  keyboard: true,
  arrows: true,
  click: true,
  swipe: true,
  allowfullscreen: true
};

function photo_to_obj(photo)
{
	var full_photo = photo.img.orig || photo.img.XXXL || photo.img.XL || photo.img.L;
	var full = full_photo.href;
	var thumb = photo.img.XS.href;
	return {img: full, thumb: thumb};

 //  img: '1.jpg',
 //  thumb: '1-thumb.jpg',
 //  full: '1-full.jpg', // Separate image for the fullscreen mode.
 //  id: 'one', // Custom anchor is used with the hash:true option.
 //  caption: 'The first caption',
 //  html: $('selector'), // ...or '<div>123</div>'. Custom HTML inside the frame.
 //  fit: 'cover', // Override the global fit option.
 //  any: 'Any data relative to the frame you want to store'
}

// function onWindowResize() {
//   var el = document.getElementById('photos_block');
//   $scope = angular.element(el).scope();
//   $scope.$apply(function() {
//     $scope.photos_block_width = el.offsetWidth;
//     $scope.setPhoto();
//   });
// };
// document.addEventListener("DOMContentLoaded", onWindowResize, false);
// window.onresize = onWindowResize;

(function(){
	var app = angular.module('app', ["pageslide-directive"]);

	app.controller('PhotosController', ['$scope', '$location', '$http', '$window', function($scope, $location, $http, $window){
		var c = this;

		$scope.albums = [];
		$scope.tags = [];
		$scope.photos = [];
		$scope.loaded = false;
		$scope.photo = null;
		$scope.current_image = null;
		$scope.loader = true;
		$scope.first_time = true;

		$scope.fotorama = $('#gallery').fotorama(fotorama_config).data('fotorama');

		var base_url = config.url+'/users/'+config.user;
		//TODO: грузит не все фотки, а только 100 первых
		var url = base_url+'/albums/?format=json&callback=JSON_CALLBACK';
		$http({ method: "JSONP", url: url}).success(function(data){
			$scope.albums = data.entries;
		});
		//TODO: грузит не все, а только 100 первых
		var url = base_url+'/tags/?format=json&callback=JSON_CALLBACK';
		$http({ method: "JSONP", url: url}).success(function(data){
			$scope.tags = data.entries;
		});

		this.loadAdditionalPhotos = function(url){
			$http({ method: "JSONP", url: url+'&callback=JSON_CALLBACK'}).success(function(data){
				$scope.photos.push.apply($scope.photos, data.entries);
				if(($scope.album_id || $scope.tag_id) && data.links.next) c.loadAdditionalPhotos(data.links.next);
				else
				{
					$scope.fotorama.load($scope.photos.map(photo_to_obj));
					if(typeof($scope.index) != 'undefined') $scope.fotorama.show($scope.index);
					$scope.loader = false;
				}
			});
		};

		this.reloadPhotos = function(){
			$scope.loader = true;
			url = base_url;
			//TODO: грузит не все, а только 100 первых
			if($scope.album_id)
			{
				url += '/album/'+$scope.album_id;
			}
			else if($scope.tag_id)
			{
				url += '/tag/'+$scope.tag_id;
			}
			url += '/photos/?format=json';
			$scope.photos = [];
			this.loadAdditionalPhotos(url);
		};

		this.getUrl = function(){
			var url = '/';
			if($scope.album_id) url+='albums/'+$scope.album_id+'/'
			else if($scope.tag_id) url+='tags/'+$scope.tag_id+'/'
			url+=$scope.index;
			return url;
		}

		$scope.to_id = function(t){
			return decodeURI(t.id.split(':')[5]);
		};

		$('#gallery').on('fotorama:showend', function (e, fotorama) {
			if($scope.first_time) $scope.first_time = false;
			else  $scope.index = $scope.fotorama.activeIndex;
			var photo = $scope.photos.length==0 ? null : $scope.photos[$scope.index];
			$scope.skip_routes = true;
			$location.path(c.getUrl(), false);
			if($scope.$$phase) $scope.photo = photo;
			else $scope.$apply(function(){ $scope.photo = photo; });
		});

		$scope.$on('$locationChangeSuccess', function (event) {
			if(!$scope.skip_routes)
			{
				var location_array = $location.$$path.split('/');
				$scope.album_id = location_array[1]=='albums' ? location_array[2] : null;
				$scope.tag_id = location_array[1]=='tags' ? location_array[2] : null;
				var has_chapt = ($scope.album_id || $scope.tag_id);
				if(has_chapt && location_array.length>3)
				{
					$scope.index = parseInt(location_array[3], 10);
				}
				else if(!has_chapt && location_array.length>1)
				{
					$scope.index = parseInt(location_array[1], 10);
				}
				x = $scope.index;
				c.reloadPhotos();
			}
			$scope.skip_routes = false;
		});
	}]);
})();