import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import jsTPS from '../common/jsTPS'
import api from '../api'
import MoveItem_Transaction from '../transactions/MoveItem_Transaction'
import UpdateItem_Transaction from '../transactions/UpdateItem_Transaction'
import AuthContext from '../auth'
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    UNMARK_LIST_FOR_DELETION: "UNMARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_ITEM_EDIT_ACTIVE: "SET_ITEM_EDIT_ACTIVE",
    UPDATE_COMMENTS : "UPDATE_COMMENTS",
    CLEAR: "CLEAR"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        listNameActive: false,
        itemActive: false,
        listMarkedForDeletion: null,
        viewMode : 1
    });
    const history = useHistory();

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.top5List,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    viewMode : store.viewMode
                });
            }
            case GlobalStoreActionType.UPDATE_COMMENTS: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    viewMode : store.viewMode
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    viewMode : store.viewMode
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter + 1,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    viewMode : store.viewMode
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    viewMode : store.viewMode
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: payload,
                    viewMode : store.viewMode
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.UNMARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    viewMode : store.viewMode
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    viewMode : store.viewMode
                });
            }
            // START EDITING A LIST ITEM
            case GlobalStoreActionType.SET_ITEM_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: true,
                    listMarkedForDeletion: null,
                    viewMode : store.viewMode
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.CLEAR: {
                return setStore({
                    idNamePairs: null,
                    currentList: null,
                    newListCounter: 0,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    viewMode : store.viewMode
                });
            }
            default:
                return store;
        }
    }

    store.clearHome = function (){
        storeReducer({
            type: GlobalStoreActionType.CLEAR
        });
    }

    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = async function (id, newName) {
        let response = await api.getTop5ListById(id);
        if (response.data.success) {
            let top5List = response.data.top5List;
            top5List.name = newName;
            async function updateList(top5List) {
                response = await api.updateTop5ListById(top5List._id, top5List);
                if (response.data.success) {
                    async function getListPairs(top5List) {
                        response = await api.getTop5ListPairs(auth.user.email);
                        if (response.data.success) {
                            let pairsArray = response.data.idNamePairs;
                            storeReducer({
                                type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                payload: {
                                    idNamePairs: pairsArray,
                                    top5List: top5List
                                }
                            });
                        }
                    }
                    getListPairs(top5List);
                }
            }
            updateList(top5List);
        }
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
        
        tps.clearAllTransactions();
        history.push("/");
    }

    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function () {
        let newListName = "Untitled" + store.newListCounter;
        let payload = {
            name: newListName,
            items: ["", "", "", "", ""],
            ownerEmail: auth.user.email,
            views:0,
            published:false,
            likedBy:[],
            dislikedBy:[],
            ownedBy: auth.user.firstName+" " +auth.user.lastName,
            publishDate: "N/A",
            votes:[]
        };
        const response = await api.createTop5List(payload);
        if (response.data.success) {
            tps.clearAllTransactions();
            let newList = response.data.top5List;
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: newList
            }
            );

            // IF IT'S A VALID LIST THEN LET'S START EDITING IT
            history.push("/top5list/" + newList._id);
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }

    store.getAllLists1 = async function(partition){
        const response = await api.getAllTop5Lists();
        let partitio;
        if(partition){
            partitio = partition.toLowerCase();
        }
        if (response.data.success) {
            let pairsArray = response.data.data;
            for(let i = 0;i<pairsArray.length;i++)
            {
                if (!(pairsArray[i].ownerEmail == auth.user.email)) {
                    pairsArray.splice(i, 1);
                    i-=1;
                }
            }
            if(partitio){
                for(let i = 0;i<pairsArray.length;i++)
                {
                    if (!pairsArray[i].name.toLowerCase().includes(partitio)) {
                        pairsArray.splice(i, 1);
                        i-=1;
                    }
                }
            }

            storeReducer({
                type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                payload: pairsArray
            });
            console.log(this.idNamePairs)
        }
        else {
            console.log("API FAILED TO GET ALL THE LIST PAIRS");
        }
    }


    store.getAllLists2 = async function(partition){
        const response = await api.getAllTop5Lists();
        let partitio;
        if(partition){
            partitio = partition.toLowerCase();
        }
        if (response.data.success) {
            let pairsArray = response.data.data;
            for(let i = 0;i<pairsArray.length;i++)
            {
                if (!pairsArray[i].published || pairsArray[i].ownedBy == "Community") {
                    pairsArray.splice(i, 1);
                    i-=1;
                }
            }
            if(partitio){
                for(let i = 0;i<pairsArray.length;i++)
                {
                    if (!pairsArray[i].name.toLowerCase().includes(partitio)) {
                        pairsArray.splice(i, 1);
                        i-=1;
                    }
                }
            }

            storeReducer({
                type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                payload: pairsArray
            });
            console.log(this.idNamePairs)
        }
        else {
            console.log("API FAILED TO GET ALL THE LIST PAIRS");
        }
    }

    store.getAllLists3 = async function(user){
        const response = await api.getAllTop5Lists();
        if (response.data.success) {
            let pairsArray = response.data.data;
            for(let i = 0;i<pairsArray.length;i++)
            {
                if (!pairsArray[i].published) {
                    pairsArray.splice(i, 1);
                    i-=1;
                }
            }
            for(let i = 0;i<pairsArray.length;i++)
            {
                if (pairsArray[i].ownerEmail != user) {
                    pairsArray.splice(i, 1);
                    i-=1;
                }
            }

            storeReducer({
                type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                payload: pairsArray
            });
            console.log(this.idNamePairs)
        }
        else {
            console.log("API FAILED TO GET ALL THE LIST PAIRS");
        }
    }

    store.getAllLists4 = async function(name){
        const response = await api.getAllTop5Lists();
        if (response.data.success) {
            let pairsArray = response.data.data;
            for(let i = 0;i<pairsArray.length;i++)
            {
                if (!pairsArray[i].published) {
                    pairsArray.splice(i, 1);
                    i-=1;
                }
            }
            for(let i = 0;i<pairsArray.length;i++)
            {
                if (pairsArray[i].ownedBy != "Community") {
                    pairsArray.splice(i, 1);
                    i-=1;
                }
            }
            let partitio;
            if(name){
                partitio = name.toLowerCase();
            }
            if(partitio){
                for(let i = 0;i<pairsArray.length;i++)
                {
                    if (!pairsArray[i].name.toLowerCase().includes(partitio)) {
                        pairsArray.splice(i, 1);
                        i-=1;
                    }
                }
            }
            storeReducer({
                type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                payload: pairsArray
            });
            console.log(this.idNamePairs)
        }
        else {
            console.log("API FAILED TO GET ALL THE LIST PAIRS");
        }
    }
    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = async function () {
        const response = await api.getTop5ListPairs(auth.user.email);
        if (response.data.success) {
            let pairsArray = response.data.idNamePairs;
       
            const thePairs = [];
            for(let i = 0;i<pairsArray.length;i++)
            {
                let response1 = await api.getTop5ListById(pairsArray[i]._id);
                if(response1.data.success){
                    thePairs.push(response1.data.top5List);
                }
            }
            storeReducer({
                type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                payload: thePairs
            });
            console.log(this.idNamePairs)
        }
        else {
            console.log("API FAILED TO GET THE LIST PAIRS");
        }
        
    }


    // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // showDeleteListModal, and hideDeleteListModal
    store.markListForDeletion = async function (id) {
        // GET THE LIST
        let response = await api.getTop5ListById(id);
        if (response.data.success) {
            let top5List = response.data.top5List;
            storeReducer({
                type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                payload: top5List
            });
        }
    }

    store.deleteList = async function (listToDelete) {
        let response = await api.deleteTop5ListById(listToDelete._id);
        if (response.data.success) {
            store.loadIdNamePairs();
            history.push("/");
        }
    }

    store.deleteMarkedList = function () {
        store.deleteList(store.listMarkedForDeletion);
    }

    store.unmarkListForDeletion = function () {
        storeReducer({
            type: GlobalStoreActionType.UNMARK_LIST_FOR_DELETION,
            payload: null
        });
    }

    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
    store.setCurrentList = async function (id) {
        let response = await api.getTop5ListById(id);
        if (response.data.success) {
            let top5List = response.data.top5List;

            response = await api.updateTop5ListById(top5List._id, top5List);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: top5List
                });
                history.push("/top5list/" + top5List._id);
            }
        }
    }

    store.getT5L = async function (id) {
        let response = await api.getTop5ListById(id);
        return response.data.top5List.items;
    }

    store.addMoveItemTransaction = function (start, end) {
        let transaction = new MoveItem_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }

    store.addUpdateItemTransaction = function (index, newText) {
        let oldText = store.currentList.items[index];
        let transaction = new UpdateItem_Transaction(store, index, oldText, newText);
        tps.addTransaction(transaction);
    }

    store.moveItem = function (start, end) {
        start -= 1;
        end -= 1;
        if (start < end) {
            let temp = store.currentList.items[start];
            for (let i = start; i < end; i++) {
                store.currentList.items[i] = store.currentList.items[i + 1];
            }
            store.currentList.items[end] = temp;
        }
        else if (start > end) {
            let temp = store.currentList.items[start];
            for (let i = start; i > end; i--) {
                store.currentList.items[i] = store.currentList.items[i - 1];
            }
            store.currentList.items[end] = temp;
        }

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }

    store.updateItem = function (index, newItem) {
        store.currentList.items[index] = newItem;
        store.updateCurrentList();
    }

    store.updateCurrentList = async function () {
        const response = await api.updateTop5ListById(store.currentList._id, store.currentList);
        if (response.data.success) {
            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_LIST,
                payload: store.currentList
            });
        }
    }

    store.updateListPairs = async function (id) {
        let i = 0
        for(i = 0;i<store.idNamePairs.length;i++)
        {
            if(store.idNamePairs[i]._id == id)
                break;
        }
        const response = await api.updateTop5ListById(id, store.idNamePairs[i]);
        if (response.data.success) {
           storeReducer({
                type:GlobalStoreActionType.UPDATE_COMMENTS
           })
        }
    }

    store.updateComm = async function (id) {
        let i = 0
        let name = this.currentList.name
        for(i = 0;i<store.idNamePairs.length;i++)
        {
            if(store.idNamePairs[i]._id == id)
                break;
        }
        const response = await api.updateTop5ListById(id, store.idNamePairs[i]);
        if (response.data.success) {
           storeReducer({
                type:GlobalStoreActionType.UPDATE_COMMENTS
           })
           store.makeComm(name);
        }
    }

    store.updateCommD = async function (list) {
        let name = list.name;
        let response = await api.deleteTop5ListById(list._id);
        if (response.data.success) {
            store.loadIdNamePairs();
            history.push("/");
        }
        store.makeComm(name);
    }

    store.makeComm = async function(name){
        let response = await api.updateCommunityLists(name);
        console.log(response)
    }

    store.undo = function () {
        tps.undoTransaction();
    }

    store.redo = function () {
        tps.doTransaction();
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING AN ITEM
    store.setIsItemEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_ITEM_EDIT_ACTIVE,
            payload: null
        });
    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };