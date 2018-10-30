//Aliases
let Application = PIXI.Application,
    Container = PIXI.Container,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite,
    Rectangle = PIXI.Rectangle;

//Create a Pixi Application
let app = new PIXI.Application({
  width: 800,         // default: 800
  height: 600,        // default: 600
  antialias: true,    // default: false
  transparent: false, // default: false
  resolution: 1      // default: 1
});

app.renderer.backgroundColor = 0xF5DEB3;
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

PIXI.loader.add([
  { name: "board", url: "assets/images/basicBoard.png"},
  { name: "figures", url: "assets/images/basicFigures.json"}
])
.on("progress", loadProgressHandler)
.load(startGame);

function loadProgressHandler(loader, resource) {
  console.log("loading: " + resource.name);
  console.log("progress: " + loader.progress + "%");
}

let boardSprite, state, boardCellSize = {};
let figureSprites = [];
let boardData = [];
let BoardFigureType = { "none": 0, "pawn": 1, "rook": 2, "knight": 3, "bishop": 4, "king": 5, "queen": 6 };
Object.freeze(BoardFigureType);

function startGame() {
   initializeSprites();
   initializeBoard();

   state = play;
   app.ticker.add(delta => gameLoop(delta));
}

function initializeSprites() {
  boardSprite = new Sprite(resources.board.texture);
  boardBorderSize = 5;
  boardOriginalSize = { width: boardSprite.width, height: boardSprite.height };
  boardCellSize.width = (boardOriginalSize.width - boardBorderSize * 2) / 8;
  boardCellSize.height = (boardOriginalSize.height - boardBorderSize * 2) / 8;

  boardSprite.width = window.innerWidth * 0.35;
  boardSprite.height = window.innerHeight * 0.7;
  boardSprite.x = window.innerWidth / 2 - boardSprite.width / 2;
  boardSprite.y = window.innerHeight / 2 - boardSprite.height / 2;

  boardBorderSize = boardBorderSize * (boardSprite.width / boardOriginalSize.width);
  boardCellSize.width = boardCellSize.width * (boardSprite.width / boardOriginalSize.width);
  boardCellSize.height = boardCellSize.height * (boardSprite.height / boardOriginalSize.height);

  let basicFigures = resources.figures.textures;
  let index = 0;

  for (let figureName in basicFigures)
  {
    figureSprites.figureName = new Sprite(basicFigures[figureName]);
    figureSprites.figureName.width = boardCellSize.width;
    figureSprites.figureName.height = boardCellSize.height;
  }
}

function initializeFigures() {
  let colorsFromTopToBottom = ["White", "Black"];

  newGameFiguresState = [
    BoardFigureType.rook, BoardFigureType.knight, BoardFigureType.bishop, BoardFigureType.king, BoardFigureType.queen, BoardFigureType.bishop, BoardFigureType.knight, BoardFigureType.rook,
    BoardFigureType.pawn, BoardFigureType.pawn, BoardFigureType.pawn, BoardFigureType.pawn, BoardFigureType.pawn, BoardFigureType.pawn, BoardFigureType.pawn, BoardFigureType.pawn,
    BoardFigureType.none, BoardFigureType.none, BoardFigureType.none, BoardFigureType.none, BoardFigureType.none, BoardFigureType.none, BoardFigureType.none, BoardFigureType.none,
    BoardFigureType.none, BoardFigureType.none, BoardFigureType.none, BoardFigureType.none, BoardFigureType.none, BoardFigureType.none, BoardFigureType.none, BoardFigureType.none,
    BoardFigureType.none, BoardFigureType.none, BoardFigureType.none, BoardFigureType.none, BoardFigureType.none, BoardFigureType.none, BoardFigureType.none, BoardFigureType.none,
    BoardFigureType.none, BoardFigureType.none, BoardFigureType.none, BoardFigureType.none, BoardFigureType.none, BoardFigureType.none, BoardFigureType.none, BoardFigureType.none,
    BoardFigureType.pawn, BoardFigureType.pawn, BoardFigureType.pawn, BoardFigureType.pawn, BoardFigureType.pawn, BoardFigureType.pawn, BoardFigureType.pawn, BoardFigureType.pawn,
    BoardFigureType.rook, BoardFigureType.knight, BoardFigureType.bishop, BoardFigureType.king, BoardFigureType.queen, BoardFigureType.bishop, BoardFigureType.knight, BoardFigureType.rook
  ];

  let basicFigures = resources.figures.textures;

  for (let yIndex = 0; yIndex < 8; yIndex++) {
    let currentDataRow = [];

    for (let xIndex = 0; xIndex < 8; xIndex++) {
      let figureId;

      if (newGameFiguresState[8 * yIndex + xIndex] != BoardFigureType.none) {
        switch (newGameFiguresState[8 * yIndex + xIndex]) {
          case BoardFigureType.pawn:
            figureId = "pawn";
            break;
          case BoardFigureType.rook:
            figureId = "rook";
            break;
          case BoardFigureType.knight:
            figureId = "knight";
            break;
          case BoardFigureType.bishop:
            figureId = "bishop";
            break;
          case BoardFigureType.king:
            figureId = "king";
            break;
          case BoardFigureType.queen:
            figureId = "queen";
            break;
          default: break;
        }

        // Check what side are you on
        if (yIndex > 3) {
          currentDataRow[xIndex] = {
            figureType: newGameFiguresState[8 * yIndex + xIndex],
            color: colorsFromTopToBottom[1],
            sprite: new Sprite(basicFigures[figureId + colorsFromTopToBottom[1]])
          };
        }
        else {
          currentDataRow[xIndex] = {
            figureType: newGameFiguresState[8 * yIndex + xIndex],
            color: colorsFromTopToBottom[0],
            sprite: new Sprite(basicFigures[figureId + colorsFromTopToBottom[0]])
          };
        }
        currentDataRow[xIndex].sprite.x = boardSprite.x + boardBorderSize + xIndex * boardCellSize.width;
        currentDataRow[xIndex].sprite.y = boardSprite.y + boardBorderSize + yIndex * boardCellSize.height;
        currentDataRow[xIndex].sprite.width = boardCellSize.width;
        currentDataRow[xIndex].sprite.height = boardCellSize.height;
        currentDataRow[xIndex].sprite.interactive = true;
        currentDataRow[xIndex].sprite.on('pointerdown', function(e) {
          figureClicked(yIndex, xIndex);
        });

        app.stage.addChild(currentDataRow[xIndex].sprite);
      }
    }

    boardData.push(currentDataRow);
  }
}

function initializeBoard() {
  app.stage.addChild(boardSprite);
  initializeFigures();
}

function figureClicked(yIndex, xIndex) {
  console.log(boardData[yIndex][xIndex].color + " " + boardData[yIndex][xIndex].figureType);
}

function gameLoop(delta){
  state(delta);
}

function play(delta) {

}
