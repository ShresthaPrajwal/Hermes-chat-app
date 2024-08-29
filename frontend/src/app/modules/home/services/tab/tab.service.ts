import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TabService {
  private selectedTabSubject = new BehaviorSubject<string>('chats');
  public selectedTab$ = this.selectedTabSubject.asObservable();

  public setSelectedTab(tab: string): void {
    this.selectedTabSubject.next(tab);
  }

  public getSelectedTab(): string {
    return this.selectedTabSubject.value;
  }
}
