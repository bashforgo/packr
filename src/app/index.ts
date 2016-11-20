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
import { PacksOpenerService, PacksGeneratorService, CardsService } from './data';
import { TabsComponent } from './tabs/tabs';
import { OneMoreComponent } from './one-more/one-more';

@NgModule({
  imports: [
    BrowserModule,
    routing,
    NgSemanticModule,
    SemanticModule,
    ReactiveFormsModule
  ],
  declarations: [
    RootComponent,
    MainComponent,
    TabsComponent,
    ToolbarComponent,
    ContentComponent,
    OneMoreComponent,
    PacksOpenerComponent
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: process.env.BASE_HREF },
    PacksOpenerService,
    PacksGeneratorService,
    CardsService
  ],
  bootstrap: [RootComponent]
})
export class AppModule {
}
