import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { Directive } from '@angular/core';

@Directive() // No-op, just for Angular compiler
export abstract class NgsSubscriber {
  protected readonly destroy$ = new Subject<void>();

  protected subscriptions: Subscription[] = [];

  subscribe<T>(subscribeTo: Observable<T>, nextObserver: (value: T) => void): void {
    subscribeTo.pipe(takeUntil(this.destroy$)).subscribe(nextObserver);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.subscriptions.forEach((subscriber) => subscriber.unsubscribe());
  }
}
