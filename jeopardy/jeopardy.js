// Time Tracking:
// https://docs.google.com/spreadsheets/d/1dbuVkOAQTy5H-8PVEyZ-3KGhUVbjCBjtFp-oK_kSN4o/edit#gid=0

const numClues = 5;

const $spinner = $("#spin-container");
const $table = $("#jeopardy");
const $thead = $("#thead").append('<tr id="top"></tr>');
const $top = $("#top");
const $tbody = $("#tbody");
const $startButton = $("#start");
const $restartButton = $("#restart").hide();

hideLoadingView();

let categories = [];

// Return random integer from 0 to last int
function randomCat(){
    return Math.floor(Math.random() * 10000)
}

// Return random array of 5 clues given number of clues
function randomClue(clues){
    let clueArr = [];
    for(let i = 0; i < numClues ; i++){
        clueArr.push(Math.floor(Math.random() * clues))
    };
    return clueArr;
}



/** Get NUM_CATEGORIES random category from API.
 * 
 * Returns array of category ids
 * 
 * throw/catch to skip error and keep going to include all categories, 
 * or search for total number then pick random 6??
 */

async function getCategoryIds() {
    categories = [];

    for (let i = 0; i < 6; i++){
        let randomCategoryId = randomCat();
        let res = await axios.get(`http://jservice.io/api/category?id=${randomCategoryId + 1}`);
        categories.push(res.data);
    }
}

// Total number of categories??
// async function getCategoryIds() {
//     for (i in _.range(1, 10000)){
//         let res = await axios.get(`http://jservice.io/api/category?id=${i + 1}`);
//         categories.push(res.data.id);
//     }
//     console.log(len(categories))
// }

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {


    // append categories to $top
    for(i in categories){
        $(`<td class="category-title">${categories[i].title}</td>`).appendTo($top);
    }
    
    // create body
    // create empty rows
    for (let i = 0; i <= numClues; i++){
        $(`<tr class="row-body" id="row-${i}"></tr>`).appendTo($tbody)
    }
    
    // fill in questions column/category wise
    for(i in categories){
        let clueArr = randomClue(categories[i].clues.length);
        for(clue in clueArr){
            // appends entire object
            // $(`<td>${categories[i].clues[clue]}</td>`).appendTo($(`#row-${i}`))

            // appends id
            $(`<td class="card">${categories[i].clues[clue].id}</td>`).appendTo($(`#row-${i}`))

            // // add question and answer to td
            // $(`<td class="question">${categories[i].clues[clue].question}</td>`).appendTo($(`#row-${i}`))
            // $(`<td class="answer">${categories[i].clues[clue].answer}</td>`).appendTo($(`#row-${i}`))
        }   
    }


}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {
    $top.empty();
    $tbody.empty();
    $spinner.show();
}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
    $spinner.hide();
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
    await getCategoryIds();
    await fillTable();

}

/** On click of start / restart button, set up game. */

$("#start").on("click", async function handleStart (e){
    e.preventDefault();
    showLoadingView();
    await setupAndStart();
    hideLoadingView();


})

/** On page load, add event handler for clicking clues */

// TODO