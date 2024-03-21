fetch('https://gist.githubusercontent.com/christianpanton/10d65ccef9f29de3acd49d97ed423736/raw/b09563bc0c4b318132c7a738e679d4f984ef0048/kings')
  .then(response => response.json())
  .then(monarchsResponse => solve(monarchsResponse));

function solve(monarchsResponse) {
  const monarchs = monarchsResponse.map(monarch => {
    const rulingYears = parseRulingYears(monarch.yrs);
    return {
      name: monarch.nm,
      house: monarch.hse,
      ruledFor: rulingYears[1] - rulingYears[0]
    }
  });

  console.log(monarchs)

  // 1
  const uniqueNames = new Set([...monarchs.map(m => m.name)]);
  console.log("1. How many monarchs: " + uniqueNames.size);

  // 2
  const longestRulingMonarch = monarchs.reduce((acc, monarch) => acc.ruledFor > monarch.ruledFor ? acc : monarch, {
    ruledFor: 0
  });
  console.log("2. Longest ruling monarch: " + longestRulingMonarch.name + "; ruled for " + longestRulingMonarch.ruledFor + " years");

  // 3
  const longestRulingHouse = [...Map.groupBy(monarchs, m => m.house)]
    .map(([houseName, houseMonarchs]) => ({
      houseName: houseName,
      houseRuledFor: houseMonarchs.map(m => m.ruledFor).reduce((acc, val) => acc + val, 0)
    }))
    .reduce((acc, house) => acc.houseRuledFor > house.houseRuledFor ? acc : house, {
      houseRuledFor: 0
    });
  console.log("3. Longest ruling house: " + longestRulingHouse.houseName + "; ruled for " + longestRulingHouse.houseRuledFor + " years");

  // 4
  const firstNameCountMap = monarchs.map(m => m.name.split(" ")[0]).reduce((map, name) => {
    const count = map.has(name) ? map.get(name) + 1 : 1;
    map.set(name, count);
    return map;
  }, new Map());
  const mostCommonFirstName = [...firstNameCountMap]
    .reduce((acc, val) => acc[1] > val[1] ? acc : val, ["", 0]);
  console.log("4. Most common first name: " + mostCommonFirstName[0]);

  // 4 alternative - shorter but inefficient - we are sorting the whole thing but we only want to know the max
  const mostCommonFirstName2 = [...Map.groupBy(monarchs.map(m => m.name.split(" ")[0]), firstName => firstName)]
    .sort((a, b) => {
      return a[1].length > b[1].length ? -1 : 1
    })
  console.log("4B. Most common first name: " + mostCommonFirstName2[0][0]);
}


function parseRulingYears(rulingYearsString) {
  const yearsSplit = rulingYearsString.split("-");
  let yearsFrom = parseInt(yearsSplit[0]);
  let yearsTo;

  if (yearsSplit.length == 1) {
    yearsTo = yearsFrom;
  } else if (yearsSplit[1] == "") {
    yearsTo = (new Date()).getFullYear();
  } else {
    yearsTo = parseInt(yearsSplit[1]);
  }

  return [yearsFrom, yearsTo];
}