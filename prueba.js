const principal = document.querySelector("#principal");
const spinner = document.querySelector("#spinner");
const previous = document.querySelector("#previous");
const next = document.querySelector("#next");
const favorito = document.querySelector("#favoritos");
const inicio = document.querySelector(`#inicio`);
let offset = 1;
let limit = 13;
const favoritos = [];
const removeDuplicates = (arr) => {
	let mySet = new Set(arr);
	return Array.from(mySet);
};
next.addEventListener("click", () => {
	offset += 14;
	removerPokemons(principal);
	PokemonShow(offset, limit);
});
previous.addEventListener("click", () => {
	if (offset != 1) {
		offset -= 14;
		removerPokemons(principal);
		PokemonShow(offset, limit);
	}
});
const removerPokemons = (parent) => {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
};

const pokemons = (id) => {
	fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
		.then((data) => data.json())
		.then((response) => {
			renderPokemonData(response);
			spinner.style.display = "none";
		});
};
const colorTipos = {
	electric: "#FFEA70",
	normal: "#B09398",
	fire: "#FF675C",
	water: "#0596C7",
	ice: "#AFEAFD",
	rock: "#999799",
	flying: "#7AE7C7",
	grass: "#4A9681",
	psychic: "#FFC6D9",
	ghost: "#561D25",
	bug: "#A2FAA3",
	poison: "#795663",
	ground: "#D2B074",
	dragon: "#DA627D",
	steel: "#1D8A99",
	fighting: "#2F2F2F",
	default: "#2A1A1F",
};
const renderPokemonData = (data) => {
	const poke_sprite = data.sprites.front_default;
	const { stats, types, abilities } = data;
	const pokeNombre = data.name.toUpperCase();
	const pokeId = data.id;
	const pokeImg = poke_sprite;
	const color1 = colorTipos[types[0].type.name];
	const color2 = types[1] ? colorTipos[types[1].type.name] : colorTipos.default;
	const pokeCard = document.createElement("div");
	pokeCard.classList.add("col-md-4", "m-3");
	pokeCard.classList.add("poke-card");
	pokeCard.innerHTML = `	
	<div class="pokemon-nombre">${pokeNombre}<button type="submit"><i id="${data.id}" style="color:black"class="fa-solid fa-heart favw"
	}></i></button></div>
	<div data-poke-img-container class="img-container">
		<img
		style="background:radial-gradient(${color2} 33%, ${color1} 33%)0% 0% /5px 5px"
			class="poke-img"
			src="${pokeImg}"
			alt="De quien este pokemon"
		/>
	</div>
	<div data-poke-id>Nº ${pokeId}</div>
		`;
	const img = document.getElementsByName("img");
	pokeCard.appendChild(mostrarPokemonTipos(types));
	pokeCard.appendChild(mostrarPokemonEst(stats));

	principal.appendChild(pokeCard);
	fav(data);
};

const fav = (data) => {
	let fav = document.getElementById(`${data.id}`);
	fav.addEventListener("click", () => {
		if (favoritos.length == 0) {
			favoritos.push(data);
			fav.style.color = "red";
		} else {
			console.log(fav.id);
			if (fav.style.color !== "red") {
				favoritos.push(data);
				fav.style.color = "red";
			} else {
				const o = favoritos.findIndex((el) => {
					return el.id == fav.id;
				});
				console.log(o);
				fav.style.color = "black";
				favoritos.splice(o, 1);
			}
		}
		console.log(favoritos);
	});
};

const mostrarPokemonTipos = (types) => {
	const pokeTipos = document.createElement("div");
	pokeTipos.classList.add("poke-tipos");
	pokeTipos.innerHTML = "";
	types.forEach((type) => {
		const typeTextElement = document.createElement("div");
		typeTextElement.style.color = colorTipos[type.type.name];
		typeTextElement.textContent = type.type.name.toUpperCase();
		pokeTipos.appendChild(typeTextElement);
	});
	return pokeTipos;
};
const mostrarPokemonEst = (stats) => {
	const pokeEstadisticas = document.createElement("div");
	pokeEstadisticas.classList.add("poke-estadisticas");
	pokeEstadisticas.innerHTML = "";
	stats.forEach((stat) => {
		const divEstadisticas = document.createElement("div");
		const divTipoEst = document.createElement("div");
		const divEst = document.createElement("div");
		divTipoEst.textContent = stat.stat.name.toUpperCase();
		divEst.textContent = stat.base_stat;
		divEstadisticas.appendChild(divTipoEst);
		divEstadisticas.appendChild(divEst);
		pokeEstadisticas.appendChild(divEstadisticas);
	});
	return pokeEstadisticas;
};

const PokemonShow = (offset, limit) => {
	spinner.style.display = "block";
	for (let index = offset; index <= offset + limit; index++) {
		pokemons(index);
	}
};
favorito.addEventListener("click", () => {
	removerPokemons(principal);
	favoritos.forEach((e) => {
		renderPokemonData(e);
		const fav = document.getElementById(`${e.id}`);
		fav.style.color = "red";
		console.log(fav);
	});
});
PokemonShow(offset, limit);
inicio.addEventListener("click", () => {
	removerPokemons(principal);
	PokemonShow(offset, limit);
});
