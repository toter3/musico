var app = angular.module("angModule", []);

app.controller("mainCtrl", function ($scope, $http) {

    // init function for all main controller.
    $scope.init = function(){
        // get the list from json file (in the project directory)
        // and add some properties to each track in the list
        $http.get('assets/trackList.json').then(function(response) {
            $scope.trackList = response.data;
            $scope.trackList.map(track => enrichTrack(track))
        });
        // initializing parameters
        $scope.selectedTracks = [];
        $scope.allPlaying = false;

        // binding an function that closes a dropdown for a click event
        // anywhere on the screen (except the dropdown)
        $(document).click(function(event) {
            if($('#open-select-container').find($(event.target)).length == 0) {
                $scope.selectOpen = false;
                $scope.$apply()
            }
        });
    };

    // function that removes a selected track from looper
    // (called from html button click)
    $scope.removeTrack = function(id){
        index = indexBydId($scope.selectedTracks, id);
        $scope.selectedTracks.splice(index, 1);
    };

    // sync button function. finds longest selected track and
    // sync the rest with it
    $scope.sync = function(){
        $scope.selectedTracks.sort(sortFunction);
        mainTrack = $scope.selectedTracks[0];
        initAnimations()
        angular.forEach($scope.selectedTracks, function(track){
            if(track !== mainTrack) {
                if(!track.orgBpm) {
                    track.orgBpm = track.bpm;
                }
                track.bpm = calcNewBpm(track,mainTrack);
            }
            track.audio.currentTime = 0;
            track.audio.loop = true;
            track.audio.play();
            $scope.allPlaying = true;
        });
    };

    // play and stop all. if songs stopped, play and if playing - stop
    $scope.playStopAll = function(){
      initAnimations();
      angular.forEach($scope.selectedTracks, function(track){
          track.audio.currentTime = 0;
          if($scope.allPlaying) {
              track.audio.pause();
              track.loop = false;
          }else {
              track.audio.loop = true;
              track.audio.play()
          }
      });
      $scope.allPlaying = !$scope.allPlaying
    };

    // finds the index of track in the list by its id
    function indexBydId(array, id) {
        for(var i = 0; i < array.length; i += 1) {
            if(array[i]['Id'] === id) {
                return i;
            }
        }
        return -1;
    }

    // enriching the track object (adds the audio obj and name)
    function enrichTrack(track){
        track['audio'] = new Audio(track.url);
        track['name'] = getNameFromUrl(track.url);
    }

    // parse the track name from the url
    function getNameFromUrl(url){
        return url.split("/").pop().replace(/\.[^/.]+$/, "")
    }

    // sorting tracks by its duration
    function sortFunction(a,b) {
        if (a.audio.duration < b.audio.duration)
            return 1;
        if (a.audio.duration > b.audio.duration)
            return -1;
        return 0;
    }

    // calc bpm to sync with the longest track.
    // (i thought it might require calculations with duration but have no idea.
    // currently just change to the main track bpm)
    function calcNewBpm(track,mainTrack){
        return mainTrack.bpm
    }

    // suppose to init all animations to the beginning
    function initAnimations() {
        angular.forEach($('.play-animation'), function (animationEl) {
            if(animationEl != undefined) {
                animationEl['animation-play-state'] = 'initial';
            }
        })
    }
});