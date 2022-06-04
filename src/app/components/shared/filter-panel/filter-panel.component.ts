import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnChanges, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import {
  FilterQueryParams,
  FilterParamsToResponse,
} from '../../../core/models/filter-response.model';
import { Filters } from '../../../core/models/api/filters.model';
import { Subject } from 'rxjs';
import { FilterParametersService } from '../../../core/services/filter-parameters.service';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

type RangeValue = { [key: string]: number };

@Component({
  selector: 'app-filter-panel',
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.scss'],
})
export class FilterPanelComponent implements OnChanges, OnDestroy {
  public filtersForm: FormGroup;
  // FILTERS
  // Selects
  // - Interventions (multiple)
  public selectedInterventions: any[] = [];
  public interventionsSearchValue = '';
  public dietInterventions: any[] = [];
  public drugInterventions: any[] = [];
  private cachedDietInterventions: any[] = [];
  private cachedDrugInterventions: any[] = [];
  // - Species
  public selectedSpecies: any[] = [];
  public species: any[] = [];
  // Strain
  public selectedStrain: any[] = [];
  public strain: any[] = [];
  // Year
  public selectedYear = '';
  public year: any[] = [];
  // Sex
  public selectedSex = '';
  public sex: any[] = [];

  // Sliders
  public slidersStep = 5;
  // - Avg lifespan change (units)
  public minLifespan: RangeValue = {
    min: 0,
    max: 0,
    currentMin: 0,
    currentMax: 0,
  };
  // - Max lifespan change (units)
  public medLifespan: RangeValue = {
    min: 0,
    max: 0,
    currentMin: 0,
    currentMax: 0,
  };
  // - Avg lifespan change (units)
  public avgLifespan: RangeValue = {
    min: 0,
    max: 0,
    currentMin: 0,
    currentMax: 0,
  };
  // - Max lifespan change (units)
  public maxLifespan: RangeValue = {
    min: 0,
    max: 0,
    currentMin: 0,
    currentMax: 0,
  };

  // - Min lifespan change (percent)
  public minLifespanChangePercent: RangeValue = {
    min: 0,
    max: 0,
    currentMin: 0,
    currentMax: 0,
  };
  // - Max lifespan change (percent)
  public medLifespanChangePercent: RangeValue = {
    min: 0,
    max: 0,
    currentMin: 0,
    currentMax: 0,
  };
  // - Avg lifespan change (percent)
  public avgLifespanChangePercent: RangeValue = {
    min: 0,
    max: 0,
    currentMin: 0,
    currentMax: 0,
  };
  // - Max lifespan change (percent)
  public maxLifespanChangePercent: RangeValue = {
    min: 0,
    max: 0,
    currentMin: 0,
    currentMax: 0,
  };

  private subscription$ = new Subject();
  private filters: Filters;

  @Input()
  set filterOptions(f: Filters) {
    this.filters = f;
    Object.freeze(this.filters);
  }
  @Output() filterApplied: EventEmitter<{ name: string, value: any }> = new EventEmitter<{ name: string, value: any }>();

  constructor(
    private filterParametersService: FilterParametersService,
    protected snackBar: MatSnackBar,
    private readonly cdRef: ChangeDetectorRef,
  ) {
    this.filtersForm = new FormGroup({
      interventionTypeSelect: new FormControl(['', Validators.minLength(1)]),
      interventionsSelect: new FormControl([[], null]),
      speciesSelect: new FormControl(['', null]),
      strainSelect: new FormControl([[], null]),
      yearSelect: new FormControl(['', null]),
      minLifespanMinInput: new FormControl(0, null),
      minLifespanMaxInput: new FormControl(0, null),
      medLifespanMinInput: new FormControl(0, null),
      medLifespanMaxInput: new FormControl(0, null),
      avgLifespanMinInput: new FormControl(0, null),
      avgLifespanMaxInput: new FormControl(0, null),
      maxLifespanMinInput: new FormControl(0, null),
      maxLifespanMaxInput: new FormControl(0, null),
      minLifespanChangePercentMinInput: new FormControl(0, null),
      minLifespanChangePercentMaxInput: new FormControl(0, null),
      medLifespanChangePercentMinInput: new FormControl(0, null),
      medLifespanChangePercentMaxInput: new FormControl(0, null),
      avgLifespanChangePercentMinInput: new FormControl(0, null),
      avgLifespanChangePercentMaxInput: new FormControl(0, null),
      maxLifespanChangePercentMinInput: new FormControl(0, null),
      maxLifespanChangePercentMaxInput: new FormControl(0, null),
      sexInput: new FormControl(0, null),
      doiInput: new FormControl('', null),
      interventionsSearchInput: new FormControl('', null),
    });
  }

