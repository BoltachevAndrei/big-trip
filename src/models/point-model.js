export default class PointModel {
  constructor(data) {
    this.basePrice = data[`base_price`];
    this.startDate = data[`date_from`] ? new Date(data[`date_from`]) : null;
    this.endDate = data[`date_to`] ? new Date(data[`date_to`]) : null;
    this.destination = data[`destination`];
    this.id = data[`id`] || ``;
    this.isFavorite = !!data[`is_favorite`];
    this.offers = data[`offers`] || [];
    this.type = data[`type`];
  }

  toRAW() {
    return {
      'base_price': this.basePrice,
      'date_from': this.startDate,
      'date_to': this.endDate,
      'destination': this.destination,
      'id': this.id,
      'is_favorite': this.isFavorite,
      'offers': this.offers,
      'type': this.type
    };
  }

  static parsePoint(data) {
    return new PointModel(data);
  }

  static parsePoints(data) {
    return data.map(PointModel.parsePoint);
  }

  static clone(data) {
    return new PointModel(data.toRAW());
  }
}

