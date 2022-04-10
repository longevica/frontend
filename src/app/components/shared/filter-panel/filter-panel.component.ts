import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import {
  FilterQueryParams,
  FilterParamsToResponse,
} from '../../../core/models/filter-response.model';
import { Filters, Intervention } from '../../../core/models/api/filters.model';
import { Subject } from 'rxjs';
import { FilterParametersService } from '../../../core/services/filter-parameters.service';
import { takeUntil } from 'rxjs/operators';

type RangeValue = {[key: string]: number};
@Component({
  selector: 'app-filter-panel',
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.scss']
})
export class FilterPanelComponent implements OnInit, OnDestroy {
  public filtersForm: FormGroup;
  // FILTERS
  // Selects
  // - Intervention types
  public selectedInterventionType = '';
  public interventionTypes: any[] | any | null;
  // - Intervention type - interventions (multiple)
  public selectedInterventions = [];
  public interventions: any[] | any | null;
  // - Species
  public selectedSpecies: any;
  public species: any[] | any | null;
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

  private subscription$ = new Subject();

  @Input() filters: Filters;
  @Output() filterApplied: EventEmitter<{name: string, value: any}> = new EventEmitter<{name: string, value: any}>();


  constructor(
    private filterParametersService: FilterParametersService,
    private readonly cdRef: ChangeDetectorRef,
  ) {
    this.filtersForm = new FormGroup({
      interventionTypeSelect: new FormControl(['', Validators.minLength(1)]),
      interventionsSelect: new FormControl([[], null]),
      speciesSelect: new FormControl(['', null]),
      minLifespanMinInput: new FormControl(0, null),
      minLifespanMaxInput: new FormControl(0, null),
      medLifespanMinInput: new FormControl(0, null),
      medLifespanMaxInput: new FormControl(0, null),
      avgLifespanMinInput: new FormControl(0, null),
      avgLifespanMaxInput: new FormControl(0, null),
      maxLifespanMinInput: new FormControl(0, null),
      maxLifespanMaxInput: new FormControl(0, null),
    });
  }

  ngOnInit(): void {
    // FILTERS
    // Intervention types (select)
    this.interventionTypes = this.getEntitiesList('byInterventionType');
    this.filterParametersService.retrieveQueryParamFromUrl('byInterventionType')
      .pipe(takeUntil(this.subscription$))
      .subscribe((res) => {
        console.log('interventionType pram from url: ', res);
        this.selectedInterventionType = res;
      });

    // Interventions (multiple select)
    this.pickInterventions();

    // Species (select)
    this.species = this.getEntitiesList('bySpecies');
    this.filterParametersService.retrieveQueryParamFromUrl('bySpecies')
      .pipe(takeUntil(this.subscription$))
      .subscribe((res) => {
        this.selectedSpecies = res;
      });

    // Min lifespan change units (range slider)
    this.minLifespan.min = this.getEntitiesList('byMinLifespan')?.min ?? 0;
    this.minLifespan.max = this.getEntitiesList('byMinLifespan')?.max ?? 0;
    this.minLifespan.currentMin = this.minLifespan.min;
    this.minLifespan.currentMax = this.minLifespan.max;

    // Med lifespan change units (range slider)
    this.medLifespan.min = this.getEntitiesList('byMedLifespan')?.min ?? 0;
    this.medLifespan.max = this.getEntitiesList('byMedLifespan')?.max ?? 0;
    this.medLifespan.currentMin = this.medLifespan.min;
    this.medLifespan.currentMax = this.medLifespan.max;

    // Avg lifespan change units (range slider)
    this.avgLifespan.min = this.getEntitiesList('byAvgLifespan')?.min ?? 0;
    this.avgLifespan.max = this.getEntitiesList('byAvgLifespan')?.max ?? 0;
    this.avgLifespan.currentMin = this.avgLifespan.min;
    this.avgLifespan.currentMax = this.avgLifespan.max;

    // Max lifespan change units (range slider)
    this.maxLifespan.min = this.getEntitiesList('byMaxLifespan')?.min ?? 0;
    this.maxLifespan.max = this.getEntitiesList('byMaxLifespan')?.max ?? 0;
    this.maxLifespan.currentMin = this.maxLifespan.min;
    this.maxLifespan.currentMax = this.maxLifespan.max;
  }

  ngOnDestroy(): void {
    this.subscription$.complete();
  }

  /**
   * Check if values being passed into a select control exist in options array
   */

  public compareSelectValues(value1: any | any[], value2: any): boolean {
    if (value1 && value2) {
      return value1 === value2;
    }
    return false;
  }

  /**
   * Get entities for filters lists
   */

  private getEntitiesList(key: FilterQueryParams): any[] | any | null {
    const k = FilterParamsToResponse[key];
    if (this.filters && this.filters[k]) {
      return this.filters[k];
    }

    return null;
  }

  public resetForm(): void {
    this.filtersForm.reset();
  }

  /**
   * Apply filter values
   */

  // tslint:disable-next-line:ban-types
  apply(key: FilterQueryParams, $event: MatSelectChange, callback?: Function): void {
    let value = $event.value;
    if (Array.isArray($event.value)) {
      value = $event.value[0];
    }

    this.filterParametersService.applyQueryParams(key, value);
    this.filterApplied.emit({name: key, value});
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

  public pickInterventions(): void {
    // Cancel interventions' selected option before
    this.selectedInterventions = [];
    this.filterApplied.emit({name: 'interventions', value: []});
    // Show a list of interventions filtered by a 'type' field
    const interventions = this.getEntitiesList('byIntervention');
    this.interventions = interventions.filter((intervention: Intervention) => intervention?.type === this.selectedInterventionType);
    this.filterParametersService.retrieveQueryParamFromUrl('byIntervention')
      .pipe(takeUntil(this.subscription$))
      .subscribe((res) => {
        // @ts-ignore
        this.selectedInterventions = new Array(res);
        console.log('pickInterventions: ', this.selectedInterventions);
      });
  }
}
