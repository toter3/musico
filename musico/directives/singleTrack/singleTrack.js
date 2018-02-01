angular.module("angModule").directive('singleTrack', function() {
    return {
        restrict: 'E',
        templateUrl: 'directives/singleTrack/singleTrack.html',
        scope: {
            trackData: '=trackData',
            deleteFunc: '=deleteFunc'
        },
        controller: function($scope, $element){

            $scope.init = function() {
                $scope.audio = $scope.trackData.audio;
                $scope.audio.load();
                $scope.audio.addEventListener("ended", trackEnded);
                $scope.circle = $($($element).find('.circle')[0]);
                initAnimation()
            };

            // function for play/pause button
            $scope.playPause = function() {
                if($scope.audio.paused) {
                    $scope.trackData.loop = false;
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
                $scope.audio.pause();
                $scope.$parent.removeTrack($scope.trackData.Id)
            };

            // changes volume to the received param, binded to volume change event
            $scope.volume = function (new_vol) {
                $scope.audio.volume = new_vol;
            };

             function trackEnded(){
                 $scope.audio.currentTime = 0;
                 if($scope.trackData.loop){
                    $scope.audio.play();
                     playStopAnimation(true)
                 }else{
                     playStopAnimation(false)
                 }
                 $scope.$apply();
            }

            // sets the circle play animation to its initial state
            function initAnimation(){
                var progressBarOptions = {
                    startAngle: -1.55,
                    size: 53,
                    value: 0,
                    fill: {
                        color: '#eee'
                    }
                };
                $scope.circle.circleProgress(progressBarOptions)
            }


            // watching changes in the play/pause state of the audio to
            // update the playing animation
            $scope.$watch('audio.paused', function(newValue, oldValue) {
                if(newValue != oldValue){
                    playStopAnimation(!newValue)
                }
            });

            // starts and pause the circle play animation
            function playStopAnimation(is_playing){
                if(is_playing) {
                    $scope.circle.circleProgress({
                        animation:{
                            duration: ($scope.audio.duration-$scope.audio.currentTime) * 1000,
                            easing: 'linear'
                        },
                        animationStartValue:  $scope.audio.currentTime / $scope.audio.duration,
                        value : 1
                    });
                }else{
                    $scope.circle.circleProgress({
                        animation:{
                            duration: 0
                        },
                        value : $scope.audio.currentTime / $scope.audio.duration
                    });
                }
            }
        }
    };
});