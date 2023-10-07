


import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'

import config from 'config'


import fs from 'fs';



dotenv.config()










const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Create an array to store the conversation
let conversation = [];





// Clear the conversation array
conversation = [];






const app = express()
app.use(cors())
app.use(express.json()) 

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from CodeX!'
  })
})

let customString = "";
let customString2 = "";

app.post('/', async (req, res) => {
  let retries = 5;
  let showAllResults = true;
  let prompt_only = req.body.prompt;

  if (prompt_only.includes("/autoMessage1")) {
    customString = "write in swedish";
  } else if (prompt_only.includes("/autoMessage2")) {
    customString = "write short answer";
  } else if (prompt_only.includes("/autoMessage3")) {
    customString = "do something";
  }



      




  while (retries) {
    try {
      const prompt = req.body.prompt + " " + customString2;
      
      

      conversation.push({ type: "prompt", content: prompt });
      if (conversation.length > 9) {
        conversation.shift();
      }

  
      var selectedKeyword = '';

      function setKeyword(keyword) {
        selectedKeyword = keyword;
        console.log('Selected keyword:', selectedKeyword);
      }

      let systemString =   `Programed RPG[Continue story from reference]:" only answer choosen game action that creates new scenario and actions accordingly to the answer].[Game UI Titles is "scenario:" (always write creative updated new scenario based on latest answer:), "Inventory:", "actions" ("1:text. ", "2:text. ", "3:text. ", always write scenario first before actions but remeber a dot "." in the end of each action.) Be Creative. Always write only these 3 Game UI titles {BUT ONLY ONE TIME} (Scenario: Inventory: Actions: 1: 2: 3:.) Never repeat scenario from reference always create new. Also have around 3 sentences each scenario and 300-350 characters.`;
     
      let userString =   `Conversation Reference: "${conversation}"... User Action Answer:"${prompt_only}"...`;
 
      const response = await openai.createChatCompletion({ 
  model: "gpt-3.5-turbo-16k",
// replace prompt with messages and set prompt as content with a role.
  messages: [
    {role: "system", content: systemString},
    {role: "user", content: userString}
  ], 
});


      const gptResponse = response.data.choices[0].message.content;
      conversation.push({ type: "gpt", content: gptResponse });
      if (conversation.length > 9) {
        conversation.shift();
      }


      // grab text after scenario and use it as dall-e 2 prompt

      const titleIndex = gptResponse.indexOf("Scenario:");

      // if "Scenario:" is found in the response, extract the text after it
      let extractedText = "";
      if (titleIndex !== -1) {
        // find the index of "Inventory:" after "Scenario:"
        const inventoryIndex = gptResponse.indexOf("Inventory:", titleIndex);
      
        // if "Inventory:" is found after "Scenario:", extract the text between the two indices
        if (inventoryIndex !== -1) {
          extractedText = gptResponse.substring(titleIndex + 9, inventoryIndex).trim();
        }
      }
      
      // print the extracted text to the console
      console.log('Title:',extractedText);

      console.log('Convo',conversation);

      


      const randomWord = " by Van Gogh in a fantasy anime style like mushishi"
      const imagePrompt = "\"" + extractedText + "\"";

      const numberOfImages = 1;
      const imageSize = "512x512";

      let imageURL;


      
   const imageResponse = await openai.createImage({
       prompt: imagePrompt + randomWord,
       n: numberOfImages,
       size: imageSize,
      })
      .then((data) => {
       const imageData = data.data.data;
   const urls = imageData.map(obj => obj.url);
  const urlsString = urls.join(","); // Change the delimiter as needed
  console.log(urlsString);
  imageURL = urlsString;
  
        });



console.log('imageURL:', imageURL);


      res.status(200).send({
        bot: gptResponse + ".EndOfActions ... " + "imageURL:" + imageURL + "endOfURL ..." 
      });

        // Empty the customString variable, should be after some stuff above this, only seems to works at cetrain position in code
        customString = "";

        // 

      showAllResults = true;
      break;
    } catch (error) {
      console.error(error)
      retries--;
      if (retries === 3) {
        showAllResults = false;
        conversation = [];
      }
      if (!retries) {
        conversation = [];
        res.status(500).send(error || 'Something went wrong');
      }
    }
  }
});


// image post




// 

// DALLE Api Image Generator

//








app.listen(5000, () => console.log('AI server started on http://localhost:5000'))
