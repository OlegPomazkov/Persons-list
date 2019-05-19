<template>
	<div class="relatives">
		<div class="relatives__title"> 
			PERSON RELATIVES 
		</div>

		<template v-if="!selectedPersonId">
			<div class="relatives__message">
				No Selected Person
			</div>
			<router-link to="/">
				<el-button
					 class="relatives__back_link"
					 type="primary"
				>
					Back to all persons list
				</el-button>
			</router-link>
		</template>

		<template v-if="selectedPersonId">
			<div class="relatives__header">
				<div  class="relatives__header__person">
					<span class="relatives__header__person__label">
						Person:
					</span>
					<span class="relatives__header__person__value">
						{{ `${mainPerson.firstName} ${mainPerson.middleName} ${mainPerson.lastName}`}}	
					</span>
				</div>
				
				<div  class="relatives__header__controls">
				  <el-select 
				  	class="relatives__header__controls__select"
				  	size="mini"
				  	clearable
				  	v-model="newRelativeId" 
				  	placeholder="Select"
				  	no-data-text="No data"
				  	@change="handleSelectChanged"
				  >
				    <el-option
				      v-for="item in nonRelatives"
				      :key="item.id"
				      :label="`${item.lastName} ${item.firstName} ${item.middleName}`"
				      :value="item.id"
				    >
				    </el-option>
				  </el-select>

				  <el-button
				  	class="relatives__header__controls__button"
			      size="mini"
			      type="primary"
			      :disabled="selectedRelative === null"
			      @click="handleDeleteClick"
			    >
			      Delete 
			    </el-button>
				</div>
			</div>

			<table-component
	      class="relatives__table"
	  		:tableData="relatives"
	  		:activeRow="selectedRelative? selectedRelative.id: ''"
	  		@rowClicked="handleRowClicked"
	    />
	  </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex' 
import TableComponent from '../components/TableComponent' 
import DatePicker from 'vuejs-datepicker'


export default {
	components: {
		TableComponent,
		DatePicker,		
	},
	data() {
		return {
			selectedRelative: null,
			newRelativeId: '',
		}
	},
  computed: {
	  ...mapGetters([
	  	'persons',
	  	'selectedPersonId',
	  	'personDataById',
	  	'relativesById',
	  	'nonRelativesById',
	  ]),
	  relatives() {
	  	return this.relativesById(this.selectedPersonId)
	  }, 
	  nonRelatives() {
			return this.nonRelativesById(this.selectedPersonId)
	  },
	  mainPerson() {
	  	return this.personDataById(this.selectedPersonId)
	  },
	},
	async created() {
		if(!this.persons) await this.$store.dispatch('setAllData')
  },
  methods: {
  	handleRowClicked (row) {
  		this.selectedRelative = row
  	},
  	handleDeleteClick() {
 			this.$store.dispatch('deleteRelative', {
  			mainId: this.selectedPersonId,
  			relativeId: this.selectedRelative.id
  		})
  		this.selectedRelative = null
  	},
  	handleSelectChanged(id) {  		
  		if(!id) return

  		this.$store.dispatch('setNewRelative', {
  			mainId: this.selectedPersonId,
  			newRelativeId: id
  		})
  	},
  }
}
</script>

<style lang="stylus" scoped>
@import '../assets/styles/variables.styl'

.relatives
  display flex
  flex-direction column
  justify-content flex-start
  align-items center

  &__title
    font-size $title
    font-weight bold
    color $textColorDark
    margin-top 15px
    margin-bottom 15px

  &__message
    font-size $subtitle
    font-weight bold
    color $textColorLight
    margin-top 15px
    margin-bottom 15px

  &__header
    width 100%
    display flex
    flex-direction row
    justify-content center
    align-items center
    margin-bottom 15px

    &__person
    	width 50%
    	font-size $largeText
    	
    	&__label
    		margin-right 10px
    		color $textColorLight

    	&__value
    		font-weight bold
    		color $textColorDark

    &__controls
    	width 50%
    	display flex
    	flex-direction row
    	justify-content center
    	align-items center

    	&__select
    		margin-right 10px

    	&__button
    		margin-left 10px	
	&__table
    width 100%
    max-width 700px
</style>