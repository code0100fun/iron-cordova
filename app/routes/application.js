import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return {
      items: Ember.A([{
        id: 0,
        name: 'Ben Sparrow',
        lastText: 'You on your way?',
        face: 'http://www.placecage.com/300/400'
      }, {
        id: 1,
        name: 'Max Lynx',
        lastText: 'Hey, it\'s me',
        face: 'http://www.placecage.com/400/500'
      }, {
        id: 2,
        name: 'Andrew Jostlin',
        lastText: 'Did you get the ice cream?',
        face: 'http://www.placecage.com/400/300'
      }, {
        id: 3,
        name: 'Adam Bradleyson',
        lastText: 'I should buy a boat',
        face: 'http://www.placecage.com/500/400'
      }, {
        id: 4,
        name: 'Perry Governor',
        lastText: 'Look at my mukluks!',
        face: 'http://www.placecage.com/400/400'
      }])
    };
  }
});
