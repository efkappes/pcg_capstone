Vue.component('grocery-item', {
    data: function() {
        return {
            editMode: false
        }
    },
    props: ['item', 'item_info', 'list_name'],
    template: `
        <div>
            <div v-if="editMode">
                <input type="text" v-model="item.item_name">
                <input type="text" v-model="item.item_note">
                <button @click="saveGroceryItem(item)">Save</button>
            </div>
            <div v-else>
                <div class='item-row'>
                    <div class='item-row-left'>
                        <ul id='aisle'>aisle {{ item.aisle }}</ul>
                        <ul><input type="checkbox" v-model="item.complete" @click="toggleGroceryItem(item)"></ul>
                        <ul>{{ item.item_name }}</ul>
                    </div>
                    <div class='item-row-right'>
                        <div v-if=item.item_note>
                            <ul id='note'><em>{{ item.item_note }}</em></ul>
                        </div>
                        <div class='action-buttons'>
                            <ul>
                                <button @click="editMode=true">Edit</button>
                                <button @click="removeGroceryItem(item)">×</button>
                            </ul>
                        </div>
                    </div>
                </div>
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
        show_item_add: false,
        show_list_name: false,
        data: [],
        grocery_list: [],
        list_options: [],
        currentUser: {}, 
        list_info: [],   
        selectedList: "",
        item: [],
        newGroceryList: {
            "user_id": null,
            "list_name": "",
            "owner": null,
            "is_current": true,
            "is_favorite": false
        },
        newGroceryItem: {
            "list_id": null,
            "item_name": "",
            "aisle": 0,
            "usual": false,
            "item_note": "",
            "complete": false
        },
        list_id: null,
        list_name: "",
        item_info: [],
        aisle: 0, 
        filter_listid: null
    },
    methods: {
        // this method returns item and list info for a *specific* grocery list of the current user
        loadGroceryList: function(list_id) {  
            axios({
                method: 'get',
                url: `api/v1/grocery_list_and_items/${list_id}/`   
            }).then(response => {
                this.grocery_list = response.data
                this.list_id = response.data.id
                this.show_item_add = true
                console.log('loadGroceryList response.data: ', response.data)
                // console.log('loadGroceryList this.grocery_list: ', this.grocery_list)
                // console.log('loadGroceryList this.list_id: ', this.list_id)
            }).catch(error => {
                console.log(error)
                console.log(error.response_data)
            })
        },
        // this method returns item and list info for *all* the lists of the current user
        loadLists: function() {
            axios({
                method: 'get',
                url: 'api/v1/grocery_list/'               
                // url: 'api/v1/grocery_list_and_items/'               
            }).then(response => {
                this.list_options = response.data
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
        saveGroceryItem: function(item) {
            console.log('inside saveGroceryItem, item: ', item)
            axios({
                method: 'patch',
                url: `api/v1/grocery_list_items/${item.id}/`,
                headers: {
                    'X-CSRFToken': this.csrfToken
                },
                data: item
            }).then(response => {
                this.loadGroceryList(this.list_id)
            })
        },
        removeGroceryItem: function(item) {
            axios({
                method: 'delete',
                url: `api/v1/grocery_list_items/${item.id}/`,
                headers: {
                    'X-CSRFToken': this.csrfToken
                }
            }).then(response => {
                this.loadGroceryList(this.list_id)
            })
        },
        toggleGroceryItem: function(item) {
            item.complete = !item.complete
        },
        addGroceryList: function() {
            console.log('inside addGroceryList')
            axios({
                method: 'post',
                url: 'api/v1/grocery_list/',
                headers: {
                    'X-CSRFToken': this.csrfToken
                },
                data: {
                    "user_id": this.currentUser.id,
                    "list_name": this.newGroceryList.list_name,
                    "owner": this.currentUser.id,
                    "is_current": this.newGroceryList.is_current,
                    "is_favorite": this.newGroceryList.is_favorite                
                }
            }).then(response => {
                this.list_id = response.data.id
                this.list_name = response.data.list_name
                this.show_item_add = true
                this.loadLists()
                // reset grocery_list so that it doesn't hold old data; this handles the case where a user
                // selects an existing list from the drop-down but then creates a new list and hasn't added 
                // any items yet
                this.grocery_list = []  
                // this.loadGroceryList()
            })            
        },
        addGroceryListItem: function(list_id) {
            item_name = this.newGroceryItem.item_name

            // look up aisle info for the given item name before adding item to the list
            axios({
                method: 'get',
                url: 'api/v1/aisle_info/',
                params: {
                    "item_name": item_name
                }           
            }).then(response => {
                if (response.data[0]) {
                    this.aisle = response.data[0].aisle                
                } else {
                    this.aisle = 0
                }
                axios({
                    method: 'post',
                    url: 'api/v1/grocery_list_items/',
                    headers: {
                        'X-CSRFToken': this.csrfToken
                    },
                    data: {
                        "list_id": this.list_id,
                        "item_name": this.newGroceryItem.item_name,                                    
                        "aisle": this.aisle,                            
                        "usual": this.newGroceryItem.usual,                            
                        "item_note": this.newGroceryItem.item_note,                            
                        "complete": this.newGroceryItem.complete                            
                    }
                }).then(response => {
                    this.loadGroceryList(this.list_id)
                    this.newGroceryItem = {
                        "item_name": "",
                        "usual": false,
                        "item_note": "",
                        "complete": false
                    }
                }) 
            }).catch(error => {
                console.log(error)
                console.log(error.response_data)
            })
        }
    },
    computed: {
        incompleteItems: function() {
            // console.log('inside incompleteItems, this.grocery_list: ', this.grocery_list)
            // console.log('inside incompleteItems, this.list_id: ', this.list_id)

            let incompleteItems = []

            if (this.grocery_list.id==this.list_id) {    
                for (let j=0; j < this.grocery_list.item_info.length; j++)  {
                    if (!this.grocery_list.item_info[j].complete) {
                        incompleteItems.push(this.grocery_list.item_info[j])
                    }
                }
            }

            return incompleteItems
        }, 
        completeItems: function() {
            // console.log('inside completeItems')

            let completeItems = []

            if (this.grocery_list.id==this.list_id) {    
                for (let j=0; j < this.grocery_list.item_info.length; j++)  {
                    if (this.grocery_list.item_info[j].complete) {
                    completeItems.push(this.grocery_list.item_info[j])
                    }
                }
            }

            return completeItems
        },
        options: function() {
            // loadLists runs on created and returns all grocery lists into list_options for the logged in user.
            // Use list_options to build options for grocery list select box.

            let options = []
            for (let i=0; i < this.list_options.length; i++) {
                options.push({id: this.list_options[i].id, list_name: this.list_options[i].list_name})
            }
            console.log('options: ', options)
            return options
        }
    }, 
    created: function() {
        this.loadCurrentUser()
        this.loadLists()
        // this.loadGroceryList()
    },
    mounted: function() {
        this.csrfToken = document.querySelector("input[name=csrfmiddlewaretoken]").value
    }
})