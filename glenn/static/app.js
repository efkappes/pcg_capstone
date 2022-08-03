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
                <input type="text" v-model="item.item_name">
                <input type="text" v-model="item.item_note">
                <button @click="saveGroceryItem(item)">Save</button>
            </div>
            <div v-else>
                <div class='item-row'>
                    <div class='item-row-left'>
                        <ul>(aisle {{ item.aisle }})</ul>
                        <ul><input type="checkbox" v-model="item.complete" @click="toggleGroceryItem(item)"></ul>
                        <ul>{{ item.item_name }}</ul>
                    </div>
                    <div class='item-row-right'>
                        <ul><em>({{ item.item_note }})</em></ul>
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
        // this method returns all the items and list info for a *specific* grocery list for the current user
        // loadGroceryList: function(filter_listid) {   KEEP COMMENTED OUT...OLDER
        loadGroceryList: function(list_id) {  //PUT THIS BACK IN 
        // loadGroceryList: function() {       ***** TEST *****
                // console.log('inside loadGroceryList, listid input parm: ', listid)  KEEP COMMENTED OUT
            // REPLACE filter_listid WITH list_id ****** TEST ******

            axios({
                method: 'get',
                // url: `api/v1/grocery_list_and_items/${filter_listid}/`      KEEP COMMENTED OUT     
                url: `api/v1/grocery_list_and_items/${list_id}/`       //PUT THIS BACK IN
                // url: 'api/v1/grocery_list_and_items/'         ***** TEST *****
            }).then(response => {
                this.grocery_list = response.data
                this.list_id = response.data.id
                console.log('loadGroceryList response.data: ', response.data)
                console.log('loadGroceryList this.grocery_list: ', this.grocery_list)
                console.log('loadGroceryList this.list_id: ', this.list_id)
            }).catch(error => {
                console.log(error)
                console.log(error.response_data)
            })
        },
        // this method returns all the items and list info for *all* the lists for the current user
        loadLists: function() {
            axios({
                method: 'get',
                url: 'api/v1/grocery_list_and_items/'               
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
                // data: {
                //     "id": item.id,
                //     "list_id": item.list_id,
                //     "item_name": item.item_name,                                    
                //     "aisle": item.aisle,                            
                //     "usual": item.usual,                            
                //     "item_note": item.item_note,                            
                //     "complete": item.complete                            
                // }
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
            console.log('inside toggleGroceryItem, item.complete: ' + item.complete)
            console.log('inside toggleGroceryItem, this.item.complete: ' + this.item.complete)
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
                this.loadLists()
                // this.loadGroceryList()
            })            
        },
        addGroceryListItem: function(list_id) {
            // item_name = this.newGroceryItem.item_name

            //first look up aisle info for the given item name, then add item to grocery list
            // axios({
            //     method: 'get',
            //     url: `api/v1/aisle_info/${item_name}/`               
            // }).then(response => {
            //     this.aisle = response.data.aisle
            //     console.log(response.data)
            //     console.log(this.aisle)
            // }).catch(error => {
            //     console.log(error)
            //     console.log(error.response_data)
            // }).then
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
        }
    },
    computed: {
        incompleteItems: function() {
            console.log('inside incompleteItems')
            console.log('inside incompleteItems, this.grocery_list: ', this.grocery_list)
            console.log('inside incompleteItems, this.list_id: ', this.list_id)
            console.log('inside incompleteItems, this.grocery_list.length: ', this.grocery_list.length)

            let incompleteItems = []
            // for (let i=0; i < this.grocery_list.length; i++) {  
            //     // console.log('inside incompleteItems, this.grocery_list[i].id: ', this.grocery_list[i].id)
            //     if (this.grocery_list[i].id==this.list_id) {    
            //             // console.log('inside incompleteItems outer loop, this.grocery_list[i].id: ', this.grocery_list[i].id)
            //             for (let j=0; j < this.grocery_list[i].item_info.length; j++)  {
            //             if (!this.grocery_list[i].item_info[j].complete) {
            //                 // console.log('incomplete grocery item: ', this.grocery_list[i].item_info[j])
            //                 incompleteItems.push(this.grocery_list[i].item_info[j])
            //             }
            //         }
            //     }
            // }
                // console.log('inside incompleteItems, this.grocery_list[i].id: ', this.grocery_list[i].id)

            if (this.grocery_list.id==this.list_id) {    
                for (let j=0; j < this.grocery_list.item_info.length; j++)  {
                    if (!this.grocery_list.item_info[j].complete) {
                        incompleteItems.push(this.grocery_list.item_info[j])
                    }
                }
            }

            return incompleteItems

            // return this.grocery_list.filter(function(item_info) {
            //     return !item_info.complete
            // })
        }, 
        completeItems: function() {
            console.log('inside completeItems')

            let completeItems = []
            // for (let i=0; i < this.grocery_list.length; i++) {
            //     if (this.grocery_list[i].id==this.list_id) {
            //             for (let j=0; j < this.grocery_list[i].item_info.length; j++)  {
            //             if (this.grocery_list[i].item_info[j].complete) {
            //                 // console.log('completed grocery item: ', this.grocery_list[i].item_info[j])
            //                 completeItems.push(this.grocery_list[i].item_info[j])
            //             }
            //         }
            //     }
            // }

            if (this.grocery_list.id==this.list_id) {    
                for (let j=0; j < this.grocery_list.item_info.length; j++)  {
                    if (this.grocery_list.item_info[j].complete) {
                    completeItems.push(this.grocery_list.item_info[j])
                    }
                }
            }

            return completeItems

            // return this.grocery_list.filter(function(item) {
            //     return item.complete
            // })
        },
        options: function() {
            // loadLists runs on created and returns all grocery lists into list_options for the logged in user.
            // Use list_options to build options for grocery list select box.

            let options = []
            for (let i=0; i < this.list_options.length; i++) {
                // options.push(this.list_options[i].id, this.list_options[i].list_name)
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