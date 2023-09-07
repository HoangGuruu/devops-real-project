const qustionDataBase = [
  {
    question: "Full form of Html?",
    option1: "Hello to my world",
    option2: "Hey text my language",
    option3: "Hyper text Markup language",
    option4: "Hyper text Makeup language",
    ans: "answer3",
  },
  {
    question: "why do we use ReactJs?",
    option1: "For building UI's",
    option2: "For back-end",
    option3: "For data-bases",
    option4: "It's nothing.",
    ans: "answer1",
  },
  {
    question: "Which tag is incorrect?",
    option1: "<kbd>",
    option2: "<html>",
    option3: "<abbr>",
    option4: "All are correct",
    ans: "answer4",
  },
  {
    question: "which is wrong here?",
    option1: "var x = 10;",
    option2: "x = 10",
    option3: "let x = 10;",
    option4: "const x = 10;",
    ans: "answer2",
  },
  {
    question: "What is git?",
    option1: "version control system",
    option2: "A ugly thing",
    option3: "Distributed version control system",
    option4: "A useful stuff",
    ans: "answer3",
  },
  {
    question: "Which is correct?",
    option1: "<html><body>...</body></html>",
    option2: "<body><html>...</html></body>",
    option3: "<script><head>...</head></script>",
    option4: "All are correct.",
    ans: "answer1",
  },
  {
    question: "Which is unchangeable",
    option1: "var x = 10;",
    option2: "let x = 10;",
    option3: "const x = 10;",
    option4: "All are unchangeable.",
    ans: "answer3",
  },
  {
    question: "How many kinds of loops are here in js?",
    option1: "2",
    option2: "6",
    option3: "1",
    option4: "5",
    ans: "answer4",
  },
  {
    question: "What does an array called in js?",
    option1: "Array",
    option2: "Object",
    option3: "String",
    option4: "Boolean",
    ans: "answer2",
  },
  {
    question: "Which is the best js Library?",
    option1: "ReactJs",
    option2: "JQuery",
    option3: "Angular",
    option4: "Vue",
    ans: "answer1",
  },
];

// getting referrence
const questionContainer = document.querySelector("h2");
const option1 = document.querySelector("#option1");
const option2 = document.querySelector("#option2");
const option3 = document.querySelector("#option3");
const option4 = document.querySelector("#option4");
const submitButton = document.querySelector("button");
const usersAnswer = document.querySelectorAll(".answer");
const scoreArea = document.querySelector("#ShowScore");

// This function is rendering all the texts

let questionCount = 0;
let score = 0;
const mainFunc = () => {
  const list = qustionDataBase[questionCount];
  questionContainer.innerText = list.question;
  option1.innerText = list.option1;
  option2.innerText = list.option2;
  option3.innerText = list.option3;
  option4.innerText = list.option4;
};

mainFunc();

// this function is for answer checking

const goCheckAnswer = () => {
  let answers;
  usersAnswer.forEach((data) => {
    if (data.checked) {
      answers = data.id;
    }
  });
  return answers;
};

const deselectAll = () => {
  usersAnswer.forEach((data) => {
    data.checked = false;
  });
};

submitButton.addEventListener("click", () => {
  const checkAnswer = goCheckAnswer();
  console.log(checkAnswer);

  if (checkAnswer === qustionDataBase[questionCount].ans) {
    score++;
  }
  questionCount++;
  deselectAll();
  if (questionCount < qustionDataBase.length) {
    mainFunc();
  } else {
    scoreArea.style.display = "block";
    scoreArea.innerHTML = `
      <h3>Your score is ${score} / ${qustionDataBase.length}</h3>
      <button class='btn' onclick='location.reload()'>Play Again</button>
      `;
  }
});
