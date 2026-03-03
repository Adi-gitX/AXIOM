import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_DIR = '/Users/kammatiaditya/Downloads/450dsa-main/src';
const OUTPUT_PATH = path.join(__dirname, '..', 'data', 'dsaCatalog.generated.js');

const SOURCES = [
    {
        sheetId: 'love450',
        name: 'Love Babbar 450',
        topicOffset: 0,
        fileName: '450DSAFinal.js',
        topicNameKey: 'topicName',
        questionListKey: 'questions',
        titleKey: 'Problem',
        externalUrlKey: 'URL',
        solutionUrlKey: null,
    },
    {
        sheetId: 'striverA2Z',
        name: 'Striver A2Z',
        topicOffset: 100,
        fileName: 'StriverDSAData.js',
        topicNameKey: 'topicName',
        questionListKey: 'questions',
        titleKey: 'Problem',
        externalUrlKey: 'URL',
        solutionUrlKey: null,
    },
    {
        sheetId: 'striverSDE',
        name: 'Striver SDE',
        topicOffset: 200,
        fileName: 'STriverSDEData.js',
        topicNameKey: 'topicName',
        questionListKey: 'questions',
        titleKey: 'Question',
        externalUrlKey: 'Question_link',
        solutionUrlKey: 'Solution_link',
    },
];

const EXPECTED_TOTALS = {
    sheets: 3,
    topics: 99,
    problems: 1096,
};

const extractDataArray = (code, filePath) => {
    const match = code.match(/const\s+data\s*=\s*(\[[\s\S]*?\]);\s*(?:\/\/[^\n]*\n\s*)*export\s+default\s+data\s*;?/m);
    if (!match) {
        throw new Error(`Could not parse data array in ${filePath}`);
    }
    return Function(`"use strict"; return (${match[1]});`)();
};

const inferDifficulty = (topicName) => {
    const name = String(topicName || '').toLowerCase();
    if (name.includes('[easy]')) return 'Easy';
    if (name.includes('[medium]')) return 'Medium';
    if (name.includes('[hard]')) return 'Hard';
    return 'Unknown';
};

const detectSourcePlatform = (url) => {
    const value = String(url || '').toLowerCase();
    if (value.includes('leetcode.com')) return 'leetcode';
    if (value.includes('geeksforgeeks.org') || value.includes('practice.geeksforgeeks.org')) return 'geeksforgeeks';
    if (value.includes('interviewbit.com')) return 'interviewbit';
    return 'other';
};

const normalizeValue = (value) => String(value || '').trim();

const buildSheet = (source) => {
    const filePath = path.join(SOURCE_DIR, source.fileName);
    const text = fs.readFileSync(filePath, 'utf8');
    const rawTopics = extractDataArray(text, filePath);

    return {
        id: source.sheetId,
        name: source.name,
        totalTopics: rawTopics.length,
        totalProblems: rawTopics.reduce((sum, topic) => {
            const questions = Array.isArray(topic[source.questionListKey]) ? topic[source.questionListKey] : [];
            return sum + questions.length;
        }, 0),
        topics: rawTopics.map((rawTopic, topicIndex) => {
            const topicName = normalizeValue(rawTopic[source.topicNameKey]) || `Topic ${topicIndex + 1}`;
            const questions = Array.isArray(rawTopic[source.questionListKey]) ? rawTopic[source.questionListKey] : [];

            return {
                id: source.topicOffset + topicIndex + 1,
                sheetId: source.sheetId,
                name: topicName,
                position: topicIndex,
                total: questions.length,
                problems: questions.map((question, questionIndex) => {
                    const title = normalizeValue(question[source.titleKey]) || `Problem ${questionIndex + 1}`;
                    const externalUrl = normalizeValue(question[source.externalUrlKey]);
                    const solutionUrl = source.solutionUrlKey ? normalizeValue(question[source.solutionUrlKey]) : '';

                    return {
                        id: `${source.sheetId}:${topicIndex}:${questionIndex}`,
                        title,
                        difficulty: inferDifficulty(topicName),
                        external_url: externalUrl,
                        solution_url: solutionUrl,
                        source_platform: detectSourcePlatform(externalUrl),
                    };
                }),
            };
        }),
    };
};

const buildCatalog = () => {
    const sheets = SOURCES.map(buildSheet);

    const allProblems = [];
    for (const sheet of sheets) {
        for (const topic of sheet.topics) {
            for (const problem of topic.problems) {
                allProblems.push(problem);
            }
        }
    }

    const problemIds = new Set();
    for (const problem of allProblems) {
        if (problemIds.has(problem.id)) {
            throw new Error(`Duplicate problem id detected: ${problem.id}`);
        }
        problemIds.add(problem.id);

        if (!problem.external_url) {
            throw new Error(`Missing external_url for problem: ${problem.id}`);
        }
    }

    const totalTopics = sheets.reduce((sum, sheet) => sum + sheet.totalTopics, 0);
    const totalProblems = sheets.reduce((sum, sheet) => sum + sheet.totalProblems, 0);

    if (sheets.length !== EXPECTED_TOTALS.sheets) {
        throw new Error(`Expected ${EXPECTED_TOTALS.sheets} sheets, got ${sheets.length}`);
    }
    if (totalTopics !== EXPECTED_TOTALS.topics) {
        throw new Error(`Expected ${EXPECTED_TOTALS.topics} topics, got ${totalTopics}`);
    }
    if (totalProblems !== EXPECTED_TOTALS.problems) {
        throw new Error(`Expected ${EXPECTED_TOTALS.problems} problems, got ${totalProblems}`);
    }

    return { sheets, totalTopics, totalProblems };
};

const writeOutput = ({ sheets, totalTopics, totalProblems }) => {
    const sheetsJson = JSON.stringify(sheets, null, 4);

    const output = `// AUTO-GENERATED FILE. DO NOT EDIT MANUALLY.\n// Source: /Users/kammatiaditya/Downloads/450dsa-main\n\nexport const DSA_SHEETS = ${sheetsJson};\n\nexport const DSA_TOTAL_TOPICS = ${totalTopics};\nexport const DSA_TOTAL_PROBLEMS = ${totalProblems};\n\nexport default DSA_SHEETS;\n`;

    fs.writeFileSync(OUTPUT_PATH, output, 'utf8');
};

const main = () => {
    const catalog = buildCatalog();
    writeOutput(catalog);

    console.log('✅ DSA catalog generated');
    console.log(`   Output: ${OUTPUT_PATH}`);
    console.log(`   Sheets: ${catalog.sheets.length}`);
    console.log(`   Topics: ${catalog.totalTopics}`);
    console.log(`   Problems: ${catalog.totalProblems}`);
};

main();
