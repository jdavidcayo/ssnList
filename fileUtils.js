import * as fs from 'node:fs/promises';
import * as fsSync from 'node:fs';

// export const obj2arrOfBrokers = (data) => {
//   const arrData = [];
//   data.forEach(el => arrData.push(Object.values(el)));
//   return arrData;
// };

// export const sortBrokersData = (arrOfBrokers) => {
//   const sorted = [];
//   arrOfBrokers.forEach((broker) => {
//     const order = [5, 0, 4, 1, 2, 3]; // El orden deseado
//     const sortedData = order.map(index => broker[index]);
//     sorted.push(sortedData);
//   });
//   return sorted;
// };

export const init = (nombreArchivo = 'salida.txt') => {
  const header = [['MATRICULA', 'NOMBRE', 'ALTA', 'PROVINCIA', 'TELEFONO', 'EMAIL']];
  if (!fsSync.existsSync(nombreArchivo)) {
    write(header.join(',') + '\n');
  }
};

export const getLastMat = async (nombreArchivo = 'salida.txt') => {
  const texto = await fs.readFile(nombreArchivo, { encoding: 'utf8' });
  const arr = texto.split('\n');
  return parseInt(arr[arr.length - 2].split(',').reverse().pop());
};

export const arrayToCSVFormat = data => {
  const formattedArray = [];
  data.forEach(row => {
    const formattedRow = row.map(item => item.replace(',', ' ')).join(',');
    formattedArray.push(formattedRow);
  });
  return formattedArray.join('\n');
};

export const write = (formattedText, nombreArchivo = 'salida.txt') => {
  fs.writeFile(nombreArchivo, formattedText, { flag: 'a' })
    .then(() => {
      console.log('Datos escritos en el archivo.');
    })
    .catch(error => console.log(error));
};