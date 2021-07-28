import axios from 'axios'
import { Products } from '../services/scrapper/scraper.js'
import * as Scraper from './ScraperController.js'


var url = ''

export const init = async (update) => {

    const url = `https://api.telegram.org/bot1281036016:AAEJlZzQfiZ0sCOxH3Hcz1_kFKatQMb1dOU`

    var markets = ['amazon','mercado_livre','magalu']


    if(!update.message.text) {
        var send = await sendMessage({
            text: `
                Me desculpe. Eu ainda só consigo entender textos. 😔 \nMas em breve virão novidades aí 😃 \n\n Enquanto isso, digita aí o que você procura, eu busco pra você 🧐
            `,
            parse_mode: 'HTML',
            chat_id: update.message.chat.id
        })

        return
    }

    if(update.message.text == '/start' || update.message.text == 'start') {
        var send = await sendMessage({
            text: `
                Olá, eu sou o <b>Market Bot</b> 🤖.\n\nAo inves de perder tempo - e abrindo abas - buscando seu produto pelos market places à fora, deixa que eu faço isso por você.\n\nComo? é simples, basta me enviar uma mensagem falando pelo que você está buscando. Ex: "iphone", "Xbox","bicicleta" etc, que eu busco pra voĉe pelo menos três produtos em cada um dos market places mais conhecidos atualmente.\n\n E aí, pelo que você procura?
            `,
            parse_mode: 'HTML',
            chat_id: update.message.chat.id
        })

        return
    }


    var search = update.message.text

    var send = await sendMessage({
        text: "Certo. Me da um tempinho ai que ja volto com os resultados.",
        chat_id: update.message.chat.id,
        reply_to_message_id: update.message.message_id
    })

    if(send.status == 200) {

        markets.map(async market => {

            const marketPlace = market.replace('_', ' ').toUpperCase()

            var produtos:Array<Products> = await Scraper.scrapPage({
                search,
                market,
                pages: 1
            })

            if(produtos.length == 0) {
                var errorMarketSend = await axios.post(`${url}/sendMessage`, {
                    text: `Vish!!! \nParece que eu tive um probleminha com o market do <b>${marketPlace}</b>`,
                    chat_id: update.message.chat.id,
                    parse_mode: 'HTML'
                })

                return
            }
                            
            for(var i = 0; i < 5; i++) {

                const longUrl = produtos[i].link
                const shortUrl = await axios.post('https://cleanuri.com/api/v1/shorten', {
                    url: longUrl
                })

                var caption = `<b>${marketPlace}</b>\n\nModelo: <b>${produtos[i].name}</b> \n\n Preço: <b>${produtos[i].price}</b> \n\n <b>Link para o anúncio: ${shortUrl.data.result_url}</b>`

                var produtosSend = await axios.post(`${url}/sendPhoto`, {
                    photo: produtos[i].imageLink,
                    chat_id: update.message.chat.id,
                    parse_mode:'HTML',
                    caption
                })
            }

        })
    }

        
    
}

export const getUpdates = () => {

}

export const sendMessage = async (options) => {

    const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`

    return await axios.post(`${url}/sendMessage`, options)
}

export const sendPhoto = () => {

}
