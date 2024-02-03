const {
  RegExpMatcher,
  TextCensor,
  englishDataset,
  englishRecommendedTransformers,
} = require('obscenity');

const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

if (matcher.hasMatch('')) {
  console.log('The input text contains profanities.');
}
