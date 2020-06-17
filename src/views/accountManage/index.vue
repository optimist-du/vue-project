<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="头像管理" name="first">
        <el-upload
          class="avatar-uploader"
          action="upload"
          accept="image/*"
          :http-request="uploadFile"
          :show-file-list="false">
          <img v-if="imageUrl" :src="baseUrl+imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <!-- <el-button type="primary" size="mini" @click="updateAvatar">保存</el-button> -->
      </el-tab-pane>
      <el-tab-pane label="密码管理" name="second">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="原密码" prop="oldPassword">
            <el-col :span="8">
              <el-input type="password" v-model="ruleForm.oldPassword" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-col :span="8">
              <el-input type="password" v-model="ruleForm.newPassword" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="确认密码" prop="repeatPassword">
            <el-col :span="8">
              <el-input type="password" v-model="ruleForm.repeatPassword" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="save">提交</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>


<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

<script>
import { imgUpload } from "@/api/fileUpload";
import { updatePassword, avatar } from "@/api/system/user";
import { getInfo } from "@/api/login";
  export default {
    data() {
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.newPassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        baseUrl:process.env.VUE_APP_BASE_API,
        activeName: 'first',
        imageUrl: '',
        ruleForm:{},
        rules:{
          oldPassword: [
            { required: true, message: "请输入原密码", trigger: "blur" }
          ],
          newPassword: [
            { required: true, message: "请输入新密码", trigger: "blur" }
          ],
          repeatPassword: [
            { validator:validatePass2, trigger: "blur" }
          ],
        },
        userInfo:{}
      };
    },
    mounted(){
      getInfo().then(response=>{
        if(response.result){
          this.userInfo = response.data;
          this.imageUrl = response.data.avatar;
        }
      })
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },
      beforeAvatarUpload(file) {//文件上传之前调用做一些拦截限制
        console.log(file);
        const isJPG = true;
        // const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        }
        let fd = new FormData();
        fd.append('file',file);//传文件
        fd.append('key',"image");//传其他参数
        imgUpload(fd).then(response=>{
          console.log(response);
          if(response.result && response.data){
            this.imageUrl = response.data;
          }
        });
        return isJPG && isLt2M;
      },
      handleAvatarSuccess(res, file) {//图片上传成功
        // this.imageUrl = res.data;
      },
      save(){
        this.$refs["ruleForm"].validate(valid => {
          if (valid) {
            updatePassword(this.ruleForm).then(response => {
              if (response.result) {
                this.msgSuccess("修改成功");
                this.$store.dispatch('logout').then(() => {
                  location.reload()
                })
              }
            }).catch(error=>{
              console.log(error);
            });
          }
        });
      },
      uploadFile(params){
        const file = params.file,
        fileType = file.type,
        isImage = fileType.indexOf("image") != -1,
        isLt2M = file.size / 1024 / 1024 < 2;
        // 这里常规检验，看项目需求而定
        if (!isImage) {
            this.$message.error("只能上传图片格式png、jpg、gif!");
            return;
        }
        if (!isLt2M) {
            this.$message.error("只能上传图片大小小于2M");
            return;
        }
        // 根据后台需求数据格式
        const form = new FormData();
        // 文件对象
        form.append("file", file);
        form.append('key',"image");//传其他参数
        // 本例子主要要在请求时添加特定属性，所以要用自己方法覆盖默认的action
        form.append("clientType", 'xxx');
        // 项目封装的请求方法，下面做简单介绍
        imgUpload(form)
          .then(res => {
              if(res.result && res.data){
                  avatar({"avatar":res.data}).then();
                  this.msgSuccess("上传成功");
                  this.imageUrl = res.data;
              }
          })
          .catch(() => {
              // xxx
          });
      },
      updateAvatar(){
        avatar({"avatar":this.imageUrl}).then(response=>{
          if(response.result){
            this.msgSuccess("保存成功");
          }
        })
      }
    }
  };
</script>