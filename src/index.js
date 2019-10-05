import { a } from './vendor/util';
import { chunk } from 'lodash-es';
import base from './css/base.css';
console.log(a());
console.log(chunk([1, 2, 3], 2));
let app = document.getElementById('app');
let div = document.createElement('div');
div.className = 'box';
app.appendChild(div);