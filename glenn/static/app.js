Vue.component('grocery-item', {
    data: function() {
        return {
            editMode: false
        }
    },
    props: ['item', 'item_info'],
    template: `
        <li>
            <div v-if="editMode">
                <input type="text" v-model="item[0].item_name">
                <input type="text" v-model="item[0].item_note">
                <button @click="saveGroceryItem(item)">Save</button>
            </div>
            <div v-else>
                <div class='item-row'>
                    <div class='item-row-left'>
                        <ul>(aisle {{ item[0].aisle }})</ul>
                        <ul><input type="checkbox" v-model="item.complete" @click="toggleGroceryItem(item)"></ul>
                        <ul>{{ item[0].item_name }}</ul>
                    </div>
                    <div class='item-row-right'>
                        <ul><em>({{ item[0].item_note }})</em></ul>
                        <ul><button @click="editMode=true">Edit</button></ul>
                        <ul><button @click="removeGroceryItem(item)">×</button></ul>
                    </div>
                </div>
            </div>  
        </li>
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


//<div v-if (item[0].item_note.length)>


// Vue.component('add-favorite-list', {
//     data: function() {
//         return {
//             list_name: "",
//         }
//     },
//     props: ['grocery_list'],
//     template: `
//         <div>
//             <input type="text" placeholder="List Name" v-model="list_name">
//             <button @click="addFaveListContent">Add List to Favorites</button>
//         </div>
//     `,
//     methods: {
//         addFaveListContent: function() {
//             this.$emit('add-fave-list', this.grocery_list)
//         }
//     }
// })


// Vue.component('favorite-list', {
//     data: function() {
//         return {
//             list_name: "",
//         }
//     },
//     props: ['favorite_list'],
//     template: `
//         <div>
//             <input type="text" placeholder="List Name" v-model="list_name">
//             <button @click="addFavoriteList">Add List to Favorites</button>
//         </div>
//     `,
//     methods: {
//         addFavoriteList: function(grocery_list) {
//             this.$emit('add-fave-list', grocery_list)
//         }
//     }
// })


const vm = new Vue({
    el: "#app",
    delimiters: ['[[',']]'],
    data: {
        csrfToken: "",
        grocery_list: [],
        currentUser: {},    
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
        list_name: "",
        item_info: []
        // incompleteItems: [],
        // completeItems: []
    },
    methods: {
        loadGroceryList: function() {
            // this.grocery_list = {}
            console.log('inside loadGroceryList')
            axios({
                method: 'get',
                url: 'api/v1/grocery_list_and_items/'               
                // url: 'api/v1/grocery_list/'
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
        saveGroceryItem: function(item) {
            // console.log('inside saveGroceryItem , item: ' + item)
            // console.log('inside saveGroceryItem, item.id: ' + this.item.id)
            // console.log('inside saveGroceryItem, id: ' + this.id)
            axios({
                method: 'patch',
                // url: `api/v1/grocery_list/${item.id}/`,
                url: `api/v1/grocery_list_items/${item.id}/`,
                headers: {
                    'X-CSRFToken': this.csrfToken
                },
                data: item
                // data: {
                //     "list_id": this.list_id,
                //     "item_name": this.item.item_name,                                    
                //     "item_note": this.newGroceryItem.item_note,                            
                //     "complete": this.newGroceryItem.complete                            
                // }
            }).then(response => {
                this.loadGroceryList()
            })
        },
        removeGroceryItem: function(item) {
            axios({
                method: 'delete',
                // url: `api/v1/grocery_list/${item.id}/`,
                url: `api/v1/grocery_list_items/${item.id}/`,
                headers: {
                    'X-CSRFToken': this.csrfToken
                }
            }).then(response => {
                this.loadGroceryList()
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
                // this.loadGroceryList()
            })            
        },
        addGroceryListItem: function(list_id) {
            axios({
                method: 'post',
                url: 'api/v1/grocery_list_items/',
                headers: {
                    'X-CSRFToken': this.csrfToken
                },
                data: {
                    "list_id": this.list_id,
                    "item_name": this.newGroceryItem.item_name,                                    
                    "aisle": this.newGroceryItem.aisle,                            
                    "usual": this.newGroceryItem.usual,                            
                    "item_note": this.newGroceryItem.item_note,                            
                    "complete": this.newGroceryItem.complete                            
                }
            }).then(response => {
                this.loadGroceryList()
                this.newGroceryItem = {
                    "item_name": "",
                    "usual": false,
                    "item_note": "",
                    "complete": false
                }
            })            
        }
        // addGroceryListContent: function() {
        //     this.addGroceryList()
        //     this.addGroceryListItems()
        // }
    },
    computed: {
        incompleteItems: function() {
            console.log('inside incompleteItems')
            console.log('this.list_id:' + this.list_id)
            console.log('this.grocery_list.id:' + this.grocery_list.id)
            console.log('list length' + this.grocery_list.length)

            let incompleteItems = []
            for (let i=0; i < this.grocery_list.length; i++) {
                if (this.grocery_list[i].id==this.list_id) {
                    if (!this.grocery_list[i].completed) {
                        incompleteItems.push(this.grocery_list[i].item_info)
                    }
                }
            }
            return incompleteItems
            // return this.incompleteItems

            // return this.grocery_list.filter(function(item_info) {
            //     return !item_info.complete
            // })
        }, 
        completeItems: function() {
            console.log('inside completeItems')

            let completeItems = []
            for (let i=0; i < this.grocery_list.length; i++) {
                if (this.grocery_list[i].id==this.list_id) {
                    if (this.grocery_list[i].completed) {
                        completeItems.push(this.grocery_list[i].item_info)
                    }
                }
            }
            return completeItems

            // return this.grocery_list.filter(function(item) {
            //     return item.complete
            // })
        }
    }, 
    created: function() {
        this.loadCurrentUser()
        // this.loadGroceryList()
    },
    mounted: function() {
        this.csrfToken = document.querySelector("input[name=csrfmiddlewaretoken]").value
    }
})