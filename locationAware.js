//determines which host it's running on and adjusts accordingly
//create a file named window.location.host + .js and set client_id, oauth_redir_url according to twitch app settings

var redir_url;

$.ajax({
  url: window.location.host + '.js',
  dataType: "script",
  async: false,
  success: function()
{
    redir_url = 'https://api.twitch.tv/kraken/oauth2/authorize?response_type=token&amp;client_id=' + client_id + '&amp;redirect_uri=' + oauth_redir_url + '&amp;scope=chat_login';
}
});
