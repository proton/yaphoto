obj_to_arr = function (obj) {
	var vls = [];
	for (var key in obj) {
		vls.push(obj[key]);
	}
	return vls;
};

function onWindowResize() {
  var el = document.getElementById('photos_block');
  $scope = angular.element(el).scope();
  $scope.$apply(function() {
    $scope.photos_block_width = el.offsetWidth;
    $scope.setPhoto();
  });
};
document.addEventListener("DOMContentLoaded", onWindowResize, false);
window.onresize = onWindowResize;

(function(){
	var app = angular.module('app', ['ngRoute']);

	// app.config(function($routeProvider) {
	// 	$routeProvider
	// 		.when('/', {resolve: {redirect: 'PhotosController'}})
	// 		.when('/albums/:album_id', {
	// 			template: '',
	// 			controller: 'PhotosController'
	// 		})
	// 		.when('/tags/:tag_id', {
	// 			template: '',
	// 			controller: 'PhotosController'
	// 		})
	// 		.otherwise({ redirectTo:'/' });
	// })

	app.controller('PhotosController', ['$scope', '$location', '$routeParams', '$http', '$window', function($scope, $location, $routeParams, $http, $window){
		var c = this;

		$scope.albums = [];
		$scope.tags = [];
		$scope.photos = [];
		$scope.loaded = false;
		$scope.index = null;
		$scope.photo = null;
		$scope.current_image = null;

		$scope.code_url = null;
		$scope.code_thumb = null;

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

		this.reloadPhotos = function(){
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
			url += '/photos/?format=json&callback=JSON_CALLBACK';
			$http({ method: "JSONP", url: url}).success(function(data){
				$scope.photos = data.entries;
				c.setIndex(0);
			});
		}

		this.reloadPhotos();

		$scope.setPhoto = function(){
			$scope.photo = ($scope.photos.length==0 || $scope.index==-1) ? null : $scope.photos[$scope.index];
			if($scope.photo)
			{
				var f = function(img){ return img.width>=$scope.photos_block_width; };
				var images = $scope.photo.img;
				var p = obj_to_arr(images).filter(f)[0] || images.orig || images.XL;
				$scope.current_image = p.href;
			}
			else
			{
				$scope.current_image = null;
			}
		};

		this.setIndex = function(index){
			$scope.index = index;
			$scope.setPhoto();
		};

		$scope.to_id = function(t){
			return decodeURI(t.id.split(':')[5]);
		};

		$scope.$on('$locationChangeSuccess', function (event) {
			var location_array = $location.$$path.split('/');
			$scope.album_id = location_array[1]=='albums' ? location_array[2] : null;
			$scope.tag_id = location_array[1]=='tags' ? location_array[2] : null;
			c.reloadPhotos();
		});
	}]);
})();