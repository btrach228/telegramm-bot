require('dotenv').config();

const Telegraf = require('telegraf');
const api = require('covid19-api');
let Markup = require('telegraf/markup');
const countryName = require('./contries');

const bot = new Telegraf(process.env.bot_TOKEN);

bot.start((ctx) =>
  ctx.reply(
    `Привет, ${ctx.message.from.first_name}!

`,
    Markup.keyboard([
      ['Ukraine', 'Close'],
      ['/help', '/start'],
    ])
      .resize()
      .extra()
  )
);

bot.help((ctx) => ctx.reply('Здесь можешь просмотреть список доступных стран ' + countryName));
bot.on('sticker', async (ctx) =>
  ctx.reply('Мне очень нравится это стикер, но нужно названия страны  ,можешь воспользоватся /help')
);

bot.on('text', async (ctx) => {
  let data = {};
  try {
    data = await api.getReportsByCountries(ctx.message.text);

    const FormatData = `
Страна:${data[0][0].country}
Случаи:${data[0][0].cases}
Смеpти:${data[0][0].deaths}
Вылечено:${data[0][0].recovered}
  `;
    console.log('Success');

    ctx.reply(FormatData);
  } catch {
    console.log('ERROR');
    ctx.reply(`${ctx.message.from.first_name}, название страны указано неверно ! `);
  }
});
let close = 'node .exit';
bot.launch();

// this is the console log
console.log('Bot started');
