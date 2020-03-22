$(function () {

  $("#start-game").click((event) => {
    console.log('starting a new game')
    event.preventDefault()

    let numberOfQuestions = $('#trivia_amount').val()
    console.log(numberOfQuestions)

    let category = $('#trivia_category').val()
    console.log(category)

    let difficulty = $('#trivia_difficulty').val()
    console.log(difficulty)

    let type = $('#trivia_type').val()
    console.log(type)

    $('.form-api').html('')

    generateQuestions(numberOfQuestions, category, difficulty, type)

  })

  function generateQuestions(a,b,c,d) {
      const url = "https://opentdb.com/api.php"

      $.ajax({
        url: url,
        type: "GET",
        data:
        { amount: a,
          category: b,
          difficulty: c,
          type: d
        }
      })
      .done((response) => {
        // execute this function if request is successful
        console.log(response.results)
        $('#top-paragraph').text(response.results[0].question)

      })
      .fail(() => {
        // execute this function if request fails
        alert('error occurred')
      })
    }

})
