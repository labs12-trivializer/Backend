const randomItem = array => {
  return array[Math.floor(Math.random() * array.length)];
};

module.exports = randomItem;
