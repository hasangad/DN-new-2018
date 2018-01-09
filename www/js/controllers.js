angular.module('WordApp.controllers', [])

.controller('AppCtrl', function($scope, IONIC_APP_COLOR, LNG_MENU_POSTS, LNG_MENU_CATEGORIES, LNG_MENU_BOOKMARKS, LNG_MENU_SETTINGS, LNG_MENU_ABOUT, LNG_CATEGORY_TITLE, LNG_NO_DATA, LNG_SEARCH) {
    $scope.color = IONIC_APP_COLOR;
    $scope.lng_menu_posts = LNG_MENU_POSTS;  
    $scope.lng_menu_categories = LNG_MENU_CATEGORIES;  
    $scope.lng_menu_bookmarks = LNG_MENU_BOOKMARKS;  
    $scope.lng_menu_settings = LNG_MENU_SETTINGS; 
    $scope.lng_menu_about = LNG_MENU_ABOUT;
    $scope.lng_category_title = LNG_CATEGORY_TITLE;    
    $scope.lng_no_data = LNG_NO_DATA;  
    $scope.lng_search = LNG_SEARCH;       
})

.controller('PostCtrl', function($scope, $ionicModal, $ionicPopup, $stateParams, DataLoader, WORDPRESS_API_URL, IONIC_APP_COLOR, LNG_POST_TITLE, LNG_POSTED, LNG_IN, LNG_COMMENTS_COUNT, LNG_NO_COMMENTS, LNG_FONT_ADJUST, LNG_ADD_COMMENT, LNG_TOAST_NO_DATA, LNG_SHARE_BUTTON, $ionicLoading, $sce, CacheFactory, $log, Bookmark, $timeout) {
    $scope.color = IONIC_APP_COLOR;
    $scope.lng_post_title = LNG_POST_TITLE;
    $scope.lng_posted = LNG_POSTED;  
    $scope.lng_in = LNG_IN;
    $scope.lng_comments_count = LNG_COMMENTS_COUNT;   
    $scope.lng_no_comments = LNG_NO_COMMENTS;
    $scope.lng_add_comment = LNG_ADD_COMMENT;
   

    $scope.loadImages = JSON.parse(localStorage.getItem('images'));

    if (!CacheFactory.get('postCache')) {
        CacheFactory.createCache('postCache');
    }

    var postCache = CacheFactory.get('postCache');

    $scope.itemID = $stateParams.postId;

    var singlePostApi = WORDPRESS_API_URL + 'posts/' + $scope.itemID;

    $scope.loadPost = function() {

        // Fetch remote post
        $ionicLoading.show({
            noBackdrop: true
        });

        DataLoader.get(singlePostApi).then(function(response) {

            $scope.post = response.data;

            $log.debug($scope.post);

            // Don't strip post html
            $scope.content = $sce.trustAsHtml(response.data.content.rendered);

            // $scope.comments = $scope.post._embedded['replies'][0];

            // add post to our cache
            postCache.put(response.data.id, response.data);

            $ionicLoading.hide();
        }, function(response) {
            $log.error('error', response);
            $timeout(function() {
                $ionicLoading.hide();
                window.plugins.toast.show('' + LNG_TOAST_NO_DATA + '', '8000', 'center', function(a) {}, function(b) {});
            }, 8000);
        });

    }

    if (!postCache.get($scope.itemID)) {

        // Item is not in cache, go get it
        $scope.loadPost();

    } else {
        // Item exists, use cached item
        $scope.post = postCache.get($scope.itemID);
        $scope.content = $sce.trustAsHtml($scope.post.content.rendered);
        // $scope.comments = $scope.post._embedded['replies'][0];
    }

    // Load comments
    var commentsApi = WORDPRESS_API_URL + 'comments?post=' + $scope.itemID + '&per_page=100';

    $scope.loadComments = function() {

            $ionicLoading.show({
                noBackdrop: true
            });

            // Get all of our comments

            DataLoader.get(commentsApi).then(function(response) {

                $scope.comments = response.data;

                $log.log(commentsApi, response.data);

                $ionicLoading.hide();
            }, function(response) {
                $log.log(commentsApi, response.data);
            });

        }
        // Load comments on page load
    $scope.loadComments();

    // Add Comment
    $ionicModal.fromTemplateUrl('templates/modal/comment.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.addComment_modal = modal;
    });

    $scope.addComment = function() {
        $scope.addComment_modal.show();
    };

    // Show full image
    $scope.showImage = function(imageurl) {
        window.open(imageurl, '_blank', 'location=no,enableViewportScale=yes');
    }


    // Font decrease/increase 
    $scope.vm = {
        fontSize: 14
    }

    if (localStorage.fontSize) {
        $scope.vm.fontSize = parseInt(localStorage.fontSize);
    }

    $scope.$watch('vm.fontSize', function(newValue, oldValue) {
        console.log(newValue);
        localStorage.fontSize = newValue;
    });

    $scope.fontAdjust = function() {
        var popup = $ionicPopup.show({
            template: '<text-size-slider min="10" max="18" unit="px" value="vm.fontSize" step="0"></text-size-slider>',
            title: ''+LNG_FONT_ADJUST+'',
            scope: $scope,
            buttons: [{
                text: '<b>OK</b>',
                type: 'button-' + IONIC_APP_COLOR
            }]
        });
    };

    // Sharing
    $scope.sharePost = function(link) {
        window.plugins.socialsharing.share('' + LNG_SHARE_BUTTON + ' ', null, null, link);
    }

    // Bookmarking
    $scope.bookmarked = Bookmark.check($scope.itemID);

    $scope.bookmarkItem = function(id) {

        if ($scope.bookmarked) {
            Bookmark.remove(id);
            $scope.bookmarked = false;
        } else {
            Bookmark.set(id);
            $scope.bookmarked = true;
        }
    }

    // Pull to refresh
    $scope.doRefresh = function() {

        $timeout(function() {

            $scope.loadPost();
            $scope.loadComments();
            //Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');

        }, 1000);

    };

})

