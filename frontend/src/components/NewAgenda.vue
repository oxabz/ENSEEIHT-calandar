<template>
    <div class="form-control">
        <label class="label" for="title">
            <span class="label-text text-left text-xs opacity-80">{{this.title}}</span>
        </label>
        <div class="relative">
            <input class="w-full pr-16 input input-primary input-bordered" v-model="newAgendaName" v-on:keyup.enter="submit" type="text" placeholder="Titre" name="title"/> 
            <button class="absolute top-0 right-0 rounded-l-none btn btn-primary" v-on:click="submit">{{this.label}}</button>
        </div>
    </div>
</template>
<script>
export default {
    props:['label', 'title', 'onCreate', 'private'],
    name:'NewAgenda',
    data(){
        return{
            newAgendaName:''
        }
    },
    methods:{
        submit(){
            let agenda = {
                name: this.newAgendaName,
            };
            if(this.newAgendaName.length == 0)return;
            if(this.private)agenda.userId='self';
            this.$store.dispatch('agenda/createAgenda',agenda).then((result) => {
                if(this.onCreate)this.onCreate(result);
            }).catch((err) => {
                console.error('Failed creating an agenda : ', err);
            });
        }
    }
}
</script>
<style scoped>

</style>