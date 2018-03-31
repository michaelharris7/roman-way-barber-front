# Evan's Roman Way Barber Shop - Front End

- This is an App developed to promote Evan's Roman Way Barber Shop in Pleasant Grove, UT
- This is also the capstone project I created to graduate from Bottega Tech's Full Stack Development Course
- This Angular app is just the Front End portion of this website.
- There are also Ruby on Rails microservice apps that I use to store services, documents, and appointments.

## Key requirement: company needs data for promoting services, dispaying contact info, and implementing appointment scheduler

### Components
- Homepage
- Contact Info
- About Company
- Services
- Testimonials
- Blog
- Appointment Scheduler

### Features
- SMS Sending -> reminder of appointment with link to change appointment -> integrated with Heroku scheduler
- Administrate admin dashboard
- Block non-admin and guest users
- Email summary to managers for appointment review -> Highlights with times not filled
- Mobile Friendly
- Remove unnecessary nav bar buttons for managers
- Implement Honeybadger error reporting
- Implement new relic or equivalent for keeping site alive
- Ability for users to set appointment
- API connections with microservicing apps
- API GET and PUT for appointments
- API GET and PUT for blog
- API GET for services
- API GET for documents

### TODOs:
- Create Components
- Nav Bar
- Style all view pages
- Integrate API connections with microserving apps
x Angular Bootstrap

### Project Requirements:
- Angular application for the front end portion of the system
- Rails API for the backend
- Use Github for version control
- Use TDD for Rails API application


## Angular CLI Configuration Details

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.7.3.

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).