(function () {
    'use strict';
    angular
        .module('mainApp.pages.searchPage', [])
        .config(config);
    function config($stateProvider) {
        $stateProvider
            .state('page.searchPage', {
            url: '/search',
            views: {
                'container': {
                    templateUrl: 'app/pages/searchPage/searchPage.html',
                    controller: 'mainApp.pages.searchPage.SearchPageController',
                    controllerAs: 'vm',
                    resolve: {
                        waitForAuth: ['mainApp.auth.AuthService', function (AuthService) {
                                return AuthService.autoRefreshToken();
                            }]
                    }
                }
            },
            data: {
                requireLogin: true
            },
            parent: 'page',
            params: {
                country: null
            },
            onEnter: ['$rootScope', function ($rootScope) {
                    $rootScope.activeHeader = true;
                    $rootScope.activeFooter = false;
                }]
        });
    }
})();
//# sourceMappingURL=searchPage.config.js.map