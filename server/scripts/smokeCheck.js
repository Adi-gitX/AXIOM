import {
    createOrGetUser,
    updateUserProfile,
    getPublicProfile,
    getAtsScore,
} from '../controllers/userController.js';
import {
    getDsaCatalog,
    getUserProgress,
    toggleProblem,
    getActivityHeatmap,
    getDashboardStats,
    getDailyFocus,
    getProblemMetaForUser,
    upsertProblemMetaForUser,
    getReviewToday,
    completeProblemReview,
} from '../controllers/progressController.js';
import { getInterviewResources, setInterviewResourceCompletion, getInterviewProgress } from '../controllers/interviewController.js';
import {
    getChannels,
    sendMessage,
    getMessages,
    createChannel,
    getChannelMembers,
    inviteChannelMember,
    removeChannelMember,
} from '../controllers/chatController.js';
import { getAllJobs } from '../controllers/jobsController.js';
import { createPost, voteOnPost, addComment, getAllPosts } from '../controllers/postsController.js';
import { getEducationCatalog, getEducationProgress } from '../controllers/educationController.js';
import { query } from '../config/db.js';
import {
    getMyContributions,
    getConnectedGithubProfile,
    getIssueRecommendation,
    getSyncStatus,
} from '../controllers/ossController.js';
import {
    getGsocTimeline,
    getGsocOrgs,
    getGsocReadiness,
    getReminderState,
    dismissReminder,
    restoreReminder,
} from '../controllers/gsocController.js';

const email = `smoke-${Date.now()}@example.com`;
const username = `smokeuser${Date.now()}`;

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

const invokeExpectStatus = async (label, handler, expectedStatus, req = {}) => {
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

    await handler({ params: {}, query: {}, body: {}, ...req }, res);
    const ok = result.statusCode === expectedStatus;
    const symbol = ok ? '✅' : '❌';
    console.log(`${symbol} ${label} -> ${result.statusCode}`);
    if (!ok) {
        throw new Error(`${label} expected ${expectedStatus}, got ${result.statusCode}`);
    }
    return result;
};

const FIREBASE_LOOKUP_PREFIX = 'https://identitytoolkit.googleapis.com/v1/accounts:lookup';

const requestJson = async (baseUrl, path, options = {}, fetchImpl = fetch) => {
    const response = await fetchImpl(`${baseUrl}${path}`, options);
    let body = null;
    try {
        body = await response.json();
    } catch {
        body = null;
    }
    return {
        status: response.status,
        body,
    };
};

