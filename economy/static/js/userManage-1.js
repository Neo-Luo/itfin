// 用户列表
    var userGroupTable_url='/manage/userList';
    public_ajax.call_request('get',userGroupTable_url,userGroup);

    function userGroup(data) {
        $('#userGroup').bootstrapTable('load', data);
        $('#userGroup').bootstrapTable({
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
                    title: "用户名称",//标题
                    field: "username",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                    formatter: function (value, row, index) {
                        if (row.username==''||row.username=='null'||row.username=='unknown'||!row.username){
                            return '未知';
                        }else {
                            return row.username;
                        };
                    }
                },
                {
                    title: "用户角色",//标题
                    field: "role_id",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                    formatter: function (value, row, index) {
                        if (row.role_id==''||row.role_id=='null'||row.role_id=='unknown'||!row.role_id){
                            return '未知';
                        }else if(row.role_id == 1){
                            return '管理员';
                        }else if(row.role_id == 2){
                            return '业务员';
                        }else{
                            return row.role_id;
                        };
                    }
                },
                // {
                //     title: "邮箱",//标题
                //     field: "c",//键名
                //     sortable: true,//是否可排序
                //     order: "desc",//默认排序方式
                //     align: "center",//水平
                //     valign: "middle",//垂直
                // },
                // {
                //     title: "上次登录时间",//标题
                //     field: "d",//键名
                //     sortable: true,//是否可排序
                //     order: "desc",//默认排序方式
                //     align: "center",//水平
                //     valign: "middle",//垂直
                // },
                {
                    title: "操作",//标题
                    field: "",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                    formatter: function (value, row, index) {
                        return '<span style="cursor:pointer;color:white;" onclick="editThis(\''+row.id+'\',\''+row.username+'\',\''+row.role_id+'\')" title="编辑"><i class="icon icon-edit"></i></span>'+
                        // return '<span style="cursor:pointer;color:white;" title="编辑" data-toggle="modal" data-target="#editUsermodal"><i class="icon icon-edit"></i></span>'+
                            '<span style="cursor:pointer;color:white;display: inline-block;margin: 0 10px;" onclick="delThis(\''+row.id+'\')" title="删除"><i class="icon icon-trash"></i></span>';
                    }
                },
            ],
        });
    };
    // userGroup(objData)

// 添加用户
    // form表单方式

// 删除用户
    // manage/delete
    // 传参：id
    function delThis(id){
        // 他弹出确认删除框
        $('#sure_box').modal('show');
        $('.modal-backdrop').css({position:'static'});
        $('#sure').one('click',function(){
            // console.log("删除"+id);
            var del_url = '/manage/delete?uid='+id;
            public_ajax.call_request('get',del_url,deleteUser);
        })
    }
    function deleteUser(data){
        // console.log(data);
        if(data.status == 'ok'){
            $('#success .modal-body').empty().append('<center>删除成功</center>');
            $('#success').modal('show');
            $('.modal-backdrop').css({position:'static'});

            // 重新渲染表格
            var userGroupTable_url='/manage/userList';
            public_ajax.call_request('get',userGroupTable_url,userGroup);
        }
    }
    // $('#success').on('hidden.bs.modal', function () {
    //     // 重新渲染表格
    //     var userGroupTable_url='/manage/userList';
    //     public_ajax.call_request('get',userGroupTable_url,userGroup);
    // })

// 编辑用户
    function editThis(uid,username,role_id){
        // 用 表单形式
        $('#editUsermodal .edit_Val_1').val(username); //账号名称
        $('#editUsermodal .edit_Val_uid').val(uid).hide(); //uid (隐式上传uid)
        $('#editUsermodal .edit_Val_2').val(role_id); //用户角色
        $('#editUsermodal').modal('show');
    }



