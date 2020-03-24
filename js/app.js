$(function () {

  let numberOfQuestions, category, difficult, type

  $("#start-game").click((event) => {
    console.log('starting a new game')
    event.preventDefault()

    numberOfQuestions = $('#trivia_amount').val()
    category = $('#trivia_category').val()
    difficulty = $('#trivia_difficulty').val()
    type = $('#trivia_type').val()

    $('.form-api').html('')

    generateQuestions()

  })

  function generateQuestions() {
      const url = "https://opentdb.com/api.php"

      const queryParameters = {
        amount: numberOfQuestions,
        category: category,
        difficulty: difficulty,
        type: type
      }

      //loop through the parameters object to check if there are any values unspecified, and delete the parameter if so.
      for (const key in queryParameters) {
        console.log(key)
        console.log(queryParameters[key])
        if (queryParameters[key] === "" || queryParameters[key] === null) {delete queryParameters[key] }
      }

      //make call to the trivia API to get the list of questions and answers based on how the user configured the game
      $.ajax({
        url: url,
        type: "GET",
        data: queryParameters
      })
      .done((response) => {
        // execute this function if request is successful
        console.log(response)
        console.log(response.results)

        displayQuestion(response.results)
        displayAnswers(response.results)


      })
      .fail(() => {
        // execute this function if request fails
        alert('error occurred')
      })
    }

    let n = 0
    function displayQuestion(question){
      $('#question').html(`<p>${question[n].question}</p>`)
      console.log(question.length)
    }

    function displayAnswers(question){
      if (question[n].type === 'multiple'){
        $('#answers').html(
          `
            <input type="radio" id="choice-1" name="answer" value="1">
            <label for="1">${question[n].correct_answer}</label><br><br>
            <input type="radio" id="choice-2" name="answer" value="2">
            <label for="2">${question[n].incorrect_answers[0]}</label><br><br>
            <input type="radio" id="choice-3" name="answer" value="3">
            <label for="3">${question[n].incorrect_answers[1]}</label><br><br>
            <input type="radio" id="choice-4" name="answer" value="4">
            <label for="4">${question[n].incorrect_answers[2]}</label>
            <br><br>
            <button id= "submit-answer">Submit</button>
          `
            )
      } else {
        $('#answers').html(
          `
            <input type="radio" id="choice-1" name="answer" value="1">
            <label for="1">${question[n].correct_answer}</label><br><br>
            <input type="radio" id="choice-2" name="answer" value="2">
            <label for="2">${question[n].incorrect_answers[0]}</label><br><br>
            <br><br>
            <button id= "submit-answer">Submit</button>
          `
            )
          }

      $("#submit-answer").click((event) => {
        n++
        if (n < question.length){
          displayQuestion(question)
          displayAnswers(question)
        } else {
          endGame()
        }

      })
    }

    function endGame(){
      $('.question-form').html("The game is over")
    }


})
