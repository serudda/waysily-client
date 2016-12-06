/**
 * Specifies the Classes and Interfaces related to Teachers in our Model
 */

module app.models.teacher {

    /****************************************/
    /*         INTERFACES DEFINITION        */
    /****************************************/


    /************************************************/
    /*           TEACHER CLASS DEFINITION           */
    /************************************************/

    export class Teacher extends app.models.user.User {

        /*-- PROPERTIES --*/
        private languages: Language;
        private type: string;
        private teacherSince: string;
        private experiences: Array<Experience>;

        /**********************************/
        /*           CONSTRUCTOR          */
        /**********************************/
        constructor(obj: any = {}) {
            //LOG
            console.log('Teacher Model instanced');

            //init properties
            super(obj);
            this.languages = new Language(obj.languages);
            this.type = obj.type || '';
            this.teacherSince = obj.teacherSince || '';

            if(obj != {}) {

                this.experiences = [];
                for (let key in obj.experiences) {
                    let experienceInstance = new Experience(obj.experiences[key]);
                    this.addExperience(experienceInstance);
                }

            } else {
                this.experiences = [];
            }

        }

        /**********************************/
        /*             METHODS            */
        /**********************************/

        get Languages() {
            return this.languages;
        }

        set Languages(languages: Language) {
            if (languages === undefined) { throw 'Please supply languages'; }
            this.languages = languages;
        }

        get Type() {
            return this.type;
        }

        set Type(type: string) {
            if (type === undefined) { throw 'Please supply type of teacher'; }
            this.type = type;
        }

        get TeacherSince() {
            return this.teacherSince;
        }

        set TeacherSince(teacherSince: string) {
            if (teacherSince === undefined) { throw 'Please supply teacher since'; }
            this.teacherSince = teacherSince;
        }

        get Experiences() {
            return this.experiences;
        }

        addExperience(experience: Experience): void {
            if(experience === undefined) { throw 'Please supply experience value (Add)'; }
            this.experiences.push(experience);
        }

        editExperience(experience: Experience): void {
            if(experience === undefined) { throw 'Please supply experience value (Edit)'; }
            //Edit existing Experience
            this.experiences.forEach(function (element, index, array) {
                if (experience.Id === element.Id) {
                    array[index] = experience;
                }
            });
        }

    }


    /************************************************/
    /*          LANGUAGE CLASS DEFINITION           */
    /************************************************/

    export class Language {

        /*-- PROPERTIES --*/
        private id: number;
        private native: Array<string>;
        private learn: Array<string>;
        private teach: Array<string>;

        /**********************************/
        /*           CONSTRUCTOR          */
        /**********************************/
        constructor(obj: any = {}) {
            //LOG
            console.log('Languages Model instanced');

            //init properties
            this.id = obj.id;

            //Is required use null here because en DB save: "[]"
            if(typeof obj.native === 'string') {
                this.native = JSON.parse(obj.native);
            } else {
                this.native = obj.native || null;
            }

            if(typeof obj.learn === 'string') {
                this.learn = JSON.parse(obj.learn);
            } else {
                this.learn = obj.learn || null;
            }

            if(typeof obj.teach === 'string') {
                this.teach = JSON.parse(obj.teach);
            } else {
                this.teach = obj.teach || null;
            }

        }

        /**********************************/
        /*             METHODS            */
        /**********************************/

        get Id() {
            return this.id;
        }

        set Id(id: number) {
            if (id === undefined) { throw 'Please supply id'; }
            this.id = id;
        }

        get Native() {
            return this.native;
        }

        set Native(native: Array<string>) {
            if (native === undefined) { throw 'Please supply native languages'; }
            this.native = native;
        }

        get Learn() {
            return this.learn;
        }

        set Learn(learn: Array<string>) {
            if (learn === undefined) { throw 'Please supply learn languages'; }
            this.learn = learn;
        }

        get Teach() {
            return this.teach;
        }

        set Teach(teach: Array<string>) {
            if (teach === undefined) { throw 'Please supply teach languages'; }
            this.teach = teach;
        }


    }



    /************************************************/
    /*          EXPERIENCE CLASS DEFINITION         */
    /************************************************/

    export class Experience {

        /*-- PROPERTIES --*/
        private id: number;
        private position: string;
        private company: string;
        private country: string;
        private city: string;
        private dateStart: string;
        private dateFinish: string;
        private description: string;

        /**********************************/
        /*           CONSTRUCTOR          */
        /**********************************/
        constructor(obj: any = {}) {
            //LOG
            console.log('Experience Model instanced');

            //init properties
            this.id = obj.id;
            this.position = obj.position || '';
            this.company = obj.company || '';
            this.country = obj.country || '';
            this.city = obj.city || '';
            this.dateStart = obj.dateStart || '';
            this.dateFinish = obj.dateFinish || '';
            this.description = obj.description || '';

        }

        /**********************************/
        /*             METHODS            */
        /**********************************/

        get Id() {
            return this.id;
        }

        set Id(id: number) {
            if (id === undefined) { throw 'Please supply experience id'; }
            this.id = id;
        }

        get Position() {
            return this.position;
        }

        set Position(position: string) {
            if (position === undefined) { throw 'Please supply position on company'; }
            this.position = position;
        }

        get Company() {
            return this.company;
        }

        set Company(company: string) {
            if (company === undefined) { throw 'Please supply company experience'; }
            this.company = company;
        }

        get Country() {
            return this.country;
        }

        set Country(country: string) {
            if (country === undefined) { throw 'Please supply country experience'; }
            this.country = country;
        }

        get DateStart() {
            return this.dateStart;
        }

        set DateStart(dateStart: string) {
            if (dateStart === undefined) { throw 'Please supply dateStart experience'; }
            this.dateStart = dateStart;
        }

        get DateFinish() {
            return this.dateFinish;
        }

        set DateFinish(dateFinish: string) {
            if (dateFinish === undefined) { throw 'Please supply dateFinish experience'; }
            this.dateFinish = dateFinish;
        }

        get Description() {
            return this.dateFinish;
        }

        set Description(description: string) {
            if (description === undefined) { throw 'Please supply description experience'; }
            this.description = description;
        }


    }

}
