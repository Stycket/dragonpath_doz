const { Client } = require('@elastic/elasticsearch')
const config = require('config');
const elasticConfig = config.get('elastic');

const client = new Client({
  cloud: {
    id: elasticConfig.cloudID
  },
  auth: {
    username: elasticConfig.username,
    password: elasticConfig.password
  }
})



async function run () {
 // Let's search!
 const result = await client.search({
    index: 'razbot-gpt',
    query: {
      match: {
        Description: 'skill'
      }
    }
  })

  console.log(result.hits.hits)
}

run().catch(console.log)