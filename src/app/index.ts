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
import { SemanticModule } from './semantic/index';
import { ReactiveFormsModule } from '@angular/forms';

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
    ToolbarComponent,
    ContentComponent,
    PacksOpenerComponent
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: process.env.BASE_HREF }
  ],
  bootstrap: [RootComponent]
})
export class AppModule {
}