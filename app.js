// Got to fire it up with NODE_TLS_REJECT_UNAUTHORIZED='0' due to MC policies

fetch('https://gist.githubusercontent.com/christianpanton/10d65ccef9f29de3acd49d97ed423736/raw/b09563bc0c4b318132c7a738e679d4f984ef0048/kings')
  .then(function (response) {
    return response.json()
  })
  
  .then(function (monarchData) {

    // 1. How many monarchs are there in the list?

      let monarchNameList = []

      monarchData.forEach(monarch => {
        if (!monarchNameList.includes(monarch.nm)) { // A monarch might sneakily come back to rule again after they stepped down, so let's make sure we don't count them twice
            monarchNameList.push(monarch.nm)
          }
      })

      console.log(`There are ${monarchNameList.length} monarchs in the list.`)

    // 2. Which monarch ruled the longest (and for how long)?

      let longestRulingMonarchNameList = []
      let longestRulingMonarchLength = 0

      monarchData.forEach(monarch => {
          const rulingYears = monarch.yrs.split("-")
          let rulingLength = 0
          
          if (rulingYears.length == 1) { // If someone has only a starting date it means they only ruled for 1 year
            rulingLength = 1
          } else if (rulingYears[1] == "") { // If someone has an empty ending date it means they are currently ruling, let's calculate from current year
            const d = new Date();
            rulingLength = d.getFullYear()-rulingYears[0]
          } else { // Otherwise just calculate ruling years by subtracting rule start from rule end
            rulingLength = rulingYears[1]-rulingYears[0]
          }

          if (rulingLength > longestRulingMonarchLength) { // If someone has ruled longer, we set the length and reset the names list to have only them.
            longestRulingMonarchLength = rulingLength
            longestRulingMonarchNameList = [monarch.nm]
          } else if (rulingLength = longestRulingMonarchLength) { // If someone has ruled for the same length, we leave the length alone as it's the same, and add them to the list.
            longestRulingMonarchNameList.push(monarch.nm)
          }
      })

      console.log(`The longest ruling Monarch was (or were if there is a tie) ${longestRulingMonarchNameList}. They ruled for ${longestRulingMonarchLength} years.`)
})