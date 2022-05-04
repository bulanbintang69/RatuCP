# RatuCP
The bot generates shareable links in Telegram for videos, photos, documents and can be shared in groups.
<hr>

<a href="https://heroku.com/deploy?template=https://github.com//RatuCP">
  <img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy">
</a>
<br>
Replace the link with your github template.
</br></br>
<a href="https://youtu.be/zw_ijvhzomI">
Click here to watch how to host
</a>
</br></br>

Required details.</br>
<code>TOKEN</code> - Get bot token from botfather.</br>
<code>DOMAIN</code> - Same as the name of the app you entered in Heroku.</br>
<code>ADMIN</code> - Your Account ID (if you can't find it using a bot like @getmyid_bot). <b>If there is an additional ADMIN1, ADMIN2, ADMIN3 and ADMIN4, write it according to the example in the Heroku config and just put a number behind it.</b></br>
<code>BOTUSERNAME</code> - Your bot username without '@'.</br>
<code>DB_URL</code> - Create an account at https://www.mongodb.com/cloud/atlas , database name - RatuMediaFile , collection name - RatuFileBackup. Click Connect and select 'Connect your app'.copy the link and replace "< password >" with the password of the user who has access to the DB and replace "myFirstDatabase" for "RatuMediaFile". If you want to change it as you wish, the database name is in the config folder.</br>
<b>DB_URL link</b>

    mongodb+srv://login:password@bot.qnbbq.mongodb.net/database?retryWrites=true&w=majority

<code>LOG_CHANNEL</code> - create a private channel and get the channel ID (if you can't pass any channel ID from the channel to @getidsbot it might look like -1001234567899).
<hr>

<h2>Here are some admin commands and usage.</h2>

~ How users ban, unban and kick from bots and groups.
<code>/ban</code> userID caption if any.</br>
<code>/banchat</code> userID (private).</br>
<code>/unban</code> userID.</br>
<code>/unbanchat</code> userID (private).</br>
<code>/kick</code> userID.</br>
<b>Get UserID from log channel.</b></br>

~ How to use pin and unpin in groups.</br>
<code>/pin</code> reply to the message you want to pin.</br>
<code>/unpin</code> reply to the message you want to unpin.</br>

~ How to send a message to a user from a group.</br>
<code>/send</code> message. send messages in the group.</br>

~ How to send messages to users from bots.</br>
<code>/sendchat</code> message userID. send to users via bot.</br>

<h2>How to delete files from bot.</h2>
You can delete files 3 ways.</br>

  ⚫ Delete individual files with file_id.
  
  ⚫ Delete all files Send by user.
  
  ⚫ Delete all files Send to bot.


~ Delete individual files with file_id.</br>
<code>/rem</code> file_id. It will delete files one by one when you provide file_id, get file_id from log channel.</br>

~ Delete group files with mediaId.</br>
<code>/remgrp</code> mediaId. This will delete the media in the group, get the mediaId from the log channel.</br>

~ Delete all files Send by user.</br>
<code>/remall</code> userID. You can delete all files sent by specific user if user send abusive content or spam get userid from log channel.</br>

~ Delete all files Send to bot.</br>
<code>/clear</code>. This will permanently delete all files sent to the bot.</br>

<h2>Send a message to the user.</h2>

<code>/broadcast</code>. You can broadcast text messages to your users, messages will be sent from the last user joined to the first joined user to reduce spam. Try not to send too many messages at once if you have a large number of users.

<h2>How to find out the total number of bot users.</h2>

<code>/stats</code>. You will get total users started your bot, real time data will be updated after successful broadcast.
<hr>
