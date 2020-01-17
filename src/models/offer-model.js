export default class OfferModel {
  constructor(data) {
    this.type = data[`type`];
    this.offers = data[`offers`] || [];
  }

  parseOffer(data) {
    return new OfferModel(data);
  }

  parseOffers(data) {
    return data.map(OfferModel.parseOffer);
  }
}
