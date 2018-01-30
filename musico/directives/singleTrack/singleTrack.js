angular.module("angModule").directive('singleTrack', function() {
    return {
        restrict: 'E',
        templateUrl: 'directives/singleTrack/singleTrack.html',
        scope: {
            trackData: '=trackData',
            deleteFunc: '=deleteFunc'
        },
        controller: function($scope, $element){

            $scope.audio = $scope.trackData.audio;
            $scope.duration = $scope.audio.duration;
            $scope.animationEl = $($element).find('.play-animation')[0];
            $scope.audio.addEventListener("ended", trackEnded);

            // function for play/pause button
            $scope.playPause = function() {
                if($scope.audio.paused) {
                    $scope.audio.loop = false;
                    $scope.audio.play();
                } else {
                    $scope.audio.pause();
                }
            };

            // return the bpm to the original
            $scope.returnBpm = function(track){
                track.bpm = track.orgBpm;
                track.orgBpm = undefined
            };

            // remove track from selected list
            $scope.deleteSelf = function(){
              $scope.$parent.removeTrack($scope.trackData.Id)
            };

            // changes volume to the received param, binded to volume change event
            $scope.volume = function (new_vol) {
                $scope.audio.volume = new_vol;
            };

             function trackEnded(){
                if(!$scope.audio.loop){
                    console.log('ended');
                    $scope.$apply()
                }

            };

            // changes the loop status
            $scope.changeLoop = function(isOn){
                $scope.audio.loop = isOn
            };

            // watching changes in the play/pause state of the audio to
            // update the playing animation
            $scope.$watch('audio.paused', function(newValue, oldValue) {
                if(newValue != oldValue){
                    playStopAnimation(!newValue)
                }
            });

            function playStopAnimation(is_playing){
                if(is_playing) {
                    $scope.animationEl.style.animation = 'playing-animation ' + $scope.audio.duration + 's infinite';
                }else{
                    $scope.animationEl.style['animation-play-state'] =  'paused'
                }
            }
        }
    };
});