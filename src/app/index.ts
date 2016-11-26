import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { NgSemanticModule } from 'ng-semantic';
import { routing } from './root/routes';
import { MainComponent } from './main/main';
import { RootComponent } from './root/root';
import { ToolbarComponent } from './toolbar/toolbar';
import { ContentComponent } from './content/content';
import { PacksOpenerComponent } from './packs-opener/packs-opener';
import { SemanticModule } from './semantic';
import { ReactiveFormsModule } from '@angular/forms';
import {
  PacksOpenerService, PacksGeneratorService, CardsService, CollectionService, StatsService,
  BestPacksService
} from './data';
import { TabsComponent } from './tabs/tabs';
import { OneMoreComponent } from './one-more/one-more';
import { TabComponent } from './tabs/tab';
import { CardComponent } from './card/card';
import { PacksComponent } from './packs/packs';
import { ClassBreakdownComponent } from './class-breakdown/class-breakdown';
import { LegendComponent } from './legend/legend';
import { RarityBreakdownComponent } from './rarity-breakdown/rarity-breakdown';
import { TitleCasePipe } from './util/title-case.pipe';
import { StatsComponent } from './stats/stats';

@NgModule({
  imports: [
    routing,
    BrowserModule,
    SemanticModule,
    NgSemanticModule,
    ReactiveFormsModule
  ],
  declarations: [
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
    PacksOpenerComponent,
    ClassBreakdownComponent,
    RarityBreakdownComponent
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: process.env.BASE_HREF },
    CardsService,
    StatsService,
    BestPacksService,
    CollectionService,
    PacksOpenerService,
    PacksGeneratorService
  ],
  bootstrap: [RootComponent]
})
export class AppModule {
}
