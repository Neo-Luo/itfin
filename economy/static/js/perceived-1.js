
// 判断登录状态 （未完成）
    if(role_id != 1 && role_id != 2){//未登录  (游客)只显示第二屏
        $('.fullpage .firstScreen').remove();//删除 一 三屏
        $('.fullpage .secondScreen').remove();//删除 一 三屏
        $('#container').height($(window).height());

        // ====一屏表格复制版==== 没有操作列
        var _fellTable_url='/perceived/secondPerceiveData/';
        public_ajax.call_request('get',_fellTable_url,_fellTable);

        function _fellTable(data) {
            if(data){
                $('#_fellTable p.load').hide();
                $('#_fellTable').bootstrapTable('load', data);
                $('#_fellTable').bootstrapTable({
                    data:data,
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
                    columns: [
                        // {
                        //     title: "入库",//标题
                        //     field: "select",
                        //     checkbox: true,
                        //     align: "center",//水平
                        //     valign: "middle"//垂直
                        // },
                        {
                            title: "实体名称",//标题
                            field: "real_name",//键名
                            sortable: true,//是否可排序
                            order: "desc",//默认排序方式
                            align: "center",//水平
                            valign: "middle",//垂直
                            formatter: function (value, row, index) {
                                if (row.real_name==''||row.real_name=='null'||row.real_name=='unknown'||!row.real_name){
                                    return '未知';
                                }else {
                                    return '<span style="cursor:pointer;color:white;" onclick="jumpFrame_1(\''+row.real_name+'\',\''+row.entity_type+'\',\''+row.id+'\')" title="进入画像">'+row.real_name+'</span>';
                                };
                            }
                        },
                        {
                            title: "感知时间",//标题
                            field: "date",//键名
                            sortable: true,//是否可排序
                            order: "desc",//默认排序方式
                            align: "center",//水平
                            valign: "middle",//垂直
                            formatter: function (value, row, index) {
                                if (row.date==''||row.date=='null'||row.date=='unknown'||!row.date){
                                    return '未知';
                                }else {
                                    return '<span style="cursor:pointer;color:white;" title="感知时间">'+row.date+'</span>';
                                };
                            }
                        },
                        {
                            title: "推荐理由",//标题
                            field: "rec_type",//键名
                            sortable: true,//是否可排序
                            order: "desc",//默认排序方式
                            align: "center",//水平
                            valign: "middle",//垂直
                            formatter: function (value, row, index) {
                                if (row.rec_type==''||row.rec_type=='null'||row.rec_type=='unknown'||!row.rec_type){
                                    return '未知';
                                }else {
                                    return '<span style="cursor:pointer;color:white;" title="推荐理由">'+row.rec_type+'</span>';
                                };
                            }
                        },
                        {
                            title: "实体类别",//标题
                            field: "entity_type",//键名
                            sortable: true,//是否可排序
                            order: "desc",//默认排序方式
                            align: "center",//水平
                            valign: "middle",//垂直
                            formatter: function (value, row, index) {
                                var entityType;
                                if(row.entity_type==1){
                                    entityType = '平台'
                                }else if(row.entity_type==2){
                                    entityType = '公司'
                                }else if(row.entity_type==3){
                                    entityType = '项目'
                                }
                                if (row.entity_type==''||row.entity_type=='null'||row.entity_type=='unknown'||!row.entity_type){
                                    return '未知';
                                }else  {
                                    return '<span style="cursor:pointer;color:white;" title="实体类型">'+entityType+'</span>';
                                };
                            }
                        },
                        {
                            title: "注册公司",//标题
                            field: "company",//键名
                            sortable: true,//是否可排序
                            order: "desc",//默认排序方式
                            align: "center",//水平
                            valign: "middle",//垂直
                            formatter: function (value, row, index) {
                                if (row.company==''||row.company=='null'||row.company=='unknown'||!row.company){
                                    return '未知';
                                }else {
                                    return '<span style="cursor:pointer;color:white;" title="注册公司">'+row.company+'</span>';
                                };
                            }
                        },
                        {
                            title: "相关人物",//标题
                            field: "related_person",//键名
                            sortable: true,//是否可排序
                            order: "desc",//默认排序方式
                            align: "center",//水平
                            valign: "middle",//垂直
                            formatter: function (value, row, index) {
                                if (row.related_person==''||row.related_person=='null'||row.related_person=='unknown'||!row.related_person){
                                    return '未知';
                                }else {
                                    return '<span style="cursor:pointer;color:white;" title="相关人物">'+row.related_person+'</span>';
                                };
                            }
                        },
                        {
                            title: "其他关键词",//标题
                            field: "key_words",//键名
                            sortable: true,//是否可排序
                            order: "desc",//默认排序方式
                            align: "center",//水平
                            valign: "middle",//垂直
                            formatter: function (value, row, index) {
                                if (row.key_words==''||row.key_words=='null'||row.key_words=='unknown'||!row.key_words){
                                    return '未知';
                                }else {
                                    return '<span style="cursor:pointer;color:white;" title="其他关键词">'+row.key_words+'</span>';
                                };
                            }
                        },
                        // {
                        //     游客登录没有操作列
                        // },
                    ],
                    onCheck:function (row) {
                        libaryList.push(row.id);
                        testLib()
                    },
                    onUncheck:function (row) {
                        libaryList.removeByValue(row.id);
                        testLib()
                    },
                    onCheckAll:function (row) { //修改版 //☆☆☆☆☆☆☆☆全选 方法 需遍历row取值☆☆☆☆☆☆☆☆
                        // console.log(row);
                        // console.log(row.id);
                        // libaryList.push(row.id);

                        // 先清空再添加
                        libaryList.length = 0;
                        for(var i=0;i<row.length;i++){
                            libaryList.push(row[i].id);
                        }
                        testLib()
                    },
                    onUncheckAll:function (row) {
                        libaryList.length = 0;
                        testLib()
                    },
                    onPageChange:function(){
                        //翻页之后
                        // libaryList.removeByValue(row.id);testLib()
                        // console.log(libaryList);
                        libaryList.length = 0;
                        testLib()
                        // console.log(libaryList);
                    }
                });
            }
        };
    }else {             //登录后
        $('.fullpage').fullpage({
            'verticalCentered': false,
            'css3': true,
            'anchors': ['page1', 'page2','page3'],
            'navigation': 'true',
            'loopBottom':'true',
            'navigationPosition': 'right',
            'navigationTooltips': ['预警记录','预警记录','预警态势'],
            'fixedElements':'#nav,#Sure_2box,#delSuccess,#importf_info,#perceiveContent',// 不跟随滚动的元素
                                            //鼠标在此元素 不滚屏
            'normalScrollElements':'#perceiveContent .modal-dialog'
        });

        // ====一屏表格复制版==== 有操作列
        var _fellTable_url='/perceived/secondPerceiveData/';
        public_ajax.call_request('get',_fellTable_url,_fellTable);

        Array.prototype.removeByValue = function(val) {
            for(var i=0; i<this.length; i++) {
                if(this[i] == val) {
                    this.splice(i, 1);
                    break;
                }
            }
        };

        var _libaryList=[];
        function _fellTable(data) {
            if(data){
                $('#_fellTable p.load').hide();
                $('#_fellTable').bootstrapTable('load', data);
                $('#_fellTable').bootstrapTable({
                    data:data,
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
                    columns: [
                        {
                            title: "入库",//标题
                            field: "select",
                            checkbox: true,
                            align: "center",//水平
                            valign: "middle"//垂直
                        },
                        {
                            title: "实体名称",//标题
                            field: "real_name",//键名
                            sortable: true,//是否可排序
                            order: "desc",//默认排序方式
                            align: "center",//水平
                            valign: "middle",//垂直
                            formatter: function (value, row, index) {
                                if (row.real_name==''||row.real_name=='null'||row.real_name=='unknown'||!row.real_name){
                                    return '未知';
                                }else {
                                    // return '<span style="cursor:pointer;color:white;" onclick="jumpFrame_1(\''+row.real_name+'\',\''+row.entity_type+'\',\''+row.id+'\')" title="进入画像">'+row.real_name+'</span>';
                                    return '<span style="cursor:pointer;color:white;">'+row.real_name+'</span>';
                                };
                            }
                        },
                        {
                            title: "感知时间",//标题
                            field: "date",//键名
                            sortable: true,//是否可排序
                            order: "desc",//默认排序方式
                            align: "center",//水平
                            valign: "middle",//垂直
                            formatter: function (value, row, index) {
                                if (row.date==''||row.date=='null'||row.date=='unknown'||!row.date){
                                    return '未知';
                                }else {
                                    return '<span style="cursor:pointer;color:white;" title="感知时间">'+row.date+'</span>';
                                };
                            }
                        },
                        {
                            title: "推荐理由",//标题
                            field: "rec_type",//键名
                            sortable: true,//是否可排序
                            order: "desc",//默认排序方式
                            align: "center",//水平
                            valign: "middle",//垂直
                            formatter: function (value, row, index) {
                                if (row.rec_type==''||row.rec_type=='null'||row.rec_type=='unknown'||!row.rec_type){
                                    return '未知';
                                }else {
                                    return '<span style="cursor:pointer;color:white;" title="推荐理由">'+row.rec_type+'</span>';
                                };
                            }
                        },
                        {
                            title: "实体类别",//标题
                            field: "entity_type",//键名
                            sortable: true,//是否可排序
                            order: "desc",//默认排序方式
                            align: "center",//水平
                            valign: "middle",//垂直
                            formatter: function (value, row, index) {
                                var entityType;
                                if(row.entity_type==1){
                                    entityType = '平台'
                                }else if(row.entity_type==2){
                                    entityType = '公司'
                                }else if(row.entity_type==3){
                                    entityType = '项目'
                                }
                                if (row.entity_type==''||row.entity_type=='null'||row.entity_type=='unknown'||!row.entity_type){
                                    return '未知';
                                }else  {
                                    return '<span style="cursor:pointer;color:white;" title="实体类型">'+entityType+'</span>';
                                };
                            }
                        },
                        {
                            title: "注册公司",//标题
                            field: "company",//键名
                            sortable: true,//是否可排序
                            order: "desc",//默认排序方式
                            align: "center",//水平
                            valign: "middle",//垂直
                            formatter: function (value, row, index) {
                                if (row.company==''||row.company=='null'||row.company=='unknown'||!row.company){
                                    return '未知';
                                }else {
                                    return '<span style="cursor:pointer;color:white;" title="注册公司">'+row.company+'</span>';
                                };
                            }
                        },
                        {
                            title: "相关人物",//标题
                            field: "related_person",//键名
                            sortable: true,//是否可排序
                            order: "desc",//默认排序方式
                            align: "center",//水平
                            valign: "middle",//垂直
                            formatter: function (value, row, index) {
                                if (row.related_person==''||row.related_person=='null'||row.related_person=='unknown'||!row.related_person){
                                    return '未知';
                                }else {
                                    return '<span style="cursor:pointer;color:white;" title="相关人物">'+row.related_person+'</span>';
                                };
                            }
                        },
                        {
                            title: "其他关键词",//标题
                            field: "key_words",//键名
                            sortable: true,//是否可排序
                            order: "desc",//默认排序方式
                            align: "center",//水平
                            valign: "middle",//垂直
                            formatter: function (value, row, index) {
                                if (row.key_words==''||row.key_words=='null'||row.key_words=='unknown'||!row.key_words){
                                    return '未知';
                                }else {
                                    return '<span style="cursor:pointer;color:white;" title="其他关键词">'+row.key_words+'</span>';
                                };
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
                                var Storage = '';
                                if(row.status == 0){
                                    Storage = '<span style="cursor:pointer;color:white;display: inline-block;" onclick="addThis(\''+row.id+'\')" title="添加入库"><i class="icon icon-star-empty"></i></span>';
                                }else if(row.status == 1){
                                    Storage = '<span style="cursor:pointer;color:white;display: inline-block;" onclick="cancelThis(\''+row.id+'\')" title="取消入库"><i style="color:#ff9645;" class="icon icon-star"></i></span>';
                                }
                                return Storage+'<span style="cursor:pointer;color:white;margin:0 10px;" onclick="editThis(\''+row.id+'\',\''+row.entity_name+'\',\''+row.rec_type+'\',\''+row.entity_type+'\',\''+row.company+'\',\''+row.related_person+'\',\''+row.key_words+'\')" title="编辑"><i class="icon icon-edit"></i></span>'+
                                    // '<span style="cursor:pointer;color:white;display: inline-block;margin: 0 10px;" onclick="addThis(\''+row.id+'\')" title="添加入库"><i class="icon icon-star-empty"></i></span>'+
                                    '<span style="cursor:pointer;color:white;margin-right:10px;" onclick="lookThis(\''+row.entity_name+'\',\''+row.index_name+'\')" title="查看文本"><i class="icon icon-book"></i></span>'+
                                    '<span style="cursor:pointer;color:white;" onclick="delThis(\''+row.id+'\')" title="删除"><i class="icon icon-trash"></i></span>';
                            }
                        },
                    ],
                    onCheck:function (row) {
                        _libaryList.push(row.id);
                        _testLib()
                    },
                    onUncheck:function (row) {
                        _libaryList.removeByValue(row.id);
                        _testLib()
                    },
                    onCheckAll:function (row) { //修改版 //☆☆☆☆☆☆☆☆全选 方法 需遍历row取值☆☆☆☆☆☆☆☆
                        // console.log(row);
                        // console.log(row.id);
                        // libaryList.push(row.id);

                        // 先清空再添加
                        _libaryList.length = 0;
                        for(var i=0;i<row.length;i++){
                            _libaryList.push(row[i].id);
                        }
                        _testLib()
                    },
                    onUncheckAll:function (row) {
                        _libaryList.length = 0;
                        _testLib()
                    },
                    onPageChange:function(){
                        //翻页之后
                        // libaryList.removeByValue(row.id);testLib()
                        // console.log(libaryList);
                        _libaryList.length = 0;
                        _testLib()
                        // console.log(libaryList);
                    }
                });
            }
        };

        //可以入库不！？
            function _testLib() {
                if (_libaryList.length==0){
                    $('#_oneLibrary_1').attr('disabled','disabled');
                }else {
                    $('#_oneLibrary_1').removeAttr('disabled');
                }
            }
            $('#_oneLibrary_1').click(function(){
                if($('#_oneLibrary_1').attr('disabled') == 'disabled'){
                    return false;
                }else {
                    var OnceInStorage_url = '/perceived/OnceInStorage/';
                    // var LL_data = [762,752,751,747,746];//测试
                    $.ajax({
                        url:OnceInStorage_url,
                        type:'POST',
                        contentType:'application/json',
                        // data:JSON.stringify(LL_data),
                        data:JSON.stringify(_libaryList),
                        dataType:'json',
                        success:function(data){
                            // console.log(data);
                            if(data.status == 'ok'){
                                // 重新渲染表格
                                var _fellTable_url='/perceived/secondPerceiveData/';
                                public_ajax.call_request('get',_fellTable_url,_fellTable);
                            }
                        }
                    })
                }
            })

        //*** 操作列 用的 一屏的函数和div***这些暂未用
        // ====编辑
            function _editThis(id,entity_name,rec_type,entity_type,company,related_person,key_words) {
                $('#_editRow').modal('show');
                $('.modal-backdrop').css({position:'static'});

                // 值 渲染到模态框
                if(entity_name == 'null'){
                    entity_name = '未知'
                }
                if(company == 'null'){
                    company = '未知'
                }
                if(related_person == 'null'){
                    related_person = '未知'
                }
                if(key_words == 'null'){
                    key_words = '未知'
                }
                // $('#editRow .user-1 input').attr('placeholder',entity_name);
                $('#_editRow .user-1 input').val(entity_name);

                // $("#editRow .user-3 select option[value='"+entity_type+"']").attr('selected',"selected");
                $("#_editRow .user-3 select ").val(entity_type);
                // $("#select_id option[value='"+msg.data.categoryId+"']").attr("selected","selected");根据值让option选中
                $('#_editRow .user-4 input').val(company);
                $('#_editRow .user-5 input').val(related_person);
                $('#_editRow .user-6 input').val(key_words);

                //点击确定弹出二次确定
                $('#_Sure_1').click(function(){
                    // console.log($('#editRow .user-1 input').val());
                    var new_entity_name = $('#_editRow .user-1 input').val();
                    var new_entity_type = $('#_editRow .user-3 select').val();
                    var new_companye = $('#_editRow .user-4 input').val();
                    var new_related_person = $('#_editRow .user-5 input').val();
                    var new_key_words = $('#_editRow .user-6 input').val();
                    if(new_entity_name == ''){
                        $('#_editRow .user-1 .prompt').text('不得为空')
                        return false;
                    }else {
                        if(new_companye == '未知' || new_companye === ''){
                            new_companye = 'null';
                        }
                        if(new_related_person == '未知' || new_related_person === ''){
                            new_related_person = 'null';
                        }
                        if(new_key_words == '未知' || new_key_words === ''){
                            new_key_words = 'null';
                        }
                        $('#_Sure_2box').modal('show');
                        $('.modal-backdrop').css({position:'static'});
                        $('#_Sure_2').click(function(){
                            // console.log(id);
                            var _Edit_url = '/perceived/Edit/?entity_id='+id+'&entity_name='+new_entity_name+'&entity_type='+new_entity_type+'&company='+new_companye+'&related_person='+new_related_person+'&keyword='+new_key_words;
                            // console.log(Edit_url);
                            public_ajax.call_request('get',_Edit_url,_Edit);
                        })

                    }
                })
            }
            function _Edit(data){
                // console.log(data);
                if(data.status == 'ok'){
                    // console.log('编辑成功');
                    $('#delSuccess .modal-body').empty().append('<center>保存成功</center>');
                    $('#delSuccess').modal('show');
                    $('.modal-backdrop').css({position:'static'});
                    // 重新渲染表格
                    var _fellTable_url='/perceived/perceiveData/';
                    public_ajax.call_request('get',_fellTable_url,_fellTable);
                }
            }

        // ====添加入库
            function _addThis(id) {
                var _add_url = '/perceived/Add/?entity_id='+id;
                public_ajax.call_request('get',_add_url,_AddSuccess);
            }
            function _AddSuccess(data){
                if(data.status == 'ok'){
                    // alert('添加入库成功')
                    // 重新渲染表格
                    var _fellTable_url='/perceived/perceiveData/';
                    public_ajax.call_request('get',_fellTable_url,_fellTable);
                }
            }

        // ====取消入库
            function _cancelThis(id) {
                var _cancel_url = '/perceived/Cancel/?entity_id='+id;
                public_ajax.call_request('get',_cancel_url,_CancelSuccess);
            }
            function _CancelSuccess(data){
                if(data.status == 'ok'){
                    // alert('添加入库成功')
                    // 重新渲染表格
                    var _fellTable_url='/perceived/perceiveData/';
                    public_ajax.call_request('get',_fellTable_url,_fellTable);
                }
            }

        // ====删除
            function _delThis(id){
                // 弹出确认框
                // $('#Sure_2box .modal-header h4').text('确认删除吗？');
                // $('#Sure_2box #Sure_2box_body').css('display','none');
                // $('#Sure_2box .modal-footer #cancle').css('display','inline-block');
                // $('#Sure_2box .modal-footer #Sure_2').css('display','inline-block');
                $('#_Sure_3box').modal('show');
                $('.modal-backdrop').css({position:'static'});
                $('#_Sure_3').one('click',function(){
                    var _del_url = '/perceived/OutStorage/?entity_id='+id;
                    public_ajax.call_request('get',_del_url,_DelSuccess);
                })
            }
            function _DelSuccess(data){
                if(data.status == 'ok'){
                    $('#delSuccess .modal-body').empty().append('<center>删除成功</center>');
                    $('#delSuccess').modal('show');
                    $('.modal-backdrop').css({position:'static'});
                    // 重新渲染表格
                    var _fellTable_url='/perceived/perceiveData/';
                    public_ajax.call_request('get',_fellTable_url,fellTable);
                }
            }

        //====查看文本====
            // 保存实体名称 备高亮显示用
            var name;
            function _lookThis(entity_name,index_name) {
                if(entity_name != '' && index_name != ''){
                    name = entity_name;
                    var _perceiveContent_url = '/perceived/perceiveContent/?entity_name='+entity_name+'&index_name='+index_name;
                    public_ajax.call_request('get',_perceiveContent_url,_perceiveContent);
                }else{
                    console.log('====暂无更多内容====')
                }
            }
            // 所有的数据
            var _articalList={};
            // 部分数据
            var _articalList_part={};
            function _perceiveContent(data){
                if(data){
                    var tag='#perceiveContent_in'.toString().substring(1)
                    $('#_perceiveContent_in').empty();
                    $('#_perceiveContent_in').bootstrapTable('load', data);
                    $('#_perceiveContent_in').bootstrapTable({
                        data:data,
                        search: false,//是否搜索
                        pagination: false,//是否分页
                        pageSize: 5,//单页记录数
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
                                title: "",//标题
                                field: "",//键名
                                sortable: true,//是否可排序
                                order: "desc",//默认排序方式
                                align: "center",//水平
                                valign: "middle",//垂直
                                formatter: function (value, row, index) {
                                    var publisTime = getLocalTime_2(row.publish_time);
                                    var contentClip, title, author, usn;
                                    if(row.content.length >= 100){
                                        contentClip = row.content.slice(0,100)+'  ...';
                                        articalList_part[tag+'_'+index] = contentClip;
                                    }else{
                                        contentClip = row.content;
                                        articalList_part[tag+'_'+index] = contentClip;
                                    }
                                    // 所有的数据
                                    articalList[tag+'_'+index] = row.content;

                                    if(row.title){//标题
                                        title = row.title;
                                    }else{
                                        title = '未知';
                                    }

                                    if(row.author){//作者
                                        author = row.author;
                                    }else{
                                        author = '未知';
                                    }

                                    if(row.usn){//用户
                                        usn = row.usn;
                                    }else{
                                        usn = '未知';
                                    }

                                    var url;//原文链接
                                    if(row.u){
                                        url = row.u;
                                    }else if(row.url){
                                        url = row.url;
                                    }

                                    // 高亮显示实体名称
                                    // console.log(name);
                                    var s = name;
                                    var reg = new RegExp("(" + s + ")", "g");
                                    contentClip = contentClip.replace(reg, "<strong style='color:#ff6633;'>$1</strong>");

                                    return '<div class="inforContent">'+
                                        '            <div class="main">'+
                                        '                <img src="/static/images/textIcon.png" class="textFlag" style="top: 8px;">'+
                                        '                <p class="option clearfix">'+
                                        '                    <span style="display:inline-block;width:100%;">标题：<b style="vertical-align:middle;color: #ff6d70;display:inline-block;width:50%;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;" title="\''+title+'\'">'+title+'</b><button onclick="getAllArtical(\''+tag+'_'+index+'\')" artical=\"'+tag+'_'+index+'\" class="original btn-primary btn-xs" style="margin-left:10px;">查看全文</button>'+'</span>'+
                                        '                    <span>发布时间：<b style="color: #ff6d70;">'+publisTime+'</b></span><br />'+
                                        // '                    <span style="display:inline-block;width:49%;">作者：<b style="color: #ff6d70;">'+author+'</b></span>'+

                                        // '   <button onclick="getAllArtical(\''+tag+'_'+index+'\')" artical=\"'+tag+'_'+index+'\" class="original btn-primary btn-xs" style="float:right;">查看全文</button>'+
                                        '                    <span>用户：<b style="color: #ff6d70;">'+usn+'</b></span>'+
                                        '                </p>'+
                                        '                <p class="context" style="overflow:auto;max-height:200px;text-indent:2em;">'+contentClip+'</p>'+
                                        '                <a href="'+url+'" title="原网页链接" target="_blank">原网页链接</a>            '+
                                        '            </div>'+
                                        '        </div>';
                                }
                            },
                        ],
                    });

                    $('#_perceiveContent').modal('show');
                    $('.modal-backdrop').css({position:'static'});

                    for(var i in _articalList){
                        // 高亮显示实体名称
                        var s = name;
                        var reg = new RegExp("(" + s + ")", "g");
                        _articalList[i] = _articalList[i].replace(reg, "<strong style='color:#ff6633;'>$1</strong>");
                        _articalList_part[i] = _articalList_part[i].replace(reg, "<strong style='color:#ff6633;'>$1</strong>");
                    }
                }
            }
            // 切换全文和部分数据
            function getAllArtical (_id) {
                var nowText = $("button[artical = "+ _id +"]").text();
                // console.log(articalList[_id]);
                $("button[artical = "+ _id +"]").parents('.main').find('.context').html(articalList[_id]);
                $("button[artical = "+ _id +"]").text('收起');
                if(nowText == '收起'){
                    $("button[artical = "+ _id +"]").parents('.main').find('.context').html(articalList_part[_id]);
                    $("button[artical = "+ _id +"]").text('查看全文');
                }
            }


        //*** 操作列 用的 一屏的函数和div*** 这些暂未用
    }

