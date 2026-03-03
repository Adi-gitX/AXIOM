export const DSA_TOPICS = [
    {
        id: 1,
        name: 'Arrays',
        total: 6,
        problems: [
            { id: 'a1', title: 'Set Matrix Zeroes', difficulty: 'Medium', external_url: '' },
            { id: 'a2', title: "Pascal's Triangle", difficulty: 'Easy', external_url: '' },
            { id: 'a3', title: 'Next Permutation', difficulty: 'Medium', external_url: '' },
            { id: 'a4', title: "Kadane's Algorithm", difficulty: 'Medium', external_url: '' },
            { id: 'a5', title: 'Sort Colors', difficulty: 'Medium', external_url: '' },
            { id: 'a6', title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', external_url: '' },
        ],
    },
    {
        id: 2,
        name: 'Linked List',
        total: 5,
        problems: [
            { id: 'l1', title: 'Reverse Linked List', difficulty: 'Easy', external_url: '' },
            { id: 'l2', title: 'Middle of Linked List', difficulty: 'Easy', external_url: '' },
            { id: 'l3', title: 'Merge Two Sorted Lists', difficulty: 'Easy', external_url: '' },
            { id: 'l4', title: 'Remove N-th node from back', difficulty: 'Medium', external_url: '' },
            { id: 'l5', title: 'Add Two Numbers', difficulty: 'Medium', external_url: '' },
        ],
    },
    {
        id: 3,
        name: 'Greedy Algorithms',
        total: 4,
        problems: [
            { id: 'g1', title: 'N Meetings in One Room', difficulty: 'Easy', external_url: '' },
            { id: 'g2', title: 'Minimum Platforms', difficulty: 'Medium', external_url: '' },
            { id: 'g3', title: 'Job Sequencing Problem', difficulty: 'Medium', external_url: '' },
            { id: 'g4', title: 'Fractional Knapsack', difficulty: 'Medium', external_url: '' },
        ],
    },
    {
        id: 4,
        name: 'Recursion',
        total: 3,
        problems: [
            { id: 'r1', title: 'Subset Sums', difficulty: 'Medium', external_url: '' },
            { id: 'r2', title: 'Subset II', difficulty: 'Medium', external_url: '' },
            { id: 'r3', title: 'Combination Sum', difficulty: 'Medium', external_url: '' },
        ],
    },
];

export const DSA_TOTAL_PROBLEMS = DSA_TOPICS.reduce((sum, topic) => sum + topic.total, 0);

export default DSA_TOPICS;
