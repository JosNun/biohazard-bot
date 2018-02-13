let github = require('github-api');

let gh = new github({
  token: '', // github user token
});

exports.newFeature = function(featureString) {
  let issue = gh.getIssues('cs-5', 'biohazard-bot');

  let issueData = {
    title: featureString,
    body: 'This was an automaticlly submitted feature request from the bot',
    labels: ['automated feature request'],
  };

  issue.createIssue(issueData);
};
