<template>
  <div class="app-container">
    <el-form :model="searchParam" ref="searchForm" :inline="true">
      <el-form-item label="角色名称" prop="name">
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
      <el-table-column label="角色名称" align="center" prop="name" :show-overflow-tooltip="true" />
      <el-table-column
        label="角色描述"
        align="center"
        prop="description"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="创建时间" align="center" prop="createTime" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
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
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input type="textarea" v-model="form.description" placeholder="请输入角色描述" />
        </el-form-item>
        <el-form-item label="权限">
          <el-tree
            :check-strictly="true"
            :default-expand-all="true"
            @check="resourceTreeCheck"
            ref="resourceTree"
            :props="defaultProps"
            label="name"
            :data="resourceTree"
            show-checkbox
            node-key="id"
          ></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { pageQuery, deleteInfo, save, detail } from "@/api/system/role";
import { getTree as getResourceTree } from "@/api/system/resource";
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
        resourceIds: []
      },
      accountForm: {},
      //表单校验
      rules: {
        name: [{ required: true, message: "名称不能为空", trigger: "blur" }]
      },
      resourceTree: [],
      defaultProps: {
        children: "children",
        label: "name"
      }
    };
  },
  created() {
    this.getResourceTree();
    this.pageQuery();
  },
  methods: {
    getResourceTree() {
      getResourceTree(this.searchParam).then(response => {
        this.resourceTree = response.data;
      });
    },
    /** 查询登录日志列表 */
    pageQuery() {
      this.loading = true;
      pageQuery(this.searchParam).then(response => {
        this.pageResult = response.data;
        this.loading = false;
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
      this.title = "添加角色";
      this.$nextTick(() => {
        this.$refs["resourceTree"].setCheckedKeys(this.form.resourceIds);
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      var _self = this;
      this.reset();
      const id = row.id || this.ids;
      detail({ id: id }).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改角色";
        this.$nextTick(() => {
          this.$refs["resourceTree"].setCheckedKeys(this.form.resourceIds);
        });
      });
    },
    // 表单重置
    reset() {
      this.form = { gender: 1,resourceIds:[] };
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
    setAccount(row) {
      this.accountOpen = true;
      this.accountForm.id = row.id;
    },
    pageChange(page) {
      this.searchParam.current = page.page;
      this.searchParam.size = page.limit;
      this.pageQuery();
    },
    resourceTreeCheck: function(node, data) {
      this.form.resourceIds = data.checkedKeys;
    }
  }
};
</script>