.controller('CommentCtrl', function($scope, $ionicLoading, $ionicScrollDelegate, $timeout, $http, $ionicModal, $stateParams, WORDPRESS_API_URL, LNG_ADD_COMMENT, LNG_NAME, LNG_COMMENT, LNG_EMAIL_REQ, LNG_EMAIL_VALID, LNG_NAME_CHARACTER, LNG_NAME_REQ, LNG_COMMENT_REQ, LNG_COMMENT_CHARACTER, LNG_COMMENT_POSTED, LNG_COMMENT_NOT_POSTED, LNG_COMMENT_APPROVAL) {
    
    $scope.lng_add_comment = LNG_ADD_COMMENT;
    $scope.lng_name = LNG_NAME;
    $scope.lng_comment = LNG_COMMENT;
    $scope.lng_email_req = LNG_EMAIL_REQ;
    $scope.lng_email_valid = LNG_EMAIL_VALID;
    $scope.lng_name_character = LNG_NAME_CHARACTER;
    $scope.lng_name_req = LNG_NAME_REQ;
    $scope.lng_comment_req = LNG_COMMENT_REQ;
    $scope.lng_comment_character = LNG_COMMENT_CHARACTER;   

    $scope.itemID = $stateParams.postId;

    $scope.checkEmail = localStorage.getItem('comment_email', $scope.email);

    if ($scope.checkEmail) {
        $scope.email = localStorage.getItem('comment_email', $scope.email);
    } else {
        $scope.email = '';
    }

    $scope.checkName = localStorage.getItem('comment_name', $scope.name);

    if ($scope.checkName) {
        $scope.name = localStorage.getItem('comment_name', $scope.name);
    } else {
        $scope.name = '';
    }

    //Submit comment
    $scope.submitComment = function() {

        localStorage.setItem('comment_email', $scope.email);
        localStorage.setItem('comment_name', $scope.name);

        $scope.addComment_modal.hide();

        $http({
            method: 'POST',
            url: WORDPRESS_API_URL + 'comments?' +
                'author_email=' + $scope.email +
                '&author_name=' + $scope.name +
                '&content=' + $scope.comment +
                '&post=' + $scope.itemID,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function(res, status, header) {
            console.log('Comment posted...!', res.status);
            if (res.status == 'approved') {
                $ionicLoading.show({
                    template: '' + LNG_COMMENT_POSTED + ''
                });
                $timeout(function() {
                    $ionicLoading.hide();
                    $scope.loadComments();
                    $scope.comment = '';
                }, 3000);
                $timeout(function() {
                    // Scroll to new comment
                    $ionicScrollDelegate.scrollBottom(true);
                }, 4000);

            }
            if (res.status == 'hold') {
                $ionicLoading.show({
                    template: '' + LNG_COMMENT_APPROVAL + ''
                });
                $timeout(function() {
                    $ionicLoading.hide();
                    $scope.comment = '';
                }, 3000);
            }
        }).error(function(err) {
            console.error('' + LNG_COMMENT_NOT_POSTED + '', err);
            $ionicLoading.show({
                template: '' + LNG_COMMENT_NOT_POSTED + ''
            });
            $timeout(function() {
                $ionicLoading.hide();
            }, 3000);
        });

    };
})

.controller('PostsCtrl', function($scope, $state, $http, DataLoader, WORDPRESS_API_URL, IONIC_APP_COLOR, LNG_TOAST_NO_DATA, $ionicLoading, $timeout, $ionicSlideBoxDelegate, $log) {
    $scope.color = IONIC_APP_COLOR;

    $scope.loadImages = JSON.parse(localStorage.getItem('images'));

    $scope.gotoPost = function(postid) {
        $state.go('app.post', {
            'postId': +postid
        });
    };
	
    // Show Posts from All Categories
    var postsApi = WORDPRESS_API_URL + 'posts';
	
	// Include Posts from Categories IDs, don't forget make changes in CategoriesCtrl
    //var categoriesApi = WORDPRESS_API_URL + 'posts?filter[cat]=1,2,3';

    $scope.moreItems = false;

    $scope.loadPosts = function() {

            $ionicLoading.show({
                noBackdrop: true
            });

            // Get all of our posts

            DataLoader.get(postsApi).then(function(response) {

                $scope.posts = response.data;

                $scope.moreItems = true;

                $log.log(postsApi, response.data);

                $ionicLoading.hide();
            }, function(response) {
                $log.log(postsApi, response.data);
                $timeout(function() {
                    $ionicLoading.hide();
                    window.plugins.toast.show('' + LNG_TOAST_NO_DATA + '', '8000', 'center', function(a) {}, function(b) {});
                }, 8000);
            });

        }
        // Load posts on page load
    $scope.loadPosts();

    paged = 2;

    // Load more (infinite scroll)
    $scope.loadMore = function() {

        if (!$scope.moreItems) {
            return;
        }

        var pg = paged++;

        $log.log('loadMore ' + pg);

        $timeout(function() {

            DataLoader.get(postsApi + '?page=' + pg).then(function(response) {

                angular.forEach(response.data, function(value, key) {
                    $scope.posts.push(value);
                });

                if (response.data.length <= 0) {
                    $scope.moreItems = false;
                }

                $scope.$broadcast('scroll.infiniteScrollComplete');

            }, function(response) {
                $scope.moreItems = false;
                $log.error(response);
            });

        }, 1000);

    }

    $scope.moreDataExists = function() {
        return $scope.moreItems;
    }

    // Pull to refresh
    $scope.doRefresh = function() {
        $scope.loadImages = JSON.parse(localStorage.getItem('images'));

        $timeout(function() {

            $scope.loadPosts();

            paged = 2;

            //Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');

        }, 1000);

    };

})

.controller('CategoriesCtrl', function($scope, $http, DataLoader, $ionicLoading, $timeout, $ionicSlideBoxDelegate, WORDPRESS_API_URL, IONIC_APP_COLOR, $log) {
    $scope.color = IONIC_APP_COLOR;
	
    // Show All Categories
    var categoriesApi = WORDPRESS_API_URL + 'categories';
	
	// Include Categories IDs, don't forget make changes in PostsCtrl
    //var categoriesApi = WORDPRESS_API_URL + 'categories?include=1,2,3';

    $scope.moreItems = false;

    $scope.loadCategories = function() {

        $ionicLoading.show({
            noBackdrop: true
        });

        // Get all of our categories
        DataLoader.get(categoriesApi).then(function(response) {

            $scope.categories = response.data;

            $scope.moreItems = true;

            $log.log(categoriesApi, response.data);

            $ionicLoading.hide();
        }, function(response) {
            $log.log(categoriesApi, response.data);
            $ionicLoading.hide();
        });

    }

    // Load posts on page load
    $scope.loadCategories();

    paged = 2;

    // Load more (infinite scroll)
    $scope.loadMore = function() {

        if (!$scope.moreItems) {
            return;
        }

        var pg = paged++;

        $log.log('loadMore ' + pg);

        $timeout(function() {

            DataLoader.get(categoriesApi + '?page=' + pg).then(function(response) {

                angular.forEach(response.data, function(value, key) {
                    $scope.categories.push(value);
                });

                if (response.data.length <= 0) {
                    $scope.moreItems = false;
                }
            }, function(response) {
                $scope.moreItems = false;
                $log.error(response);
            });

            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.$broadcast('scroll.resize');

        }, 1000);

    }

    $scope.moreDataExists = function() {
        return $scope.moreItems;
    }

    // Pull to refresh
    $scope.doRefresh = function() {

        $timeout(function() {

            $scope.loadCategories();

            //Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');

        }, 1000);

    }

    // Accordion list
    $scope.group = [];

    $scope.toggleGroup = function(group) {
        if ($scope.isGroupShown(group)) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = group;
        }
    };
    $scope.isGroupShown = function(group) {
        return $scope.shownGroup === group;
    };

})

