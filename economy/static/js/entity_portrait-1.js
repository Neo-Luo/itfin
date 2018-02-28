// 当前监测实体
    var monitorCount_url='/portraite/monitorCount/';
    public_ajax.call_request('get',monitorCount_url,monitorCount);
    function monitorCount(data){
        if(data){
            $('.com-1').text(data.all)
            $('.com-2').text(data.today)
        }
    }

// 渲染下拉框
    var select_url = '/detection/OperationModeBox/';    //运营模式
    public_ajax.call_request('get',select_url,slectUrl);
    function slectUrl(data){
        if(data){
            var str = '';
            for(var i=0;i<data.length;i++){
                str += '<option value="'+data[i].id+'">'+data[i].operation+'</option>'
            }
            $('#select-2').append(str);
        }
    }
    var select_url_2 = '/detection/IllegalTypeBox/';    //预警类型
    public_ajax.call_request('get',select_url_2,selectUrl_2);
    function selectUrl_2(data){
        // console.log(data);
        if(data){
            var str2 = '';
            for(var i=0;i<data.length;i++){
                str2 += '<option value="'+data[i].id+'">'+data[i].illegal_name+'</option>'
            }
            $('#select-3').append(str2);
        }
    }

// 适配分辨率
    var pageData=6;
    if (screen.width <= 1440){
        $('#container .secondScreen .box').css({'max-height':'308px','min-height':'308px'})
        pageData=6;
    }else {
        $('#container .secondScreen .box').css({'max-height':'510px','min-height':'510px'})
        pageData=10;
    }

