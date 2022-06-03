import { Inject, Injectable } from '@angular/core';
import { fromEvent, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class WindowWidthService {
  public windowWidth$: Observable<number>;
  public scroll$: Observable<number>;

  constructor(
    @Inject(DOCUMENT) public document: Document,
  ) {
    this.windowWidth$ = fromEvent(window, 'resize')
      .pipe(
        map(() => {
          const documentElement = document.documentElement;
          const bodyElement = document.body || document.getElementsByTagName('body')[0];
          return (
            window.innerWidth || documentElement.clientWidth || bodyElement.clientWidth
          );
        }),
      );

    this.scroll$ = fromEvent(window, 'scroll')
      .pipe(
        map(() => window.scrollY || this.document.documentElement.scrollTop),
      );
  }

  public setWindowWidth(): Observable<number> {
    const documentElement = document.documentElement;
    const bodyElement = document.body || document.getElementsByTagName('body')[0];
    return of(
      window.innerWidth || documentElement.clientWidth || bodyElement.clientWidth,
    );
  }
}