.controller('CategoryCtrl', function($scope, $state, $stateParams, $http, DataLoader, $ionicLoading, $timeout, $ionicSlideBoxDelegate, WORDPRESS_API_URL, IONIC_APP_COLOR, LNG_TOAST_NO_DATA, $log) {
    $scope.color = IONIC_APP_COLOR;

    $scope.loadImages = JSON.parse(localStorage.getItem('images'));

    $scope.gotoPost = function(postid) {
        $state.go('app.post', {
            'postId': +postid
        });
    };

    $scope.itemID = $stateParams.categoryId;

    var categoryApi = WORDPRESS_API_URL + 'posts?categories=' + $scope.itemID;

    $scope.moreItems = false;

    $scope.loadCategory = function() {

        $ionicLoading.show({
            noBackdrop: true
        });

        // Get all of our posts in category
        DataLoader.get(categoryApi).then(function(response) {

            $scope.category = response.data;

            $scope.moreItems = true;

            $log.log(categoryApi, response.data);

            $ionicLoading.hide();
        }, function(response) {
            $log.log(categoryApi, response.data);
            $timeout(function() {
                $ionicLoading.hide();
                window.plugins.toast.show('' + LNG_TOAST_NO_DATA + '', '8000', 'center', function(a) {}, function(b) {});
            }, 8000);
        });

    }

    // Load posts on page load
    $scope.loadCategory();

    paged = 2;

    // Load more (infinite scroll)
    $scope.loadMore = function() {

        if (!$scope.moreItems) {
            return;
        }

        var pg = paged++;

        $log.log('loadMore ' + pg);

        $timeout(function() {

            DataLoader.get(categoryApi + '&page=' + pg).then(function(response) {

                angular.forEach(response.data, function(value, key) {
                    $scope.category.push(value);
                });

                if (response.data.length <= 0) {
                    $scope.moreItems = false;
                }

                $scope.$broadcast('scroll.infiniteScrollComplete');

            }, function(response) {
                $scope.moreItems = false;
                $log.error(response);
            });

        }, 1000);

    }

    $scope.moreDataExists = function() {
        return $scope.moreItems;
    }

    // Pull to refresh
    $scope.doRefresh = function() {

        $timeout(function() {

            $scope.loadCategory();

            paged = 2;

            //Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');

        }, 1000);

    };

})

.controller('SearchCtrl', function($scope, $state, $stateParams, $http, DataLoader, $ionicLoading, $timeout, $ionicSlideBoxDelegate, WORDPRESS_API_URL, IONIC_APP_COLOR, LNG_TOAST_NO_DATA, $log) {
    $scope.color = IONIC_APP_COLOR;

    $scope.loadImages = JSON.parse(localStorage.getItem('images'));

    $scope.gotoPost = function(postid) {
        $state.go('app.post', {
            'postId': +postid
        });
    };

    $scope.Request = $stateParams.request;

    var searchApi = WORDPRESS_API_URL + 'posts/?search=' + $scope.Request;

    $scope.moreItems = false;

    $scope.loadResults = function() {

        $ionicLoading.show({
            noBackdrop: true
        });

        // Get all of our posts in results
        DataLoader.get(searchApi).then(function(response) {

            $scope.results = response.data;

            $scope.moreItems = true;

            $log.log(searchApi, response.data);

            $ionicLoading.hide();
        }, function(response) {
            $log.log(searchApi, response.data);
            $timeout(function() {
                $ionicLoading.hide();
                window.plugins.toast.show('' + LNG_TOAST_NO_DATA + '', '8000', 'center', function(a) {}, function(b) {});
            }, 8000);
        });

    }

    // Load search results
    $scope.loadResults();

    paged = 2;

    // Load more (infinite scroll)
    $scope.loadMore = function() {

        if (!$scope.moreItems) {
            return;
        }

        var pg = paged++;

        $log.log('loadMore ' + pg);

        $timeout(function() {

            DataLoader.get(searchApi + '&page=' + pg).then(function(response) {

                angular.forEach(response.data, function(value, key) {
                    $scope.results.push(value);
                });

                if (response.data.length <= 0) {
                    $scope.moreItems = false;
                }

                $scope.$broadcast('scroll.infiniteScrollComplete');

            }, function(response) {
                $scope.moreItems = false;
                $log.error(response);
            });

        }, 1000);

    }

    $scope.moreDataExists = function() {
        return $scope.moreItems;
    }

    // Pull to refresh
    $scope.doRefresh = function() {

        $timeout(function() {

            $scope.loadResults();

            paged = 2;

            //Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');

        }, 1000);

    };

})

