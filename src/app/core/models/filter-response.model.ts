export interface FilterResponseModel {
  interventionType: any;
  intervention: any[];
  species: any;
  strain: any[];
  avgLifespanChangePercent: any; // TODO: typing
  maxLifespanChangePercent: any;
  minLifespan: any;
  medLifespan: any;
  avgLifespan: any;
  maxLifespan: any;
  year: number[];
}

export interface FilterStateModel {
  byInterventionType: any;
  byIntervention: any[];
  bySpecies: any;
  byStrain: any[];
  byAvgLifespanChangePercent: any; // TODO: typing
  byMaxLifespanChangePercent: any;
  byMinLifespan: any;
  byMedLifespan: any;
  byAvgLifespan: any;
  byMaxLifespan: any;
  byYear: number[];
}


export type FilterQueryParams =
  | 'byInterventionType'
  | 'byIntervention'
  | 'bySpecies'
  | 'byStrain'
  | 'byAvgLifespanChangePercent'
  | 'byMaxLifespanChangePercent'
  | 'byMinLifespan'
  | 'byMedLifespan'
  | 'byAvgLifespan'
  | 'byMaxLifespan'
  | 'byYear';

// [FilterQueryParams as key]: [FilterResponseModel as key]
export enum FilterParamsToResponse {
  byInterventionType = 'interventionType',
  byIntervention = 'intervention',
  bySpecies = 'species',
  byStrain = 'strain',
  byAvgLifespanChangePercent = 'avgLifespanChangePercent',
  byMaxLifespanChangePercent = 'maxLifespanChangePercent',
  byMinLifespan = 'minLifespan',
  byMedLifespan = 'medLifespan',
  byAvgLifespan = 'avgLifespan',
  byMaxLifespan = 'maxLifespan',
  byYear = 'year'
}
