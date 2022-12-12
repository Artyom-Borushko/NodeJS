import { pipeline } from 'node:stream'
import fs from 'node:fs';
import csvToJSON from 'csvtojson';
import path from 'node:path';
const fsPromises = fs.promises;


const outputFolderPath = path.join('./output');
const outputFilePath = path.join(outputFolderPath, 'convertedCSV.txt');
const csvFilePath = path.resolve('src/assets/csv', 'CSVExample.csv');
const csvDelimiter = ';';


async function createFolder(path) {
    try {
        await fsPromises.mkdir(path, { recursive: true })
    } catch (error) {
        console.error('Error creating folder', error.message);
    }
}

async function csvToTxtPipeline() {
    await createFolder(outputFolderPath);
    pipeline(
        fs.createReadStream(csvFilePath),
        csvToJSON({ delimiter: csvDelimiter }),
        fs.createWriteStream(outputFilePath),
        (error) => {
            if (error) {
                console.error('csv to JSON pipeline failed', error.message);
            } else {
                console.info('csv to JSON pipeline succeeded');
            }
        }
    );
}

await csvToTxtPipeline();