.controller('BookmarksCtrl', function($scope, $state, $http, DataLoader, $timeout, $rootScope, $log, Bookmark, CacheFactory, LNG_NO_BOOKMARKS) {

    $scope.lng_no_bookmarks = LNG_NO_BOOKMARKS;

    $scope.gotoPost = function(postid) {
        $state.go('app.post', {
            'postId': +postid
        });
    };

    $scope.$on('$ionicView.enter', function(e) {

        if (!CacheFactory.get('postCache')) {
            CacheFactory.createCache('postCache');
        }

        var postCache = CacheFactory.get('postCache');

        if (!CacheFactory.get('bookmarkCache')) {
            CacheFactory.createCache('bookmarkCache');
        }

        var bookmarkCacheKeys = CacheFactory.get('bookmarkCache').keys();

        $scope.posts = [];

        angular.forEach(bookmarkCacheKeys, function(value, key) {
            var newPost = postCache.get(value);
            $scope.posts.push(newPost);
        });

    });

})

.controller('SettingsCtrl', function($scope, $log, $ionicModal, IONIC_APP_COLOR, ANDROID_PACKAGE_NAME, IOS_APP_ID, LNG_SETTINGS, LNG_PUSH_NOTIFICATION, LNG_SHOW_IMAGES, LNG_OPTIONS, LNG_RATE_APP, LNG_FEEDBACK, LNG_SEND_SMS) {

    $scope.color = IONIC_APP_COLOR;
    $scope.lng_settings = LNG_SETTINGS;
    $scope.lng_push_notification = LNG_PUSH_NOTIFICATION; 
    $scope.lng_show_images = LNG_SHOW_IMAGES
    $scope.lng_options = LNG_OPTIONS;
    $scope.lng_rate_this_app = LNG_RATE_APP;
    $scope.lng_send_feedback = LNG_FEEDBACK;    
    $scope.lng_send_sms = LNG_SEND_SMS;

    // Push Notification
    $scope.pushNotificationItem = localStorage.getItem('check');

    if ($scope.pushNotificationItem) {
        var push = localStorage.getItem('check');
        $scope.pushNotification = {
            checked: JSON.parse(push)
        };
        console.log('Push', push);
    } else {
        $scope.pushNotification = {
            checked: true
        };
    }

    $scope.pushNotificationChange = function() {

        if ($scope.pushNotification.checked == true) {
            console.log('Push', $scope.pushNotification.checked);
            localStorage.setItem('check', $scope.pushNotification.checked);
            window.plugins.OneSignal.setSubscription(true);
        }
        if ($scope.pushNotification.checked == false) {
            console.log('Push', $scope.pushNotification.checked);
            localStorage.setItem('check', $scope.pushNotification.checked);
            window.plugins.OneSignal.setSubscription(false);
        }
    };

    // Load Images
    $scope.loadImagesItem = localStorage.getItem('images');
    if ($scope.loadImagesItem) {
        var loadimg = localStorage.getItem('images');
        $scope.loadImages = {
            checked: JSON.parse(loadimg)
        };
        console.log('Load Images', loadimg);
    } else {
        $scope.loadImages = {
            checked: true
        };
    }

    $scope.loadImagesChange = function() {

        if ($scope.loadImages.checked == true) {
            console.log('Load Images', $scope.loadImages.checked);
            localStorage.setItem('images', $scope.loadImages.checked);
        }
        if ($scope.loadImages.checked == false) {
            console.log('Load Images', $scope.loadImages.checked);
            localStorage.setItem('images', $scope.loadImages.checked);
        }
    };

    // Rate app
    $scope.rateApp = function() {

        if (ionic.Platform.isIOS()) {
            AppRate.preferences.storeAppURL.ios = IOS_APP_ID;
            AppRate.promptForRating(true);
        } else if (ionic.Platform.isAndroid()) {
            AppRate.preferences.storeAppURL.android = 'market://details?id=' + ANDROID_PACKAGE_NAME;
            AppRate.promptForRating(true);
        }

    };

    // Send Email
    $ionicModal.fromTemplateUrl('templates/modal/sendfeedback.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.feedback_modal = modal;
    });

    $scope.feedback = function() {
        $scope.feedback_modal.show();
    };


    // Send SMS
    $ionicModal.fromTemplateUrl('templates/modal/sendsms.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.sms_modal = modal;
    });

    $scope.sendSMS = function() {
        $scope.sms_modal.show();
    };

})

