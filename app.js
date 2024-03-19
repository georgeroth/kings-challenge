// Got to fire it up with NODE_TLS_REJECT_UNAUTHORIZED='0' due to MC policies

fetch('https://gist.githubusercontent.com/christianpanton/10d65ccef9f29de3acd49d97ed423736/raw/b09563bc0c4b318132c7a738e679d4f984ef0048/kings')
 .then(function (response) {
   return response.json()
 })
 .then(function (kingsData) {
    console.log(kingsData)
})