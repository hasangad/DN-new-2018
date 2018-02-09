angular.module('WordApp.translate', [])

// Translate app.js 
.constant('LNG_TOAST_BACK_BUTTON', 'Press back button again to exit')
.constant('LNG_SHARE_BUTTON', 'Check this post here:')

// Translate global and menu.html
.constant('LNG_MENU_POSTS', 'Posts')
.constant('LNG_MENU_CATEGORIES', 'Categories')
.constant('LNG_MENU_BOOKMARKS', 'Bookmarks')
.constant('LNG_MENU_SETTINGS', 'Settings')
.constant('LNG_MENU_ABOUT', 'About')
.constant('LNG_CATEGORY_TITLE', 'Category Posts')
.constant('LNG_NO_DATA', 'Pull to refresh')
.constant('LNG_SEARCH', 'Search')
.constant('LNG_TOAST_NO_DATA', 'Sorry, no data response. Please verify your connection and pull to refresh page.')

// Translate Setting.html
.constant('LNG_SETTINGS', 'Settings')
.constant('LNG_PUSH_NOTIFICATION', 'Push Notifications')
.constant('LNG_SHOW_IMAGES', 'Show Images')
.constant('LNG_OPTIONS', 'Options')
.constant('LNG_RATE_APP', 'Rate this App')
.constant('LNG_FEEDBACK', 'Send Feedback')
.constant('LNG_SEND_SMS', 'Send SMS')

// Translate Bookmarks
.constant('LNG_NO_BOOKMARKS', 'No bookmarks yet')
.constant('LNG_ADD_BOOKMARK', 'Bookmarked')
.constant('LNG_REMOVE_BOOKMARK', 'Removed')

// Translate Post.html
.constant('LNG_POST_TITLE', 'Post')
.constant('LNG_POSTED', 'Posted')
.constant('LNG_IN', 'in')
.constant('LNG_COMMENTS_COUNT', 'Comments')
.constant('LNG_NO_COMMENTS', 'No comments yet')
.constant('LNG_FONT_ADJUST', 'Font Adjust')

// Translate Comment.html
.constant('LNG_ADD_COMMENT', 'Add Comment')
.constant('LNG_NAME', 'Name')
.constant('LNG_COMMENT', 'Comment')
.constant('LNG_EMAIL_REQ', 'Email is required')
.constant('LNG_EMAIL_VALID', 'Email must be an email address')
.constant('LNG_NAME_CHARACTER', 'Name must be longer than 5 characters')
.constant('LNG_NAME_REQ', 'Name is required')
.constant('LNG_COMMENT_REQ', 'Comment is required')
.constant('LNG_COMMENT_CHARACTER', 'Comment must be longer than 5 characters')
.constant('LNG_COMMENT_POSTED', 'Comment posted!')
.constant('LNG_COMMENT_NOT_POSTED', 'Comment not posted!')
.constant('LNG_COMMENT_APPROVAL', 'This is your first comment. Comment waiting for approval!')

// Translate Sendfeedback.html
.constant('LNG_SEND_FEEDBACK', 'Send Feedback')
.constant('LNG_SUBJECT', 'Subject')
.constant('LNG_MESSAGE', 'Message')
.constant('LNG_SUBJECT_REQ', 'Subject is required')
.constant('LNG_SUBJECT_CHARACTER', 'Subject must be longer than 5 characters')
.constant('LNG_MESSAGE_REQ', 'Message is required')
.constant('LNG_MESSAGE_CHARACTER', 'Message must be longer than 5 characters')

// Translate Sendsms.html
.constant('LNG_SEND_SMS_MODAL', 'Send SMS15')
.constant('LNG_MESSAGE_SMS', 'Message')
.constant('LNG_MESSAGE_REQ_SMS', 'Message is required')
.constant('LNG_MESSAGE_CHARACTER_SMS', 'Message must be longer than 5 and shorter than 160 characters')
.constant('LNG_MESSAGE_SUCCESS_SMS', 'Message sent successfully')
.constant('LNG_MESSAGE_FAIL_SMS', 'Message Failed:')