// 判断登录状态 （未完成）

// ====当天感知数====
    var warnCount_url='/perceived/warnCount/';
    public_ajax.call_request('get',warnCount_url,warnCount);
    function warnCount (data){
        if(data.length == 0){
            $('#container .topTitle .com-1').text(0);
            $('#container .topTitle .com-2').text(0);
            $('#container .topTitle .com-3').text(0);
        }else {
            $('#container .topTitle .com-1').text(0);
            $('#container .topTitle .com-2').text(0);
            // $('#container .topTitle .com-3').text(data[0].count);
            $('#container .topTitle .com-3').text(data[0]['count(*)']);
        }
    }

// ====适配分辨率====
    var pageData=5;
    if (screen.width <= 1440){
        $('#container .secondScreen .box').css({'max-height':'308px','min-height':'308px'})
        pageData=5;
    }else {
        $('#container .secondScreen .box').css({'max-height':'510px','min-height':'510px'})
        pageData=8;
    }

// ====一屏表格====
    var fellTable_url='/perceived/perceiveData/';
    public_ajax.call_request('get',fellTable_url,fellTable);

    Array.prototype.removeByValue = function(val) {
        for(var i=0; i<this.length; i++) {
            if(this[i] == val) {
                this.splice(i, 1);
                break;
            }
        }
    };

    var libaryList=[];
    function fellTable(data) {
        if(data){
            $('#fellTable p.load').hide();
            $('#fellTable').bootstrapTable('load', data);
            $('#fellTable').bootstrapTable({
                data:data,
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
                columns: [
                    {
                        title: "入库",//标题
                        field: "select",
                        checkbox: true,
                        align: "center",//水平
                        valign: "middle"//垂直
                    },
                    {
                        title: "实体名称",//标题
                        field: "real_name",//键名
                        sortable: true,//是否可排序
                        order: "desc",//默认排序方式
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value, row, index) {
                            if (row.real_name==''||row.real_name=='null'||row.real_name=='unknown'||!row.real_name){
                                return '未知';
                            }else {
                                // return '<span style="cursor:pointer;color:white;" onclick="jumpFrame_1(\''+row.real_name+'\',\''+row.entity_type+'\',\''+row.id+'\')" title="进入画像">'+row.real_name+'</span>';
                                return '<span style="cursor:pointer;color:white;">'+row.real_name+'</span>';
                            };
                        }
                    },
                    {
                        title: "感知时间",//标题
                        field: "date",//键名
                        sortable: true,//是否可排序
                        order: "desc",//默认排序方式
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value, row, index) {
                            if (row.date==''||row.date=='null'||row.date=='unknown'||!row.date){
                                return '未知';
                            }else {
                                return '<span style="cursor:pointer;color:white;" title="感知时间">'+row.date+'</span>';
                            };
                        }
                    },
                    {
                        title: "推荐理由",//标题
                        field: "rec_type",//键名
                        sortable: true,//是否可排序
                        order: "desc",//默认排序方式
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value, row, index) {
                            if (row.rec_type==''||row.rec_type=='null'||row.rec_type=='unknown'||!row.rec_type){
                                return '未知';
                            }else {
                                return '<span style="cursor:pointer;color:white;" title="推荐理由">'+row.rec_type+'</span>';
                            };
                        }
                    },
                    {
                        title: "实体类别",//标题
                        field: "entity_type",//键名
                        sortable: true,//是否可排序
                        order: "desc",//默认排序方式
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value, row, index) {
                            var entityType;
                            if(row.entity_type==1){
                                entityType = '平台'
                            }else if(row.entity_type==2){
                                entityType = '公司'
                            }else if(row.entity_type==3){
                                entityType = '项目'
                            }
                            if (row.entity_type==''||row.entity_type=='null'||row.entity_type=='unknown'||!row.entity_type){
                                return '未知';
                            }else  {
                                return '<span style="cursor:pointer;color:white;" title="实体类型">'+entityType+'</span>';
                            };
                        }
                    },
                    {
                        title: "注册公司",//标题
                        field: "company",//键名
                        sortable: true,//是否可排序
                        order: "desc",//默认排序方式
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value, row, index) {
                            if (row.company==''||row.company=='null'||row.company=='unknown'||!row.company){
                                return '未知';
                            }else {
                                return '<span style="cursor:pointer;color:white;" title="注册公司">'+row.company+'</span>';
                            };
                        }
                    },
                    {
                        title: "相关人物",//标题
                        field: "related_person",//键名
                        sortable: true,//是否可排序
                        order: "desc",//默认排序方式
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value, row, index) {
                            if (row.related_person==''||row.related_person=='null'||row.related_person=='unknown'||!row.related_person){
                                return '未知';
                            }else {
                                return '<span style="cursor:pointer;color:white;" title="相关人物">'+row.related_person+'</span>';
                            };
                        }
                    },
                    {
                        title: "其他关键词",//标题
                        field: "key_words",//键名
                        sortable: true,//是否可排序
                        order: "desc",//默认排序方式
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value, row, index) {
                            if (row.key_words==''||row.key_words=='null'||row.key_words=='unknown'||!row.key_words){
                                return '未知';
                            }else {
                                return '<span style="cursor:pointer;color:white;" title="其他关键词">'+row.key_words+'</span>';
                            };
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
                            var Storage = '';
                            if(row.status == 0){
                                Storage = '<span style="cursor:pointer;color:white;display: inline-block;" onclick="addThis(\''+row.id+'\')" title="添加入库"><i class="icon icon-star-empty"></i></span>';
                            }else if(row.status == 1){
                                Storage = '<span style="cursor:pointer;color:white;display: inline-block;" onclick="cancelThis(\''+row.id+'\')" title="取消入库"><i style="color:#ff9645;" class="icon icon-star"></i></span>';
                            }
                            return Storage+'<span style="cursor:pointer;color:white;margin:0 10px;" onclick="editThis(\''+row.id+'\',\''+row.entity_name+'\',\''+row.rec_type+'\',\''+row.entity_type+'\',\''+row.company+'\',\''+row.related_person+'\',\''+row.key_words+'\')" title="编辑"><i class="icon icon-edit"></i></span>'+
                                // '<span style="cursor:pointer;color:white;display: inline-block;margin: 0 10px;" onclick="addThis(\''+row.id+'\')" title="添加入库"><i class="icon icon-star-empty"></i></span>'+
                                '<span style="cursor:pointer;color:white;margin-right:10px;" onclick="lookThis(\''+row.entity_name+'\',\''+row.index_name+'\')" title="查看文本"><i class="icon icon-book"></i></span>'+
                                '<span style="cursor:pointer;color:white;" onclick="delThis(\''+row.id+'\')" title="删除"><i class="icon icon-trash"></i></span>';
                        }
                    },
                ],
                onCheck:function (row) {
                    libaryList.push(row.id);
                    testLib()
                },
                onUncheck:function (row) {
                    libaryList.removeByValue(row.id);
                    testLib()
                },
                onCheckAll:function (row) { //修改版 //☆☆☆☆☆☆☆☆全选 方法 需遍历row取值☆☆☆☆☆☆☆☆
                    // console.log(row);
                    // console.log(row.id);
                    // libaryList.push(row.id);

                    // 先清空再添加
                    libaryList.length = 0;
                    for(var i=0;i<row.length;i++){
                        libaryList.push(row[i].id);
                    }
                    testLib()
                },
                onUncheckAll:function (row) {
                    libaryList.length = 0;
                    testLib()
                },
                onPageChange:function(){
                    //翻页之后
                    // libaryList.removeByValue(row.id);testLib()
                    // console.log(libaryList);
                    libaryList.length = 0;
                    testLib()
                    // console.log(libaryList);
                }
            });
        }
    };

