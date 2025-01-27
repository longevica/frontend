import { Item } from './api/basic-types.model';

export interface FilterResponseModel {
  interventionType: any;
  intervention: any[];
  species: any;
  strain: any[];
  minLifespanChangePercent: any;  // TODO: typing
  medLifespanChangePercent: any;
  avgLifespanChangePercent: any;
  maxLifespanChangePercent: any;
  minLifespan: any;
  medLifespan: any;
  avgLifespan: any;
  maxLifespan: any;
  year: number[];
  bySex?: Item[];
  byDoi: string;
}

export interface FilterStateModel {
  byInterventionType: any;
  byIntervention: any[];
  bySpecies: any;
  byStrain: any[];
  byMinLifespanChangePercent: any; // TODO: typing
  byMedLifespanChangePercent: any;
  byAvgLifespanChangePercent: any;
  byMaxLifespanChangePercent: any;
  byMinLifespan: any;
  byMedLifespan: any;
  byAvgLifespan: any;
  byMaxLifespan: any;
  byYear: number[];
  bySex?: number;
  byDoi: string;
}


export type FilterQueryParams =
  | 'byInterventionType'
  | 'byIntervention'
  | 'bySpecies'
  | 'byStrain'
  | 'byMinLifespanChangePercent'
  | 'byMedLifespanChangePercent'
  | 'byAvgLifespanChangePercent'
  | 'byMaxLifespanChangePercent'
  | 'byMinLifespan'
  | 'byMedLifespan'
  | 'byAvgLifespan'
  | 'byMaxLifespan'
  | 'byYear'
  | 'bySex'
  | 'byDoi';

// [FilterQueryParams as key]: [FilterResponseModel as key]
export enum FilterParamsToResponse {
  byInterventionType = 'interventionType',
  byIntervention = 'intervention',
  bySpecies = 'species',
  byStrain = 'strain',
  byMinLifespanChangePercent = 'minLifespanChangePercent',
  byMedLifespanChangePercent = 'medLifespanChangePercent',
  byAvgLifespanChangePercent = 'avgLifespanChangePercent',
  byMaxLifespanChangePercent = 'maxLifespanChangePercent',
  byMinLifespan = 'minLifespan',
  byMedLifespan = 'medLifespan',
  byAvgLifespan = 'avgLifespan',
  byMaxLifespan = 'maxLifespan',
  byYear = 'year',
  bySex = 'sex',
  byDoi = 'doi'
}
