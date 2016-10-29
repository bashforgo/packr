/// <reference path="../typings/index.d.ts"/>

import 'jquery';
import 'semantic-ui-css/semantic.css';
import 'semantic-ui-css/semantic.js';

import 'core-js/client/shim';
import 'zone.js/dist/zone';

import '@angular/common';

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app';

declare var process : any;
if (process.env.NODE_ENV === 'production') {
  enableProdMode();
} else {
  Error['stackTraceLimit'] = Infinity; // tslint:disable-line:no-string-literal
  require('zone.js/dist/long-stack-trace-zone'); // tslint:disable-line:no-var-requires
}

platformBrowserDynamic().bootstrapModule(AppModule);
