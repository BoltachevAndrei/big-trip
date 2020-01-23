export default class OfferModel {
  constructor(data) {
    this.type = data[`type`];
    this.offers = data[`offers`] || [];
  }

  static parseOffer(data) {
    return new OfferModel(data);
  }

  static parseOffers(data) {
    return data.map(OfferModel.parseOffer);
  }
}
