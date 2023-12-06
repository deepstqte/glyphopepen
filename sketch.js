const hexToDecimal = hex => parseInt(hex, 16);
const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

function step(prev) {
  var next = [];
  var size = prev.length; 

  for (var y = 0; y < size; y++) {
    var row = Array(5).fill(0);
    next[y] = row;
    if (y == 0 || y == size - 1) continue;
    row[0] = 0;

    for (var x = 1; x < row.length; x++) {
      var n = countNeighbors(prev, x, y);
      row[x] = prev[y][x] == 0 ? (n <= 1 ? 1 : 0) : (n == 2 || n == 3 ? 1 : 0);
    }
  }
  return next;
}

function seedToColors(cSeed) {
  var colors = [];
  
  let sat = 56;
  let light = 66;
  
  colors[0] = [0, 0, 0];
  colors[1] = [255, 255, 255];
  colors[2] = [50, 136, 43];
  
  return(colors);
}

function seedToMatrix(seed) {
  let spriteSize = 11;
  var matrix = [];
  
  for (var i = 0; i < spriteSize; i++) {
    var row = Array(5).fill(0);
    
    if (i == 0 || i == spriteSize - 1) continue;
    row[0] = 0;
    
    for (var j = 1; j < row.length; j++) {
      row[j] = hexToDecimal(seed.substring((i * row.length + j), (i * row.length + j) + 2)) % 2;
      // row[j] = Number(seed[(i * 5 + j)]) % 2;
      // print(row[j]);
    }
    matrix[i] = row;
  }
  
  for (var index = 0; index < 2; index++) {
    matrix = step(matrix);
  }
  
  return(matrix);
}

function drawGlyph(matrix, ppd, fillColor, strokeColor, backgroundColor, moveFactor) {
  let canvasSize = Math.ceil(matrix.length * Math.SQRT2);
  canvasSize += canvasSize % 2;
  const width = canvasSize * ppd;
  const height = canvasSize * ppd;
  let str = '';
  const moveX = (width - matrix.length * ppd) / 2;
  const moveY = (width - matrix.length * ppd) / moveFactor;
  
  noStroke();
  fill(backgroundColor);
  let roundedness = 300;
  if (moveFactor == 2) {
    strokeWeight(4);
    stroke(strokeColor);
    noStroke();
    fill(fillColor);
    rect(width, -ppd, ppd, ppd);
    noStroke();
    
    fill(backgroundColor);

    rect(0, 0, width * 0.5, height * 0.5, 0, roundedness, 0, roundedness);
    rect(0, height * 0.5, width * 0.5, height * 0.5, 0, 0, 0, roundedness);
    rect(width * 0.5, 0, width * 0.5, height * 0.5, roundedness, roundedness, roundedness, 0);
    rect(width * 0.5, height * 0.5, width * 0.5, height * 0.5, 0, 0, roundedness, 0);
  } else {
    rect(0, 0, width * 0.5, height * 0.5, roundedness, 0, roundedness, roundedness);
    rect(width * 0.5, 0, width * 0.5, height * 0.5, 0, roundedness, roundedness, roundedness);
  }
  
  for (let y = 0; y < matrix.length; y++) {
    const row = matrix[y];
    const glyphSizeFactor = 1;
    for (let x = 0; x < row.length; x++) {
      if (row[x] == 1) {
        fill(fillColor);
        rect(moveX + x * ppd, moveY + y * ppd, ppd * glyphSizeFactor, ppd * glyphSizeFactor);
        rect(moveX + (matrix.length - x - 1) * ppd, moveY + y * ppd, ppd * glyphSizeFactor, ppd * glyphSizeFactor);
      } else if (countNeighbors(matrix, x, y) > 0) {
        fill(strokeColor);
        rect(moveX + x * ppd, moveY + y * ppd, ppd * glyphSizeFactor, ppd * glyphSizeFactor);
        rect(moveX + (matrix.length - x - 1) * ppd, moveY + y * ppd, ppd * glyphSizeFactor, ppd * glyphSizeFactor);
      } else {
        continue;
      }
    }
  }
}

function countNeighbors(matrix, x, y) {
  return (
    (matrix[y - 1]?.[x] || 0) +
    (matrix[y + 1]?.[x] || 0) +
    (matrix[y][x - 1] || 0) +
    (matrix[y][x + 1] || 0)
  );
}

let editions = {
  "one": "one",
  "four": "four",
  "five": "five",
  "ten": "ten",
  "twenty": "twenty",
  "forty": "forty",
};

function setup() {
    generateArt();
}

