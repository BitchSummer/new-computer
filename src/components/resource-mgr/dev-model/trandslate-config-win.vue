<template>
	<toast :config="config" @cancel="config.dialogVisible=false" @doSave="doSave">
		<el-table :data="config.tempList" :highlight-current-row="false" style="width: 90%;margin: 0px auto;">
			<el-table-column align="center" label="转义编码">
				<template slot-scope="scope">
					<el-input v-model="scope.row.key" size="medium"></el-input>
				</template>
			</el-table-column>
			<el-table-column align="center" label="转义值">
				<template slot-scope="scope">
					<el-input v-model="scope.row.value" size="medium"></el-input>
				</template>
			</el-table-column>
			<el-table-column width="140" align="center" label="操作">
				<template slot-scope="scope">
					<el-button size="mini" icon="el-icon-plus" type="primary" @click="doAdd(scope.$index)"></el-button>
					<el-button size="mini" icon="el-icon-minus" @click="doDel(scope.$index)" type="danger"></el-button>
				</template>
			</el-table-column>
		</el-table>
	</toast>
</template>

<script type="text/javascript">
	export default {
		props: ['config'],
		methods: {
			/**显示条数变化 */
			doAdd(index_) {
				this.config.tempList.splice(index_ + 1, 0, { ...this.config.emptyRow
				})
			},
			doDel(index_) {
				this.config.tempList.splice(index_, 1)
			},
			doSave() {
				let temp = '';
				let hasError = false;
				let tempArr1 = []
				this.config.tempList.forEach((item, index) => {
					if (item.key != '' && item.value != '') {
						if (temp.indexOf("#" + item.key + "#") > -1) {
							this.$message({
								message: '第' + (index + 1) + '行内容存在重复,请检查...',
								type: 'warning'
							});
							hasError = true;
							return;
						} else {
							tempArr1.push(item)
							temp += "#" + item.key + "#";
						}

					}
				})

				if (hasError == false) {
					console.log('tempArr1',tempArr1)
					this.$emit("doSave", this.config.index, tempArr1);
				}

			}
		}
	};
</script>
<style>
	.pagetool {
		text-align: center;
	}
</style>
