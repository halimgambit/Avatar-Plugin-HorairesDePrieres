exports.action = function(data, callback){

	var tblCommand = {
	
		prochainPriere : function() {prochainPriere (data, client);
					},					
		command2 : function() {command2 (data, client);
					}					
	};
	
	let client = setClient(data);
	info("HorairesDePrieres:", data.action.command, "From:", data.client, "To:", client);
	tblCommand[data.action.command]();
	callback();
}

function prochainPriere (data, client) {

	async function appel () {
	let ville = await fetch('http://ip-api.com/json/')
	.then(response => response.json())
	.then(response1 => response1.city);
	
	const cleApi = Config.modules.HorairesDePrieres.cleApi;
	const cheerio = require("cheerio");
	fetch(`https://www.al-hamdoulillah.com/horaires-prieres/monde/europe/france/${ville.toLowerCase()}.html#jour`)
	.then(response => {
		if (!response.ok) {
		  throw Error(response.statusText);
		}
		return response.text();
	  })
		.then((html) => {
		const $ = cheerio.load(html);
		const heurePriere = $('table').find('#today').text();
		Avatar.speak(`Salam alaikoum, Aujour'dhui à ${ville.toLowerCase()}${' '}${heurePriere}`, data.client, () => {
			Avatar.Speech.end(data.client);
	});
	})
	.catch (error => {
	info(error);
	Avatar.speak(`Je n'arrive pas a acceder au site${error}`, data.client, () => {
		Avatar.Speech.end(data.client);
	});
});
}
appel();
}

function setClient (data) {
	let client = data.client;
    if (data.action.room)
	client = (data.action.room != 'current') ? data.action.room : (Avatar.currentRoom) ? Avatar.currentRoom : Config.default.client;
	if (data.action.setRoom)
	client = data.action.setRoom;
	return client;
}
