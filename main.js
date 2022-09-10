//asigno a una const
const principal = document.querySelector("#principal");
const spinner = document.querySelector("#spinner");
const previous = document.querySelector("#previous");
const next = document.querySelector("#next");
const favorito = document.querySelector("#favoritos");
const inicio = document.querySelector(`#inicio`);
const pagina = document.querySelector(`#pagina`);
const mode = document.querySelector("#mode");
const diaNoche = document.querySelector("#dia-noche");
const DateTime = luxon.DateTime;
let dt = DateTime.local();
//saco la hour
const { hour } = dt;
//cuando sea las 00hs te envia el alert , solo te avisa a las 00hs
hour == 0 && Swal.fire("Te cuidamos", `Modo dark Activado `, "success");
//variables para poner un inicio y limete de pokemons en la misma pagina
let offset = 1;
let limit = 13;
//lista para favoritos
let localFav = [];
//le asigno una variable al locals de mode
let dia_noche = JSON.parse(localStorage.getItem("mode"));
//un simple if para cambiar el icono
dia_noche
	? (diaNoche.childNodes[0].src = "./img/dia.png")
	: //nose si lo hago bien, pero para mi es mas facil entrar a los hijos node y cambiarlos desde ahi
	  (diaNoche.childNodes[0].src = "./img/noche.png");
//elimina te devuelve una lista sin contenido iguales ej.[1,1,2] a [1,2]
const removeDuplicates = (arr) => {
	let mySet = new Set(arr);
	return Array.from(mySet);
};
//para cambiar de modo dark
diaNoche.addEventListener("click", () => {
	if (dia_noche) {
		localStorage.setItem("mode", false);
	} else {
		localStorage.setItem("mode", true);
	}
	location.reload();
});
//eliminar y cargar desde el offset 14 para arriba
next.addEventListener("click", () => {
	offset += 14;
	removerPokemons(principal);
	PokemonShow(offset, limit);
});
//eliminar y cargar desde el offset 14 para arriba
previous.addEventListener("click", () => {
	if (offset != 1) {
		offset -= 14;
		removerPokemons(principal);
		PokemonShow(offset, limit);
	}
});
//eliminar los pokemon e hijos
const removerPokemons = (parent) => {
	//funciona asi elimina los todos los paret hijos
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
};
//busca los pokemons
const buscarPokemon = (event) => {
	event.preventDefault();
	const { value } = event.target.pokemon;
	//trae la informacion
	fetch(`https://pokeapi.co/api/v2/pokemon/${value.toLowerCase()}`)
		.then((data) => data.json())
		.then((response) => {
			//eliminar los pokemon que habia
			removerPokemons(principal);
			//imprime lo que buscamos
			renderPokemonData(response);
			spinner.style.display = "none";
		})
		//si sale un erro llama a catch
		.catch((err) => {
			removerPokemons(principal);
			noEncontrado("No Encontrado");
			spinner.style.display = "none";
		});
};
//llama a los pokemons
const pokemons = async (id) => {
	const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
	const response = await data.json();
	renderPokemonData(response);
	spinner.style.display = "none";
};
//Objetos , tipo de pokemon y sus colores
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
//para imprimir los pokemon en la pantalla
const renderPokemonData = (data) => {
	//data=pokemon
	//img del pokemon
	const poke_sprite = data.sprites.front_default;
	//saco las abiliddades,estadisticas y tipos de los pokemon para trabjar mejor y proximamente asignarle a una funcion
	const { stats, types, abilities } = data;
	const pokeNombre = data.name.toUpperCase();
	const pokeId = data.id;
	const pokeImg = poke_sprite;
	const color1 = colorTipos[types[0].type.name];
	const color2 = types[1] ? colorTipos[types[1].type.name] : colorTipos.default;
	const pokeCard = document.createElement("article");
	pokeCard.classList.add("col-md-4", "m-3");
	pokeCard.classList.add("poke-card");
	pokeCard.setAttribute("id", "card");
	pokeCard.innerHTML = `	
	<div class="pokemon-nombre">${pokeNombre}<button type="submit" ><i id="${data.id}" style="color:black"class="fa-solid fa-heart favw"
	}></i></button></div>
	<div data-poke-img-container class="img-container"><a href="https://listado.mercadolibre.com.ar/${data.name}#D[${data.name}]" target="_blank">
		<img
		style="background:radial-gradient(${color2} 33%, ${color1} 33%)0% 0% /5px 5px"
			class="poke-img"
			src="${pokeImg}"
			alt="De quien este pokemon"
		/><i class="fa-solid fa-cart-shopping"></i></a>
	</div>
	<div data-poke-id>Nº ${pokeId}</div>
		`;
	//llamo a funciones y le asigno al padre
	pokeCard.appendChild(mostrarPokemonTipos(types));
	pokeCard.appendChild(mostrarPokemonEst(stats));
	principal.appendChild(pokeCard);
	modes(pokeCard);
	fav(data);
	coloref(data);
	//todas las funciones son declaras con el valor de pokemon o sub variables de la misma
};
//funcion boluda , para cambiar de color el boton de fav cuando este en locals
function coloref(data) {
	let colorf = JSON.parse(localStorage.getItem("favo"));
	if (colorf !== null) {
		for (let index = 0; index < colorf.length; index++) {
			if (colorf[index].id == data.id) {
				let fav = document.getElementById(`${data.id}`);
				fav.style.color = "red";
			}
		}
	}
}
//funcion para hacr click , y agragarlo al local
//con  la libreria de alert
const fav = (data) => {
	let fav = document.getElementById(`${data.id}`);
	fav.addEventListener(`click`, () => {
		if (localFav == 0 || fav.style.color !== "red") {
			if (Array.isArray(localFav)) {
				localFav.push(data);
				fav.style.color = "red";
				Swal.fire({
					position: "center",
					icon: "success",
					title: "Favoritos",
					showConfirmButton: false,
					timer: 1500,
				});
			} else {
				const arr = localFav || [];
				localFav = arr;
				localFav.push(data);
				fav.style.color = "red";
			}
		} else {
			const o = localFav.findIndex((el) => {
				return el.id == fav.id;
			});
			Swal.fire({
				title: "Eliminar de Favoritos?",
				icon: "warning",
				showCancelButton: true,
				confirmButtonColor: "#3085d6",
				cancelButtonColor: "#d33",
				confirmButtonText: "Si, Eliminar!",
			}).then((result) => {
				if (result.isConfirmed) {
					Swal.fire("Deleted!", "Your file has been deleted.", "success");
					localFav.splice(o, 1);
					fav.style.color = "black";
					localStorage.setItem("favo", JSON.stringify(localFav));
				}
			});
		}
		localStorage.setItem("favo", JSON.stringify(localFav));
	});
};
//funcion para que imprima los tipos de pokemon
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
	//return es muy importante ,asi cuado lo llamo me tiere todo esta infomarcion
	return pokeTipos;
};
//funcion para que imprima los estadisditacs de pokemon
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
	//return es muy importante ,asi cuado lo llamo me tiere todo esta infomarcion
};

