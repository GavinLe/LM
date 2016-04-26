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
    window.BMUtils={
        GetUrlParams:GetUrlParams
    }
})();
