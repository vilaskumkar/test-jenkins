angular.module('tempApp', [])
	.controller('tempApp.getBears.controller', ['$scope', '$http', function($scope, $http){
		$scope.export2excel = getAllBears;
		$scope.createBear = createBear;

		function getAllBears(bearsData){
			console.log('start');
			console.time();
			$http({
				method: 'GET',
				url: 'http://localhost:9998/api/bears'
			}).then(function successCallback(response) {
				// debugger;
				bearsData = response.data;
				export2excel(bearsData);
			// this callback will be called asynchronously
			// when the response is available
			}, function errorCallback(response) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			});
		};

		function export2excel(bearsData) {
			// debugger;
			$http({
				method: 'POST',
				url: 'http://localhost:9998/api/export',
				data : bearsData
			}).then(function successCallback(response) {
				// debugger;
				console.log('end');
				console.timeEnd();
				window.open('http://localhost:9998/downloadFile/' + response.data.csvFile);

			// this callback will be called asynchronously
			// when the response is available
			}, function errorCallback(response) {
				// debugger;
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			});
		}

		function createBear(bear) {
			$http({
				method: 'POST',
				url: 'http://localhost:9998/api/bears',
				data : bear
			});
			/*
			var tempCount = 20000;
			for (var i = 0; i < tempCount; i++) {
				if (i == tempCount) {
					alert(tempCount + ' record(s) inserted !!!');
				}
			}
			*/
		}


	}]);