<template>
  <div class="app-container">
    <el-form :model="searchParam" ref="searchForm" :inline="true">
      <el-form-item label="用户名称" prop="name">
        <el-input
          v-model="searchParam.keyword"
          placeholder="请输入名称"
          clearable
          size="small"
          @keyup.enter.native="handleSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleSearch">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="pageResult.records" style="width: 100%;">
      <el-table-column label="用户名称" align="center" prop="nickname" :show-overflow-tooltip="true" />
      <el-table-column label="账号" align="center" prop="username" :show-overflow-tooltip="true" />
      <el-table-column label="联系电话" align="center" prop="mobile" />
      <el-table-column label="邮箱" align="center" prop="email" />
      <el-table-column label="性别" align="center" prop="genderDesc" />
      <el-table-column label="创建时间" align="center" prop="createTime" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-tools"
            @click="handleSetUserRoles(scope.row)"
          >设置角色</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="pageResult.total>0"
      :total="pageResult.total"
      :page.sync="searchParam.current"
      :limit.sync="searchParam.size"
      @pagination="pageChange"
    />

    <!-- 添加或修改清单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="账号名" prop="username">
          <el-input v-model="form.username" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.password" placeholder="不设置时请保持为空" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入员工名称" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio v-model="form.gender" :label="1">男</el-radio>
          <el-radio v-model="form.gender" :label="0">女</el-radio>
        </el-form-item>
        <!-- <el-form-item label="类型" prop="userType">
          <el-select v-model="form.userType" placeholder="请选择用户类型">
            <el-option :key=1 label="企业用户" :value=1></el-option>
            <el-option :key=2 label="员工用户" :value=2></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="联系电话" prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="userRoleOpen" width="600px" append-to-body>
      <el-checkbox-group v-model="userRole.roleIds">
        <el-checkbox v-for="role in roleList" :label="role.id" :key="role.id">{{role.name}}</el-checkbox>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveUserRoles">确 定</el-button>
        <el-button @click="cancelSetUserRoles">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { pageQuery, deleteInfo, save, detail } from "@/api/system/user";
import { queryAll as queryAllRole } from "@/api/system/role";
import {
  saveUserRoles,
  queryByUserId,
  getRoleIdsByUserId
} from "@/api/system/userRole";

export default {
  name: "Checklist",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 是否显示弹出层
      open: false,
      // 是否显示账户设置弹出层
      accountOpen: false,
      // 是否显示设置角色弹出层
      userRoleOpen: false,
      // 弹出层标题
      title: "",
      // 查询参数
      searchParam: {
        size: 10,
        current: 1,
        keyword: "",
        enterpriseId: ""
      },
      pageResult: {
        total: 0,
        records: []
      },
      //表单参数
      form: {
        gender: 0
      },
      accountForm: {},
      //表单校验
      rules: {
        username: [
          { required: true, message: "账号名称不能为空", trigger: "blur" }
        ],
        userType: [
          { required: true, message: "用户类型不能为空", trigger: "change" }
        ],
        email: [
          {
            type: "email",
            message: "请正确输入邮箱",
            trigger: ["blur", "change"]
          }
        ]
      },
      roleList: [],
      userRoleIdList: [],
      userRole: {
        userId: 0,
        roleIds: []
      }
    };
  },
  created() {
    this.pageQuery();
    this.queryAllRole();
  },
  methods: {
    /** 查询登录日志列表 */
    pageQuery() {
      this.loading = true;
      pageQuery(this.searchParam).then(response => {
        this.pageResult = response.data;
        this.loading = false;
      });
    },
    queryAllRole() {
      queryAllRole().then(response => {
        this.roleList = response.data;
      });
    },
    /** 搜索按钮操作 */
    handleSearch() {
      this.searchParam.current = 1;
      this.pageQuery();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("searchForm");
      this.handleSearch();
    },
    /** 强退按钮操作 */
    handleDelete(row) {
      this.$confirm('是否删除名称为"' + row.name + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return deleteInfo({ id: row.id });
        })
        .then(() => {
          this.pageQuery();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加清单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      detail({ id: id }).then(response => {
        this.form = response.data;
        this.form.password = "";
        this.open = true;
        this.title = "修改清单";
      });
    },
    handleSetUserRoles(row) {
      getRoleIdsByUserId({ userId: row.id }).then(response => {
        this.userRole.userId = row.id;
        this.userRole.roleIds = response.data;
        this.userRoleOpen = true;
        this.title = "设置角色";
      });
    },
    saveUserRoles() {
      saveUserRoles({ userId: this.userRole.userId, roleIds: this.userRole.roleIds }).then(
        response => {
          if (response.result) {
            this.msgSuccess("设置成功");
            this.userRoleOpen = false;
          }
        }
      );
    },
    // 表单重置
    reset() {
      this.form = { gender: 1 };
      this.resetForm("form");
    },
    /** 提交按钮 */
    save: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          save(this.form).then(response => {
            if (response.result) {
              this.msgSuccess("保存成功");
              this.open = false;
              this.pageQuery();
            }
          });
        }
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    cancelSetUserRoles() {
      this.userRoleOpen = false;
      this.reset();
    },
    setAccount(row) {
      this.accountOpen = true;
      this.accountForm.id = row.id;
    },
    delAccount(row) {
      delAccount({ staffId: row.id }).then(response => {
        if (response.result) {
          this.msgSuccess("保存成功");
          this.pageQuery();
        }
      });
    },
    setAccountSave() {
      this.$refs["accountForm"].validate(valid => {
        if (valid) {
          setAccount(this.accountForm).then(response => {
            if (response.result) {
              this.msgSuccess("保存成功");
              this.accountOpen = false;
              this.pageQuery();
            }
          });
        }
      });
    },
    pageChange(page) {
      this.searchParam.current = page.page;
      this.searchParam.size = page.limit;
      this.pageQuery();
    },
    queryAllRole() {
      queryAllRole().then(response => {
        this.roleList = response.data;
      });
    }
  }
};
</script>

