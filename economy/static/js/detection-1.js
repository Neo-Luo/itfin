
// 判断登录状态 =============
    if(role_id != 1 && role_id != 2){//未登录 // 只显示第二屏  没有操作列

        $('.fullpage .firstScreen').remove();//删除第一屏
        $('.fullpage').fullpage({
            'verticalCentered': false,
            'css3': true,
            'anchors': ['page1', 'page2','page3','page4','page5',],
            'navigation': 'true',
            'loopBottom':'true',
            'navigationPosition': 'right',
            'navigationTooltips': ['预警记录','预警态势及类型','预警分布','运营模式','预警排名'],
            'fixedElements':'#nav,#Success,#reason,#result,#MonitorStatus_off,#problemEdit',//不跟随滚动的元素

            'normalScrollElements':'#reason .modal-dialog,#perceiveContent .modal-dialog'//鼠标在此元素 不滚屏
        });
        // 不显示操作列
        var _earlyWarning_url='/detection/secondDetectData/?date=7&operation_mode=all&illegal_type=0&entity_type=0&warn_distribute=all&problem=all&newEntity=0';
        public_ajax.call_request('get',_earlyWarning_url,_earlyWarning);
        function _earlyWarning(data) {
            // console.log(data);
            $('#_recordingTable p.load').show();
            // 获取最早预警时间 加入数据中=========
            var mindate_url = '/detection/minDate';
            public_ajax.call_request('get',mindate_url,minDate);
            var data_1 = [];
            var data_2 = data;
            function minDate(data){
                data_1 = data;

                for(var i=0;i<data_2.length;i++){
                    data_2[i].minDate = data_1[data_2[i].id]
                }
                // console.log(data_2);
                // 获取最早预警时间 加入数据中=========

                // $('#recordingTable').bootstrapTable('destroy');
                $('#_recordingTable').bootstrapTable('load', data_2);
                $('#_recordingTable').bootstrapTable({
                    data:data_2,
                    search: true,//是否搜索
                    pagination: true,//是否分页
                    pageSize: pageData,//单页记录数
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
                                    return '<span style="cursor:pointer;color:white;" onclick="jumpFrame_1(\''+row.entity_name+'\',\''+row.entity_type+'\',\''+row.id+'\')" title="进入画像">'+row.entity_name+'</span>';
                                };
                            }
                        },
                        {
                            title: "预警指数",//标题
                            field: " ",//键名
                            sortable: true,//是否可排序
                            order: "desc",//默认排序方式
                            align: "center",//水平
                            valign: "middle",//垂直
                            formatter: function (value, row, index) {
                                if (row.illegal_score==''||row.illegal_score=='null'||row.illegal_score=='unknown'||!row.illegal_score){
                                    return '未知';
                                }else {
                                    return row.illegal_score;
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
                                var registAddress;
                                if(row.province == '北京' || row.province == '上海' || row.province == '天津' || row.province == '重庆'){
                                    registAddress= row.city+row.district;
                                }else{
                                    registAddress= row.province+row.city+row.district;
                                }
                                if (registAddress.length == 0 || row.province==''||row.province=='null'||row.province=='unknown'||!row.province){
                                    return '未知';
                                }else {
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
                                }else if(row.entity_source == 2){
                                    entitySource = '人工导入';
                                }else if( row.entity_source == 3){
                                    entitySource = '数据库';
                                }else if(row.entity_source == 4 ){
                                    entitySource = '系统感知';
                                }else if (row.entity_source==''||row.entity_source=='null'||row.entity_source=='unknown'||!row.entity_source){
                                    entitySource = '未知';
                                }else {
                                    entitySource = entity_source;
                                }
                                return entitySource;
                            }
                        },
                        {
                            title: "此次预警时间",//标题
                            field: "date",//键名
                            sortable: true,//是否可排序
                            order: "desc",//默认排序方式
                            align: "center",//水平
                            valign: "middle",//垂直
                            formatter: function (value, row, index) {
                                if (row.date==''||row.date=='null'||row.date=='unknown'||!row.date){
                                    return '未知';
                                }else {
                                    return '<span style="cursor:pointer;color:white;" title="此次预警时间">'+row.date+'</span>';
                                };
                            }
                        },
                        {
                            title: "最早预警时间",//标题
                            field: "minDate",//键名
                            sortable: true,//是否可排序
                            order: "desc",//默认排序方式
                            align: "center",//水平
                            valign: "middle",//垂直
                            formatter: function (value, row, index) {
                                if (row.minDate==''||row.minDate=='null'||row.minDate=='unknown'||!row.minDate){
                                    return '未知';
                                }else {
                                    return '<span style="cursor:pointer;color:white;" title="最早预警时间">'+row.minDate+'</span>';
                                };
                            }
                        },
                        {
                            title: "预警理由",//标题
                            field: "illegal_type",//键名
                            sortable: true,//是否可排序
                            order: "desc",//默认排序方式
                            align: "center",//水平
                            valign: "middle",//垂直
                            formatter: function (value, row, index) {
                                var warningReasons = '';

                                if(row.comment_rank > 75){
                                    warningReasons += '负面舆情多;<br>';
                                }
                                if(row.suit_rank > 75){
                                    warningReasons += '诉讼记录多;<br>';
                                }

                                if(row.ad_rank > 75){
                                    warningReasons += '煽动性广告多;<br>';
                                }
                                if(row.return_rank > 75){
                                    warningReasons += '收益率过高;<br>';
                                }
                                if(row.abnor_rank > 75){
                                    warningReasons += '经营异常多;<br>';
                                }
                                if(row.promise_type ==1 || row.promise_type ==2){
                                    warningReasons += '存在担保承诺;<br>';
                                }
                                if(!row.comment_rank && !row.suit_rank && !row.ad_rank && !row.return_rank && !row.abnor_rank && !row.promise_type){
                                    warningReasons = '暂无'
                                }
                                if(row.comment_rank <= 75 && row.suit_rank <= 75 && row.ad_rank <= 75  && row.return_rank <= 75 && row.abnor_rank <= 75 && row.promise_type != 1 && row.promise_type != 2){
                                    warningReasons = '暂无'
                                }


                                return '<span style="cursor:pointer;color:white;" title="预警理由">'+warningReasons+'</span>';
                            }
                        },
                        {
                            title: "业态类型",//标题
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
                            title: "问题平台",//标题
                            field: "problem",//键名
                            sortable: true,//是否可排序
                            order: "desc",//默认排序方式
                            align: "center",//水平
                            valign: "middle",//垂直
                            formatter: function (value, row, index) {
                                if (row.problem==''||row.problem=='null'|| row.problem==null || row.problem=='unknown'||!row.problem){
                                    return '无';
                                }else {
                                    return row.problem;
                                };
                            }
                        },
                        {
                            title: "监测详情",//标题
                            field: "f",//键名
                            sortable: true,//是否可排序
                            order: "desc",//默认排序方式
                            align: "center",//水平
                            valign: "middle",//垂直
                            formatter: function (value, row, index) {
                                return '<span style="cursor:pointer;color:white;" onclick="jumpFrame_2(\''+row.entity_name+'\',\''+row.entity_type+'\',\''+row.id+'\',\''+row.illegal_type+'\')" title="查看详情"><i class="icon icon-file-alt"></i></span>';
                            }
                        },
                        // 未登录 不显示操作列
                    ],
                });
                $('#_recordingTable p.load').hide();
                $('._firstScreen .recordingTable .fixed-table-toolbar .search input').attr('placeholder','请输入查询内容');
            }
        };

    }else{                      // 登录 后  显示第一屏。  一屏复制版表格 加回操作列
        $('.fullpage').fullpage({
            'verticalCentered': false,
            'css3': true,
            'anchors': ['page1', 'page2','page3','page4','page5','page6'],
            'navigation': 'true',
            'loopBottom':'true',
            'navigationPosition': 'right',
            'navigationTooltips': ['预警记录','预警记录','预警态势及类型','预警分布','运营模式','预警排名'],

            'fixedElements':'#nav,#Success,#reason,#result,#MonitorStatus_off,#problemEdit',//不跟随滚动的元素

            'normalScrollElements':'#reason .modal-dialog,#perceiveContent .modal-dialog'//鼠标在此元素 不滚屏
        });
        // 全部显示
        // 一屏复制版表格 加回操作列
        var _earlyWarning_url='/detection/secondDetectData/?date=7&operation_mode=all&illegal_type=0&entity_type=0&warn_distribute=all&problem=all&newEntity=0';
        public_ajax.call_request('get',_earlyWarning_url,_earlyWarning);
        function _earlyWarning(data) {
            // console.log(data);
            $('#_recordingTable p.load').show();
            // 获取最早预警时间 加入数据中=========
            var mindate_url = '/detection/minDate';
            public_ajax.call_request('get',mindate_url,minDate);
            var data_1 = [];
            var data_2 = data;
            function minDate(data){
                data_1 = data;

                for(var i=0;i<data_2.length;i++){
                    data_2[i].minDate = data_1[data_2[i].id]
                }
                // console.log(data_2);
                // 获取最早预警时间 加入数据中=========

                // $('#recordingTable').bootstrapTable('destroy');
                $('#_recordingTable').bootstrapTable('load', data_2);
                $('#_recordingTable').bootstrapTable({
                    data:data_2,
                    search: true,//是否搜索
                    pagination: true,//是否分页
                    pageSize: pageData,//单页记录数
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
                                    return '<span style="cursor:pointer;color:white;" onclick="jumpFrame_1(\''+row.entity_name+'\',\''+row.entity_type+'\',\''+row.id+'\')" title="进入画像">'+row.entity_name+'</span>';
                                };
                            }
                        },
                        {
                            title: "预警指数",//标题
                            field: " ",//键名
                            sortable: true,//是否可排序
                            order: "desc",//默认排序方式
                            align: "center",//水平
                            valign: "middle",//垂直
                            formatter: function (value, row, index) {
                                if (row.illegal_score==''||row.illegal_score=='null'||row.illegal_score=='unknown'||!row.illegal_score){
                                    return '未知';
                                }else {
                                    return row.illegal_score;
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
                                var registAddress;
                                if(row.province == '北京' || row.province == '上海' || row.province == '天津' || row.province == '重庆'){
                                    registAddress= row.city+row.district;
                                }else{
                                    registAddress= row.province+row.city+row.district;
                                }
                                if (registAddress.length == 0 || row.province==''||row.province=='null'||row.province=='unknown'||!row.province){
                                    return '未知';
                                }else {
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
                                }else if(row.entity_source == 2){
                                    entitySource = '人工导入';
                                }else if( row.entity_source == 3){
                                    entitySource = '数据库';
                                }else if(row.entity_source == 4 ){
                                    entitySource = '系统感知';
                                }else if (row.entity_source==''||row.entity_source=='null'||row.entity_source=='unknown'||!row.entity_source){
                                    entitySource = '未知';
                                }else {
                                    entitySource = entity_source;
                                }
                                return entitySource;
                            }
                        },
                        {
                            title: "此次预警时间",//标题
                            field: "date",//键名
                            sortable: true,//是否可排序
                            order: "desc",//默认排序方式
                            align: "center",//水平
                            valign: "middle",//垂直
                            formatter: function (value, row, index) {
                                if (row.date==''||row.date=='null'||row.date=='unknown'||!row.date){
                                    return '未知';
                                }else {
                                    return '<span style="cursor:pointer;color:white;" title="此次预警时间">'+row.date+'</span>';
                                };
                            }
                        },
                        {
                            title: "最早预警时间",//标题
                            field: "minDate",//键名
                            sortable: true,//是否可排序
                            order: "desc",//默认排序方式
                            align: "center",//水平
                            valign: "middle",//垂直
                            formatter: function (value, row, index) {
                                if (row.minDate==''||row.minDate=='null'||row.minDate=='unknown'||!row.minDate){
                                    return '未知';
                                }else {
                                    return '<span style="cursor:pointer;color:white;" title="最早预警时间">'+row.minDate+'</span>';
                                };
                            }
                        },
                        {
                            title: "预警理由",//标题
                            field: "illegal_type",//键名
                            sortable: true,//是否可排序
                            order: "desc",//默认排序方式
                            align: "center",//水平
                            valign: "middle",//垂直
                            formatter: function (value, row, index) {
                                var warningReasons = '';
                                /*
                                    var illegal_type_str = row.illegal_type.toString();
                                    if(row.illegal_type==1){
                                        warningReasons = '模型预警';
                                    }else if(row.illegal_type==2){
                                        warningReasons = '舆情预警';
                                    }else if(row.illegal_type==3){
                                        warningReasons = '指标预警';
                                    }else if(illegal_type_str == "1,2" || illegal_type_str == "2,1"){
                                        warningReasons = '模型预警/舆情预警';
                                    }else if(illegal_type_str == "1,3" || illegal_type_str == "3,1"){
                                        warningReasons = '模型预警/指标预警';
                                    }else if(illegal_type_str == "2,3" || illegal_type_str == "3,2"){
                                        warningReasons = '舆情预警/指标预警';
                                    }else if(illegal_type_str == "1,2,3" || illegal_type_str == "1,3,2" || illegal_type_str == "2,1,3" || illegal_type_str == "2,3,1" || illegal_type_str == "3,1,2" || illegal_type_str == "3,2,1"){
                                        warningReasons = '模型预警/舆情预警/指标预警';
                                    }
                                    if (row.illegal_type==''||row.illegal_type=='null'||row.illegal_type=='unknown'||!row.illegal_type){
                                        return '未知';
                                    }else{
                                        return '<span style="cursor:pointer;color:white;" title="预警理由">'+warningReasons+'</span>';
                                    };
                                 */

                                if(row.comment_rank > 75){
                                    warningReasons += '负面舆情多;<br>';
                                }
                                if(row.suit_rank > 75){
                                    warningReasons += '诉讼记录多;<br>';
                                }

                                if(row.ad_rank > 75){
                                    warningReasons += '煽动性广告多;<br>';
                                }
                                if(row.return_rank > 75){
                                    warningReasons += '收益率过高;<br>';
                                }
                                if(row.abnor_rank > 75){
                                    warningReasons += '经营异常多;<br>';
                                }
                                if(row.promise_type ==1 || row.promise_type ==2){
                                    warningReasons += '存在担保承诺;<br>';
                                }
                                if(!row.comment_rank && !row.suit_rank && !row.ad_rank && !row.return_rank && !row.abnor_rank && !row.promise_type){
                                    warningReasons = '暂无'
                                }
                                if(row.comment_rank <= 75 && row.suit_rank <= 75 && row.ad_rank <= 75  && row.return_rank <= 75 && row.abnor_rank <= 75 && row.promise_type != 1 && row.promise_type != 2){
                                    warningReasons = '暂无'
                                }


                                return '<span style="cursor:pointer;color:white;" title="预警理由">'+warningReasons+'</span>';
                            }
                        },
                        {
                            title: "业态类型",//标题
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
                            title: "问题平台",//标题
                            field: "problem",//键名
                            sortable: true,//是否可排序
                            order: "desc",//默认排序方式
                            align: "center",//水平
                            valign: "middle",//垂直
                            formatter: function (value, row, index) {
                                if (row.problem==''||row.problem=='null'|| row.problem==null || row.problem=='unknown'||!row.problem){
                                    return '无';
                                }else {
                                    return row.problem;
                                };
                            }
                        },
                        {
                            title: "监测详情",//标题
                            field: "f",//键名
                            sortable: true,//是否可排序
                            order: "desc",//默认排序方式
                            align: "center",//水平
                            valign: "middle",//垂直
                            formatter: function (value, row, index) {
                                return '<span style="cursor:pointer;color:white;" onclick="jumpFrame_2(\''+row.entity_name+'\',\''+row.entity_type+'\',\''+row.id+'\',\''+row.illegal_type+'\')" title="查看详情"><i class="icon icon-file-alt"></i></span>';
                            }
                        },
                        {
                            title: "一键取证",//标题
                            field: "",//键名
                            sortable: true,//是否可排序
                            order: "desc",//默认排序方式
                            align: "center",//水平
                            valign: "middle",//垂直
                            formatter: function (value, row, index) {
                                return '<span style="cursor:pointer;color:white;" onclick="prove(\''+row.a+'\')" title="一键取证"><i class="icon icon-signin"></i></span>';
                            }
                        },
                        {
                            title: "预警结果审核",//标题  (与 一屏 用一个的函数 根据screen参数区分)
                            field: "support_num",//键名
                            sortable: true,//是否可排序
                            order: "desc",//默认排序方式
                            align: "center",//水平
                            valign: "middle",//垂直
                            formatter: function (value, row, index) {
                                var str = '<span style="cursor:pointer;color:white;margin-right:10px;" onclick="resultCheck(\''+row.date+'\',\''+row.id+'\',1,\''+row.illegal_type+'\',\''+row.entity_name+'\',\''+row.support_num+'\',\''+row.problem+'\',\''+'_first'+'\')" title="赞成预警"><i class="icon icon-thumbs-up"></i>('+row.support_num+')</span>'+

                                    '<span style="cursor:pointer;color:white;" onclick="resultCheck(\''+row.date+'\',\''+row.id+'\',0,\''+row.illegal_type+'\',\''+row.entity_name+'\',\''+row.against_num+'\',\''+row.problem+'\',\''+'_first'+'\')" title="反对预警"><i class="icon icon-thumbs-down"></i>('+row.against_num+')</span>';
                                return str;
                            }
                        },
                        {
                            title: "审核详情",//标题 （与一屏表格用一个函数）
                            field: "",//键名
                            sortable: true,//是否可排序
                            order: "desc",//默认排序方式
                            align: "center",//水平
                            valign: "middle",//垂直
                            formatter: function (value, row, index) {
                                return '<span style="cursor:pointer;color:white;" onclick="jumpFrame_3(\''+row.id+'\')" title="查看审核详情"><i class="icon icon-hand-up"></i></span>';
                            }
                        },
                        {
                            title: "操作",//标题
                            field: "",//键名
                            sortable: true,//是否可排序
                            order: "desc",//默认排序方式
                            align: "center",//水平
                            valign: "middle",//垂直
                            formatter: function (value, row, index) {
                                var str = '<span style="cursor:pointer;color:white;margin-right:10px;" onclick="jumpFrame_edit(\''+row.id+'\',\''+row.entity_name+'\',\''+row.date+'\',\''+row.problem+'\',\''+'_first'+'\')" title="编辑问题平台"><i class="icon icon-edit"></i></span>';

                                var title = '';
                                if(row.monitor_status == 1){//正在监测状态
                                    title = '停止监测';
                                    style = 'color:#0088ff;'
                                }else if(row.monitor_status == 2){//已停止监测
                                    title = '恢复监测';
                                    style = 'color:#fff;'
                                }
                                // console.log(row.monitor_status);

                                str += '<span style="cursor:pointer;color:white;" onclick="jumpFrame_stop(\''+row.monitor_status+'\',\''+row.entity_name+'\',\''+row.id+'\',\''+row.date+'\',\''+'_first'+'\')" title=\''+title+'\'><i class="icon icon-retweet" style=\''+style+'\'></i></span>';

                                return str;
                            }
                        },
                    ],
                });
                $('#_recordingTable p.load').hide();
                $('._firstScreen .recordingTable .fixed-table-toolbar .search input').attr('placeholder','请输入查询内容');
            }
        };

    }
// 判断登录状态 =============

