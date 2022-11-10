// Time Tracking:
// https://docs.google.com/spreadsheets/d/1dbuVkOAQTy5H-8PVEyZ-3KGhUVbjCBjtFp-oK_kSN4o/edit#gid=0

// Notes:
// Occasionally, not waiting for all data? 
// inclued all categories?
// Quotation marks on question/answer

const numClues = 5;
const numCat = 6;

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

// if value = null, set to 100
function replaceNull(){
    // for(i in categories){
    //     for(c in categories[i].clues.length){
    //         if(categories[i].clues[c].value == null){
    //             categories[i].clues[c].value = 100;
    //         };
    //     };
    // };
    for(let i = 0; i < numCat; i++){
        for(let c = 0; c < numClues; c++){
            if(categories[i].clues[c].value == null){
                categories[i].clues[c].value = 100;
            };
        };
    };
}

/** Get NUM_CATEGORIES random category from API.
 * 
 * Returns array of category ids
 * 
 */

async function getData() {
    categories = [];

    for (let i = 0; i < numCat; i++){
        let randomCategoryId = randomCat();
        let res = await axios.get(`http://jservice.io/api/category?id=${randomCategoryId + 1}`);
        categories.push(res.data);
    }

    // filter 5 random questions
    for(i in categories){
        let randomClues = [];
        let randomArr = randomClue(categories[i].clues.length);
        for(r in randomArr){
            randomClues.push(categories[i].clues[r]);
        };
        // splice: from index 0, delete all, insert random clues
        categories[i].clues.splice(0, categories[i].clues.length, ...randomClues);


    };

    replaceNull();

};

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
        $(`<td class="category-title" id=col-${i}>${categories[i].title}</td>`)
            .appendTo($top);
    }
    
    // create body
    // create row
    for (let y = 0; y < numClues; y++){
        $(`<tr class="row-body" id="row-${y}"></tr>`).appendTo($tbody);
        
        // fill row
        for(let x = 0; x < numCat; x++){
            $(`<td 
                class="card value"
                id="${categories[x].clues[y].id}"
                value="${categories[x].clues[y].value}"
                question="${categories[x].clues[y].question}"
                answer= "${categories[x].clues[y].answer}"
                >${categories[x].clues[y].value}</td>`)
                .appendTo($(`#row-${y}`));
        };
    };

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
    await getData();
    await fillTable();

}

/** On click of start / restart button, set up game. */

$("#start").on("click", async function handleStart (e){
    e.preventDefault();
    await showLoadingView();
    await setupAndStart();
    await hideLoadingView();


})

/** On page load, add event handler for clicking clues */

    // if class value; hide value, show question
    // if class question; hide question, show answer
$("#tbody").on("click", async function handleClick(e){
    if($(e.target).hasClass("question")){
        $(e.target).removeClass("question").addClass("answer");
        
        // empty, append answer
        $(`#${e.target.id}`).empty().append($(`#${e.target.id}`).attr("answer"));

    }
    if($(e.target).hasClass("value")){
        $(e.target).removeClass("value").addClass("question");

        // empty, append question
        $(`#${e.target.id}`).empty().append($(`#${e.target.id}`).attr("question"))
    }
})
