import { useContext, useState } from 'react'
import Top5Item from './Top5Item.js'
import List from '@mui/material/List';
import { Typography } from '@mui/material'
import { GlobalStoreContext } from '../store/index.js'
import { Box } from '@mui/system';
import { Date } from 'mongoose';
import api from '../api';
import { Button } from '@mui/material';
/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
*/
function WorkspaceScreen() {
    const { store } = useContext(GlobalStoreContext);
    const [text, setText] = useState(store.currentList.name);


    function handleChange(e) {
        setText(e.target.value)
    }

    function canPublish()
    {
            for(let i = 0;i<5;i++)
            {
                for(let j = (i+1);j<5;j++)
                {
                    if(store.currentList.items[i].toUpperCase() === store.currentList.items[j].toUpperCase())
                    {
                        return false;
                    }
                }
            }
            for(let j = 0;j<5;j++)
            {
                if(store.currentList.items[j].toUpperCase() == "")
                {
                    return false;
                }
            }
            for(let i = 0;i<store.idNamePairs.length;i++)
            {
                if(store.idNamePairs[i]._id !== store.currentList._id)
                {
                    if(store.idNamePairs[i].name == store.currentList.name)
                    {
                        return false;
                    }
                }
            }
            
        return true;
    }

    function doPublish()
    {
        let list;
        for(let i = 0;i<store.idNamePairs.length;i++)
        {
            if(store.idNamePairs[i]._id == store.currentList._id){
                list = store.idNamePairs[i];
                break;
            }
        }
        list.published = true;
        var today = new window.Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        console.log(date)
        list.publishDate = date;
        store.updateComm(store.currentList._id);
        store.closeCurrentList();
    }

    function keyPress(event)
    {
        event.stopPropagation();
        if(event.code == "Enter")
        {
            event.target.blur()
        }
    }

    function saveList(event)
    {
        event.stopPropagation()
        store.currentList.name = text;
        store.updateCurrentList();
        store.closeCurrentList();
    }

    let editItems = "";
    if (store.currentList) {
        editItems = 
            <List id="edit-items" sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {
                    store.currentList.items.map((item, index) => (
                        <Top5Item 
                            key={'top5-item-' + (index+1)}
                            text={item}
                            index={index} 
                        />
                    ))
                }
            </List>;
    }
    return (
        <div id="top5-workspace" style={{backgroundColor:"white"}}>
            <input type = "text" value = {text} onChange = {handleChange} onKeyDown = {keyPress} style = {{width : "60%"}}></input>
            <div id="workspace-edit">
                <div id="edit-numbering">
                    <div className="item-number"><Typography variant="h3">1.</Typography></div>
                    <div className="item-number"><Typography variant="h3">2.</Typography></div>
                    <div className="item-number"><Typography variant="h3">3.</Typography></div>
                    <div className="item-number"><Typography variant="h3">4.</Typography></div>
                    <div className="item-number"><Typography variant="h3">5.</Typography></div>
                </div>
                {editItems}
            </div>
            <div><Button style={{marginTop: "45%",zIndex:"999",backgroundColor:"black"}} onClick = {saveList}>save</Button>
               {canPublish()?<Button style={{marginTop: "45%",zIndex:"999",backgroundColor:"black"}} onClick = {doPublish}>publish</Button>:
               <Button style={{marginTop: "45%",zIndex:"999",backgroundColor:"red"}}>publish</Button>}
            </div>
        </div>
    )
}

export default WorkspaceScreen;