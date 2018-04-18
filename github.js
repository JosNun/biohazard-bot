/**
 * Github functions
 * @module github
 */

const github = require('github-api');
const auth = require('./auth.json');

let gh = new github({
  token: auth.githubToken,
});

/**
 * Create a new feature issue on github
 * @param {string} featureName - Feature request name
 * @param {string} author - User who's name will be put in the feature request
 * @return {Promise}
 */
module.exports.newFeature = function(featureName, author) {
  let issue = gh.getIssues('CS-5', 'biohazard-bot');

  let issueData = {
    title: featureName,
    body: `_This was an automatic feature reqest by ${author}_`,
    labels: ['automated feature request'],
  };

  return issue.createIssue(issueData);
};
