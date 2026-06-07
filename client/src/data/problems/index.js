/**
 * Curated DSA problem set for the AXIOM Code Lab "Solve" experience.
 *
 * Schema per problem:
 *   id            kebab-case slug (URL + storage key)
 *   title         display name
 *   difficulty    'Easy' | 'Medium' | 'Hard'
 *   topic         grouping label
 *   tags          string[]
 *   functionName  the function the user implements (same across languages)
 *   statement     short markdown-ish prompt
 *   examples      [{ input, output, explanation? }] (display only)
 *   constraints   string[]
 *   starter       { python, javascript, typescript } stub code
 *   tests         [{ name, input:{arg:val}, expected, hidden? }]
 *
 * Outputs must be deterministic so structural comparison is meaningful.
 */

export const PROBLEMS = [
    {
        id: 'two-sum',
        title: 'Two Sum',
        difficulty: 'Easy',
        topic: 'Arrays & Hashing',
        tags: ['array', 'hash map'],
        functionName: 'twoSum',
        statement:
            'Given an array of integers `nums` and an integer `target`, return the indices of the two numbers that add up to `target`.\n\nEach input has exactly one solution, and you may not use the same element twice. Return the answer with the smaller index first.',
        examples: [
            { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] = 2 + 7 = 9.' },
            { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
        ],
        constraints: ['2 ≤ nums.length ≤ 10⁴', '-10⁹ ≤ nums[i] ≤ 10⁹', 'Exactly one valid answer exists.'],
        starter: {
            python: 'def twoSum(nums, target):\n    # Return [i, j] such that nums[i] + nums[j] == target\n    pass\n',
            javascript: 'function twoSum(nums, target) {\n  // Return [i, j] such that nums[i] + nums[j] === target\n}\n',
            typescript: 'function twoSum(nums: number[], target: number): number[] {\n  // Return [i, j] such that nums[i] + nums[j] === target\n  return [];\n}\n',
        },
        tests: [
            { name: 'Example 1', input: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1] },
            { name: 'Example 2', input: { nums: [3, 2, 4], target: 6 }, expected: [1, 2] },
            { name: 'Same value', input: { nums: [3, 3], target: 6 }, expected: [0, 1] },
            { name: 'Negatives', input: { nums: [-1, -2, -3, -4, -5], target: -8 }, expected: [2, 4], hidden: true },
            { name: 'Spread', input: { nums: [0, 4, 3, 0], target: 0 }, expected: [0, 3], hidden: true },
        ],
    },
    {
        id: 'contains-duplicate',
        title: 'Contains Duplicate',
        difficulty: 'Easy',
        topic: 'Arrays & Hashing',
        tags: ['array', 'hash set'],
        functionName: 'containsDuplicate',
        statement:
            'Given an integer array `nums`, return `true` if any value appears at least twice, and `false` if every element is distinct.',
        examples: [
            { input: 'nums = [1,2,3,1]', output: 'true' },
            { input: 'nums = [1,2,3,4]', output: 'false' },
        ],
        constraints: ['1 ≤ nums.length ≤ 10⁵', '-10⁹ ≤ nums[i] ≤ 10⁹'],
        starter: {
            python: 'def containsDuplicate(nums):\n    pass\n',
            javascript: 'function containsDuplicate(nums) {\n}\n',
            typescript: 'function containsDuplicate(nums: number[]): boolean {\n  return false;\n}\n',
        },
        tests: [
            { name: 'Has duplicate', input: { nums: [1, 2, 3, 1] }, expected: true },
            { name: 'All distinct', input: { nums: [1, 2, 3, 4] }, expected: false },
            { name: 'Many dupes', input: { nums: [1, 1, 1, 3, 3, 4, 3, 2, 4, 2] }, expected: true, hidden: true },
            { name: 'Single', input: { nums: [7] }, expected: false, hidden: true },
        ],
    },
    {
        id: 'valid-anagram',
        title: 'Valid Anagram',
        difficulty: 'Easy',
        topic: 'Arrays & Hashing',
        tags: ['string', 'hash map', 'sorting'],
        functionName: 'isAnagram',
        statement:
            'Given two strings `s` and `t`, return `true` if `t` is an anagram of `s` (uses exactly the same characters with the same counts), and `false` otherwise.',
        examples: [
            { input: 's = "anagram", t = "nagaram"', output: 'true' },
            { input: 's = "rat", t = "car"', output: 'false' },
        ],
        constraints: ['1 ≤ s.length, t.length ≤ 5·10⁴', 's and t consist of lowercase English letters.'],
        starter: {
            python: 'def isAnagram(s, t):\n    pass\n',
            javascript: 'function isAnagram(s, t) {\n}\n',
            typescript: 'function isAnagram(s: string, t: string): boolean {\n  return false;\n}\n',
        },
        tests: [
            { name: 'Anagram', input: { s: 'anagram', t: 'nagaram' }, expected: true },
            { name: 'Not anagram', input: { s: 'rat', t: 'car' }, expected: false },
            { name: 'Different length', input: { s: 'a', t: 'ab' }, expected: false, hidden: true },
            { name: 'Same string', input: { s: 'abcabc', t: 'cbacba' }, expected: true, hidden: true },
        ],
    },
    {
        id: 'best-time-to-buy-sell-stock',
        title: 'Best Time to Buy and Sell Stock',
        difficulty: 'Easy',
        topic: 'Sliding Window',
        tags: ['array', 'greedy'],
        functionName: 'maxProfit',
        statement:
            'You are given an array `prices` where `prices[i]` is the price of a stock on day `i`. Buy on one day and sell on a later day. Return the maximum profit you can achieve, or `0` if no profit is possible.',
        examples: [
            { input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy at 1, sell at 6.' },
            { input: 'prices = [7,6,4,3,1]', output: '0', explanation: 'No profitable trade.' },
        ],
        constraints: ['1 ≤ prices.length ≤ 10⁵', '0 ≤ prices[i] ≤ 10⁴'],
        starter: {
            python: 'def maxProfit(prices):\n    pass\n',
            javascript: 'function maxProfit(prices) {\n}\n',
            typescript: 'function maxProfit(prices: number[]): number {\n  return 0;\n}\n',
        },
        tests: [
            { name: 'Profit', input: { prices: [7, 1, 5, 3, 6, 4] }, expected: 5 },
            { name: 'No profit', input: { prices: [7, 6, 4, 3, 1] }, expected: 0 },
            { name: 'Two days', input: { prices: [1, 2] }, expected: 1, hidden: true },
            { name: 'Late peak', input: { prices: [2, 4, 1, 7] }, expected: 6, hidden: true },
        ],
    },
    {
        id: 'maximum-subarray',
        title: 'Maximum Subarray',
        difficulty: 'Medium',
        topic: 'Dynamic Programming',
        tags: ['array', 'dynamic programming', 'divide and conquer'],
        functionName: 'maxSubArray',
        statement:
            'Given an integer array `nums`, find the contiguous subarray (containing at least one number) with the largest sum, and return that sum.',
        examples: [
            { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: '[4,-1,2,1] has the largest sum 6.' },
            { input: 'nums = [1]', output: '1' },
        ],
        constraints: ['1 ≤ nums.length ≤ 10⁵', '-10⁴ ≤ nums[i] ≤ 10⁴'],
        starter: {
            python: 'def maxSubArray(nums):\n    pass\n',
            javascript: 'function maxSubArray(nums) {\n}\n',
            typescript: 'function maxSubArray(nums: number[]): number {\n  return 0;\n}\n',
        },
        tests: [
            { name: 'Mixed', input: { nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4] }, expected: 6 },
            { name: 'Single', input: { nums: [1] }, expected: 1 },
            { name: 'All negative', input: { nums: [-3, -1, -2] }, expected: -1, hidden: true },
            { name: 'All positive', input: { nums: [5, 4, 1, 7, 8] }, expected: 25, hidden: true },
        ],
    },
    {
        id: 'binary-search',
        title: 'Binary Search',
        difficulty: 'Easy',
        topic: 'Binary Search',
        tags: ['array', 'binary search'],
        functionName: 'search',
        statement:
            'Given a sorted (ascending) array of distinct integers `nums` and a `target`, return the index of `target` if it exists, otherwise `-1`. Aim for O(log n) time.',
        examples: [
            { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4' },
            { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1' },
        ],
        constraints: ['1 ≤ nums.length ≤ 10⁴', 'nums is sorted ascending with distinct values.'],
        starter: {
            python: 'def search(nums, target):\n    pass\n',
            javascript: 'function search(nums, target) {\n}\n',
            typescript: 'function search(nums: number[], target: number): number {\n  return -1;\n}\n',
        },
        tests: [
            { name: 'Found', input: { nums: [-1, 0, 3, 5, 9, 12], target: 9 }, expected: 4 },
            { name: 'Missing', input: { nums: [-1, 0, 3, 5, 9, 12], target: 2 }, expected: -1 },
            { name: 'First', input: { nums: [1, 2, 3, 4, 5], target: 1 }, expected: 0, hidden: true },
            { name: 'Last', input: { nums: [1, 2, 3, 4, 5], target: 5 }, expected: 4, hidden: true },
        ],
    },
    {
        id: 'move-zeroes',
        title: 'Move Zeroes',
        difficulty: 'Easy',
        topic: 'Two Pointers',
        tags: ['array', 'two pointers'],
        functionName: 'moveZeroes',
        statement:
            'Given an integer array `nums`, move all `0`s to the end while keeping the relative order of the non-zero elements. Return the modified array.',
        examples: [
            { input: 'nums = [0,1,0,3,12]', output: '[1,3,12,0,0]' },
            { input: 'nums = [0]', output: '[0]' },
        ],
        constraints: ['1 ≤ nums.length ≤ 10⁴', '-2³¹ ≤ nums[i] ≤ 2³¹ - 1'],
        starter: {
            python: 'def moveZeroes(nums):\n    # Move zeroes to the end, then return nums\n    return nums\n',
            javascript: 'function moveZeroes(nums) {\n  // Move zeroes to the end, then return nums\n  return nums;\n}\n',
            typescript: 'function moveZeroes(nums: number[]): number[] {\n  // Move zeroes to the end, then return nums\n  return nums;\n}\n',
        },
        tests: [
            { name: 'Mixed', input: { nums: [0, 1, 0, 3, 12] }, expected: [1, 3, 12, 0, 0] },
            { name: 'Single zero', input: { nums: [0] }, expected: [0] },
            { name: 'No zeroes', input: { nums: [1, 2, 3] }, expected: [1, 2, 3], hidden: true },
            { name: 'Leading zeroes', input: { nums: [0, 0, 1] }, expected: [1, 0, 0], hidden: true },
        ],
    },
    {
        id: 'climbing-stairs',
        title: 'Climbing Stairs',
        difficulty: 'Easy',
        topic: 'Dynamic Programming',
        tags: ['math', 'dynamic programming'],
        functionName: 'climbStairs',
        statement:
            'You are climbing a staircase with `n` steps. Each time you can climb 1 or 2 steps. Return the number of distinct ways to reach the top.',
        examples: [
            { input: 'n = 2', output: '2', explanation: '1+1 or 2.' },
            { input: 'n = 3', output: '3', explanation: '1+1+1, 1+2, 2+1.' },
        ],
        constraints: ['1 ≤ n ≤ 45'],
        starter: {
            python: 'def climbStairs(n):\n    pass\n',
            javascript: 'function climbStairs(n) {\n}\n',
            typescript: 'function climbStairs(n: number): number {\n  return 0;\n}\n',
        },
        tests: [
            { name: 'n=2', input: { n: 2 }, expected: 2 },
            { name: 'n=3', input: { n: 3 }, expected: 3 },
            { name: 'n=5', input: { n: 5 }, expected: 8, hidden: true },
            { name: 'n=10', input: { n: 10 }, expected: 89, hidden: true },
        ],
    },
];

export const DIFFICULTY_ORDER = { Easy: 0, Medium: 1, Hard: 2 };

export function getProblem(id) {
    return PROBLEMS.find((p) => p.id === id) || null;
}

export function listProblems() {
    return PROBLEMS;
}

export function visibleTests(problem) {
    return (problem?.tests || []).filter((t) => !t.hidden);
}
