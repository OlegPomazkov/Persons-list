<template>
  <div class="dialog">
    <div class="dialog__content">
      <div class="dialog__content__title">
        {{ dialogTitle }} 
      </div>

      <div 
        class="dialog__content__item"
        v-for="item in config"
        :key="item.id"
      >
        <div class="dialog__content__item__label">
          {{ item.label }}
        </div>
        
        <el-input
          v-if="item.type !== 'date'"
          :disabled="!item.tableView"
          size="mini"
          :placeholder="item.label"
          v-model="personData[item.name]"
        />  

        <div v-if="item.type === 'date'">
          <date-picker
            v-model="personData[item.name]"
          />
        </div>
      </div>
  
      <div  class="dialog__content__controls">
        <el-button
          type="primary" 
          class="dialog__content__controls__button"
          @click="handleSaveClick"
        >
          Save
        </el-button>

        <el-button 
          type="default"
          class="dialog__content__controls__button"
          @click="handleCloseClick"
        >
          Cancel
        </el-button>
      </div>  
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'  
import CONFIG from '../utils/dataConfig'
import {setNewId, normalizeDate} from '../utils/functions'
import DatePicker from 'vuejs-datepicker'

export default {
  components: {
    DatePicker
  },
  data() {
    let obj = {}

    CONFIG.forEach( item => {obj[item.name] = ''})

    return{
      config: CONFIG,
      personId: null,
      personData: obj,
    }
  },
  computed: {
    ...mapGetters([
      'personDataById',
      'allId',
      'selectedPersonId',
    ]),
    dialogTitle() {
      return this.personId === 'new'? 'Add person data': 'Edit person data'
    }
  },
  created() {
    this.personId = this.$route.params.id
    if( this.personId === 'new') {
      if(!this.allId)  this.handleCloseClick()
      this.personData.id = setNewId(this.allId)
    } else {
      if (this.allId.indexOf(this.personId) === -1) this.handleCloseClick()       
      this.personData = this.personDataById(this.personId)
    }
  },
  methods: {
     handleSaveClick() {
      this.personData.birthdate = normalizeDate(+this.personData.birthdate)
      this.$store.dispatch('updatePersonsData', {
        id: this.personId,
        data: this.personData
      })
      this.$router.push({ name: "master"})
    },
     handleCloseClick() {
      this.$router.push({ name: "master"})
    },
  }
}
</script>

<style lang="stylus" scoped>
@import '../assets/styles/variables.styl'

.dialog
  position fixed
  left 0
  top 0
  width 100%
  height 100%
  background-color $transparentBackground
  z-index 10

  &__content
    max-width 500px
    margin-top 50px
    margin-left auto
    margin-right auto 
    padding-bottom 10px
    display flex
    flex-direction column
    justify-content flex-start
    align-items center    
    font-weight bold
    color $textColorDark
    background-color $white
    border-radius 5px
    z-index 100

    &__title
      width 100%
      margin-bottom 10px
      padding-top 10px
      padding-bottom 10px
      align-self center
      text-align center
      font-size $subtitle
      background-color $lightBlue
      border-radius 5px 5px 0 0

    &__item
      width 98%
      padding-top 15px
      padding-bottom 10px      
      display flex
      flex-direction row
      justify-content flex-start
      align-items center

      &__label
        width 150px
        padding-left 5px
        font-size $preLargeText
        font-style italic

      &__content
        font-size $largeText
        font-weight normal
        color $textColorLight
</style>