fetch('https://gist.githubusercontent.com/christianpanton/10d65ccef9f29de3acd49d97ed423736/raw/b09563bc0c4b318132c7a738e679d4f984ef0048/kings')
  .then(function (response) {
    return response.json()
  })
  
  .then(function (monarchData) {

    // 1. How many monarchs are there in the list?

      let monarchNameList = [] // A monarch might sneakily come back to rule again after they stepped down, so let's hold them in an array to make sure we don't count them twice

      monarchData.forEach(monarch => {
        if (!monarchNameList.includes(monarch.nm)) { 
            monarchNameList.push(monarch.nm)
          }
      })

      console.log(`1. There are ${monarchNameList.length} monarchs in the list.`)

    // 2. Which monarch ruled the longest (and for how long)?

      let longestRulingMonarchNameList = []
      let longestRulingMonarchLength = 0

      monarchData.forEach(monarch => {
        let rulingLength = rulingLengthCalculator(monarch)

          if (rulingLength > longestRulingMonarchLength) { // If someone has ruled longer, we set the length and reset the names list to have only them.
            longestRulingMonarchLength = rulingLength
            longestRulingMonarchNameList = [monarch.nm]
          } else if (rulingLength = longestRulingMonarchLength) { // If someone has ruled for the same length, we leave the length alone as it's the same, and add them to the list.
            longestRulingMonarchNameList.push(monarch.nm)
          }
      })

      console.log(`2. The longest ruling Monarch was (or were if there is a tie) ${longestRulingMonarchNameList}. They ruled for ${longestRulingMonarchLength} years.`)

    // 3. Which house ruled the longest (and for how long)?

      let housesAndLengths = []
      let longestRulingHouseName = ""
      let longestRulingHouseLength = 0

      monarchData.forEach(monarch => {
        const rulingLength = rulingLengthCalculator(monarch)

        const singleHouseAndLength = { // Preparing a single object to add to the array
          nm: monarch.hse,
          yrs: rulingLength
        }
      
        if (!housesAndLengths.find((house) => house.nm === monarch.hse)) { // If there is no object in our array with that house name, we add the whole thing
          housesAndLengths.push(singleHouseAndLength)
        } else { // If there is already house name with the array, we only add the rulingLength
          housesAndLengths.find((house) => house.nm === monarch.hse).yrs += rulingLength
        }
      })
      
      housesAndLengths.forEach(house => {
        if (house.yrs > longestRulingHouseLength) { // If the current house is longer than the one we have, add their name and length to the variables
          longestRulingHouseLength = house.yrs
          longestRulingHouseName = house.nm
        }
      })
      console.log(`3. The longest ruling house is ${longestRulingHouseName}. They ruled for a whopping ${longestRulingHouseLength} years.`)

    // 4. What was the most common first name?

      const monarchFirstNameList = monarchData.map(monarch => {
        return monarch.nm.split(" ")[0]
      })

      let monarchNamesOccurence = []

      monarchFirstNameList.forEach(nameInList => {
        if (!monarchNamesOccurence.find((e) => e.nm == nameInList)) {
          monarchNamesOccurence.push({nm: nameInList, oc: 1})
        } else {
          monarchNamesOccurence[monarchNamesOccurence.findIndex((e) => e.nm == nameInList)].oc++
        }
      })

      console.log("4. I still need to write the logic to check the highest occurence for a particular name. So far we have this array", monarchNamesOccurence)

      // The below works but I don't get it
      //
      // const mostCommonName = monarchFirstNameList.sort((a, b) =>
      //       monarchFirstNameList.filter(v => v===a).length
      //     - monarchFirstNameList.filter(v => v===b).length
      //   ).pop();
      //
      // console.log(mostCommonName)
})

function rulingLengthCalculator(monarch) {
  const rulingYears = monarch.yrs.split("-")
  
  if (rulingYears.length == 1) { // If someone has only a starting date it means they only ruled for 1 year
    return 1
  } else if (rulingYears[1] == "") { // If someone has an empty ending date it means they are currently ruling, let's calculate from current year
    const d = new Date();
    return d.getFullYear()-rulingYears[0]
  } else { // Otherwise just calculate ruling years by subtracting rule start from rule end
    return rulingYears[1]-rulingYears[0]
  }
}