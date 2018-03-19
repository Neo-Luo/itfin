
// 判断登录状态 =============
    if(role_id != 1 && role_id != 2){//未登录   没有操作列
        // 一屏表格
        // var peoPicture_url='/portraite/portrait/';
        var peoPicture_url='/portraite/portrait/?operation_mode=all&illegal_type=10000&entity_type=0&warn_distribute=all&problem=all';
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
                        // title: "预警类型",//标题
                        title: "预警理由",//标题
                        field: "illegal_type",//键名
                        sortable: true,//是否可排序
                        order: "desc",//默认排序方式
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value, row, index) {
                            // if(row.illegal_type == 1){
                            //     return '模型预警';
                            // }else if(row.illegal_type == 2){
                            //     return '舆情预警';
                            // }else if(row.illegal_type == 3){
                            //     return '指标预警';
                            // }else if (row.illegal_type==''||row.illegal_type=='null'||row.illegal_type=='unknown'||!row.illegal_type){
                            //     return '暂无';
                            // }else {
                            //     return '暂无';
                            // }

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
                        field: "",//键名
                        sortable: true,//是否可排序
                        order: "desc",//默认排序方式
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value, row, index) {
                            return '<span style="cursor:pointer;color:white;" onclick="jumpFrame_2(\''+row.entity_name+'\',\''+row.entity_type+'\',\''+row.id+'\',\''+row.illegal_type+'\')" title="查看详情"><i class="icon icon-file-alt"></i></span>';
                        }
                    },
                    /*
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
                     */
                ],
            });
            $('#contentTable p.load').hide();
            $('.contentTable .fixed-table-toolbar .search input').attr('placeholder','请输入查询内容');
        };

    }else {                         //登录 后   加回操作列
        // 一屏表格
        // var peoPicture_url='/portraite/portrait/';
        var peoPicture_url='/portraite/portrait/?operation_mode=all&illegal_type=10000&entity_type=0&warn_distribute=all&problem=all';
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
                        // title: "预警类型",//标题
                        title: "预警理由",//标题
                        field: "illegal_type",//键名
                        sortable: true,//是否可排序
                        order: "desc",//默认排序方式
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value, row, index) {
                            // if(row.illegal_type == 1){
                            //     return '模型预警';
                            // }else if(row.illegal_type == 2){
                            //     return '舆情预警';
                            // }else if(row.illegal_type == 3){
                            //     return '指标预警';
                            // }else if (row.illegal_type==''||row.illegal_type=='null'||row.illegal_type=='unknown'||!row.illegal_type){
                            //     return '暂无';
                            // }else {
                            //     return '暂无';
                            // }

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
                        field: "",//键名
                        sortable: true,//是否可排序
                        order: "desc",//默认排序方式
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value, row, index) {
                            return '<span style="cursor:pointer;color:white;" onclick="jumpFrame_2(\''+row.entity_name+'\',\''+row.entity_type+'\',\''+row.id+'\',\''+row.illegal_type+'\')" title="查看详情"><i class="icon icon-file-alt"></i></span>';
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
            $('#contentTable p.load').hide();
            $('.contentTable .fixed-table-toolbar .search input').attr('placeholder','请输入查询内容');
        };

    }

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
    var select_url = '/detection/OperationModeBox/';    //业态类型（运营模式）
    public_ajax.call_request('get',select_url,slectUrl);
    function slectUrl(data){
        if(data){
            var str = '';
            for(var i=0;i<data.length;i++){
                str += '<option value="'+data[i].operation+'">'+data[i].operation+'</option>'
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


    // 更新下拉框
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
        // ===业态类型（运营模式）选项===
        $('#select-2').change(function(){
            // var selectTime = $(this).parents('.content').find('#select-1').val();
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

            peoPicture_url = '/portraite/portrait/?operation_mode='+select_operation_mode+'&illegal_type='+select_illegal_type+'&entity_type='+select_entity_type+'&warn_distribute='+select_warn_distribute+'&problem='+select_problem;
            // console.log(peoPicture_url);
            public_ajax.call_request('get',peoPicture_url,peoPicture);
        })
        // ===预警类型选项===
        $('#select-3').change(function(){
            // var selectTime = $(this).parents('.content').find('#select-1').val();
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

            peoPicture_url = '/portraite/portrait/?operation_mode='+select_operation_mode+'&illegal_type='+select_illegal_type+'&entity_type='+select_entity_type+'&warn_distribute='+select_warn_distribute+'&problem='+select_problem;
            // console.log(peoPicture_url);
            public_ajax.call_request('get',peoPicture_url,peoPicture);
        })
        // ===相关问题选项===
        $('#select-5').change(function(){
            // var selectTime = $(this).parents('.content').find('#select-1').val();
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

            peoPicture_url = '/portraite/portrait/?operation_mode='+select_operation_mode+'&illegal_type='+select_illegal_type+'&entity_type='+select_entity_type+'&warn_distribute='+select_warn_distribute+'&problem='+select_problem;
            // console.log(peoPicture_url);
            public_ajax.call_request('get',peoPicture_url,peoPicture);
        })
        // ===实体类型选项===
        $('#select-4').change(function(){
            // var selectTime = $(this).parents('.content').find('#select-1').val();
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

            peoPicture_url = '/portraite/portrait/?operation_mode='+select_operation_mode+'&illegal_type='+select_illegal_type+'&entity_type='+select_entity_type+'&warn_distribute='+select_warn_distribute+'&problem='+select_problem;
            // console.log(peoPicture_url);
            public_ajax.call_request('get',peoPicture_url,peoPicture);
        })
        // ===预警分布选项===
        $('#city34').change(function(){
            // var selectTime = $(this).parents('.content').find('#select-1').val();
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

            peoPicture_url = '/portraite/portrait/?operation_mode='+select_operation_mode+'&illegal_type='+select_illegal_type+'&entity_type='+select_entity_type+'&warn_distribute='+select_warn_distribute+'&problem='+select_problem;
            // console.log(peoPicture_url);
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
            // window.location.href=html;
            window.open(html);
        }

    // 监测详情
        function jumpFrame_2(name,type,id,illegal_type) {
            // window.localStorage.setItem('monitorFlag',monitorFlag);
            // window.location.href='../templates/monitorDetails.html';
            var html = '';
            name=escape(name);
            if(illegal_type == 1 || illegal_type == 2){//模型预警 ----> 进入画像页
                html='/index/company/?name='+name+'&flag='+type+'&pid='+id;
            }
            // else if(illegal_type == 2){//舆情预警 ----> 进入监测详情页
            //     html='/index/monitor/?name='+name+'&flag='+type+'&pid='+id;
            // }
            else {
                html='/index/company/?name='+name+'&flag='+type+'&pid='+id;
            }

            // window.location.href=html;
            window.open(html);
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
            // console.log(portrait_letter_url);
            public_ajax.call_request('get',portrait_letter_url,portrait_letter);
        })
        function portrait_letter (data) {
            if(data){
                $('#contentTable').bootstrapTable('load', data);
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

                    // 重新渲染表格
                    var peoPicture_url='/portraite/portrait/?operation_mode=all&illegal_type=10000&entity_type=0&warn_distribute=all&problem=all';
                    public_ajax.call_request('get',peoPicture_url,peoPicture);

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
                    // console.log(_selectPro_val);
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

                    // 重新渲染表格
                    var peoPicture_url='/portraite/portrait/?operation_mode=all&illegal_type=10000&entity_type=0&warn_distribute=all&problem=all';
                    public_ajax.call_request('get',peoPicture_url,peoPicture);

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
        var len = $('.scroll-2 p').length;
        // console.log(len);
        // p标签不足6个 禁止滚动
        if(len < 6){
            return false;
        }else {
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
        }

    };
    function scrollList_3(obj) {
        var len = $('.scroll-3 p').length;
        // console.log(len);
        // p标签不足6个 禁止滚动
        if(len < 6){
            return false;
        }else {
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
        }

    };

    function show(name,type,id) {
        var html='';
        name=escape(name);
        html='/index/company/?name='+name+'&flag='+type+'&pid='+id;
        // window.location.href=html;
        window.open(html);
    }
    function chgecol(b) {

    }
    function back(c) {

    }
