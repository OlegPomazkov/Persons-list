<template>
  <div class="table">
  	<div class="table__header">
  		FULL PERSONS DATA
  	</div>
  	
    <div class="table__controls">
      <filter-component
        class="table__controls__filter"
        @filterChanged="handleFilterChanged"
      />

      <div class="table__controls__buttons">
        <el-button
          class="table__controls__buttons__button"
          size="mini"
          type="primary"
          @click="handleAddClick"
        >
          Add  
        </el-button>
        <el-button
          class="table__controls__buttons__button"
          size="mini"
          type="primary"
          :disabled="selectedPerson === null"
          @click="handleEditClick"
        >
          Edit 
        </el-button>
        <el-button
          class="table__controls__buttons__button"
          size="mini"
          type="primary"
          :disabled="selectedPerson === null"
          @click="confirmVisible = true"
        >
          Delete 
        </el-button>
      </div>
    </div>

  	<table-component
      class="table__table"
  		:tableData="personsToSee"
      :activeRow="selectedPerson? selectedPerson.id: ''"
  		@rowClicked="handleRowClicked"
    />

    <router-view/>

    <el-dialog
      title="Attantion"
      :visible.sync="confirmVisible"
      width="60%"
    >
      <span>
        {{`A you sure to delete data of ${selectedPerson? selectedPerson.firstName:''} ${selectedPerson? selectedPerson.lastName: ''}?`}}
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button 
          type="default"
          @click="confirmVisible = false"
          >
          Cancel
        </el-button>
        <el-button 
          type="primary" 
          @click="handleDeleteClick"
        >
          Confirm
        </el-button>
      </span>
    </el-dialog>    
  </div>
</template>

<script>
import CONFIG from '../utils/dataConfig'
import { mapGetters } from 'vuex' 
import TableComponent from '../components/TableComponent' 
import FilterComponent from '../components/FilterComponent'

export default {
	components: {
		TableComponent,
    FilterComponent,
	},
  data () {
    const obj = {}

    CONFIG.forEach( item => {
      if(item.search) obj[item.name] = ''
    })

    return { 
    	selectedPerson: null,
      filterBy: obj,
      confirmVisible: false
    }
  },
  computed: {
	  ...mapGetters([
	    'persons',
      'selectedPersonId',
	  ]),
    personsToSee() {
      if(!this.persons) return []

      return this.persons.filter( person => {
        let cond = true

        Object.keys(this.filterBy).forEach( key => {
          if(this.filterBy[key] && key !== 'birthdate') {
            if(person[key].toLowerCase().indexOf(this.filterBy[key].toLowerCase()) === -1) {
              cond = false
            } 
          }
          if(this.filterBy[key] && key === 'birthdate') {
            if(+person[key] !== this.filterBy[key]) {
              cond = false
            } 
          }
        }) 
      
        return cond
      })
    }
	},
  watch: {
    selectedPersonId: function(newId) {
      if( newId === null) this.selectedPerson = null
    }
  },
  async created() {
    this.selectedPerson = this.personsToSee.filter( i => i.id === this.selectedPersonId)[0]
    if (this.selectedPerson) return

    this.selectedPerson = null  
    if(!this.persons) await this.$store.dispatch('setAllData')
  },
  methods: {
  	handleRowClicked(row) {
      this.selectedPerson = row
      this.$store.dispatch('setSelectedPersonId', row.id)
  	},
    handleFilterChanged(filter) {
      this.filterBy[filter.field] = filter.value
    },
    handleAddClick() {
      this.$router.push({ name: "dialog", params: {id: 'new'}})
    },
    handleEditClick() {
      this.$router.push({ name: "dialog", params: {id: this.selectedPerson.id}})
    },
    handleDeleteClick() {
      this.$store.dispatch('deleteSelectedPerson', this.selectedPerson.id)
      this.confirmVisible = false
    },
  }
}
</script>

<style lang="stylus" scoped>
@import '../assets/styles/variables.styl'

.table
  display flex
  flex-direction column
  justify-content flex-start
  align-items center

  &__header
    font-size $title
    font-weight bold
    color $textColorDark
    margin-top 15px
    margin-bottom 15px

  &__controls
    width 100%
    display flex
    flex-direction row
    justify-content space-between
    align-items center
    margin-bottom 15px

    &__buttons
      width 40%
      padding-left 15px
      padding-rigth 5px
      display flex
      flex-direction row
      justify-content flex-end

      &__button
        min-width 70px
        margin-left 10px

    &__filter
      width 60%
      padding-left 5px
      padding-rigth 15px

  &__table
    width 100%
    max-width 700px
  </style>