//La funciones para imprimir los pokemon desde ofset hasta limit
const PokemonShow = (offset, limit) => {
	spinner.style.display = "block";
	for (let index = offset; index <= offset + limit; index++) {
		//para que la pagina tarde 3s
		setTimeout(() => {
			pokemons(index);
		}, 300);
	}
};
//funcion favoritos , cuando hace click , elimina los pokemon y imprime solo los de la lista local fav
favorito.addEventListener("click", () => {
	pagina.style.display = "none";
	//elimina los pokemon
	removerPokemons(principal);
	localFav = JSON.parse(localStorage.getItem("favo"));
	if (localFav !== null && length.length !== 0) {
		localFav.forEach((e) => {
			//imprime los favortios
			renderPokemonData(e);
			const fav = document.getElementById(`${e.id}`);
			fav.style.color = "red";
		});
		localFav.length == 0 && noEncontrado("No hay Favoritos");
	} else {
		//imprime la funcion , cuando no nada en la lista favoritos
		noEncontrado("No hay Favoritos");
	}
});
//Inicio elimina y carga de nuevo los pokemon ,por si estamos en otro lado
inicio.addEventListener("click", () => {
	pagina.style.display = "block";
	removerPokemons(principal);
	PokemonShow(offset, limit);
});
//funcion para que me imprama cuando no hay o no se encontro
const noEncontrado = (a) => {
	let pokeCard = document.createElement("div");
	pokeCard.classList.add("poke-card", "mt-5");
	let pokeNombre = document.createElement("div");
	let pokeImg = document.createElement("img");
	pokeNombre.textContent = a;
	pokeImg.setAttribute(`src`, `./img/pokemon-desconocido.png`);
	pokeImg.classList.add("poke-img");
	pokeImg.style.background = `#fff`;
	pokeCard.appendChild(pokeNombre);
	pokeCard.appendChild(pokeImg);
	principal.appendChild(pokeCard);
};
//funcion para el modo dar , lo hice asi porque no me gusta tocar el ccs , asi que a los hijos de pokecard le voy cambiando propiedades de style , como el color
//y en body le agrego propiedades de stylo
//tambien hay un if que funciona cuando tocas click cambia o si es una hora espesifica te cambia a modo dark
const modes = (pokeCard) => {
	//si hour es igual a 00hs cambia a modo dark hasta que sea las 7hs
	let horaTarde = JSON.parse(localStorage.getItem("horaTarde"));
	hour == 0 && localStorage.setItem("horaTarde", JSON.stringify(true));
	hour == 7 && localStorage.setItem("horaTarde", JSON.stringify(false));
	if (horaTarde == true || dia_noche == true) {
		let nav = document.querySelector("#nav");
		nav.classList.replace("navbar-light", "navbar-dark");
		nav.classList.replace("bg-light", "bg-dark");
		let body = document.querySelector("#body");
		body.classList.add("bg-black");
		body.childNodes[7].firstElementChild.children[0].children[0].classList.add(
			"bg-dark"
		);
		body.childNodes[7].firstElementChild.children[1].children[0].classList.add(
			"bg-dark"
		);
		body.childNodes[7].firstElementChild.children[0].childNodes[1].style.color =
			"white";
		body.childNodes[7].firstElementChild.children[1].childNodes[1].style.color =
			"white";

		pokeCard.classList.add("bg-dark");
		pokeCard.firstElementChild.style.color = "white";
		pokeCard.children[0].childNodes[1].style.backgroundColor = "#212529";
		pokeCard.children[2].style.color = "white";
		pokeCard.children[4].style.color = "white";
	}
};
//la funcion principal , que llamamos para que funciones todo , es un for que nos imprime
PokemonShow(offset, limit);
