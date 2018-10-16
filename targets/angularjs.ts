import factory from '../source';

declare const angular: any;

if (angular == null) {
  throw new Error('Unable to locate angularJS.');
}

angular
  .module('imagifii', [])
  .factory('imgagifii', () => factory);
