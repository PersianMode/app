import { Component } from '@angular/core';

/**
 * Generated class for the DobComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'dob',
  templateUrl: 'dob.html'
})
export class DobComponent {

  text: string;

  constructor() {
    console.log('Hello DobComponent Component');
    this.text = 'Hello World';
  }

}
