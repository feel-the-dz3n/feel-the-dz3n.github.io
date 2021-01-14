class Rectangle {
    constructor(color, a, b, c, d) {
        this.color = color;
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
    }
}

const filter = predicate => list => list.filter(predicate);
const map = predicate => list => list.map(predicate);
const reduce = (previous, current) => list => list.reduce(previous, current);

const constTrue = () => true;
const constFalse = () => false;
const and = (pA, pB) => item => pA(item) && pB(item);
const or = (pA, pB) => item => pA(item) || pB(item);
const all = reduce(and, constTrue);
const any = reduce(or, constFalse);

let hasColor = color => rectangle => rectangle.color == color;
let isRed = hasColor('red');
let isBlack = hasColor('black');

function hasColorTest() {
    let figures = [new Rectangle('red'), new Rectangle("#00FF00")];
    console.log('filter(isRed)', figures.filter(isRed));
    console.log('filter(hasColor("#00FF00"))', figures.filter(hasColor("#00FF00")));
}

let isSquare = rect => rect.a == rect.b && rect.c == rect.d;
let calcArea = rect => rect.a * rect.b;
let calcAreas = map(calcArea);
let collectBlackSquares = filter(and(isBlack, isSquare));

function maxBlackSquareAreaTest() {
    let figures = [
        new Rectangle('black', 2, 3, 4, 5), // not a square
        new Rectangle('black', 5, 5, 5, 5), // 25
        new Rectangle('black', 6, 6, 6, 6), // 36
        new Rectangle('black', 7, 7, 7, 7), // 49, expected result
        new Rectangle('red', 8, 8, 8, 8) // 64, not black
    ];
    let findMaxBlackSquareArea = _.flow(
        collectBlackSquares,
        calcAreas,
        _.max);
    let maxBlackSquareArea = findMaxBlackSquareArea(figures);

    console.log("maxBlackSquareArea", maxBlackSquareArea);
}

let collectRedRects = filter(isRed);
let calcPerimeter = rect => rect.a + rect.b + rect.d + rect.c;
let calcPerimeters = rects => rects.map(calcPerimeter);

function redRectsPerimeterTest() {
    let figures = [
        new Rectangle('black', 2, 3, 2, 3), // ignore
        new Rectangle('red', 2, 3, 2, 3), // 10
        new Rectangle('red', 5, 4, 5, 4), // 18
        new Rectangle('red', 9, 1, 9, 1), // 20
        new Rectangle('yellow', 5, 8, 5, 8) // ignore
    ];

    // expected result = 10 + 18 + 20 = 48
    let findRedRectsPerimeter = _.flow(
        collectRedRects,
        calcPerimeters,
        _.sum
    );

    let redRectsPerimeter = findRedRectsPerimeter(figures);

    console.log("redRectsPerimeterTest", redRectsPerimeter);
}

hasColorTest();
maxBlackSquareAreaTest();
redRectsPerimeterTest();
