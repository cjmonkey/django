function CourseDetail() {
}

CourseDetail.prototype.initPlayer = function () {
    var videoInfoSpan = $("#video-info");
    var video_url = videoInfoSpan.attr("data-video-url");
    var cover_url = videoInfoSpan.attr("data-cover-url");
    var course_id = videoInfoSpan.attr('data-course-id');

    var player = cyberplayer("playercontainer").setup({
        width: '100%',
        height: '100%',
        file: video_url,
        image: cover_url,
        autostart: false,
        stretching: "uniform",
        repeat: false,
        volume: 100,
        controls: true,
        tokenEncrypt: true,
        // AccessKey
        ak: '2455bac3eebc4de8b94995c764013dc1'
    });

    player.on('beforePlay', function (e) {
        if (!/m3u8/.test(e.file)) {
            return;
        }
        xfzajax.get({
            'url': '/course/course_token/',
            'data': {
                'video': video_url,
                'course_id': course_id
            },
            'success': function (result) {
                if (result['code'] === 200) {
                    var token = result['data']['token'];
                    // player.setToken(e.file, token);
                    player.setToken(e.file, '7d00a6de70f11d37b247e1b194a11bc932a99493f4b70fea66c95b2c7e32a201_77267b92707b4ba3996100d292039c48 _1596481745');
                } else {
                    window.messageBox.showInfo(result['message']);
                    player.stop();
                }
            },
            'fail': function (error) {
                console.log(error);
            }
        });
    });
};

CourseDetail.prototype.run = function () {
    this.initPlayer();
};


$(function () {
    var courseDetail = new CourseDetail();
    courseDetail.run();
});
