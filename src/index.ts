import * as _ from 'lodash';

class Greeter {
  greeting: string
  constructor(message: string) {
    this.greeting = message;
  }
  greet() {
    return _.join(null, '');
  }
}

const greeter = new Greeter("It's me");
alert(greeter.greet());