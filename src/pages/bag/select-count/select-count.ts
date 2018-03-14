import {Component} from "@angular/core";
import {NavParams} from "ionic-angular";

@Component({
  selector: 'page-select-count',
  templateUrl: 'select-count.html'
})
export class SelectCount {
  count = [];

  constructor(public navParams: NavParams) {
    const _count = this.navParams.get('count');
    let _countArr = [];
    for(let i = 1; i <= _count; i++) {
      let _countObj = {
        key: i,
        value: i
      };
      _countArr.push(_countObj);
    }
    this.count = _countArr;
  }
}
