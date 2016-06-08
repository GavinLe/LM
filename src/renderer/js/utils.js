/**
 * Created by gavin on 16/4/20.
 */

;(function(){
    /**
    * 解析 main 渲染窗口参数
    * #foo=name&foo1=value  ==> {foo:name, foo1:value}
    */
    function GetUrlParams(){
        var args=new Object();
        var query=decodeURI(window.location.href.substring(window.location.href.lastIndexOf("#")+1));//获取查询串
        var pairs=query.split("&");//在逗号处断开
        for(var i=0;i<pairs.length;i++){
            var pos=pairs[i].indexOf('=');//查找name=value
                if(pos==-1)   continue;//如果没有找到就跳过
                var key=pairs[i].substring(0,pos);//提取name
                var value=pairs[i].substring(pos+1);//提取value
                args[key]=value;//存为属性
        }
        return args;
    }

    /**
    * 生成一个uuid
    *
    */
    function uuid(){
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";
        return s.join("");
    }

    /**
    * 格式化时间
    * datetime 要格式的时间  format 格式化的格式
    */
    function dateFormat(datetime, format) {
        datetime = new Date(datetime);
        var date = {
            "M+": datetime.getMonth() + 1,
            "d+": datetime.getDate(),
            "h+": datetime.getHours(),
            "m+": datetime.getMinutes(),
            "s+": datetime.getSeconds(),
            "q+": Math.floor((datetime.getMonth() + 3) / 3),
            "S+": datetime.getMilliseconds()
        };
        if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (datetime.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in date) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
            }
        }
        return format;
    };


    window.BMUtils={
        GetUrlParams:GetUrlParams,
        uuid: uuid,
        dateFormat:dateFormat
    }
})();
