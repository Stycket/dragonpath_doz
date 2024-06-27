import bot from './assets/bot.svg'
import user from './assets/user.svg'




const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

let loadInterval;
let intervalId;
// Check if user has scrolled up
let isScrolled = false;
function keepChatVisible() {
    const chatContainer = document.querySelector('#chat_container');
    // Set the scroll position of the chat container to the bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
  

function startChatScrolling(){
    intervalId = setInterval(() => {
        keepChatVisible();
    }, 1111);
}

function stopChatScrolling(){
    clearInterval(intervalId);
}

function loader(element) {
    element.textContent = ''

    loadInterval = setInterval(() => {
        // Update the text content of the loading indicator
        element.textContent += '.';

        // If the loading indicator has reached three dots, reset it
        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300);
}

function typeText(element, text) {
    let index = 0

    startChatScrolling();

    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index)
            index++
        } else {
            clearInterval(interval)
            stopChatScrolling()
        }
    }, 20)
}

// generate unique ID for each message div of bot
// necessary for typing text effect for that specific reply
// without unique ID, typing text will work on every element
function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
    return (
        `
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${isAi ? bot : user} 
                      alt="${isAi ? 'bot' : 'user'}" 
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `
    )
}



// Define variables for the three text sections
let statsText = '';
let scenarioText = '';
let actionsText = '';



const handleSubmit = async (prompt) => {
  // user's chatstripe
  chatContainer.innerHTML += chatStripe(false, prompt)

  // to clear the textarea input 
  form.reset()

  // bot's chatstripe
  const uniqueId = generateUniqueId()
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId)

  // to focus scroll to the bottom 
  chatContainer.scrollTop = chatContainer.scrollHeight;
  
  // specific message div 
  const messageDiv = document.getElementById(uniqueId)
  
  // messageDiv.innerHTML = "..."
  loader(messageDiv)

  // log messages
  console.log(prompt);

  await sendToGPTAPI(prompt, messageDiv);
}

const sendToGPTAPI = async (prompt, messageDiv) => {
  const data = { prompt }

  const response = await fetch('https://dragonpath.grabobastu.se', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
  })

  clearInterval(loadInterval)
  messageDiv.innerHTML = " "

  if (response.ok) {
      const data = await response.json();
      const parsedData = data.bot.trim() // trims any trailing spaces/'\n' 

      typeText(messageDiv, parsedData)

      extractAndDisplay(parsedData);
  } else {
      const err = await response.text()

      messageDiv.innerHTML = "Something went wrong, try again."
  }
}



const extractAndDisplay = (responseText) => {
  // Extract text sections based on keywords
  const statsMatch = responseText.match(/stats:(.+?)(?=calculator:|inventory:|scenario:|actions:|$)/is);
  if (statsMatch) {
    const statsText = statsMatch[1].replace(/\r?\n/g, "<br>").trim();
    document.getElementById('stats').innerHTML = statsText;
  }

  const calculatorMatch = responseText.match(/calculator:(.+?)(?=stats:|inventory:|imageURL:|scenario:|actions:|$)/is);
  if (calculatorMatch) {
    const calculatorText = calculatorMatch[1].replace(/\r?\n/g, "<br>").trim();
    document.getElementById('calculator').innerHTML = calculatorText;
  }

  const inventoryMatch = responseText.match(/inventory:(.+?)(?=stats:|calculator:|imageURL:|scenario:|actions:|$)/is);
  if (inventoryMatch) {
    const inventoryText = inventoryMatch[1].replace(/\r?\n/g, "<br>").trim();
    document.getElementById('inventory').innerHTML = inventoryText;
  }
  
  const imageURLMatch = responseText.match(/imageURL:(.+?)(?=endOfURL|stats:|calculator:|scenario:|actions:|$)/is);
  if (imageURLMatch) {
    const imageURLText = imageURLMatch[1].replace(/\r?\n/g, "<br>").trim();
    document.getElementById('imageURL').innerHTML = `<div class="card_img"><img src="${imageURLText}"></div>`;
  }
  
  const scenarioMatch = responseText.match(/scenario:(.+?)(?=stats:|calculator:|inventory:|imageURL:|actions:|$)/is);
  if (scenarioMatch) {
    const scenarioText = scenarioMatch[1].replace(/\r?\n/g, "<br>").trim();
    document.getElementById('scenario').innerHTML = scenarioText;
  }


  const actionsMatch = responseText.match(/actions:(.+?)(?=endOfActions|$)/is);
  if (actionsMatch) {
    const actionsText = actionsMatch[1].replace(/\r?\n/g, "<br>").trim();
    const actionsArray = actionsText.match(/[^\r\n.]+/g);
    const actionsHtml = actionsArray.map(action => {
      return `<button class="action-button" data-action="${action}">${action}</button>`;
    }).join("");
    document.getElementById('actions').innerHTML = actionsHtml;

    const actionButtons = document.querySelectorAll(".action-button");
    actionButtons.forEach(button => {
      button.addEventListener("click", () => {
        const customText = "Answer:";
        const actionText = button.dataset.action;
        const promptText = `${customText} ${actionText}`;
        handleSubmit(promptText);
      });
    });
  }
}



    
    document.addEventListener("DOMContentLoaded", function(){
        const customPrompt = "Begin the adventure in a forest. Only start with player, no enemy in stats Player: HP=100";
        handleSubmit(customPrompt);
    });
    



    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const prompt = event.target.querySelector('textarea').value;
        handleSubmit(prompt);
    });
    
    form.querySelector('textarea').addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            
            const prompt = event.target.value;
            handleSubmit(prompt);
        }
    });
    







    // UX



    
