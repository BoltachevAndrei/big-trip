import AbstractSmartComponent from './abstract-smart-component';
import {formatDay, formatHour} from '../utils/common.js';

const EURO_SIGN = `\u20AC`;

const createRandomColor = () => {
  const colorValue = Math.floor(Math.random() * 0xffffff);
  return `#${colorValue.toString(16)}`;
};

const getUniqueItems = (events, key) => Array.from(new Set(events.map((element) => element[key])));

const renderMoneyChart = (moneyCtx, events) => {
  const uniqueTypes = getUniqueItems(events, `type`);

  const moneyByType = uniqueTypes.map((type) => {
    return ({type,
      price: events
    .filter((event) => event.type === type)
    .map((event) => event.price)
    });
  }).map((element) => {
    return ({
      type: element.type,
      price: element.price.reduce((prev, next) => prev + next)
    });
  });

  return new window.Chart(moneyCtx, {
    plugins: [window.ChartDataLabels],
    type: `pie`,
    data: {
      labels: moneyByType.map((element) => element.type),
      datasets: [{
        data: moneyByType.map((element) => element.price),
        backgroundColor: moneyByType.map(createRandomColor)
      }]
    },
    options: {
      plugins: {
        datalabels: {
          display: false
        }
      },
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            const allData = data.datasets[tooltipItem.datasetIndex].data;
            const tooltipData = allData[tooltipItem.index];
            const total = allData.reduce((acc, it) => acc + parseFloat(it));
            const tooltipPercentage = Math.round((tooltipData / total) * 100);
            return `(${data.labels[tooltipItem.index]}) ${tooltipData}${EURO_SIGN} — ${tooltipPercentage}%`;
          }
        },
        displayColors: false,
        backgroundColor: `#ffffff`,
        bodyFontColor: `#000000`,
        borderColor: `#000000`,
        borderWidth: 1,
        cornerRadius: 0,
        xPadding: 15,
        yPadding: 15
      },
      title: {
        display: true,
        text: `Money`,
        fontSize: 16,
        fontColor: `#000000`
      },
      legend: {
        position: `left`,
        labels: {
          boxWidth: 15,
          padding: 25,
          fontStyle: 500,
          fontColor: `#000000`,
          fontSize: 13
        }
      }
    }
  });
};

const renderTransportChart = (transportCtx, events) => {
  const uniqueTypes = getUniqueItems(events, `type`);

  const transportCount = uniqueTypes.map((type) => {
    return ({type,
      count: events
    .filter((event) => event.type === type).length
    });
  });

  return new window.Chart(transportCtx, {
    plugins: [window.ChartDataLabels],
    type: `pie`,
    data: {
      labels: transportCount.map((element) => element.type),
      datasets: [{
        data: transportCount.map((element) => element.count),
        backgroundColor: transportCount.map(createRandomColor)
      }]
    },
    options: {
      plugins: {
        datalabels: {
          display: false
        }
      },
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            const allData = data.datasets[tooltipItem.datasetIndex].data;
            const tooltipData = allData[tooltipItem.index];
            const total = allData.reduce((acc, it) => acc + parseFloat(it));
            const tooltipPercentage = Math.round((tooltipData / total) * 100);
            return `(${data.labels[tooltipItem.index]}) ${tooltipData} — ${tooltipPercentage}%`;
          }
        },
        displayColors: false,
        backgroundColor: `#ffffff`,
        bodyFontColor: `#000000`,
        borderColor: `#000000`,
        borderWidth: 1,
        cornerRadius: 0,
        xPadding: 15,
        yPadding: 15
      },
      title: {
        display: true,
        text: `Transport`,
        fontSize: 16,
        fontColor: `#000000`
      },
      legend: {
        position: `left`,
        labels: {
          boxWidth: 15,
          padding: 25,
          fontStyle: 500,
          fontColor: `#000000`,
          fontSize: 13
        }
      }
    }
  });
};

const renderTimeSpendChart = (timeSpendCtx, events) => {
  const uniqueTypes = getUniqueItems(events, `type`);

  const durationByType = uniqueTypes.map((type) => {
    return ({type,
      duration: events
    .filter((event) => event.type === type)
    .map((event) => (event.endDate - event.startDate))
    });
  }).map((element) => {
    return ({
      type: element.type,
      duration: (element.duration.reduce((prev, next) => prev + next))
    });
  });

  return new window.Chart(timeSpendCtx, {
    plugins: [window.ChartDataLabels],
    type: `pie`,
    data: {
      labels: durationByType.map((element) => element.type),
      datasets: [{
        data: durationByType.map((element) => element.duration),
        backgroundColor: durationByType.map(createRandomColor)
      }]
    },
    options: {
      plugins: {
        datalabels: {
          display: false
        }
      },
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            const allData = data.datasets[tooltipItem.datasetIndex].data;
            const tooltipData = allData[tooltipItem.index];

            const total = allData.reduce((acc, it) => acc + parseFloat(it));
            const tooltipPercentage = Math.round((tooltipData / total) * 100);

            return `(${data.labels[tooltipItem.index]}) ${formatDay(tooltipData)}D ${formatHour(tooltipData)}H — ${tooltipPercentage}%`;
          }
        },
        displayColors: false,
        backgroundColor: `#ffffff`,
        bodyFontColor: `#000000`,
        borderColor: `#000000`,
        borderWidth: 1,
        cornerRadius: 0,
        xPadding: 15,
        yPadding: 15
      },
      title: {
        display: true,
        text: `Time-Spend`,
        fontSize: 16,
        fontColor: `#000000`
      },
      legend: {
        position: `left`,
        labels: {
          boxWidth: 15,
          padding: 25,
          fontStyle: 500,
          fontColor: `#000000`,
          fontSize: 13
        }
      }
    }
  });
};

const createStatisticsTemplate = () => (
  `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>

    <div class="statistics__item statistics__item--money">
      <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--transport">
      <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--time-spend">
      <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
    </div>
  </section>`
);

export default class Statistics extends AbstractSmartComponent {
  constructor(pointsModel) {
    super();
    this._pointsModel = pointsModel;

    this._moneyChart = null;
    this._transportChart = null;
    this._timeSpendChart = null;

    this._renderCharts();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  rerender(pointsModel) {
    this._pointsModel = pointsModel;
    super.rerender();
    this._renderCharts();
  }

  _renderCharts() {
    const element = this.getElement();

    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeSpendCtx = element.querySelector(`.statistics__chart--time`);

    this._resetCharts();

    this._moneyChart = renderMoneyChart(moneyCtx, this._pointsModel.getEventsAll());
    this._transportChart = renderTransportChart(transportCtx, this._pointsModel.getEventsAll());
    this._timeSpendChart = renderTimeSpendChart(timeSpendCtx, this._pointsModel.getEventsAll());
  }

  _resetCharts() {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null;
    }

    if (this._transportChart) {
      this._transportChart.destroy();
      this._transportChart = null;
    }

    if (this._timeSpendChart) {
      this._timeSpendChart.destroy();
      this._timeSpendChart = null;
    }
  }
}