.controller('EmailCtrl', function($scope, PRIMARY_EMAIL, COPY_EMAIL, LNG_SEND_FEEDBACK, LNG_SUBJECT, LNG_MESSAGE, LNG_SUBJECT_REQ, LNG_SUBJECT_CHARACTER, LNG_MESSAGE_REQ, LNG_MESSAGE_CHARACTER) {

    $scope.lng_send_feedback = LNG_SEND_FEEDBACK;
    $scope.lng_subject = LNG_SUBJECT;
    $scope.lng_message = LNG_MESSAGE;
    $scope.lng_subject_req = LNG_SUBJECT_REQ;
    $scope.lng_subject_characters = LNG_SUBJECT_CHARACTER;
    $scope.lng_message_req = LNG_MESSAGE_REQ;
    $scope.lng_message_characters = LNG_MESSAGE_CHARACTER;

    $scope.sendFeedback = function() {

        window.plugin.email.open({
            to: ['' + PRIMARY_EMAIL + ''],
            cc: ['' + COPY_EMAIL + ''],
            subject: '' + $scope.subject + '',
            body: '' + $scope.message + '',
            isHtml: true
        });

    };

})

.controller('SmsCtrl', function($scope, $ionicPopup, SMS_PHONE_NUMBER, LNG_SEND_SMS_MODAL, LNG_MESSAGE_SMS, LNG_MESSAGE_REQ_SMS, LNG_MESSAGE_CHARACTER_SMS, LNG_MESSAGE_SUCCESS_SMS, LNG_MESSAGE_FAIL_SMS) {

    $scope.lng_send_sms = LNG_SEND_SMS_MODAL;
    $scope.lng_message_sms = LNG_MESSAGE_SMS;
    $scope.lng_message_req_sms = LNG_MESSAGE_REQ_SMS;
    $scope.lng_message_characters_sms = LNG_MESSAGE_CHARACTER_SMS;    

    $scope.sendSms = function() {

        console.log('number=' + SMS_PHONE_NUMBER + ', message=' + $scope.message);

        var number = SMS_PHONE_NUMBER;
        var message = $scope.message;

        //CONFIGURATION
        var options = {
            replaceLineBreaks: false, // true to replace \n by a new line, false by default
            android: {
                //intent: 'INTENT'  // send SMS with the native android SMS messaging
                intent: '' // send SMS without open any other app
            }
        };

        var success = function() {
            $ionicPopup.alert({
                title: 'SMS',
                template: '' + LNG_MESSAGE_SUCCESS_SMS + '',
                okType: 'button-' + $scope.color,
            });
        };

        var error = function(e) {
            $ionicPopup.alert({
                title: 'SMS',
                template: '' + LNG_MESSAGE_FAIL_SMS + '' + e,
                okType: 'button-' + $scope.color,
            });
        };

        sms.send(number, message, options, success, error);


    };

})