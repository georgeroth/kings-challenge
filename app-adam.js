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