/**
 * Created by gavin on 16/4/11.
 */
$(document).ready(function () {
    var reg = /^1[3|4|5|7|8]\d{9}$/;

    var smsSignin = function () {
        var phone = $('#sms_ph').val();
        var code = $('#sms_code').val();
        if (!phone) {
            notie.alert(2, '手机号码不能为空');
            return;
        }
        if (!code) {
            notie.alert(2, '请输入验证码');
            return;
        }
        loading.showLoading();
        api.sign_in_sms(
            {
                phone: phone,
                code: code
            },
            function (result) {
                loading.hideLoading();
                stopTick($('.sms_send_btn'));
                if (result.code == 0){
                    ipc.send('sign in', result.data.token);
                }else{
                    notie.alert(2, result.message);
                }
            },
            function (code, err) {
                loading.hideLoading();
                notie.alert(3, err.message);
            });
        //ipc.send('sign in', 'cc58d03ab9144785ad1cd1069fa2731c');
    }

    var passwordSignin = function () {
        var phone = $('#password_text_ph').val();
        var password = $('#password_text_pw').val();
        if (!phone) {
            notie.alert(2, "手机号码不能为空");
            return;
        }else{
            if(!reg.test(phone)){
                notie.alert(2, '手机号码格式不对');
                return;
            }
        }
        if (!password) {
            notie.alert(2, "密码不能为空");
            return;
        }
        loading.showLoading();
        api.sign_in_password({
            phone: phone,
            password: password
        }, function (result) {
            loading.hideLoading();
            ipc.send('sign in', result.data.token);
        }, function (code, result) {
            loading.hideLoading();
            notie.alert(3, result.message)
        });
    };

    $('#passwordToSMS').on('click', function () {
        $('.sms_div').removeClass('hide');
        $('.password_div').addClass('hide');
    });

    $('#smsToPassword').on('click', function () {
        $('.sms_div').addClass('hide');
        $('.password_div').removeClass('hide');
    });

    $('.password_btn').on('click', passwordSignin);

    $('.sms_send_btn').on('click', function () {
        var phone = $('#sms_ph').val();
        if (!phone) {
            notie.alert(2, '手机号码不能为空');
            return;
        }else{
            if(!reg.test(phone)){
                notie.alert(2, '手机号码格式不对');
                return;
            }
        }
        loading.showLoading();
        api.send_sms(
            {phone: phone},
            function (result) {
                loading.hideLoading();
                startTick(60, $('.sms_send_btn'));
                notie.alert(1, '短信发送成功');
            }, function (code, err) {
                loading.hideLoading();
                notie.alert(3, err.message);
            }
        );
        //startTick(30 || 60, $('.sms_send_btn'));
    });

    $('.sms_signin_btn').on('click', smsSignin);

    $(".password_div").keydown(function (e) {
        if (e && e.keyCode == 13) { // enter 键
            var phone = $('#password_text_ph').val();
            var password = $('#password_text_pw').val();
            if (!phone) {
                notie.alert(2, "手机号码不能为空");
                return;
            }else{
                if(!reg.test(phone)){
                    notie.alert(2, '手机号码格式不对');
                    return;
                }
            }
            if (!password) {
                notie.alert(2, "密码不能为空");
                return;
            }
            loading.showLoading();
            api.sign_in_password({
                phone: phone,
                password: password
            }, function (result) {
                loading.hideLoading();
                ipc.send('sign in', result.data.token);
            }, function (code, result) {
                loading.hideLoading();
                notie.alert(3, result.message)
            });
        }
    })

    $(".sms_div").keydown(function (e) {
        if (e && e.keyCode == 13) { // enter 键
            var phone = $('#sms_ph').val();
            var code = $('#sms_code').val();
            if (!phone) {
                notie.alert(2, '手机号码不能为空');
                return;
            }
            if (!code) {
                notie.alert(2, '请输入验证码');
                return;
            }
            loading.showLoading();
            api.sign_in_sms({
                phone: phone,
                code: code
            },
            function (result) {
                loading.hideLoading();
                stopTick($('.sms_send_btn'));
                if (result.code == 0){
                    ipc.send('sign in', result.data.token);
                }else{
                    notie.alert(2, result.message);
                }
            },
            function (code, err) {
                loading.hideLoading();
                notie.alert(3, err.message);
            });
        }
    })


    // 倒计时器 send 已发送短信还剩多少秒
    var num = 0;
    var interval;

    function tick(self) {
        if (num <= 0) {
            stopTick(self);
        } else {
            self.attr("disabled", true);
            self.empty().append("验证码已发送(" + num + ")");
            num--;
        }
    }

    function startTick(seconds, self) {
        num = seconds;
        interval = window.setInterval(tick, 1000, self);
    }

    function stopTick(self) {
        window.clearInterval(interval);
        self.removeAttr("disabled");
        self.empty().append("获取短信验证码");
        window.clearInterval(interval);
        num = 0;
    }

    $('.save_pw_btn').on('click', function(){
        var password = $('#password_text_pw').val();
        var againPassword  =  $('#password_text_apw').val();
        if ( !(7< againPassword.length  && againPassword.length < 17 )){
          notie.alert(2, '密码长度要大于等于8位小于等于16');
          return;
        }
        else if ( password !== againPassword ){
          notie.alert(2, '两次输入的密码要一致');
          return;
        }
        loading.showLoading();
        api.set_password({
          token: token,
          password: againPassword
        }, function(result) {
            loading.hideLoading();
            ipc.send('set password success', token);
        }, function (code, result) {
            loading.hideLoading();
            notie.alert(2, result.message);
        })
    });

    $('.save_pf_btn').on('click', function(){
        var nickname = $('#profile_text_nickname').val();
        var companyName  =  $('#profile_text_company').val();
        var description = $('#profile_text_description').val();

        if (!nickname) {
            notie.alert(2,'请输入姓名');
            return;
        }
        if (!companyName) {
            notie.alert(2,'请输入公司名称');
            return;
        }
        loading.showLoading();
        api.set_profile({
            token: token,
            nickname: nickname,
            company: companyName,
            description: description
        }, function (result){
            loading.hideLoading();
            ipc.send('set profile success', token);
        }, function (code, result){
            loading.hideLoading();
            notie.alert(3,result.message)
        })
    });

});
