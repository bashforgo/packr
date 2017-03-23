import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { routing } from './root/routes';
import { MainComponent } from './main/main';
import { RootComponent } from './root/root';
import { ToolbarComponent } from './toolbar/toolbar';
import { ContentComponent } from './content/content';
import { PacksOpenerComponent } from './packs-opener/packs-opener';
import { SemanticModule } from './semantic';
import { ReactiveFormsModule } from '@angular/forms';
import {
  BestPacksService,
  CardsService,
  CollectionService,
  PacksGeneratorService,
  PacksOpenerService,
  StatsService
} from './data';
import { TabsComponent } from './tabs/tabs';
import { OneMoreComponent } from './one-more/one-more';
import { TabComponent } from './tabs/tab';
import { CardComponent } from './card/card';
import { PacksComponent } from './packs/packs';
import { ClassBreakdownComponent } from './class-breakdown/class-breakdown';
import { LegendComponent } from './legend/legend';
import { RarityBreakdownComponent } from './rarity-breakdown/rarity-breakdown';
import { TitleCasePipe } from './util';
import { StatsComponent } from './stats/stats';
import { AnalyticsService } from './analytics/analytics.service';
import { DisplaySettingsComponent } from './display-settings/display-settings';
import { CardFilterComponent } from './display-settings/card-filter/card-filter';
import { CardSwitchComponent } from './display-settings/card-switch/card-switch';
import { CardFilterService } from './display-settings/card-filter/card-filter.service';
import { SearchParserService } from './search';
import { CollectionComponent } from './collection/collection';
import { SearchBarComponent } from './search/bar/search-bar';
import { CollectionFilterPipe } from './filter/collection-filter.pipe';
import { FilterPipe } from './util/filter.pipe';

@NgModule({
  imports: [
    routing,
    BrowserModule,
    SemanticModule,
    ReactiveFormsModule
  ],
  declarations: [
    FilterPipe,
    TabComponent,
    CardComponent,
    MainComponent,
    RootComponent,
    TabsComponent,
    TitleCasePipe,
    PacksComponent,
    StatsComponent,
    LegendComponent,
    ToolbarComponent,
    ContentComponent,
    OneMoreComponent,
    SearchBarComponent,
    CardFilterComponent,
    CardSwitchComponent,
    CollectionComponent,
    CollectionFilterPipe,
    PacksOpenerComponent,
    ClassBreakdownComponent,
    DisplaySettingsComponent,
    RarityBreakdownComponent
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: process.env.BASE_HREF },
    CardsService,
    StatsService,
    AnalyticsService,
    BestPacksService,
    CardFilterService,
    CollectionService,
    PacksOpenerService,
    SearchParserService,
    PacksGeneratorService
  ],
  bootstrap: [RootComponent]
})
export class AppModule {
}
