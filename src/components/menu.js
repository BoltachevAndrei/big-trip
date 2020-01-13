import AbstractComponent from './abstract-component.js';

export const MenuItem = {
  LINK_CLASS: `trip-tabs__btn`,
  ACTIVE_LINK_CLASS: `trip-tabs__btn--active`,
  NEW_EVENT_CLASS: `trip-main__event-add-btn`,
  TABLE: `Table`,
  STATS: `Stats`,
  NEW_EVENT: `New event`
};

const createMenuTemplate = () => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
    <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">
      Table
    </a>
    <a class="trip-tabs__btn" href="#">
      Stats
    </a>
  </nav>`
);

export default class Menu extends AbstractComponent {
  getTemplate() {
    return createMenuTemplate();
  }

  setActiveItem(menuItem) {
    this.getElement().querySelectorAll(`.${MenuItem.LINK_CLASS}`).forEach((element) => element.innerText === menuItem ? element.classList.add(MenuItem.ACTIVE_LINK_CLASS) : element.classList.remove(MenuItem.ACTIVE_LINK_CLASS));
  }

  setOnChange(handler) {
    const element = this.getElement();
    element.addEventListener(`click`, (evt) => {
      if (evt.target.tagName.toLowerCase() === `a`) {
        const menuItem = evt.target.innerText;
        this.setActiveItem(menuItem);
        handler(menuItem);
      }
    });

    const newEventButton = document.querySelector(`.trip-main__event-add-btn`);
    newEventButton.addEventListener(`click`, (evt) => {
      if (evt.target.tagName.toLowerCase() === `button`) {
        const menuItem = evt.target.innerText;
        handler(menuItem);
      }
    });
  }
}
