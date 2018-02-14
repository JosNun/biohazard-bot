let github = require('github-api');
let auth = require('./auth.json');

let gh = new github({
  token: auth.githubToken,
});

exports.newFeature = function(featureString) {
  let issue = gh.getIssues('CS-5', 'biohazard-bot');

  let issueData = {
    title: featureString,
    body: 'This was an automatic feature reqest',
    labels: ['automated feature request'],
  };

  issue.createIssue(issueData);
};