const runRouteAuthSmoke = async () => {
    const originalFetch = global.fetch;
    if (typeof originalFetch !== 'function') {
        throw new Error('Global fetch is required for route smoke checks');
    }

    const previousEnv = {
        ALLOW_UNAUTHENTICATED_DEV: process.env.ALLOW_UNAUTHENTICATED_DEV,
        FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
        DISABLE_HTTP_LISTEN: process.env.DISABLE_HTTP_LISTEN,
    };

    let server = null;

    try {
        process.env.DISABLE_HTTP_LISTEN = 'true';
        process.env.FIREBASE_API_KEY = process.env.FIREBASE_API_KEY || 'smoke-firebase-api-key';
        process.env.ALLOW_UNAUTHENTICATED_DEV = 'false';

        global.fetch = async (input, init = {}) => {
            const url = typeof input === 'string'
                ? input
                : String(input?.url || '');

            if (url.startsWith(FIREBASE_LOOKUP_PREFIX)) {
                const parsedBody = (() => {
                    try {
                        return JSON.parse(String(init?.body || '{}'));
                    } catch {
                        return {};
                    }
                })();

                const idToken = String(parsedBody?.idToken || '');
                if (idToken === 'smoke-valid-token') {
                    return {
                        ok: true,
                        status: 200,
                        json: async () => ({ users: [{ email: 'auth-smoke@example.com' }] }),
                        text: async () => JSON.stringify({ users: [{ email: 'auth-smoke@example.com' }] }),
                    };
                }

                return {
                    ok: false,
                    status: 400,
                    json: async () => ({ error: { message: 'INVALID_ID_TOKEN' } }),
                    text: async () => JSON.stringify({ error: { message: 'INVALID_ID_TOKEN' } }),
                };
            }

            return originalFetch(input, init);
        };

        const { default: app } = await import('../index.js');
        try {
            server = await new Promise((resolve, reject) => {
                const listener = app.listen(0, () => resolve(listener));
                listener.on('error', reject);
            });
        } catch (listenErr) {
            if (listenErr?.code === 'EPERM' || listenErr?.code === 'EACCES') {
                console.warn('⚠️ route.auth checks skipped (sandbox does not allow binding a local port).');
                return;
            }
            throw listenErr;
        }

        const port = server.address()?.port;
        if (!Number.isFinite(port)) {
            console.warn('⚠️ route.auth checks skipped (sandbox did not provide a bindable local port).');
            return;
        }
        const base = `http://127.0.0.1:${port}`;
        const tokenEmail = 'auth-smoke@example.com';

        const missingToken = await requestJson(
            base,
            `/api/chat/channels?email=${encodeURIComponent(tokenEmail)}`,
            {},
            originalFetch
        );
        assert(missingToken.status === 401, `Expected 401 for missing token, got ${missingToken.status}`);
        console.log(`✅ route.auth.missingToken -> ${missingToken.status}`);

        const mismatch = await requestJson(
            base,
            `/api/chat/channels?email=${encodeURIComponent('different@example.com')}`,
            {
                headers: {
                    Authorization: 'Bearer smoke-valid-token',
                },
            },
            originalFetch
        );
        assert(mismatch.status === 403, `Expected 403 for email/token mismatch, got ${mismatch.status}`);
        console.log(`✅ route.auth.mismatch -> ${mismatch.status}`);

        const validToken = await requestJson(
            base,
            `/api/chat/channels?email=${encodeURIComponent(tokenEmail)}`,
            {
                headers: {
                    Authorization: 'Bearer smoke-valid-token',
                },
            },
            originalFetch
        );
        assert(validToken.status === 200, `Expected 200 for valid token path, got ${validToken.status}`);
        assert(Array.isArray(validToken.body?.channels), 'Expected channels array for valid token path');
        console.log(`✅ route.auth.validToken -> ${validToken.status}`);

        process.env.ALLOW_UNAUTHENTICATED_DEV = 'true';
        const bypass = await requestJson(
            base,
            `/api/chat/channels?email=${encodeURIComponent(tokenEmail)}`,
            {},
            originalFetch
        );
        assert(bypass.status === 200, `Expected 200 for dev bypass path, got ${bypass.status}`);
        console.log(`✅ route.auth.devBypass -> ${bypass.status}`);
    } finally {
        if (server) {
            await new Promise((resolve) => server.close(resolve));
        }
        global.fetch = originalFetch;

        if (previousEnv.ALLOW_UNAUTHENTICATED_DEV === undefined) {
            delete process.env.ALLOW_UNAUTHENTICATED_DEV;
        } else {
            process.env.ALLOW_UNAUTHENTICATED_DEV = previousEnv.ALLOW_UNAUTHENTICATED_DEV;
        }

        if (previousEnv.FIREBASE_API_KEY === undefined) {
            delete process.env.FIREBASE_API_KEY;
        } else {
            process.env.FIREBASE_API_KEY = previousEnv.FIREBASE_API_KEY;
        }

        if (previousEnv.DISABLE_HTTP_LISTEN === undefined) {
            delete process.env.DISABLE_HTTP_LISTEN;
        } else {
            process.env.DISABLE_HTTP_LISTEN = previousEnv.DISABLE_HTTP_LISTEN;
        }
    }
};

