export default {
    dateChang:function(timestamp) {
        var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
        // var h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
        // var m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
        // var s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
        return Y+M+D;
    },
    dateChangHms:function(timestamp) {
        var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
        var h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
        var m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
        var s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
        return Y+M+D+h+m+s;
    },
    distinct: function(arr){
        var res = []
        var json = {}
        for (var i = 0; i < arr.length; i++) {
            if (!json[arr[i]]) {
            res.push(arr[i])
            json[arr[i]] = 1
            }
        }
        return res
    },
    encode:function (key, eles) {
        var keyVal = parseInt(key)
        var arr = []
        for(var i = 0; i < eles.length; ++i) {
            var ele = eles[i]
            arr.push(ele.length ^ keyVal)
            for(var j = 0; j < ele.length; ++j) {
                arr.push(ele[j].charCodeAt(0) ^ keyVal)
            }
        }
        arr.push(keyVal)
        var context = "CV16" + arr.join("%")
        return context;
    },

}
