<template>
<div class="flex flex-row w-screen overflow-auto">
    <div class="w-full relative h-screen flex flex-col">
        <TimelineNavigation :initial-date="startDate" :interval="interval" :changeDate="handleChange"/>
        <Agenda :start="startDate" :interval="interval" :entries="agendaEntries"/>
        <MenuButton class="absolute right-4 bottom-4 btn-circle" menu="createEntry"><i class="fas fa-plus text-xl"></i></MenuButton>
    </div>
    <Sidebar/>
</div>
</template>
<script>
import MenuButton from '../components/MenuButton.vue'
import Sidebar from '../components/Sidebar.vue'
import Agenda from '../components/agenda/Agenda.vue';
import TimelineNavigation from '../components/agenda/TimelineNavigation.vue';

const BREAKPOINTS = {
    'xs': 420,
    'sm': 640,
    'md': 768,
    'lg': 1024,
    'xl': 1280,
    '2xl': 1536,
}

export default {
    data(){
        let startDate = new Date();
        return {
            windowWidth: window.innerWidth,
            startDate,
        }
    },
    methods:{
        create(){
            const agendaId = this.$route.params.id;
            this.$store.dispatch('entry/createEntry', {
                agendaId,
                titre:'test',
                description:'test'
            })
        },
        onResize() {
            this.windowWidth = window.innerWidth;
        }
    },
    computed:{
        agendaEntries(){
            const module = this.$store.state.entry;
            let endDate = new Date(this.startDate)
            endDate.setDate(endDate.getDate()+this.interval)
            if (!this.$store.getters['entry/hasInfoOnAgenda']({agendaId:this.$route.params.id, start:this.startDate.getTime(), end:endDate.getTime()})){
                this.$store.dispatch('entry/queryEntriesOfAgenda',{agendaId:this.$route.params.id, start:this.startDate, end:endDate});
                return [];
            }
            return module.entriesOfAgenda[this.$route.params.id].entries.map(id => module.entries[id]);
        },
        handleChange(){
            return (date)=>{
                this.startDate = date;
            }
        },
        breakpoint(){
            for (const [breakpoint, px] of Object.entries(BREAKPOINTS)) {
                if(px > this.windowWidth)return breakpoint;
            }
            return 'xs'
        },
        interval(){
            return {
                'xs': 3,
                'sm': 5,
                'md': 7,
                'lg': 7,
                'xl': 7,
                '2xl': 7,
            }[this.breakpoint];
        }
    },
    mounted() {
        this.$nextTick(() => {
            window.addEventListener('resize', this.onResize);
        })
    },
    beforeUnmount() { 
        window.removeEventListener('resize', this.onResize); 
    },
    components: {
    MenuButton,
    Sidebar,
    Agenda,
    TimelineNavigation
}
}
</script>