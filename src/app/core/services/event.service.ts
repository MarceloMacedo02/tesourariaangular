import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface EventData {
  name: string;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private eventSubject = new Subject<EventData>();

  constructor() { }

  /**
   * Emit an event
   */
  emit(event: EventData): void {
    this.eventSubject.next(event);
  }

  /**
   * Listen to an event
   */
  on(eventName: string): Observable<EventData> {
    return this.eventSubject.asObservable()
      .pipe(
        // Filter events by name
        (source) => new Observable<EventData>(subscriber => {
          const subscription = source.subscribe({
            next: (eventData) => {
              if (eventData.name === eventName) {
                subscriber.next(eventData);
              }
            },
            error: (err) => subscriber.error(err),
            complete: () => subscriber.complete()
          });
          
          return subscription;
        })
      );
  }

  /**
   * Listen to multiple events
   */
  onAny(...eventNames: string[]): Observable<EventData> {
    return this.eventSubject.asObservable()
      .pipe(
        // Filter events by any of the provided names
        (source) => new Observable<EventData>(subscriber => {
          const subscription = source.subscribe({
            next: (eventData) => {
              if (eventNames.includes(eventData.name)) {
                subscriber.next(eventData);
              }
            },
            error: (err) => subscriber.error(err),
            complete: () => subscriber.complete()
          });
          
          return subscription;
        })
      );
  }
}