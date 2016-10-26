import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { NgSemanticModule } from 'ng-semantic';

import { routing } from './root/routes';

import { MainComponent } from './main/main';
import { RootComponent } from './root/root';

@NgModule({
  imports: [
    BrowserModule,
    routing,
    NgSemanticModule
  ],
  declarations: [
    RootComponent,
    MainComponent
  ],
  bootstrap: [RootComponent]
})
export class AppModule {
}
