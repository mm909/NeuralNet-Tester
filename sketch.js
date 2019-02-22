let nn;
let user_digit;
let user_guess_ele;
let user_has_drawing = false;
var WBArray;

function setup() {
  createCanvas(500, 500).parent('container');
  nn = new NeuralNetwork(784, 40, 10);

  user_digit = createGraphics(500, 500);
  user_digit.pixelDensity(1);
  train_image = createImage(28, 28);

  user_guess_ele = select('#user_guess');

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
  if (!user_has_drawing) {
    user_guess_ele.html('_');
    return img;
  }
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
  user_guess_ele.html(guess);
  normalizeAndWeigh(prediction);
  for (var i = 0; i < 10; i++) {
    let t = floor(prediction[i] * 100)
    t = (t > 0) ? t : 0;
    $("#" + i).text(t);
    if (i == guess) {
      $("#" + i).addClass("correct");
    } else {
      $("#" + i).removeClass("correct");
    }
  }
  return img;
}


function draw() {
  background(0);

  let user = guessUserDigit();
  image(user_digit, 0, 0);
  image(user, 0, 0);

  if (mouseIsPressed) {
    user_has_drawing = true;
    user_digit.stroke(255, 200);
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