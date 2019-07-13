import "./css/reset.css";

import "./css/main.css";
import "./css/card.css";
import "./css/btn.css";
import "./css/helper.css";

import $ from "./jquery.js";
import data from "./assets/data.json";

var quiz = {
  validateRadios() {
    var message = document.querySelector(".uncheck-radios__message");
    if (this.isOneRadioChecked() == false) {
      message.classList.remove("displayNone");
      return false;
    }
    if (this.isOneRadioChecked()) {
      message.classList.add("displayNone");
      return true;
    }
  },
  isOneRadioChecked() {
    var radios = document.getElementsByName("group1");
    var isOneRadioChecked = [...radios].some(radio => {
      return radio.checked == true;
    });
    return isOneRadioChecked;
  },
  nextQuestion() {
    if (this.isOneRadioChecked()) {
      var radios = document.querySelectorAll('input[type="radio"]');
      var radioIndex = [...radios].findIndex(radio => radio.checked);

      this.checkAnswer(radioIndex);
      data.questionBookmark += 1;
    }
  },
  checkAnswer(radioIndex) {
    var correctAns = data.allQuestions[data.questionBookmark].correctAnswer;
    this.storeChosenAnswer(radioIndex);
    if (correctAns == radioIndex) {
      data.score += 100;
      console.log("TCL: checkAnswer -> data.score", data.score);
    }
  },
  storeChosenAnswer(value) {
    data.allQuestions[data.questionBookmark].chosenAns = value;
  },
  checkRadioFromPrevious() {
    var questionObj = data.allQuestions[data.questionBookmark];
    var chosenAnswer = questionObj.chosenAns;
    var radios = document.querySelectorAll('input[type="radio"]');
    if (chosenAnswer != null) {
      radios[chosenAnswer].checked = true;
    }
  },
  subtractScoreOnBack() {
    data.score -= 100;
  }
};

export var handlers = {
  startGame() {
    view.hideStartCard();
  },
  nextQuestion() {
    if (quiz.validateRadios()) {
      quiz.nextQuestion();
      view.removeBackBtn();
      view.displayNewQuestion();
      if (data.questionBookmark < 6) {
        quiz.checkRadioFromPrevious();
      }
    }
  },
  goBack() {
    data.questionBookmark -= 1;
    quiz.subtractScoreOnBack();
    view.removeBackBtn();
    view.displayNewQuestion();
    quiz.checkRadioFromPrevious();
  }
};

var view = {
  hideStartCard() {
    $(".cover").fadeOut(500);
  },
  removeBackBtn() {
    var back = document.querySelector(".btn--back");
    data.questionBookmark > 0
      ? back.classList.remove("displayNone")
      : back.classList.add("displayNone");
  },
  displayNewQuestion() {
    var questionP = $("#card__question");
    var paragraphs = $('input[type="radio"] + p');
    var labels = $(".label__container").children();
    var questionObj = data.allQuestions[data.questionBookmark];
    if (data.questionBookmark == 6) {
      this.showFinalScore();
    } else {
      this.unCheckRadiosOnNext();
      questionP.fadeOut(function() {
        $(this)
          .text(questionObj.question)
          .fadeIn();
      });

      setTimeout(function() {
        [...paragraphs].forEach((item, index) => {
          item.innerHTML = questionObj.choices[index];
        });
      }, 500);

      setTimeout(function run() {
        labels.slideUp().fadeIn();
        paragraphs
          .fadeOut()
          .delay(100)
          .fadeIn();
      }, 0);
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
    score.textContent = `${data.score}pts / 600pts`;
    message.textContent =
      data.score == 600
        ? "you found all the infinity stones"
        : "your missing some infinity stones. Maybe next time.";
  }
};
