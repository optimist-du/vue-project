<template>
  <div class="app-container">
    <el-form :model="searchParam" ref="searchForm" :inline="true">
      <el-form-item label="资源名称" prop="name">
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

    <el-table
      v-loading="loading"
      :data="treeData"
      row-key="id"
      border
      style="width: 100%;"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="资源名称" align="center" prop="name" :show-overflow-tooltip="true" />
      <el-table-column
        label="资源权限"
        align="center"
        prop="model.permission"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-plus" @click="handleAdd(scope.row)">新增</el-button>
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

    <!-- 添加或修改清单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="父级资源" prop="parentId">
          <treeselect
            v-model="form.parentId"
            :options="treeOptions"
            :normalizer="normalizer"
            :show-count="true"
            placeholder="选择上级菜单"
          />
        </el-form-item>
        <el-form-item label="资源名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入资源名称" />
        </el-form-item>
        <el-form-item label="资源权限" prop="permission">
          <el-input v-model="form.permission" placeholder="请输入资源权限" />
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
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { pageQuery, deleteInfo, save, detail, getTree } from "@/api/system/resource";
export default {
  name: "Resource",
  components: { Treeselect },
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
        gender: 0
      },
      accountForm: {},
      //表单校验
      rules: {
        name: [{ required: true, message: "名称不能为空", trigger: "blur" }]
      },
      treeData: [
        {
          id: 1,
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          id: 2,
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          id: 3,
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
          children: [
            {
              id: 31,
              date: "2016-05-01",
              name: "王小虎",
              address: "上海市普陀区金沙江路 1519 弄"
            },
            {
              id: 32,
              date: "2016-05-01",
              name: "王小虎",
              address: "上海市普陀区金沙江路 1519 弄"
            }
          ]
        },
        {
          id: 4,
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ]
    };
  },
  computed: {
    treeOptions() {
      return [{ id: 0, name: "主类目", children: this.treeData }];
    }
  },
  created() {
    this.getTree();
  },
  methods: {
    getTree() {
      this.loading = true;
      getTree(this.searchParam).then(response => {
        this.treeData = response.data;
        this.loading = false;
      });
    },
    getTreeselect() {
      this.resourceTree = [];
      const menu = { id: 0, name: "主类目", children: [] };
      resourceTree.children = this.treeData;
      this.resourceTree.push(menu);
    },
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      };
    },
    /** 搜索按钮操作 */
    handleSearch() {
      this.searchParam.current = 1;
      this.getTree();
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
          this.getTree();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      if (row != null) {
        this.form.parentId = row.id;
      }
      this.open = true;
      this.title = "添加资源";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      detail({ id: id }).then(response => {
        this.form = response.data;
        this.form.password = "";
        this.open = true;
        this.title = "修改资源";
      });
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
              this.getTree();
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
    }
  }
};
</script>