  ngOnChanges(): void {
    // FILTERS
    // Interventions (multiple select)
    this.dietInterventions = this.getEntitiesList('byIntervention').filter((i: any) => i.type === 'diet');
    this.drugInterventions = this.getEntitiesList('byIntervention').filter((i: any) => i.type === 'drug');
    this.cachedDietInterventions = [...this.dietInterventions];
    this.cachedDrugInterventions = [...this.drugInterventions];
    this.filterParametersService.retrieveQueryParamFromUrl('byIntervention')
      .pipe(takeUntil(this.subscription$))
      .subscribe((res) => {
        if (typeof res !== undefined) {
          this.selectedInterventions = res;
        }
      });

    // Species (select)
    this.species = this.getEntitiesList('bySpecies');
    this.filterParametersService.retrieveQueryParamFromUrl('bySpecies')
      .pipe(takeUntil(this.subscription$))
      .subscribe((res) => {
        if (typeof res !== undefined) {
          this.selectedSpecies = res;
        }
      });

    // TODO: Remove species filter or use for backwards compatibility
    this.strain = this.getEntitiesList('byStrain');
    this.filterParametersService.retrieveQueryParamFromUrl('byStrain')
      .pipe(takeUntil(this.subscription$))
      .subscribe((res) => {
        if (typeof res !== undefined && res?.length > 0) {
          this.selectedStrain = this.filterParametersService.decode(res).split(',');
        }
      });

    this.year = this.getEntitiesList('byYear');
    this.filterParametersService.retrieveQueryParamFromUrl('byYear')
      .pipe(takeUntil(this.subscription$))
      .subscribe((res) => {
        this.selectedYear = res;
      });

    // Min lifespan change units (range slider)
    this.minLifespan.min = this.getEntitiesList('byMinLifespan')?.min ?? 0;
    this.minLifespan.max = this.getEntitiesList('byMinLifespan')?.max ?? 0;
    this.minLifespan.currentMin = this.minLifespan.min;
    this.minLifespan.currentMax = this.minLifespan.max;
    this.filterParametersService.retrieveQueryParamFromUrl('byMinLifespan')
      .pipe(takeUntil(this.subscription$))
      .subscribe((res) => {
        if (typeof res !== undefined && res?.length > 0) {
          this.minLifespan.currentMin = res.split(',')[0];
          this.minLifespan.currentMax = res.split(',')[1];
        }
      });

    // Med lifespan change units (range slider)
    this.medLifespan.min = this.getEntitiesList('byMedLifespan')?.min ?? 0;
    this.medLifespan.max = this.getEntitiesList('byMedLifespan')?.max ?? 0;
    this.medLifespan.currentMin = this.medLifespan.min;
    this.medLifespan.currentMax = this.medLifespan.max;
    this.filterParametersService.retrieveQueryParamFromUrl('byMedLifespan')
      .pipe(takeUntil(this.subscription$))
      .subscribe((res) => {
        if (typeof res !== undefined && res?.length > 0) {
          this.medLifespan.currentMin = res.split(',')[0];
          this.medLifespan.currentMax = res.split(',')[1];
        }
      });

    // Avg lifespan change units (range slider)
    this.avgLifespan.min = this.getEntitiesList('byAvgLifespan')?.min ?? 0;
    this.avgLifespan.max = this.getEntitiesList('byAvgLifespan')?.max ?? 0;
    this.avgLifespan.currentMin = this.avgLifespan.min;
    this.avgLifespan.currentMax = this.avgLifespan.max;
    this.filterParametersService.retrieveQueryParamFromUrl('byAvgLifespan')
      .pipe(takeUntil(this.subscription$))
      .subscribe((res) => {
        if (typeof res !== undefined && res?.length > 0) {
          this.avgLifespan.currentMin = res.split(',')[0];
          this.avgLifespan.currentMax = res.split(',')[1];
        }
      });

    // Max lifespan change units (range slider)
    this.maxLifespan.min = this.getEntitiesList('byMaxLifespan')?.min ?? 0;
    this.maxLifespan.max = this.getEntitiesList('byMaxLifespan')?.max ?? 0;
    this.maxLifespan.currentMin = this.maxLifespan.min;
    this.maxLifespan.currentMax = this.maxLifespan.max;
    this.filterParametersService.retrieveQueryParamFromUrl('byMaxLifespan')
      .pipe(takeUntil(this.subscription$))
      .subscribe((res) => {
        if (typeof res !== undefined && res?.length > 0) {
          this.maxLifespan.currentMin = res.split(',')[0];
          this.maxLifespan.currentMax = res.split(',')[1];
        }
      });

    // Min lifespan change percent (range slider)
    this.minLifespanChangePercent.min = this.getEntitiesList('byMinLifespanChangePercent')?.min ?? 0;
    this.minLifespanChangePercent.max = this.getEntitiesList('byMinLifespanChangePercent')?.max ?? 0;
    this.minLifespanChangePercent.currentMin = this.minLifespanChangePercent.min;
    this.minLifespanChangePercent.currentMax = this.minLifespanChangePercent.max;
    this.filterParametersService.retrieveQueryParamFromUrl('byMinLifespanChangePercent')
      .pipe(takeUntil(this.subscription$))
      .subscribe((res) => {
        if (typeof res !== undefined && res?.length > 0) {
          this.minLifespanChangePercent.currentMin = res.split(',')[0];
          this.minLifespanChangePercent.currentMax = res.split(',')[1];
        }
      });

    // Med lifespan change percent (range slider)
    this.medLifespanChangePercent.min = this.getEntitiesList('byMedLifespanChangePercent')?.min ?? 0;
    this.medLifespanChangePercent.max = this.getEntitiesList('byMedLifespanChangePercent')?.max ?? 0;
    this.medLifespanChangePercent.currentMin = this.medLifespanChangePercent.min;
    this.medLifespanChangePercent.currentMax = this.medLifespanChangePercent.max;
    this.filterParametersService.retrieveQueryParamFromUrl('byMedLifespanChangePercent')
      .pipe(takeUntil(this.subscription$))
      .subscribe((res) => {
        if (typeof res !== undefined && res?.length > 0) {
          this.medLifespanChangePercent.currentMin = res.split(',')[0];
          this.medLifespanChangePercent.currentMax = res.split(',')[1];
        }
      });

    // Avg lifespan change percent (range slider)
    this.avgLifespanChangePercent.min = this.getEntitiesList('byAvgLifespanChangePercent')?.min ?? 0;
    this.avgLifespanChangePercent.max = this.getEntitiesList('byAvgLifespanChangePercent')?.max ?? 0;
    this.avgLifespanChangePercent.currentMin = this.avgLifespanChangePercent.min;
    this.avgLifespanChangePercent.currentMax = this.avgLifespanChangePercent.max;
    this.filterParametersService.retrieveQueryParamFromUrl('byAvgLifespanChangePercent')
      .pipe(takeUntil(this.subscription$))
      .subscribe((res) => {
        if (typeof res !== undefined && res?.length > 0) {
          this.avgLifespanChangePercent.currentMin = res.split(',')[0];
          this.avgLifespanChangePercent.currentMax = res.split(',')[1];
        }
      });

    // Max lifespan change percent (range slider)
    this.maxLifespanChangePercent.min = this.getEntitiesList('byMaxLifespanChangePercent')?.min ?? 0;
    this.maxLifespanChangePercent.max = this.getEntitiesList('byMaxLifespanChangePercent')?.max ?? 0;
    this.maxLifespanChangePercent.currentMin = this.maxLifespanChangePercent.min;
    this.maxLifespanChangePercent.currentMax = this.maxLifespanChangePercent.max;
    this.filterParametersService.retrieveQueryParamFromUrl('byMaxLifespanChangePercent')
      .pipe(takeUntil(this.subscription$))
      .subscribe((res) => {
        if (typeof res !== undefined && res?.length > 0) {
          this.maxLifespanChangePercent.currentMin = res.split(',')[0];
          this.maxLifespanChangePercent.currentMax = res.split(',')[1];
        }
      });
  }

  ngOnDestroy(): void {
    this.subscription$.complete();
  }

  /**
   * Check if values being passed into a select control exist in options array
   */

  public compareSelectValues(value1: any | any[], value2: any): boolean {
    if (value1 && value2) {
      // comparison should not be strict
      // tslint:disable-next-line:triple-equals
      return value1 == value2;
    }
    return false;
  }

  /**
   * Get entities for filters lists
   */

  private getEntitiesList(key: FilterQueryParams): any[] | any | null {
    const k = FilterParamsToResponse[key as FilterQueryParams];
    if (this.filters && this.filters[k]) {
      return this.filters[k];
    }
    return null;
  }

  // TODO: not all controls are FormControls
  public resetForm(): void {
    this.filtersForm.reset();
  }

  /**
   * Reset filter values
   */

  // tslint:disable-next-line:ban-types
  reset(key: FilterQueryParams, controlToReset: any, resetValue: any, $event: any, callback?: Function): void {
    const value = '';
    this.filterParametersService.applyQueryParams(key, value, '');
    if (this.filtersForm.controls[controlToReset]) {
      this.filtersForm.controls[controlToReset].reset(resetValue);
    }
    this.filterApplied.emit({ name: key, value });
    $event.stopPropagation();
    if (callback) {
      callback.call(this);
    }
  }

