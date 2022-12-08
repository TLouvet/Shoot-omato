import { Drawable } from "./types";

export class HTMLInterface {
  private constructor() { }

  static update(id: string, content: string) {
    const element = document.getElementById(id);
    if (!element) {
      throw new Error(`Error: Element with id ${id} not found`);
    }

    element.innerText = content;
  }

  static getQuerySelector(query: string) {
    const tag = document.querySelector(query);
    if (!tag) {
      throw new Error(`No Element corresponds to '${query}' on the DOM.`);
    }

    return tag;
  }

  static drawObjects(drawables: Drawable[]) {
    for (const drawable of drawables) {
      const { sprite, x, y, width, height, canDraw } = drawable.getDrawInformations();
      if (canDraw) {
        context.drawImage(sprite, x, y, width, height);
      }
    }
  }
}