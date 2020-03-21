$(function () {

  generateQuestion()

  function generateQuestion () {
    const url = 'https://opentdb.com/api.php?amount=10'

    axios.get(url)
    .then((response)=>{
      console.log(response)
    })
    .catch((error)=>{
      console.log(error)
    })
}
})
