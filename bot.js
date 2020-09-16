require('dotenv').config(); // подключаем  dotenv

const Telegraf = require('telegraf'); //подключаем  telegraf
const api = require('covid19-api'); //подкл  covid19-api токен
let Markup = require('telegraf/markup'); // добавляем кнопки
const countryName = require('./contries'); //подключаем сторонний файл в котором списко стран

const bot = new Telegraf(process.env.BOT_TOKEN);
// назначаем оветы на сообщение
bot.start(
  (ctx) =>
    ctx.reply(
      `Привет, ${ctx.message.from.first_name}!

`,
      Markup.keyboard([
        //кнопки
        ['Ukraine ', 'Russia '],
        ['/help 🚑', '/start ⏯'],
      ])
        .resize()
        .extra()
    )
  // console.log('User:' + message.from.first_name + ' start the chat')//  отслеживаем какой юзер кликнул тоесть зашел в бот
);

//reaction on hello
// bot.on('text', (ctx) => {
//   if (ctx.message.from == 'Hello') {
//     ctx.reply('Привет, ' + ctx.message.from.first_name);
//   }
// });

bot.help((ctx) =>
  ctx.reply('Здесь можешь просмотреть список доступных стран ' + ' ' + countryName)
);
bot.on('sticker', async (ctx) =>
  ctx.reply('Мне очень нравится это стикер, но нужно названия страны  ,можешь воспользоватся /help')
);

bot.on('text', async (ctx) => {
  let data = {};
  try {
    data = await api.getReportsByCountries(ctx.message.text);

    const FormatData = `
    // Age:${data[0][0].fatalityRateByAge}

Страна:${data[0][0].country}
Случаи:${data[0][0].cases}
Смеpти:${data[0][0].deaths}
Вылечено:${data[0][0].recovered}

  `;
    console.log('Success type');

    ctx.reply(FormatData);
  } catch {
    console.log('type error');
    ctx.reply(
      `${ctx.message.from.first_name}, название страны указано неверно или данной страны, пока что, нет в списке ;-) ! `
    );
  }
});

bot.launch();

// this is the console log
console.log('Bot started');
// console.log(ctx.message.text);