function generateArt() {

  let canvasSizeOg = 3200;
  createCanvas(canvasSizeOg, canvasSizeOg);
  colorMode(HSL);

  canvas.style.width = 'auto';
  canvas.style.height = '100%';

  let ppd = 100;

  background(0, 0, 50);
  
  let seed = genRanHex(64);
  let cSeed = genRanHex(64);
  
  // let seed = "46a8eef0c0422dfdd4d3f7af3c211d404cd7cc8c0b7d40d2976ec01796774b60";
  // let cSeed = "62b9df548ccbb3a45641caef3ffe3df0ca61fa0daf5379194dd39ba6e9f8725b";
  
  let colors = seedToColors(cSeed)
  let matrix = seedToMatrix(seed);

  var glyphBackgroundColor = color(0, 0, 0);
  var glyphStrokeColor = color(0, 0, 0);
  var glyphFillColor = color(0, 0, 0);

  if (document.getElementById('edition').value == "one") {
    glyphBackgroundColor = color(0, 0, 0);
    glyphStrokeColor = color(0, 0, 100);
    glyphFillColor = color(0, 0, 50);
    for (var j = 0; j < canvasSizeOg/ppd; j++) {
      for (var k = 0; k < canvasSizeOg/ppd; k++) {
        noStroke();
        fill(0, 0, random(90, 100));
        rect(ppd*j, ppd*k, ppd, ppd);
      }
    }
  } else if (document.getElementById('edition').value == "four") {
    glyphBackgroundColor = color(226, 100, 56);
    glyphStrokeColor = color(0, 0, 100);
    glyphFillColor = color(0, 0,0);
    for (var j = 0; j < canvasSizeOg/ppd; j++) {
      for (var k = 0; k < canvasSizeOg/ppd; k++) {
        noStroke();
        fill(226, 100, random(90, 100));
        rect(ppd*j, ppd*k, ppd, ppd);
      }
    }
  } else if (document.getElementById('edition').value == "five") {
    glyphBackgroundColor = color(354, 85, 56);
    glyphStrokeColor = color(175, 83, 72);
    glyphFillColor = color(289, 93,47);
    for (var j = 0; j < canvasSizeOg/ppd; j++) {
      for (var k = 0; k < canvasSizeOg/ppd; k++) {
        noStroke();
        fill(354, 85, random(90, 100));
        rect(ppd*j, ppd*k, ppd, ppd);
      }
    }
  } else if (document.getElementById('edition').value == "ten") {
    var coinflip = random(2);
    if (coinflip < 1) {
      glyphBackgroundColor = color(294,100,72);
      glyphStrokeColor = color(332, 80, 48);
    } else {
      glyphStrokeColor = color(294,100,72);
      glyphBackgroundColor = color(332, 80, 48);
    }
    glyphFillColor = color(204,9,11);
    for (var j = 0; j < canvasSizeOg/ppd; j++) {
      for (var k = 0; k < canvasSizeOg/ppd; k++) {
        noStroke();
        fill(204, 9, random(90, 100));
        rect(ppd*j, ppd*k, ppd, ppd);
      }
    }
  } else if (document.getElementById('edition').value == "twenty") {
    var coinflip = random(6);
    if (coinflip < 1) {
      glyphBackgroundColor = color(175,94,82);
      glyphStrokeColor = color(264, 91, 83);
      glyphFillColor = color(220,91,75);
    } else if (coinflip < 2) {
      glyphBackgroundColor = color(175,94,82);
      glyphFillColor = color(264, 91, 83);
      glyphStrokeColor = color(220,91,75);
    } else if (coinflip < 3) {
      glyphFillColor = color(175,94,82);
      glyphStrokeColor = color(264, 91, 83);
      glyphBackgroundColor = color(220,91,75);
    } else if (coinflip < 4) {
      glyphFillColor = color(175,94,82);
      glyphBackgroundColor = color(264, 91, 83);
      glyphStrokeColor = color(220,91,75);
    } else if (coinflip < 5) {
      glyphStrokeColor = color(175,94,82);
      glyphFillColor = color(264, 91, 83);
      glyphBackgroundColor = color(220,91,75);
    } else if (coinflip < 6) {
      glyphStrokeColor = color(175,94,82);
      glyphBackgroundColor = color(264, 91, 83);
      glyphFillColor = color(220,91,75);
    }
    for (var j = 0; j < canvasSizeOg/ppd; j++) {
      for (var k = 0; k < canvasSizeOg/ppd; k++) {
        noStroke();
        fill(175, 94, random(90, 100));
        rect(ppd*j, ppd*k, ppd, ppd);
      }
    }
  } else if (document.getElementById('edition').value == "forty") {
    var coinflip = random(2);
    if (coinflip < 1) {
      glyphFillColor = color(116,47,40);
      for (var j = 0; j < canvasSizeOg/ppd; j++) {
        for (var k = 0; k < canvasSizeOg/ppd; k++) {
          noStroke();
          fill(357, 85, random(70, 90));
          rect(ppd*j, ppd*k, ppd, ppd);
        }
      }
    } else {
      glyphFillColor = color(357,85,55);
      for (var j = 0; j < canvasSizeOg/ppd; j++) {
        for (var k = 0; k < canvasSizeOg/ppd; k++) {
          noStroke();
          fill(116, 47, random(70, 90));
          rect(ppd*j, ppd*k, ppd, ppd);
        }
      }
    }
    glyphBackgroundColor = color(0,0,0);
    glyphStrokeColor = color(0, 0, 100);
  }
  
  translate(canvasSizeOg/4, ppd*8);
  
  drawGlyph(matrix, ppd, glyphFillColor, glyphStrokeColor, glyphBackgroundColor, 2);
  
  translate(0, ppd*20);
  
  drawGlyph(matrix, ppd, glyphFillColor, glyphStrokeColor, glyphBackgroundColor, 6);
}
