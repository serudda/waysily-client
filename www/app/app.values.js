(function () {
    'use strict';
    var DEBUG = true;
    var BASE_URL = 'https://waysily-server.herokuapp.com/api/v1/';
    var BUCKETS3 = 'waysily-img/teachers-avatar-prd';
    if (DEBUG) {
        BASE_URL = 'https://waysily-server-dev.herokuapp.com/api/v1/';
        BUCKETS3 = 'waysily-img/teachers-avatar-dev';
    }
    var dataConfig = {
        debug: DEBUG,
        currentYear: '2017',
        baseUrl: BASE_URL,
        domain: 'www.waysily.com',
        https: false,
        autoRefreshTokenIntervalSeconds: 300,
        localOAuth2Key: 'fCY4EWQIPuixOGhA9xRIxzVLNgKJVmG1CVnwXssq',
        googleMapKey: 'AIzaSyD-vO1--MMK-XmQurzNQrxW4zauddCJh5Y',
        mixpanelTokenPRD: '86a48c88274599c662ad64edb74b12da',
        mixpanelTokenDEV: 'eda475bf46e7f01e417a4ed1d9cc3e58',
        modalMeetingPointTmpl: 'components/modal/modalMeetingPoint/modalMeetingPoint.html',
        modalLanguagesTmpl: 'components/modal/modalLanguages/modalLanguages.html',
        modalExperienceTmpl: 'components/modal/modalExperience/modalExperience.html',
        modalEducationTmpl: 'components/modal/modalEducation/modalEducation.html',
        modalCertificateTmpl: 'components/modal/modalCertificate/modalCertificate.html',
        modalSignUpTmpl: 'components/modal/modalSignUp/modalSignUp.html',
        modalRecommendTeacherTmpl: 'components/modal/modalRecommendTeacher/modalRecommendTeacher.html',
        bucketS3: BUCKETS3,
        regionS3: 'us-east-1',
        accessKeyIdS3: 'AKIAIHKBYIUQD4KBIRLQ',
        secretAccessKeyS3: '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',
        userId: '',
        teacherIdLocalStorage: 'waysily.teacher_id',
        earlyIdLocalStorage: 'waysily.early_id',
        cookieName: 'token'
    };
    angular
        .module('mainApp')
        .constant('dataConfig', dataConfig);
})();
//# sourceMappingURL=app.values.js.map