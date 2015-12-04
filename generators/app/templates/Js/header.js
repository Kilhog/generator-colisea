'use strict';

angular.module('bureau-nomade.mod-%%0%%', ['ui.bootstrap', 'ui.router', 'ngAnimate', 'ngAlertColisea', 'ui.mask', 'ui.select']).
  config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('%%0%%', {
        url: "/%%0%%", abstract: true,
        template: '<div ui-view />',
        data: {breadcrumbProxy: '%%0%%.liste'}
      })
      .state('%%0%%.liste', {
        url: "/liste", templateUrl: 'modules/%%1%%/partials/%%0%%/liste.html',
        controller: 'Ctrl%%0%%Liste',
        params: {params: ''},
        data: {displayName: '%%0%%s'}
      })
      .state('%%0%%.detail', {
        url: "/detail/:Id", templateUrl: 'modules/%%1%%/partials/%%0%%/detail.html',
        controller: 'Ctrl%%0%%Detail',
        params: {params: ''},
        data: {displayName: 'Fiche %%0%%'}
      })
      .state('%%0%%.modif', {
        url: "/modif/:Id", templateUrl: 'modules/%%1%%/partials/%%0%%/detail.html',
        controller: 'Ctrl%%0%%Detail',
        params: {params: ''},
        data: {displayName: 'Fiche %%0%%'}
      })
  }]).
