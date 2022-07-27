Vue.component('grocery-item', {
    data: function() {
        return {
            editMode: false
        }
    },
    props: ['item'],
    template: `
        <div>
            <div v-if="editMode">
                <input type="text" v-model="item.item_name">
                <input type="text" v-model="item.item_note">
                <button @click="saveGroceryItem(item)">Save</button>
            </div>
            <div v-else>
                <input type="checkbox" v-model="item.complete" @click="toggleGroceryItem(item)">
                <div>
                    <p><em>(aisle {{ item.aisle }})</em></p>
                </div>
                <p>{{ item.item_name }}</p>
                <p>{{ item.item_note }}</p>
                <br>
                <button @click="editMode=true">Edit</button>
                <button @click="removeGroceryItem(item)">×</button>
            </div>  
        </div>
    `,
    methods: {
        saveGroceryItem: function(item) {
            this.$emit('save', item)
            this.editMode = false
        },
        removeGroceryItem: function(item) {
            this.$emit('remove', item)
        },
        toggleGroceryItem: function(item) {
            this.$emit('toggle', item)
            this.$emit('save', item)
        }
    }
})

const vm = new Vue({
    el: "#app",
    delimiters: ['[[',']]'],
    data: {
        csrfToken: "",
        grocery_list: [],
        currentUser: {},    
        item: [],
        newGroceryItem: {
            "user_id": null,
            "item_name": "",
            "usual": false,
            "item_note": "",
            "complete": false
        },
    },
    methods: {
        loadGroceryList: function() {
            // this.grocery_list = {}
            axios({
                method: 'get',
                url: 'api/v1/grocery_list/'
            }).then(response => {
                this.grocery_list = response.data
                console.log(response.data)
            }).catch(error => {
                console.log(error)
                console.log(error.response_data)
            })
        },
        loadCurrentUser: function() {
            axios({
                method: 'get',
                url: '/api/v1/current_user/'
            }).then(response => this.currentUser = response.data)
        },
        createGroceryItem: function() {
            axios({
                method: 'post',
                url: 'api/v1/grocery_list/',
                headers: {
                    'X-CSRFToken': this.csrfToken
                },
                data: {
                    "user_id": this.currentUser.id,
                    "item_name": this.newGroceryItem.item_name,
                    "usual": this.newGroceryItem.usual,
                    "item_note": this.newGroceryItem.item_note,
                    "complete": this.newGroceryItem.complete
                }
                // data: this.newGroceryItem
            }).then(response => {
                this.loadGroceryList()
                this.newGroceryItem = {
                    "user_id": null,
                    "item_name": "",
                    "usual": false,
                    "item_note": "",
                    "complete": false
                }
            })
        },
        saveGroceryItem: function(item) {
            axios({
                method: 'patch',
                url: `api/v1/grocery_list/${item.id}/`,
                headers: {
                    'X-CSRFToken': this.csrfToken
                },
                data: item
            }).then(response => {
                this.loadGroceryList()
            })
        },
        removeGroceryItem: function(item) {
            axios({
                method: 'delete',
                url: `api/v1/grocery_list/${item.id}/`,
                headers: {
                    'X-CSRFToken': this.csrfToken
                }
            }).then(response => {
                this.loadGroceryList()
            })
        },
        toggleGroceryItem: function(item) {
            item.complete = !item.complete
        }
    },
    computed: {
        incompleteItems: function() {
            return this.grocery_list.filter(function(item) {
                return !item.complete
            })
        },
        completeItems: function() {
            return this.grocery_list.filter(function(item) {
                return item.complete
                // text-decoration: line-through
            })
        }
    }, 
    created: function() {
        this.loadCurrentUser()
        this.loadGroceryList()
    },
    mounted: function() {
        this.csrfToken = document.querySelector("input[name=csrfmiddlewaretoken]").value
    }
})