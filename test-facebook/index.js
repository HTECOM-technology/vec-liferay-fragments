const token = "EAF0ZAZAk2ZCmhkBRWZBTInuzBFl02Uk0RFtiN3EdCcJygcm44gUy7G93CQ5IlMO8jG9sCEOxIGRYexPtrosg3wzVPjspzKV24DaZBgg5HXxFfYdtSk61ZBnDcKLIIoz9rRFmgTDa1hPfW90bHRgUi1WiXCjbzSLZAj1q8WtboG7hZCxjjqAgVvb1gre2vuJHlsFhhBQNZCjzNKl09l8TULuzCnPbym9eJJ0MoRu9znOQLKieol2MGZADhSFc0btMaiNSBAZBfOvPYMDvtl5kbIHz3Y9ILTqvgZDZD";
// const url = "https://www.facebook.com/thongtinchinhphu/posts/pfbid0d3veaqQWH9kKpDUgaq54QBvFRtuqLSYRtzoqjBScYzFpXpRTb7odyYLZ6Mk7oQ2ml";

// const res = await fetch(
//   `https://graph.facebook.com/v25.0/?id=${encodeURIComponent(url)}&fields=id,message&access_token=${token}`
// );
// const data = await res.json();
// console.log('data', data);
// console.log('data.id', data.id);
// console.log('data.message', data.message);

const res = await fetch(
  `https://graph.facebook.com/v25.0/thongtinchinhphu?fields=id,name&access_token=${token}`
);
const data = await res.json();
console.log(data);
