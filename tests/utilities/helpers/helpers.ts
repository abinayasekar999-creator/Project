import * as fs from 'fs';
import * as path from 'path';

export class Helpers {

    static readJSON(filePath: string) {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    }

    static writeJSON(filePath: string, data: any) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    }
}
export default Helpers;