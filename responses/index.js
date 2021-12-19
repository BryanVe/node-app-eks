const course = {
  _id: 0,
  id: {
    $toString: '$_id',
  },
  name: 1,
  code: 1,
}

module.exports = {
  course,
}
