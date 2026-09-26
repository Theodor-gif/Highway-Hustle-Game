export class EnemyCar {
  constructor(height, width, positionX, positionY, element, board) {
    this.height = height;
    this.width = width;
    this.positionX = positionX;
    this.positionY = positionY;
    this.element = element;
    this.board = board;

    this.updatePosition();
  }

  updatePosition() {
    this.element.style.height = this.height + "px";
    this.element.style.width = this.width + "px";
    this.element.style.top = this.positionY + "px";
    this.element.style.left = this.positionX + "px";
  }

  movingDown() {
    this.positionY += 5;
    this.updatePosition();
  }

  isOffScreen() {
    return this.positionY > this.board.height;
  }
}
