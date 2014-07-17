obj_to_arr = function (obj) {
	var vls = [];
	for (var key in obj) {
		vls.push(obj[key]);
	}
	return vls;
};

// Object.values = function (obj) {
//     var vals = [];
//     for( var key in obj ) {
//         if ( obj.hasOwnProperty(key) ) {
//             vals.push(obj[key]);
//         }
//     }
//     return vals;
// }

// fotorama_config = {

// };

// function photo_to_item(photo)
// {
// 	return {img: photo.img.XL.href, thumb: photo.img.L.href, full: photo.img.orig.href};
// }

// var load_count = 0;

(function(){
	var app = angular.module('app', ['ngRoute']);

	app.controller('PhotosController', ['$scope', '$http', '$window', function($scope, $http, $window){
		$scope.albums = [];
		$scope.tags = [];
		$scope.photos = [];
		$scope.loaded = false;
		$scope.index = null;
		$scope.photo = null;
		$scope.current_image = null;

		//TODO: грузит не все фотки, а только 100 первых
		var url = config.url+'/users/'+config.user+'/albums/?format=json&callback=JSON_CALLBACK';
		$http({ method: "JSONP", url: url}).success(function(data){
			$scope.albums = data.entries;
		});
		//TODO: грузит не все, а только 100 первых
		var url = config.url+'/users/'+config.user+'/tags/?format=json&callback=JSON_CALLBACK';
		$http({ method: "JSONP", url: url}).success(function(data){
			$scope.tags = data.entries;
		});
		//TODO: грузит не все, а только 100 первых
		var url = config.url+'/users/'+config.user+'/photos/?format=json&callback=JSON_CALLBACK';
		$http({ method: "JSONP", url: url}).success(function(data){
			$scope.photos = data.entries;
		});
		// $scope.$on('$imageLoaded', function () {
		// 	if (load_count++ === $scope.photos.length - 1) {
		// 		console.log('finish');
		// 		$('.fotorama').fotorama();
		// 	}
		// });

			this.setPhoto = function(){
				$scope.photo = ($scope.photos.length==0 || $scope.index==-1) ? null : $scope.photos[$scope.index];
				if($scope.photo)
				{
					var f = function(img){ return img.width>=$window.innerWidth; };
					var p = obj_to_arr($scope.photo.img).filter(f)[0] || $scope.photo.img.orig;
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

			$scope.$watch(
				function(){ console.log(123); return $window.innerWidth; },
				function(value){ console.log(value); }
			);
	}]);

	// app.directive('loadDispatcher', function() {
 //  	return {
 //      restrict: 'A',
 //      link: function($scope, element, attrs) {
 //      		element.bind('load', function() {
 //          $scope.$emit('$imageLoaded');
 //        });
 //      }
 //    };
	// })
})();



		// app.directive('tagsManager', function () {
		//  return {
		//      restrict: 'A',
		//      link: function (scope, element, attrs) {
		//        $('.fotorama').fotorama();
		//        console.log(c);
		//      }
		//    }
		//  });

		// $scope.options = {
		// 	width: '100%',
		// 	height: 400,
		// 	loop: true,
		// 	keyboard: true,
		// 	nav: 'thumbs',
		// 	load: function (e, extra) {
		//     console.log(extra); //{user: undefined/true} дополнительные данные
		//   },
		// };

		// this.thumb = function(photo){
		// 	return photo.img.M.width>=300 ? photo.img.M : photo.img.L;
		// }

// .config(function($routeProvider) {
//   $routeProvider
//     .when('/', {
//       controller: 'PhotosController',
//       templateUrl: 'photos.htm'
//     })
//     // .when('/edit/:projectId', {
//     //   controller:'EditCtrl',
//     //   templateUrl:'detail.html'
//     // })
//     // .when('/new', {
//     //   controller:'CreateCtrl',
//     //   templateUrl:'detail.html'
//     // })
//     .otherwise({ redirectTo:'/' });
// })
// .controller('PhotosController', function($scope, Photos) {
// 	console.log(123);
//   $scope.photos = Photos;
// });


// var app = angular.module('yaph', []);
	
// var album = {
// 	id: 158281,
// 	title: 'Шестая всероссийская Встреча Лаборатории Фантастики'
// }

// var photo = {
// 	url: 'http://img-fotki.yandex.ru/get/9251/25165086.1e/0_ae89d_3e69c70c_XXL'
// }

// app.controller('AlbumsController', function(){
//   this.album = album;
// });

// app.controller('PhotosController', function(){
//   this.photo = photo;
// });

// api_url+'/users/'+user+'/?format=json&callback=callback'