// ====预警数====
    // var warnCount_url = '/detection/warnCount/';
    var warnCount_url = '/detection/newWarnEntity/';
    public_ajax.call_request('get',warnCount_url,warnCount);
    function warnCount(data){
        if(data){
            // $('.firstScreen .topTitle .com-3').text(data.seven + '次');
            // $('.firstScreen .topTitle .com-2').text(data.thirty + '次');
            // $('.firstScreen .topTitle .com-1').text(data.ninty + '次');

            $('.firstScreen .topTitle .com-3').text('新增'+data.count7 + '家');
            $('.firstScreen .topTitle .com-2').text('新增'+data.count30 + '家');
            $('.firstScreen .topTitle .com-1').text('新增'+data.count90 + '家');
        }
    }
    // 预警平台数
    var warnCount_url_1 = '/detection/WarnEntityCount/';
    public_ajax.call_request('get',warnCount_url_1,warnCount_1);
    function warnCount_1(data){
        if(data){
            $('.firstScreen .topTitle .com-4').text(data.seven + '家');
            $('.firstScreen .topTitle .com-5').text(data.thirty + '家');
            $('.firstScreen .topTitle .com-6').text(data.ninty + '家');
        }
    }

    // 二屏._firstScreen
    // var _warnCount_url = '/detection/secondWarnCount/';
    var _warnCount_url = '/detection/secondNewWarnEntity/';
    public_ajax.call_request('get',_warnCount_url,_warnCount);
    function _warnCount(data){
        if(data){
            // $('._firstScreen .topTitle .com-3').text(data.seven + '次');
            // $('._firstScreen .topTitle .com-2').text(data.thirty + '次');
            // $('._firstScreen .topTitle .com-1').text(data.ninty + '次');

            $('._firstScreen .topTitle .com-3').text('新增'+data.count7 + '家');
            $('._firstScreen .topTitle .com-2').text('新增'+data.count30 + '家');
            $('._firstScreen .topTitle .com-1').text('新增'+data.count90 + '家');
        }
    }
    // 预警平台数
    var _warnCount_url_1 = '/detection/secondWarnEntityCount/';
    public_ajax.call_request('get',_warnCount_url_1,_warnCount_1);
    function _warnCount_1(data){
        if(data){
            $('._firstScreen .topTitle .com-4').text(data.seven + '家');
            $('._firstScreen .topTitle .com-5').text(data.thirty + '家');
            $('._firstScreen .topTitle .com-6').text(data.ninty + '家');
        }
    }

// 渲染下拉框
    var select_url = '/detection/OperationModeBox/';    //运营模式
    public_ajax.call_request('get',select_url,slectUrl);
    function slectUrl(data){
        if(data){
            var str = '';
            for(var i=0;i<data.length;i++){
                str += '<option value="'+data[i].operation+'">'+data[i].operation+'</option>'
            }
            $('#select-2').append(str);
            $('#_select-2').append(str);
            $('#second_select-2').append(str);
            $('#second_select-2-2').append(str);
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
            $('#_select-3').append(str2);
            $('#second_select-3').append(str2);
            $('#second_select-3-2').append(str2);
        }
    }

    // 问题平台（相关问题）下拉框
    var select_url_3 = '/detection/ProblemBox/';    //相关问题
    public_ajax.call_request('get',select_url_3,selectUrl_3);
    function selectUrl_3(data){
        // console.log(data);
        if(data){
            var str3 = '';
            for(var i=0;i<data.length;i++){
                str3 += '<option value="'+data[i].problem+'">'+data[i].problem+'</option>'
            }
            $('#select-5').append(str3);
            $('#_select-5').append(str3);
        }
    }

// 预警记录表格表注
    // 取画像页当前监测实体
    var monitorCount_url='/portraite/monitorCount/';
    public_ajax.call_request('get',monitorCount_url,monitorCount);
    function monitorCount(data){
        if(data){
            $('.firstScreen .monitoring-all,._firstScreen .monitoring-all').text(data.all);
        }
    }

// 适配分辨率
    var pageData=5;
    if (screen.width <= 1440){
        pageData=5;
    }else {
        pageData=8;
    }

