move-content-app
================

Jive app (based on node.js jive-sdk) for move content in bulk between groups / spaces

Please find my blog on Jive Community at http://bit.ly/1xGNBUA which mentions about this add-on.

This add-on is a good example which shows how jive-sdk can be used to develop node.js apps without much complex javascript frameworks.


#About the app

**Supported Jive versions**
- Jive 7.x hosted (tested on jive 7.0.1)
- Jive cloud (tested on release 8c4)
- Jive 7.x on-prem (assumption, i habve not tested on on-prem environment)

**App link location**
Displayed on the place tab as per app action mentioned here --> http://bit.ly/1zenS1g

The app in space does not show content from subspaces right now. Admin has to go to the particular sub space and access move content app there.

**Supported content move flows**
space->space
space->group 
group->group
group-space

**Supported content types** 
discussions 
documents 
files 
polls
ideas
events
videos
blog posts


#How To...
**Getting started with Jive node sdk**
Please refer Jive's official document at https://community.jivesoftware.com/docs/DOC-114053

**Steps to install move content app**
Assuming you ave gone through the above documentation from Jive

1. Checkout the code
2. put your node.js jive-sdk server's url in jiveclientconfiguration.json
3. run command "npm update" to download all the dependencies of this app.
4. Run command "node app" which will start the server and also generate an extension.zip
5. Upload the extension.zip to you Jive instance as mentioned in this offical jive document --> http://bit.ly/13zig97
The move content app is now ready to use.


**Selecting the target place**

Though the app right now is displayed in spaces as well as group, the place picker in the app to select target place supports only group by default.
Here are the code changes required to show space in the target place picker
- Find method displayTargetPlacePicker in movecontent.js
- In the call to osapi.jive.corev3.places.requestPicker, add option {type : "space"} as mentioned in jive doc http://bit.ly/1v9RA5i
- After this the place picker will start displaying spaces. 
 
- For Jive cloud 8c4 there is a better option to display spaces as well as groups in one place picker.
- Check the search picker at http://bit.ly/1v9RBWO which allows you to search places and people in one picker. You have to exculde people to ensure only places are searched. 


**How to add/remove content type to display in the app?**
The supported content types are in an array called SUPPORTED_CONTENT_TYPES in movecontent.js

**How to change number of content ti display on one page?**
Change the var ITEMS_PER_PAGE in movecontent.js. Default is 50

#Known issue

**Some content fail to move on first attempt**
I have seen an issue with jive's javascript api / REST api where too many simulteneous calls gives a 500 internal error for some contents. But they get moved in next attempt. 
So I have made the app's ui intuitive to show the progress of passed / failed content along with the usual spinner :)

After processing all content the app shows you a nice view of passed failed content and other option to refresh . show new content.
If you do find any failure then just click the green color Refresh content button within the app and move the new displayed content. There are high chances the content will be moved.

#Some FYIs
**Retaining the list of collaborators while moving a content.**
- If there is a content having multiple collaborators, that content object will have an extra list parameter called authors (along with the default  author). If one of the users in the authors in inactive, jive's api gives an error code "peopleNotActiveAccount". 
- In this situation we can either remove all collaborators and just retain the author or find the inactive author and remove that from the authors list.
- I decided to take the first approach as jive's default single content move feature removes all collaborators.
- Please note that if the content only has an author and not collaborator and if this author is inactive, then jive api allows the content update.
- So my app retains the author in call cases and retains the collaborators (authorsp[]) only if all collaborators are active.
 
**Categories for a content**
- The app removes categories of every content before moving it as categories applied to a content are specific to a place. 
- So a content's category will not be supported in the new group as that group might not have it. 
- Also jive's api gives correct error if we attempt to do this. So the app takes care of cleaning the categoried.
 

**Critical Fixes**

The checkin https://github.com/shahpawan/move-content-app/commit/f3306d160a5e66e09a2f86cd0a632f4b5021c3df is for a critical bug where app stops working if a content type supported by app is not supported by the current place.
I have put a wuick fix where I get all content types supported by a place, convert them into format accepted by content api (simple plural to singular) and also compare the list of supported content types between the app and the place. If a place does not support blog, I have hidden the blog tab for that place.
I am in process of converting this into an angular app, which will make the code better. For now, this checkin resolves this bug