//进入画像
    function jumpFrame_1(name,type,id) {
        // var html='';
        // name=escape(name);
        // if (type=='1'||type=='2'){
        //     html='/index/company/?name='+name+'&flag='+type+'&pid='+id;
        // }else {
        //     html='/index/project/?name='+name+'&flag='+type+'&pid='+id;
        // }
        // window.location.href=html;
    }

//可以入库不！？
    function testLib() {
        if (libaryList.length==0){
            $('#oneLibrary_1').attr('disabled','disabled');
        }else {
            $('#oneLibrary_1').removeAttr('disabled');
        }
    }
    $('#oneLibrary_1').click(function(){
        if($('#oneLibrary_1').attr('disabled') == 'disabled'){
            return false;
        }else {
            var OnceInStorage_url = '/perceived/OnceInStorage/';
            // var LL_data = [762,752,751,747,746];//测试
            $.ajax({
                url:OnceInStorage_url,
                type:'POST',
                contentType:'application/json',
                // data:JSON.stringify(LL_data),
                data:JSON.stringify(libaryList),
                dataType:'json',
                success:function(data){
                    // console.log(data);
                    if(data.status == 'ok'){
                        // 重新渲染表格
                        var fellTable_url='/perceived/perceiveData/';
                        public_ajax.call_request('get',fellTable_url,fellTable);
                        // 一屏复制版表格
                        var _fellTable_url='/perceived/secondPerceiveData/';
                        public_ajax.call_request('get',_fellTable_url,_fellTable);
                    }
                }
            })
        }
    })

