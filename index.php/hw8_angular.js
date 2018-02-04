// Angular File
function toggleAlbumPhotos(currentElement){
    if($(currentElement).next().css("display") == 'block'){
        $("[id$='Photo']").slideUp(1000);
    }

    if($(currentElement).next().css("display") == 'none'){
        $("[id$='Photo']").slideUp(1000);
        $(currentElement).next().removeClass("ng-hide");
        $(currentElement).next().slideDown(1000);
    } 
}

var fbApp = angular.module('fbApp', ['ngAnimate']);

fbApp.controller('fbController',
    function($scope, $http, $timeout){

        $scope.init = function(){
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition);
            } else {
                alert("Geolocation is not supported by this browser.");
            }

            function showPosition(position) {
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;
                console.log("Latitude: " + position.coords.latitude + "Longitude: " + position.coords.longitude);

                $scope.lat = latitude;
                $scope.lon = longitude;
            }
        }
        $scope.init();

        $('.dataTableHide').hide();
        $('#detailTableHide').hide();
        $('#favoriteTableHide').hide();
        $scope.albumHide = true;        // no album warning
        $scope.postHide = true;         // no post warning
        $scope.progressBar = true;      // first progress bar
        $scope.albumProgress = true;    // albums progress bar
        $scope.postProgress = true;     // post progress bar
        $scope.albumPanels = true;      // albums panel
        $scope.postPanels = true;       // post panel
        $scope.firstAlbum = false;      // show first album by default
        $scope.searchType = "basic";
        $scope.type = "user";
        $scope.allData = [];
        $scope.favoriteData = [];
        $scope.access_token = "EAADKOmnHGVUBAFroyquKST6mZA2uXw2BbR8JWSWBBVYnQGVzg8nsyPZCzOU5OLnwqzIZCh7VHWnWyt5ng4v8MZBVh1gbLZCSM9Tvf8ZALGOgRRn0J2gBEPXb5s7XdaXDeiOZBKlMD6ZAly2H0JoxmfQaprwwrdlgFZCFWagYITZBYxaAZDZD";

        $scope.resetForm = function(){
            $('.dataTableHide').hide();
            $('#detailTableHide').hide();
            $('#favoriteTableHide').hide();
            $scope.albumHide = true;        //no album or post warning
            $scope.postHide = true;
            $scope.albumPanels = true;
            $scope.postPanels = true;
            $scope.searchType = "basic";
        }

        $scope.resetKeyword = function(){
            $scope.keyword = "";
            $scope.type = "user";
        }

        $scope.toggleProgressBar = function(){
            $scope.progressBar = false;

            $timeout(function() {
                $scope.progressBar = true;
                $('.dataTableHide').show("slow");
            }, 1500);
        }

        $scope.toggleAlbumsAndPost = function(){
            $scope.albumProgress = false;
            $scope.postProgress = false;

            $timeout(function() {
                $scope.albumProgress = true;
                $scope.postProgress = true;
                $scope.albumPanels = false;
                $scope.postPanels = false;
            }, 1500);
        }

        $scope.submitFunction = function(a){
            $scope.resetForm();

            if(a != "" && a != undefined){
                $scope.type = a;    
            } else {
                $scope.type = "user";
            }

            if($scope.type == 'favorite'){
            	$scope.type = 'favorite';

                $('.dataTableHide').hide();
                $('#detailTableHide').hide();
                $('#favoriteTableHide').show("slow");

            } else {
                if($scope.keyword != null || $scope.keyword != undefined){
                    $http({
                        method: 'GET',
                        url: "hw8_php.php?keyword="+$scope.keyword+"&type="+$scope.type+"&searchType="+$scope.searchType+"&pagination=false&latitude="
                            +$scope.lat+"&longitude="+$scope.lon,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(function onSuccess(response){
                        var data = response.data;
                        
                        $scope.response = data;
                        $scope.responseData = data.data;
                        $scope.pagingData = data.paging;
                        $scope.query = data.query;
                        console.log($scope.query);
                        $scope.next = $scope.pagingData.next;
                        $scope.prev = $scope.pagingData.previous;
                        $scope.localStorage = localStorage;

                        if($scope.type == "user"){
                            $('.dataTableHide').hide();
                            $scope.toggleProgressBar();
                            $('#detailTableHide').hide();
                            $('#favoriteTableHide').hide();

                        } else{
                            $('.dataTableHide').show("slow");
                            $('#detailTableHide').hide();
                            $('#favoriteTableHide').hide();

                        }
                    }).catch(function onError(response){
                        console.log("inside error function" + response); 
                    }); 
                }
            }
        }
        // end of submit function

        
        // start of local storage function
        $scope.addFavorite = function(fdId, fdName, fdUrl, type){
        	var addId = fdId;
        	var name = fdName;
        	var url  = fdUrl;
        	
        	var obj = name+","+url+","+type+","+addId;
        	localStorage.setItem(addId, obj);
        }

        $scope.removeFavorite = function(id){
        	var removeId = id;
        	localStorage.removeItem(removeId);
        }

        $scope.renderFavorite = function(){
        	var obj1;
        	$scope.favoriteData = [];
        	$scope.localStorage = localStorage;

        	for(var i=0; i < localStorage.length; i++){
        		obj1 = localStorage.getItem(localStorage.key(i));
        		//localStorage.removeItem(localStorage.key(i));
        		localData = obj1.split(",");

        		favName = localData[0];
        		favUrl = localData[1];
        		favType = localData[2];

        		tempObj = {
        			'id': localStorage.key(i),
        			'name': favName,
        			'url': favUrl,
        			'type': favType
        		}

        		$scope.favoriteData.push(tempObj);
        	}

        	console.log($scope.favoriteData);
        }
        
        // end of local storage function


        $scope.detailsFunction = function(id, name, url){
            // inside detail function

            $scope.searchType = "detailed";
            
            $scope.detailId = id;
            $scope.detailName = name;
            $scope.detailUrl = url;

            $http({
                method: 'GET',
                url: "hw8_php.php?keyword="+$scope.keyword+"&type="+$scope.type+"&searchType="+$scope.searchType+"&detailId="+$scope.detailId,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function onSuccess(response){
                $scope.data = response.data;
                $scope.albums = $scope.data.albumData;
                $scope.posts = $scope.data.postData;

                if($scope.albums == undefined || $scope.albums == null || $scope.albums == ""){
                    $scope.albumHide = false;
                } else {
                    $scope.albums[0].id = false;
                }

                if($scope.posts == undefined || $scope.posts == null || $scope.posts == ""){
                    $scope.postHide = false;
                }

                $('.dataTableHide').hide();
                $('#favoriteTableHide').hide();
                $scope.dataTable = true;
                $scope.favoriteTable = true;
                $('#detailTableHide').show("slow");
                
                $scope.toggleAlbumsAndPost(); 
            }).catch(function onError(response){
                console.log("inside error function" + response);
            });
        }

        $scope.previousFunction = function(previousQuery){
            console.log(previousQuery);
        }

        $scope.pagingFunction = function(nextQuery){
            $scope.pagination = nextQuery;
            console.log($scope.pagination);
            $scope.searchType = "basic";

            $http({
                method: 'GET',
                url: $scope.pagination,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function onSuccess(response){

                    var data = response.data;
                    console.log(data);
                    $scope.response = data;
                    $scope.responseData = data.data;
                    $scope.pagingData = data.paging;
                    $scope.query = data.query;
                    console.log($scope.query);
                    $scope.next = $scope.pagingData.next;
                    $scope.prev = $scope.pagingData.previous;

                    $('.dataTableHide').show("slow");
                    $('#detailTableHide').hide();
                    $('#favoriteTableHide').hide();

            }).catch(function onError(response){
                console.log("inside error function" + response);
            });
        }

        $scope.backFunction = function(){
            if($scope.type == 'favorite'){
                $('#favoriteTableHide').show("slow");
                $('.dataTableHide').hide();
                $('#detailTableHide').hide();
                $scope.renderFavorite();
                
            } else {
                $('.dataTableHide').show("slow");
                $('#detailTableHide').hide();
                $('#favoriteTableHide').hide();
            }

            $scope.albumHide = true;
            $scope.postHide = true;
        }

        $scope.share = function(id, name, url){
            console.log(name);
            FB.ui({
                method: 'feed',
                display: 'popup',
                name: name,
                caption: 'FB Search from USC CSCI571',
                picture: url,
                href: 'http://www.google.com/',
            }, function (response){
                if(response && !response.error_code){
                    alert("Post shared successfully");
                } else {
                    alert("Post not shared");
                }
            });
        }
    }
);

fbApp.animation('.slide', [function(){
    return{
        enter: function(element, doneFn) {
            jQuery(element).linear(1000, doneFn);
        },

        move: function(element, doneFn) {
            jQuery(element).linear(1000, doneFn);
        },

        leave: function(element, doneFn) {
            jQuery(element).linear(1000, doneFn);
        }
    }

}]);