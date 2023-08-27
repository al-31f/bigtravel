import AbstractView from './abstract.js';

export default class Smart extends AbstractView {

  constructor() {
    super();
    this._pointState = {};
  }

  
  //удалить старый DOM-элемент компонента;
  //создать новый DOM-элемент;
  //поместить новый элемент вместо старого;
  //восстановить обработчики событий, вызвав restoreHandlers.
  updateElement() {
    const previousElement = this.getElement();
    const parentElement = previousElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parentElement.replaceChild(newElement, previousElement);
  }

  //обновлять данные и, если нужно, вызывать метод updateElement
  updateData(update) {
    if (!update) {
      return;
    }
    this._pointState = Object.assign(
      {},
      this._pointState,
      update,
    );
    
    if (this._pointState.justEdit === true) {
      return;
    }

    this.updateElement();
    this._restoreHandlers();

  }

  //восстанавливает обработчики после перерисовки
  _restoreHandlers() {
  }
}