  resetRange(key: FilterQueryParams, field: any, $event: any): void {
    field.currentMin = Math.floor(0);
    field.currentMax = Math.floor(0);
    const value = [field.currentMin, field.currentMax];
    this.filterParametersService.applyQueryParams(key, value, '');
    this.filterApplied.emit({ name: key, value });
    $event.stopPropagation();
  }

  /**
   * Apply filter values
   */

  apply(key: FilterQueryParams, $event: MatSelectChange, callback?: () => any): void {
    let value = $event.value;
    if (Array.isArray($event.value)) {
      value = $event.value.join(',');
    }

    this.filterParametersService.applyQueryParams(key, value);
    this.filterApplied.emit({ name: key, value });
    if (callback) {
      callback.call(this);
    }
  }

  applyRange(key: FilterQueryParams, field: any, rangePoint: 'min' | 'max', $event: number): void {
    switch (rangePoint) {
      case 'min':
        field.currentMin = Math.floor($event);
        break;
      case 'max':
        field.currentMax = Math.floor($event);
        break;
    }
    const value = [field.currentMin, field.currentMax];
    this.filterParametersService.applyQueryParams(key, value);
    this.filterApplied.emit({ name: key, value });
    this.cdRef.detectChanges();
  }

  applyInut(key: FilterQueryParams, $event: any): void {
    this.filterParametersService.applyQueryParams(key, $event.value);
    this.filterApplied.emit({ name: key, value: $event.value });
  }

  public filterInterventions($event: KeyboardEvent): void {
    const searchText = ($event.target as HTMLInputElement).value.toLowerCase();
    this.interventionsSearchValue = searchText;
    if (searchText.length > 1) {
      this.dietInterventions = [...this.dietInterventions].filter((i) => i.name?.toLowerCase().includes(searchText));
      this.drugInterventions = [...this.drugInterventions].filter((i) => i.name?.toLowerCase().includes(searchText));
    }
    $event.stopPropagation();
  }

  public filterInterventionsReset(): void {
    this.interventionsSearchValue = '';
    this.dietInterventions = [...this.cachedDietInterventions];
    this.drugInterventions = [...this.cachedDrugInterventions];
  }
}
