export class Car {
  constructor(width, height, positionX, positionY, element, board) {
    this.width = width;
    this.height = height;
    this.positionX = positionX;
    this.positionY = positionY;
    this.element = element;
    this.board = board;

    this.updatePosition();
  }
  updatePosition() {
    this.element.style.width = this.width + "px";
    this.element.style.height = this.height + "px";
    this.element.style.top = this.positionY + "px";
    this.element.style.left = this.positionX + "px";
  }
  drive() {
    document.addEventListener("keydown", (e) => {
      const key = e.key;
      if (key === "ArrowUp") {
        if (this.collisionTop()) {
          this.positionY -= 0;
        } else {
          this.positionY -= 5;
        }
      } else if (key === "ArrowDown") {
        if (this.collisionBottom()) {
          this.positionY += 0;
        } else {
          this.positionY += 5;
        }
      } else if (key === "ArrowLeft") {
        if (this.collisionLeft()) {
          this.positionX -= 0;
        } else {
          this.positionX -= 5;
        }
      } else if (key === "ArrowRight") {
        if (this.collisionRight()) {
          this.positionX += 0;
        } else {
          this.positionX += 5;
        }
      }

      this.updatePosition();
    });
  }
  collisionLeft() {
    if (this.positionX === 0) {
      return true;
    }
    return false;
  }
  collisionRight() {
    if (this.positionX + this.width >= this.board.width) {
      return true;
    }
    return false;
  }
  collisionTop() {
    if (this.positionY === 0) {
      return true;
    }
    return false;
  }
  collisionBottom() {
    if (this.positionY + this.height + 5 > this.board.height) {
      return true;
    }
    return false;
  }
}
