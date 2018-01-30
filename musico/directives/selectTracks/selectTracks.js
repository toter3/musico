angular.module("angModule").directive('selectTracks', function() {
    return {
        restrict: 'E',
        templateUrl: 'directives/selectTracks/selectTracks.html',
        scope: {
            tracks: '=tracks',
            selected: '=selected'
        },
        controller: function($scope){
            $scope.addTrack = function(track){
                $scope.selected.push(track);
            };
        }
    };
});