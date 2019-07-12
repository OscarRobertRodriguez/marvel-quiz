import "./css/reset.css";

import "./css/main.css";
import "./css/card.css";
import "./css/btn.css";
import "./css/helper.css";

import data from './assets/data.json';
import  $  from './jquery.js';
console.log(data);
var quiz = {
  score: 0,
  questionBookmark: 0,
  allQuestions: [
    {
      question:
        "Prior to Tom Holland taking the role, how many actors have played Spider-Man on the big screen in the U.S.?",
      choices: ["3", "1", "2", "4"],
      correctAnswer: 2,
      chosenAns: null
    },
    {
      question: "What movie did Thanos first appear in?",
      choices: [
        "iron man 3",
        "guardians of the galaxy vol. 1",
        "The Avengers",
        "Aquaman"
      ],
      correctAnswer: 2,
      chosenAns: null
    },
    {
      question:
        "Aside from Stan Lee, which actor has appeared in the most MCU films?",
      choices: [
        "Robert Downey Jr.",
        "Chris Evans",
        "Scarlett Johansson",
        "Samuel L. Jackson"
      ],
      correctAnswer: 0,
      chosenAns: null
    },
    {
      question:
        "In Guardians of the Galaxy, what is the name of the dog in the Collector Taneleer Tivan's museum?",
      choices: ["Bevo", "Charlie", "Wattson", "Cosmo The SpaceDog"],
      correctAnswer: 3,
      chosenAns: null
    },
    {
      question: "How many versions of the Iron Man armor has Tony Stark made?",
      choices: ["5", "50", "2", "25"],
      correctAnswer: 1,
      chosenAns: null
    },
    {
      question:
        "How many Infinity Stones are there in the MCU and what color are they?",
      choices: ["6", "4", "7", "10"],
      correctAnswer: 0,
      chosenAns: null
    }
  ],

  nextQuestion() {
    var back = document.querySelector(".btn--back");
    if (this.isOneRadioChecked()) {
      var checkedRadio = document.querySelector(
        'input[type="radio"]:checked + p'
      ).textContent;

      this.checkAnswer(this.questionBookmark, checkedRadio);
      this.questionBookmark += 1;

      if (this.questionBookmark > 0) {
        back.classList.remove("displayNone");
      } else {
        back.classList.add("displayNone");
      }
    }
  },

  checkAnswer(index, radioValue) {
    var correctAns = this.allQuestions[index].correctAnswer;
    var stringCorrect = this.allQuestions[index].choices[
      correctAns
    ].toLowerCase();
    this.storeChosenAnswer(index, radioValue);
    if (stringCorrect == radioValue.toLowerCase()) {
      this.score += 100;
    } else if (this.score >= 100) {
      this.score -= 100;
    }
  },
  validateRadios() {
    var message = document.querySelector(".uncheck-radios__message");
    if (this.isOneRadioChecked() == false) {
      message.classList.remove("displayNone");
    }
    if (this.isOneRadioChecked()) {
      message.classList.add("displayNone");
    }
  },
  isOneRadioChecked() {
    var radios = document.getElementsByName("group1");
    var isOneRadioChecked = [...radios].some(radio => {
      return radio.checked == true;
    });
    return isOneRadioChecked;
  },
  storeChosenAnswer(index, value) {
    var questionObj = this.allQuestions[index];
    var position = questionObj.choices.findIndex(choice => {
      return choice == value;
    });
    console.log(position, "position");
    questionObj.chosenAns = position;
  }
};

export var handlers = {
  startGame() {
    view.hideStartCard();
  },
  nextQuestion() {
    quiz.validateRadios();
    quiz.nextQuestion();
    view.displayNewQuestion();
  },
  validateRadios() {
    quiz.validateRadios();
  },
  goBack() {
    quiz.questionBookmark -= 1;

    console.log("question", quiz.questionBookmark);
    view.displayNewQuestion();
    view.checkRadioFromPrevious();
  }
};

var view = {
  hideStartCard() {
    var cover = $('.cover');
    cover.fadeOut(500);
  },
  displayNewQuestion() {
    var questionP = $('#card__question');
    var paragraphs = $('input[type="radio"] + p');
    var labels = $('.label__container').children();
    var questionObj = quiz.allQuestions[quiz.questionBookmark];
    var index = 0; 
    if (quiz.questionBookmark == 6) {
      this.showFinalScore();
    } else {

      if(quiz.isOneRadioChecked()) {

        this.unCheckRadiosOnNext();
      questionP.fadeOut(function() {
        $(this).text(questionObj.question).fadeIn();
      });
      
      setTimeout(function() {
      [...paragraphs].forEach((item, index) => {
          item.innerHTML = questionObj.choices[index];
      });
    }, 500); 


      setTimeout( function run () {
        labels.slideUp().fadeIn();
        paragraphs.fadeOut().delay(100).fadeIn();
      }, 0);
    
    }
      
    }
  },
  unCheckRadiosOnNext() {
    var radios = document.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => {
      radio.checked = false;
    });
  },
  showFinalScore() {
    var questionP = document.querySelector("#card__question");
    var labels = document.querySelector(".card__radios");
    var score = document.querySelector(".score");
    var message = document.querySelector(".score__message");
    var btns = document.querySelectorAll(".btn");

    questionP.classList.add("displayNone");
    labels.classList.add("displayNone");
    score.classList.remove("displayNone");
    message.classList.remove("displayNone");
    btns.forEach(btn => {
      btn.classList.add("displayNone");
    });
    score.textContent = `${quiz.score}pts / 600pts`;
    message.textContent =
      quiz.score == 600
        ? "you found all the infinity stones"
        : "your missing some infinity stones. Maybe next time.";
  },
  checkRadioFromPrevious() {
    var questionObj = quiz.allQuestions[quiz.questionBookmark];
    var chosenAns = questionObj.chosenAns;
    var radios = document.querySelectorAll('input[type="radio"]');
    radios[chosenAns].checked = true;
  }
};