//====预警记录====

    // 前台分页
    var earlyWarning_url='/detection/totalDetectData/?date=7&operation_mode=all&illegal_type=0&entity_type=0&warn_distribute=all&problem=all&newEntity=0';
    public_ajax.call_request('get',earlyWarning_url,earlyWarning);
    function earlyWarning(data) {
        $('#recordingTable p.load').show();
        // console.log(data);

        // 获取最早预警时间 加入数据中=========
        var mindate_url = '/detection/minDate';
        public_ajax.call_request('get',mindate_url,minDate);
        var data_1 = [];
        var data_2 = data;
        function minDate(data){
            data_1 = data;

            // console.log(data_1);
            // console.log(data_2);

            // for(var i=0;i<data_2.length;i++){
            //     for(var j=0;j<data_1.length;j++){
            //         if(data_2[i].id === data_1[j].id){
            //             data_2[i].minDate = data_1[j].minDate;
            //             break;
            //         }
            //     }
            // }

            for(var i=0;i<data_2.length;i++){
                data_2[i].minDate = data_1[data_2[i].id]
            }
            // console.log(data_2);
            // 获取最早预警时间 加入数据中=========

            // $('#recordingTable').bootstrapTable('destroy');
            $('#recordingTable').bootstrapTable('load', data_2);
            $('#recordingTable').bootstrapTable({
                data:data_2,
                search: true,//是否搜索
                pagination: true,//是否分页
                pageSize: pageData,//单页记录数
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
                                return '<span style="cursor:pointer;color:white;" onclick="jumpFrame_1(\''+row.entity_name+'\',\''+row.entity_type+'\',\''+row.id+'\')" title="进入画像">'+row.entity_name+'</span>';
                            };
                        }
                    },
                    {
                        title: "预警指数",//标题
                        field: "illegal_score",//键名
                        sortable: true,//是否可排序
                        order: "desc",//默认排序方式
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value, row, index) {
                            if (row.illegal_score==''||row.illegal_score=='null'||row.illegal_score=='unknown'||!row.illegal_score){
                                return '未知';
                            }else {
                                return row.illegal_score;
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
                            var registAddress;
                            if(row.province == '北京' || row.province == '上海' || row.province == '天津' || row.province == '重庆'){
                                registAddress= row.city+row.district;
                            }else{
                                registAddress= row.province+row.city+row.district;
                            }
                            if (registAddress.length == 0 || row.province==''||row.province=='null'||row.province=='unknown'||!row.province){
                                return '未知';
                            }else {
                                return '<span style="cursor:pointer;color:white;" title="注册地">'+registAddress+'</span>';
                            };
                        }
                    },
                    {
                        title: "实体来源",//标题
                        field: "entity_source",//键名
                        sortable: true,//是否可排序
                        order: "desc",//默认排序方式
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value, row, index) {
                            var entitySource;
                            if(row.entity_source == 1){
                                entitySource = '网贷之家';
                            }else if(row.entity_source == 2){
                                entitySource = '人工导入';
                            }else if( row.entity_source == 3){
                                entitySource = '数据库';
                            }else if(row.entity_source == 4 ){
                                entitySource = '系统感知';
                            }else if (row.entity_source==''||row.entity_source=='null'||row.entity_source=='unknown'||!row.entity_source){
                                entitySource = '未知';
                            }else {
                                entitySource = entity_source;
                            }
                            return entitySource;
                        }
                    },
                    {
                        title: "此次预警时间",//标题
                        field: "date",//键名
                        sortable: true,//是否可排序
                        order: "desc",//默认排序方式
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value, row, index) {
                            if (row.date==''||row.date=='null'||row.date=='unknown'||!row.date){
                                return '未知';
                            }else {
                                return '<span style="cursor:pointer;color:white;" title="此次预警时间">'+row.date+'</span>';
                            };
                        }
                    },
                    {
                        title: "最早预警时间",//标题
                        field: "minDate",//键名
                        sortable: true,//是否可排序
                        order: "desc",//默认排序方式
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value, row, index) {
                            if (row.minDate==''||row.minDate=='null'||row.minDate=='unknown'||!row.minDate){
                                return '未知';
                            }else {
                                return '<span style="cursor:pointer;color:white;" title="最早预警时间">'+row.minDate+'</span>';
                            };
                        }
                    },
                    {
                        title: "预警理由",//标题
                        field: "illegal_type",//键名
                        sortable: true,//是否可排序
                        order: "desc",//默认排序方式
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value, row, index) {
                            var warningReasons = '';

                            // var illegal_type_str = row.illegal_type.toString();
                            // if(row.illegal_type==1){
                            //     warningReasons = '模型预警';
                            // }else if(row.illegal_type==2){
                            //     warningReasons = '舆情预警';
                            // }else if(row.illegal_type==3){
                            //     warningReasons = '指标预警';
                            // }else if(illegal_type_str == "1,2" || illegal_type_str == "2,1"){
                            //     warningReasons = '模型预警/舆情预警';
                            // }else if(illegal_type_str == "1,3" || illegal_type_str == "3,1"){
                            //     warningReasons = '模型预警/指标预警';
                            // }else if(illegal_type_str == "2,3" || illegal_type_str == "3,2"){
                            //     warningReasons = '舆情预警/指标预警';
                            // }else if(illegal_type_str == "1,2,3" || illegal_type_str == "1,3,2" || illegal_type_str == "2,1,3" || illegal_type_str == "2,3,1" || illegal_type_str == "3,1,2" || illegal_type_str == "3,2,1"){
                            //     warningReasons = '模型预警/舆情预警/指标预警';
                            // }

                            // if (row.illegal_type==''||row.illegal_type=='null'||row.illegal_type=='unknown'||!row.illegal_type){
                            //     return '未知';
                            // }else{
                            //     return '<span style="cursor:pointer;color:white;" title="预警理由">'+warningReasons+'</span>';
                            // };

                            if(row.comment_rank > 75){
                                warningReasons += '负面舆情多;<br>';
                            }
                            if(row.suit_rank > 75){
                                warningReasons += '诉讼记录多;<br>';
                            }

                            if(row.ad_rank > 75){
                                warningReasons += '煽动性广告多;<br>';
                            }
                            if(row.return_rank > 75){
                                warningReasons += '收益率过高;<br>';
                            }
                            if(row.abnor_rank > 75){
                                warningReasons += '经营异常多;<br>';
                            }
                            if(row.promise_type ==1 || row.promise_type ==2){
                                warningReasons += '存在担保承诺;<br>';
                            }
                            if(!row.comment_rank && !row.suit_rank && !row.ad_rank && !row.return_rank && !row.abnor_rank && !row.promise_type){
                                warningReasons = '暂无'
                            }
                            if(row.comment_rank <= 75 && row.suit_rank <= 75 && row.ad_rank <= 75  && row.return_rank <= 75 && row.abnor_rank <= 75 && row.promise_type != 1 && row.promise_type != 2){
                                warningReasons = '暂无'
                            }


                            return '<span style="cursor:pointer;color:white;" title="预警理由">'+warningReasons+'</span>';

                        }
                    },
                    {
                        title: "业态类型",//标题
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
                        title: "问题平台",//标题
                        field: "problem",//键名
                        sortable: true,//是否可排序
                        order: "desc",//默认排序方式
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value, row, index) {
                            if (row.problem==''||row.problem=='null'|| row.problem==null || row.problem=='unknown'||!row.problem){
                                return '无';
                            }else {
                                return row.problem;
                            };
                        }
                    },
                    {
                        title: "监测详情",//标题
                        field: "f",//键名
                        sortable: true,//是否可排序
                        order: "desc",//默认排序方式
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value, row, index) {
                            return '<span style="cursor:pointer;color:white;" onclick="jumpFrame_2(\''+row.entity_name+'\',\''+row.entity_type+'\',\''+row.id+'\',\''+row.illegal_type+'\')" title="查看详情"><i class="icon icon-file-alt"></i></span>';
                        }
                    },
                    {
                        title: "一键取证",//标题
                        field: "",//键名
                        sortable: true,//是否可排序
                        order: "desc",//默认排序方式
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value, row, index) {
                            return '<span style="cursor:pointer;color:white;" onclick="prove(\''+row.a+'\')" title="一键取证"><i class="icon icon-signin"></i></span>';
                        }
                    },
                    {
                        title: "预警结果审核",//标题
                        field: "support_num",//键名
                        sortable: true,//是否可排序
                        order: "desc",//默认排序方式
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value, row, index) {
                            var str = '<span style="cursor:pointer;color:white;margin-right:10px;" onclick="resultCheck(\''+row.date+'\',\''+row.id+'\',1,\''+row.illegal_type+'\',\''+row.entity_name+'\',\''+row.support_num+'\',\''+row.problem+'\',\''+'first'+'\',\''+row.risk_rank+'\',\''+row.industry+'\',\''+row.fund_mode+'\')" title="赞成预警"><i class="icon icon-thumbs-up"></i>('+row.support_num+')</span>'+

                                '<span style="cursor:pointer;color:white;" onclick="resultCheck(\''+row.date+'\',\''+row.id+'\',0,\''+row.illegal_type+'\',\''+row.entity_name+'\',\''+row.against_num+'\',\''+row.problem+'\',\''+'first'+'\',\''+row.risk_rank+'\',\''+row.industry+'\',\''+row.fund_mode+'\')" title="反对预警"><i class="icon icon-thumbs-down"></i>('+row.against_num+')</span>';
                            return str;
                        }
                    },
                    {
                        title: "审核详情",//标题
                        field: "",//键名
                        sortable: true,//是否可排序
                        order: "desc",//默认排序方式
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value, row, index) {
                            return '<span style="cursor:pointer;color:white;" onclick="jumpFrame_3(\''+row.id+'\')" title="查看审核详情"><i class="icon icon-hand-up"></i></span>';
                        }
                    },
                    {
                        title: "操作",//标题
                        field: "",//键名
                        sortable: true,//是否可排序
                        order: "desc",//默认排序方式
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value, row, index) {
                            var str = '<span style="cursor:pointer;color:white;margin-right:10px;" onclick="jumpFrame_edit(\''+row.id+'\',\''+row.entity_name+'\',\''+row.date+'\',\''+row.problem+'\',\''+'first'+'\')" title="编辑问题平台"><i class="icon icon-edit"></i></span>';

                            var title = '';
                            if(row.monitor_status == 1){//正在监测状态
                                title = '停止监测';
                                style = 'color:#0088ff;'
                            }else if(row.monitor_status == 2){//已停止监测
                                title = '恢复监测';
                                style = 'color:#fff;'
                            }
                            // console.log(row.monitor_status);

                            str += '<span style="cursor:pointer;color:white;" onclick="jumpFrame_stop(\''+row.monitor_status+'\',\''+row.entity_name+'\',\''+row.id+'\',\''+row.date+'\',\''+'first'+'\')" title=\''+title+'\'><i class="icon icon-retweet" style=\''+style+'\'></i></span>';

                            return str;
                        }
                    },
                ],
            });
            $('#recordingTable p.load').hide();
            $('.recordingTable .fixed-table-toolbar .search input').attr('placeholder','请输入查询内容');
        }

    };
    // 更新下拉框 加载时显示加载信息【暂未启用】
        function up_earlyWarning(data){
            $('#recordingTable p.load').show();
            // $('#recordingTable').bootstrapTable('destroy');
            $('#recordingTable').bootstrapTable('load', data);
            $('#recordingTable p.load').hide();
        }

    // 后端分页 【暂弃用】
        /*
        var detectionCount_url='/detection/detectionCount/?date=7&operation_mode=0&illegal_type=0&entity_type=0&warn_distribute=all';
        public_ajax.call_request('get',detectionCount_url,earlyWarning_ser);//先请求到总页数
        function earlyWarning_ser(total) {
            console.log(total);
            // $('#recordingTable').bootstrapTable('load', data);
            $('#recordingTable').bootstrapTable('destroy');//'destroy' 是必须要加的==作用是加载服务器数据，初始化表格的内容Destroy the bootstrap table.
            $('#recordingTable').bootstrapTable({
                method:'get',
                striped: false,  //是否显示行间隔色
                cache: false,    //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                dataField: "rows",//这是返回的json数组的key.默认好像是"rows".这里只有前后端约定好就行
                // data:data,
                search: true,//是否搜索
                pagination: true,//是否分页
                pageNumber:1,//如果设置了分页，首页页码
                pageSize: pageData,//单页记录数

                pageList: [15,20,25],//分页步进值
                sidePagination: "server",//服务端分页------
                dataType:'json',

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
                // url: "/detection/detectData/?date=7&operation_mode=0&illegal_type=0&entity_type=0&warn_distribute=all&detectionCount=" + total,
                url: "/detection/detectData/?detectionCount=" + total,
                queryParams : function(params) {
                    console.log(params);
                    // var subcompany = $('#subcompany option:selected').val();
                    // var name = $('#name').val();
                    // 时间
                    var selectTime = $('#select-1').val();//这就是selected的值
                    // 运营模式
                    var select_operation_mode = $('#select-2').val();
                    // 预警类型
                    var select_illegal_type = $('#select-3').val();
                    // 实体类型
                    var select_entity_type = $('#select-4').val();
                    // 预警分布
                    var select_warn_distribute = $('#city34').val();
                    return {
                            page_number: (params.offset)/params.limit+1,//如果设置了分页，页面数据条数  页码
                            page_size: params.limit, //如果设置了分页，设置可供选择的页面数据条数。设置为 All 或者 Unlimited，则显示所有记录。   每页条数
                            // companyId:subcompany,
                            // name:name
                            date: selectTime,
                            operation_mode: select_operation_mode,
                            illegal_type: select_illegal_type,
                            entity_type: select_entity_type,
                            warn_distribute: select_warn_distribute
                        };
                },
                // responseHandler:responseHandler,//请求数据成功后，渲染表格前的方法
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
                                return '<span style="cursor:pointer;color:white;" onclick="jumpFrame_1(\''+row.entity_name+'\',\''+row.entity_type+'\',\''+row.id+'\')" title="进入画像">'+row.entity_name+'</span>';
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
                            var registAddress;
                            if(row.province == '北京' || row.province == '上海' || row.province == '天津' || row.province == '重庆'){
                                registAddress= row.city+row.district;
                            }else{
                                registAddress= row.province+row.city+row.district;
                            }
                            if (registAddress.length == 0 || row.province==''||row.province=='null'||row.province=='unknown'||!row.province){
                                return '未知';
                            }else {
                                return '<span style="cursor:pointer;color:white;" title="注册地">'+registAddress+'</span>';
                            };
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
                        title: "预警理由",//标题
                        field: "illegal_type",//键名
                        sortable: true,//是否可排序
                        order: "desc",//默认排序方式
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value, row, index) {
                            var warningReasons;
                            if(row.illegal_type==1){
                                warningReasons = '模型预警';
                            }else if(row.illegal_type==2){
                                warningReasons = '舆情预警';
                            }else if(row.illegal_type==3){
                                warningReasons = '指标预警';
                            }
                            if (row.illegal_type==''||row.illegal_type=='null'||row.illegal_type=='unknown'||!row.illegal_type){
                                return '未知';
                            }else{
                                return '<span style="cursor:pointer;color:white;" title="预警理由">'+warningReasons+'</span>';
                            };
                        }
                    },
                    {
                        title: "运营模式",//标题
                        field: "e",//键名
                        sortable: true,//是否可排序
                        order: "desc",//默认排序方式
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value, row, index) {
                            if (row.operation_mode==''||row.operation_mode=='null'||row.operation_mode=='unknown'||!row.operation_mode){
                                return '互联网金融';
                            }else {
                                // return '<span style="cursor:pointer;color:white;" onclick="jumpFrame_1(\''+row.entity_name+'\')" title="进入画像">'+row.entity_name+'</span>';

                                return '互联网金融'; // ====先写死====
                            };
                        }
                    },
                    {
                        title: "监测详情",//标题
                        field: "f",//键名
                        sortable: true,//是否可排序
                        order: "desc",//默认排序方式
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value, row, index) {
                            return '<span style="cursor:pointer;color:white;" onclick="jumpFrame_2(\''+row.entity_name+'\',\''+row.entity_type+'\',\''+row.id+'\',\''+row.illegal_type+'\')" title="查看详情"><i class="icon icon-file-alt"></i></span>';
                        }
                    },
                    {
                        title: "一键取证",//标题
                        field: "g",//键名
                        sortable: true,//是否可排序
                        order: "desc",//默认排序方式
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value, row, index) {
                            return '<span style="cursor:pointer;color:white;" onclick="prove(\''+row.a+'\')" title="一键取证"><i class="icon icon-signin"></i></span>';
                        }
                    },
                    {
                        title: "预警结果审核",//标题
                        field: "h",//键名
                        sortable: true,//是否可排序
                        order: "desc",//默认排序方式
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value, row, index) {
                            var str = '<span style="cursor:pointer;color:white;margin-right:10px;" onclick="resultCheck(\''+row.date+'\',\''+row.id+'\',)" title="审核通过"><i class="icon icon-thumbs-up"></i>(0)</span>'+
                                '<span style="cursor:pointer;color:white;" onclick="prove(\''+row.a+'\')" title="审核失败"><i class="icon icon-thumbs-down"></i>(0)</span>';
                            return str;
                        }
                    },
                ],
            });
            $('#recordingTable p.load').hide();
            $('.recordingTable .fixed-table-toolbar .search input').attr('placeholder','请输入查询内容');

            // 点击搜索框 启用前端分页
            $('.recordingTable .fixed-table-toolbar .search input').click(function(event) {
                public_ajax.call_request('get',earlyWarning_url,earlyWarning);
            });
        };
        // earlyWarning_ser()

        //请求成功方法  （暂无用）
        function responseHandler(result){
            // var json = {};
            // json.rows = result;
            // console.log(result);
            // var errcode = result.errcode;//在此做了错误代码的判断
            // if(errcode != 0){
            //     alert("错误代码" + errcode);
            //     return;
            // }
            // //如果没有错误则返回数据，渲染表格
            // return {
            //     total : result.dataLength, //总页数,前面的key必须为"total"
            //     data : result.rowDatas //行数据，前面的key要与之前设置的dataField的值一致.
            // };

            // console.log(json);
            return {
                total:total,
                rows:result
            };
            // $('#recordingTable').bootstrapTable('load', result);
        };

     */

    // 更新下拉框
        // ===时间选项===
        $('#select-1').change(function(){
            var selectTime = $(this).children('option:selected').val();//这就是selected的值
            // （业态类型）运营模式
            var select_operation_mode = $(this).parents('.content').find('#select-2').val();
            // 预警类型
            var select_illegal_type = $(this).parents('.content').find('#select-3').val();
            // 相关问题
            var select_problem = $(this).parents('.content').find('#select-5').val();
            // 实体类型
            var select_entity_type = $(this).parents('.content').find('#select-4').val();
            // 预警分布
            var select_warn_distribute = $(this).parents('.content').find('#city34').val();
            // 新增、全部
            var select_newEntity = $(this).parents('.content').find('#select-6').val();
            earlyWarning_url = '/detection/totalDetectData/?date='+selectTime+'&operation_mode='+select_operation_mode+'&illegal_type='+select_illegal_type+'&entity_type='+select_entity_type+'&warn_distribute='+select_warn_distribute+'&problem='+select_problem+'&newEntity='+select_newEntity;
            public_ajax.call_request('get',earlyWarning_url,earlyWarning);
            // 后台分页---
            // var detectionCount_url='/detection/detectionCount/?date='+selectTime+'&operation_mode='+select_operation_mode+'&illegal_type='+select_illegal_type+'&entity_type='+select_entity_type+'&warn_distribute='+select_warn_distribute;
            // public_ajax.call_request('get',detectionCount_url,earlyWarning_ser);//先请求到总页数
        });
        // ===业态类型（运营模式）选项===
        $('#select-2').change(function(){
            var selectTime = $(this).parents('.content').find('#select-1').val();
            // 运营模式
            var select_operation_mode = $(this).val();
            // 预警类型
            var select_illegal_type = $(this).parents('.content').find('#select-3').val();
            // 相关问题
            var select_problem = $(this).parents('.content').find('#select-5').val();
            // 实体类型
            var select_entity_type = $(this).parents('.content').find('#select-4').val();
            // 预警分布
            var select_warn_distribute = $(this).parents('.content').find('#city34').val();
            // 新增、全部
            var select_newEntity = $(this).parents('.content').find('#select-6').val();
            earlyWarning_url = '/detection/totalDetectData/?date='+selectTime+'&operation_mode='+select_operation_mode+'&illegal_type='+select_illegal_type+'&entity_type='+select_entity_type+'&warn_distribute='+select_warn_distribute+'&problem='+select_problem+'&newEntity='+select_newEntity;
            public_ajax.call_request('get',earlyWarning_url,earlyWarning);
            // detectionCount_url='/detection/detectionCount/?date='+selectTime+'&operation_mode='+select_operation_mode+'&illegal_type='+select_illegal_type+'&entity_type='+select_entity_type+'&warn_distribute='+select_warn_distribute;
            // public_ajax.call_request('get',detectionCount_url,earlyWarning_ser);//先请求到总页数
        });
        // ===预警类型选项===
        $('#select-3').change(function(){
            var selectTime = $(this).parents('.content').find('#select-1').val();
            // 运营模式
            var select_operation_mode = $(this).parents('.content').find('#select-2').val();
            // 预警类型
            var select_illegal_type = $(this).val();
            // 相关问题
            var select_problem = $(this).parents('.content').find('#select-5').val();
            // 实体类型
            var select_entity_type = $(this).parents('.content').find('#select-4').val();
            // 预警分布
            var select_warn_distribute = $(this).parents('.content').find('#city34').val();
            // 新增、全部
            var select_newEntity = $(this).parents('.content').find('#select-6').val();
            earlyWarning_url = '/detection/totalDetectData/?date='+selectTime+'&operation_mode='+select_operation_mode+'&illegal_type='+select_illegal_type+'&entity_type='+select_entity_type+'&warn_distribute='+select_warn_distribute+'&problem='+select_problem+'&newEntity='+select_newEntity;
            public_ajax.call_request('get',earlyWarning_url,earlyWarning);
            // detectionCount_url='/detection/detectionCount/?date='+selectTime+'&operation_mode='+select_operation_mode+'&illegal_type='+select_illegal_type+'&entity_type='+select_entity_type+'&warn_distribute='+select_warn_distribute;
            // public_ajax.call_request('get',detectionCount_url,earlyWarning_ser);//先请求到总页数
        });
        // ===相关问题选项===
        $('#select-5').change(function(){
            var selectTime = $(this).parents('.content').find('#select-1').val();
            // 运营模式
            var select_operation_mode = $(this).parents('.content').find('#select-2').val();
            // 预警类型
            var select_illegal_type = $(this).parents('.content').find('#select-3').val();
            // 相关问题
            var select_problem = $(this).val();
            // 实体类型
            var select_entity_type = $(this).parents('.content').find('#select-4').val();
            // 预警分布
            var select_warn_distribute = $(this).parents('.content').find('#city34').val();
            // 新增、全部
            var select_newEntity = $(this).parents('.content').find('#select-6').val();
            earlyWarning_url = '/detection/totalDetectData/?date='+selectTime+'&operation_mode='+select_operation_mode+'&illegal_type='+select_illegal_type+'&entity_type='+select_entity_type+'&warn_distribute='+select_warn_distribute+'&problem='+select_problem+'&newEntity='+select_newEntity;
            public_ajax.call_request('get',earlyWarning_url,earlyWarning);
        });
        // ===实体类型选项===
        $('#select-4').change(function(){
            var selectTime = $(this).parents('.content').find('#select-1').val();
            // 运营模式
            var select_operation_mode = $(this).parents('.content').find('#select-2').val();
            // 预警类型
            var select_illegal_type = $(this).parents('.content').find('#select-3').val();
            // 相关问题
            var select_problem = $(this).parents('.content').find('#select-5').val();
            // 实体类型
            var select_entity_type = $(this).val();
            // 预警分布
            var select_warn_distribute = $(this).parents('.content').find('#city34').val();
            // 新增、全部
            var select_newEntity = $(this).parents('.content').find('#select-6').val();
            earlyWarning_url = '/detection/totalDetectData/?date='+selectTime+'&operation_mode='+select_operation_mode+'&illegal_type='+select_illegal_type+'&entity_type='+select_entity_type+'&warn_distribute='+select_warn_distribute+'&problem='+select_problem+'&newEntity='+select_newEntity;
            public_ajax.call_request('get',earlyWarning_url,earlyWarning);
            // detectionCount_url='/detection/detectionCount/?date='+selectTime+'&operation_mode='+select_operation_mode+'&illegal_type='+select_illegal_type+'&entity_type='+select_entity_type+'&warn_distribute='+select_warn_distribute;
            // public_ajax.call_request('get',detectionCount_url,earlyWarning_ser);//先请求到总页数
        });
        // ===预警分布选项===
        $('#city34').change(function(){
            var selectTime = $(this).parents('.content').find('#select-1').val();
            // 运营模式
            var select_operation_mode = $(this).parents('.content').find('#select-2').val();
            // 预警类型
            var select_illegal_type = $(this).parents('.content').find('#select-3').val();
            // 相关问题
            var select_problem = $(this).parents('.content').find('#select-5').val();
            // 实体类型
            var select_entity_type = $(this).parents('.content').find('#select-4').val();
            // 预警分布
            var select_warn_distribute = $(this).val();
            // 新增、全部
            var select_newEntity = $(this).parents('.content').find('#select-6').val();
            earlyWarning_url = '/detection/totalDetectData/?date='+selectTime+'&operation_mode='+select_operation_mode+'&illegal_type='+select_illegal_type+'&entity_type='+select_entity_type+'&warn_distribute='+select_warn_distribute+'&problem='+select_problem+'&newEntity='+select_newEntity;
            public_ajax.call_request('get',earlyWarning_url,earlyWarning);
            // detectionCount_url='/detection/detectionCount/?date='+selectTime+'&operation_mode='+select_operation_mode+'&illegal_type='+select_illegal_type+'&entity_type='+select_entity_type+'&warn_distribute='+select_warn_distribute;
            // public_ajax.call_request('get',detectionCount_url,earlyWarning_ser);//先请求到总页数
        });
        // ===新增、全部 选项===
        $('#select-6').change(function(){
            var selectTime = $(this).parents('.content').find('#select-1').val();
            // 运营模式
            var select_operation_mode = $(this).parents('.content').find('#select-2').val();
            // 预警类型
            var select_illegal_type = $(this).parents('.content').find('#select-3').val();
            // 相关问题
            var select_problem = $(this).parents('.content').find('#select-5').val();
            // 实体类型
            var select_entity_type = $(this).parents('.content').find('#select-4').val();
            // 预警分布
            var select_warn_distribute = $(this).parents('.content').find('#city34').val();
            // 新增、全部
            var select_newEntity = $(this).val();
            earlyWarning_url = '/detection/totalDetectData/?date='+selectTime+'&operation_mode='+select_operation_mode+'&illegal_type='+select_illegal_type+'&entity_type='+select_entity_type+'&warn_distribute='+select_warn_distribute+'&problem='+select_problem+'&newEntity='+select_newEntity;
            public_ajax.call_request('get',earlyWarning_url,earlyWarning);
            // detectionCount_url='/detection/detectionCount/?date='+selectTime+'&operation_mode='+select_operation_mode+'&illegal_type='+select_illegal_type+'&entity_type='+select_entity_type+'&warn_distribute='+select_warn_distribute;
            // public_ajax.call_request('get',detectionCount_url,earlyWarning_ser);//先请求到总页数
        });

    // 进入画像
        function jumpFrame_1(name,type,id) {
            var html='';
            name=escape(name);
            if (type=='1'||type=='2'){
                html='/index/company/?name='+name+'&flag='+type+'&pid='+id;
            }else {
                html='/index/project/?name='+name+'&flag='+type+'&pid='+id;
            }
            // window.location.href=html;
            window.open(html);
        }

    // 监测详情
        function jumpFrame_2(name,type,id,illegal_type) {
            var html = '';
            name=escape(name);
            // if(illegal_type == 2 || illegal_type == 1 || illegal_type == [1,2]|| illegal_type == [2,1]){//模型预警 ----> 进入画像页(复制本)预警报告compan_monitor
                // html='/index/company/?name='+name+'&flag='+type+'&pid='+id;
                html='/index/company_monitor/?name='+name+'&flag='+type+'&pid='+id;
            // }
            // else if(illegal_type == 2){//舆情预警 ----> 进入监测详情页
            //     html='/index/monitor/?name='+name+'&flag='+type+'&pid='+id;
            // }
            // else {
            //     html='/index/company/?name='+name+'&flag='+type+'&pid='+id;
            // }

            // window.location.href=html;
            window.open(html);//新窗口打开
        }

    // 一键取证
        function prove(flag) {

        }

    // 预警结果审核

        // 所属行业 值 渲染到 select
            var selectIndustry_url = '/detection/IndustryBox/';
            public_ajax.call_request('get',selectIndustry_url,selectIndustry);

            var selectIndustrystr = '';
            function selectIndustry(data){
                if(data){
                    selectIndustrystr = '';
                    for(var i=0;i<data.length;i++){
                        selectIndustrystr += '<option value="'+data[i].industry+'">'+data[i].industry+'</option>'
                    }

                    $("#select_industry").html('');
                    $('#select_industry').append(selectIndustrystr);
                    $('#select_industry').selectpicker('refresh');

                }
            }

        // 集资模式 值 渲染到 select
            var selectFundmode_url = '/detection/FundmodeBox/';
            public_ajax.call_request('get',selectFundmode_url,selectFundmode);

            var selectFundmodestr = '';
            function selectFundmode(data){
                if(data){
                    selectFundmodestr = '';
                    for(var i=0;i<data.length;i++){
                        selectFundmodestr += '<option value="'+data[i].fund_mode+'">'+data[i].fund_mode+'</option>'
                    }
                    $("#select_fund_mode").html('');
                    $('#select_fund_mode').append(selectFundmodestr);
                    $('#select_fund_mode').selectpicker('refresh');

                }
            }


        // 下拉框展开事件
            // 问题平台
            $("#select_Or_problem").on('shown.bs.select',function(e){

                // 展开时显示默认的 选项
                public_ajax.call_request('get',selectProblem_url,selectProblem);
                // $("#select-problem").html("");
                // $('#select-problem').append(selectProblemstr);
                // $('#select-problem').selectpicker('refresh');

                // 添加时去掉默认的选项
                $('#select_Or_problem').siblings('.dropdown-menu').find(".bs-searchbox").find('input').attr('placeholder',"手动输入问题平台(下次可选)"); //为input增加id属性
                $('#select_Or_problem').siblings('.dropdown-menu').find(".bs-searchbox").find('input').css({'background':'transparent','color':'#fff'});
                $('#select_Or_problem').siblings('.dropdown-menu').find(".bs-searchbox").find('input').focus(function(){
                    $(this).css({'background':'#f8f8f8','color':'#3c3c3c'})
                })

                $('#select_Or_problem').siblings('.dropdown-menu').find(".bs-searchbox").find('input').keyup(function(){
                    $('#select_Or_problem').siblings('.dropdown-menu').find(".bs-searchbox").find('input').attr('id',"reason_deviceInput"); //为input增加id属性

                    var deviceInput = $('#reason_deviceInput').val();
                    var deviceStr="<option value='"+deviceInput+"'>"+deviceInput+"</option>" ;

                    $("#select_Or_problem").html("");
                    $('#select_Or_problem').append(deviceStr);
                    $('#select_Or_problem').selectpicker('refresh');

                    // 如果删除完 输入框 显示默认选项
                    if($('#reason_deviceInput').val() == ''){

                        $("#select_Or_problem").html("");
                        $('#select_Or_problem').append(selectProblemstr);
                        $('#select_Or_problem').selectpicker('refresh');
                    }
                })
            });
            //所属行业
            $("#select_industry").on('shown.bs.select',function(e){

                // 展开时显示默认的 选项
                public_ajax.call_request('get',selectIndustry_url,selectIndustry);

                // 添加时去掉默认的选项
                $('#select_industry').siblings('.dropdown-menu').find(".bs-searchbox").find('input').attr('placeholder',"手动输入所属行业(下次可选)");
                $('#select_industry').siblings('.dropdown-menu').find(".bs-searchbox").find('input').css({'background':'transparent','color':'#fff'});
                $('#select_industry').siblings('.dropdown-menu').find(".bs-searchbox").find('input').focus(function(){
                    $(this).css({'background':'#f8f8f8','color':'#3c3c3c'})
                })

                $('#select_industry').siblings('.dropdown-menu').find(".bs-searchbox").find('input').keyup(function(){
                    $('#select_industry').siblings('.dropdown-menu').find(".bs-searchbox").find('input').attr('id',"industryInput"); //为input增加id属性

                    var deviceInput = $('#industryInput').val();
                    var deviceStr="<option value='"+deviceInput+"'>"+deviceInput+"</option>" ;

                    $("#select_industry").html("");
                    $('#select_industry').append(deviceStr);
                    $('#select_industry').selectpicker('refresh');

                    // 如果删除完 输入框 显示默认选项
                    if($('#industryInput').val() == ''){

                        $("#select_industry").html("");
                        $('#select_industry').append(selectProblemstr);
                        $('#select_industry').selectpicker('refresh');
                    }
                })
            });
            //集资模式
            $("#select_fund_mode").on('shown.bs.select',function(e){

                // 展开时显示默认的 选项
                public_ajax.call_request('get',selectFundmode_url,selectFundmode);

                // 添加时去掉默认的选项
                $('#select_fund_mode').siblings('.dropdown-menu').find(".bs-searchbox").find('input').attr('placeholder',"手动输入集资模式(下次可选)");
                $('#select_fund_mode').siblings('.dropdown-menu').find(".bs-searchbox").find('input').css({'background':'transparent','color':'#fff'});
                $('#select_fund_mode').siblings('.dropdown-menu').find(".bs-searchbox").find('input').focus(function(){
                    $(this).css({'background':'#f8f8f8','color':'#3c3c3c'})
                })

                $('#select_fund_mode').siblings('.dropdown-menu').find(".bs-searchbox").find('input').keyup(function(){
                    $('#select_fund_mode').siblings('.dropdown-menu').find(".bs-searchbox").find('input').attr('id',"fund_modeInput"); //为input增加id属性

                    var deviceInput = $('#fund_modeInput').val();
                    var deviceStr="<option value='"+deviceInput+"'>"+deviceInput+"</option>" ;

                    $("#select_fund_mode").html("");
                    $('#select_fund_mode').append(deviceStr);
                    $('#select_fund_mode').selectpicker('refresh');

                    // 如果删除完 输入框 显示默认选项
                    if($('#industryInput').val() == ''){

                        $("#select_fund_mode").html("");
                        $('#select_fund_mode').append(selectProblemstr);
                        $('#select_fund_mode').selectpicker('refresh');
                    }
                })
            });

        // 显示审核理由模态框
            function resultCheck(date,id,type,illegal_type,entity_name,num,oldProblem,screen,oldRisk_rank,oldIndustry,oldFund_mode){
                // screen 参数 暂未用（本想区分一二屏的，现在是都用这一个函数）
                // risk_rank ---   风险等级    industry ---   所属行业    fund_mode ---   集资模式

                // 显示审核理由模态框
                $('#reason').modal('show');
                $('.modal-backdrop').css({position:'static'});

                $('#reason #reason_text').val('');  //清空审核理由框
                $('#reason #problem_Or_reason_text').val('');   //清空信息来源
                $('#reason .modal-body span.reason_title').hide();  //隐藏提示框

                if (oldProblem==''||oldProblem=='null'|| oldProblem==null || oldProblem=='unknown'||!oldProblem){
                    oldProblem = '无';
                }
                $('#select_Or_problem').selectpicker('val',oldProblem); //问题平台下拉框赋值

                if (oldRisk_rank==''||oldRisk_rank=='null'|| oldRisk_rank==null || oldRisk_rank=='unknown'||!oldRisk_rank){
                    oldRisk_rank = '无';
                }
                if (oldIndustry==''||oldIndustry=='null'|| oldIndustry==null || oldIndustry=='unknown'||!oldIndustry){
                    oldIndustry = '无';
                }
                if (oldFund_mode==''||oldFund_mode=='null'|| oldFund_mode==null || oldFund_mode=='unknown'||!oldFund_mode){
                    oldFund_mode = '无';
                }
                $('#select_risk_rank').val(oldRisk_rank);   //风险等级下拉框赋值
                $('#select_industry').selectpicker('val',oldIndustry);  //所属行业下拉框赋值
                $('#select_fund_mode').selectpicker('val',oldFund_mode);    //集资模式下拉框赋值

                // 点击确定按钮
                $('#sure').off('click');
                var _selectPro_val, _problem_remark_text;
                // var _selectPro_val_2;
                // var _selectPro_val_3;
                $('#sure').on('click',function(){

                    // 审核理由
                    var remark_text = $('#reason_text').val();
                    if(remark_text == ''){    //输入 审核理由 不得为空
                        $('#reason .modal-body span.reason_title').show();
                        $('#reason #reason_text').focus(function(){
                            $('#reason .modal-body span.reason_title').hide();
                        })
                        return false; // 问题平台也不可编辑
                    }else {

                        // 问题平台=============
                            console.log($('#select_Or_problem').val());     //下拉框 取值
                            console.log($('#reason_deviceInput').val());    //输入框  取值
                            var selectPro_val = $('#select_Or_problem').val();
                            _selectPro_val = $('#select_Or_problem').val();
                            var inpPro_val = $('#reason_deviceInput').val();

                            var problem_remark_text = $('#problem_Or_reason_text').val();
                            _problem_remark_text = $('#problem_Or_reason_text').val();

                            var problemEdit_url = '';
                            if(selectPro_val == inpPro_val ){//手动输入 的（先添加 问题平台）
                                // 添加问题平台
                                // console.log("添加问题平台");
                                problemEdit_url = '/index/addProblem?problem=' + selectPro_val+'&username='+username+'&uid='+uid;
                                public_ajax.call_request('get',problemEdit_url,_addselectProblem);//同步的请求

                            }else {
                                // console.log("编辑平台问题");
                                problemEdit_url = '/index/editProblem?newValue='+selectPro_val+'&entity_id='+id+'&uid='+uid+'&entity_name='+entity_name+'&remark='+problem_remark_text+'&oldValue='+oldProblem+'&date='+''+'&username='+username;
                                public_ajax.call_request('get',problemEdit_url,_editselectProblem);//编辑平台问题
                            }
                        // 问题平台==================

                        // 风险等级=============
                        var risk_rank_val = $('#select_risk_rank').val();
                        // 风险等级=============

                        // 所属行业=============
                            var selectPro_val_2 = $('#select_industry').val();// 下拉框值
                            // _selectPro_val_2 = $('#select_industry').val();
                            var inpPro_val_2 = $('#industryInput').val(); //输入框值


                            var industryEdit_url = '';
                            if(selectPro_val_2 == inpPro_val_2 ){//手动输入 的（先添加 所属行业）
                                // 添加所属行业
                                // console.log("添加所属行业");
                                industryEdit_url = '/detection/addIndustry?industry=' + selectPro_val_2+'&username='+username+'&uid='+uid;
                                public_ajax.call_request('get',industryEdit_url,addselectIndustry);//

                            }else {
                                // console.log("编辑所属行业");
                                // industryEdit_url = '/index/editProblem?newValue='+selectPro_val+'&entity_id='+id+'&uid='+uid+'&entity_name='+entity_name+'&remark='+problem_remark_text+'&oldValue='+oldProblem+'&date='+''+'&username='+username;
                                // public_ajax.call_request('get',industryEdit_url,_editselectProblem);
                                // 没有编辑所属行业接口 在预警审核接口内
                            }
                        // 所属行业==================

                        // 集资模式=============
                            var selectPro_val_3 = $('#select_fund_mode').val();// 下拉框值
                            // _selectPro_val_3 = $('#select_fund_mode').val();
                            var inpPro_val_3 = $('#fund_modeInput').val(); //输入框值


                            var fund_modeEdit_url = '';
                            if(selectPro_val_3 == inpPro_val_3 ){//手动输入 的（先添加 集资模式）
                                // 添加集资模式
                                // console.log("添加集资模式");
                                fund_modeEdit_url = '/detection/addFundmode?fund_mode=' + selectPro_val_3+'&username='+username+'&uid='+uid;
                                public_ajax.call_request('get',fund_modeEdit_url,addselectFund_mode);//

                            }else {
                                // console.log("编辑集资模式");
                                // industryEdit_url = '/index/editProblem?newValue='+selectPro_val+'&entity_id='+id+'&uid='+uid+'&entity_name='+entity_name+'&remark='+problem_remark_text+'&oldValue='+oldProblem+'&date='+''+'&username='+username;
                                // public_ajax.call_request('get',industryEdit_url,_editselectProblem);
                                // 没有编辑集资模式接口 在预警审核接口内
                            }
                        // 集资模式==================

                        $('#reason .modal-body span.reason_title').hide();
                        // console.log(type);
                        var detectionResultCheck_url = '/detection/detectionResultCheck/?date='+date+'&entity_id='+id+'&type='+type+'&illegal_type='+illegal_type+'&entity_name='+entity_name+'&uid='+uid+'&remark=' + remark_text + '&oldValue=' + num+'&username='+username+'&risk_rank='+risk_rank_val+'&industry='+selectPro_val_2+'&fund_mode='+selectPro_val_3;  //预警结果审核
                        public_ajax.call_request('get',detectionResultCheck_url,resultCheck_result);
                    }
                })

                // 编辑问题平台 成功回调
                function _editselectProblem(data){
                    if(data.status == 'ok'){
                        $('#Success .modal-body').empty().append('<center>问题平台保存成功</center>');
                        $('#Success').modal('show');
                        $('.modal-backdrop').css({position:'static'});

                        // console.log(screen);//根据screen 判断是第一屏的表格 还是 一屏复制版表格
                        // *** 两屏表格 都刷新  ***
                        // if(screen == 'first'){
                            // 重新渲染表格
                            var earlyWarning_url='/detection/totalDetectData/?date=7&operation_mode=all&illegal_type=0&entity_type=0&warn_distribute=all&problem=all&newEntity=0';
                            public_ajax.call_request('get',earlyWarning_url,earlyWarning);
                        // }else if(screen == '_first'){

                            // console.log("一屏复制版表格");
                            // 重新渲染表格
                            var _earlyWarning_url='/detection/secondDetectData/?date=7&operation_mode=all&illegal_type=0&entity_type=0&warn_distribute=all&problem=all&newEntity=0';
                            public_ajax.call_request('get',_earlyWarning_url,_earlyWarning);
                        // }

                    }else {
                        console.log("编辑问题平台失败");
                    }
                }
                // 添加问题平台
                function _addselectProblem(data){
                    console.log(data);
                    if(data.status == 'ok'){
                        // 添加成功后  编辑
                        // console.log(_selectPro_val);
                        problemEdit_url = '/index/editProblem?newValue='+_selectPro_val+'&entity_id='+id+'&uid='+uid+'&entity_name='+entity_name+'&remark='+_problem_remark_text+'&oldValue='+oldProblem+'&date='+''+'&username='+username;
                        // console.log(problemEdit_url);
                        // 编辑问题平台
                        public_ajax.call_request('get',problemEdit_url,_editselectProblem);
                    }else {
                        console.log("添加问题平台后编辑问题平台失败");
                    }
                }

                // 添加所属行业 成功
                function addselectIndustry(data){
                    if(data.status == 'ok'){
                        console.log("添加  所属行业  成功。");
                    }
                }

                // 添加集资模式 成功
                function addselectFund_mode(data){
                    if(data.status == 'ok'){
                        console.log("添加  集资模式  成功。");
                    }
                }


                // 审核成功回调
                function resultCheck_result(data){
                    // console.log(data);
                    if(data.status == 'ok'){
                        $('#Success .modal-body').empty().append('<center>审核成功</center>');
                        $('#Success').modal('show');
                        $('.modal-backdrop').css({position:'static'});

                        // console.log(screen);//根据screen 判断是第一屏的表格 还是 一屏复制版表格
                        // *** 两屏表格 都刷新  ***
                        // if(screen == 'first'){
                            // 重新渲染表格
                            var earlyWarning_url='/detection/totalDetectData/?date=7&operation_mode=all&illegal_type=0&entity_type=0&warn_distribute=all&problem=all&newEntity=0';
                            public_ajax.call_request('get',earlyWarning_url,earlyWarning);
                        // }else if(screen == '_first'){

                            // console.log("一屏复制版表格");
                            // 重新渲染表格
                            var _earlyWarning_url='/detection/secondDetectData/?date=7&operation_mode=all&illegal_type=0&entity_type=0&warn_distribute=all&problem=all&newEntity=0';
                            public_ajax.call_request('get',_earlyWarning_url,_earlyWarning);
                        // }


                    }else if(data.status == 'fail'){
                        $('#Success .modal-body').empty().append('<center>审核失败</center>');
                        $('#Success').modal('show');
                        $('.modal-backdrop').css({position:'static'});
                    }
                }

            }

    // 查看预警审核详情（备注列）
        function jumpFrame_3(id){
            // console.log(id);
            var result_url = '/detection/detectionResultRemark?entity_id=' + id;
            public_ajax.call_request('get',result_url,resultRemark);
        }
        function resultRemark(data){
            if(data.length!=0){
                // var str = '';
                // $('#result').modal('show');
                // $('.modal-backdrop').css({position:'static'});
                // for(var i=0;i<data.length;i++){
                //     str += '<span style="display:inline-block;min-width:30px;text-align:center;background-color:#31708f;border:1px solid #fff;border-radius:5px;margin:10px;padding:5px;">' + data[i] + '</span>';
                // }
                // $('#result .modal-body').empty().append(str);

                // $('#perceiveContent_in').empty();
                $('#perceiveContent_in').bootstrapTable('load', data);
                $('#perceiveContent_in').bootstrapTable({
                    data:data,
                    search: false,//是否搜索
                    pagination: true,//是否分页
                    pageSize: 5,//单页记录数
                    // pageList: [15,20,25],//分页步进值
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
                        /*
                        {
                            title: "",//标题
                            field: "",//键名
                            sortable: true,//是否可排序
                            order: "desc",//默认排序方式
                            align: "center",//水平
                            valign: "middle",//垂直
                            formatter: function (value, row, index) {

                                var username = '未知';
                                if(row.username != ''){
                                    username = row.username;
                                }

                                return '<div class="inforContent">'+
                                    '            <div class="main">'+
                                    '                <img src="/static/images/textIcon.png" class="textFlag" style="top: 8px;">'+
                                    '                <p class="option clearfix">'+
                                    '                    <span style="display:inline-block;width:100%;">用户：<b style="vertical-align:middle;color: #ff6d70;display:inline-block;width:50%;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;" >'+username+'</b>'+'</span>'+
                                    '                    <span>审核理由：<b style="color: #ff6d70;">'+row.remark+'</b></span><br />'+
                                    '                    <span>审核时间：<b style="color: #ff6d70;">'+row.datetime+'</b></span>'+
                                    '                </p>'+
                                    '            </div>'+
                                    '        </div>';
                            }
                        },
                         */
                        {
                            title: "用户",//标题
                            field: "username",//键名
                            sortable: true,//是否可排序
                            order: "desc",//默认排序方式
                            align: "center",//水平
                            valign: "middle",//垂直
                            formatter: function (value, row, index) {
                                var username = '未知';
                                if(row.username != ''){
                                    username = row.username;
                                }
                                return username;
                            }
                        },
                        {
                            title: "审核理由",//标题
                            field: "remark",//键名
                            sortable: true,//是否可排序
                            order: "desc",//默认排序方式
                            align: "center",//水平
                            valign: "middle",//垂直
                            formatter: function (value, row, index) {
                                var remark = '未知';
                                if(row.remark != ''){
                                    remark = row.remark;
                                }
                                return remark;
                            }
                        },
                        {
                            title: "审核时间",//标题
                            field: "remark",//键名
                            sortable: true,//是否可排序
                            order: "desc",//默认排序方式
                            align: "center",//水平
                            valign: "middle",//垂直
                            formatter: function (value, row, index) {
                                var datetime = '未知';
                                if(row.datetime != ''){
                                    datetime = row.datetime;
                                }
                                return datetime;
                            }
                        },
                    ],
                });
                $('#result').modal('show');
                $('.modal-backdrop').css({position:'static'});

            }else {
                // $('#result').modal('show');
                // $('.modal-backdrop').css({position:'static'});
                // $('#result .modal-body').empty().append('<center>暂无结果</center>');
                $('#perceiveContent_in').bootstrapTable('load', data);
            }

        }

    // 操作列
    // 停止监测
        function jumpFrame_stop(status,entity_name,entity_id,date,screen){
            $('#MonitorStatus_off .modal-body span.MonitorStatus_reason_tit').hide();

            var MonitorStatus_off_url = '';
            if(status == 1){//正在监测状态  停止监测
                $('#MonitorStatus_off .modal-header h4').text('停止监测');
                $('#MonitorStatus_off #MonitorStatus_reason_text').val('');
                $('#MonitorStatus_off').modal('show');
                $('.modal-backdrop').css({position:'static'});
            }else if(status == 2){
                $('#MonitorStatus_off .modal-header h4').text('恢复监测');
                $('#MonitorStatus_off #MonitorStatus_reason_text').val('');
                $('#MonitorStatus_off').modal('show');
                $('.modal-backdrop').css({position:'static'});
            }

            $('#sure_4').one('click',function(){
                var remark_text = $('#MonitorStatus_reason_text').val();
                if(remark_text == ''){
                    $('#MonitorStatus_off .modal-body span.MonitorStatus_reason_tit').show();
                    $('#MonitorStatus_off #MonitorStatus_reason_text').focus(function(){
                        $('#MonitorStatus_off .modal-body span.MonitorStatus_reason_tit').hide();
                    })
                    return false;
                }else {
                    $('#MonitorStatus_off .modal-body span.MonitorStatus_reason_tit').hide();
                    if(status == 1){//正在监测状态 点击停止监测
                        MonitorStatus_off_url = '/index/MonitorStatus/?entity_name='+entity_name+'&log_type=1&remark='+remark_text+'&uid='+uid+'&entity_id='+entity_id+'&date='+date+'&username='+username;
                        public_ajax.call_request('get',MonitorStatus_off_url,MonitorStatusOff);
                    }else if(status == 2){//(状态)已停止监测 点击恢复监测
                        MonitorStatus_off_url = '/index/MonitorStatus/?entity_name='+entity_name+'&log_type=2&remark='+remark_text+'&uid='+uid+'&entity_id='+entity_id+'&date='+date+'&username='+username;
                        public_ajax.call_request('get',MonitorStatus_off_url,MonitorStatusOff);
                    }
                }
            })

            function MonitorStatusOff(data){
                if(data.status == 'ok'){
                    // console.log("修改成功");
                    $('#Success .modal-body').empty().append('<center>操作成功</center>');
                    $('#Success').modal('show');
                    $('.modal-backdrop').css({position:'static'});

                    // console.log(screen);//根据screen 判断是第一屏的表格 还是 一屏复制版表格
                    // *** 两屏表格 都刷新  ***
                    // if(screen == 'first'){
                        // 重新渲染表格
                        var earlyWarning_url='/detection/totalDetectData/?date=7&operation_mode=all&illegal_type=0&entity_type=0&warn_distribute=all&problem=all&newEntity=0';
                        public_ajax.call_request('get',earlyWarning_url,earlyWarning);
                    // }else if(screen == '_first'){

                        console.log("一屏复制版表格");
                        // 重新渲染表格
                        var _earlyWarning_url='/detection/secondDetectData/?date=7&operation_mode=all&illegal_type=0&entity_type=0&warn_distribute=all&problem=all&newEntity=0';
                        public_ajax.call_request('get',_earlyWarning_url,_earlyWarning);
                    // }

                }else {
                    $('#Success .modal-body').empty().append('<center>操作失败</center>');
                    $('#Success').modal('show');
                    $('.modal-backdrop').css({position:'static'});
                }
            }
        }

    // 编辑问题平台
        // 值 渲染到 select
            var selectProblem_url = '/detection/ProblemBox/';    //问题平台
            public_ajax.call_request('get',selectProblem_url,selectProblem);

            var selectProblemstr = '';
            function selectProblem(data){
                if(data){
                    selectProblemstr = '';
                    for(var i=0;i<data.length;i++){
                        selectProblemstr += '<option value="'+data[i].problem+'">'+data[i].problem+'</option>'
                    }
                    // 操作列的 问题平台编辑
                    $("#select-problem").html('');
                    $('#select-problem').append(selectProblemstr);
                    // console.log(selectProblemstr);
                    $('#select-problem').selectpicker('refresh');

                    // 预警结果 审核那 的问题平台编辑
                    $("#select_Or_problem").html('');
                    $('#select_Or_problem').append(selectProblemstr);
                    $('#select_Or_problem').selectpicker('refresh');

                }
            }

            // 下拉框展开事件
            $("#select-problem").on('shown.bs.select',function(e){

                // 展开时显示默认的 选项
                public_ajax.call_request('get',selectProblem_url,selectProblem);//同步的请求
                // $("#select-problem").html("");
                // $('#select-problem').append(selectProblemstr);
                // $('#select-problem').selectpicker('refresh');

                // 添加时去掉默认的选项
                $('#select-problem').siblings('.dropdown-menu').find(".bs-searchbox").find('input').attr('placeholder',"手动输入问题平台(下次可选)"); //为input增加id属性
                $('#select-problem').siblings('.dropdown-menu').find(".bs-searchbox").find('input').css({'background':'transparent','color':'#fff'});
                $('#select-problem').siblings('.dropdown-menu').find(".bs-searchbox").find('input').focus(function(){
                    $(this).css({'background':'#f8f8f8','color':'#3c3c3c'})
                })

                $('#select-problem').siblings('.dropdown-menu').find(".bs-searchbox").find('input').keyup(function(){
                    $('#select-problem').siblings('.dropdown-menu').find(".bs-searchbox").find('input').attr('id',"deviceInput"); //为input增加id属性

                    var deviceInput = $('#deviceInput').val();
                    var deviceStr="<option value='"+deviceInput+"'>"+deviceInput+"</option>" ;

                    $("#select-problem").html("");
                    $('#select-problem').append(deviceStr);
                    $('#select-problem').selectpicker('refresh');

                    // 如果删除完 输入框 显示默认选项
                    if($('#deviceInput').val() == ''){

                        $("#select-problem").html("");
                        $('#select-problem').append(selectProblemstr);
                        $('#select-problem').selectpicker('refresh');
                    }
                })
            });

        // 显示模态框
        var _selectPro_val, _problem_remark_text;
        function jumpFrame_edit(entity_id,entity_name,date,oldValue,screen){
            $('#problemEdit #problem_reason_text').val('');
            $('#problemEdit').modal('show');
            $('.modal-backdrop').css({position:'static'});

            if (oldValue==''||oldValue=='null'|| oldValue==null || oldValue=='unknown'||!oldValue){
                oldValue = '无';
            }
            $('#select-problem').selectpicker('val',oldValue);//问题平台下拉框赋值


            $('#sure_problemEdit').off('click');//防止触发多次
            // 点击确定按钮
            $('#sure_problemEdit').one('click',function(){
                // console.log($('#select-problem').val()); //下拉框
                // console.log($('#deviceInput').val());//输入框
                var selectPro_val = $('#select-problem').val();
                _selectPro_val = $('#select-problem').val();
                var inpPro_val = $('#deviceInput').val();

                var problem_remark_text = $('#problem_reason_text').val();
                _problem_remark_text = $('#problem_reason_text').val();

                var problemEdit_url = '';
                if(selectPro_val == inpPro_val ){//手动输入 的
                    // 添加问题平台
                    // console.log("添加问题平台");
                    problemEdit_url = '/index/addProblem?problem=' + selectPro_val+'&username='+username+'&uid='+uid;
                    public_ajax.call_request_1('get',problemEdit_url,addselectProblem);//同步的请求

                }else {
                    // console.log("编辑平台问题");
                    console.log(_selectPro_val);
                    problemEdit_url = '/index/editProblem?newValue='+selectPro_val+'&entity_id='+entity_id+'&uid='+uid+'&entity_name='+entity_name+'&remark='+problem_remark_text+'&oldValue='+oldValue+'&date='+''+'&username='+username;
                    public_ajax.call_request('get',problemEdit_url,editselectProblem);//编辑平台问题
                }

            })

            // 编辑问题平台
            function editselectProblem(data){
                if(data.status == 'ok'){
                    $('#Success .modal-body').empty().append('<center>保存成功</center>');
                    $('#Success').modal('show');
                    $('.modal-backdrop').css({position:'static'});

                    // console.log(screen);//根据screen 判断是第一屏的表格 还是 一屏复制版表格
                    // *** 两屏表格 都刷新  ***
                    // if(screen == 'first'){
                        // 重新渲染表格
                        var earlyWarning_url='/detection/totalDetectData/?date=7&operation_mode=all&illegal_type=0&entity_type=0&warn_distribute=all&problem=all&newEntity=0';
                        public_ajax.call_request('get',earlyWarning_url,earlyWarning);
                    // }else if(screen == '_first'){

                        // console.log("一屏复制版表格");
                        // 重新渲染表格
                        var _earlyWarning_url='/detection/secondDetectData/?date=7&operation_mode=all&illegal_type=0&entity_type=0&warn_distribute=all&problem=all&newEntity=0';
                        public_ajax.call_request('get',_earlyWarning_url,_earlyWarning);
                    // }

                }else {
                    console.log("编辑问题平台失败");
                }
            }
            // 添加问题平台
            function addselectProblem(data){
                console.log(data);
                if(data.status == 'ok'){
                    // 添加成功后  编辑
                    // console.log(_selectPro_val);
                    problemEdit_url = '/index/editProblem?newValue='+_selectPro_val+'&entity_id='+entity_id+'&uid='+uid+'&entity_name='+entity_name+'&remark='+_problem_remark_text+'&oldValue='+oldValue+'&date='+''+'&username='+username;
                    // console.log(problemEdit_url);
                    // ---> 编辑问题平台
                    public_ajax.call_request('get',problemEdit_url,editselectProblem);
                }else {
                    console.log("添加问题平台后编辑问题平台失败");
                }
            }
        }

