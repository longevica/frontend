// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  name: 'default',
  production: false,
  apiUrl: 'https://d4kppyp4im.us-east-2.awsapprunner.com/',
  apiMocks: {
    experimentsList: '../assets/mocks/experiments-list-mock.json',
    speciesList: '../assets/mocks/species-list-mock.json',
    plotData: '../assets/mocks/plot-data-mock.json'
  },
  languages: ['ru', 'en', 'zh'],
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
