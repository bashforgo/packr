import { Component, QueryList, ContentChildren, AfterContentInit } from '@angular/core';
import { TabComponent } from './tab';
import { AnalyticsService } from '../analytics/analytics.service';

@Component({
  selector: 'pr-tabs',
  template,
  styles
})
export class TabsComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;
  private activeTab : TabComponent;

  constructor(private analytics : AnalyticsService) {}

  ngAfterContentInit() : void {
    this.tabs.forEach(t => t.active = false);

    this.selectTab(this.tabs.first);
  }

  selectTab(tab : TabComponent) {
    if (this.activeTab) {
      this.activeTab.active = false;
    }
    this.activeTab = tab;
    this.activeTab.active = true;
    this.analytics.view(tab.tabTitle);
  }
}
