/*
Copyright [2017] [Lukas Giner]

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

https://github.com/redrabbyte/anti-snek
*/


//login as soon as connection is established
function onIRCOpen() {
  connection.send("PASS " + oauthToken);
  connection.send("NICK irrelevantUsername");
  connection.send("CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership");
  var channel = document.getElementById('channel-input').value;
  if (channel != '')
    changeChannel(channel);
};

//log errors
function onIRCError(error) {
  console.log('WebSocket Error ' + error);
};

//handle messages from the server
//TODO clean up, move to different function
function onIRCMessage(msg) {
  var full_msg = msg.data.split(' :');
  
  if (full_msg.length == 2 && full_msg[0] == "PING") 
  {
    connection.send('PONG :tmi.twitch.tv');
		console.log('PONG Sent\r\n');
		return;
  }
  //seems to be a normal chat message
  else if (full_msg.length == 3)
  {
    var msg_tag = full_msg[0];
    var msg_user = full_msg[1];
    var msg_text = full_msg[2].replace(/(\r\n|\n|\r)/gm, "");
    
    var user_parts = msg_user.split(' ');
    
    var channel = '';
    var ircType = '';
    var nick = '';

    if (user_parts.length == 3)
    {
      channel = user_parts[2];
      ircType = user_parts[1];
      //TODO get from case sensitive name from tag 
      nick = user_parts[0].split('!')[0];
      
      //if (/\bcheer\d+\b/.test(msg_text))
      if (/bits=\d+/g.test(msg_tag))
      {
        //console.log('Server: channel: ' + channel + ', ircType: ' + ircType + ', user: '+ nick + ' : ' + msg_text);
        console.log(msg_tag + ' : ' + msg_text);
        //console.log(msg_user);

        //always parse because it also kills html tags
        linkified_msg = linkifyStr(msg_text);
        
        var has_link_class = 'text-donation';
        var donation_display = 'block';
        
        //had a link
        if (linkified_msg != msg_text)
          has_link_class = 'link-donation';
          
        if (document.getElementById("filter-links-checkbox").checked)
          donation_display = 'none';
          
        parsed_msg = parseIRCEmotes(msg_tag, linkified_msg);
        
        var chat_lines = $('#donation-lines');
        var line = document.createElement('p');
        line.className += has_link_class;
        line.innerHTML = '<b>' + nick + '</b>: ' + parsed_msg;
        line.style.display = donation_display;
        
        var auto_scroll = chat_lines[0].scrollHeight - chat_lines.scrollTop() == chat_lines.outerHeight();
        
        chat_lines[0].appendChild(line);
        if (auto_scroll)
          chat_lines.animate({scrollTop:chat_lines[0].scrollHeight}, 500);
      }
    }
    
  }
  else
    console.log(msg.data);
  
};

//yes, this does too much for now.
//TODO cleanup
function parseIRCEmotes(tag, msg)
{
  tag.split(';').forEach(function(entry){
    var entry_parts = entry.split('=');
    if (entry_parts[1] != '')
    {
      var parameter = entry_parts[0];
      var value = entry_parts[1];
      if (parameter == 'emotes' && !(typeof msg === 'undefined'))
      {
        var orig_msg = msg;
        msg = ' ' + msg + ' ';
        value.split('/').forEach(function(entry){
          var emote_id = entry.split(':')[0];
          var emote_range_str = entry.split(':')[1].split('-');
          //parsefunction doesn't die if there are more than one of an emote
          var emote_range = [parseInt(emote_range_str[0]), parseInt(emote_range_str[1])];

          var emote_string = orig_msg.substring(emote_range[0], emote_range[1]+1);

          var replacement_string = '<img src="' + emote_url + emote_id + '/1.0" title="' + emote_string +'" alt="' + emote_string +'" class="emoticon">';
          
          //replace all instances, avoid endless loop with the help of spaces #wcgw
          while((a = msg.indexOf(' ' + emote_string + ' ') != -1))
            msg = msg.replace(' ' + emote_string + ' ', ' ' + replacement_string +' ');
          
        });
      }
    }
  });
  return msg;
}

//leave old channel, join new
function changeChannel(channel) {
  
  if (current_channel != '')
    connection.send('PART #' + current_channel);
    
  
  var chat_container = document.getElementById('chat-display');
  chat_container.innerHTML = '';
  
  var donation_list = document.getElementById('donation-lines');
  donation_list.innerHTML = '';
  
  if (channel == '')
    return;
    
  connection.send('JOIN #' + channel);
  
  //TODO wait for accept or reject
  current_channel = channel;
  setCookie('channel_name', channel, 30);  
    
  var chat = document.createElement('iframe');
  chat.frameBorder = '0';
  chat.scrolling = 'no';
  chat.src = 'https://www.twitch.tv/' + channel + '/chat';
  chat.id = 'chat-embed';
  chat.height = '800';
  chat.width = '340';
  chat_container.appendChild(chat);
}

function onChangeChannelButton()
{
  var channel = document.getElementById('channel-input').value;
  window.history.pushState('', '', '?channel=' + channel);
  changeChannel(channel);
}

// hide or show non-link donations
function onToggleOnlyLinks()
{
  var style = 'block';
  
  if (document.getElementById("filter-links-checkbox").checked)
    var style = 'none';
  
  $('.text-donation').toArray().forEach(function(entry){
    entry.style.display = style;
  });
  
}


var oauthToken = '';
var current_channel = '';
var connection;

var emote_url = 'https://static-cdn.jtvnw.net/emoticons/v1/';


//check for twitch oauth parameters
hash_string = window.location.hash.substr(1);
hash_string.split('&').forEach(function(entry) {
    var hash_parts = entry.split('=');
    if (hash_parts.length == 2 && hash_parts[0] == "access_token")
    {
      setCookie('oauth_token', 'oauth:' + hash_parts[1], 30);
    }
});

window.onload = function ()
{ 
  var oauth_cookie = getCookie("oauth_token");
  
  var channel_param = findGetParameter('channel');
  if (channel_param != null)
  {
    document.getElementById('channel-input').value = channel_param;
    setCookie('channel_name', channel_param, 30);
  }
  else
  {
    var channel_cookie = getCookie("channel_name");
    if (channel_cookie != -1)
    {
      document.getElementById('channel-input').value = channel_cookie;
    }
  }
  
  if (oauth_cookie != -1)
  {
    document.getElementById("channel-input").style.display = 'inline';
    document.getElementById("channel-input").onkeyup = function (e) {
      if (e.keyCode == 13) {
          onChangeChannelButton();
      }
    };
    document.getElementById("change-channel").style.display = 'inline';
    document.getElementById("change-channel").onclick = onChangeChannelButton;
    
    document.getElementById("options-area").style.display = 'inline';
    document.getElementById("filter-links-checkbox").onclick = onToggleOnlyLinks;
    
    oauthToken = oauth_cookie;

    connection = new WebSocket('wss://irc-ws.chat.twitch.tv/');
    connection.onopen = onIRCOpen;
    connection.onerror = onIRCError;
    connection.onmessage = onIRCMessage;

  }
  else
  {
    link = document.getElementById("twitch-oauth-link");
    link.style.display = 'inline';
    link.setAttribute('href', redir_url);
  }
}
