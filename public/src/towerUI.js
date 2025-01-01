import { Button } from "./button";

class TowerUI {
    constructor(x, y, images = [], onClicks= []) {
        this.x = x;
        this.y = y;
        this.id = -1;
        this.width = 50;
        this.height = 50;
        this.buttons = []; // 정보창 내부 버튼 배열
        this.isVisible = false; // 정보창 표시 여부

        this.init(images, onClicks);
    }

    init(images , onClicks) {
        this.buttons.push(new Button('upgrade', this.id, this.x + 10 , this.y + 10, 30, 30, images[0], onClicks[0] ));
        this.buttons.push(new Button('move', this.id,this.x + 50, this.y + 10, 30, 30, images[1], onClicks[1] ));
        this.buttons.push(new Button('sell', this.id,this.x + 90, this.y + 10, 30, 30, images[2], onClicks[2] ));
    }

    openUI(towerId, x,y) {
        this.x = x;
        this.y = y;
        this.id = towerId;
        this.updateButtons();
        this.isVisible = true;
    }

    updateButtons() {
        let currentX = this.x+ 10;
        for(let i=0; i<3; i++) {
            let item = this.buttons[i];

            item.id = this.id;
            item.x = currentX + i*40;
            item.y = this.y + 10;
        }
    }

    closeUI() {
        this.id = -1;

        for(let i=0; i<3; i++) {
            let item = this.buttons[i];

            item.id = this.id;
        }

        this.isVisible = false;
    }

    // 정보창 그리기
    draw(ctx) {
        if (!this.isVisible) return;

        // 정보창 배경
        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // 정보창 내부 버튼 그리기
        this.buttons.forEach((button) => button.draw(ctx));
    }

    // 정보창 내부 버튼 클릭 처리
    handleClick(mouseX, mouseY) {
        if (!this.isVisible) return false;

        // 정보창 내부 클릭 여부 확인
        if (
            mouseX >= this.x &&
            mouseX <= this.x + this.width &&
            mouseY >= this.y &&
            mouseY <= this.y + this.height
        ) {
            // 내부 버튼 클릭 확인
            for (let i = this.buttons.length - 1; i >= 0; i--) {
                const button = this.buttons[i];
                if (button.isClicked(mouseX, mouseY)) {
                    button.onClick();
                    return true; // 클릭 처리됨
                }
            }
            return true; // 정보창 내부 클릭
        }
        return false; // 정보창 외부 클릭
    }
}