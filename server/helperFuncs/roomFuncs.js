function makeid() {
  const animalNames = ['gorilla', 'tiger', 'monkey', 'elephant', 'leopard']
  const possibleNums = '0123456789';
  
  let text = animalNames[Math.floor(Math.random()*animalNames.length)];
  for (var i = 0; i < 5; i++) {
    text += possibleNums.charAt(Math.floor(Math.random() * possibleNums.length));
  }

  return text;
}

module.exports = makeid
