var connection = new WebSocket('wss://irc-ws.chat.twitch.tv/');

var oauthToken = 'oauth:kfu0hr03ro1x37la768kxkz68l0elt';
var channel = 'kaceytron';

//sub:
//@badges=subscriber/0,premium/1;color=#CC00A0;display-name=MaximumOverDrive123;emotes=;id=f921ca5f-cf63-406a-8c9c-57a41c501748;login=maximumoverdrive123;mod=0;msg-id=resub;msg-param-months=2;msg-param-sub-plan-name=Channel\sSubscription\s(summit1g);msg-param-sub-plan=1000;room-id=26490481;subscriber=1;system-msg=MaximumOverDrive123\sjust\ssubscribed\swith\sa\s$4.99\ssub.\sMaximumOverDrive123\ssubscribed\sfor\s2\smonths\sin\sa\srow!;tmi-sent-ts=1496887404239;turbo=0;user-id=90677638;user-type= :tmi.twitch.tv USERNOTICE #summit1g :2 months boi

//primesub
//@badges=subscriber/0,premium/1;color=#0ECC00;display-name=IVcruz;emotes=;id=deb1f490-4510-46f7-a226-0c6659e5f643;login=ivcruz;mod=0;msg-id=sub;msg-param-months=1;msg-param-sub-plan-name=Channel\sSubscription\s(summit1g);msg-param-sub-plan=Prime;room-id=26490481;subscriber=1;system-msg=IVcruz\sjust\ssubscribed\swith\sTwitch\sPrime!;tmi-sent-ts=1496887588789;turbo=0;user-id=32316439;user-type= :tmi.twitch.tv USERNOTICE #summit1g

//cheer
//@badges=subscriber/12;bits=200;color=#00BECC;display-name=janaparks;emotes=;id=e6323bb1-6ffb-43a7-9bbe-2c840b303a38;mod=0;room-id=30281925;subscriber=1;tmi-sent-ts=1496888271086;turbo=0;user-id=46776842;user-type= :janaparks!janaparks@janaparks.tmi.twitch.tv PRIVMSG #kaceytron :cheer200 cuddle scout and atticus for me


// When the connection is open, send some data to the server
connection.onopen = function () {
  connection.send("PASS " + oauthToken);
  connection.send("NICK irrelevantUsername");
  //connection.send("NICK " + userName);
  //connection.send("USER " + userName + " 8 * :" + userName);
  connection.send("CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership");
  connection.send('JOIN #' + channel);
};

// Log errors
connection.onerror = function (error) {
  console.log('WebSocket Error ' + error);
};

// Log messages from the server
connection.onmessage = function (e) {
  var full_msg = e.data.split(' :');
  
  console.log(e.data);
  /*
  if (full_msg.length == 2 && full_msg[0] == "PING") 
  {
    connection.send('PONG :tmi.twitch.tv');
		console.log('PONG Sent\r\n');
		return;
  }
  else if (full_msg.length == 3)
  {
    var msg_tag = full_msg[0];
    var msg_user = full_msg[1];
    var msg_text = full_msg[2];
    
    var user_parts = msg_user.split(' ');
    
    var channel = '';
    var ircType = '';
    var nick = '';

    if (user_parts.length == 3)
    {
        channel = user_parts[2];
        ircType = user_parts[1];
        nick = user_parts[0].split('!')[0];
        
        console.log('Server: channel: ' + channel + ', ircType: ' + ircType + ', user: '+ nick + ' : ' + msg_text);                   
    }
    
  }
  else
    console.log(e.data);*/
  
};