//====预警记录 【复制版】====  （【暂 弃用 】  在上面的判断登录状态那）
    // 游客仅显示 这个复制版表格  （去掉 编辑 点赞功能）
    //【第二屏的列表排序方式加一个根据点赞数大小desc排序，且只显示点赞数大于0的。】
    var _earlyWarning_url='/detection/secondDetectData/?date=7&operation_mode=all&illegal_type=0&entity_type=0&warn_distribute=all&problem=all&newEntity=0';
    // public_ajax.call_request('get',_earlyWarning_url,_earlyWarning);（暂 弃用   在上面的判断登录状态那）

    function _earlyWarning(data) {
        // console.log(data);
        $('#_recordingTable p.load').show();
        // 获取最早预警时间 加入数据中=========
        var mindate_url = '/detection/minDate';
        public_ajax.call_request('get',mindate_url,minDate);
        var data_1 = [];
        var data_2 = data;
        function minDate(data){
            data_1 = data;
            // console.log(data_1);
            // console.log(data_2);

            // for(var i=0;i<data_2.length;i++){
            //     for(var j=0;j<data_1.length;j++){
            //         if(data_2[i].id === data_1[j].id){
            //             data_2[i].minDate = data_1[j].minDate;
            //             break;
            //         }
            //     }
            // }

            for(var i=0;i<data_2.length;i++){
                data_2[i].minDate = data_1[data_2[i].id]
            }

            // console.log(data_2);
            // 获取最早预警时间 加入数据中=========

            // $('#recordingTable').bootstrapTable('destroy');
            $('#_recordingTable').bootstrapTable('load', data_2);
            $('#_recordingTable').bootstrapTable({
                data:data_2,
                search: true,//是否搜索
                pagination: true,//是否分页
                pageSize: pageData,//单页记录数
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
                                return '<span style="cursor:pointer;color:white;" onclick="jumpFrame_1(\''+row.entity_name+'\',\''+row.entity_type+'\',\''+row.id+'\')" title="进入画像">'+row.entity_name+'</span>';
                            };
                        }
                    },
                    {
                        title: "预警指数",//标题
                        field: " ",//键名
                        sortable: true,//是否可排序
                        order: "desc",//默认排序方式
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value, row, index) {
                            if (row.illegal_score==''||row.illegal_score=='null'||row.illegal_score=='unknown'||!row.illegal_score){
                                return '未知';
                            }else {
                                return row.illegal_score;
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
                            var registAddress;
                            if(row.province == '北京' || row.province == '上海' || row.province == '天津' || row.province == '重庆'){
                                registAddress= row.city+row.district;
                            }else{
                                registAddress= row.province+row.city+row.district;
                            }
                            if (registAddress.length == 0 || row.province==''||row.province=='null'||row.province=='unknown'||!row.province){
                                return '未知';
                            }else {
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
                            }else if(row.entity_source == 2){
                                entitySource = '人工导入';
                            }else if( row.entity_source == 3){
                                entitySource = '数据库';
                            }else if(row.entity_source == 4 ){
                                entitySource = '系统感知';
                            }else if (row.entity_source==''||row.entity_source=='null'||row.entity_source=='unknown'||!row.entity_source){
                                entitySource = '未知';
                            }else {
                                entitySource = entity_source;
                            }
                            return entitySource;
                        }
                    },
                    {
                        title: "此次预警时间",//标题
                        field: "date",//键名
                        sortable: true,//是否可排序
                        order: "desc",//默认排序方式
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value, row, index) {
                            if (row.date==''||row.date=='null'||row.date=='unknown'||!row.date){
                                return '未知';
                            }else {
                                return '<span style="cursor:pointer;color:white;" title="此次预警时间">'+row.date+'</span>';
                            };
                        }
                    },
                    {
                        title: "最早预警时间",//标题
                        field: "minDate",//键名
                        sortable: true,//是否可排序
                        order: "desc",//默认排序方式
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value, row, index) {
                            if (row.minDate==''||row.minDate=='null'||row.minDate=='unknown'||!row.minDate){
                                return '未知';
                            }else {
                                return '<span style="cursor:pointer;color:white;" title="最早预警时间">'+row.minDate+'</span>';
                            };
                        }
                    },
                    {
                        title: "预警理由",//标题
                        field: "illegal_type",//键名
                        sortable: true,//是否可排序
                        order: "desc",//默认排序方式
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value, row, index) {
                            var warningReasons = '';

                            // var illegal_type_str = row.illegal_type.toString();
                            // if(row.illegal_type==1){
                            //     warningReasons = '模型预警';
                            // }else if(row.illegal_type==2){
                            //     warningReasons = '舆情预警';
                            // }else if(row.illegal_type==3){
                            //     warningReasons = '指标预警';
                            // }else if(illegal_type_str == "1,2" || illegal_type_str == "2,1"){
                            //     warningReasons = '模型预警/舆情预警';
                            // }else if(illegal_type_str == "1,3" || illegal_type_str == "3,1"){
                            //     warningReasons = '模型预警/指标预警';
                            // }else if(illegal_type_str == "2,3" || illegal_type_str == "3,2"){
                            //     warningReasons = '舆情预警/指标预警';
                            // }else if(illegal_type_str == "1,2,3" || illegal_type_str == "1,3,2" || illegal_type_str == "2,1,3" || illegal_type_str == "2,3,1" || illegal_type_str == "3,1,2" || illegal_type_str == "3,2,1"){
                            //     warningReasons = '模型预警/舆情预警/指标预警';
                            // }
                            // if (row.illegal_type==''||row.illegal_type=='null'||row.illegal_type=='unknown'||!row.illegal_type){
                            //     return '未知';
                            // }else{
                            //     return '<span style="cursor:pointer;color:white;" title="预警理由">'+warningReasons+'</span>';
                            // };

                            if(row.comment_rank > 75){
                                warningReasons += '负面舆情多;<br>';
                            }
                            if(row.suit_rank > 75){
                                warningReasons += '诉讼记录多;<br>';
                            }

                            if(row.ad_rank > 75){
                                warningReasons += '煽动性广告多;<br>';
                            }
                            if(row.return_rank > 75){
                                warningReasons += '收益率过高;<br>';
                            }
                            if(row.abnor_rank > 75){
                                warningReasons += '经营异常多;<br>';
                            }
                            if(row.promise_type ==1 || row.promise_type ==2){
                                warningReasons += '存在担保承诺;<br>';
                            }
                            if(!row.comment_rank && !row.suit_rank && !row.ad_rank && !row.return_rank && !row.abnor_rank && !row.promise_type){
                                warningReasons = '暂无'
                            }
                            if(row.comment_rank <= 75 && row.suit_rank <= 75 && row.ad_rank <= 75  && row.return_rank <= 75 && row.abnor_rank <= 75 && row.promise_type != 1 && row.promise_type != 2){
                                warningReasons = '暂无'
                            }


                            return '<span style="cursor:pointer;color:white;" title="预警理由">'+warningReasons+'</span>';
                        }
                    },
                    {
                        title: "业态类型",//标题
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
                        title: "问题平台",//标题
                        field: "problem",//键名
                        sortable: true,//是否可排序
                        order: "desc",//默认排序方式
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value, row, index) {
                            if (row.problem==''||row.problem=='null'|| row.problem==null || row.problem=='unknown'||!row.problem){
                                return '无';
                            }else {
                                return row.problem;
                            };
                        }
                    },
                    {
                        title: "监测详情",//标题
                        field: "f",//键名
                        sortable: true,//是否可排序
                        order: "desc",//默认排序方式
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value, row, index) {
                            return '<span style="cursor:pointer;color:white;" onclick="jumpFrame_2(\''+row.entity_name+'\',\''+row.entity_type+'\',\''+row.id+'\',\''+row.illegal_type+'\')" title="查看详情"><i class="icon icon-file-alt"></i></span>';
                        }
                    },
                    // {
                    //     title: "一键取证",//标题
                    //     field: "",//键名
                    //     sortable: true,//是否可排序
                    //     order: "desc",//默认排序方式
                    //     align: "center",//水平
                    //     valign: "middle",//垂直
                    //     formatter: function (value, row, index) {
                    //         return '<span style="cursor:pointer;color:white;" onclick="prove(\''+row.a+'\')" title="一键取证"><i class="icon icon-signin"></i></span>';
                    //     }
                    // },
                    // {
                    //     title: "预警结果审核",//标题
                    //     field: "support_num",//键名
                    //     sortable: true,//是否可排序
                    //     order: "desc",//默认排序方式
                    //     align: "center",//水平
                    //     valign: "middle",//垂直
                    //     formatter: function (value, row, index) {
                    //         var str = '<span style="cursor:pointer;color:white;margin-right:10px;" onclick="resultCheck(\''+row.date+'\',\''+row.id+'\',1,\''+row.illegal_type+'\')" title="赞成预警"><i class="icon icon-thumbs-up"></i>('+row.support_num+')</span>'+
                    //             '<span style="cursor:pointer;color:white;" onclick="resultCheck(\''+row.date+'\',\''+row.id+'\',0,\''+row.illegal_type+'\')" title="反对预警"><i class="icon icon-thumbs-down"></i>('+row.against_num+')</span>';
                    //         return str;
                    //     }
                    // },
                ],
            });
            $('#_recordingTable p.load').hide();
            $('._firstScreen .recordingTable .fixed-table-toolbar .search input').attr('placeholder','请输入查询内容');
        }
    };

    // 更新下拉框 （这个用了）
        // ===时间选项===
        $('#_select-1').change(function(){
            var selectTime = $(this).children('option:selected').val();//这就是selected的值
            // 运营模式
            var select_operation_mode = $(this).parents('._content').find('#_select-2').val();
            // 预警类型
            var select_illegal_type = $(this).parents('._content').find('#_select-3').val();
            // 相关问题
            var select_problem = $(this).parents('._content').find('#_select-5').val();
            // 实体类型
            var select_entity_type = $(this).parents('._content').find('#_select-4').val();
            // 预警分布
            var select_warn_distribute = $(this).parents('._content').find('#_city34').val();
            // 新增、全部
            var select_newEntity = $(this).parents('._content').find('#_select-6').val();
            _earlyWarning_url = '/detection/secondDetectData/?date='+selectTime+'&operation_mode='+select_operation_mode+'&illegal_type='+select_illegal_type+'&entity_type='+select_entity_type+'&warn_distribute='+select_warn_distribute+'&problem='+select_problem+'&newEntity='+select_newEntity;
            // console.log(earlyWarning_url);
            public_ajax.call_request('get',_earlyWarning_url,_earlyWarning);
        })
        // ===业态类型（运营模式）选项===
        $('#_select-2').change(function(){
            var selectTime = $(this).parents('._content').find('#_select-1').val();
            // 运营模式
            var select_operation_mode = $(this).val();
            // 预警类型
            var select_illegal_type = $(this).parents('._content').find('#_select-3').val();
            // 相关问题
            var select_problem = $(this).parents('._content').find('#_select-5').val();
            // 实体类型
            var select_entity_type = $(this).parents('._content').find('#_select-4').val();
            // 预警分布
            var select_warn_distribute = $(this).parents('._content').find('#_city34').val();
            // 新增、全部
            var select_newEntity = $(this).parents('._content').find('#_select-6').val();
            _earlyWarning_url = '/detection/secondDetectData/?date='+selectTime+'&operation_mode='+select_operation_mode+'&illegal_type='+select_illegal_type+'&entity_type='+select_entity_type+'&warn_distribute='+select_warn_distribute+'&problem='+select_problem+'&newEntity='+select_newEntity;
            // console.log(earlyWarning_url);
            public_ajax.call_request('get',_earlyWarning_url,_earlyWarning);
        })
        // ===预警类型选项===
        $('#_select-3').change(function(){
            var selectTime = $(this).parents('._content').find('#_select-1').val();
            // 运营模式
            var select_operation_mode = $(this).parents('._content').find('#_select-2').val();
            // 预警类型
            var select_illegal_type = $(this).val();
            // 相关问题
            var select_problem = $(this).parents('._content').find('#_select-5').val();
            // 实体类型
            var select_entity_type = $(this).parents('._content').find('#_select-4').val();
            // 预警分布
            var select_warn_distribute = $(this).parents('._content').find('#_city34').val();
            // 新增、全部
            var select_newEntity = $(this).parents('._content').find('#_select-6').val();
            _earlyWarning_url = '/detection/secondDetectData/?date='+selectTime+'&operation_mode='+select_operation_mode+'&illegal_type='+select_illegal_type+'&entity_type='+select_entity_type+'&warn_distribute='+select_warn_distribute+'&problem='+select_problem+'&newEntity='+select_newEntity;
            // console.log(earlyWarning_url);
            public_ajax.call_request('get',_earlyWarning_url,_earlyWarning);
        })
        // ===相关问题选项===
        $('#_select-5').change(function(){
            var selectTime = $(this).parents('._content').find('#_select-1').val();
            // 运营模式
            var select_operation_mode = $(this).parents('._content').find('#_select-2').val();
            // 预警类型
            var select_illegal_type = $(this).parents('._content').find('#_select-3').val();
            // 相关问题
            var select_problem = $(this).val();
            // 实体类型
            var select_entity_type = $(this).parents('._content').find('#_select-4').val();
            // 预警分布
            var select_warn_distribute = $(this).parents('._content').find('#_city34').val();
            // 新增、全部
            var select_newEntity = $(this).parents('._content').find('#_select-6').val();
            _earlyWarning_url = '/detection/secondDetectData/?date='+selectTime+'&operation_mode='+select_operation_mode+'&illegal_type='+select_illegal_type+'&entity_type='+select_entity_type+'&warn_distribute='+select_warn_distribute+'&problem='+select_problem+'&newEntity='+select_newEntity;
            // console.log(earlyWarning_url);
            public_ajax.call_request('get',_earlyWarning_url,_earlyWarning);
        })
        // ===实体类型选项===
        $('#_select-4').change(function(){
            var selectTime = $(this).parents('._content').find('#_select-1').val();
            // 运营模式
            var select_operation_mode = $(this).parents('._content').find('#_select-2').val();
            // 预警类型
            var select_illegal_type = $(this).parents('._content').find('#_select-3').val();
            // 相关问题
            var select_problem = $(this).parents('._content').find('#_select-5').val();
            // 实体类型
            var select_entity_type = $(this).val();
            // 预警分布
            var select_warn_distribute = $(this).parents('._content').find('#_city34').val();
            // 新增、全部
            var select_newEntity = $(this).parents('._content').find('#_select-6').val();
            _earlyWarning_url = '/detection/secondDetectData/?date='+selectTime+'&operation_mode='+select_operation_mode+'&illegal_type='+select_illegal_type+'&entity_type='+select_entity_type+'&warn_distribute='+select_warn_distribute+'&problem='+select_problem+'&newEntity='+select_newEntity;
            // console.log(earlyWarning_url);
            public_ajax.call_request('get',_earlyWarning_url,_earlyWarning);
        })
        // ===预警分布选项===
        $('#_city34').change(function(){
            var selectTime = $(this).parents('._content').find('#_select-1').val();
            // 运营模式
            var select_operation_mode = $(this).parents('._content').find('#_select-2').val();
            // 预警类型
            var select_illegal_type = $(this).parents('._content').find('#_select-3').val();
            // 相关问题
            var select_problem = $(this).parents('._content').find('#_select-5').val();
            // 实体类型
            var select_entity_type = $(this).parents('._content').find('#_select-4').val();
            // 预警分布
            var select_warn_distribute = $(this).val();
            // 新增、全部
            var select_newEntity = $(this).parents('._content').find('#_select-6').val();
            _earlyWarning_url = '/detection/secondDetectData/?date='+selectTime+'&operation_mode='+select_operation_mode+'&illegal_type='+select_illegal_type+'&entity_type='+select_entity_type+'&warn_distribute='+select_warn_distribute+'&problem='+select_problem+'&newEntity='+select_newEntity;
            // console.log(earlyWarning_url);
            public_ajax.call_request('get',_earlyWarning_url,_earlyWarning);
        })
        // ===新增、全部 选项===
        $('#_select-6').change(function(){
            var selectTime = $(this).parents('._content').find('#_select-1').val();
            // 运营模式
            var select_operation_mode = $(this).parents('._content').find('#_select-2').val();
            // 预警类型
            var select_illegal_type = $(this).parents('._content').find('#_select-3').val();
            // 相关问题
            var select_problem = $(this).parents('._content').find('#_select-5').val();
            // 实体类型
            var select_entity_type = $(this).parents('._content').find('#_select-4').val();
            // 预警分布
            var select_warn_distribute = $(this).parents('._content').find('#_city34').val();
            // 新增、全部
            var select_newEntity = $(this).val();
            _earlyWarning_url = '/detection/secondDetectData/?date='+selectTime+'&operation_mode='+select_operation_mode+'&illegal_type='+select_illegal_type+'&entity_type='+select_entity_type+'&warn_distribute='+select_warn_distribute+'&problem='+select_problem+'&newEntity='+select_newEntity;
            // console.log(earlyWarning_url);
            public_ajax.call_request('get',_earlyWarning_url,_earlyWarning);
        });

    // 进入画像
        function _jumpFrame_1(name,type,id) {
            var html='';
            name=escape(name);
            if (type=='1'||type=='2'){
                html='/index/company/?name='+name+'&flag='+type+'&pid='+id;
            }else {
                html='/index/project/?name='+name+'&flag='+type+'&pid='+id;
            }
            // window.location.href=html;
            window.open(html);
        }

    // 监测详情
        function _jumpFrame_2(name,type,id,illegal_type) {
            var html = '';
            name=escape(name);
            if(illegal_type == 1){//模型预警 ----> 进入画像页(复制本)预警报告compan_monitor
                // html='/index/company/?name='+name+'&flag='+type+'&pid='+id;
                html='/index/company_monitor/?name='+name+'&flag='+type+'&pid='+id;
            }else if(illegal_type == 2){//舆情预警 ----> 进入监测详情页
                html='/index/monitor/?name='+name+'&flag='+type+'&pid='+id;
            }else {
                html='/index/company/?name='+name+'&flag='+type+'&pid='+id;
            }

            // window.location.href=html;
            window.open(html);
        }

    // 一键取证
        function _prove(flag) {

        }


