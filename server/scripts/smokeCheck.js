import { createOrGetUser, updateUserProfile } from '../controllers/userController.js';
import {
    getDsaCatalog,
    getUserProgress,
    toggleProblem,
    getActivityHeatmap,
    getDashboardStats,
} from '../controllers/progressController.js';
import { getInterviewResources, setInterviewResourceCompletion, getInterviewProgress } from '../controllers/interviewController.js';
import { getChannels, sendMessage, getMessages } from '../controllers/chatController.js';
import { getAllJobs } from '../controllers/jobsController.js';
import { createPost, voteOnPost, addComment, getAllPosts } from '../controllers/postsController.js';
import { getEducationCatalog, getEducationProgress } from '../controllers/educationController.js';

const email = `smoke-${Date.now()}@example.com`;

const assert = (condition, message) => {
    if (!condition) {
        throw new Error(message);
    }
};

const invoke = async (label, handler, req = {}) => {
    const result = { statusCode: 200, body: null };
    const res = {
        status(code) {
            result.statusCode = code;
            return this;
        },
        json(payload) {
            result.body = payload;
            return this;
        },
    };

    try {
        await handler({ params: {}, query: {}, body: {}, ...req }, res);
        const ok = result.statusCode >= 200 && result.statusCode < 300;
        const bodyShape = Array.isArray(result.body)
            ? `array(${result.body.length})`
            : (result.body && typeof result.body === 'object'
                ? Object.keys(result.body).slice(0, 6).join(', ')
                : String(result.body));

        const symbol = ok ? '✅' : '❌';
        console.log(`${symbol} ${label} -> ${result.statusCode} (${bodyShape})`);
        if (!ok) {
            throw new Error(`${label} failed with ${result.statusCode}`);
        }
        return result;
    } catch (err) {
        console.error(`❌ ${label} crashed:`, err.message);
        throw err;
    }
};

const run = async () => {
    try {
        await invoke('createOrGetUser', createOrGetUser, { body: { email, name: 'Smoke User' } });
        await invoke('updateUserProfile', updateUserProfile, {
            body: {
                email,
                name: 'Smoke User',
                role: 'Engineer',
                location: 'Remote',
                bio: 'Smoke profile',
                experience: [],
                skills: ['JavaScript'],
                socials: [],
            },
        });

        const catalog = await invoke('progress.getDsaCatalog', getDsaCatalog);
        assert(Array.isArray(catalog.body?.sheets), 'catalog.sheets must be present');
        assert(catalog.body?.totalProblems === 1096, `catalog.totalProblems expected 1096, got ${catalog.body?.totalProblems}`);

        await invoke('progress.getUserProgress', getUserProgress, { params: { email } });

        const canonicalId = 'striverSDE:0:0';
        const legacyId = 'a1';
        await invoke('progress.toggleProblem.canonical', toggleProblem, {
            body: { email, problemId: canonicalId, topicId: 201 },
        });

        const afterCanonicalSolve = await invoke('progress.getUserProgress.afterCanonical', getUserProgress, {
            params: { email },
        });
        assert(
            afterCanonicalSolve.body?.solvedProblems?.includes(canonicalId),
            'canonical toggle should save canonical problem id'
        );

        const unsolveViaLegacy = await invoke('progress.toggleProblem.legacyUnsolve', toggleProblem, {
            body: { email, problemId: legacyId },
        });
        assert(unsolveViaLegacy.body?.solved === false, 'legacy toggle should unsolve when canonical exists');

        const afterLegacyUnsolve = await invoke('progress.getUserProgress.afterLegacyUnsolve', getUserProgress, {
            params: { email },
        });
        assert(
            !afterLegacyUnsolve.body?.solvedProblems?.includes(canonicalId),
            'legacy unsolve should remove canonical solved state'
        );

        await invoke('progress.toggleProblem.legacySolve', toggleProblem, {
            body: { email, problemId: legacyId },
        });

        const afterLegacySolve = await invoke('progress.getUserProgress.afterLegacySolve', getUserProgress, {
            params: { email },
        });
        const canonicalCount = (afterLegacySolve.body?.solvedProblems || []).filter((id) => id === canonicalId).length;
        assert(canonicalCount === 1, `canonical id should appear once, got ${canonicalCount}`);
        assert(
            !(afterLegacySolve.body?.solvedProblems || []).includes(legacyId),
            'response solvedProblems should not expose legacy ids'
        );

        const heatmap = await invoke('progress.getActivityHeatmap', getActivityHeatmap, {
            params: { email },
            query: { days: '365', tz: 'Asia/Kolkata' },
        });
        assert(heatmap.body?.timezone === 'Asia/Kolkata', 'heatmap should echo requested timezone');
        assert(Array.isArray(heatmap.body?.rows), 'heatmap rows should be an array');
        assert(typeof heatmap.body?.from === 'string', 'heatmap.from should be a date key');
        assert(typeof heatmap.body?.to === 'string', 'heatmap.to should be a date key');

        await invoke('progress.toggleProblem.cleanup', toggleProblem, {
            body: { email, problemId: canonicalId, topicId: 201 },
        });

        await invoke('progress.getDashboardStats', getDashboardStats, { params: { email } });

        await invoke('education.getEducationCatalog', getEducationCatalog);
        await invoke('education.getEducationProgress', getEducationProgress, { params: { email } });

        await invoke('interview.getInterviewResources', getInterviewResources, { query: { email } });
        await invoke('interview.setInterviewResourceCompletion', setInterviewResourceCompletion, {
            params: { id: '1' },
            body: { email, completed: true },
        });
        await invoke('interview.getInterviewProgress', getInterviewProgress, { params: { email } });

        await invoke('chat.getChannels', getChannels);
        await invoke('chat.sendMessage', sendMessage, {
            body: { email, channelId: 'general', content: 'smoke check message' },
        });
        await invoke('chat.getMessages', getMessages, {
            params: { channelId: 'general' },
            query: { limit: '5' },
        });

        await invoke('jobs.getAllJobs', getAllJobs, { query: { email, limit: '5' } });

        const createdPost = await invoke('posts.createPost', createPost, {
            body: { email, title: 'Smoke post', content: 'Smoke content' },
        });
        const postId = createdPost.body?.id;
        if (postId) {
            await invoke('posts.voteOnPost', voteOnPost, {
                params: { id: String(postId) },
                body: { email, voteType: 'up' },
            });
            await invoke('posts.addComment', addComment, {
                params: { id: String(postId) },
                body: { email, content: 'Smoke comment' },
            });
        }
        await invoke('posts.getAllPosts', getAllPosts, { query: { email, limit: '5', sort: 'recent' } });

        console.log('🎉 Smoke check passed');
    } catch (err) {
        console.error('❌ Smoke check failed');
        process.exit(1);
    }
};

run();
