const github = require('github-api');
const auth = require('./auth.json');

let gh = new github({
  token: auth.githubToken,
});

exports.newFeature = function(featureString, author) {
  let issue = gh.getIssues('CS-5', 'biohazard-bot');

  let issueData = {
    title: featureString,
    body: '_This was an automatic feature reqest by ' + author + '_',
    labels: ['automated feature request'],
  };

  return issue.createIssue(issueData);
};
