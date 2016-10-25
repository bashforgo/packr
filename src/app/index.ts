import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import { NgSemanticModule } from 'ng-semantic';

import {routing, RootComponent} from './routes';

import {HelloComponent} from './hello';

@NgModule({
  imports: [
    BrowserModule,
    routing,
    NgSemanticModule
  ],
  declarations: [
    RootComponent,
    HelloComponent
  ],
  bootstrap: [RootComponent]
})
export class AppModule {}
