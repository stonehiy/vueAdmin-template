<template>
  <div class="app-container calendar-list-container">

    <!-- 查询和其他操作 -->

    <div class="filter-container">
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入客户端" v-model="listQuery.clientId">
      </el-input>
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入授权类型" v-model="listQuery.grantType">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button class="filter-item" type="primary" @click="handleCreate" icon="el-icon-edit">添加</el-button>
      <el-button class="filter-item" type="primary" :loading="downloadLoading" v-waves icon="el-icon-download"
                 @click="handleDownload">导出
      </el-button>
    </div>

    <!-- 查询结果 -->

    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
              highlight-current-row>
      <el-table-column align="center" width="100px" label="客户端ID" prop="id" sortable>
      </el-table-column>

      <el-table-column align="center" min-width="100px" label="accessTokenValiditySeconds"
                       prop="accessTokenValiditySeconds">
      </el-table-column>

      <el-table-column align="center" min-width="100px" label="客户端" prop="clientId">
      </el-table-column>

      <el-table-column align="center" min-width="50px" label="创建者" prop="createdBy">
      </el-table-column>

      <el-table-column align="center" min-width="100px" label="创建时间" prop="createdDate">
      </el-table-column>

      <el-table-column align="center" min-width="100px" label="授权类型" prop="grantType">
      </el-table-column>

      <el-table-column align="center" min-width="100px" label="修改者" prop="lastModifiedBy">
      </el-table-column>

      <el-table-column align="center" min-width="100px" label="修改时间" prop="lastModifiedDate">
      </el-table-column>

      <el-table-column align="center" min-width="100px" label="资源ID" prop="resourceIds">
      </el-table-column>

      <el-table-column align="center" min-width="100px" label="跳转ID" prop="redirectUri">
      </el-table-column>
      <el-table-column align="center" min-width="100px" label="refreshTokenValiditySeconds"
                       prop="refreshTokenValiditySeconds">
      </el-table-column>

      <el-table-column align="center" min-width="100px" label="状态" prop="enable"
                       :filters="[{ text: '可用', value: 'true' }, { text: '禁用', value: 'false' }]"
                       :filter-method="filterStatus">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{scope.row.status}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="250" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.pageNumber"
                     :page-sizes="[10,20,30,50]" :page-size="listQuery.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="dataForm" status-icon label-position="left" label-width="100px"
               style='width: 400px; margin-left:50px;'>
        <el-form-item label="客户端" prop="clientId">
          <el-input v-model="dataForm.clientId"></el-input>
        </el-form-item>
        <el-form-item label="授权类型" prop="grantType">
          <el-input v-model="dataForm.grantType"></el-input>
        </el-form-item>

        <el-form-item label="状态" prop="enable">
          <el-select v-model="dataForm.enable" placeholder="请选择">
            <el-option label="可用" value="true">
            </el-option>
            <el-option label="禁用" value="false">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {getAuthClientList, getAuthClientById, addAuthClient, updateAuthClient, deleteAuthClient} from '@/api/auth'
  import waves from '@/directive/waves' // 水波纹指令

  export default {
    name: 'AuthClient',
    directives: {
      waves
    },
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (this.dataForm.checkPassword !== '') {
            this.$refs.dataForm.validateField('checkPassword')
          }
          callback()
        }
      }
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.dataForm.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          pageNumber: 1,
          pageSize: 20,
          grantType: '',
          clientId: '',
          sort: '+id'
        },
        dataForm: {
          id: undefined,
          accessTokenValiditySeconds: '',
          clientId: '',
          createdBy: undefined,
          createdDate: undefined,
          enable: 0,
          grantType: '',
          lastModifiedBy: '',
          lastModifiedDate: '',
          redirectUri: '',
          refreshTokenValiditySeconds: '',
          resourceIds: '',
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '创建'
        },
        rules: {
          grantType: [{required: true, message: '授权类型不能为空', trigger: 'blur'}],
          clientId: [{required: true, message: '客户端不能为空', trigger: 'blur'}],
        },
        downloadLoading: false
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          '可用': 'success',
          '禁用': 'info',
          '删除': 'danger'
        }
        return statusMap[status]
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        getAuthClientList(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        }).catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.pageNumber = 1
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.pageNumber = val
        this.getList()
      },
      resetForm() {
        this.dataForm = {
          id: undefined,
          accessTokenValiditySeconds: '',
          clientId: '',
          createdBy: undefined,
          createdDate: undefined,
          enable: '',
          grantType: '',
          lastModifiedBy: '',
          lastModifiedDate: '',
          redirectUri: '',
          refreshTokenValiditySeconds: '',
          resourceIds: '',
        }
      },
      filterStatus(value, row) {
        return row.status === value
      },
      handleCreate() {
        this.resetForm()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            addAuthClient(this.dataForm).then(response => {
              this.list.unshift(response.data)
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      handleUpdate(row) {
        this.dataForm = Object.assign({}, row)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            updateAuthClient(this.dataForm).then(() => {
              for (const v of this.list) {
                if (v.id === this.dataForm.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.dataForm)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      handleDelete(row) {
        deleteAuthClient(row.id).then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        })

      },
      handleDownload() {
        this.downloadLoading = true
//        resolve => require(['@/vendor/Export2Excel'],resolve)
        import
        ('@/vendor/Export2Excel')
          .then(excel => {
            const tHeader = ['id', 'accessTokenValiditySeconds', 'clientId', 'createdBy', 'createdDate', 'enable', 'grantType', 'lastModifiedBy', 'lastModifiedDate', 'redirectUri', 'refreshTokenValiditySeconds', 'resourceIds']
            const filterVal = ['id', 'accessTokenValiditySeconds', 'clientId', 'createdBy', 'createdDate', 'enable', 'grantType', 'lastModifiedBy', 'lastModifiedDate', 'redirectUri', 'refreshTokenValiditySeconds', 'resourceIds']
            excel.export_json_to_excel2(tHeader, this.list, filterVal, '客户端信息')
            this.downloadLoading = false
          })
      }
    }
  }
</script>
id: undefined,
accessTokenValiditySeconds: '',
clientId: '',
createdBy: undefined,
createdDate: undefined,
enable: 0,
grantType: '',
lastModifiedBy: '',
lastModifiedDate: '',
redirectUri: '',
refreshTokenValiditySeconds: '',
resourceIds: '',
