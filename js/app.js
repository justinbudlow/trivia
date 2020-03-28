$(function () {

  let numberOfQuestions, category, difficult, type
  let userScore = 0

  //user configures their game by selecting their desired number of questions
  //category, question difficulty, and type of question.
  //save these values in variables to be used as query params in the API call to the triva API
  $("#start-game").click((event) => {
    console.log('starting a new game')
    event.preventDefault()

    numberOfQuestions = $('#trivia_amount').val()
    category = $('#trivia_category').val()
    difficulty = $('#trivia_difficulty').val()
    type = $('#trivia_type').val()

    //get rid of the game configuration form in preparation for the game
    $('.form-api').html('')

    //function that makes the API call to fetch the questions and answers for the game
    generateQuestions()

  })

  function generateQuestions() {
      const url = "https://opentdb.com/api.php"

      //create an object using the values stored above from the initial game configuration form
      const queryParameters = {
        amount: numberOfQuestions,
        category: category,
        difficulty: difficulty,
        type: type
      }

      //if user selects "any" for category, difficult, or type, the API call does not need to include those as parameters
      //loops through the parameters object to check if user selected "any" for category, difficult, or type, and delete the parameter if so.
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

    let n = 0 //value stored to keep track of which question user should see

    //displays user current score. should always start at 0
    function updateUserScore(){
      $('.score').html(`Your score: ${userScore}`)
    }

    //displays the current question
    function displayQuestion(question){
      $('#question').html(`<p>${question[n].question}</p>`)
    }

    //displays the answer options for the current question
    function displayAnswers(question) {

    //store the correct and incorrect answers at put into an array for shuffling
    let correctAnswer = question[n].correct_answer
    const incorrectAnswer1 = question[n].incorrect_answers[0]
    const incorrectAnswer2 = question[n].incorrect_answers[1]
    const incorrectAnswer3 = question[n].incorrect_answers[2]
    const arrayAnswers = [correctAnswer, incorrectAnswer1, incorrectAnswer2, incorrectAnswer3]

    //for multiple choice quesitons, the answers always need to presented in a random order
    if (question[n].type === 'multiple') {

      // funciton that shuffles they array of answer options created above
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
      //call the shuffle function and store results in an array
      const shuffledArray = shuffle(arrayAnswers)

      //udpate the HTML using the shuffled answer options.
      $('#answers').html(
        //display answer options in radio buttons
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
      //for true/false questions, no shuffling or randomization is needed. these options will always
      //be presented as True and False in that order
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

      //checks to see if the submitted answer is correct
      $("#submit-answer").click((event) => {
        event.preventDefault()

        //handling to make sure a radio button is selected
        if (checkRadioButtons() == true){

        //will use this to store the user's answer
        let userAnswer = ''

        //loops through radio buttons to see which one is checked, and stores the valueof the
        //checked radio button as the user's answer
        $('.answer').each((index, element) => {
            if (element.checked === true){
              userAnswer = element.value
            }
          })

        console.log(userAnswer)
        console.log(correctAnswer)

        //function to read any potential HTML characters as a regular string. The API response
        //object sometimes contains HTML encoding
        function decodeHtml(html) {
            var txt = document.createElement("textarea")
            txt.innerHTML = html
            return txt.value
          }

        //check to see if the user's answer matches the correct answer. If so, increment user's score by 1
        if(userAnswer === decodeHtml(correctAnswer)){
          console.log("Correct")
          userScore += 1
        } else {
          console.log("Incorrect")
        }

        updateUserScore()

        //disable the submit button
        $("#submit-answer").attr("disabled", true)

        //display a "next" button for user to advance to next question
        $('#next').html(`<button id="next-question">Next</button>`)

        $('#next-question').click((event)=>{
          event.preventDefault()
          nextQuestion(question)
        })

        //increment the iterator that keeps track of which question/answers should be shown
        n++

      } else //if no radio button is selected, pop an alert
        { alert("You must choose an answer")}

      })

    }

    //function to show next question is questions remain, otherwise end the game
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

    //function that returns true if at least one radio button is checked and false if none are
    function checkRadioButtons(){
      var radioName = 'answer';
      if ($('input[class='+ radioName +']:checked').length) {
        return true; // allow whatever action would normally happen to continue
        } else {
          return false; // stop whatever action would normally happen
        }
      }


})