// ====编辑
    function editThis(id,entity_name,rec_type,entity_type,company,related_person,key_words) {
        $('#editRow').modal('show');
        $('.modal-backdrop').css({position:'static'});

        // 值 渲染到模态框
        if(entity_name == 'null'){
            entity_name = '未知'
        }
        if(company == 'null'){
            company = '未知'
        }
        if(related_person == 'null'){
            related_person = '未知'
        }
        if(key_words == 'null'){
            key_words = '未知'
        }
        // $('#editRow .user-1 input').attr('placeholder',entity_name);
        $('#editRow .user-1 input').val(entity_name);

        // $("#editRow .user-3 select option[value='"+entity_type+"']").attr('selected',"selected");
        $("#editRow .user-3 select ").val(entity_type);
        // $("#select_id option[value='"+msg.data.categoryId+"']").attr("selected","selected");根据值让option选中
        $('#editRow .user-4 input').val(company);
        $('#editRow .user-5 input').val(related_person);
        $('#editRow .user-6 input').val(key_words);

        //点击确定弹出二次确定
        $('#Sure_1').click(function(){
            // console.log($('#editRow .user-1 input').val());
            var new_entity_name = $('#editRow .user-1 input').val();
            var new_entity_type = $('#editRow .user-3 select').val();
            var new_companye = $('#editRow .user-4 input').val();
            var new_related_person = $('#editRow .user-5 input').val();
            var new_key_words = $('#editRow .user-6 input').val();
            if(new_entity_name == ''){
                $('#editRow .user-1 .prompt').text('不得为空')
                return false;
            }else {
                if(new_companye == '未知' || new_companye === ''){
                    new_companye = 'null';
                }
                if(new_related_person == '未知' || new_related_person === ''){
                    new_related_person = 'null';
                }
                if(new_key_words == '未知' || new_key_words === ''){
                    new_key_words = 'null';
                }
                $('#Sure_2box').modal('show');
                $('.modal-backdrop').css({position:'static'});
                $('#Sure_2').click(function(){
                    // console.log(id);
                    var Edit_url = '/perceived/Edit/?entity_id='+id+'&entity_name='+new_entity_name+'&entity_type='+new_entity_type+'&company='+new_companye+'&related_person='+new_related_person+'&keyword='+new_key_words;
                    // console.log(Edit_url);
                    public_ajax.call_request('get',Edit_url,Edit);
                })

            }
        })
    }
    function Edit(data){
        // console.log(data);
        if(data.status == 'ok'){
            // console.log('编辑成功');
            $('#delSuccess .modal-body').empty().append('<center>保存成功</center>');
            $('#delSuccess').modal('show');
            $('.modal-backdrop').css({position:'static'});
            // 重新渲染表格
            var fellTable_url='/perceived/perceiveData/';
            public_ajax.call_request('get',fellTable_url,fellTable);
            // 一屏复制版表格
            var _fellTable_url='/perceived/secondPerceiveData/';
            public_ajax.call_request('get',_fellTable_url,_fellTable);
        }
    }

