import * as path from 'path';

export const TEST_FOLDER = './tests';
export const PARSER_FOLDER = 'parser';
export const SOURCE_FOLDER = 'source';
export const getTestFilePath = (suiteFolder: string, sourceFolder: string, filename: string): string => {
    return path.join(suiteFolder, sourceFolder, filename);
};