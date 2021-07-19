import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import * as Bowser from 'bowser';

import Parser = Bowser.Parser.Parser;

@Injectable({
  providedIn: 'root'
})
export class BrowserService {
  private bowser: Parser;

  constructor(
    private platform: Platform
  ) {
    this.bowser = Bowser.getParser(window.navigator.userAgent);
  }

  checkDesktop(): boolean {
    return this.bowser.getPlatform().type === 'desktop';
  }

  checkChrome(): boolean {
    return this.bowser.getPlatform().type === 'desktop' && this.bowser.getBrowser().name === 'Chrome';
  }

  checkMac(): boolean {
    return this.bowser.getBrowser().name === 'Safari'
      && this.bowser.getPlatform().type === 'desktop'
      && this.bowser.getPlatform().vendor === 'Apple';
  }

  checkIOS(): boolean {
    return this.platform.is('ios');
  }

  checkExplorer(): boolean {
    return this.bowser.getBrowserName() === 'Internet Explorer';
  }
}
