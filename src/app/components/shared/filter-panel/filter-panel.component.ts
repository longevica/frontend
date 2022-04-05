import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { FilterTypes } from '../../../core/models/filter-params.model';
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
  // - Avg lifespan change %
  public avgLifespan: RangeValue = {
    min: 0,
    max: 0,
    currentMin: 0,
    currentMax: 0,
  };
  // - Max lifespan change %
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
      avgLifespanMinInput: new FormControl(0, null),
      avgLifespanMaxInput: new FormControl(0, null),
      maxLifespanMinInput: new FormControl(0, null),
      maxLifespanMaxInput: new FormControl(0, null),
    });
  }

  ngOnInit(): void {
    // FILTERS
    // Intervention types (select)
    this.interventionTypes = this.getEntitiesList('interventionType');
    this.filterParametersService.retrieveQueryParamFromUrl('interventionType')
      .pipe(takeUntil(this.subscription$))
      .subscribe((res) => {
        console.log('interventionType pram from url: ', res);
        this.selectedInterventionType = res;
      });

    // Interventions (multiple select)
    this.pickInterventions();

    // Species (select)
    this.species = this.getEntitiesList('species');
    this.filterParametersService.retrieveQueryParamFromUrl('species')
      .pipe(takeUntil(this.subscription$))
      .subscribe((res) => {
        this.selectedSpecies = res;
      });

    // Avg lifespan change % (range slider)
    this.avgLifespan.min = this.getEntitiesList('avgLifespan').min;
    this.avgLifespan.max = this.getEntitiesList('avgLifespan').max;
    this.avgLifespan.currentMin = this.avgLifespan.min;
    this.avgLifespan.currentMax = this.avgLifespan.max;

    // Max lifespan change % (range slider)
    this.maxLifespan.min = this.getEntitiesList('maxLifespan').min;
    this.maxLifespan.max = this.getEntitiesList('maxLifespan').max;
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

  private getEntitiesList(key: FilterTypes): any[] | any | null {
    if (this.filters && this.filters[key]) {
      return this.filters[key];
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
  apply(key: FilterTypes, $event: MatSelectChange, callback?: Function): void {
    let value = $event.value;
    if (Array.isArray($event.value)) {
      value = $event.value[0];
    }

    this.filterParametersService.applyQueryParams(key, value);
    this.filterApplied.emit({name: key, value: value});
    if (callback) {
      callback.call(this);
    }
  }

  applyRange(key: FilterTypes, field: any, rangePoint: 'min' | 'max', $event: number): void {
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
    this.filterApplied.emit({ name: key, value: value });
    this.cdRef.detectChanges();
  }

  public pickInterventions(): void {
    // Cancel interventions' selected option before
    this.selectedInterventions = [];
    this.filterApplied.emit({name: 'interventions', value: []});
    // Show a list of interventions filtered by a 'type' field
    const interventions = this.getEntitiesList('intervention');
    this.interventions = interventions.filter((intervention: Intervention) => intervention?.type == this.selectedInterventionType);
    this.filterParametersService.retrieveQueryParamFromUrl('intervention')
      .pipe(takeUntil(this.subscription$))
      .subscribe((res) => {
        // @ts-ignore
        this.selectedInterventions = new Array(res);
        console.log('pickInterventions: ', this.selectedInterventions);
      });
  }
}