// 一屏 表格
    // var peoPicture_url='/portraite/portrait/';
    var peoPicture_url='/portraite/portrait/?operation_mode=0&illegal_type=10000&entity_type=0&warn_distribute=all';
    public_ajax.call_request('get',peoPicture_url,peoPicture);

    function peoPicture(data) {
        $('#contentTable p.load').show();
        // console.log(data);
        $('#contentTable').bootstrapTable('load', data);
        $('#contentTable').bootstrapTable({
            data:data,
            search: true,//是否搜索
            pagination: true,//是否分页
            pageSize:pageData ,//单页记录数
            pageList: [15,20,25],//分页步进值
            sidePagination: "client",//服务端分页
            searchAlign: "left",
            searchOnEnterKey: false,//回车搜索
            showRefresh: false,//刷新按钮
            showColumns: false,//列选择按钮
            buttonsAlign: "right",//按钮对齐方式
            locale: "zh-CN",//中文支持
            detailView: false,
            showToggle:false,
            sortName:'bci',
            sortOrder:"desc",
            // sortStable:true,
            columns: [
                {
                    title: "监测对象",//标题
                    field: "entity_name",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                    formatter: function (value, row, index) {
                        if (row.entity_name==''||row.entity_name=='null'||row.entity_name=='unknown'||!row.entity_name){
                            return '未知';
                        }else {
                            return '<span style="cursor:pointer;color:white;" onclick="jumpFrame_1(\''+row.entity_name+
                                '\',\''+row.entity_type+'\',\''+row.id+'\')" title="进入画像">'+row.entity_name+'</span>';
                        };
                    }
                },
                {
                    title: "注册地",//标题
                    field: "province",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                    formatter: function (value, row, index) {
                        // var registAddress = row.regist_address;
                        var registAddress;
                        if(row.province == '北京' || row.province == '上海' || row.province == '天津' || row.province == '重庆'){
                            registAddress= row.city+row.district;
                        }else{
                            registAddress= row.province+row.city+row.district;
                        }
                        if (registAddress.length == 0){
                            return '未知';
                        }else {
                            // var i=registAddress.indexOf("市");
                            // registAddress = registAddress.substring(0,i+1);
                            return '<span style="cursor:pointer;color:white;" title="注册地">'+registAddress+'</span>';
                        };
                    }
                },
                {
                    title: "实体来源",//标题
                    field: "entity_source ",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                    formatter: function (value, row, index) {
                        var entitySource;
                        if(row.entity_source == 1){
                            entitySource = '网贷之家';
                        }else if(row.entity_source == 2 || row.entity_source == 3){
                            entitySource = '数据库';
                        }else if(row.entity_source == 2 ){
                            entitySource = '新感知';
                        }else if (row.entity_source==''||row.entity_source=='null'||row.entity_source=='unknown'||!row.entity_source){
                            entitySource = '未知';
                        }else {
                            entitySource = entity_source;
                        }
                        return entitySource;
                    }
                },
                {
                    title: "时间",//标题
                    field: "date",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                    formatter: function (value, row, index) {
                        if (row.date==''||row.date=='null'||row.date=='unknown'||!row.date){
                            return '未知';
                        }else {
                            return '<span style="cursor:pointer;color:white;" title="时间">'+row.date+'</span>';
                        };
                    }
                },

                {
                    title: "预警类型",//标题
                    field: "illegal_type",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                    formatter: function (value, row, index) {
                        if(row.illegal_type == 1){
                            return '模型预警';
                        }else if(row.illegal_type == 2){
                            return '舆情预警';
                        }else if(row.illegal_type == 3){
                            return '指标预警';
                        }else if (row.illegal_type==''||row.illegal_type=='null'||row.illegal_type=='unknown'||!row.illegal_type){
                            return '暂无';
                        }else {
                            return '暂无';
                        }

                    }
                },
                {
                    title: "实体类型",//标题
                    field: "entity_type",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                    formatter: function (value, row, index) {
                        if (row.entity_type==''||row.entity_type=='null'||row.entity_type=='unknown'||!row.entity_type){
                            return '未知';
                        }else if(row.entity_type == 1){
                            return '平台';
                        }else if(row.entity_type == 2){
                            return '公司';
                        }else if(row.entity_type == 3){
                            return '项目';
                        }
                    }
                },
                // {
                //     title: "运营模式",//标题
                //     field: "e",//键名
                //     sortable: true,//是否可排序
                //     order: "desc",//默认排序方式
                //     align: "center",//水平
                //     valign: "middle",//垂直
                //     formatter: function (value, row, index) {
                //         if (row.operation_mode==''||row.operation_mode=='null'||row.operation_mode=='unknown'||!row.operation_mode){
                //             return '未知';
                //         }else if(row.operation_mode == 1){
                //             return '互联网金融';
                //         }else if(row.operation_mode == 2){
                //             return '2';
                //         }else if(row.operation_mode == 3){
                //             return '3';
                //         }
                //         // return '互联网金融';
                //     }
                // },
                {
                    title: "运营模式",//标题
                    field: "operation_mode",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                    formatter: function (value, row, index) {
                        if (row.operation_mode==''||row.operation_mode=='null' || row.operation_mode==null ||row.operation_mode=='unknown'||!row.operation_mode){
                            // return '互联网金融';
                            return '未知';
                        }else {
                            // return '互联网金融'; // ====先写死====
                            return row.operation_mode;
                        };
                    }
                },
                {
                    title: "相关问题",//标题
                    field: "problem",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                    formatter: function (value, row, index) {
                        if (row.problem==''||row.problem=='null'|| row.problem==null || row.problem=='unknown'||!row.problem){
                            return '未知';
                        }else {
                            return row.problem;
                        };
                    }
                },
                {
                    title: "监测详情",//标题
                    field: "",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                    formatter: function (value, row, index) {
                        return '<span style="cursor:pointer;color:white;" onclick="jumpFrame_2(\''+row.entity_name+'\',\''+row.entity_type+'\',\''+row.id+'\',\''+row.illegal_type+'\')" title="查看详情"><i class="icon icon-file-alt"></i></span>';
                    }
                },
            ],
        });
        $('#contentTable p.load').hide();
        $('.contentTable .fixed-table-toolbar .search input').attr('placeholder','请输入查询内容');
    };

    // ===时间选项===
    // $('#select-1').change(function(){
    //     var selectTime = $(this).children('option:selected').val();//这就是selected的值
    //     // 运营模式
    //     var select_operation_mode = $(this).parents('.content').find('#select-2').val();
    //     // 预警类型
    //     var select_illegal_type = $(this).parents('.content').find('#select-3').val();
    //     // 实体类型
    //     var select_entity_type = $(this).parents('.content').find('#select-4').val();
    //     // 预警分布
    //     var select_warn_distribute = $(this).parents('.content').find('#city34').val();
    //     // earlyWarning_url = '/detection/detectData/?date='+selectTime;
    //     earlyWarning_url = '/detection/detectData/?date='+selectTime+'&operation_mode='+select_operation_mode+'&illegal_type='+select_illegal_type+'&entity_type='+select_entity_type+'&warn_distribute='+select_warn_distribute;
    //     console.log(earlyWarning_url);
    //     public_ajax.call_request('get',earlyWarning_url,earlyWarning);
    // })
    // ===运营模式选项===
    $('#select-2').change(function(){
        // var selectTime = $(this).parents('.content').find('#select-1').val();
        // 运营模式
        var select_operation_mode = $(this).val();
        // 预警类型
        var select_illegal_type = $(this).parents('.content').find('#select-3').val();
        // 实体类型
        var select_entity_type = $(this).parents('.content').find('#select-4').val();
        // 预警分布
        var select_warn_distribute = $(this).parents('.content').find('#city34').val();

        peoPicture_url = '/portraite/portrait/?operation_mode='+select_operation_mode+'&illegal_type='+select_illegal_type+'&entity_type='+select_entity_type+'&warn_distribute='+select_warn_distribute;
        console.log(peoPicture_url);
        public_ajax.call_request('get',peoPicture_url,peoPicture);
    })
    // ===预警类型选项===
    $('#select-3').change(function(){
        // var selectTime = $(this).parents('.content').find('#select-1').val();
        // 运营模式
        var select_operation_mode = $(this).parents('.content').find('#select-2').val();
        // 预警类型
        var select_illegal_type = $(this).val();
        // 实体类型
        var select_entity_type = $(this).parents('.content').find('#select-4').val();
        // 预警分布
        var select_warn_distribute = $(this).parents('.content').find('#city34').val();

        peoPicture_url = '/portraite/portrait/?operation_mode='+select_operation_mode+'&illegal_type='+select_illegal_type+'&entity_type='+select_entity_type+'&warn_distribute='+select_warn_distribute;
        console.log(peoPicture_url);
        public_ajax.call_request('get',peoPicture_url,peoPicture);
    })
    // ===实体类型选项===
    $('#select-4').change(function(){
        // var selectTime = $(this).parents('.content').find('#select-1').val();
        // 运营模式
        var select_operation_mode = $(this).parents('.content').find('#select-2').val();
        // 预警类型
        var select_illegal_type = $(this).parents('.content').find('#select-3').val();
        // 实体类型
        var select_entity_type = $(this).val();
        // 预警分布
        var select_warn_distribute = $(this).parents('.content').find('#city34').val();

        peoPicture_url = '/portraite/portrait/?operation_mode='+select_operation_mode+'&illegal_type='+select_illegal_type+'&entity_type='+select_entity_type+'&warn_distribute='+select_warn_distribute;
        console.log(peoPicture_url);
        public_ajax.call_request('get',peoPicture_url,peoPicture);
    })
    // ===预警分布选项===
    $('#city34').change(function(){
        // var selectTime = $(this).parents('.content').find('#select-1').val();
        // 运营模式
        var select_operation_mode = $(this).parents('.content').find('#select-2').val();
        // 预警类型
        var select_illegal_type = $(this).parents('.content').find('#select-3').val();
        // 实体类型
        var select_entity_type = $(this).parents('.content').find('#select-4').val();
        // 预警分布
        var select_warn_distribute = $(this).val();

        peoPicture_url = '/portraite/portrait/?operation_mode='+select_operation_mode+'&illegal_type='+select_illegal_type+'&entity_type='+select_entity_type+'&warn_distribute='+select_warn_distribute;
        console.log(peoPicture_url);
        public_ajax.call_request('get',peoPicture_url,peoPicture);
    })

