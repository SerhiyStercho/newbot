const TelegramBot = require('node-telegram-bot-api')
const fs = require('fs')


const TOKEN = '585763210:AAH7aNgmxWGyH4DmgUfIA9cYwqBBiZrRRFw';

const bot = new TelegramBot(TOKEN, {
	polling:  true
});


let expr_buf = "";


const expression = ["Іди у псячу колибу","Уйди вон!",
	"Ееееееее",
	"Ооотт",
	"Шо шо?",
	"Я сисе у маткадови цілу нюіч робив",
	"Но нашто дурноє говориш?",
	"Я розумієш з такими як ти не годен робити",
	"Теорему Коші знаєш? - та ти нич не знаєш!",
	"Я не маву час!",
	"Пиши заяву!",
	"Конспект маєш?",
	"Іди та ся учи!",
	"Закрий мобілку",
	"Списування не буде!",
	"Я тя ужену! Підеш у мене на осінь!",
	"Я хочу іти так як оно має іти!",
	"Ану пішли зо мнов на кафедру!",
	"Не бауся!",
	"Я розумієш іще таких як ти не відів",
	"Добрий динь!","К-карту знаєш?",
	"Іди кози пасти!",
	"Ти у ня нич не здаш ціркачу!",
	"Што?"];

const comands = ['/start','/rozklad','/menu','/desc','/random_king_text','/date'];




const KEY = {
	rozklad: 'Розклади',
	who: 'Хто я?',
	king: 'Рандомна фраза Короля',
	back: 'Назад',
	k1: '1 Курс',
	k2: '2 Курс',
	k3: '3 Курс',
	k4: '4 Курс',
	k5: 'Магістри'
}

const PdfSrcs = {

	[KEY.k1]: [
		'1k1v.pdf',
		'1k2v.pdf'
	],

	[KEY.k2]: [
		'2k1v.pdf',
		'2k2v.pdf'
	],

	[KEY.k3]: [
		'3k1v.pdf',
		'3k2v.pdf'
	],

	[KEY.k4]: [
		'4k1v.pdf',
		'4k2v.pdf'
	],

	[KEY.k5]: [
		'5k1v.pdf',
		'5k2v.pdf'
	]
}

bot.onText(/\/start/, msg=>{

	const start_msg = `Привіт ${msg.from.first_name}!\nТуй типирь Іван Юрійович!\nВ цій версії бота доступні такі можливості:\n
	/start - Запуск бота;\n
	/menu - Старт меню;\n
	/desc - Підказка\n
	/rozklad - Розклад занятть\n
	/random_king_text - Рандомна фраза Короля\n
	/date - Сьогоднішня дата(якшо хтось забув)`;

	bot.sendMessage(msg.chat.id, start_msg);
   	

});



/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
bot.onText(/\/rozklad/, msg=>{
   	
   setScheduleScreen(msg.chat.id);
});

bot.onText(/\/menu/, msg=>{
   	
   	sendMainKeyboard(msg.chat.id);
});

bot.onText(/\/desc/, msg=>{
   	
   	const desc_msg = `Список ф-цій:\n /start - Запуск бота;\n
	/menu - Старт меню;\n
	/desc - Підказка\n
	/rozklad - Розклад занятть\n
	/random_king_text - Рандомна фраза Короля\n
	/date - Сьогоднішня дата(якшо хтось забув)`;

	bot.sendMessage(msg.chat.id, desc_msg);
	
});

bot.onText(/\/random_king_text/, msg=>{

	bot.sendMessage(msg.chat.id, getRandomKingText());
	
});

bot.onText(/\/date/, msg=>{
	let date = new Date(); 

	let dateString = "";

	if(date.getUTCDate().toString().length === 1){
		dateString += '0'+date.getUTCDate()+'/';
	}else dateString += date.getUTCDate()+'/';

	if(date.getUTCMonth().toString().length === 1){
		dateString += '0'+(date.getUTCMonth()+1)+'/';
	}else dateString += date.getUTCMonth()+'/';

	dateString += date.getUTCFullYear();
	bot.sendMessage(msg.chat.id, dateString);
	
});

require('http').createServer().listen(process.env.PORT || 5000).on('request', function(req, res){
    res.end('');
})﻿;

bot.on('message', msg=>{

	switch (msg.text) {
		case KEY.rozklad:
			setScheduleScreen(msg.chat.id)
			break;
		case KEY.who:
			bot.sendMessage(msg.chat.id,msg.from.first_name)
			break;
		case KEY.king:
			let text= getRandomKingText();
			bot.sendMessage(msg.chat.id, text);
			break;
		case KEY.back:
			sendMainKeyboard(msg.chat.id);
			break;
		case KEY.k1:
			sendFiles(msg.chat.id, msg.text);
			break;
		case KEY.k2:
			sendFiles(msg.chat.id, msg.text);
			break;
		case KEY.k3:
			sendFiles(msg.chat.id, msg.text);
			break;
		case KEY.k4:
			sendFiles(msg.chat.id, msg.text);
			break;
		case KEY.k5:
			sendFiles(msg.chat.id, msg.text);
			break;
		default:
			//checkDefault(msg.chat.id, msg.text);
			break;
	}
});



function sendMainKeyboard(chatId) {

	const desc_header = 'Меню';
   		bot.sendMessage(chatId, desc_header,{
   		reply_markup:{

   			keyboard:[
   				[KEY.rozklad],
   				[KEY.king],
   				[KEY.who]
   			]
   		}
   	});
}

function setScheduleScreen(chatId) {
	bot.sendMessage(chatId, 'Виберіть курс:', {

		reply_markup:{

   			keyboard:[
   				[KEY.k1, KEY.k2],
   				[KEY.k3, KEY.k4],
   				[KEY.k5],
   				[KEY.back]
   			]
   		}

	});
}

function sendFiles(chatId, text) {
	const srcs = PdfSrcs[text];
	send(chatId, srcs);
}

function send(chatId, files){

	bot.sendMessage(chatId, 'Секундочку');

	for(let i=0; i<files.length;i++){

		fs.readFile(`${__dirname}/schedule/${files[i]}`, (error,file) =>{
			if(error) throw new Error(error);

			bot.sendDocument(chatId, file);

		});
	}
}

function getRandomKingText(){


	let index = getRand(0 , expression.length-1);

	if(expression[index]===expr_buf)
	 	getRandomKingText();
	else {
		expr_buf = expression[index];
	}

	return expression[index];
}

function getRand(min,max){
	return Math.floor(Math.random() * (max-min) + min);
}


