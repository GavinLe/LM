
(function(e,t){var n=e.amplitude||{};var r=t.createElement("script");r.type="text/javascript";
  r.async=true;r.src="../libs/amplitude-2.9.0-min.gz.js";
  r.onload=function(){e.amplitude.runQueuedFunctions()};var s=t.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(r,s);var i=function(){this._q=[];return this};function a(e){
    i.prototype[e]=function(){this._q.push([e].concat(Array.prototype.slice.call(arguments,0)));
      return this}}var o=["add","append","clearAll","set","setOnce","unset"];for(var c=0;c<o.length;c++){
    a(o[c])}n.Identify=i;n._q=[];function u(e){n[e]=function(){n._q.push([e].concat(Array.prototype.slice.call(arguments,0)));
  }}var l=["init","logEvent","logRevenue","setUserId","setUserProperties","setOptOut","setVersionName","setDomain","setDeviceId","setGlobalUserProperties","identify","clearUserProperties"];
  for(var p=0;p<l.length;p++){u(l[p])}e.amplitude=n})(window,document);

console.log('use amplitude key:', BM_CONFIG.server.AMPLITUDE_KEY);

amplitude.init(BM_CONFIG.server.AMPLITUDE_KEY);

var log_service = {};

log_service.setUserId = function (userId) {
  amplitude.setUserId(userId);
};

log_service.trackPageView = function (url) {
  var evt = "PAGE_VIEW(" + url + ")";
  amplitude.logEvent(evt, {});
};

log_service.trackEvent = function (category, action, params) {
  var eventProperties = params || {};
  eventProperties['action'] = action;

  amplitude.logEvent(category, eventProperties);
};


module.exports.log_service = log_service;
