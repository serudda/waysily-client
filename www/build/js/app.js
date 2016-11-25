(function () {
    'use strict';
    angular.module('mainApp.core', [
        'ngResource',
        'ui.router',
        'pascalprecht.translate',
        'ui.bootstrap',
        'ui.calendar',
        'ui.bootstrap.datetimepicker'
    ]);
})();
//# sourceMappingURL=app.core.module.js.map
(function () {
    'use strict';
    angular
        .module('mainApp', [
        'mainApp.auth',
        'mainApp.core',
        'mainApp.localStorage',
        'mainApp.core.restApi',
        'mainApp.models.user',
        'mainApp.pages.main',
        'mainApp.pages.studentLandingPage',
        'mainApp.components.header',
        'mainApp.components.map',
        'mainApp.components.footer'
    ])
        .config(config);
    function config($locationProvider, $urlRouterProvider, $translateProvider) {
        $urlRouterProvider.otherwise('/page/landing/student');
        var prefix = 'assets/i18n/';
        var suffix = '.json';
        $translateProvider.useStaticFilesLoader({
            prefix: prefix,
            suffix: suffix
        });
        $translateProvider.preferredLanguage('en');
    }
})();
//# sourceMappingURL=app.module.js.map
(function () {
    'use strict';
    angular
        .module('mainApp')
        .run(run);
    run.$inject = ['$rootScope', 'dataConfig', '$http'];
    function run($rootScope, dataConfig, $http) {
        mixpanel.init(dataConfig.mixpanelToken, {
            loaded: function (mixpanel) {
                var first_visit = mixpanel.get_property("First visit");
                var current_date = moment().format('MMMM Do YYYY, h:mm:ss a');
                if (first_visit == null) {
                    mixpanel.register_once({ "First visit": current_date });
                    mixpanel.track("Visit");
                }
            }
        });
        dataConfig.userId = 'id1234';
        $http.defaults.xsrfHeaderName = 'X-CSRFToken';
        $http.defaults.xsrfCookieName = 'csrftoken';
    }
})();
(function (angular) {
    function localStorageServiceFactory($window) {
        if ($window.localStorage) {
            return $window.localStorage;
        }
        throw new Error('Local storage support is needed');
    }
    localStorageServiceFactory.$inject = ['$window'];
    angular
        .module('mainApp.localStorage', [])
        .factory('mainApp.localStorageService', localStorageServiceFactory);
})(angular);
//# sourceMappingURL=app.run.js.map
(function () {
    'use strict';
    var dataConfig = {
        baseUrl: 'https://asanni.herokuapp.com/api/v1/',
        googleMapKey: 'AIzaSyD-vO1--MMK-XmQurzNQrxW4zauddCJh5Y',
        mixpanelToken: '86a48c88274599c662ad64edb74b12da',
        modalMeetingPointTmpl: 'components/modal/modalMeetingPoint/modalMeetingPoint.html',
        userId: ''
    };
    angular
        .module('mainApp')
        .value('dataConfig', dataConfig);
})();
//# sourceMappingURL=app.values.js.map
var app;
(function (app) {
    var auth;
    (function (auth) {
        'use strict';
        var AuthService = (function () {
            function AuthService($q, $rootScope, $http) {
                this.$q = $q;
                this.$http = $http;
                console.log('auth service called');
            }
            AuthService.prototype.signUpPassword = function (username, email, password) {
                var self = this;
                var userData = {
                    username: username,
                    email: email,
                    password: password
                };
                return this.$http.post('http://asanni.herokuapp.com/api/v1/posts/', {
                    Title: userData.username,
                    Link: userData.password
                });
            };
            return AuthService;
        }());
        AuthService.serviceId = 'mainApp.auth.AuthService';
        AuthService.$inject = ['$q',
            '$rootScope',
            '$http'];
        auth.AuthService = AuthService;
        angular
            .module('mainApp.auth', [])
            .service(AuthService.serviceId, AuthService);
    })(auth = app.auth || (app.auth = {}));
})(app || (app = {}));
//# sourceMappingURL=auth.service.js.map
var app;
(function (app) {
    var auth;
    (function (auth) {
        'use strict';
        var SessionService = (function () {
            function SessionService(localStorage) {
                this.localStorage = localStorage;
                this._authData = JSON.parse(this.localStorage.getItem('session.authData'));
                console.log('session service called');
            }
            SessionService.prototype.getAuthData = function () {
                return this._authData;
            };
            return SessionService;
        }());
        SessionService.serviceId = 'mainApp.auth.SessionService';
        SessionService.$inject = ['mainApp.localStorageService'];
        auth.SessionService = SessionService;
        angular
            .module('mainApp.auth', [])
            .service(SessionService.serviceId, SessionService);
    })(auth = app.auth || (app.auth = {}));
})(app || (app = {}));
//# sourceMappingURL=session.service.js.map
//# sourceMappingURL=interfaces.js.map
(function () {
    'use strict';
    angular
        .module('mainApp.core.restApi', [])
        .config(config);
    function config() {
    }
})();
//# sourceMappingURL=restApi.config.js.map
var app;
(function (app) {
    var core;
    (function (core) {
        var restApi;
        (function (restApi) {
            'use strict';
            var RestApiService = (function () {
                function RestApiService($resource, localStorage, dataConfig) {
                    this.$resource = $resource;
                    this.localStorage = localStorage;
                }
                RestApiService.Api = function ($resource, dataConfig) {
                    var resource = $resource(dataConfig.baseUrl + ':url/:id', { url: '@url' }, {
                        show: { method: 'GET', params: { id: '@id' } },
                        query: { method: 'GET', isArray: true },
                        queryObject: { method: 'GET', isArray: false },
                        create: { method: 'POST' },
                        update: { method: 'PUT', params: { id: '@id' } },
                        remove: { method: 'DELETE', params: { id: '@id' } }
                    });
                    return resource;
                };
                return RestApiService;
            }());
            RestApiService.serviceId = 'mainApp.core.restApi.restApiService';
            RestApiService.$inject = [
                '$resource',
                'mainApp.localStorageService',
                'dataConfig'
            ];
            restApi.RestApiService = RestApiService;
            angular
                .module('mainApp.core.restApi')
                .factory(RestApiService.serviceId, RestApiService.Api)
                .factory('customHttpInterceptor', customHttpInterceptor)
                .config(configApi);
            configApi.$inject = ['$httpProvider'];
            customHttpInterceptor.$inject = ['$q'];
            function configApi($httpProvider) {
                $httpProvider.interceptors.push('customHttpInterceptor');
            }
            function customHttpInterceptor($q) {
                return {
                    request: function (req) {
                        req.url = decodeURIComponent(req.url);
                        return req;
                    },
                    requestError: function (rejection) {
                        return rejection;
                    },
                    response: function (res) {
                        return res;
                    },
                    responseError: function (rejection) {
                        return rejection;
                    }
                };
            }
        })(restApi = core.restApi || (core.restApi = {}));
    })(core = app.core || (app.core = {}));
})(app || (app = {}));
//# sourceMappingURL=restApi.service.js.map
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var app;
(function (app) {
    var models;
    (function (models) {
        var user;
        (function (user) {
            var User = (function () {
                function User(obj) {
                    if (obj === void 0) { obj = {}; }
                    console.log('User Model instanced');
                    this.id = obj.id;
                    this.avatar = obj.avatar;
                    this.username = obj.username || '';
                    this.email = obj.email || '';
                    this.first_name = obj.first_name || '';
                    this.last_name = obj.last_name || '';
                    this.sex = obj.sex || '';
                    this.birth_date = obj.birth_date || '';
                    this.born = obj.born || '';
                    this.school = obj.school || '';
                    this.occupation = obj.occupation || '';
                    this.about = obj.about || '';
                    this.location = obj.location || '';
                }
                Object.defineProperty(User.prototype, "Id", {
                    get: function () {
                        return this.id;
                    },
                    set: function (id) {
                        if (id === undefined) {
                            throw 'Please supply id';
                        }
                        this.id = id;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(User.prototype, "Avatar", {
                    get: function () {
                        return this.avatar;
                    },
                    set: function (avatar) {
                        if (avatar === undefined) {
                            throw 'Please supply avatar';
                        }
                        this.avatar = avatar;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(User.prototype, "Username", {
                    get: function () {
                        return this.username;
                    },
                    set: function (username) {
                        if (username === undefined) {
                            throw 'Please supply username';
                        }
                        this.username = username;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(User.prototype, "Email", {
                    get: function () {
                        return this.email;
                    },
                    set: function (email) {
                        if (email === undefined) {
                            throw 'Please supply email';
                        }
                        this.email = email;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(User.prototype, "First_name", {
                    get: function () {
                        return this.first_name;
                    },
                    set: function (first_name) {
                        if (first_name === undefined) {
                            throw 'Please supply first name';
                        }
                        this.first_name = first_name;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(User.prototype, "Last_name", {
                    get: function () {
                        return this.last_name;
                    },
                    set: function (last_name) {
                        if (last_name === undefined) {
                            throw 'Please supply last name';
                        }
                        this.last_name = last_name;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(User.prototype, "Sex", {
                    get: function () {
                        return this.sex;
                    },
                    set: function (sex) {
                        if (sex === undefined) {
                            throw 'Please supply sex';
                        }
                        this.sex = sex;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(User.prototype, "Birth_date", {
                    get: function () {
                        return this.birth_date;
                    },
                    set: function (birth_date) {
                        if (birth_date === undefined) {
                            throw 'Please supply sex';
                        }
                        this.birth_date = birth_date;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(User.prototype, "Born", {
                    get: function () {
                        return this.born;
                    },
                    set: function (born) {
                        if (born === undefined) {
                            throw 'Please supply born';
                        }
                        this.born = born;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(User.prototype, "School", {
                    get: function () {
                        return this.school;
                    },
                    set: function (school) {
                        if (school === undefined) {
                            throw 'Please supply school';
                        }
                        this.school = school;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(User.prototype, "Occupation", {
                    get: function () {
                        return this.occupation;
                    },
                    set: function (occupation) {
                        if (occupation === undefined) {
                            throw 'Please supply occupation';
                        }
                        this.occupation = occupation;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(User.prototype, "About", {
                    get: function () {
                        return this.about;
                    },
                    set: function (about) {
                        if (about === undefined) {
                            throw 'Please supply about';
                        }
                        this.about = about;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(User.prototype, "Location", {
                    get: function () {
                        return this.location;
                    },
                    set: function (location) {
                        if (location === undefined) {
                            throw 'Please supply location';
                        }
                        this.location = location;
                    },
                    enumerable: true,
                    configurable: true
                });
                return User;
            }());
            user.User = User;
            var Student = (function (_super) {
                __extends(Student, _super);
                function Student(obj) {
                    if (obj === void 0) { obj = {}; }
                    var _this;
                    console.log('Student Model instanced');
                    _this = _super.call(this, obj) || this;
                    _this.fluent_in = obj.fluent_in;
                    _this.learning = obj.learning;
                    _this.interests = obj.interests;
                    return _this;
                }
                Object.defineProperty(Student.prototype, "Fluent_in", {
                    get: function () {
                        return this.fluent_in;
                    },
                    enumerable: true,
                    configurable: true
                });
                Student.prototype.addFluentIn = function (language) {
                    if (language === undefined) {
                        throw 'Please supply fluent in language element (Add)';
                    }
                    this.fluent_in.push(language);
                };
                Student.prototype.editFluentIn = function (language) {
                    if (language === undefined) {
                        throw 'Please supply fluent in language element (Edit)';
                    }
                    this.fluent_in.forEach(function (element, index, array) {
                        if (language === element) {
                            array[index] = language;
                        }
                    });
                };
                Object.defineProperty(Student.prototype, "Learning", {
                    get: function () {
                        return this.learning;
                    },
                    enumerable: true,
                    configurable: true
                });
                Student.prototype.addLearning = function (language) {
                    if (language === undefined) {
                        throw 'Please supply learning language element (Add)';
                    }
                    this.fluent_in.push(language);
                };
                Student.prototype.editLearning = function (language) {
                    if (language === undefined) {
                        throw 'Please supply learning language element (Edit)';
                    }
                    this.learning.forEach(function (element, index, array) {
                        if (language === element) {
                            array[index] = language;
                        }
                    });
                };
                Object.defineProperty(Student.prototype, "Interests", {
                    get: function () {
                        return this.interests;
                    },
                    enumerable: true,
                    configurable: true
                });
                Student.prototype.addInterest = function (interest) {
                    if (interest === undefined) {
                        throw 'Please supply interest element (Add)';
                    }
                    this.interests.push(interest);
                };
                Student.prototype.editInterest = function (interest) {
                    if (interest === undefined) {
                        throw 'Please supply interest element (Edit)';
                    }
                    this.interests.forEach(function (element, index, array) {
                        if (interest === element) {
                            array[index] = interest;
                        }
                    });
                };
                return Student;
            }(User));
            user.Student = Student;
        })(user = models.user || (models.user = {}));
    })(models = app.models || (app.models = {}));
})(app || (app = {}));
//# sourceMappingURL=user.model.js.map
var app;
(function (app) {
    var models;
    (function (models) {
        var user;
        (function (user) {
            'use strict';
            var UserService = (function () {
                function UserService(restApi) {
                    this.restApi = restApi;
                    console.log('user service instanced');
                }
                UserService.prototype.getUserById = function (id) {
                    var url = 'users/';
                    return this.restApi.show({ url: url, id: id }).$promise
                        .then(function (data) {
                        return data;
                    }).catch(function (err) {
                        console.log(err);
                        return err;
                    });
                };
                UserService.prototype.getAllUsers = function () {
                    var url = 'users/';
                    return this.restApi.query({ url: url }).$promise
                        .then(function (data) {
                        return data;
                    }).catch(function (err) {
                        console.log(err);
                        return err;
                    });
                };
                return UserService;
            }());
            UserService.serviceId = 'mainApp.models.user.UserService';
            UserService.$inject = [
                'mainApp.core.restApi.restApiService'
            ];
            user.UserService = UserService;
            angular
                .module('mainApp.models.user', [])
                .service(UserService.serviceId, UserService);
        })(user = models.user || (models.user = {}));
    })(models = app.models || (app.models = {}));
})(app || (app = {}));
//# sourceMappingURL=user.service.js.map
(function () {
    'use strict';
    angular
        .module('mainApp.pages.main', [])
        .config(config);
    function config($stateProvider) {
        $stateProvider
            .state('page', {
            url: '/page',
            abstract: true,
            templateUrl: 'app/pages/main/main.html',
            controller: 'mainApp.pages.main.MainController',
            controllerAs: 'vm'
        });
    }
})();
//# sourceMappingURL=main.config.js.map
var app;
(function (app) {
    var pages;
    (function (pages) {
        var main;
        (function (main) {
            var MainController = (function () {
                function MainController() {
                    this.init();
                }
                MainController.prototype.init = function () {
                    this.activate();
                };
                MainController.prototype.activate = function () {
                    console.log('main controller actived');
                };
                return MainController;
            }());
            MainController.controllerId = 'mainApp.pages.main.MainController';
            main.MainController = MainController;
            angular
                .module('mainApp.pages.main')
                .controller(MainController.controllerId, MainController);
        })(main = pages.main || (pages.main = {}));
    })(pages = app.pages || (app.pages = {}));
})(app || (app = {}));
//# sourceMappingURL=main.controller.js.map
(function () {
    'use strict';
    angular
        .module('mainApp.pages.meetingConfirmationPage', [])
        .config(config);
    function config($stateProvider) {
        $stateProvider
            .state('page.meetingConfirmationPage', {
            url: '/meeting/confirmation',
            views: {
                'container': {
                    templateUrl: 'app/pages/meetingConfirmationPage/meetingConfirmationPage.html',
                    controller: 'mainApp.pages.meetingConfirmationPage.MeetingConfirmationPageController',
                    controllerAs: 'vm'
                }
            },
            parent: 'page',
            params: {
                user: null
            }
        });
    }
})();
//# sourceMappingURL=meetingConfirmationPage.config.js.map
var app;
(function (app) {
    var pages;
    (function (pages) {
        var meetingConfirmationPage;
        (function (meetingConfirmationPage) {
            var MeetingConfirmationPageController = (function () {
                function MeetingConfirmationPageController(dataConfig, $state, $filter, $scope, $uibModal) {
                    this.dataConfig = dataConfig;
                    this.$state = $state;
                    this.$filter = $filter;
                    this.$scope = $scope;
                    this.$uibModal = $uibModal;
                    this._init();
                }
                MeetingConfirmationPageController.prototype._init = function () {
                    this.form = {
                        helloText: '',
                        meetingPoint: {
                            name: 'Escoge un punto de encuentro',
                            category: '',
                            address: '',
                            prices: { min: 0, max: 0 },
                            position: { lat: null, lng: null }
                        }
                    };
                    this.error = {
                        message: ''
                    };
                    this.mapConfig = {
                        type: 'location-map',
                        data: null
                    };
                    this.activate();
                };
                MeetingConfirmationPageController.prototype.activate = function () {
                    console.log('meetingConfirmationPage controller actived');
                };
                MeetingConfirmationPageController.prototype.addNewMeetingPoint = function () {
                    var self = this;
                    var options = {
                        animation: false,
                        backdrop: 'static',
                        keyboard: false,
                        templateUrl: this.dataConfig.modalMeetingPointTmpl,
                        controller: 'mainApp.components.modal.ModalMeetingPointController as vm',
                        resolve: {
                            dataSetModal: function () {
                                return {
                                    model: { test: 'data' }
                                };
                            }
                        }
                    };
                    var modalInstance = this.$uibModal.open(options);
                    modalInstance.result.then(function (newMeetingPoint) {
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    });
                    event.preventDefault();
                };
                MeetingConfirmationPageController.prototype.chooseMeetingPoint = function () {
                    var meetingPoint = {
                        name: 'Café Vervlet',
                        category: 'Café',
                        address: 'Trans 33 Sur',
                        prices: { min: 23000, max: 30000 },
                        position: { lat: 6.1739743, lng: -75.5822414 }
                    };
                    this.form.meetingPoint = meetingPoint;
                    if (this.form.helloText != '' &&
                        this.form.meetingPoint.position.lat != null &&
                        this.form.meetingPoint.position.lng != null) {
                        this.processCompleted = true;
                    }
                };
                MeetingConfirmationPageController.prototype.saveMessage = function () {
                    if (this.form.helloText != '' &&
                        this.form.meetingPoint.position.lat != null &&
                        this.form.meetingPoint.position.lng != null) {
                        this.processCompleted = true;
                    }
                };
                MeetingConfirmationPageController.prototype.edit = function () {
                    this.processCompleted = false;
                };
                return MeetingConfirmationPageController;
            }());
            MeetingConfirmationPageController.controllerId = 'mainApp.pages.meetingConfirmationPage.MeetingConfirmationPageController';
            MeetingConfirmationPageController.$inject = [
                'dataConfig',
                '$state',
                '$filter',
                '$scope',
                '$uibModal'
            ];
            meetingConfirmationPage.MeetingConfirmationPageController = MeetingConfirmationPageController;
            angular
                .module('mainApp.pages.meetingConfirmationPage')
                .controller(MeetingConfirmationPageController.controllerId, MeetingConfirmationPageController);
        })(meetingConfirmationPage = pages.meetingConfirmationPage || (pages.meetingConfirmationPage = {}));
    })(pages = app.pages || (app.pages = {}));
})(app || (app = {}));
//# sourceMappingURL=meetingConfirmationPage.controller.js.map
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
                    controllerAs: 'vm'
                }
            },
            parent: 'page',
            params: {
                user: null
            }
        });
    }
})();
//# sourceMappingURL=searchPage.config.js.map
var app;
(function (app) {
    var pages;
    (function (pages) {
        var searchPage;
        (function (searchPage) {
            var SearchPageController = (function () {
                function SearchPageController(UserService, $state, $filter, $scope) {
                    this.UserService = UserService;
                    this.$state = $state;
                    this.$filter = $filter;
                    this.$scope = $scope;
                    this._init();
                }
                SearchPageController.prototype._init = function () {
                    this.data = [];
                    this.error = {
                        message: ''
                    };
                    this.activate();
                };
                SearchPageController.prototype.activate = function () {
                    var self = this;
                    console.log('searchPage controller actived');
                    this.UserService.getAllUsers().then(function (response) {
                        self.mapConfig = self._buildMarkers(response);
                        self.data = self._chunk(response, 2);
                    });
                };
                SearchPageController.prototype._chunk = function (arr, size) {
                    var newArr = [];
                    for (var i = 0; i < arr.length; i += size) {
                        newArr.push(arr.slice(i, i + size));
                    }
                    return newArr;
                };
                SearchPageController.prototype._buildMarkers = function (userData) {
                    var mapConfig = {
                        type: 'search-map',
                        data: {
                            position: {
                                lat: 6.175434,
                                lng: -75.583329
                            },
                            markers: []
                        }
                    };
                    for (var i = 0; i < userData.length; i++) {
                        mapConfig.data.markers.push({
                            id: userData[i].id,
                            position: userData[i].location.position
                        });
                    }
                    return mapConfig;
                };
                return SearchPageController;
            }());
            SearchPageController.controllerId = 'mainApp.pages.searchPage.SearchPageController';
            SearchPageController.$inject = [
                'mainApp.models.user.UserService',
                '$state',
                '$filter',
                '$scope'
            ];
            searchPage.SearchPageController = SearchPageController;
            angular
                .module('mainApp.pages.searchPage')
                .controller(SearchPageController.controllerId, SearchPageController);
        })(searchPage = pages.searchPage || (pages.searchPage = {}));
    })(pages = app.pages || (app.pages = {}));
})(app || (app = {}));
//# sourceMappingURL=searchPage.controller.js.map
(function () {
    'use strict';
    angular
        .module('mainApp.pages.signUpPage', [])
        .config(config);
    function config($stateProvider) {
        $stateProvider
            .state('signUp', {
            url: '/signUp',
            views: {
                'container': {
                    templateUrl: 'app/pages/signUpPage/signUpPage.html',
                    controller: 'mainApp.pages.signUpPage.SignUpPageController',
                    controllerAs: 'vm'
                }
            },
            params: {
                user: null
            }
        });
    }
})();
//# sourceMappingURL=signUpPage.config.js.map
var app;
(function (app) {
    var pages;
    (function (pages) {
        var signUpPage;
        (function (signUpPage) {
            var SignUpPageController = (function () {
                function SignUpPageController($state, $filter, $scope, AuthService) {
                    this.$state = $state;
                    this.$filter = $filter;
                    this.$scope = $scope;
                    this.AuthService = AuthService;
                    this._init();
                }
                SignUpPageController.prototype._init = function () {
                    this.form = {
                        username: '',
                        email: '',
                        password: ''
                    };
                    this.error = {
                        message: ''
                    };
                    this.activate();
                };
                SignUpPageController.prototype.activate = function () {
                    console.log('signUpPage controller actived');
                };
                SignUpPageController.prototype.signUp = function () {
                    var self = this;
                    this.AuthService.signUpPassword(this.form.username, this.form.email, this.form.password);
                };
                return SignUpPageController;
            }());
            SignUpPageController.controllerId = 'mainApp.pages.signUpPage.SignUpPageController';
            SignUpPageController.$inject = [
                '$state',
                '$filter',
                '$scope',
                'mainApp.auth.AuthService'
            ];
            signUpPage.SignUpPageController = SignUpPageController;
            angular
                .module('mainApp.pages.signUpPage')
                .controller(SignUpPageController.controllerId, SignUpPageController);
        })(signUpPage = pages.signUpPage || (pages.signUpPage = {}));
    })(pages = app.pages || (app.pages = {}));
})(app || (app = {}));
//# sourceMappingURL=signUpPage.controller.js.map
(function () {
    'use strict';
    angular
        .module('mainApp.pages.studentLandingPage', [])
        .config(config);
    function config($stateProvider) {
        $stateProvider
            .state('page.studentLandingPage', {
            url: '/landing/student',
            views: {
                'container': {
                    templateUrl: 'app/pages/studentLandingPage/studentLandingPage.html',
                    controller: 'mainApp.pages.studentLandingPage.StudentLandingPageController',
                    controllerAs: 'vm'
                }
            },
            parent: 'page',
            params: {
                user: null,
                id: null
            }
        });
    }
})();
//# sourceMappingURL=studentLandingPage.config.js.map
var app;
(function (app) {
    var pages;
    (function (pages) {
        var studentLandingPage;
        (function (studentLandingPage) {
            var StudentLandingPageController = (function () {
                function StudentLandingPageController($state, $translate, StudentLandingPageService) {
                    this.$state = $state;
                    this.$translate = $translate;
                    this.StudentLandingPageService = StudentLandingPageService;
                    this._init();
                }
                StudentLandingPageController.prototype._init = function () {
                    this.form = {
                        userData: {
                            name: '',
                            email: '',
                            comment: ''
                        },
                        language: 'en'
                    };
                    this.success = false;
                    this.sending = false;
                    this.error = {
                        message: ''
                    };
                    this.addComment = false;
                    this.activate();
                };
                StudentLandingPageController.prototype.activate = function () {
                    var self = this;
                    console.log('studentLandingPage controller actived');
                };
                StudentLandingPageController.prototype.changeLanguage = function () {
                    this.$translate.use(this.form.language);
                    mixpanel.track("Change Language");
                };
                StudentLandingPageController.prototype.goToEarlyAccessForm = function () {
                    document.querySelector('.studentLandingPage__early-access-block').scrollIntoView({ behavior: 'smooth' });
                    mixpanel.track("Go to early access form");
                };
                StudentLandingPageController.prototype.goDown = function () {
                    document.querySelector('.studentLandingPage__title-block').scrollIntoView({ behavior: 'smooth' });
                    mixpanel.track('Go down');
                };
                StudentLandingPageController.prototype.showCommentsTextarea = function () {
                    event.preventDefault();
                    this.addComment = true;
                };
                StudentLandingPageController.prototype.createEarlyAdopter = function () {
                    var self = this;
                    this.sending = true;
                    mixpanel.track("Click on Notify button", {
                        "name": this.form.userData.name || '*',
                        "email": this.form.userData.email,
                        "comment": this.form.userData.comment || '*'
                    });
                    var userData = {
                        name: this.form.userData.name || '*',
                        email: this.form.userData.email,
                        comment: this.form.userData.comment || '*'
                    };
                    this.StudentLandingPageService.createEarlyAdopter(userData).then(function (response) {
                        if (response.createdAt) {
                            self.success = true;
                        }
                        else {
                            self.sending = false;
                        }
                    });
                };
                return StudentLandingPageController;
            }());
            StudentLandingPageController.controllerId = 'mainApp.pages.studentLandingPage.StudentLandingPageController';
            StudentLandingPageController.$inject = ['$state',
                '$translate',
                'mainApp.pages.studentLandingPage.StudentLandingPageService'];
            studentLandingPage.StudentLandingPageController = StudentLandingPageController;
            angular
                .module('mainApp.pages.studentLandingPage')
                .controller(StudentLandingPageController.controllerId, StudentLandingPageController);
        })(studentLandingPage = pages.studentLandingPage || (pages.studentLandingPage = {}));
    })(pages = app.pages || (app.pages = {}));
})(app || (app = {}));
//# sourceMappingURL=studentLandingPage.controller.js.map
var app;
(function (app) {
    var pages;
    (function (pages) {
        var studentLandingPage;
        (function (studentLandingPage) {
            'use strict';
            var StudentLandingPageService = (function () {
                function StudentLandingPageService(restApi) {
                    this.restApi = restApi;
                }
                StudentLandingPageService.prototype.createEarlyAdopter = function (userData) {
                    var url = 'early/';
                    return this.restApi.create({ url: url }, userData).$promise
                        .then(function (data) {
                        return data;
                    }).catch(function (err) {
                        console.log(err);
                        return err;
                    });
                };
                return StudentLandingPageService;
            }());
            StudentLandingPageService.serviceId = 'mainApp.pages.studentLandingPage.StudentLandingPageService';
            StudentLandingPageService.$inject = [
                'mainApp.core.restApi.restApiService'
            ];
            studentLandingPage.StudentLandingPageService = StudentLandingPageService;
            angular
                .module('mainApp.pages.studentLandingPage')
                .service(StudentLandingPageService.serviceId, StudentLandingPageService);
        })(studentLandingPage = pages.studentLandingPage || (pages.studentLandingPage = {}));
    })(pages = app.pages || (app.pages = {}));
})(app || (app = {}));
//# sourceMappingURL=studentLandingPage.service.js.map
(function () {
    'use strict';
    angular
        .module('mainApp.pages.userEditAgendaPage', [])
        .config(config);
    function config($stateProvider) {
        $stateProvider
            .state('page.userEditAgendaPage', {
            url: '/users/edit/:id/agenda',
            views: {
                'container': {
                    templateUrl: 'app/pages/userEditAgendaPage/userEditAgendaPage.html',
                    controller: 'mainApp.pages.userEditAgendaPage.UserEditAgendaPageController',
                    controllerAs: 'vm'
                }
            },
            parent: 'page',
            params: {
                user: null,
                id: '1'
            }
        });
    }
})();
//# sourceMappingURL=userEditAgendaPage.config.js.map
var app;
(function (app) {
    var pages;
    (function (pages) {
        var userEditAgendaPage;
        (function (userEditAgendaPage) {
            var UserEditAgendaPageController = (function () {
                function UserEditAgendaPageController($state, $filter, $scope, uiCalendarConfig) {
                    this.$state = $state;
                    this.$filter = $filter;
                    this.$scope = $scope;
                    this.uiCalendarConfig = uiCalendarConfig;
                    this._init();
                }
                UserEditAgendaPageController.prototype._init = function () {
                    var self = this;
                    this.form = {
                        username: '',
                        email: ''
                    };
                    this.error = {
                        message: ''
                    };
                    this.$scope.calendarConfig = {
                        calendar: {
                            editable: true,
                            header: {
                                left: 'prev',
                                center: 'title',
                                right: 'month, agendaDay, next'
                            },
                            slotDuration: '01:00:00',
                            slotLabelFormat: 'h(:mm) a',
                            navLinks: true,
                            allDaySlot: false,
                            events: [
                                {
                                    title: 'Rosa',
                                    start: '2016-10-12T17:00:00',
                                    end: '2016-10-12T18:00:00',
                                    editable: false
                                },
                                {
                                    title: 'Carlos',
                                    start: '2016-10-20T20:00:00',
                                    end: '2016-10-20T21:00:00',
                                    editable: false
                                },
                                {
                                    title: 'Michaelson',
                                    start: '2016-10-23T07:00:00',
                                    end: '2016-10-23T08:00:00',
                                    editable: false
                                }
                            ],
                            timeFormat: 'h:mm a',
                            buttonText: {
                                month: 'view calendar'
                            }
                        }
                    };
                    this.$scope.changeView = function (view, calendar) {
                        self.uiCalendarConfig.calendars['userAgenda'].fullCalendar('changeView', 'agendaDay');
                    };
                    this.$scope.eventSources = [];
                    this.activate();
                };
                UserEditAgendaPageController.prototype.activate = function () {
                    console.log('userEditAgendaPage controller actived');
                };
                UserEditAgendaPageController.prototype.goToEditProfile = function () {
                    this.$state.go('page.userEditProfilePage');
                };
                UserEditAgendaPageController.prototype.goToEditMedia = function () {
                    this.$state.go('page.userEditMediaPage');
                };
                return UserEditAgendaPageController;
            }());
            UserEditAgendaPageController.controllerId = 'mainApp.pages.userEditAgendaPage.UserEditAgendaPageController';
            UserEditAgendaPageController.$inject = [
                '$state',
                '$filter',
                '$scope',
                'uiCalendarConfig'
            ];
            userEditAgendaPage.UserEditAgendaPageController = UserEditAgendaPageController;
            angular
                .module('mainApp.pages.userEditAgendaPage')
                .controller(UserEditAgendaPageController.controllerId, UserEditAgendaPageController);
        })(userEditAgendaPage = pages.userEditAgendaPage || (pages.userEditAgendaPage = {}));
    })(pages = app.pages || (app.pages = {}));
})(app || (app = {}));
//# sourceMappingURL=userEditAgendaPage.controller.js.map
(function () {
    'use strict';
    angular
        .module('mainApp.pages.userEditMediaPage', [])
        .config(config);
    function config($stateProvider) {
        $stateProvider
            .state('page.userEditMediaPage', {
            url: '/users/edit/:id/media',
            views: {
                'container': {
                    templateUrl: 'app/pages/userEditMediaPage/userEditMediaPage.html',
                    controller: 'mainApp.pages.userEditMediaPage.UserEditMediaPageController',
                    controllerAs: 'vm'
                }
            },
            parent: 'page',
            params: {
                user: null,
                id: '1'
            }
        });
    }
})();
//# sourceMappingURL=userEditMediaPage.config.js.map
var app;
(function (app) {
    var pages;
    (function (pages) {
        var userEditMediaPage;
        (function (userEditMediaPage) {
            var UserEditMediaPageController = (function () {
                function UserEditMediaPageController($state, $filter, $scope) {
                    this.$state = $state;
                    this.$filter = $filter;
                    this.$scope = $scope;
                    this._init();
                }
                UserEditMediaPageController.prototype._init = function () {
                    this.form = {
                        username: '',
                        email: ''
                    };
                    this.error = {
                        message: ''
                    };
                    this.activate();
                };
                UserEditMediaPageController.prototype.activate = function () {
                    console.log('userEditMediaPage controller actived');
                };
                UserEditMediaPageController.prototype.goToEditProfile = function () {
                    this.$state.go('page.userEditProfilePage');
                };
                return UserEditMediaPageController;
            }());
            UserEditMediaPageController.controllerId = 'mainApp.pages.userEditMediaPage.UserEditMediaPageController';
            UserEditMediaPageController.$inject = [
                '$state',
                '$filter',
                '$scope'
            ];
            userEditMediaPage.UserEditMediaPageController = UserEditMediaPageController;
            angular
                .module('mainApp.pages.userEditMediaPage')
                .controller(UserEditMediaPageController.controllerId, UserEditMediaPageController);
        })(userEditMediaPage = pages.userEditMediaPage || (pages.userEditMediaPage = {}));
    })(pages = app.pages || (app.pages = {}));
})(app || (app = {}));
//# sourceMappingURL=userEditMediaPage.controller.js.map
(function () {
    'use strict';
    angular
        .module('mainApp.pages.userEditProfilePage', [])
        .config(config);
    function config($stateProvider) {
        $stateProvider
            .state('page.userEditProfilePage', {
            url: '/users/edit/:id',
            views: {
                'container': {
                    templateUrl: 'app/pages/userEditProfilePage/userEditProfilePage.html',
                    controller: 'mainApp.pages.userEditProfilePage.UserEditProfilePageController',
                    controllerAs: 'vm'
                }
            },
            parent: 'page',
            params: {
                user: null,
                id: '1'
            }
        });
    }
})();
//# sourceMappingURL=userEditProfilePage.config.js.map
var app;
(function (app) {
    var pages;
    (function (pages) {
        var userEditProfilePage;
        (function (userEditProfilePage) {
            var UserEditProfilePageController = (function () {
                function UserEditProfilePageController($state, $filter, $scope) {
                    this.$state = $state;
                    this.$filter = $filter;
                    this.$scope = $scope;
                    this._init();
                }
                UserEditProfilePageController.prototype._init = function () {
                    this.form = {
                        username: '',
                        email: ''
                    };
                    this.error = {
                        message: ''
                    };
                    this.activate();
                };
                UserEditProfilePageController.prototype.activate = function () {
                    console.log('userEditProfilePage controller actived');
                };
                UserEditProfilePageController.prototype.goToEditMedia = function () {
                    this.$state.go('page.userEditMediaPage');
                };
                UserEditProfilePageController.prototype.goToEditAgenda = function () {
                    this.$state.go('page.userEditAgendaPage');
                };
                return UserEditProfilePageController;
            }());
            UserEditProfilePageController.controllerId = 'mainApp.pages.userEditProfilePage.UserEditProfilePageController';
            UserEditProfilePageController.$inject = [
                '$state',
                '$filter',
                '$scope'
            ];
            userEditProfilePage.UserEditProfilePageController = UserEditProfilePageController;
            angular
                .module('mainApp.pages.userEditProfilePage')
                .controller(UserEditProfilePageController.controllerId, UserEditProfilePageController);
        })(userEditProfilePage = pages.userEditProfilePage || (pages.userEditProfilePage = {}));
    })(pages = app.pages || (app.pages = {}));
})(app || (app = {}));
//# sourceMappingURL=userEditProfilePage.controller.js.map
(function () {
    'use strict';
    angular
        .module('mainApp.pages.userInboxDetailsPage', [])
        .config(config);
    function config($stateProvider) {
        $stateProvider
            .state('page.userInboxDetailsPage', {
            url: '/users/:userId/inbox/:messageId',
            views: {
                'container': {
                    templateUrl: 'app/pages/userInboxDetailsPage/userInboxDetailsPage.html',
                    controller: 'mainApp.pages.userInboxDetailsPage.UserInboxDetailsPageController',
                    controllerAs: 'vm'
                }
            },
            parent: 'page',
            params: {
                userId: '123',
                messageId: '1234'
            }
        });
    }
})();
//# sourceMappingURL=userInboxDetailsPage.config.js.map
var app;
(function (app) {
    var pages;
    (function (pages) {
        var userInboxDetailsPage;
        (function (userInboxDetailsPage) {
            var UserInboxDetailsPageController = (function () {
                function UserInboxDetailsPageController($state, $scope) {
                    this.$state = $state;
                    this.$scope = $scope;
                    this._init();
                }
                UserInboxDetailsPageController.prototype._init = function () {
                    this.form = {};
                    this.error = {
                        message: ''
                    };
                    this.activate();
                };
                UserInboxDetailsPageController.prototype.activate = function () {
                    console.log('userInboxDetailsPage controller actived');
                };
                return UserInboxDetailsPageController;
            }());
            UserInboxDetailsPageController.controllerId = 'mainApp.pages.userInboxDetailsPage.UserInboxDetailsPageController';
            UserInboxDetailsPageController.$inject = [
                '$state',
                '$scope'
            ];
            userInboxDetailsPage.UserInboxDetailsPageController = UserInboxDetailsPageController;
            angular
                .module('mainApp.pages.userInboxDetailsPage')
                .controller(UserInboxDetailsPageController.controllerId, UserInboxDetailsPageController);
        })(userInboxDetailsPage = pages.userInboxDetailsPage || (pages.userInboxDetailsPage = {}));
    })(pages = app.pages || (app.pages = {}));
})(app || (app = {}));
//# sourceMappingURL=userInboxDetailsPage.controller.js.map
(function () {
    'use strict';
    angular
        .module('mainApp.pages.userInboxPage', [])
        .config(config);
    function config($stateProvider) {
        $stateProvider
            .state('page.userInboxPage', {
            url: '/users/:userId/inbox',
            views: {
                'container': {
                    templateUrl: 'app/pages/userInboxPage/userInboxPage.html',
                    controller: 'mainApp.pages.userInboxPage.UserInboxPageController',
                    controllerAs: 'vm'
                }
            },
            parent: 'page',
            params: {
                userId: '123'
            }
        });
    }
})();
//# sourceMappingURL=userInboxPage.config.js.map
var app;
(function (app) {
    var pages;
    (function (pages) {
        var userInboxPage;
        (function (userInboxPage) {
            var UserInboxPageController = (function () {
                function UserInboxPageController($state, $scope) {
                    this.$state = $state;
                    this.$scope = $scope;
                    this._init();
                }
                UserInboxPageController.prototype._init = function () {
                    this.form = {};
                    this.error = {
                        message: ''
                    };
                    this.activate();
                };
                UserInboxPageController.prototype.activate = function () {
                    console.log('userInboxPage controller actived');
                };
                UserInboxPageController.prototype.goToDetail = function () {
                    this.$state.go('page.userInboxDetailsPage');
                };
                return UserInboxPageController;
            }());
            UserInboxPageController.controllerId = 'mainApp.pages.userInboxPage.UserInboxPageController';
            UserInboxPageController.$inject = [
                '$state',
                '$scope'
            ];
            userInboxPage.UserInboxPageController = UserInboxPageController;
            angular
                .module('mainApp.pages.userInboxPage')
                .controller(UserInboxPageController.controllerId, UserInboxPageController);
        })(userInboxPage = pages.userInboxPage || (pages.userInboxPage = {}));
    })(pages = app.pages || (app.pages = {}));
})(app || (app = {}));
//# sourceMappingURL=userInboxPage.controller.js.map
(function () {
    'use strict';
    angular
        .module('mainApp.pages.userProfilePage', [])
        .config(config);
    function config($stateProvider) {
        $stateProvider
            .state('page.userProfilePage', {
            url: '/users/show/:id',
            views: {
                'container': {
                    templateUrl: 'app/pages/userProfilePage/userProfilePage.html',
                    controller: 'mainApp.pages.userProfilePage.UserProfilePageController',
                    controllerAs: 'vm'
                }
            },
            parent: 'page',
            params: {
                user: null,
                id: null
            }
        });
    }
})();
//# sourceMappingURL=userProfilePage.config.js.map
var app;
(function (app) {
    var pages;
    (function (pages) {
        var userProfilePage;
        (function (userProfilePage) {
            var UserProfilePageController = (function () {
                function UserProfilePageController(UserService, $state, $stateParams, $filter, $scope) {
                    this.UserService = UserService;
                    this.$state = $state;
                    this.$stateParams = $stateParams;
                    this.$filter = $filter;
                    this.$scope = $scope;
                    this._init();
                }
                UserProfilePageController.prototype._init = function () {
                    this.data = null;
                    this.form = {
                        username: '',
                        email: ''
                    };
                    this.error = {
                        message: ''
                    };
                    this.mapConfig = {
                        type: 'location-map'
                    };
                    this.$scope.date;
                    this.$scope.datetimepickerConfig = {
                        minView: 'hour',
                        dropdownSelector: '.my-toggle-select'
                    };
                    this.activate();
                };
                UserProfilePageController.prototype.activate = function () {
                    var self = this;
                    console.log('userProfilePage controller actived');
                    this.UserService.getUserById(this.$stateParams.id).then(function (response) {
                        self.data = new app.models.user.Student(response);
                    });
                };
                UserProfilePageController.prototype.onTimeSet = function (newDate, oldDate) {
                    console.log(newDate);
                    console.log(oldDate);
                };
                UserProfilePageController.prototype.beforeRender = function ($view, $dates, $leftDate, $upDate, $rightDate) {
                    var index = Math.floor(Math.random() * $dates.length);
                    $dates[index].selectable = false;
                };
                UserProfilePageController.prototype.goToConfirm = function () {
                    this.$state.go('page.meetingConfirmationPage');
                };
                return UserProfilePageController;
            }());
            UserProfilePageController.controllerId = 'mainApp.pages.userProfilePage.UserProfilePageController';
            UserProfilePageController.$inject = [
                'mainApp.models.user.UserService',
                '$state',
                '$stateParams',
                '$filter',
                '$scope'
            ];
            userProfilePage.UserProfilePageController = UserProfilePageController;
            angular
                .module('mainApp.pages.userProfilePage')
                .controller(UserProfilePageController.controllerId, UserProfilePageController);
        })(userProfilePage = pages.userProfilePage || (pages.userProfilePage = {}));
    })(pages = app.pages || (app.pages = {}));
})(app || (app = {}));
//# sourceMappingURL=userProfilePage.controller.js.map
var app;
(function (app) {
    var core;
    (function (core) {
        var util;
        (function (util) {
            var customPopup;
            (function (customPopup) {
                'use strict';
                var CustomPopupService = (function () {
                    function CustomPopupService($compile) {
                        this.$compile = $compile;
                        console.log('customPopup service called');
                    }
                    CustomPopupService.prototype.invokeCardRewardPopup = function (scope, popupConfig) {
                        scope.cardRewardScope = scope.$new();
                        scope.cardRewardScope.popupConfig = popupConfig;
                        var element = document.createElement("ma-card-reward-popup");
                        document.body.appendChild(element);
                        this.$compile(element)(scope.cardRewardScope);
                    };
                    CustomPopupService.prototype.invokeCardResultPopup = function (scope, popupConfig) {
                        scope.cardResultScope = scope.$new();
                        scope.cardResultScope.popupConfig = popupConfig;
                        var element = document.createElement("ma-card-result-popup");
                        document.body.appendChild(element);
                        this.$compile(element)(scope.cardResultScope);
                    };
                    return CustomPopupService;
                }());
                CustomPopupService.serviceId = 'mainApp.core.util.CustomPopupService';
                CustomPopupService.$inject = ['$compile'];
                customPopup.CustomPopupService = CustomPopupService;
                angular
                    .module('mainApp.core.util', [])
                    .service(CustomPopupService.serviceId, CustomPopupService);
            })(customPopup = util.customPopup || (util.customPopup = {}));
        })(util = core.util || (core.util = {}));
    })(core = app.core || (app.core = {}));
})(app || (app = {}));
//# sourceMappingURL=customPopup.service.js.map
(function () {
    'use strict';
    angular
        .module('mainApp.components.footer', [])
        .config(config);
    function config() { }
})();
//# sourceMappingURL=footer.config.js.map
var components;
(function (components) {
    var footer;
    (function (footer) {
        'use strict';
        var MaFooter = (function () {
            function MaFooter() {
                this.bindToController = true;
                this.controller = FooterController.controllerId;
                this.controllerAs = 'vm';
                this.restrict = 'E';
                this.templateUrl = 'components/footer/footer.html';
                console.log('maFooter directive constructor');
            }
            MaFooter.prototype.link = function ($scope, elm, attr) {
                console.log('maFooter link function');
            };
            MaFooter.instance = function () {
                return new MaFooter();
            };
            return MaFooter;
        }());
        MaFooter.directiveId = 'maFooter';
        angular
            .module('mainApp.components.footer')
            .directive(MaFooter.directiveId, MaFooter.instance);
        var FooterController = (function () {
            function FooterController() {
                this.init();
            }
            FooterController.prototype.init = function () {
                this.activate();
            };
            FooterController.prototype.activate = function () {
                console.log('footer controller actived');
            };
            return FooterController;
        }());
        FooterController.controllerId = 'mainApp.components.footer.FooterController';
        footer.FooterController = FooterController;
        angular.module('mainApp.components.footer')
            .controller(FooterController.controllerId, FooterController);
    })(footer = components.footer || (components.footer = {}));
})(components || (components = {}));
//# sourceMappingURL=footer.directive.js.map
(function () {
    'use strict';
    angular
        .module('mainApp.components.header', [])
        .config(config);
    function config() { }
})();
//# sourceMappingURL=header.config.js.map
var components;
(function (components) {
    var header;
    (function (header) {
        'use strict';
        var MaHeader = (function () {
            function MaHeader() {
                this.bindToController = true;
                this.controller = HeaderController.controllerId;
                this.controllerAs = 'vm';
                this.restrict = 'E';
                this.templateUrl = 'components/header/header.html';
                console.log('maHeader directive constructor');
            }
            MaHeader.prototype.link = function ($scope, elm, attr) {
                console.log('maHeader link function');
            };
            MaHeader.instance = function () {
                return new MaHeader();
            };
            return MaHeader;
        }());
        MaHeader.directiveId = 'maHeader';
        angular
            .module('mainApp.components.header')
            .directive(MaHeader.directiveId, MaHeader.instance);
        var HeaderController = (function () {
            function HeaderController() {
                this.init();
            }
            HeaderController.prototype.init = function () {
                this._slideout = false;
                this.activate();
            };
            HeaderController.prototype.activate = function () {
                console.log('header controller actived');
            };
            HeaderController.prototype.slideNavMenu = function () {
                this._slideout = !this._slideout;
            };
            return HeaderController;
        }());
        HeaderController.controllerId = 'mainApp.components.header.HeaderController';
        header.HeaderController = HeaderController;
        angular.module('mainApp.components.header')
            .controller(HeaderController.controllerId, HeaderController);
    })(header = components.header || (components.header = {}));
})(components || (components = {}));
//# sourceMappingURL=header.directive.js.map
(function () {
    'use strict';
    angular
        .module('mainApp.components.map', [])
        .config(config);
    function config() { }
})();
//# sourceMappingURL=map.config.js.map
var components;
(function (components) {
    var map;
    (function (map_1) {
        'use strict';
        var MaMap = (function () {
            function MaMap() {
                this.bindToController = true;
                this.controller = MapController.controllerId;
                this.controllerAs = 'vm';
                this.restrict = 'E';
                this.scope = {
                    mapConfig: '='
                };
                this.templateUrl = 'components/map/map.html';
                console.log('maMap directive constructor');
            }
            MaMap.prototype.link = function ($scope, elm, attr) {
                console.log('maMap link function');
            };
            MaMap.instance = function () {
                return new MaMap();
            };
            return MaMap;
        }());
        MaMap.directiveId = 'maMap';
        angular
            .module('mainApp.components.map')
            .directive(MaMap.directiveId, MaMap.instance);
        var MapController = (function () {
            function MapController($scope, $timeout) {
                this.$scope = $scope;
                this.$timeout = $timeout;
                this.init();
            }
            MapController.prototype.init = function () {
                var self = this;
                this._map;
                this.mapId = 'ma-map-' + Math.floor((Math.random() * 100) + 1);
                this._infoWindow = null;
                this._markers = [];
                this.$scope.options = null;
                this.form = {
                    position: {
                        lat: null,
                        lng: null
                    }
                };
                switch (this.mapConfig.type) {
                    case 'search-map':
                        this._searchMapBuilder();
                        break;
                    case 'location-map':
                        this._locationMapBuilder();
                        break;
                    case 'modal-assign-marker-map':
                        this._assignMarkerMapBuilder();
                        break;
                }
                var meetingPointData = {
                    id: 1,
                    position: {
                        lat: 6.175298,
                        lng: -75.582289
                    }
                };
                this.activate();
            };
            MapController.prototype.activate = function () {
                console.log('map controller actived');
            };
            MapController.prototype._searchMapBuilder = function () {
                var self = this;
                var zoom = 16;
                var center = this.mapConfig.data.position;
                this.$scope.options = {
                    center: new google.maps.LatLng(center.lat, center.lng),
                    zoom: zoom,
                    mapTypeControl: false,
                    zoomControl: true,
                    streetViewControl: false,
                    scrollwheel: false,
                    zoomControlOptions: {
                        position: google.maps.ControlPosition.TOP_LEFT
                    }
                };
                if (this._map === void 0) {
                    this.$timeout(function () {
                        self._map = new google.maps.Map(document.getElementById(self.mapId), self.$scope.options);
                        for (var i = 0; i < self.mapConfig.data.markers.length; i++) {
                            var marker = self.mapConfig.data.markers[i];
                            self.setMarker(marker.id, new google.maps.LatLng(marker.position.lat, marker.position.lng), 'London', 'Just some content', 'assets/images/meeting-point.png');
                        }
                    });
                }
            };
            MapController.prototype._locationMapBuilder = function () {
                var self = this;
                var zoom = 16;
                var center = {
                    lat: 6.1739743,
                    lng: -75.5822414
                };
                var circle = null;
                var circle_strokeColor = '#ff5a5f';
                var circle_strokeOpacity = 0.8;
                var circle_strokeWeight = 2;
                var circle_fillColor = '#ff5a5f';
                var circle_fillOpacity = 0.35;
                var circle_center = {
                    lat: 6.1739743,
                    lng: -75.5822414
                };
                var circle_radius = 200;
                this.$scope.options = {
                    center: new google.maps.LatLng(center.lat, center.lng),
                    zoom: zoom,
                    mapTypeControl: false,
                    zoomControl: true,
                    streetViewControl: false,
                    scrollwheel: false,
                    zoomControlOptions: {
                        position: google.maps.ControlPosition.TOP_RIGHT
                    }
                };
                if (this._map === void 0) {
                    this.$timeout(function () {
                        self._map = new google.maps.Map(document.getElementById(self.mapId), self.$scope.options);
                        circle = new google.maps.Circle({
                            strokeColor: circle_strokeColor,
                            strokeOpacity: circle_strokeOpacity,
                            strokeWeight: circle_strokeWeight,
                            fillColor: circle_fillColor,
                            fillOpacity: circle_fillOpacity,
                            map: self._map,
                            center: new google.maps.LatLng(center.lat, center.lng),
                            radius: circle_radius
                        });
                        self.setMarker(7, new google.maps.LatLng(6.1739743, -75.5822614), 'London', 'Just some content', 'assets/images/location.png');
                        self.setMarker(8, new google.maps.LatLng(6.174486, -75.582846), 'London', 'Just some content', 'assets/images/location.png');
                        self.setMarker(9, new google.maps.LatLng(6.173066, -75.583090), 'London', 'Just some content', 'assets/images/location.png');
                    });
                }
            };
            MapController.prototype._assignMarkerMapBuilder = function () {
                var self = this;
                var zoom = 16;
                var center = {
                    lat: 6.1739743,
                    lng: -75.5822414
                };
                this.$scope.options = {
                    center: new google.maps.LatLng(center.lat, center.lng),
                    zoom: zoom,
                    mapTypeControl: false,
                    zoomControl: true,
                    streetViewControl: false,
                    scrollwheel: false,
                    zoomControlOptions: {
                        position: google.maps.ControlPosition.TOP_RIGHT
                    }
                };
                if (this._map === void 0) {
                    this.$timeout(function () {
                        self._map = new google.maps.Map(document.getElementById(self.mapId), self.$scope.options);
                        self.setMarker(7, new google.maps.LatLng(6.1739743, -75.5822414), 'London', 'Just some content', 'assets/images/location.png');
                        google.maps.event.trigger(self._map, "resize");
                    });
                }
            };
            MapController.prototype.setMarker = function (id, position, title, content, icon) {
                var self = this;
                var marker;
                var markerOptions = {
                    id: id,
                    position: position,
                    map: this._map,
                    title: title,
                    icon: icon,
                    draggable: true
                };
                marker = new google.maps.Marker(markerOptions);
                google.maps.event.addListener(marker, 'dragend', function (event) {
                    self.form.position.lat = this.getPosition().lat();
                    self.form.position.lng = this.getPosition().lng();
                });
                google.maps.event.addListener(marker, 'click', function (event) {
                    for (var i = 0; i < self._markers.length; i++) {
                        self._markers[i].setIcon('assets/images/meeting-point.png');
                    }
                    this.setIcon('assets/images/location.png');
                    self._meetingPointDetailsData = {
                        name: 'Café Vervlet',
                        meetings: 70,
                        category: 'Café',
                        address: 'Trans 32 Diagonal 33A Sur - 20',
                        prices: {
                            min: 130,
                            max: 300
                        },
                        website: 'http://www.place-book.com',
                        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque rutrum pulvinar magna, et iaculis neque posuere a. Suspendisse sit amet mollis nunc, nec faucibus ipsum. Nunc et nisl eget enim gravida sagittis. Donec massa nulla, tempor eu orci quis, tincidunt tincidunt odio.'
                    };
                });
                this._markers.push(marker);
            };
            return MapController;
        }());
        MapController.controllerId = 'mainApp.components.map.MapController';
        MapController.$inject = ['$scope', '$timeout'];
        map_1.MapController = MapController;
        angular.module('mainApp.components.map')
            .controller(MapController.controllerId, MapController);
    })(map = components.map || (components.map = {}));
})(components || (components = {}));
//# sourceMappingURL=map.directive.js.map
(function () {
    'use strict';
    angular
        .module('mainApp.components.modal', [])
        .config(config);
    function config() { }
})();
//# sourceMappingURL=modal.config.js.map
var components;
(function (components) {
    var modal;
    (function (modal) {
        var modalMeetingPoint;
        (function (modalMeetingPoint) {
            var ModalMeetingPointController = (function () {
                function ModalMeetingPointController($uibModalInstance, dataSetModal) {
                    this.$uibModalInstance = $uibModalInstance;
                    this.dataSetModal = dataSetModal;
                    this._init();
                }
                ModalMeetingPointController.prototype._init = function () {
                    this.form = {};
                    this.error = {
                        message: ''
                    };
                    this.mapConfigModal = {
                        type: 'modal-assign-marker-map',
                        data: null
                    };
                    this.activate();
                };
                ModalMeetingPointController.prototype.activate = function () {
                    console.log('modalMeetingPoint controller actived');
                };
                ModalMeetingPointController.prototype.close = function () {
                    this.$uibModalInstance.close();
                    event.preventDefault();
                };
                return ModalMeetingPointController;
            }());
            ModalMeetingPointController.controllerId = 'mainApp.components.modal.ModalMeetingPointController';
            ModalMeetingPointController.$inject = [
                '$uibModalInstance',
                'dataSetModal'
            ];
            angular.module('mainApp.components.modal')
                .controller(ModalMeetingPointController.controllerId, ModalMeetingPointController);
        })(modalMeetingPoint = modal.modalMeetingPoint || (modal.modalMeetingPoint = {}));
    })(modal = components.modal || (components.modal = {}));
})(components || (components = {}));
//# sourceMappingURL=modalMeetingPoint.controller.js.map