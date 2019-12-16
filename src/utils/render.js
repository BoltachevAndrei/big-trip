export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTER: `after`,
  BEFORE: `before`
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const render = (container, component, position) => {
  switch (position) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(component.getElement());
      break;
    case RenderPosition.BEFOREEND:
      container.append(component.getElement());
      break;
    case RenderPosition.AFTER:
      container.after(component.getElement());
      break;
  }
};

export const remove = (component) => {
  component.getElement().remove();
  component = null;
};

export const replace = (newComponent, oldComponent) => {
  const ParentElement = oldComponent.getElement().parentElement;
  const oldElement = oldComponent.getElement();
  const newElement = newComponent.getElement();
  const isEveryElementExist = !!(ParentElement && newElement && oldElement);
  if (isEveryElementExist) {
    ParentElement.replaceChild(newElement, oldElement);
  }
};