//====预警态势====
    // detection/TimeDistribute
    var timeDistribute_url='/detection/TimeDistribute/?date=30&operation_mode=all&illegal_type=0&entity_type=0&warn_distribute=all';
    public_ajax.call_request('get',timeDistribute_url,line_1_new);
    var option_1 = {
        backgroundColor:'transparent',
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                lineStyle: {
                    color: '#57617B'
                }
            }
        },
        grid: {
            left: '4%',
            right: '7%',
            bottom: '8%',
            top:'10%',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            axisLine: {
                lineStyle: {
                    color: '#57617B'
                }
            },
            axisLabel: {
                textStyle: {
                    color: '#fff',
                }
            },
            data:[],
        }],
        yAxis: [{
            type: 'value',
            name:'当日总预警数',
            nameLocation:'end',
            nameTextStyle:{
                fontSize:14
            },
            axisTick: {
                show: true
            },
            axisLine: {
                lineStyle: {
                    color: '#57c4d3'
                }
            },
            axisLabel: {
                show:true,
                // margin: 10,
                textStyle: {
                    fontSize: 14,
                    color:'white',
                }
            },
            splitLine: {
                lineStyle: {
                    color: '#57617B'
                }
            }
        }],
        series: [
            {
                name: '',
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 5,
                showSymbol: false,
                lineStyle: {
                    normal: {
                        width: 1,
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(137, 189, 27, 0.8)'
                        }, {
                            offset: 1,
                            color: 'rgba(137, 189, 27, 0)'
                        }], false),
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10
                    }
                },
                itemStyle: {
                    normal: {
                        color: 'rgb(137,189,27)',
                        borderColor: 'rgba(137,189,2,0.27)',
                        borderWidth: 12
                    }
                },
                // data: day30Data,
                data: [],
            }
        ]
    };
    var day30_new=[],day30Data_new=[];
    function line_1_new(data) {
        if(data){
            // 清空原数据
            day30_new.length = 0;
            day30Data_new.length = 0;
            $('#picChart-2 p.load').hide();
            for(var i=0;i<data.length;i++){
                day30_new.push(data[i].time);
                day30Data_new.push(data[i].count);
            };
            option_1.xAxis[0].data = day30_new.reverse();
            option_1.series[0].data = day30Data_new.reverse();
            var myChart = echarts.init(document.getElementById('trendLine'),'chalk');
            myChart.setOption(option_1);
        }
    }
    // 更新下拉框
        // ===时间选项===
        $('#second_select-1').change(function(){
            var selectTime = $(this).children('option:selected').val();//这就是selected的值
            // 运营模式
            var select_operation_mode = $(this).parents('.content-2').find('#second_select-2').val();
            // 预警类型
            var select_illegal_type = $(this).parents('.content-2').find('#second_select-3').val();
            // 实体类型
            var select_entity_type = $(this).parents('.content-2').find('#second_select-4').val();
            // 预警分布
            var select_warn_distribute = $(this).parents('.content-2').find('#second_city34').val();
            // timeDistribute_url = '/detection/TimeDistribute/?date='+selectTime;
            timeDistribute_url = '/detection/TimeDistribute/?date='+selectTime+'&operation_mode='+select_operation_mode+'&illegal_type='+select_illegal_type+'&entity_type='+select_entity_type+'&warn_distribute='+select_warn_distribute;
            // console.log(timeDistribute_url);
            public_ajax.call_request('get',timeDistribute_url,line_1_new);
        })
        // ===运营模式选项===
        $('#second_select-2').change(function(){
            var selectTime = $(this).parents('.content-2').find('#second_select-1').val();
            // 运营模式
            var select_operation_mode = $(this).val();
            // 预警类型
            var select_illegal_type = $(this).parents('.content-2').find('#second_select-3').val();
            // 实体类型
            var select_entity_type = $(this).parents('.content-2').find('#second_select-4').val();
            // 预警分布
            var select_warn_distribute = $(this).parents('.content-2').find('#second_city34').val();
            // timeDistribute_url = '/detection/TimeDistribute/?date='+selectTime;
            timeDistribute_url = '/detection/TimeDistribute/?date='+selectTime+'&operation_mode='+select_operation_mode+'&illegal_type='+select_illegal_type+'&entity_type='+select_entity_type+'&warn_distribute='+select_warn_distribute;
            // console.log(timeDistribute_url);
            public_ajax.call_request('get',timeDistribute_url,line_1_new);
        })
        // ===预警类型选项===
        $('#second_select-3').change(function(){
            var selectTime = $(this).parents('.content-2').find('#second_select-1').val();
            // 运营模式
            var select_operation_mode = $(this).parents('.content-2').find('#second_select-2').val();
            // 预警类型
            var select_illegal_type = $(this).val();
            // 实体类型
            var select_entity_type = $(this).parents('.content-2').find('#second_select-4').val();
            // 预警分布
            var select_warn_distribute = $(this).parents('.content-2').find('#second_city34').val();
            // timeDistribute_url = '/detection/TimeDistribute/?date='+selectTime;
            timeDistribute_url = '/detection/TimeDistribute/?date='+selectTime+'&operation_mode='+select_operation_mode+'&illegal_type='+select_illegal_type+'&entity_type='+select_entity_type+'&warn_distribute='+select_warn_distribute;
            // console.log(timeDistribute_url);
            public_ajax.call_request('get',timeDistribute_url,line_1_new);
        })
        // ===实体类型选项===
        $('#second_select-4').change(function(){
            var selectTime = $(this).parents('.content-2').find('#second_select-1').val();
            // 运营模式
            var select_operation_mode = $(this).parents('.content-2').find('#second_select-2').val();
            // 预警类型
            var select_illegal_type = $(this).parents('.content-2').find('#second_select-3').val();
            // 实体类型
            var select_entity_type = $(this).val();
            // 预警分布
            var select_warn_distribute = $(this).parents('.content-2').find('#second_city34').val();
            // timeDistribute_url = '/detection/TimeDistribute/?date='+selectTime;
            timeDistribute_url = '/detection/TimeDistribute/?date='+selectTime+'&operation_mode='+select_operation_mode+'&illegal_type='+select_illegal_type+'&entity_type='+select_entity_type+'&warn_distribute='+select_warn_distribute;
            // console.log(timeDistribute_url);
            public_ajax.call_request('get',timeDistribute_url,line_1_new);
        })
        // ===预警分布选项===
        $('#second_city34').change(function(){
            var selectTime = $(this).parents('.content-2').find('#second_select-1').val();
            // 运营模式
            var select_operation_mode = $(this).parents('.content-2').find('#second_select-2').val();
            // 预警类型
            var select_illegal_type = $(this).parents('.content-2').find('#second_select-3').val();
            // 实体类型
            var select_entity_type = $(this).parents('.content-2').find('#second_select-4').val();
            // 预警分布
            var select_warn_distribute = $(this).val();
            // timeDistribute_url = '/detection/TimeDistribute/?date='+selectTime;
            timeDistribute_url = '/detection/TimeDistribute/?date='+selectTime+'&operation_mode='+select_operation_mode+'&illegal_type='+select_illegal_type+'&entity_type='+select_entity_type+'&warn_distribute='+select_warn_distribute;
            // console.log(timeDistribute_url);
            public_ajax.call_request('get',timeDistribute_url,line_1_new);
        })

    //====预警类型====
    var warningType_url = '/detection/warnType/?date=7&operation_mode=all&illegal_type=0&entity_type=0&warn_distribute=all'
    public_ajax.call_request('get',warningType_url,pie_3);
    function pie_3(data) {
        var pie_3Data = [];
        if(data){
            var name = '';
            for(var i=0;i<data.length;i++){
                if(data[i].illegal_type == 1){
                    name = '模型预警';
                }else if(data[i].illegal_type == 2){
                    name = '舆情预警';
                }
                // pie_3Data.push({name:name,value:data[i].count})
                pie_3Data.push({name:name,value:data[i]['count(*)']})
            }
        }
        var myChart = echarts.init(document.getElementById('warningType'),'chalk');
        var option = {
            backgroundColor:'transparent',
            title : {
                text: '',
                subtext: '',
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                // data: ['收益率异常','广告异常','经营异常','宣传行为异常','负面评论异常','诉讼异常','模型异常','舆情异常']
                // data: ['收益率异常','广告异常','经营异常','诉讼异常','模型预警','舆情预警']
                data: ['模型预警','舆情预警']
            },
            series : [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '50%'],
                    // data:[
                    //     // {value:335, name:'收益率异常'},
                    //     // {value:310, name:'广告异常'},
                    //     // {value:234, name:'经营异常'},
                    //     // {value:135, name:'宣传行为异常'},
                    //     // {value:1548, name:'负面评论异常'},
                    //     // {value:456, name:'诉讼异常'},
                    //     {value:873, name:'模型预警'},
                    //     {value:633, name:'舆情预警'},
                    // ],
                    data:pie_3Data,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        myChart.setOption(option);
    }
    // pie_3();
    // 更新下拉框
        // ===时间选项===
        $('#second_select-1-2').change(function(){
            var selectTime = $(this).children('option:selected').val();//这就是selected的值
            // 运营模式
            var select_operation_mode = $(this).parents('.content-2-2').find('#second_select-2-2').val();
            // 预警类型
            var select_illegal_type = $(this).parents('.content-2-2').find('#second_select-3-2').val();
            // 实体类型
            var select_entity_type = $(this).parents('.content-2-2').find('#second_select-4-2').val();
            // 预警分布
            var select_warn_distribute = $(this).parents('.content-2-2').find('#second_city34-2').val();
            // warningType_url = '/detection/warnType/?date='+selectTime;
            warningType_url = '/detection/warnType/?date='+selectTime+'&operation_mode='+select_operation_mode+'&illegal_type='+select_illegal_type+'&entity_type='+select_entity_type+'&warn_distribute='+select_warn_distribute;
            // console.log(warningType_url);
            public_ajax.call_request('get',warningType_url,pie_3);
        })
        // ===运营模式选项===
        $('#second_select-2-2').change(function(){
            var selectTime = $(this).parents('.content-2-2').find('#second_select-1-2').val();
            // 运营模式
            var select_operation_mode = $(this).val();
            // 预警类型
            var select_illegal_type = $(this).parents('.content-2-2').find('#second_select-3-2').val();
            // 实体类型
            var select_entity_type = $(this).parents('.content-2-2').find('#second_select-4-2').val();
            // 预警分布
            var select_warn_distribute = $(this).parents('.content-2-2').find('#second_city34-2').val();
            // warningType_url = '/detection/warnType/?date='+selectTime;
            warningType_url = '/detection/warnType/?date='+selectTime+'&operation_mode='+select_operation_mode+'&illegal_type='+select_illegal_type+'&entity_type='+select_entity_type+'&warn_distribute='+select_warn_distribute;
            // console.log(warningType_url);
            public_ajax.call_request('get',warningType_url,pie_3);
        })
        // ===预警类型选项===
        $('#second_select-3-2').change(function(){
            var selectTime = $(this).parents('.content-2-2').find('#second_select-1-2').val();
            // 运营模式
            var select_operation_mode = $(this).parents('.content-2-2').find('#second_select-2-2').val();
            // 预警类型
            var select_illegal_type = $(this).val();
            // 实体类型
            var select_entity_type = $(this).parents('.content-2-2').find('#second_select-4-2').val();
            // 预警分布
            var select_warn_distribute = $(this).parents('.content-2-2').find('#second_city34-2').val();
            // warningType_url = '/detection/warnType/?date='+selectTime;
            warningType_url = '/detection/warnType/?date='+selectTime+'&operation_mode='+select_operation_mode+'&illegal_type='+select_illegal_type+'&entity_type='+select_entity_type+'&warn_distribute='+select_warn_distribute;
            // console.log(warningType_url);
            public_ajax.call_request('get',warningType_url,pie_3);
        })
        // ===实体类型选项===
        $('#second_select-4-2').change(function(){
            var selectTime = $(this).parents('.content-2-2').find('#second_select-1-2').val();
            // 运营模式
            var select_operation_mode = $(this).parents('.content-2-2').find('#second_select-2-2').val();
            // 预警类型
            var select_illegal_type = $(this).parents('.content-2-2').find('#second_select-3-2').val();
            // 实体类型
            var select_entity_type = $(this).val();
            // 预警分布
            var select_warn_distribute = $(this).parents('.content-2-2').find('#second_city34-2').val();
            // warningType_url = '/detection/warnType/?date='+selectTime;
            warningType_url = '/detection/warnType/?date='+selectTime+'&operation_mode='+select_operation_mode+'&illegal_type='+select_illegal_type+'&entity_type='+select_entity_type+'&warn_distribute='+select_warn_distribute;
            // console.log(warningType_url);
            public_ajax.call_request('get',warningType_url,pie_3);
        })
        // ===预警分布选项===
        $('#second_city34-2').change(function(){
            var selectTime = $(this).parents('.content-2-2').find('#second_select-1-2').val();
            // 运营模式
            var select_operation_mode = $(this).parents('.content-2-2').find('#second_select-2-2').val();
            // 预警类型
            var select_illegal_type = $(this).parents('.content-2-2').find('#second_select-3-2').val();
            // 实体类型
            var select_entity_type = $(this).parents('.content-2-2').find('#second_select-4-2').val();
            // 预警分布
            var select_warn_distribute = $(this).val();
            // warningType_url = '/detection/warnType/?date='+selectTime;
            warningType_url = '/detection/warnType/?date='+selectTime+'&operation_mode='+select_operation_mode+'&illegal_type='+select_illegal_type+'&entity_type='+select_entity_type+'&warn_distribute='+select_warn_distribute;
            // console.log(warningType_url);
            public_ajax.call_request('get',warningType_url,pie_3);
        })

//====预警分布====
    // ===表格
    var placeData=[{'a':'北京','b':'67','c':'25','d':'56'},{'a':'北京','b':'67','c':'25','d':'56'},{'a':'北京','b':'67','c':'25','d':'56'},
        {'a':'北京','b':'67','c':'25','d':'56'},{'a':'北京','b':'67','c':'25','d':'56'},{'a':'北京','b':'67','c':'25','d':'56'},
        {'a':'北京','b':'67','c':'25','d':'56'},{'a':'北京','b':'67','c':'25','d':'56'},{'a':'北京','b':'67','c':'25','d':'56'},
        {'a':'北京','b':'67','c':'25','d':'56'},{'a':'北京','b':'67','c':'25','d':'56'},{'a':'北京','b':'67','c':'25','d':'56'},
        {'a':'北京','b':'67','c':'25','d':'56'},{'a':'北京','b':'67','c':'25','d':'56'},{'a':'北京','b':'67','c':'25','d':'56'},
        {'a':'北京','b':'67','c':'25','d':'56'},{'a':'北京','b':'67','c':'25','d':'56'},{'a':'北京','b':'67','c':'25','d':'56'},
        {'a':'北京','b':'67','c':'25','d':'56'},{'a':'北京','b':'67','c':'25','d':'56'},{'a':'北京','b':'67','c':'25','d':'56'},
        {'a':'北京','b':'67','c':'25','d':'56'},{'a':'北京','b':'67','c':'25','d':'56'},{'a':'北京','b':'67','c':'25','d':'56'},
        {'a':'北京','b':'67','c':'25','d':'56'},{'a':'北京','b':'67','c':'25','d':'56'},{'a':'北京','b':'67','c':'25','d':'56'},]
    var placeRank_url='/detection/detectDistribute?date=7';
    public_ajax.call_request('get',placeRank_url,placeRank);
    var mapData = [],
        mapTop5 = [],
        mapT5 = [];
    var maxData;
    function placeRank(data) {
        if(data){
            for(var i=0;i<data.length;i++){
                mapData.push({name:data[i].city,value:data[i].sum})
            }
            // console.log(mapData);
            mapTop5 = data.slice(0,5);
            maxData = mapTop5[0].count2 || 100;
            for(var j=0;j<mapTop5.length;j++){
                mapT5.push({name:mapTop5[j].city,value:mapTop5[j].sum})
            }
            $('#placeRank').bootstrapTable('load', data);
            $('#placeRank').bootstrapTable({
                data:data,
                search: true,//是否搜索
                pagination: true,//是否分页
                pageSize: 10,//单页记录数
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
                columns: [
                    {
                        title: "城市",//标题
                        field: "city",//键名
                        sortable: true,//是否可排序
                        order: "desc",//默认排序方式
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value, row, index) {
                            if (row.city==''||row.city=='null'||row.city=='unknown'||!row.city){
                                return '未知';
                            }else {
                                return row.city;
                            };
                        }
                    },
                    {
                        title: "省份",//标题
                        field: "province",//键名
                        sortable: true,//是否可排序
                        order: "desc",//默认排序方式
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value, row, index) {
                            if (row.province==''||row.province=='null'||row.province=='unknown'||!row.province){
                                return '未知';
                            }else {
                                return row.province;
                            };
                        }
                    },

                    {
                        title: "模型预警",//标题
                        field: "count1",//键名
                        sortable: true,//是否可排序
                        order: "desc",//默认排序方式
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value, row, index) {
                            if (row.count1==''||row.count1=='null'||row.count1=='unknown'||!row.count1){
                                return '未知';
                            }else {
                                return row.count1;
                            };
                        }
                    },
                    {
                        title: "舆情预警",//标题
                        field: "count2",//键名
                        sortable: true,//是否可排序
                        order: "desc",//默认排序方式
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value, row, index) {
                            if (row.count2==''||row.count2=='null'||row.count2=='unknown'||!row.count2){
                                return '未知';
                            }else {
                                return row.count2;
                            };
                        }
                    },
                    // 指标预警去掉
                    // {
                    //     // title: "舆情预警",//标题
                    //     title: "指标预警",//标题
                    //     field: "count3",//键名
                    //     sortable: true,//是否可排序
                    //     order: "desc",//默认排序方式
                    //     align: "center",//水平
                    //     valign: "middle",//垂直
                    // },
                ],
            });
            $('#placeRank p.load').hide();

            // 地图
            require.config({
                paths: {
                    echarts: '/static/js/echarts-2/build/dist',
                }
            });
            require(
                [
                    'echarts',
                    'echarts/chart/map'
                ],
                function (ec) {
                    // var myChart = echarts.init(document.getElementById('picChart-1'),'dark');
                    var myChart = ec.init(document.getElementById('map'),'chalk');
                    var option = {
                        backgroundColor:'transparent',
                        title : {
                            text: '',
                            x:'center'
                        },
                        tooltip : {
                            trigger: 'item',
                        },
                        legend: {
                            orient: 'vertical',
                            x:'left',
                            data:['']
                        },
                        dataRange: {
                            min : 0,
                            // max : 100,
                            max : maxData,
                            calculable : true,
                            color: ['maroon','purple','red','orange','yellow','lightgreen'],
                            textStyle:{
                                color:'#fff'
                            }
                        },
                        series : [
                            {
                                name: '',
                                type: 'map',
                                mapType: 'china',
                                hoverable: true,
                                scaleLimit: {max:5, min:0.8},
                                data : [],
                                itemStyle: {
                                    normal: {
                                        borderWidth:2,
                                        borderColor:'white',
                                        color:'rgba(3, 3, 4, 0.41)',
                                        label: {
                                            show: false,
                                            textStyle: {
                                                color: "rgb(249, 249, 249)",
                                                fontSize: 14,
                                                fontWeight:'700',
                                            }
                                        }
                                    },
                                    emphasis: {// 也是选中样式
                                        borderWidth:2,
                                        borderColor:'#fff',
                                        color: 'rgba(4, 4, 4, 0.6)',
                                        label: {
                                            show: true,
                                            textStyle: {
                                                color: '#a3e00b',
                                                fontSize: 14,
                                                fontWeight:'700',
                                            }
                                        }
                                    }
                                },
                                markPoint : {
                                    symbolSize: 5,       // 标注大小，半宽（半径）参数，当图形为方向或菱形则总宽度为symbolSize * 2
                                    itemStyle: {
                                        normal: {
                                            borderColor: '#87cefa',
                                            borderWidth: 1,            // 标注边线线宽，单位px，默认为1
                                            label: {
                                                show: false
                                            }
                                        },
                                        emphasis: {
                                            borderColor: '#1e90ff',
                                            borderWidth: 5,
                                            label: {
                                                show: false
                                            }
                                        }
                                    },
                                    /*
                                    data : [
                                        {name: "海门", value: 9},
                                        {name: "鄂尔多斯", value: 12},
                                        {name: "招远", value: 12},
                                        {name: "舟山", value: 12},
                                        {name: "齐齐哈尔", value: 14},
                                        {name: "盐城", value: 15},
                                        {name: "赤峰", value: 16},
                                        {name: "青岛", value: 18},
                                        {name: "乳山", value: 18},
                                        {name: "金昌", value: 19},
                                        {name: "泉州", value: 21},
                                        {name: "莱西", value: 21},
                                        {name: "日照", value: 21},
                                        {name: "胶南", value: 22},
                                        {name: "南通", value: 23},
                                        {name: "拉萨", value: 24},
                                        {name: "云浮", value: 24},
                                        {name: "梅州", value: 25},
                                        {name: "文登", value: 25},
                                        {name: "上海", value: 25},
                                        {name: "攀枝花", value: 25},
                                        {name: "威海", value: 25},
                                        {name: "承德", value: 25},
                                        {name: "厦门", value: 26},
                                        {name: "汕尾", value: 26},
                                        {name: "潮州", value: 26},
                                        {name: "丹东", value: 27},
                                        {name: "太仓", value: 27},
                                        {name: "曲靖", value: 27},
                                        {name: "烟台", value: 28},
                                        {name: "福州", value: 29},
                                        {name: "瓦房店", value: 30},
                                        {name: "即墨", value: 30},
                                        {name: "抚顺", value: 31},
                                        {name: "玉溪", value: 31},
                                        {name: "张家口", value: 31},
                                        {name: "阳泉", value: 31},
                                        {name: "莱州", value: 32},
                                        {name: "湖州", value: 32},
                                        {name: "汕头", value: 32},
                                        {name: "昆山", value: 33},
                                        {name: "宁波", value: 33},
                                        {name: "湛江", value: 33},
                                        {name: "揭阳", value: 34},
                                        {name: "荣成", value: 34},
                                        {name: "连云港", value: 35},
                                        {name: "葫芦岛", value: 35},
                                        {name: "常熟", value: 36},
                                        {name: "东莞", value: 36},
                                        {name: "河源", value: 36},
                                        {name: "淮安", value: 36},
                                        {name: "泰州", value: 36},
                                        {name: "南宁", value: 37},
                                        {name: "营口", value: 37},
                                        {name: "惠州", value: 37},
                                        {name: "江阴", value: 37},
                                        {name: "蓬莱", value: 37},
                                        {name: "韶关", value: 38},
                                        {name: "嘉峪关", value: 38},
                                        {name: "广州", value: 38},
                                        {name: "延安", value: 38},
                                        {name: "太原", value: 39},
                                        {name: "清远", value: 39},
                                        {name: "中山", value: 39},
                                        {name: "昆明", value: 39},
                                        {name: "寿光", value: 40},
                                        {name: "盘锦", value: 40},
                                        {name: "长治", value: 41},
                                        {name: "深圳", value: 41},
                                        {name: "珠海", value: 42},
                                        {name: "宿迁", value: 43},
                                        {name: "咸阳", value: 43},
                                        {name: "铜川", value: 44},
                                        {name: "平度", value: 44},
                                        {name: "佛山", value: 44},
                                        {name: "海口", value: 44},
                                        {name: "江门", value: 45},
                                        {name: "章丘", value: 45},
                                        {name: "肇庆", value: 46},
                                        {name: "大连", value: 47},
                                        {name: "临汾", value: 47},
                                        {name: "吴江", value: 47},
                                        {name: "石嘴山", value: 49},
                                        {name: "沈阳", value: 50},
                                        {name: "苏州", value: 50},
                                        {name: "茂名", value: 50},
                                        {name: "嘉兴", value: 51},
                                        {name: "长春", value: 51},
                                        {name: "胶州", value: 52},
                                        {name: "银川", value: 52},
                                        {name: "张家港", value: 52},
                                        {name: "三门峡", value: 53},
                                        {name: "锦州", value: 54},
                                        {name: "南昌", value: 54},
                                        {name: "柳州", value: 54},
                                        {name: "三亚", value: 54},
                                        {name: "自贡", value: 56},
                                        {name: "吉林", value: 56},
                                        {name: "阳江", value: 57},
                                        {name: "泸州", value: 57},
                                        {name: "西宁", value: 57},
                                        {name: "宜宾", value: 58},
                                        {name: "呼和浩特", value: 58},
                                        {name: "成都", value: 58},
                                        {name: "大同", value: 58},
                                        {name: "镇江", value: 59},
                                        {name: "桂林", value: 59},
                                        {name: "张家界", value: 59},
                                        {name: "宜兴", value: 59},
                                        {name: "北海", value: 60},
                                        {name: "西安", value: 61},
                                        {name: "金坛", value: 62},
                                        {name: "东营", value: 62},
                                        {name: "牡丹江", value: 63},
                                        {name: "遵义", value: 63},
                                        {name: "绍兴", value: 63},
                                        {name: "扬州", value: 64},
                                        {name: "常州", value: 64},
                                        {name: "潍坊", value: 65},
                                        {name: "重庆", value: 66},
                                        {name: "台州", value: 67},
                                        {name: "南京", value: 67},
                                        {name: "滨州", value: 70},
                                        {name: "贵阳", value: 71},
                                        {name: "无锡", value: 71},
                                        {name: "本溪", value: 71},
                                        {name: "克拉玛依", value: 72},
                                        {name: "渭南", value: 72},
                                        {name: "马鞍山", value: 72},
                                        {name: "宝鸡", value: 72},
                                        {name: "焦作", value: 75},
                                        {name: "句容", value: 75},
                                        {name: "北京", value: 79},
                                        {name: "徐州", value: 79},
                                        {name: "衡水", value: 80},
                                        {name: "包头", value: 80},
                                        {name: "绵阳", value: 80},
                                        {name: "乌鲁木齐", value: 84},
                                        {name: "枣庄", value: 84},
                                        {name: "杭州", value: 84},
                                        {name: "淄博", value: 85},
                                        {name: "鞍山", value: 86},
                                        {name: "溧阳", value: 86},
                                        {name: "库尔勒", value: 86},
                                        {name: "安阳", value: 90},
                                        {name: "开封", value: 90},
                                        {name: "济南", value: 92},
                                        {name: "德阳", value: 93},
                                        {name: "温州", value: 95},
                                        {name: "九江", value: 96},
                                        {name: "邯郸", value: 98},
                                        {name: "临安", value: 99},
                                        {name: "兰州", value: 99},
                                        {name: "沧州", value: 100},
                                        {name: "临沂", value: 103},
                                        {name: "南充", value: 104},
                                        {name: "天津", value: 105},
                                        {name: "富阳", value: 106},
                                        {name: "泰安", value: 112},
                                        {name: "诸暨", value: 112},
                                        {name: "郑州", value: 113},
                                        {name: "哈尔滨", value: 114},
                                        {name: "聊城", value: 116},
                                        {name: "芜湖", value: 117},
                                        {name: "唐山", value: 119},
                                        {name: "平顶山", value: 119},
                                        {name: "邢台", value: 119},
                                        {name: "德州", value: 120},
                                        {name: "济宁", value: 120},
                                        {name: "荆州", value: 127},
                                        {name: "宜昌", value: 130},
                                        {name: "义乌", value: 132},
                                        {name: "丽水", value: 133},
                                        {name: "洛阳", value: 134},
                                        {name: "秦皇岛", value: 136},
                                        {name: "株洲", value: 143},
                                        {name: "石家庄", value: 147},
                                        {name: "莱芜", value: 148},
                                        {name: "常德", value: 152},
                                        {name: "保定", value: 153},
                                        {name: "湘潭", value: 154},
                                        {name: "金华", value: 157},
                                        {name: "岳阳", value: 169},
                                        {name: "长沙", value: 175},
                                        {name: "衢州", value: 177},
                                        {name: "廊坊", value: 193},
                                        {name: "菏泽", value: 194},
                                        {name: "合肥", value: 229},
                                        {name: "武汉", value: 273},
                                        {name: "大庆", value: 279}
                                    ],
                                    */
                                    data:mapData
                                },
                                // 更全的地理经纬信息
                                geoCoord : {
                                    '北京':[116.4,39.9],
                                    '天津':[117.2,39.12],
                                    '石家庄':[114.52,38.05],
                                    '唐山':[118.2,39.63],
                                    '秦皇岛':[119.6,39.93],
                                    '邯郸':[114.48,36.62],
                                    '邢台':[114.48,37.07],
                                    '保定':[115.47,38.87],
                                    '张家口':[114.88,40.82],
                                    '承德':[117.93,40.97],
                                    '沧州':[116.83,38.3],
                                    '廊坊':[116.7,39.52],
                                    '衡水':[115.68,37.73],
                                    '太原':[112.55,37.87],
                                    '大同':[113.3,40.08],
                                    '阳泉':[113.57,37.85],
                                    '长治':[113.12,36.2],
                                    '晋城':[112.83,35.5],
                                    '朔州':[112.43,39.33],
                                    '晋中':[112.75,37.68],
                                    '运城':[110.98,35.02],
                                    '忻州':[112.73,38.42],
                                    '临汾':[111.52,36.08],
                                    '吕梁':[111.13,37.52],
                                    '呼和浩特':[111.73,40.83],
                                    '包头':[109.83,40.65],
                                    '乌海':[106.82,39.67],
                                    '赤峰':[118.92,42.27],
                                    '通辽':[122.27,43.62],
                                    '鄂尔多斯':[109.8,39.62],
                                    '呼伦贝尔':[119.77,49.22],
                                    '巴彦淖尔':[107.42,40.75],
                                    '乌兰察布':[113.12,40.98],
                                    '兴安盟':[122.05,46.08],
                                    '锡林郭勒盟':[116.07,43.95],
                                    '阿拉善盟':[105.67,38.83],
                                    '沈阳':[123.43,41.8],
                                    '大连':[121.62,38.92],
                                    '鞍山':[122.98,41.1],
                                    '抚顺':[123.98,41.88],
                                    '本溪':[123.77,41.3],
                                    '丹东':[124.38,40.13],
                                    '锦州':[121.13,41.1],
                                    '营口':[122.23,40.67],
                                    '阜新':[121.67,42.02],
                                    '辽阳':[123.17,41.27],
                                    '盘锦':[122.07,41.12],
                                    '铁岭':[123.83,42.28],
                                    '朝阳':[120.45,41.57],
                                    '葫芦岛':[120.83,40.72],
                                    '长春':[125.32,43.9],
                                    '吉林':[126.55,43.83],
                                    '四平':[124.35,43.17],
                                    '辽源':[125.13,42.88],
                                    '通化':[125.93,41.73],
                                    '白山':[126.42,41.93],
                                    '松原':[124.82,45.13],
                                    '白城':[122.83,45.62],
                                    '延边朝鲜族自治州':[129.5,42.88],
                                    '哈尔滨':[126.53,45.8],
                                    '齐齐哈尔':[123.95,47.33],
                                    '鸡西':[130.97,45.3],
                                    '鹤岗':[130.27,47.33],
                                    '双鸭山':[131.15,46.63],
                                    '大庆':[125.03,46.58],
                                    '伊春':[128.9,47.73],
                                    '佳木斯':[130.37,46.82],
                                    '七台河':[130.95,45.78],
                                    '牡丹江':[129.6,44.58],
                                    '黑河':[127.48,50.25],
                                    '绥化':[126.98,46.63],
                                    '大兴安岭地区':[124.12,50.42],
                                    '上海':[121.47,31.23],
                                    '南京':[118.78,32.07],
                                    '无锡':[120.3,31.57],
                                    '徐州':[117.18,34.27],
                                    '常州':[119.95,31.78],
                                    '苏州':[120.58,31.3],
                                    '南通':[120.88,31.98],
                                    '连云港':[119.22,34.6],
                                    '淮安':[119.02,33.62],
                                    '盐城':[120.15,33.35],
                                    '扬州':[119.4,32.4],
                                    '镇江':[119.45,32.2],
                                    '泰州':[119.92,32.45],
                                    '宿迁':[118.28,33.97],
                                    '杭州':[120.15,30.28],
                                    '宁波':[121.55,29.88],
                                    '温州':[120.7,28],
                                    '嘉兴':[120.75,30.75],
                                    '湖州':[120.08,30.9],
                                    '绍兴':[120.57,30],
                                    '金华':[119.65,29.08],
                                    '衢州':[118.87,28.93],
                                    '舟山':[122.2,30],
                                    '台州':[121.43,28.68],
                                    '丽水':[119.92,28.45],
                                    '合肥':[117.25,31.83],
                                    '芜湖':[118.38,31.33],
                                    '蚌埠':[117.38,32.92],
                                    '淮南':[117,32.63],
                                    '马鞍山':[118.5,31.7],
                                    '淮北':[116.8,33.95],
                                    '铜陵':[117.82,30.93],
                                    '安庆':[117.05,30.53],
                                    '黄山':[118.33,29.72],
                                    '滁州':[118.32,32.3],
                                    '阜阳':[115.82,32.9],
                                    '宿州':[116.98,33.63],
                                    '巢湖':[117.87,31.6],
                                    '六安':[116.5,31.77],
                                    '亳州':[115.78,33.85],
                                    '宣城':[118.75,30.95],
                                    '福州':[119.3,26.08],
                                    '厦门':[118.08,24.48],
                                    '莆田':[119,25.43],
                                    '三明':[117.62,26.27],
                                    '泉州':[118.67,24.88],
                                    '漳州':[117.65,24.52],
                                    '南平':[118.17,26.65],
                                    '龙岩':[117.03,25.1],
                                    '宁德':[119.52,26.67],
                                    '南昌':[115.85,28.68],
                                    '景德镇':[117.17,29.27],
                                    '萍乡':[113.85,27.63],
                                    '九江':[116,29.7],
                                    '新余':[114.92,27.82],
                                    '鹰潭':[117.07,28.27],
                                    '赣州':[114.93,25.83],
                                    '吉安':[114.98,27.12],
                                    '宜春':[114.38,27.8],
                                    '抚州':[116.35,28],
                                    '上饶':[117.97,28.45],
                                    '济南':[116.98,36.67],
                                    '青岛':[120.38,36.07],
                                    '淄博':[118.05,36.82],
                                    '枣庄':[117.32,34.82],
                                    '东营':[118.67,37.43],
                                    '烟台':[121.43,37.45],
                                    '潍坊':[119.15,36.7],
                                    '济宁':[116.58,35.42],
                                    '泰安':[117.08,36.2],
                                    '威海':[122.12,37.52],
                                    '日照':[119.52,35.42],
                                    '莱芜':[117.67,36.22],
                                    '临沂':[118.35,35.05],
                                    '德州':[116.3,37.45],
                                    '聊城':[115.98,36.45],
                                    '滨州':[117.97,37.38],
                                    '菏泽':[115.43,35.25],
                                    '郑州':[113.62,34.75],
                                    '开封':[114.3,34.8],
                                    '洛阳':[112.45,34.62],
                                    '平顶山':[113.18,33.77],
                                    '安阳':[114.38,36.1],
                                    '鹤壁':[114.28,35.75],
                                    '新乡':[113.9,35.3],
                                    '焦作':[113.25,35.22],
                                    '濮阳':[115.03,35.77],
                                    '许昌':[113.85,34.03],
                                    '三门峡':[111.2,34.78],
                                    '南阳':[112.52,33],
                                    '商丘':[115.65,34.45],
                                    '信阳':[114.07,32.13],
                                    '周口':[114.65,33.62],
                                    '驻马店':[114.02,32.98],
                                    '武汉':[114.3,30.6],
                                    '黄石':[115.03,30.2],
                                    '十堰':[110.78,32.65],
                                    '宜昌':[111.28,30.7],
                                    '襄阳':[112.15,32.02],
                                    '鄂州':[114.88,30.4],
                                    '荆门':[112.2,31.03],
                                    '孝感':[113.92,30.93],
                                    '荆州':[112.23,30.33],
                                    '黄冈':[114.87,30.45],
                                    '咸宁':[114.32,29.85],
                                    '随州':[113.37,31.72],
                                    '恩施土家族苗族自治州':[109.47,30.3],
                                    '仙桃':[113.45,30.37],
                                    '长沙':[112.93,28.23],
                                    '株洲':[113.13,27.83],
                                    '湘潭':[112.93,27.83],
                                    '衡阳':[112.57,26.9],
                                    '邵阳':[111.47,27.25],
                                    '岳阳':[113.12,29.37],
                                    '常德':[111.68,29.05],
                                    '张家界':[110.47,29.13],
                                    '益阳':[112.32,28.6],
                                    '郴州':[113.02,25.78],
                                    '永州':[111.62,26.43],
                                    '怀化':[110,27.57],
                                    '娄底':[112,27.73],
                                    '湘西土家族苗族自治州':[109.73,28.32],
                                    '广州':[113.27,23.13],
                                    '韶关':[113.6,24.82],
                                    '深圳':[114.05,22.55],
                                    '珠海':[113.57,22.27],
                                    '汕头':[116.68,23.35],
                                    '佛山':[113.12,23.02],
                                    '江门':[113.08,22.58],
                                    '湛江':[110.35,21.27],
                                    '茂名':[110.92,21.67],
                                    '肇庆':[112.47,23.05],
                                    '惠州':[114.42,23.12],
                                    '梅州':[116.12,24.28],
                                    '汕尾':[115.37,22.78],
                                    '河源':[114.7,23.73],
                                    '阳江':[111.98,21.87],
                                    '清远':[113.03,23.7],
                                    '东莞':[113.75,23.05],
                                    '中山':[113.38,22.52],
                                    '潮州':[116.62,23.67],
                                    '揭阳':[116.37,23.55],
                                    '云浮':[112.03,22.92],
                                    '南宁':[108.37,22.82],
                                    '柳州':[109.42,24.33],
                                    '桂林':[110.28,25.28],
                                    '梧州':[111.27,23.48],
                                    '北海':[109.12,21.48],
                                    '防城港':[108.35,21.7],
                                    '钦州':[108.62,21.95],
                                    '贵港':[109.6,23.1],
                                    '玉林':[110.17,22.63],
                                    '百色':[106.62,23.9],
                                    '贺州':[111.55,24.42],
                                    '河池':[108.07,24.7],
                                    '来宾':[109.23,23.73],
                                    '崇左':[107.37,22.4],
                                    '海口':[110.32,20.03],
                                    '三亚':[109.5,18.25],
                                    '五指山':[109.52,18.78],
                                    '琼海':[110.47,19.25],
                                    '儋州':[109.57,19.52],
                                    '文昌':[110.8,19.55],
                                    '万宁':[110.4,18.8],
                                    '东方':[108.63,19.1],
                                    '重庆':[106.55,29.57],
                                    '成都':[104.07,30.67],
                                    '自贡':[104.78,29.35],
                                    '攀枝花':[101.72,26.58],
                                    '泸州':[105.43,28.87],
                                    '德阳':[104.38,31.13],
                                    '绵阳':[104.73,31.47],
                                    '广元':[105.85,32.43],
                                    '遂宁':[105.57,30.52],
                                    '内江':[105.05,29.58],
                                    '乐山':[103.77,29.57],
                                    '南充':[106.08,30.78],
                                    '眉山':[103.83,30.05],
                                    '宜宾':[104.62,28.77],
                                    '广安':[106.63,30.47],
                                    '达州':[107.5,31.22],
                                    '雅安':[103,29.98],
                                    '巴中':[106.77,31.85],
                                    '资阳':[104.65,30.12],
                                    '阿坝藏族羌族自治州':[102.22,31.9],
                                    '甘孜藏族自治州':[101.97,30.05],
                                    '凉山彝族自治州':[102.27,27.9],
                                    '贵阳':[106.63,26.65],
                                    '六盘水':[104.83,26.6],
                                    '遵义':[106.92,27.73],
                                    '安顺':[105.95,26.25],
                                    '铜仁地区':[109.18,27.72],
                                    '兴义':[104.9,25.08],
                                    '毕节地区':[105.28,27.3],
                                    '黔东南苗族侗族自治州':[107.97,26.58],
                                    '昆明':[102.72,25.05],
                                    '曲靖':[103.8,25.5],
                                    '玉溪':[102.55,24.35],
                                    '保山':[99.17,25.12],
                                    '昭通':[103.72,27.33],
                                    '丽江':[100.23,26.88],
                                    '墨江哈尼族自治县':[101.68,23.43],
                                    '临沧':[100.08,23.88],
                                    '楚雄彝族自治州':[101.55,25.03],
                                    '红河哈尼族彝族自治州':[103.4,23.37],
                                    '红河':[103.4,23.37],
                                    '文山壮族苗族自治州':[104.25,23.37],
                                    '西双版纳傣族自治州':[100.8,22.02],
                                    '大理白族自治州':[100.23,25.6],
                                    '大理白族自治州':[100.23,25.6],
                                    '德宏傣族景颇族自治州':[98.58,24.43],
                                    '怒江傈僳族自治州':[98.85,25.85],
                                    '迪庆藏族自治州':[99.7,27.83],
                                    '拉萨':[91.13,29.65],
                                    '昌都地区':[97.18,31.13],
                                    '山南地区':[91.77,29.23],
                                    '日喀则地区':[88.88,29.27],
                                    '那曲地区':[92.07,31.48],
                                    '林芝地区':[94.37,29.68],
                                    '西安':[108.93,34.27],
                                    '铜川':[108.93,34.9],
                                    '宝鸡':[107.13,34.37],
                                    '咸阳':[108.7,34.33],
                                    '渭南':[109.5,34.5],
                                    '延安':[109.48,36.6],
                                    '汉中':[107.02,33.07],
                                    '榆林':[109.73,38.28],
                                    '安康':[109.02,32.68],
                                    '商洛':[109.93,33.87],
                                    '兰州':[103.82,36.07],
                                    '嘉峪关':[98.27,39.8],
                                    '金昌':[102.18,38.5],
                                    '白银':[104.18,36.55],
                                    '天水':[105.72,34.58],
                                    '武威':[102.63,37.93],
                                    '张掖':[100.45,38.93],
                                    '平凉':[106.67,35.55],
                                    '酒泉':[98.52,39.75],
                                    '庆阳':[107.63,35.73],
                                    '定西':[104.62,35.58],
                                    '陇南':[104.92,33.4],
                                    '临夏回族自治州':[103.22,35.6],
                                    '甘南藏族自治州':[102.92,34.98],
                                    '西宁':[101.78,36.62],
                                    '海东地区':[102.12,36.5],
                                    '海北藏族自治州':[100.9,36.97],
                                    '黄南藏族自治州':[102.02,35.52],
                                    '海南藏族自治州':[100.62,36.28],
                                    '果洛藏族自治州':[100.23,34.48],
                                    '玉树藏族自治州':[97.02,33],
                                    '海西蒙古族藏族自治州':[97.37,37.37],
                                    '银川':[106.28,38.47],
                                    '石嘴山':[106.38,39.02],
                                    '吴忠':[106.2,37.98],
                                    '固原':[106.28,36],
                                    '中卫':[105.18,37.52],
                                    '乌鲁木齐':[87.62,43.82],
                                    '克拉玛依':[84.87,45.6],
                                    '吐鲁番地区':[89.17,42.95],
                                    '哈密地区':[93.52,42.83],
                                    '昌吉回族自治州':[87.3,44.02],
                                    '博尔塔拉蒙古自治州':[82.07,44.9],
                                    '巴音郭楞蒙古自治州':[86.15,41.77],
                                    '阿克苏地区':[80.27,41.17],
                                    '阿图什':[76.17,39.72],
                                    '喀什地区':[75.98,39.47],
                                    '和田地区':[79.92,37.12],
                                    '伊犁哈萨克自治州':[81.32,43.92],
                                    '塔城地区':[82.98,46.75],
                                    '阿勒泰地区':[88.13,47.85],
                                    '石河子':[86.03,44.3],
                                    '香港':[114.08,22.2],
                                    // '澳门':[113.33,22.13],
                                    '澳门':[113.5494640000,22.1929190000],
                                    '台北':[121.5,25.03],
                                    '高雄':[120.28,22.62],
                                    '基隆':[121.73,25.13],
                                    '台中':[120.67,24.15],
                                    '台南':[120.2,23],
                                    '新竹':[120.95,24.82],
                                    '嘉义':[120.43,23.48],

                                    // ===2017 11 21 LL 新添加的深圳定位信息===
                                    '龙岗区':[114.2544550000,22.7260170000],
                                    '盐田区':[114.2434300000,22.5634380000],
                                    '坪山区':[114.3504740000,22.7162330000],
                                    '大鹏新区':[114.4808220000,22.6044740000],

                                    '深汕特别合作区':[114.9957620000,22.8380630000],
                                    '宝安区':[113.8904270000,22.5600330000],
                                    '光明新区':[113.9236620000,22.7790820000],
                                    '南山区':[113.9365390000,22.5385000000],

                                    '前海特区':[113.9095760000,22.5236480000],
                                    '龙华区':[114.0485290000,22.7575970000],
                                    '福田区':[114.0615470000,22.5284660000],
                                    '罗湖区':[114.1374320000,22.5544850000],

                                    // ===2017 11 20 LL 新添加的青海定位信息===
                                    '果洛藏族自治州':[99.3823,34.0466],
                                    '海东地区':[102.3706,36.2988],
                                    '海北藏族自治州':[100.3711,37.9138],
                                    '海南藏族自治州':[100.3711,35.9418],
                                    '海西蒙古族藏族自治州':[94.9768,37.1118],
                                    '玉树藏族自治州':[93.5925,33.9368],
                                    '黄南藏族自治州':[101.5686,35.1178],
                                    // 四川
                                    '乐山市':[103.5791,29.1742],
                                    '内江市':[104.8535,29.6136],
                                    '凉山彝族自治州':[101.9641,27.6746],
                                    '巴中':[107.0618,31.9977],
                                    '广元':[105.6885,32.2284],
                                    '广安':[106.6333,30.4376],
                                    '甘孜藏族自治州':[99.9207,31.0803],
                                    '眉山':[103.8098,330.0146],
                                    '资阳':[104.9744,30.1575],
                                    '达州':[107.6111,31.333],
                                    '遂宁':[105.5347,30.6683],
                                    '阿坝藏族羌族自治州':[102.4805,32.4536],
                                    '雅安':[102.6672,29.8938],
                                    // 海南
                                    '万宁':[110.3137,18.8388],
                                    '东方':[108.8498,19.0414],
                                    '临高县':[109.6957,19.8063],
                                    '乐东黎族自治县':[109.0283,18.6301],
                                    '五指山':[109.5282,18.8299],
                                    '保亭黎族苗族自治县':[109.6284,18.6108],
                                    '儋州':[109.3291,19.5653],
                                    '定安县':[110.3384,19.4698],
                                    '屯昌县':[110.0377,19.362],
                                    '文昌':[110.8905,19.7823],
                                    '昌江黎族自治县':[109.0407,19.2137],
                                    '澄迈县':[109.9937,19.7314],
                                    '琼中黎族苗族自治县':[109.8413,19.0736],
                                    '琼海':[110.4208,19.224],
                                    '白沙黎族自治县':[109.3703,19.211],
                                    '陵水黎族自治县':[109.9924,18.5415],

                                    // 云南
                                    '普洱':[100.9725700000,22.8309790000],

                                    // 湖北
                                    '襄樊':[112.1285370000,32.0147970000],
                                    '神农架林区':[110.6825250000,31.7504960000],
                                    '天门':[113.1724090000,30.6696220000],
                                    '潜江':[112.9054740000,30.4083580000],

                                    // 黑龙江
                                    '大兴安岭':[123.6445590000,52.5109470000],

                                    // 贵州
                                    '黔南布依族苗族自治州':[107.0236160000,25.9995600000],
                                    '黔西南布依族苗族自治州':[105.4966400000,25.0354490000],
                                    '黔西南':[105.4966400000,25.0354490000],

                                    // 河南
                                    '漯河':[114.0234210000,33.5877110000],
                                    // 安徽,
                                    '池州':[117.4984210000,30.6708840000],
                                    // 台湾,
                                    '台湾':[120.9614540000,23.8040600000],
                                    // 新疆
                                    '五家渠市':[87.5499370000,44.1724450000],
                                    '阿拉尔市':[81.2873540000,40.5532640000],
                                    '图木舒克市':[79.0756160000,39.8712090000],
                                    '克孜勒苏柯尔克孜自治州':[76.1743090000,39.7204710000],
                                    // 西藏
                                    '阿里地区':[80.1127770000,32.5068660000],
                                    // 北京
                                    '东城区':[116.4224010000,39.9348270000],
                                    '丰台区':[116.2924020000,39.8649370000],
                                    '大兴区':[116.3486250000,39.7325550000],
                                    '宣武区':[116.3956480000,39.9027030000],
                                    '密云县':[116.8495470000,40.3821760000],
                                    '崇文区':[116.4372790000,39.8905870000],
                                    '平谷区':[117.1273790000,40.1469510000],
                                    '延庆县':[115.9816320000,40.4621690000],
                                    '怀柔区':[116.6383860000,40.3226180000],
                                    '房山区':[116.1494440000,39.7543260000],
                                    '昌平区':[116.2376180000,40.2264130000],
                                    '朝阳区':[116.4495590000,39.9263750000],
                                    '海淀区':[116.3054340000,39.9654900000],
                                    '石景山区':[116.2296130000,39.9113540000],
                                    '西城区':[116.3725140000,39.9181240000],
                                    '通州区':[116.6634150000,39.9160170000],
                                    '门头沟区':[116.1076040000,39.9461470000],
                                    '顺义区':[116.6614240000,40.1363510000],
                                    // 天津
                                    '东丽区':[117.3205690000,39.0923320000],
                                    '北辰区':[117.1414030000,39.2303440000],
                                    '南开区':[117.1565150000,39.1441050000],
                                    '和平区':[117.2214670000,39.1233900000],
                                    '塘沽区':[117.6700730000,39.0331920000],
                                    '大港区':[117.4674980000,38.8492790000],
                                    '宁河县':[117.8323930000,39.3369560000],
                                    '宝坻区':[117.3166010000,39.7231940000],
                                    '武清区':[117.0505970000,39.3898710000],
                                    '汉沽区':[117.7877890000,39.2470880000],
                                    '河东区':[117.2584130000,39.1344870000],
                                    '河北区':[117.2035930000,39.1534850000],
                                    '河西区':[117.2294160000,39.1157180000],
                                    '津南区':[117.3633870000,38.9441480000],
                                    '红桥区':[117.1575180000,39.1732860000],
                                    '蓟县':[117.4145790000,40.0515090000],
                                    '西青区':[117.0144100000,39.1487270000],
                                    '静海县':[116.9804690000,38.9533710000],
                                    // 上海
                                    '南汇区':[121.7653220000,31.0502860000],
                                    '卢湾区':[121.4795090000,31.2153440000],
                                    '嘉定区':[121.2725950000,31.3801550000],
                                    '奉贤区':[121.4805040000,30.9237200000],
                                    '宝山区':[121.4965630000,31.4102790000],
                                    '崇明县':[121.4035570000,31.6285700000],
                                    '徐汇区':[121.4433960000,31.1945570000],
                                    '普陀区':[121.4035690000,31.2549730000],
                                    '杨浦区':[121.5325200000,31.2655240000],
                                    '松江区':[121.2344800000,31.0371350000],
                                    '浦东新区':[121.5504550000,31.2273480000],
                                    '虹口区':[121.5115860000,31.2697470000],
                                    '金山区':[121.3484800000,30.7478520000],
                                    '长宁区':[121.4304540000,31.2268480000],
                                    '闵行区':[121.3886120000,31.1188430000],
                                    '闸北区':[121.4705760000,31.2504650000],
                                    '青浦区':[121.1305530000,31.1554540000],
                                    '静安区':[121.4534320000,31.2338450000],
                                    '黄浦区':[121.4915860000,31.2372470000],
                                    // 重庆
                                    '万州区':[108.4155580000,30.8136220000],
                                    '万盛区':[106.9336780000,28.9546900000],
                                    '丰都县':[107.7374810000,29.8694130000],
                                    '九龙坡区':[106.5175590000,29.5079280000],
                                    '云阳县':[108.7034480000,30.9366110000],
                                    '北碚区':[106.4035690000,29.8116030000],
                                    '南岸区':[106.6684300000,29.5026830000],
                                    '南川区':[107.1055850000,29.1634790000],
                                    '双桥区':[117.9494280000,40.9808240000],
                                    '合川区':[117.9494280000,40.9808240000],
                                    '垫江县':[107.3395660000,30.3332940000],
                                    '城口县':[108.6716120000,31.9533910000],
                                    '大渡口区':[106.4885340000,29.4901070000],
                                    '大足县':[105.7153260000,29.7008440000],
                                    '奉节县':[109.4704730000,31.0246020000],
                                    '巫山县':[109.8855460000,31.0805190000],
                                    '巫溪县':[109.5764030000,31.4048800000],
                                    '巴南区':[106.5474540000,29.4084750000],
                                    '开县':[108.3994980000,31.1666440000],
                                    '彭水苗族土家族自治县':[108.1725780000,29.2994620000],
                                    '忠县':[108.0445380000,30.3052680000],
                                    '梁平县':[107.8105490000,30.6799800000],
                                    '武隆县':[107.7664250000,29.3320270000],
                                    '永川区':[105.9334990000,29.3620460000],
                                    '江北区':[106.5804150000,29.6128320000],
                                    '江津区':[106.2655980000,29.2958840000],
                                    '沙坪坝区':[106.4644650000,29.5471930000],
                                    '涪陵区':[107.3964200000,29.7092780000],
                                    '渝中区':[106.5754400000,29.5590900000],
                                    '渝北区':[106.6375590000,29.7239270000],
                                    '潼南县':[105.8473990000,30.1973140000],
                                    '璧山县':[106.2334750000,29.5983470000],
                                    '石柱土家族自治县':[108.1204140000,30.0061090000],
                                    '秀山土家族苗族自治县':[109.0135740000,28.4534480000],
                                    '綦江县':[106.6574840000,29.0341140000],
                                    '荣昌县':[105.6043300000,29.4067780000],
                                    '酉阳土家族苗族自治县':[108.7745860000,28.8470400000],
                                    '铜梁县':[106.0634490000,29.8505090000],
                                    '长寿区':[107.0875310000,29.8635200000],
                                    '黔江区':[108.7775910000,29.5388130000],
                                }
                            },
                            {
                                name: 'Top5',
                                type: 'map',
                                mapType: 'china',
                                data:[],
                                markPoint : {
                                    symbol:'emptyCircle',
                                    symbolSize : function (v){
                                        return 10 + v/1000
                                    },
                                    effect : {
                                        show: true,
                                        shadowBlur : 0
                                    },
                                    itemStyle:{
                                        normal:{
                                            label:{show:false}
                                        }
                                    },
                                    /*
                                    data : [
                                        {name: "廊坊", value: 193},
                                        {name: "菏泽", value: 194},
                                        {name: "合肥", value: 229},
                                        {name: "武汉", value: 273},
                                        {name: "大庆", value: 279}
                                    ]
                                    */
                                    data:mapT5
                                }
                            }
                        ]
                    };
                    $('#map p.load').hide();
                    myChart.setOption(option);
                }
            );
        }
    };
    // placeRank(placeData);
    // ===时间选项===
    $('._time').change(function(){
        var selectTime = $(this).children('option:selected').val();//这就是selected的值
        placeRank_url = '/detection/detectDistribute?date='+selectTime;
        // console.log(placeRank_url);
        public_ajax.call_request('get',placeRank_url,placeRank);
    })

