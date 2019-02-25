let nn;
let user_digit;
let user_has_drawing = false;
var WBArray;

function setup() {
  createCanvas(1000, 500).parent('container');
  nn = new NeuralNetwork(784, 40, 10);

  user_digit = createGraphics(500, 500);
  user_digit.pixelDensity(1);
  train_image = createImage(28, 28);


  WBArray = $("#WB").text().split(" ")
  WBArray.splice(WBArray.length - 1, 1);

  let count = 0;
  for (var i = 0; i < nn.input_nodes; i++) {
    for (var j = 0; j < nn.hidden_nodes; j++) {
      nn.weights_ih.data[j][i] = parseFloat(WBArray[count]);
      count++;
    }
  }

  for (var i = 0; i < nn.hidden_nodes; i++) {
    nn.bias_h.data[i] = parseFloat(WBArray[count]);
    count++;
  }

  for (var i = 0; i < nn.hidden_nodes; i++) {
    for (var j = 0; j < nn.output_nodes; j++) {
      nn.weights_ho.data[j][i] = parseFloat(WBArray[count]);
      count++;
    }
  }

  for (var i = 0; i < nn.output_nodes; i++) {
    nn.bias_o.data[i] = parseFloat(WBArray[count]);
    count++;
  }

}

function guessUserDigit() {
  let img = user_digit.get();
  let inputs = [];
  img.resize(28, 28);
  img.loadPixels();
  // console.log(img);
  for (let i = 0; i < 784; i++) {
    inputs[i] = img.pixels[(i * 4 + 0)];
    inputs[i] += img.pixels[(i * 4 + 1)];
    inputs[i] += img.pixels[(i * 4 + 2)];
    inputs[i] /= 3;
    inputs[i] /= 255;
  }
  // console.log(inputs);
  let prediction = nn.predict(inputs);
  let guess = findMax(prediction);
  normalizeAndWeigh(prediction);
  drawBars(prediction);
  return img;
}

function drawBars(prediction) {
  for (var i = 0; i < prediction.length; i++) {
    let guess = findMax(prediction);
    stroke(0)
    if (i == guess) fill(0, 255, 0);
    else fill(255, 255, 255);
    rect((width / 2) + (i * (50)), height - prediction[i] * height, 50, prediction[i] * height);
    textSize(32);
    text(i, (width / 2) + (i * (50)) + 18, height - prediction[i] * height);
    textSize(16);
    fill(0)
    text(floor(prediction[i] * 100), (width / 2) + (i * (50)) + 18, height - prediction[i] * height + 16);
  }
}

function draw() {
  background(0);
  fill(255);
  text("Use 'c' to clear", width - 125, 20)
  stroke(255);
  line(width / 2, 0, width / 2, height);

  let user = guessUserDigit();
  image(user_digit, 0, 0);
  image(user, 0, 0);

  if (mouseIsPressed) {
    user_has_drawing = true;
    user_digit.stroke(255, 225);
    user_digit.strokeWeight(36);
    user_digit.line(mouseX, mouseY, pmouseX, pmouseY);
  }
}

function keyPressed() {
  if (keyCode == 67) {
    user_has_drawing = false;
    user_digit.background(0);
  }
}

function findMax(arr) {
  let record = 0;
  let index = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > record) {
      record = arr[i];
      index = i;
    }
  }
  return index;
}

function normalizeAndWeigh(arr) {
  min = 100;
  max = -100;
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
    if (arr[i] < min) min = arr[i];
  }
  sum = 0;
  for (var i = 0; i < arr.length; i++) {
    arr[i] = (arr[i] - min) / (max - min);
    sum += arr[i];
  }
  for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i] / sum;
  }
}

function updateWeights() {
  let count = 0;
  for (var i = 0; i < nn.input_nodes; i++) {
    for (var j = 0; j < nn.hidden_nodes; j++) {
      nn.weights_ih.data[j][i] = parseFloat(WBArray[count]);
      count++;
    }
  }

  for (var i = 0; i < nn.hidden_nodes; i++) {
    nn.bias_h.data[i] = parseFloat(WBArray[count]);
    count++;
  }

  for (var i = 0; i < nn.hidden_nodes; i++) {
    for (var j = 0; j < nn.output_nodes; j++) {
      nn.weights_ho.data[j][i] = parseFloat(WBArray[count]);
      count++;
    }
  }

  for (var i = 0; i < nn.output_nodes; i++) {
    nn.bias_o.data[i] = parseFloat(WBArray[count]);
    count++;
  }
}