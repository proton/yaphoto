obj_to_arr = function (obj) {
	var vls = [];
	for (var key in obj) {
		vls.push(obj[key]);
	}
	return vls;
};

// Object.values = function (obj) {
//		 var vals = [];
//		 for( var key in obj ) {
//				 if ( obj.hasOwnProperty(key) ) {
//						 vals.push(obj[key]);
//				 }
//		 }
//		 return vals;
// }

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

		this.setPhoto = function(){
			$scope.photo = ($scope.photos.length==0 || $scope.index==-1) ? null : $scope.photos[$scope.index];
			if($scope.photo)
			{
				var f = function(img){ return img.width>=$window.innerWidth; };
				var images = $scope.photo.img;
				var p = obj_to_arr(images).filter(f)[0] || images.orig || images.XL;
				$scope.current_image = p.href;
			}
			else
			{
				$scope.current_image = null;
			}
		};

		// $scope.photo = function(){
		// 	if($scope.photos.length==0) return null;
		// 	return $scope.photos[$scope.photo_index];
		// };

		this.setIndex = function(index){
			$scope.index = index;
			this.setPhoto();
		};

		$scope.to_id = function(t){
			return decodeURI(t.id.split(':')[5]);
		}

		// $scope.$watch(
		// 	function(){ return $window.innerWidth; },
		// 	function(value){ console.log(value); }
		// );

		$scope.$on('$locationChangeSuccess', function (event) {
			var location_array = $location.$$path.split('/');
			$scope.album_id = location_array[1]=='albums' ? location_array[2] : null;
			$scope.tag_id = location_array[1]=='tags' ? location_array[2] : null;
			c.reloadPhotos();
		});
	}]);

	// app.directive('loadDispatcher', function() {
 //		return {
 //			restrict: 'A',
 //			link: function($scope, element, attrs) {
 //					element.bind('load', function() {
 //					$scope.$emit('$imageLoaded');
 //				});
 //			}
 //		};
	// })
})();



// app.directive('tagsManager', function () {
//	return {
//			restrict: 'A',
//			link: function (scope, element, attrs) {
//				$('.fotorama').fotorama();
//				console.log(c);
//			}
//		}
//	});

// $scope.options = {
// 	width: '100%',
// 	height: 400,
// 	loop: true,
// 	keyboard: true,
// 	nav: 'thumbs',
// 	load: function (e, extra) {
//		 console.log(extra); //{user: undefined/true} дополнительные данные
//	 },
// };

// this.thumb = function(photo){
// 	return photo.img.M.width>=300 ? photo.img.M : photo.img.L;
// }