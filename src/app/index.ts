import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { NgSemanticModule } from 'ng-semantic';

import { routing } from './root/routes';

import { MainComponent } from './main/main';
import { RootComponent } from './root/root';
import { ToolbarComponent } from './toolbar/toolbar';

@NgModule({
  imports: [
    BrowserModule,
    routing,
    NgSemanticModule
  ],
  declarations: [
    RootComponent,
    MainComponent,
    ToolbarComponent
  ],
  bootstrap: [RootComponent]
})
export class AppModule {
}
