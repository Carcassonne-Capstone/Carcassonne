function makeid() {
    var text = '';
    var possible = '0123456789';
  
    for (var i = 0; i < 10; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
  
    return text;
}

module.exports = makeid
