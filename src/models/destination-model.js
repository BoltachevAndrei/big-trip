export default class DestinationModel {
  constructor(data) {
    this.description = data[`description`];
    this.name = data[`name`];
    this.pictures = data[`pictures`] || [];
  }

  static parseOffer(data) {
    return new DestinationModel(data);
  }

  static parseOffers(data) {
    return data.map(DestinationModel.parseOffer);
  }
}