// ====添加入库
    function addThis(id) {
        var add_url = '/perceived/Add/?entity_id='+id;
        public_ajax.call_request('get',add_url,AddSuccess);
    }
    function AddSuccess(data){
        if(data.status == 'ok'){
            // alert('添加入库成功')
            // 重新渲染表格
            var fellTable_url='/perceived/perceiveData/';
            public_ajax.call_request('get',fellTable_url,fellTable);

            // 一屏复制版表格
            var _fellTable_url='/perceived/secondPerceiveData/';
            public_ajax.call_request('get',_fellTable_url,_fellTable);
        }
    }

// ====取消入库
    function cancelThis(id) {
        var cancel_url = '/perceived/Cancel/?entity_id='+id;
        public_ajax.call_request('get',cancel_url,CancelSuccess);
    }
    function CancelSuccess(data){
        if(data.status == 'ok'){
            // alert('添加入库成功')
            // 重新渲染表格
            var fellTable_url='/perceived/perceiveData/';
            public_ajax.call_request('get',fellTable_url,fellTable);

            // 一屏复制版表格
            var _fellTable_url='/perceived/secondPerceiveData/';
            public_ajax.call_request('get',_fellTable_url,_fellTable);
        }
    }

// ====删除
    function delThis(id){
        // 弹出确认框
        // $('#Sure_2box .modal-header h4').text('确认删除吗？');
        // $('#Sure_2box #Sure_2box_body').css('display','none');
        // $('#Sure_2box .modal-footer #cancle').css('display','inline-block');
        // $('#Sure_2box .modal-footer #Sure_2').css('display','inline-block');
        $('#Sure_3box').modal('show');
        $('.modal-backdrop').css({position:'static'});
        $('#Sure_3').one('click',function(){
            var del_url = '/perceived/OutStorage/?entity_id='+id;
            public_ajax.call_request('get',del_url,DelSuccess);
        })
    }
    function DelSuccess(data){
        if(data.status == 'ok'){
            // alert('删除成功')
            // $('#Sure_2box .modal-header h4').text('提示信息:');
            // $('#Sure_2box #Sure_2box_body').css('display','block');
            $('#delSuccess .modal-body').empty().append('<center>删除成功</center>');
            // $('#Sure_2box .modal-footer #cancle').css('display','none');
            // $('#Sure_2box .modal-footer #Sure_2').css('display','inline-block');
            $('#delSuccess').modal('show');
            $('.modal-backdrop').css({position:'static'});
            // 重新渲染表格
            var fellTable_url='/perceived/perceiveData/';
            public_ajax.call_request('get',fellTable_url,fellTable);
            // 一屏复制版表格
            var _fellTable_url='/perceived/secondPerceiveData/';
            public_ajax.call_request('get',_fellTable_url,_fellTable);
        }
    }

