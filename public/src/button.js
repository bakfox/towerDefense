export class Button {
  constructor(label, id = -1, x, y, width, height, image = null, onClick) {
    this.label = label;
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = image;
    this.onClick = onClick;
  }

  // 마우스 클릭이 버튼 안에 있는지 확인
  isClicked(mouseX, mouseY) {
    return (
      mouseX >= this.x &&
      mouseX <= this.x + this.width &&
      mouseY >= this.y &&
      mouseY <= this.y + this.height
    );
  }

  draw(ctx) {
    if (this.image)
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    else ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
