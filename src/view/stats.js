import AbstractView from './abstract.js';

const createStatsTemplate = () => `<div class="statistics__item">Statistics
<canvas class="statistics__chart" id="money" width="900"></canvas>
</div>

<div class="statistics__item">
<canvas class="statistics__chart" id="type" width="900"></canvas>
</div>

<div class="statistics__item">
<canvas class="statistics__chart" id="time-spend" width="900"></canvas>
</div>`;

export default class SiteMenu extends AbstractView {

  getTemplate() {
    return createStatsTemplate();
  }

}
