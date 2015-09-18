import Ember from 'ember';

export default Ember.GlimmerComponent.extend({
  item: Ember.computed.alias('attrs.item'),
  width: Ember.computed.alias('attrs.width'),
  height: Ember.computed.alias('attrs.height'),
  padding: 15,
  captionHeight: 49,
  imageWidth: Ember.computed('width', 'padding', function() {
    return this.get('width') - this.get('padding') * 2;
  }),
  imageHeight: Ember.computed('height', 'padding', function() {
    return this.get('height') - this.get('captionHeight') -
                                this.get('padding') * 2;
  })
});
