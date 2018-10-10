
const badEmailResponse = () => ({
  "status": "error",
  "message": "contact does not exist",
  "correlationId": "81657de3-3c87-4d7e-aac9-bff364488867",
  "requestId": "f7e4d9ac65c24b5cc507bf81f313e7a4"
});

const goodEmailResponse = () => ({
  "vid": 1010851,
  "canonical-vid": 1010851,
  "merged-vids": [],
  "portal-id": 2683380,
  "is-contact": true,
  "profile-token": "AO_T-mOgl9WKKBIYIgkZCzXnzIWKljQSinJx9DSulgy7NJn6_6fwruqZoESkXEuJVkLAXs2U2qlnm9ihLIX8I64Pte52DuxPBbIUEC6bFa51gxthm9OjTap9ILyV72FBQiZAUy3Z_3rc",
  "profile-url": "https://app.hubspot.com/contacts/2683380/lists/public/contact/_AO_T-mOgl9WKKBIYIgkZCzXnzIWKljQSinJx9DSulgy7NJn6_6fwruqZoESkXEuJVkLAXs2U2qlnm9ihLIX8I64Pte52DuxPBbIUEC6bFa51gxthm9OjTap9ILyV72FBQiZAUy3Z_3rc/",
  "properties": {
    "wakatime_api_key": {
        "value": "a985-9fee5ad409b1",
    }
  }
});

const goodEmailResponseNoKey = () => ({
  "vid": 1010851,
  "canonical-vid": 1010851,
  "merged-vids": [],
  "portal-id": 2683380,
  "is-contact": true,
  "profile-token": "AO_T-mOgl9WKKBIYIgkZCzXnzIWKljQSinJx9DSulgy7NJn6_6fwruqZoESkXEuJVkLAXs2U2qlnm9ihLIX8I64Pte52DuxPBbIUEC6bFa51gxthm9OjTap9ILyV72FBQiZAUy3Z_3rc",
  "profile-url": "https://app.hubspot.com/contacts/2683380/lists/public/contact/_AO_T-mOgl9WKKBIYIgkZCzXnzIWKljQSinJx9DSulgy7NJn6_6fwruqZoESkXEuJVkLAXs2U2qlnm9ihLIX8I64Pte52DuxPBbIUEC6bFa51gxthm9OjTap9ILyV72FBQiZAUy3Z_3rc/",
  "properties": {}
});

module.exports = { goodEmailResponse, badEmailResponse, goodEmailResponseNoKey }
