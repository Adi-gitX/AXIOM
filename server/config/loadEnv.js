import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

let hasLoaded = false;

const parseEnvFile = (filepath) => {
    const content = fs.readFileSync(filepath, 'utf8');
    const lines = content.split(/\r?\n/);

    for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line || line.startsWith('#')) continue;

        const match = line.match(/^([\w.-]+)\s*=\s*(.*)$/);
        if (!match) continue;

        const [, key, rawValue] = match;

        if (process.env[key] !== undefined) continue;

        let value = rawValue.trim();
        if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
        ) {
            value = value.slice(1, -1);
        }

        process.env[key] = value.replace(/\\n/g, '\n');
    }
};

export const loadEnv = () => {
    if (hasLoaded) return;
    hasLoaded = true;

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const serverRoot = path.join(__dirname, '..');

    const candidates = [
        path.join(serverRoot, '.env'),
        path.join(process.cwd(), '.env'),
    ];

    const seen = new Set();
    for (const file of candidates) {
        if (!file || seen.has(file)) continue;
        seen.add(file);
        if (fs.existsSync(file)) {
            parseEnvFile(file);
        }
    }
};

export default loadEnv;
