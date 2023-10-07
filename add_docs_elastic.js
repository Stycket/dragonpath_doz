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

client.info()
  .then(response => console.log(response))
  .catch(error => console.error(error))



  async function run() {
    await client.index({
      index: 'razbot-gpt',
      body: {
        Title: 'Rasmus Main Info',
        Description: 'General info about Raz',
      Content: 'Name: Rasmus Age: 35 Gender: Male Occupation: Product Designer Address: 123 Main St, Anytown USA Phone: 555-555-5555 Email: Rasmus.lundin100@email.com Marital Status: Married Children: 2 Education: Bachelors degree in Computer Science from University of California, Los Angeles Hobbies: Running, hiking, and playing guitar.'
      }
    })
  
    await client.index({
      index: 'razbot-gpt',
      body: {
        Title: 'Rasmus Skills',
        Description: 'Skills Rasmus has',
      Content: 'Rasmus is profficient in many things. Web development, such as UI design, UX design, Front-end development and also a little back-end. He also a good gammer and produces music and art.'
      }
    })
  
    await client.index({
      index: 'razbot-gpt',
      body: {
        Title: 'Razsmus Philosophy',
        Description: 'Rasmus thoughts on Philosophy',
      Content: 'Rasmus has a deep sense of spirituality and is very interested in eastern philosophy such as Buddhism yoga etc. He view everything as a whole that is connected, meaning that everything is one.'
      }
    })
  
    await client.indices.refresh({index: 'Razbot-gpt'})
  }

  
  
  run().catch(console.log)



  