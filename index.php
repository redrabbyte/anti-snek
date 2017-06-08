<!DOCTYPE html>
<html>
<head>
  <title> ANTI SNEK </title>
  <link rel="stylesheet" href="stuff.css?v=<?=time();?>">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
  <script src="waitForKeyElements.js"></script>
  <script src="extractDonations.js" ></script>
  <script src="linkifyjs/linkify.js"></script>
  <script src="linkifyjs/linkify-string.js"></script>
  <script src="linkifyjs/linkify-jquery.js"></script>

</head>
<body>
  <div id="chat-donation-container">
    <center><p><b>ANTI SNEK</b></p></center>
    <div id="chat-display">
    </div>
    <div id="donations">
      <div id="donation-settings">
        <center> 
          Bit Donations<br>
          <a id="twitch-oauth-link" style="display:none;" href="https://api.twitch.tv/kraken/oauth2/authorize?response_type=token&amp;client_id=brpfagxccbvvqv534nu3vlv7raayqrw&amp;redirect_uri=http://www.ginerlukas.com/twitch/&amp;scope=chat_login">
            <img src="//ttv-api.s3.amazonaws.com/assets/connect_dark.png">
          </a>
          <input type="text" id="channel-input" style="display:none;"><button type="button" id="change-channel" style="display:none;">Change Channel</button>
          <br>
          show only links? <input type="checkbox" id="filter-links-checkbox" style="display:none;">
        </center>
      </div>
      <div id="donation-lines">
        &nbsp;
      </div>
    </div>
  </div>
  <div id="footer">
    <center>
      <a href="https://github.com:redrabbyte/anti-snek">github</a>
    </center>
  </div>
</body>