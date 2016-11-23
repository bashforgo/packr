import { Component, QueryList, ContentChildren, AfterContentInit } from '@angular/core';
import { TabComponent } from './tab';

@Component({
  selector: 'pr-tabs',
  template,
  styles
})
export class TabsComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;
  private activeTab : TabComponent;

  ngAfterContentInit() : void {
    this.tabs.forEach(t => t.active = false);

    this.tabs.first.active = true;
    this.activeTab = this.tabs.first;
  }

  selectTab(tab : TabComponent) {
    this.activeTab.active = false;
    this.activeTab = tab;
    this.activeTab.active = true;
  }
}
