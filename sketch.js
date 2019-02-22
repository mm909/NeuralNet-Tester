let mnist;


let train_index = 0;

// testing variables
let test_index = 0;
let total_tests = 0;
let total_correct = 0;

let nn;
let train_image;

let user_digit;
let user_has_drawing = false;

let user_guess_ele;
let percent_ele;
var WBArray;

function setup() {
  createCanvas(400, 200).parent('container');
  nn = new NeuralNetwork(784, 300, 10);
  user_digit = createGraphics(200, 200);
  user_digit.pixelDensity(1);

  train_image = createImage(28, 28);

  user_guess_ele = select('#user_guess');
  percent_ele = select('#percent');

  WBArray = $("#WB").text().split(" ")
  WBArray.splice(WBArray.length - 1, 1);
  console.log(WBArray);

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
  if (!user_has_drawing) {
    user_guess_ele.html('_');
    return img;
  }
  let inputs = [];
  img.resize(28, 28);
  img.loadPixels();
  for (let i = 0; i < 784; i++) {
    inputs[i] = img.pixels[i * 4] / 255;
  }
  let prediction = nn.predict(inputs);
  let guess = findMax(prediction);
  user_guess_ele.html(guess);
  console.log(prediction);
  return img;
}


function draw() {
  background(0);

  let user = guessUserDigit();
  image(user, 0, 0);
  image(user_digit, 0, 0);

  if (mouseIsPressed) {
    user_has_drawing = true;
    user_digit.stroke(255);
    user_digit.strokeWeight(16);
    user_digit.line(mouseX, mouseY, pmouseX, pmouseY);
  }
}

function keyPressed() {
  if (key == ' ') {
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