// 点击进入公司详情页
    function jumpFrame_1(name,type,id) {
        var html='';
        name=escape(name);
        if (type=='1'||type=='2'){
            html='/index/company/?name='+name+'&flag='+type+'&pid='+id;
        }else {
            html='/index/project/?name='+name+'&flag='+type+'&pid='+id;
        }
        window.location.href=html;
    }

// 监测详情
    function jumpFrame_2(name,type,id,illegal_type) {
        // window.localStorage.setItem('monitorFlag',monitorFlag);
        // window.location.href='../templates/monitorDetails.html';
        var html = '';
        name=escape(name);
        if(illegal_type == 1){//模型预警 ----> 进入画像页
            html='/index/company/?name='+name+'&flag='+type+'&pid='+id;
        }else if(illegal_type == 2){//舆情预警 ----> 进入监测详情页
            html='/index/monitor/?name='+name+'&flag='+type+'&pid='+id;
        }else {
            html='/index/company/?name='+name+'&flag='+type+'&pid='+id;
        }

        // window.location.href='/index/monitor/';
        window.location.href=html;
    }
// ====索引====
    // var IndexesArr = $()
    $('.words b').on('click',function(){
        var letter = $(this).text().toLowerCase();
        if(letter == '#'){
            letter = 'num';
        }
        $(this).addClass('active').siblings().removeClass('active');
        var portrait_letter_url = '/portraite/portrait_letter/?letter='+letter;
        console.log(portrait_letter_url);
        public_ajax.call_request('get',portrait_letter_url,portrait_letter);
    })
    function portrait_letter (data) {
        if(data){
            $('#contentTable').bootstrapTable('load', data);
        }
    }


