const URL_BASE = "http://localhost:8000/api/v1/titles/";
const categories = document.querySelectorAll(".images-best-movie-categorie");
const modal = document.getElementById("modal");

function load_json(url)
{	
	try
	{
		return fetch(URL_BASE+url).then(response => 
		{
			if (response.ok)
			{
				return response.json();
			}
			else
			{
				throw new Error("La requete a échoué.");
			}
		})
	}
	catch(e)
	{
		console.log(e.message)
	}
}

function load_best_movie(url)
{
	load_json(url).then(json => 
	{
		load_json(json.results[0]["id"]).then(sub_json => 
		{
			document.getElementById("best-movie").innerHTML = 
			`<div id="information-best-movie">
				<h1 id="title-best-movie">${json.results[0]["title"]}</h1>
				<button id='button_play' onclick="show_modal(${json.results[0]["id"]})">Play</button>
				<p id="description_best_movie">${sub_json["long_description"]}</p>
			</div>
			<div id="img-best-movie">
				<img src="${json.results[0]["image_url"]}" id="img_movie_0" width="450" height="550">
			</div>`;
		})
	})
}

function load_best_movies_for_categorie(url, classname, offset=1)
{
	load_json(`${url}&page=${offset}`).then(json => 
	{
		load_json(`${url}&page=${offset+1}`).then(next_json => 
		{
			let bestmovies = json.results.slice(0,5);
			bestmovies.push(...next_json.results.slice(0,2));
			elements = document.getElementsByClassName(classname);
			for(i in bestmovies)
			{
				elements[i].dataset.idmovie = bestmovies[i]['id'];
				elements[i].src = bestmovies[i]['image_url'];
			}

		})
	})
}


function show_modal(target_id){
	load_json(`${target_id}`)
	.then(json => {
		modal.innerHTML = 
		`<div id="modal-wrapper">
			<div id="information-best-movie-modal">
				<h1>${json["title"]}</h1>
				<ul>
					<li>Genre : ${json["genres"]}</li>
					<li>Années de sortie : ${json["year"]}</li>
					<li>Rating : ${json["rated"]}</li>
					<li>Score imdb : ${json["imdb_score"]}</li>
					<li>Producteurs : ${json["directors"]}</li>
					<li>Acteurs : ${json["actors"]}</li>
					<li>Durée : ${json["duration"]}</li>
					<li>Pays : ${json["countries"]}</li>
					<li>Moyenne des votes : ${json["avg_vote"]}</li>
				</ul>
				<p id="description-best-movie-modal">${json["long_description"]}</p>
			</div>
			<img src="${json["image_url"]}" id="image-best-movie-modal" width="400" height="600">
		</div>`;
		modal.style.display = "block";
	})
}

function hide_modal()
{
	modal.style.display = "none";
}
modal.onclick = function()
{
	hide_modal();
}

function get_offset(offset, add = true)
{	
	if (add)
	{
		return offset === -1 ? 1 : offset+1;
	}
	else
	{
		return offset === 1 ? -1 : offset-1;
	}
}


function Categorie(start_url, end_url, class_img)
{
	this.start_url = start_url;
	this.end_url = end_url;
	this.class_img = class_img;
	this.offset = 1;

	this.scaling = function(button_classname)
	{
		let sens = "";
		if (button_classname === "fas fa-arrow-right")
		{
			this.offset = get_offset(this.offset);
		}
		else
		{
			this.offset = get_offset(this.offset, false);
		}
		if (this.offset > 0)
		{
			sens = '-';
		}
		load_best_movies_for_categorie(this.start_url+sens+this.end_url, this.class_img, Math.abs(this.offset));
	}
}

function get_categorie(idcat)
{
	switch (idcat)
	{
		case "1":
			return c1;
		case "2":
			return c2;
		case "3":
			return c3;
		case "4":
			return c4;
	}
}

c1 = new Categorie('?sort_by=', 'imdb_score', 'img_movie 1');
c2 = new Categorie('?sort_by=', 'imdb_score&genre=Action', 'img_movie 2');
c3 = new Categorie('?sort_by=', 'imdb_score&genre=Comedy', 'img_movie 3');
c4 = new Categorie('?sort_by=', 'imdb_score&genre=War', 'img_movie 4');


categories.forEach( div => {
	div.innerHTML+=`<i class="fas fa-arrow-left" data-idcat="${div.id.split('-')[4]}"></i>`;
	for(let i=0; i<7; i++){
		div.innerHTML+=`<img src="" class="img_movie ${div.id.split('-')[4]}" data-idmovie="" width="120" height="160">`;
	}
	div.innerHTML+=`<i class="fas fa-arrow-right" data-idcat="${div.id.split('-')[4]}"></i>`;
})

const images_modal = document.querySelectorAll('.img_movie');
images_modal.forEach(img => {
	img.addEventListener('click', e => {
		show_modal(e.target.dataset.idmovie);
	})
})


buttons = document.querySelectorAll('.fas');
buttons.forEach(button => 
{
	button.addEventListener('click', e => 
	{
		get_categorie(e.target.dataset.idcat).scaling(e.target.className);
	})
})

load_best_movie("?sort_by=-imdb_score");
load_best_movies_for_categorie("?sort_by=-imdb_score", 'img_movie 1');
load_best_movies_for_categorie("?sort_by=-imdb_score&genre=Action", 'img_movie 2');
load_best_movies_for_categorie("?sort_by=-imdb_score&genre=Comedy", 'img_movie 3');
load_best_movies_for_categorie("?sort_by=-imdb_score&genre=War", 'img_movie 4');







