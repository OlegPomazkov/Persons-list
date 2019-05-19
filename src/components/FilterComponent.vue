<template>
  <div class="filters">
    <div class="filters__header">
      Filter by fields 
    </div>

    <div  class="filters__inputs">
      <template v-for="(item, k) in searchParams">
        <el-input
          class="filters__inputs__input"
          v-if="item.type !== 'date'"
          :key="k"
          size="mini"
          clearable
          :placeholder="item.label"
          prefix-icon="el-icon-search"
          @input="handleInput({
            field:item.value, 
            value: item.searchStr,
            type: item.type  
          })"
          v-model="item.searchStr"
        />
        <date-picker
          v-if="item.type === 'date'"
          :key="k"
          input-class="datepicker-input"
          placeholder="Select birthdate"
          :clear-button="true"
          @selected="handleDateSelected"
          v-model="item.searchStr"
        />
      </template>      
    </div>
  </div>
</template>

<script>
import CONFIG from '../utils/dataConfig'
import { normalizeDate } from '../utils/functions'
import DatePicker from 'vuejs-datepicker'

export default {
  components: {
    DatePicker
  },
  data() {
    const searchParams = []

    CONFIG
      .filter( i => i.search)
      .forEach( i => {
        searchParams.push( {
          label: i.label,
          value: i.name,
          type: i.type, 
          searchStr: ''
        })
      })

    return{
      searchParams: searchParams
    }
  },
  methods: {
    handleInput(obj) {
      this.$emit('filterChanged', obj)
    }, 
    handleDateSelected(dateObj) {
      this.$emit('filterChanged', {
        field:'birthdate', 
        value: (+dateObj)? normalizeDate(+dateObj):'',
        type: 'date'  
      })
    },
  }
}
</script>

<style lang="stylus" scoped>
@import '../assets/styles/variables.styl'

.filters
  display flex
  flex-direction column
  justify-content flex-start
  align-items center

  &__header
    margin-bottom 5px
    font-size $largeText
    color $textColorDark
    font-weight bold

  &__inputs
    width 100%
    display flex
    flex-direction row
    justify-content space-between
    align-items center
    padding-left 1px
    padding-right 1px

    &__input
      width 32.5%

</style>
<style lang="stylus">
@import '../assets/styles/variables.styl'

.vdp-datepicker
  color $textColorLight  

.vdp-datepicker .datepicker-input 
  width 80% !important  
  height 28px
  text-align center
  color $textColorLight  
</style>