//====查看文本====
    // 保存实体名称 备高亮显示用
    var name;
    function lookThis(entity_name,index_name) {
        if(entity_name != '' && index_name != ''){
            name = entity_name;
            var perceiveContent_url = '/perceived/perceiveContent/?entity_name='+entity_name+'&index_name='+index_name;
            public_ajax.call_request('get',perceiveContent_url,perceiveContent);
        }else{
            console.log('====暂无更多内容====')
        }
    }
    // 所有的数据
    var articalList={};
    // 部分数据
    var articalList_part={};
    function perceiveContent(data){
        if(data){
            var tag='#perceiveContent_in'.toString().substring(1)
            $('#perceiveContent_in').empty();
            $('#perceiveContent_in').bootstrapTable('load', data);
            $('#perceiveContent_in').bootstrapTable({
                data:data,
                search: false,//是否搜索
                pagination: false,//是否分页
                pageSize: 5,//单页记录数
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
                        title: "",//标题
                        field: "",//键名
                        sortable: true,//是否可排序
                        order: "desc",//默认排序方式
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value, row, index) {
                            var publisTime = getLocalTime_2(row.publish_time);
                            var contentClip, title, author, usn;
                            if(row.content.length >= 100){
                                contentClip = row.content.slice(0,100)+'  ...';
                                articalList_part[tag+'_'+index] = contentClip;
                            }else{
                                contentClip = row.content;
                                articalList_part[tag+'_'+index] = contentClip;
                            }
                            // 所有的数据
                            articalList[tag+'_'+index] = row.content;

                            if(row.title){//标题
                                title = row.title;
                            }else{
                                title = '未知';
                            }

                            if(row.author){//作者
                                author = row.author;
                            }else{
                                author = '未知';
                            }

                            if(row.usn){//用户
                                usn = row.usn;
                            }else{
                                usn = '未知';
                            }

                            var url;//原文链接
                            if(row.u){
                                url = row.u;
                            }else if(row.url){
                                url = row.url;
                            }

                            // 高亮显示实体名称
                            // console.log(name);
                            var s = name;
                            var reg = new RegExp("(" + s + ")", "g");
                            contentClip = contentClip.replace(reg, "<strong style='color:#ff6633;'>$1</strong>");

                            return '<div class="inforContent">'+
                                '            <div class="main">'+
                                '                <img src="/static/images/textIcon.png" class="textFlag" style="top: 8px;">'+
                                '                <p class="option clearfix">'+
                                '                    <span style="display:inline-block;width:100%;">标题：<b style="vertical-align:middle;color: #ff6d70;display:inline-block;width:50%;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;" title="\''+title+'\'">'+title+'</b><button onclick="getAllArtical(\''+tag+'_'+index+'\')" artical=\"'+tag+'_'+index+'\" class="original btn-primary btn-xs" style="margin-left:10px;">查看全文</button>'+'</span>'+
                                '                    <span>发布时间：<b style="color: #ff6d70;">'+publisTime+'</b></span><br />'+
                                // '                    <span style="display:inline-block;width:49%;">作者：<b style="color: #ff6d70;">'+author+'</b></span>'+

                                // '   <button onclick="getAllArtical(\''+tag+'_'+index+'\')" artical=\"'+tag+'_'+index+'\" class="original btn-primary btn-xs" style="float:right;">查看全文</button>'+
                                '                    <span>用户：<b style="color: #ff6d70;">'+usn+'</b></span>'+
                                '                </p>'+
                                '                <p class="context" style="overflow:auto;max-height:200px;text-indent:2em;">'+contentClip+'</p>'+
                                '                <a href="'+url+'" title="原网页链接" target="_blank">原网页链接</a>            '+
                                '            </div>'+
                                '        </div>';
                        }
                    },
                ],
            });

            $('#perceiveContent').modal('show');
            $('.modal-backdrop').css({position:'static'});

            for(var i in articalList){
                // 高亮显示实体名称
                var s = name;
                var reg = new RegExp("(" + s + ")", "g");
                articalList[i] = articalList[i].replace(reg, "<strong style='color:#ff6633;'>$1</strong>");
                articalList_part[i] = articalList_part[i].replace(reg, "<strong style='color:#ff6633;'>$1</strong>");
            }
        }
    }
    // 切换全文和部分数据
    function getAllArtical (_id) {
        var nowText = $("button[artical = "+ _id +"]").text();
        // console.log(articalList[_id]);
        $("button[artical = "+ _id +"]").parents('.main').find('.context').html(articalList[_id]);
        $("button[artical = "+ _id +"]").text('收起');
        if(nowText == '收起'){
            $("button[artical = "+ _id +"]").parents('.main').find('.context').html(articalList_part[_id]);
            $("button[artical = "+ _id +"]").text('查看全文');
        }
    }

// ===========一屏表格复制版，游客仅显示这一屏========
// ====当天感知数复制版====
    // var _warnCount_url='/perceived/warnCount/';
    var _warnCount_url='/perceived/secondWarnCount/';
    public_ajax.call_request('get',_warnCount_url,_warnCount);
    function _warnCount (data){
        if(data.length == 0){
            $('#container ._topTitle ._com-1').text(0);
            $('#container ._topTitle ._com-2').text(0);
            $('#container ._topTitle ._com-3').text(0);
        }else {
            $('#container ._topTitle ._com-1').text(0);
            $('#container ._topTitle ._com-2').text(0);
            // $('#container ._topTitle ._com-3').text(data[0].count);
            $('#container ._topTitle ._com-3').text(data[0]['count(*)']);
        }
    }



// ------二屏---------