var sickPrimary = {
    autoplay: true,
    autoplaySpeed: 11100,
    slidesToShow: 2,
    slidesToScroll: 1,
    speed: 1100,
    cssEase: 'cubic-bezier(.84, 0, .08, .99)',
    asNavFor: '.text-slider',
    centerMode: true,
    prevArrow: $('.prev'),
    nextArrow: $('.next')
}

var sickSecondary = {
    autoplay: true,
    autoplaySpeed: 11100,
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 1100,
    cssEase: 'cubic-bezier(.84, 0, .08, .99)',
    asNavFor: '.image-slider',
    prevArrow: $('.prev'),
    nextArrow: $('.next'),


}

$('.image-slider').slick(sickPrimary);
$('.text-slider').slick(sickSecondary);



// img height




$('#openux').click(function() {
    setTimeout(function() {
      $('.ux').css({
        'opacity': 1,
        'display': 'initial',
        'z-index': '111',
      });
    }, 555);

    setTimeout(function() {
      $('.slick-slide.slick-center').css({
        'z-index': '111',
      });
    }, 5000);

    setTimeout(function() {
        $('#app').css({
          'z-index': '0',
          'opacity': '0',
        });
      }, 0);


     

      setTimeout(function() {
        $('.main_menu').css({
          'z-index': '0',
          'opacity': '0',
        });
      }, 0);


      setTimeout(function() {
        $('.loadingScreen').css({
          'z-index': '3',
          'opacity': '1',
        });
      }, 50);

      setTimeout(function() {
        $('.loadingScreen').css({
          'z-index': '0',
          'opacity': '0',
        });
      }, 5000);


      setTimeout(function() {
        $('.closeux').css({
          'z-index': '3',
          'opacity': '1',
        });
      }, 5000);


      $('.logo').css({
        'opacity': 0,
        
          'z-index': '0',

      });



});











    $('.closeux').click(function() {
        $('.ux').css({
          'opacity': 0,
          
            'z-index': '0',

        });

        $('.closeux').css({
            'opacity': 0,
            
              'z-index': '0',
  
          });

          $('#app').css({
            'opacity': 1,
              'z-index': '1',
        
          });


          $('.main_menu').css({
            'opacity': 1,
              'z-index': '2',
        
          });


          $('.logo').css({
            'opacity': 1,
            
              'z-index': '2',
    
          });
    



        });
    


$('.cta2').click(function() {
$('.fullimg').css({
  'opacity': 1,
  'display': 'initial',
    'z-index': '111',
  'background': 'rgba(14,14,14,0.55)'
});
});

$('.closefull').click(function() {
$('.fullimg').css({
  'opacity': 0,
 
    'z-index': '0',
  'background': 'rgba(14,14,14,0.55)'
});
});
