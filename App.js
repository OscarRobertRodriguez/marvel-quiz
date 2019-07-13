import "./css/reset.css";

import "./css/main.css";
import "./css/card.css";
import "./css/btn.css";
import "./css/helper.css";

import data from "./assets/data.json";
import $ from "./jquery.js";
var quiz = {
  nextQuestion() {
    if (this.isOneRadioChecked()) {
      var checkedRadio = document.querySelector(
        'input[type="radio"]:checked + p'
      ).textContent;

      this.checkAnswer(data.questionBookmark, checkedRadio);
      data.questionBookmark += 1;

      this.removeBackBtn();
    }
  },

  checkAnswer(index, radioValue) {
    var correctAns = data.allQuestions[index].correctAnswer;
    var stringCorrect = data.allQuestions[index].choices[
      correctAns
    ].toLowerCase();
    this.storeChosenAnswer(index, radioValue);
    if (stringCorrect == radioValue.toLowerCase()) {
      data.score += 100;
    } else if (data.score >= 100) {
      data.score -= 100;
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
  removeBackBtn() {
    var back = document.querySelector(".btn--back");
    if (data.questionBookmark > 0) {
      back.classList.remove("displayNone");
    } else {
      back.classList.add("displayNone");
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
    var questionObj = data.allQuestions[index];
    var position = questionObj.choices.findIndex(choice => {
      return choice == value;
    });
    questionObj.chosenAns = position;
  }
};

export var handlers = {
  startGame() {
    view.hideStartCard();
  },
  nextQuestion() {
    quiz.validateRadios();
    if (quiz.isOneRadioChecked()) {
      quiz.nextQuestion();
      view.displayNewQuestion();
    }
  },
  validateRadios() {
    quiz.validateRadios();
  },
  goBack() {
    data.questionBookmark -= 1;

    view.displayNewQuestion();
    setTimeout(() => {
      view.checkRadioFromPrevious();
    }, 500);
  }
};

var view = {
  hideStartCard() {
    var cover = $(".cover");
    cover.fadeOut(500);
  },
  displayNewQuestion() {
    var questionP = $("#card__question");
    var paragraphs = $('input[type="radio"] + p');
    var labels = $(".label__container").children();
    var questionObj = data.allQuestions[data.questionBookmark];
    if (data.questionBookmark == 6) {
      this.showFinalScore();
    } else {
      quiz.removeBackBtn();

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
  },
  checkRadioFromPrevious() {
    var questionObj = data.allQuestions[data.questionBookmark];
    var chosenAnswer = questionObj.chosenAns;
    var radios = document.querySelectorAll('input[type="radio"]');
    radios[chosenAnswer].checked = true;
  }
};
