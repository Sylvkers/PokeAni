/* 
 * Made by: Sylvianne Kers
 * Class: CMV1D
 * Tutorials used: https://www.linkedin.com/learning/introduction-to-web-apis/what-is-an-api?u=2055716
 */


/* Checks if the input is empty.
* If it is: Give it a random number between 1 and 806 and execute getPokemon.
* If not: Check if the string is a number.
* If it is: Check if it's between 1 and 806.
*      If it is: Execute getPokemon.
* If not: show eror message.
* 
* @param  {string} pokemon either the index number or the name of the pokemon
* 
*/
function validate(pokemon) {

    // It first checks if it's empty
    if (pokemon === "") {
        // It is empty: Generate a random number for the getPokemon function
        number = Math.floor(Math.random() * 806) + 1;
        getPokemon(number);

        // hide error message
        document.getElementById("error").style.display = "none";

        // Checks if the input contains a number if the string isn't empty
    } else if (!isNaN(pokemon)) {

        // If it does: Checks if the number isn't below 1 or over 806.
        if (pokemon < 1 || pokemon > 806) {

            // If it does, display the error message
            document.getElementById("error").style.display = "inline-block";
        } else {

            // If not; Call the getPokemon(), + hide error message
            getPokemon(pokemon);
            document.getElementById("error").style.display = "none";
        }
    } else {
        // If it is not empty and doesn't contains a number:  Call the getPokemon(), + hide error message
        getPokemon(pokemon.toLowerCase());
        document.getElementById("error").style.display = "none";
    }
}

/**
 * Opening the Poke API by using XMLHttpRequest().
 * Using the param to get Pokemon id, name, imageUrl and changing the information in the html.
 * Also request the Flavor text and Recommended Anime by using a seperate function.
 * 
 * @param  {} number either the index number or the name of the pokemon 
 */
function getPokemon(number) {

    // Setting up the API link
    var requestMon = new XMLHttpRequest();
    requestMon.open('GET', 'https://pokeapi.co/api/v2/pokemon/' + number);

    requestMon.onload = function () {

        if (requestMon.status == 404) {
            document.getElementById("wrong").style.display = "inline-block";
        } else {

            document.getElementById("wrong").style.display = "none";
            document.getElementById("load").style.display = "inline-block";

            // Geting the results and parse it into a JSON object
            var responseMon = requestMon.response;
            var parsedDataMon = JSON.parse(responseMon);

            // put the id, name, and image url in a variable
            var indexNumber = parsedDataMon["id"];
            var name = parsedDataMon.forms[0]['name'];
            var imageUrl = parsedDataMon.sprites['front_default'];

            // Capitalize the first letter of the pokemon name
            var capitalName = name.charAt(0).toUpperCase() + name.slice(1);

            // Replace current information with the new one
            document.getElementById("pokeName").innerHTML = "#" + indexNumber + " " + capitalName;
            document.getElementById("pokeImage").src = imageUrl;

            // Gets the flavor text that belongs to the pokemon
            getFlavor(number);

            document.getElementById("pokeRecommend").innerHTML = capitalName + " recommend you to watch:"

            // Gets the anime that has the same number as the pokemon number
            recommendAnime(indexNumber);
        }
    }
    requestMon.send();
}


/**
 * Opening the Poke API by using XMLHttpRequest().
 * Using the param to get the English Flavor text and changing the information in the html.
 * 
 * @param  {} number either the index number or the name of the pokemon
 */
function getFlavor(number) {

    // Setting up the API link
    var requestMon = new XMLHttpRequest();
    requestMon.open('GET', 'https://pokeapi.co/api/v2/pokemon-species/' + number);

    requestMon.onload = function () {

        // Geting the results and parse it into a JSON object
        var responseMon = requestMon.response;
        var parsedDataMon = JSON.parse(responseMon);

        // Going through the flavor text entries
        for (i = 0; i < parsedDataMon.flavor_text_entries.length; i++) {

            // Break of the loop when it finds a English entry
            if (parsedDataMon.flavor_text_entries[i].language.name == "en") {

                // Put the English Flavor text in a variable and break of the loop
                var flavor = parsedDataMon.flavor_text_entries[i]["flavor_text"];
                break;
            }
        }

        // Creating an empty variable
        var eggGroupName = "";

        // Making a for loop to get all the egg groups + the pokemons that has those egggroups as well
        for (i = 0; i < parsedDataMon.egg_groups.length; i++) {

            // Adding the egg group name to the variable
            eggGroupName = eggGroupName + " " + parsedDataMon.egg_groups[i]["name"];
        }

        // Replace current information with the new one
        document.getElementById("egg").innerHTML = "<b>Egg group:</b> " + eggGroupName;

        // Replace current information with the new one
        document.getElementById("pokeFlavor").innerHTML = flavor;
    }

    requestMon.send();
}


/**
 * Opening the Jikan API by using XMLHttpRequest().
 * Using the param to get the name and image of a anime and changing the information in the html.
 * 
 * @param  {} number index number of the pokemon
 */
function recommendAnime(number) {

    // Setting up the API link
    var requestAnime = new XMLHttpRequest();
    requestAnime.open('GET', 'https://api.jikan.moe/v3/anime/' + number);

    requestAnime.onload = function () {

        // Geting the results and parse it into a JSON object
        var responseAnime = requestAnime.response;
        var parsedDataAnime = JSON.parse(responseAnime);

        // See if the number exist in the api. if not, change the text as if the pokémon doesn't watch anime
        // If it does exist, changed the different elements.
        if (parsedDataAnime.status == 404) {
            document.getElementById("animeName").innerHTML = "Oh! Looks like this pokémon doesn't watch anime!"
            document.getElementById("animePicture").src = "images/sad.png";
            document.getElementById("load").style.display = "none";
        } else {

            // See if the english title exist, if it doesn't: show the romaji title
            if (parsedDataAnime.title_english == null) {
                document.getElementById("animeName").innerHTML = parsedDataAnime.title;
            } else {
                document.getElementById("animeName").innerHTML = parsedDataAnime.title_english;
            }
            document.getElementById("animePicture").src = parsedDataAnime.image_url;
            document.getElementById("load").style.display = "none";
        }

    }
    requestAnime.send();
}