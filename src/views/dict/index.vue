<template>
  <div class="app-container">
    <el-form :model="searchParam" ref="searchForm" :inline="true">
      <el-form-item label="字典组名">
        <el-select v-model="searchParam.groupName" clearable size="small" @keyup.enter.native="handleSearch" placeholder="请选择">
            <el-option v-for="item in dicts" :key="item.groupName" :label="item.groupName" :value="item.groupName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据值">
        <el-input
          v-model="searchParam.searchKey"
          placeholder="请输入数据值"
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
      <el-table-column label="组名" align="center" prop="groupName" :show-overflow-tooltip="true" />
      <el-table-column label="数据编码" align="center" prop="dataCode" :show-overflow-tooltip="true" />
      <el-table-column label="数据名称/值" align="center" prop="dataValue" />
      <el-table-column label="序号" align="center" prop="sortNo" />
      <el-table-column label="描述" align="center" prop="dataDesc" />
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
        <el-form-item label="字典组名" prop="groupName" placeholder="请输入字典组名" >
          <el-input v-model="form.groupName"></el-input>
        </el-form-item>
        <el-form-item label="数据编码" prop="dataCode">
          <el-input v-model="form.dataCode" placeholder="请输入数据编码" />
        </el-form-item>
        <el-form-item label="数据名称/值" prop="dataValue">
          <el-input v-model="form.dataValue" placeholder="请输入数据名称/值" />
        </el-form-item>
        <el-form-item label="序号" prop="sortNo">
          <el-input-number v-model="form.sortNo" :min="1"  :step="1"  label="序号"></el-input-number>
        </el-form-item>
        <el-form-item label="描述" prop="dataDesc">
          <el-input v-model="form.dataDesc" type="textarea" placeholder="请输入描述" />
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
import { pageQuery, deleteInfo, save, detail, queryGroupName } from "@/api/system/dict";

export default {
  name: "Checklist",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 是否显示弹出层
      open: false,
      // 弹出层标题
      title: "",
      // 查询参数
      searchParam: {
        size: 10,
        current: 1,
        searchKey: "",
        groupName:""
      },
      pageResult: {
        total: 0,
        records: []
      },
      //表单参数
      form: {
        groupName:""
      },
      //表单校验
      rules: {
        groupName:[
          { required: true, message: "字典组名不能为空", trigger: "blur" }
        ],
        dataCode:[
          { required: true, message: "数据编码不能为空", trigger: "blur" }
        ],
        dataValue:[
          { required: true, message: "数据名称/值不能为空", trigger: "blur" }
        ]
      },
      dicts:[]
    };
  },
  mounted(){
    queryGroupName().then(respone =>{
      this.dicts = respone.data;
    })
  },
  created() {
    this.pageQuery();
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
      this.title = "添加字典";
      if(this.searchParam.groupName!=null && this.searchParam.groupName!=""){
        this.form.groupName = this.searchParam.groupName;
      }
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      detail({ id: id }).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改字典";
      });
    },
    // 表单重置
    reset() {
      this.form = {};
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
    pageChange(page){
      this.searchParam.current = page.page;
      this.searchParam.size = page.limit;
      this.pageQuery();
    }
  }
};
</script>