//添加入库
//文档准备就绪
// $(function () {
    // 删除json数组元素的方法
        Array.prototype.removeByValue_2 = function(val) {
            for(var i=0; i<this.length; i++) {
                if(this[i].entity_name == val) {
                    this.splice(i, 1);
                    break;
                }
            }
        };

    // 展示空表格的数据
        var L_data = [
                {'entity_name':'','entity_type':'','company':'','related_person':'','key_words':''},
                {'entity_name':'','entity_type':'','company':'','related_person':'','key_words':''},
                {'entity_name':'','entity_type':'','company':'','related_person':'','key_words':''},
                {'entity_name':'','entity_type':'','company':'','related_person':'','key_words':''},
                {'entity_name':'','entity_type':'','company':'','related_person':'','key_words':''},
                {'entity_name':'','entity_type':'','company':'','related_person':'','key_words':''},
            ];

        var libaryList_2=[]; //用于传给后台的数据

        $('#addClub').bootstrapTable({
            data:L_data,
            uniqueId:'entity_name', //☆☆☆☆☆☆☆☆根据 removeByuniqueId 方法删除行 需设置uniqueId☆☆☆☆☆☆☆☆
            // search: true,//是否搜索
            pagination: true,//是否分页
            pageSize: 6,//单页记录数
            pageList: [15,20,25],//分页步进值
            sidePagination: "client",//服务端分页
            searchAlign: "left",
            // searchOnEnterKey: false,//回车搜索
            // showRefresh: false,//刷新按钮
            // showColumns: false,//列选择按钮
            buttonsAlign: "right",//按钮对齐方式
            locale: "zh-CN",//中文支持
            detailView: false,
            showToggle:false,
            sortable:false,
            sortStable:false,
            // sortName:'bci',
            // sortOrder:"desc",
            // uniqueid:'a',
            columns: [
                {
                    title: "入库",//标题
                    field: "select",
                    checkbox: true,
                    align: "center",//水平
                    valign: "middle",//垂直
                },
                {
                    title: "实体名称",//标题
                    field: "entity_name",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                    formatter: function (value, row, index) {
                        if (row.entity_name==''||row.entity_name=='null'||row.entity_name=='unknown'||!row.entity_name){
                            return '';
                        }else {
                            return row.entity_name;
                        };
                    }
                },

                {
                    title: "实体类别",//标题
                    field: "entity_type",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                    formatter: function (value, row, index) {
                        if (row.entity_type==''||row.entity_type=='null'||row.entity_type=='unknown'||!row.entity_type){
                            return '';
                        }else {
                            return row.entity_type;
                        };
                    }
                },
                {
                    title: "注册公司",//标题
                    field: "company",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                    formatter: function (value, row, index) {
                        if (row.company==''||row.company=='null'||row.company=='unknown'||!row.company){
                            return '';
                        }else {
                            return row.company;
                        };
                    }
                },
                {
                    title: "相关人物",//标题
                    field: "related_person",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                    formatter: function (value, row, index) {
                        if (row.related_person==''||row.related_person=='null'||row.related_person=='unknown'||!row.related_person){
                            return '';
                        }else {
                            return row.related_person;
                        };
                    }
                },
                {
                    title: "其他关键词",//标题
                    field: "key_words",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                    formatter: function (value, row, index) {
                        if (row.key_words==''||row.key_words=='null'||row.key_words=='unknown'||!row.key_words){
                            return '';
                        }else {
                            return row.key_words;
                        };
                    }
                },
                // {
                //     title: "推荐理由",//标题
                //     field: "rec_type",//键名
                //     sortable: true,//是否可排序
                //     order: "desc",//默认排序方式
                //     align: "center",//水平
                //     valign: "middle",//垂直
                //     formatter: function (value, row, index) {
                //         if (row.rec_type==''||row.rec_type=='null'||row.rec_type=='unknown'||!row.rec_type){
                //             return '';
                //         }else {
                //             return row.rec_type;
                //         };
                //     }
                // },
                {
                    title: "操作",//标题
                    field: "g",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                    formatter: function (value, row, index) {
                        if (row.g==''||row.g=='null'||row.g=='unknown'||!row.g){
                            return '';
                        }else {
                            return row.g;
                        };
                    }
                },
            ],
            onCheck:function (row) {
                if(row.entity_type == ''){
                    row.entity_type = 'null';
                }else if(row.entity_type == '平台'){
                    row.entity_type = 1;
                }else if(row.entity_type == '公司'){
                    row.entity_type = 2;
                }else if(row.entity_type == '项目'){
                    row.entity_type = 3;
                }
                // libaryList_2.push({entity_name:row.entity_name,rec_type:row.rec_type,entity_type:row.entity_type,company:row.company,related_person:row.related_person,key_words:row.key_words});
                libaryList_2.push({entity_name:row.entity_name,entity_type:row.entity_type,company:row.company,related_person:row.related_person,key_words:row.key_words});
                // console.log(libaryList_2);
                testLib_2()
            },
            onUncheck:function (row) {
                // libaryList_2.removeByValue_2({entity_name:row.entity_name,rec_type:row.rec_type,entity_type:row.entity_type,company:row.company,related_person:row.related_person,key_words:row.key_words});
                libaryList_2.removeByValue_2(row.entity_name);
                testLib_2()
            },
            onCheckAll:function (row) {//有问题  //修改版//☆☆☆☆☆☆☆☆全选 方法 需遍历row取值☆☆☆☆☆☆☆☆
                // libaryList_2.push({entity_name:row.entity_name,rec_type:row.rec_type,entity_type:row.entity_type,company:row.company,related_person:row.related_person,key_words:row.key_words});
                // libaryList_2.push(row.entity_name);

                if(row.entity_type == ''){
                    row.entity_type = 'null';
                }else if(row.entity_type == '平台'){
                    row.entity_type = 1;
                }else if(row.entity_type == '公司'){
                    row.entity_type = 2;
                }else if(row.entity_type == '项目'){
                    row.entity_type = 3;
                }
                // 先清空 再添加
                libaryList_2.length = 0;
                for(var i=0;i<row.length;i++){
                    // libaryList_2.push({entity_name:row[i].entity_name,rec_type:row[i].rec_type,entity_type:row[i].entity_type,company:row[i].company,related_person:row[i].related_person,key_words:row[i].key_words});
                    libaryList_2.push({entity_name:row[i].entity_name,entity_type:row[i].entity_type,company:row[i].company,related_person:row[i].related_person,key_words:row[i].key_words});
                }
                // console.log(libaryList_2);
                testLib_2()
            },
            onUncheckAll:function (row) {
                // libaryList_2.removeByValue({entity_name:row.entity_name},{rec_type:row.rec_type},{entity_type:row.entity_type},{company:row.company},{related_person:row.related_person},{key_words:row.key_words});
                libaryList_2.length = 0;
                // console.log(libaryList_2);
                testLib_2()
            },
        });

    //增加一行
        $('#add').click(function () {
            var one=$('.add-1').val();
            // var two=parseInt($('.add-2').val());//推荐理由 暂为数字类型
            // if(one == '' || two == ''){
            if(one == ''){
                // alert('不能为空')
                $('#delSuccess .modal-body').empty().append('<center>实体名称不能为空！</center>');
                $('#delSuccess').modal('show');
                $('.modal-backdrop').css({position:'static'});
                return false;
            }else{

                var three=parseInt($('.add-3').val());
                var four=$('.add-4').val();
                var five=$('.add-5').val();
                var six=$('.add-6').val();
                if(three == ''){
                    three = 'null';
                }else if(three == 1){
                    three = '平台';
                }else if(three == 2){
                    three = '公司';
                }else if(three == 3){
                    three = '项目';
                }
                if(four == ''){
                    four = 'null';
                }
                if(five == ''){
                    five = 'null';
                }
                if(six == ''){
                    six = 'null';
                }
                // var row = {'entity_name':one,'rec_type':two,'entity_type':three,'company':four,'related_person':five,'key_words':six,'g':'<input type="button" value="编辑" class="btn-info btn btn-sm" onclick="editThisRow(this)">'+
                //                     '       <input type="button" value="确定" class="btn-info btn btn-sm" onclick="sureThisRow(this)">'+
                //                     '       <input type="button" value="删除" class="btn-info btn btn-sm deleteone" onclick="delThisRow(\''+one+'\')">'}
                // 去掉编辑功能
                // var row = {'entity_name':one,'rec_type':two,'entity_type':three,'company':four,'related_person':five,'key_words':six,'g':'<input type="button" value="删除" class="btn-info btn btn-sm deleteone" onclick="delThisRow(\''+one+'\')">'}
                var row = {'entity_name':one,'entity_type':three,'company':four,'related_person':five,'key_words':six,'g':'<input type="button" value="删除" class="btn-info btn btn-sm deleteone" onclick="delThisRow(\''+one+'\')">'}
                $('#addClub').bootstrapTable('insertRow',{index: 0, row: row});//在最开始插入新行
                // $("#addClub").prepend(str);
                // $('#addClub tbody tr:last').remove();
                $('#addClub tbody tr:first td').css({padding:'12px 8px'});
                $('#container .secondScreen .newAdd input').val('');//清空输入框
                $('#addClub').bootstrapTable('removeByUniqueId','');//删除行的方法
            }

        });

    //可以入库不！？
        function testLib_2() {
            // console.log(libaryList_2.length);
            if (libaryList_2.length==0){
                $('#oneLibrary_2').attr('disabled','disabled');
            }else {
                $('#oneLibrary_2').removeAttr('disabled');
            }
        }

    // 一键入库
        $('#oneLibrary_2').click(function(){
            if($('#oneLibrary_2').attr('disabled') == 'disabled'){
                return false;
            }else {
                // 如果选中空行 则删除空值
                for(var i=0;i<libaryList_2.length;i++){
                    if(libaryList_2[i].entity_name == ''){
                        // libaryList_2.removeByValue_2('');
                        libaryList_2.splice(i,1);
                    }
                }
                var InStorage_url = '/perceived/InStorage/';
                $.ajax({
                    url:InStorage_url,
                    type:'POST',
                    contentType:'application/json',
                    // data:JSON.stringify(LL_data),
                    data:JSON.stringify(libaryList_2),
                    dataType:'json',
                    success:function(data){
                        // console.log(data);
                        if(data.status == 'ok'){
                            // 重新渲染 一屏 表格
                            var fellTable_url='/perceived/perceiveData/';
                            public_ajax.call_request('get',fellTable_url,fellTable);
                            // alert('添加成功');
                            $('#delSuccess .modal-body').empty().append('<center>添加成功</center>');
                            $('#delSuccess').modal('show');
                            $('.modal-backdrop').css({position:'static'});
                            joinLab=1;
                            for(var j=0;j<libaryList_2.length;j++){
                                delThisRow(libaryList_2[j].entity_name);//删除行
                            }
                            // 按钮变为不可用
                            libaryList_2.length = 0;
                            testLib_2();
                        }
                    }
                })
            }
        })
