/**
 * Created by gavin on 16/3/16.
 */
'use strict';

//let $loading = $('.loading').hide();
//
//let showLoading = function(){
//    $loading.removeClass('hide').show();
//};
//
//module.exports.showLoading = showLoading;
//
//let hideLoading = function(){
//    $loading.addClass('hide').hide();
//};
//module.exports.hideLoading = hideLoading;

;(function($){
    var $loading = $('.loading');
    window.loading = {
        showLoading: function () {
            $loading.removeClass('hide').show();
        },
        hideLoading: function () {
            $loading.addClass('hide').hide();
        }
    };
    return loading;
})(window.jQuery);