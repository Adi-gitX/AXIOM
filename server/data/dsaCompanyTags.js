/**
 * Curated company tags for high-signal DSA problems.
 * Keys are canonical problem ids from dsaCatalog.generated.js.
 */
export const DSA_COMPANY_TAGS = {
    'striverA2Z:0:0': ['Amazon', 'Microsoft'],
    'striverA2Z:0:1': ['Google', 'Uber'],
    'striverA2Z:0:2': ['Goldman Sachs', 'Adobe'],
    'striverA2Z:2:3': ['Amazon', 'Flipkart'],
    'striverA2Z:5:2': ['Google', 'Meta'],
    'striverA2Z:8:4': ['Microsoft', 'Apple'],
    'striverSDE:0:0': ['Amazon', 'Google'],
    'striverSDE:0:1': ['Google', 'Microsoft'],
    'striverSDE:0:2': ['Adobe', 'Walmart'],
    'striverSDE:4:0': ['Amazon', 'PayPal'],
    'striverSDE:4:1': ['Microsoft', 'Meta'],
    'striverSDE:7:0': ['Flipkart', 'Atlassian'],
    'striverSDE:8:0': ['Google', 'Uber'],
    'love450:0:0': ['Amazon', 'Infosys'],
    'love450:0:1': ['TCS', 'Wipro'],
    'love450:0:10': ['Amazon', 'Microsoft'],
    'love450:0:13': ['Google', 'Bloomberg'],
    'love450:0:16': ['Amazon', 'Meta'],
    'love450:1:3': ['Walmart', 'Adobe'],
    'love450:2:5': ['Google', 'Intuit'],
    'love450:3:2': ['Amazon', 'Salesforce'],
    'love450:4:1': ['Microsoft', 'Expedia'],
    'love450:5:4': ['PayPal', 'Zoho'],
    'love450:6:6': ['Nvidia', 'Oracle'],
    'love450:7:3': ['Swiggy', 'Razorpay'],
    'love450:8:2': ['Uber', 'LinkedIn'],
    'love450:9:7': ['Atlassian', 'ServiceNow'],
    'love450:10:1': ['Google', 'Amazon'],
    'love450:11:5': ['Meta', 'Netflix'],
};

export const getCompanyTagsForProblem = (problemId) => {
    const tags = DSA_COMPANY_TAGS[problemId];
    if (!Array.isArray(tags)) return [];
    return tags;
};

export default DSA_COMPANY_TAGS;