// })


// 删除行
    var joinLab=0;
    function delThisRow(_thisOne) {
        $('#addClub').bootstrapTable('removeByUniqueId',_thisOne);
        var currentTrlen=$('#addClub tbody tr').length;
        if (currentTrlen<6){
            // var row = {'entity_name':'','rec_type':'','entity_type':'','company':'','related_person':'','key_words':'','g':''};
            var row = {'entity_name':'','entity_type':'','company':'','related_person':'','key_words':'','g':''};
            $('#addClub').bootstrapTable('insertRow',{index: 5, row: row});
        }

        // 删除libaryList_2 中的数据
        if (joinLab==0) {
            libaryList_2.removeByValue_2(_thisOne);
        }else {
            joinLab=0;
        };

        testLib_2();
    }

// 编辑确定
    function sureThisRow(_this) {
        var ttr=$(_this).parents("tr");
        $(ttr).find('input[type="text"]').each(function () {
            var inputVal = $(this).val();
            $(this).parents('td').html(inputVal);
        })
        // 存储下拉框的值
        $(ttr).find('select').each(function () {
            var selectVal = $(this).val();
            $(this).parents('td').html(selectVal);
        })

        // 将值传给 libaryList_2
        // libaryList_2

    }

// 编辑行  感觉 如果全修改的话 无法给libaryList_2赋值（修改值）
    function editThisRow(_this) {
        // 保存实体类别的值
        var tdText_2 = $(_this).parents('tr').children('td').eq(3).html();

        var ttr =$(_this).parents('tr');
        ttr.find("td").each(function () {
            if($(this).children("input[type='checkbox']").length>0){
                return ;
            }
            if($(this).children("input[type='button']").length>0){
                return ;
            }
            if($(this).children("input[type='text']").length>0){
                return ;
            }
            var tdText = $(this).html();
            $(this).html("");
            var inputObj = $("<input type='text' class='editing'>");
            inputObj.appendTo($(this));
            inputObj.css("width","95%");
            inputObj.val(tdText);
        });
        // 实体类型为下拉框
        // var tdText_2 = $(_this).parents('tr').children('td').eq(3).html();
        var selectObj = $('<select class="add-3-2 editing">'+
                    '<option value="1">平台</option>'+
                    '<option value="2">公司</option>'+
                    '<option value="3">项目</option>'+
                '</select>')
        $(_this).parents('tr').children('td').eq(3).html(selectObj);
        // 赋值给下拉框
        selectObj.val(tdText_2)
    }

// 批量添加 读取excel
    /*
    FileReader共有4种读取方法：
    1.readAsArrayBuffer(file)：将文件读取为ArrayBuffer。
    2.readAsBinaryString(file)：将文件读取为二进制字符串
    3.readAsDataURL(file)：将文件读取为Data URL
    4.readAsText(file, [encoding])：将文件读取为文本，encoding缺省值为'UTF-8'
                 */
    var wb;//读取完成的数据
    var rABS = false; //是否将文件读取为二进制字符串
    var somAddData = [];

    $('#someAdd').on('click',function(){
        console.log("1111111");
        // $('#importf_info .modal-body').empty().append('<center>保存成功</center>');
        $('#importf_info').modal('show');
        $('.modal-backdrop').css({position:'static'});
    })

    function importf(obj) {//导入


        if(!obj.files) {
            return;
        }
        //验证文件类型
        var file = $(obj).val();
        var ext = file.slice(file.lastIndexOf(".")+1).toLowerCase();
        console.log(ext);
        if(ext == 'xlsx' || ext == 'xls' || ext == 'et'){
            // 隐藏模态框
            $('#importf_info').modal('hide');

            var f = obj.files[0];
            var reader = new FileReader();
            reader.onload = function(e) {
                var data = e.target.result;
                if(rABS) {
                    wb = XLSX.read(btoa(fixdata(data)), {//手动转化
                        type: 'base64'
                    });
                } else {
                    wb = XLSX.read(data, {
                        type: 'binary'
                    });
                }
                //wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
                //wb.Sheets[Sheet名]获取第一个Sheet的数据
                // document.getElementById("demo").innerHTML= JSON.stringify( XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]) );
                var str = JSON.stringify( XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]) );
                // console.log(str);
                // somAddData.push(JSON.parse(str));
                somAddData = (JSON.parse(str));
                if(somAddData.length > 0){
                    // console.log("添加到表格");
                    for(var i=0;i<somAddData.length;i++){
                        var one = somAddData[i]['实体名称'];
                        var three = somAddData[i]['实体类别'];
                        // if(three == ''){
                        //     three = 'null';
                        // }else if(three == '平台'){
                        //     three = 1;
                        // }else if(three == '公司'){
                        //     three = 2;
                        // }else if(three == '项目'){
                        //     three = 3;
                        // }
                        var four = somAddData[i]['注册公司'];
                        var five = somAddData[i]['相关人物'];
                        var six = somAddData[i]['其他关键词'];
                        // var two = parseInt(somAddData[i]['推荐理由']);//暂 转为数字
                        // var row = {'entity_name':one,'rec_type':two,'entity_type':three,'company':four,'related_person':five,'key_words':six,'g':'<input type="button" value="删除" class="btn-info btn btn-sm deleteone" onclick="delThisRow(\''+one+'\')">'}
                        var row = {'entity_name':one,'entity_type':three,'company':four,'related_person':five,'key_words':six,'g':'<input type="button" value="删除" class="btn-info btn btn-sm deleteone" onclick="delThisRow(\''+one+'\')">'}
                        $('#addClub').bootstrapTable('insertRow',{index: 0, row: row});//在最开始插入新行
                        $('#addClub').bootstrapTable('removeByUniqueId','');//删除行的方法
                    }
                }
            };
            if(rABS) {
                reader.readAsArrayBuffer(f);
            } else {
                reader.readAsBinaryString(f);
            }
        }else {
            // alert('请上传excel或者WPS表格文件')
            $('#delSuccess .modal-body').empty().append('<center>请上传excel或者WPS表格文件</center>');
            $('#delSuccess').modal('show');
            $('.modal-backdrop').css({position:'static'});
            return false;
        }
    }

    function fixdata(data) { //文件流转BinaryString
        var o = "",
            l = 0,
            w = 10240;
        for(; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
        o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
        return o;
    }




