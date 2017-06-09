var client_id, oauth_redir_url;

if (window.location.host == "redrabbyte.github.io")
{
  client_id = 'c4rg0lsvfu12m2qbqz16ehj8omkd24';
  oauth_redir_url = 'https://redrabbyte.github.io/anti-snek/';
}
else if(window.location.host == "www.ginerlukas.com")
{  
  if (findGetParameter('no_redir') == null)
  {
    window.location.replace('https://redrabbyte.github.io/anti-snek/' + window.location.toString().replace(window.location.origin+window.location.pathname, ''));
  }
  client_id = 'brpfagxccbvvqv534nu3vlv7raayqrw';
  oauth_redir_url = 'http://www.ginerlukas.com/twitch/?no_redir=1';
}

var redir_url = 'https://api.twitch.tv/kraken/oauth2/authorize?response_type=token&amp;client_id=' + client_id + '&amp;redirect_uri=' + oauth_redir_url + '&amp;scope=chat_login';