const fs = require('node:fs/promises');
const fsSync = require('node:fs');

const init = (nombreArchivo = 'salida.txt') => {
  const header = [['MATRICULA', 'NOMBRE', 'ALTA', 'PROVINCIA', 'TELEFONO', 'EMAIL']];
  if (!fsSync.existsSync(nombreArchivo)) {
    write(header.join(',') + '\n');
  }
};

const writeBr = async (nombreArchivo = 'salida.txt') => {
  await fs.writeFile(nombreArchivo, '\n', { flag: 'a' });
};
const getLastMat = async (nombreArchivo = 'salida.txt') => {
  const texto = await fs.readFile(nombreArchivo, { encoding: 'utf8' });
  const arr = texto.split('\n');
  return parseInt(arr[arr.length - 2].split(',').reverse().pop());
};

const arrayToCSVFormat = data => {
  const formattedArray = [];
  data.forEach(row => {
    const formattedRow = row.map(item => item.replace(',', ' ')).join(',');
    formattedArray.push(formattedRow);
  });
  return formattedArray.join('\n');
};

const write = (formattedText, nombreArchivo = 'salida.txt') => {
  fs.writeFile(nombreArchivo, formattedText, { flag: 'a' })
    .then(() => {
      console.log('Datos escritos en el archivo.');
    })
    .catch(error => console.log(error));
};

module.exports = {
  write,
  arrayToCSVFormat,
  getLastMat,
  init,
  writeBr
};