const run = async () => {
    try {
        await invoke('createOrGetUser', createOrGetUser, { body: { email, name: 'Smoke User' } });
        await invoke('updateUserProfile', updateUserProfile, {
            body: {
                email,
                name: 'Smoke User',
                username,
                role: 'Engineer',
                location: 'Remote',
                bio: 'Smoke profile',
                experience: [],
                skills: ['JavaScript'],
                socials: [],
            },
        });
        await runRouteAuthSmoke();

        await invoke('users.getPublicProfile', getPublicProfile, { params: { username } });
        await invoke('users.getAtsScore', getAtsScore, { params: { email } });

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

        await invoke('progress.getDailyFocus', getDailyFocus, {
            params: { email },
            query: { limit: '3', tz: 'Asia/Kolkata' },
        });

        const metaFirst = await invoke('progress.upsertProblemMeta.first', upsertProblemMetaForUser, {
            body: {
                email,
                problemId: canonicalId,
                timeSpentMinutes: 35,
                attempts: 1,
                notes: 'First solve',
                reviewIntervalDays: 2,
                tz: 'Asia/Kolkata',
            },
        });
        assert(metaFirst.body?.timeDeltaMinutes === 35, 'first meta save should add full time delta');

        const metaSecond = await invoke('progress.upsertProblemMeta.second', upsertProblemMetaForUser, {
            body: {
                email,
                problemId: canonicalId,
                timeSpentMinutes: 50,
                attempts: 2,
                notes: 'Second pass',
                reviewIntervalDays: 3,
                tz: 'Asia/Kolkata',
            },
        });
        assert(metaSecond.body?.timeDeltaMinutes === 15, 'second meta save should return delta from previous');

        const metaRead = await invoke('progress.getProblemMetaForUser', getProblemMetaForUser, {
            params: { email },
        });
        assert(metaRead.body?.metaByProblemId?.[canonicalId], 'problem meta should be readable after upsert');

        await invoke('progress.completeProblemReview', completeProblemReview, {
            body: {
                email,
                problemId: canonicalId,
                rating: 'good',
                tz: 'Asia/Kolkata',
            },
        });

        await invoke('progress.getReviewToday', getReviewToday, {
            params: { email },
            query: {
                limit: '25',
                daysAhead: '7',
                tz: 'Asia/Kolkata',
            },
        });

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

        await query('UPDATE users SET is_pro = 1 WHERE email = $1', [email]);
        const privateChannelName = `Smoke Private ${Date.now()}`;
        const privateChannel = await invoke('chat.createChannel.private', createChannel, {
            body: {
                email,
                name: privateChannelName,
                description: 'Smoke private room',
                isPrivate: true,
            },
            authEmail: email,
        });
        const privateChannelId = privateChannel.body?.channel?.id;
        assert(privateChannelId, 'private room should be created');

        const roomMemberEmail = `smoke-member-${Date.now()}@example.com`;
        await invoke('users.createOrGet.member', createOrGetUser, {
            body: { email: roomMemberEmail, name: 'Smoke Room Member' },
        });

        await invoke('chat.inviteChannelMember', inviteChannelMember, {
            params: { channelId: privateChannelId },
            body: { email, memberEmail: roomMemberEmail },
            authEmail: email,
        });
        await invoke('chat.getChannelMembers', getChannelMembers, {
            params: { channelId: privateChannelId },
            query: { email },
            authEmail: email,
        });

        await invoke('chat.sendMessage.private.owner', sendMessage, {
            body: { email, channelId: privateChannelId, content: 'Owner smoke message' },
            authEmail: email,
        });
        await invoke('chat.sendMessage.private.member', sendMessage, {
            body: { email: roomMemberEmail, channelId: privateChannelId, content: 'Member smoke message' },
            authEmail: roomMemberEmail,
        });
        const outsiderEmail = `smoke-outsider-${Date.now()}@example.com`;
        await invokeExpectStatus('chat.sendMessage.private.nonMemberDenied', sendMessage, 403, {
            body: { email: outsiderEmail, channelId: privateChannelId, content: 'No access' },
            authEmail: outsiderEmail,
        });

        await invoke('chat.removeChannelMember', removeChannelMember, {
            params: { channelId: privateChannelId },
            body: { email, memberEmail: roomMemberEmail },
            authEmail: email,
        });
        await invokeExpectStatus('chat.sendMessage.private.removedMemberDenied', sendMessage, 403, {
            body: { email: roomMemberEmail, channelId: privateChannelId, content: 'Should fail after removal' },
            authEmail: roomMemberEmail,
        });

        await invoke('jobs.getAllJobs', getAllJobs, { query: { email, limit: '5' } });

        const ossSummary = await invoke('oss.getMyContributions.disconnected', getMyContributions, {
            params: { email },
        });
        assert(ossSummary.body?.connected === false, 'new smoke user should not have github connected');
        await invoke('oss.getConnectedGithubProfile', getConnectedGithubProfile, {
            params: { email },
        });
        await invoke('oss.getIssueRecommendation', getIssueRecommendation, {
            params: { email },
        });
        await invoke('oss.getSyncStatus', getSyncStatus, {
            params: { email },
        });

        await invoke('gsoc.getGsocTimeline', getGsocTimeline);
        await invoke('gsoc.getGsocOrgs', getGsocOrgs, { query: { difficulty: 'Beginner' } });
        await invoke('gsoc.getGsocReadiness', getGsocReadiness, { params: { email } });

        const reminders = await invoke('gsoc.getReminderState', getReminderState, {
            params: { email },
            query: { includeDismissed: 'true' },
        });
        assert(Array.isArray(reminders.body?.active), 'gsoc reminders should return active array');
        assert(Array.isArray(reminders.body?.dismissed), 'gsoc reminders should return dismissed array');

        const firstReminderId = reminders.body?.active?.[0]?.id;
        if (firstReminderId) {
            await invoke('gsoc.dismissReminder', dismissReminder, {
                body: { email, milestoneId: firstReminderId },
            });
            await invoke('gsoc.restoreReminder', restoreReminder, {
                body: { email, milestoneId: firstReminderId },
            });
        }

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
        console.error('❌ Smoke check failed:', err?.message || err);
        if (err?.stack) {
            console.error(err.stack);
        }
        process.exit(1);
    }
};

run();
