const events = require('../data/myData/cardiff')
const details = require('../data/myDes/cardiff')
const fs = require('fs')

function sorter (events) {
  const arr = []
  for (let n of events) {
    const test = details.data.find(x => x.eventId === n.id)
    arr.push({
      ...n,
      description: test.description,
      fullAddress: test.fullAddress,
      bgImage: test.bgImage,
      summary: test.summary,
      bigTitle: test.bigTitle,
      date: test.date,
      time: test.time,
      age: test.age
    })
  }
  return arr
}


fs.writeFile('./test.json', JSON.stringify(sorter(events.data), null, 2), err => {
  if (err) console.log(err)
  else console.log('file written successfully!!')
})
