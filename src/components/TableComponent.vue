<template>
  <table class="table">
		<tbody class="table__body"> 
			<tr class="table__body__header">
				<td
					class="table__body__header__cell"
					v-for="item in tableConfig"
					:key="item.id"
					:style="{'width': item.width}"
				>
					{{item.label}}
				</td>
			</tr>

			<tr
				:class="['table__body__row', row.id === activeRow? 'active':'']"
				v-for="row in tableDataToSee"
				:key="row.id"
				@click="handleRowClick(row)"
			>
				<td
					class="table__body__row__cell"
					v-for="item in tableConfig"
					:key="`${row.id}_${item.id}`"
					:style="{'width': item.width}"
				>  
					{{row[item.name]}}
				</td> 
			</tr>		
		</tbody>
  </table>
</template>

<script>
import CONFIG from '../utils/dataConfig'

export default {
	props: {
		tableData: {
			required: true
		},
		activeRow: {
			type: String,
			required: true
		},
	},
	data() {
		return {
			tableConfig: CONFIG.filter(i => i.tableView)
		}
	},
	computed: {
		tableDataToSee() {
			const formattedData = []
			
			this.tableData.forEach( item => {
				const newObj = {}
				const dateOptions = {
					year: 'numeric',
  				month: 'numeric',
  				day: 'numeric'
				}

				this.tableConfig.forEach( conf => {
					if( conf.type === 'date') {
						newObj[conf.name] = (new Date(item[conf.name])).toLocaleString('ru', dateOptions)
					} else {
						newObj[conf.name] = item[conf.name]
					}
				})
				newObj.id = item.id
				formattedData.push(newObj)
			})			

			return formattedData
		}
	},
	methods: {
		handleRowClick(row) {
			this.$emit('rowClicked', row)
		}
	}

}
</script>

<style lang="stylus" scoped>
@import '../assets/styles/variables.styl'

.table
	width 100%
	color $textColorDark
	border-collapse collapse

	&__body
		width 100%
		font-size $postNormalTex
		color $textColorLight

		&__header
			width 100%
			height $largeTableRowHeight
			font-size $largeText
			font-weight bold
			background-color $lightBlue
			color $textColorDark
		
			&__cell
				text-align center
				border-bottom 1.3px solid $line

		&__row
			height $tableRowHeight
			&:hover
				cursor pointer
				background-color $lightBackground
			&.active
				background-color $pinkBackground

			&__cell
				text-align center
				border-bottom 0.8px solid $line
</style>
