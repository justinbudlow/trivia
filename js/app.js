$(function () {

  let numberOfQuestions, category, difficult, type
  let userScore = 0

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
        console.log(response.results)

        displayQuestion(response.results)
        displayAnswers(response.results)
        updateUserScore()


      })
      .fail(() => {
        // execute this function if request fails
        alert('error occurred')
      })
    }

    let n = 0
    function updateUserScore(){
      $('.score').html(`Your score: ${userScore}`)
    }

    function displayQuestion(question){
      $('#question').html(`<p>${question[n].question}</p>`)
    }

    function displayAnswers(question) {

    let correctAnswer = question[n].correct_answer
    const incorrectAnswer1 = question[n].incorrect_answers[0]
    const incorrectAnswer2 = question[n].incorrect_answers[1]
    const incorrectAnswer3 = question[n].incorrect_answers[2]
    const arrayAnswers = [correctAnswer, incorrectAnswer1, incorrectAnswer2, incorrectAnswer3]

    if (question[n].type === 'multiple') {

      function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
        return array;
      }
      const shuffledArray = shuffle(arrayAnswers)
      $('#answers').html(
        `
            <input type="radio" id="choice-1" class="answer" value='${shuffledArray[0]}'>
            <label for="1">${shuffledArray[0]}</label><br><br>
            <input type="radio" id="choice-2" class="answer" value='${shuffledArray[1]}'>
            <label for="2">${shuffledArray[1]}</label><br><br>
            <input type="radio" id="choice-3" class="answer" value='${shuffledArray[2]}'>
            <label for="3">${shuffledArray[2]}</label><br><br>
            <input type="radio" id="choice-4" class="answer" value='${shuffledArray[3]}'>
            <label for="4">${shuffledArray[3]}</label>
            <br><br>
            <button id= "submit-answer">Submit</button>
            <div id = "next"></div>
          `
      )
    } else {
      $('#answers').html(
        `
            <input type="radio" id="choice-1" class="answer" value="True">
            <label for="1">True</label><br><br>
            <input type="radio" id="choice-2" class="answer" value="False">
            <label for="2">False</label><br><br>
            <br><br>
            <button id= "submit-answer">Submit</button>
            <div id = "next"></div>
          `
      )
    }

      $("#submit-answer").click((event) => {
        event.preventDefault()

        if (checkRadioButtons() == true){

        let userAnswer = ''

        $('.answer').each((index, element) => {
            if (element.checked === true){
              userAnswer = element.value
            }
          })

        console.log(userAnswer)
        console.log(correctAnswer)

        function decodeHtml(html) {
            var txt = document.createElement("textarea")
            txt.innerHTML = html
            return txt.value
          }

        if(userAnswer === decodeHtml(correctAnswer)){
          console.log("Correct")
          userScore += 1
        } else {
          console.log("Incorrect")
        }

        updateUserScore()

        $("#submit-answer").attr("disabled", true)
        $('#next').html(`<button id="next-question">Next</button>`)

        $('#next-question').click((event)=>{
          event.preventDefault()
          nextQuestion(question)
        })
        n++

      } else { alert("You must choose an answer")}

      })

    }

    function nextQuestion(question){
      if (n < question.length){
          displayQuestion(question)
          displayAnswers(question)
        } else {
          endGame()
        }
    }


    function endGame(){
      $('.question-form').html("The game is over")
    }

    function checkRadioButtons(){
      var radioName = 'answer';
      if ($('input[class='+ radioName +']:checked').length) {
        return true; // allow whatever action would normally happen to continue
        } else {
          return false; // stop whatever action would normally happen
        }
      }


})
