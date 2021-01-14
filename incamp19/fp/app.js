class Rectangle {
    constructor(color) {
        this.color = color;
    }
}

function hasColorTest() {
    let hasColor = color => rectangle => rectangle.color == color;
    let isRed = hasColor('red');

    let figures = [new Rectangle('red'), new Rectangle("#00FF00")];
    console.log('filter(isRed)', figures.filter(isRed));
    console.log('filter(hasColor("#00FF00"))', figures.filter(hasColor("#00FF00")));
}

hasColorTest();
