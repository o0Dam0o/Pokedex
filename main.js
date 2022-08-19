const pokeCard = document.querySelector(`[data-poke-card]`);
const pokeNombre = document.querySelector(`[data-poke-nombre]`);
const pokeImg = document.querySelector(`[data-poke-img]`);
const pokeImgContainer = document.querySelector(`[data-poke-img-container]`);
const pokeId = document.querySelector(`[data-poke-id]`);
const pokeEstadisticas = document.querySelector(`[date-poke-estadisticas]`);
const pokeTipos = document.querySelector(`[date-poke-tipo]`);

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

const buscarPokemon = (event) => {
	event.preventDefault();
	const { value } = event.target.pokemon;
	fetch(`https://pokeapi.co/api/v2/pokemon/${value.toLowerCase()}`)
		.then((data) => data.json())
		.then((response) => renderPokemonData(response))
		.catch((err) => noEncontrado());
};
const renderPokemonData = (data) => {
	const poke_sprite = data.sprites.front_default;
	const { stats, types, abilities } = data;
	console.log(data);

	pokeNombre.textContent = data.name.toUpperCase();
	pokeImg.setAttribute("src", poke_sprite);
	pokeId.textContent = `Nº ${data.id}`;
	setCardColor(types);
	mostrarPokemonTipos(types);
	mostrarPokemonEst(stats);
};
const setCardColor = (types) => {
	const color1 = colorTipos[types[0].type.name];
	const color2 = types[1] ? colorTipos[types[1].type.name] : colorTipos.default;
	pokeImg.style.background = `radial-gradient(${color2} 33%, ${color1} 33%)`;
	pokeImg.style.backgroundSize = " 5px 5px";
};
const mostrarPokemonTipos = (types) => {
	pokeTipos.innerHTML = "";
	types.forEach((type) => {
		const typeTextElement = document.createElement("div");
		typeTextElement.style.color = colorTipos[type.type.name];
		typeTextElement.textContent = type.type.name.toUpperCase();
		pokeTipos.appendChild(typeTextElement);
	});
};
const mostrarPokemonEst = (stats) => {
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
};
const noEncontrado = () => {
	pokeNombre.textContent = `No Encontrado`;
	pokeImg.setAttribute(`src`, `./img/pokemon-desconocido.png`);
	pokeImg.style.background = `#fff`;
	pokeEstadisticas.innerHTML = ``;
	pokeTipos.innerHTML = ``;
	pokeId.innerHTML = ``;
};