//第二屏---滚动
//公司
var allcompany_url='/portraite/company/';
public_ajax.call_request('get',allcompany_url,allcompany);
var phonehtml_1=[];
function allcompany(data) {
    if(data.length != 0){
        var line=data;
        var illegalType;
        for (var i=0;i<line.length;i++){
            if(data[i].illegal_type == 1){
                illegalType = '模型预警';
            }else if(data[i].illegal_type == 2){
                illegalType = '舆情预警';
            }else if(data[i].illegal_type == 3){
                illegalType = '指标预警';
            }
            phonehtml_1.push(
                '<p class="phone" type="button" data-toggle="modal" ' +
                'onclick="show(\''+line[i].entity_name+'\',\''+line[i].entity_type+'\',\''+line[i].id+'\')" onmousemove="chgecol(this)" onmouseout="back(this)">'+
                '<span class="iphone zjnum">'+line[i].entity_name+'</span>'+
                // '<span class="iphone bjnum">'+line[i]+'</span>'+
                '<span class="iphone bjnum">'+illegalType+'</span>'+
                '</p>'
            );
        };
        // $('.scroll-box').append(phonehtml.splice(0,5));
        $('.scroll-1').empty().append(phonehtml_1);
    }else {
        $('.scroll-1').children('center.load').text('暂无记录')
    }
}

// 平台
var allMonitor_url='/portraite/platform/';
public_ajax.call_request('get',allMonitor_url,allMonitor);
var phonehtml_2=[];
function allMonitor(data) {
    // console.log(data)
    if(data.length != 0){
        var line=data;
        var illegalType;
        for (var i=0;i<line.length;i++){
            if(data[i].illegal_type == 1){
                illegalType = '模型预警';
            }else if(data[i].illegal_type == 2){
                illegalType = '舆情预警';
            }else if(data[i].illegal_type == 3){
                illegalType = '指标预警';
            }

            phonehtml_2.push(
                '<p class="phone" type="button" data-toggle="modal" ' +
                'onclick="show(\''+line[i].entity_name+'\',\''+line[i].entity_type+'\',\''+line[i].id+'\')" onmousemove="chgecol(this)" onmouseout="back(this)">'+
                '<span class="iphone zjnum">'+line[i].entity_name+'</span>'+
                // '<span class="iphone bjnum">'+line[i]+'</span>'+
                '<span class="iphone bjnum">'+illegalType+'</span>'+
                '</p>'
            );
        };
        // $('.scroll-box').append(phonehtml.splice(0,5));
        $('.scroll-2').empty().append(phonehtml_2);
    }else {
        $('.scroll-2').children('center.load').text('暂无记录')
    }
}

