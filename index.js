
const http = require('http');
const yargs = require('yargs/yargs');
const apiConfig = require('./config')
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;

function parsArgv(argv) {
  return argv._[0];
}

const urlArr = [ apiConfig.apiUrl, 
                '?', 'access_key=', apiConfig.apiKey, 
                '&','query=', parsArgv(argv)
              ]

http.get(urlArr.join(''), (res) => {
    const {statusCode} = res;
    if (statusCode !== 200){
        console.log(`statusCode: ${statusCode}`)
        return
    }
    res.setEncoding('utf8')
    let rowData = '';
    res.on('data', (chunk) => rowData += chunk)
    res.on('end', () => {
        let parseData = JSON.parse(rowData)
        if (!parseData.error) return console.log('Погода в городе: ',parseData);
        console.error('В запросе ошибка (возможно, ошибка в названии города): ',parseData)
    })
})
.on('error', (err) => {
    console.error('Что-то пошло не так и возникла ошибка: ',err)
})