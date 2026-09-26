export class Car {
  constructor(width, height, positionX, positionY, element, board) {
    this.width = width;
    this.height = height;
    this.positionX = positionX;
    this.positionY = positionY;
    this.element = element;
    this.board = board;
    this.canMove = false;

    this.updatePosition();
    this.bindControls(); // set up listener ONCE, here
  }

  updatePosition() {
    this.element.style.width = this.width + "px";
    this.element.style.height = this.height + "px";
    this.element.style.top = this.positionY + "px";
    this.element.style.left = this.positionX + "px";
  }

  bindControls() {
    document.addEventListener("keydown", (e) => {
      const key = e.key;
      if (!this.canMove) return;
      if (key === "ArrowUp" && !this.collisionTop()) {
        this.positionY -= 5;
      } else if (key === "ArrowDown" && !this.collisionBottom()) {
        this.positionY += 5;
      } else if (key === "ArrowLeft" && !this.collisionLeft()) {
        this.positionX -= 5;
      } else if (key === "ArrowRight" && !this.collisionRight()) {
        this.positionX += 5;
      }

      this.updatePosition();
    });
  }

  collisionLeft() {
    return this.positionX <= 0;
  }
  collisionRight() {
    return this.positionX + this.width >= this.board.width;
  }
  collisionTop() {
    return this.positionY <= 0;
  }
  collisionBottom() {
    return this.positionY + this.height + 5 > this.board.height;
  }
}