// 项目
var allproject_url='/portraite/project/';
public_ajax.call_request('get',allproject_url,allproject);
var phonehtml_3=[];
function allproject(data) {
    // console.log(data)
    if(data.length != 0){
        var line=data;
        var illegalType;
        for (var i=0;i<line.length;i++){
            if(data[i].illegal_type == 1){
                illegalType = '模型预警';
            }else if(data[i].illegal_type == 2){
                illegalType = '舆情预警';
            }else if(data[i].illegal_type == 3){
                illegalType = '指标预警';
            }

            phonehtml_3.push(
                '<p class="phone" type="button" data-toggle="modal" ' +
                'onclick="show(\''+line[i].entity_name+'\',\''+line[i].entity_type+'\',\''+line[i].id+'\')" onmousemove="chgecol(this)" onmouseout="back(this)">'+
                '<span class="iphone zjnum">'+line[i].entity_name+'</span>'+
                // '<span class="iphone bjnum">'+line[i]+'</span>'+
                '<span class="iphone bjnum">'+illegalType+'</span>'+
                '</p>'
            );
        };
        // $('.scroll-box').append(phonehtml.splice(0,5));
        $('.scroll-3').empty().append(phonehtml_3);
    }else{
        $('.scroll-3').children('center.load').text('暂无记录')
    }

}


var $uList1 = $("#container .secondScreen .scroll-1");
var $uList2 = $("#container .secondScreen .scroll-2");
var $uList3 = $("#container .secondScreen .scroll-3");
var timer = null;
var timer2 = null;
var timer3 = null;
//触摸清空定时器
$uList1.hover(function() {
        clearInterval(timer);
    },
    function() { //离开启动定时器
        timer = setInterval(function() {
                scrollList_1($uList1);
            },
            // 1000);
            2500);
    }).trigger("mouseleave"); //自动触发触摸事件
//触摸清空定时器
$uList2.hover(function() {
        clearInterval(timer2);
    },
    function() { //离开启动定时器
        timer2 = setInterval(function() {
                scrollList_2($uList2);
            },
            // 1000);
            2500);
    }).trigger("mouseleave"); //自动触发触摸事件
//触摸清空定时器
$uList3.hover(function() {
        clearInterval(timer3);
    },
    function() { //离开启动定时器
        timer3 = setInterval(function() {
                scrollList_3($uList3);
            },
            // 1000);
            2500);
    }).trigger("mouseleave"); //自动触发触摸事件
//滚动动画
function scrollList_1(obj) {
    var len = $('.scroll-1 p').length;
    // console.log(len);
    // p标签不足6个 禁止滚动
    if(len < 6){
        return false;
    }else {
        //获得当前<li>的高度
        var scrollHeight = $(".scroll-1 p:first").height();
        //滚动出一个<li>的高度
        // $uList.stop().animate({
        $uList1.stop().animate({
                marginTop: -scrollHeight
            },
            600,
            function() {
                //动画结束后，将当前<ul>marginTop置为初始值0状态，再将第一个<li>拼接到末尾。
                       // $uList.css({
                       $uList1.css({
                           marginTop: 0
                       // }).find("p:first").appendTo($uList);
                       }).find("p:first").appendTo($uList1);
                // $uList.css({
                //     marginTop: 0
                // }).find("p:first").remove();
                // $('.scroll-box .box').append(phonehtml.shift());
            });
    }

};
function scrollList_2(obj) {
    //获得当前<li>的高度
    var scrollHeight = $(".scroll-2 p:first").height();
    //滚动出一个<li>的高度
    // $uList.stop().animate({
    $uList2.stop().animate({
            marginTop: -scrollHeight
        },
        600,
        function() {
            //动画结束后，将当前<ul>marginTop置为初始值0状态，再将第一个<li>拼接到末尾。
               $uList2.css({
                   marginTop: 0
               }).find("p:first").appendTo($uList2);
        });
};
function scrollList_3(obj) {
    //获得当前<li>的高度
    var scrollHeight = $(".scroll-3 p:first").height();
    //滚动出一个<li>的高度
    // $uList.stop().animate({
    $uList3.stop().animate({
            marginTop: -scrollHeight
        },
        600,
        function() {
            //动画结束后，将当前<ul>marginTop置为初始值0状态，再将第一个<li>拼接到末尾。
               $uList3.css({
                   marginTop: 0
               }).find("p:first").appendTo($uList3);
        });
};

function show(name,type,id) {
    var html='';
    name=escape(name);
    html='/index/company/?name='+name+'&flag='+type+'&pid='+id;
    window.location.href=html;
}
function chgecol(b) {

}
function back(c) {

}