//====运营模式====
    function pie_1() {
        var myChart = echarts.init(document.getElementById('pie-1'),'chalk');
        var option = {
            backgroundColor:'transparent',
            title : {
                text: '业态类别',
                subtext: '',
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ['互联网金融','传统金融','非金融业务']
            },
            series : [
                {
                    name: '',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:[
                        {value:768, name:'互联网金融'},
                        {value:453, name:'传统金融'},
                        {value:1548, name:'非金融业务'}
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        myChart.setOption(option);
    }
    pie_1();
    function pie_2() {
        var myChart = echarts.init(document.getElementById('pie-2'),'chalk');
        var option = {
            backgroundColor:'transparent',
            title : {
                text: '业务形态',
                subtext: '',
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ['P2P理财','投资项目','游戏','任务奖励','外汇','私募股权基金']
            },
            series : [
                {
                    name: '',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:[
                        {value:335, name:'P2P理财'},
                        {value:310, name:'投资项目'},
                        {value:234, name:'任务奖励'},
                        {value:135, name:'游戏'},
                        {value:456, name:'外汇'},
                        {value:1548, name:'私募股权基金'}
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        myChart.setOption(option);
    }
    pie_2();

//====预警排名====
    // var ranking_url='/detection/detectRank?date=7';
    var ranking_url='/detection/detectRank?date=7&entity_type=0';
    public_ajax.call_request('get',ranking_url,line_2);
    function line_2(data) {
        if(data){
            var entity_nameArr = [], rankingData = [];
            for(var i=0;i<data.length;i++){
                entity_nameArr.push(data[i].entity_name);
                // rankingData.push(data[i].count)
                rankingData.push(data[i]['max(illegal_score)'])
            }
            var myChart = echarts.init(document.getElementById('warningNum'),'chalk');
            var option = {
                backgroundColor:'transparent',
                title: {
                    text: '',
                    subtext: ''
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: ['']
                },
                grid: {
                    left: '3%',
                    right: '8%',
                    bottom: '3%',
                    containLabel: true
                },
                yAxis: {
                    name:'预警强度',
                    type: 'value',
                    // min: 80,
                    // max:2000,
                    boundaryGap: [0, 0.01]
                },
                xAxis: {
                    name:'预警对象',
                    type: 'category',

                    // data : ['优易网','湖北嘟嘟','有糖','品质金融','一元云购','上海中晋公司','风车点赞','玫瑰庄园','青云门','浙江本色控股'],
                    data :entity_nameArr,
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLabel:{
                         interval:0,//横轴信息全部显示
                         rotate:-30,//-30度角倾斜显示

                    }
                },
                grid: { // 控制图的大小，调整下面这些值就可以，
                    x: 40,
                    x2: 100,
                    y2: 100,// y2可以控制 X轴跟Zoom控件之间的间隔，避免以为倾斜后造成 label重叠到zoom上
                },
                series: [
                    {
                        name: '预警强度',
                        type: 'bar',
                        // data:[11, 22, 34, 53, 65, 78, 89, 101, 122, 156],
                        data:rankingData,
                        /*
                            markPoint : {
                                data : [
                                    {
                                        type : 'max',
                                        name: '最大值',
                                        itemStyle:{
                                            normal:{
                                                color:'rgb(175, 215, 237)',
                                            }
                                        },
                                        label:{
                                            normal:{
                                                textStyle:
                                                    {color:'#fff'},
                                            }
                                        }
                                    },
                                    {
                                        type : 'min',
                                        name: '最小值',
                                        itemStyle:{
                                            normal:{
                                                color:'rgb(147, 224, 255)',
                                            }
                                        },
                                        label:{
                                            normal:{
                                                textStyle:
                                                    {color:'#fff'},
                                            }
                                        }
                                    },
                                ]
                            },
                         */
                    },
                ]
            };
            $('#warningNum p.load').hide();
            myChart.setOption(option);
        }

    }
    // line_2();
    // ===实体类型选项===
    $('._time1').change(function(){
        var select_entity_type  = $(this).children('option:selected').val();//这就是selected的值
        var selectTime = $(this).siblings('._time2').val();
        ranking_url = '/detection/detectRank?date='+selectTime+'&entity_type='+select_entity_type;
        // console.log(ranking_url);
        public_ajax.call_request('get',ranking_url,line_2);
    })
    // ===时间选项===
    $('._time2').change(function(){
        var selectTime = $(this).children('option:selected').val();//这就是selected的值
        var select_entity_type = $(this).siblings('._time1').val();
        ranking_url = '/detection/detectRank?date='+selectTime+'&entity_type='+select_entity_type;
        // console.log(ranking_url);
        public_ajax.call_request('get',ranking_url,line_2);
    })
